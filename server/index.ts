import express from 'express';
import http from 'http';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { store } from './store';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

app.use(cors());
app.use(express.json());

// Active WebSocket connections
const clients = new Set<WebSocket>();

wss.on('connection', (ws) => {
  clients.add(ws);
  // Send initial handshake
  ws.send(JSON.stringify({ type: 'CONNECTED', timestamp: Date.now() }));

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      // Re-broadcast client events if needed
      broadcast(data.type, data.payload, ws);
    } catch (err) {
      console.error('WS message error:', err);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

export function broadcast(type: string, payload: any, senderWs?: WebSocket) {
  const message = JSON.stringify({ type, payload, timestamp: Date.now() });
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN && client !== senderWs) {
      client.send(message);
    }
  }
}

// --- REST API ENDPOINTS ---

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Users
app.get('/api/users', (req, res) => {
  res.json(Array.from(store.users.values()));
});

app.get('/api/users/:id', (req, res) => {
  const user = store.users.get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

// Hotspots
app.get('/api/hotspots', (req, res) => {
  res.json(Array.from(store.hotspots.values()));
});

app.post('/api/hotspots/:id/wait', (req, res) => {
  const hotspot = store.hotspots.get(req.params.id);
  if (!hotspot) return res.status(404).json({ error: 'Hotspot not found' });
  const { userId, delta = 1 } = req.body;
  hotspot.waitingCount = Math.max(0, hotspot.waitingCount + delta);

  broadcast('HOTSPOT_UPDATE', hotspot);
  res.json(hotspot);
});

// Rides
app.get('/api/rides', (req, res) => {
  res.json(Array.from(store.rides.values()));
});

app.get('/api/rides/:id', (req, res) => {
  const ride = store.rides.get(req.params.id);
  if (!ride) return res.status(404).json({ error: 'Ride not found' });
  res.json(ride);
});

app.patch('/api/rides/:id', (req, res) => {
  const ride = store.rides.get(req.params.id);
  if (!ride) return res.status(404).json({ error: 'Ride not found' });

  Object.assign(ride, req.body);
  broadcast('RIDE_UPDATED', ride);
  res.json(ride);
});

// Predictions
app.get('/api/predictions/:userId', (req, res) => {
  const userPredictions = Array.from(store.predictions.values()).filter(
    (p) => p.userId === req.params.userId
  );
  res.json(userPredictions);
});

app.post('/api/predictions/:id/confirm', (req, res) => {
  const pred = store.predictions.get(req.params.id);
  if (!pred) return res.status(404).json({ error: 'Prediction not found' });
  pred.status = 'confirmed';
  broadcast('PREDICTION_CONFIRMED', pred);
  res.json(pred);
});

app.post('/api/predictions/:id/skip', (req, res) => {
  const pred = store.predictions.get(req.params.id);
  if (!pred) return res.status(404).json({ error: 'Prediction not found' });
  pred.status = 'skipped';
  broadcast('PREDICTION_SKIPPED', pred);
  res.json(pred);
});

app.post('/api/predictions/nightly-run', (req, res) => {
  // Trigger simulation of nightly clustering
  const count = store.predictions.size;
  broadcast('NIGHTLY_JOB_COMPLETE', { predictionsCalculated: count });
  res.json({ message: 'Nightly predictions generated', count });
});

// Pods
app.get('/api/pods', (req, res) => {
  res.json(Array.from(store.pods.values()));
});

app.post('/api/pods/:id/standby', (req, res) => {
  const pod = store.pods.get(req.params.id);
  if (!pod) return res.status(404).json({ error: 'Pod not found' });
  const { cancelledUserId, reason } = req.body;

  // Substitute from standby candidate if available
  if (pod.standbyCandidates.length > 0) {
    const substitute = pod.standbyCandidates.shift()!;
    const memberIndex = pod.members.findIndex((m) => m.userId === cancelledUserId);
    if (memberIndex !== -1) {
      pod.members[memberIndex] = {
        userId: substitute.userId,
        name: substitute.name,
        avatar: `/demo/avatars/${substitute.name.toLowerCase().split(' ')[0]}.svg`,
        tier: substitute.tier,
        role: 'passenger',
        drivingDays: [],
      };
    }
  }

  broadcast('POD_UPDATED', pod);
  res.json(pod);
});

// Wallets
app.get('/api/wallets/:userId', (req, res) => {
  let wallet = store.wallets.get(req.params.userId);
  if (!wallet) {
    wallet = { userId: req.params.userId, balance: 100, ledger: [] };
    store.wallets.set(req.params.userId, wallet);
  }
  res.json(wallet);
});

app.post('/api/wallets/:userId/topup', (req, res) => {
  let wallet = store.wallets.get(req.params.userId);
  if (!wallet) {
    wallet = { userId: req.params.userId, balance: 0, ledger: [] };
    store.wallets.set(req.params.userId, wallet);
  }
  const amount = Number(req.body.amount) || 100;
  wallet.balance += amount;
  wallet.ledger.unshift({
    id: `tx-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    description: 'Mock UPI Top-up',
    amount: amount,
    type: 'topup',
  });
  broadcast('WALLET_UPDATED', wallet);
  res.json(wallet);
});

// Journey Pass issuance and verification
app.post('/api/journey-pass', (req, res) => {
  const { passengerId, legs } = req.body;
  const pass = store.createJourneyPass(passengerId, legs);
  broadcast('PASS_CREATED', pass);
  res.json(pass);
});

app.get('/api/journey-pass/:id', (req, res) => {
  const pass = store.journeyPasses.get(req.params.id);
  if (!pass) return res.status(404).json({ error: 'Pass not found' });
  res.json(pass);
});

app.post('/api/journey-pass/:id/refresh', (req, res) => {
  try {
    const pass = store.refreshJourneyPass(req.params.id);
    broadcast('PASS_REFRESHED', pass);
    res.json(pass);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/journey-pass/scan', (req, res) => {
  const { token, riderId, assignedRideId, coPresenceCheckPassed = true } = req.body;
  const { result, pass } = store.scanJourneyPass(token, riderId, assignedRideId, coPresenceCheckPassed);

  broadcast('PASS_SCANNED_EVENT', { result, passId: pass?.id, riderId });
  res.json({ result, pass });
});

app.post('/api/journey-pass/accept', (req, res) => {
  const { passId, nonce, rideId } = req.body;
  const outcome = store.acceptPassengerBoarding(passId, nonce, rideId);
  if (outcome.success) {
    broadcast('RIDE_UPDATED', outcome.ride);
    broadcast('PASS_ACCEPTED', { passId, rideId });
    res.json(outcome);
  } else {
    res.status(400).json({ error: 'Could not accept boarding' });
  }
});

// SOS Network
app.post('/api/sos/trigger', (req, res) => {
  const { senderId, rideId, lat, lng } = req.body;
  const alert = store.triggerSOS(senderId, rideId, lat, lng, () => {
    broadcast('SOS_ESCALATED', { alertId: alert.id, tierLevel: 2 });
  });

  broadcast('SOS_TRIGGERED', alert);
  res.json(alert);
});

app.post('/api/sos/:id/acknowledge', (req, res) => {
  const { responderId } = req.body;
  const alert = store.acknowledgeSOS(req.params.id, responderId);
  if (!alert) return res.status(404).json({ error: 'Alert not active or not found' });

  broadcast('SOS_ACKNOWLEDGED', alert);
  res.json(alert);
});

app.post('/api/sos/:id/end', (req, res) => {
  const ended = store.endSOS(req.params.id);
  broadcast('SOS_ENDED', { alertId: req.params.id });
  res.json({ success: ended });
});

app.get('/api/sos/active', (req, res) => {
  const active = Array.from(store.activeSOS.values()).filter((a) => a.active);
  res.json(active);
});

// SMS dev inbox & sandbox OTP
app.get('/api/sms-inbox', (req, res) => {
  res.json(store.smsDevInbox);
});

// Moderator queue & audit log
app.get('/api/cases', (req, res) => {
  res.json(Array.from(store.cases.values()));
});

app.post('/api/cases/:id/review', (req, res) => {
  const c = store.cases.get(req.params.id);
  if (!c) return res.status(404).json({ error: 'Case not found' });
  const { moderatorId, moderatorName, action, notes } = req.body;

  // Conflict of interest check (PRD §3.9)
  if (c.conflictPodId) {
    const pod = store.pods.get(c.conflictPodId);
    if (pod?.members.some((m) => m.userId === moderatorId)) {
      return res.status(403).json({
        error: 'Conflict of interest: You cannot review cases involving members of your own pod.',
      });
    }
  }

  c.status = action;
  const auditEntry = {
    id: `audit-${Date.now()}`,
    moderatorId,
    moderatorName,
    caseId: c.id,
    action: `Case ${c.id} marked as ${action}`,
    timestamp: new Date().toISOString(),
    notes,
  };
  store.auditLog.unshift(auditEntry);

  broadcast('CASE_REVIEWED', { case: c, auditEntry });
  res.json({ case: c, auditEntry });
});

app.get('/api/audit-log', (req, res) => {
  res.json(store.auditLog);
});

// Dev panel simulation helpers
app.post('/api/dev/reset', (req, res) => {
  store.resetToSeed();
  broadcast('DATA_RESET', { message: 'Demo data reset' });
  res.json({ success: true, message: 'Seeded data restored' });
});

app.post('/api/dev/simulate-gps', (req, res) => {
  const { rideId, lat, lng, isDeviation = false } = req.body;
  const ride = store.rides.get(rideId);
  if (!ride) return res.status(404).json({ error: 'Ride not found' });

  ride.currentRiderPosition = { lat, lng };
  broadcast('LOCATION_PING', { rideId, lat, lng, isDeviation });

  if (isDeviation) {
    broadcast('CHECKIN_PROMPT', {
      rideId,
      reason: 'Route deviation > 300m detected',
      timestamp: Date.now(),
    });
  }

  res.json({ success: true, position: ride.currentRiderPosition, isDeviation });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`[CommuteCircle Server] running on http://localhost:${PORT} with WebSocket on /ws`);
});
