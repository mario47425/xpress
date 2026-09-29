# CommuteCircle — Dual-Portal Peer-to-Peer Ride Sharing PWA

> **City:** Chennai, Tamil Nadu (Map Centre: 13.0827, 80.2707)  
> **Tech Stack:** React 18, Vite, TypeScript, TailwindCSS, Zustand, Leaflet (Dark OSM Tiles), ES256 Signed JWT, WebSockets, Express.  
> **Design Philosophy:** Sometype Mono typography, tactical dark theme, glanceable monospace numerals, token-driven CSS (`--cc-*`), 100% mobile-first.

---

## 1. Quick Start (Zero Setup, No API Keys Required)

Clone the repository and run:

```bash
npm install
npm run dev
```

This single command starts:
1. **Frontend Vite Dev Server:** `http://localhost:5173`
2. **Local Node Backend & WebSocket Hub:** `http://localhost:3001` (WebSocket at `/ws`)

To run the automated validation test suite:
```bash
npm run test
```

---

## 2. Portals & Demo Logins

CommuteCircle provides two mobile-first portals in one unified codebase with instant role-switching:

| Portal | URL Path | Demo Persona | Details |
|---|---|---|---|
| **Peer Booking Portal** | `http://localhost:5173/app` | **Anitha Ramesh** | Passenger side (`Trusted` tier, 78 score). Owns Relay Mode & Journey Pass QR. |
| **Rider Portal** | `http://localhost:5173/rider` | **Karthik Subramanian** | Vehicle owner side (`Verified Guardian`, 88 score, Honda City `TN 09 AB 4821`). Owns QR Scanner & Cost Recovery. |
| **Community Moderator** | `http://localhost:5173/moderator` | **Meenakshi Sundaram** | Top tier (`Community Anchor`, 94 score). Reviews flagged rides, disputes, and audit log. |

*Tip:* Open two browser windows side by side (at mobile resolution 390×844 or resized to phone viewports) to watch real-time SafeTrail GPS streaming, QR handshakes, and SOS escalations synchronize live across passenger and rider devices via WebSockets.

---

## 3. Recommended 5-Minute Demo Script

Follow this step-by-step walkthrough to experience the complete peer-to-peer commute loop:

### Step 1: Predictive Commute Match
1. In Window 1, navigate to `http://localhost:5173/app` (Anitha Ramesh).
2. Notice tomorrow's **Ghost Commute Proposal Card**: `Tomorrow 08:10 · Velachery Bypass Junction → IIT Madras Main Gate [CONF 86%] · 3 riders · Rs 28`.
3. Click **Confirm**. The card updates to `RIDE PROPOSAL CONFIRMED ✓`.
4. In Window 2, navigate to `http://localhost:5173/rider` (Karthik Subramanian).
5. Notice the matching **Open Seats Card**: `Tomorrow 08:10 · You can carry 3 · Cost share Rs 84 of Rs 96 [CONF 82%]`.
6. Click **Open seats** and tap the **+1 Seat** high-demand nudge.

### Step 2: Safe Hotspot Handshake
1. In Window 1, tap **Go to Hotspot** (or navigate to `/app/waiting/hs-3`).
2. Notice the **100m geofence gate** ensuring safe pickup, estimated wait countdown (4 min), and approaching rider preview card.
3. Tap **Show Pickup QR Code** to reveal the **Journey Pass**:
   - High-contrast dedicated white QR tile (the only white surface in the app).
   - Letter-spaced short code fallback (`CC-4821`).
   - 30-second cryptographic auto-refresh with tick progress bar.
   - Screen wake lock keeps the screen illuminated.

### Step 3: Server-Verified QR Scan & Nonce Burn
1. In Window 2, tap **Open QR Scanner** (or navigate to `/rider/scanner`).
2. Point your camera at Window 1, or click **Valid** in the Sandbox Quick Scan Test bar.
3. The server validates the ES256 signature, co-presence distance, and verifies the rider is assigned to the leg in under 1 second.
4. Swipe **Accept Passenger Boarding**:
   - Server permanently **burns the single-use nonce** to prevent screenshot replay attacks.
   - Ride status advances to `VERIFIED` and `IN_TRANSIT`.
   - Window 1 (Passenger) displays a green checkmark and automatically navigates to **Live Ride**.
   - Window 2 (Rider) automatically navigates to **Active Drive**.

### Step 4: Live SafeTrail & Deviation Simulation
1. Observe the **SafeTrail Dark Map**:
   - Custom dark OSM tiles (`#0F1120`).
   - Teal-to-blue gradient route polyline (`--cc-route`).
   - White vehicle marker with soft glow and heading rotation.
   - Exact pickup point address revealed only now that the handshake has succeeded.
2. In the Dev Panel on desktop, click **Step Along Route** to simulate GPS waypoints.
3. Click **Trigger 400m Route Deviation**:
   - A soft check-in modal rises: `"We noticed a detour. Are you okay?"` with a 60-second countdown tick bar.
   - Tapping `"I'm Okay"` dismisses the warning.

### Step 5: Tiered Community SOS Escalation
1. On either phone screen, **press and hold the central red SOS Shield for 3 seconds** (or triple-tap).
2. The emergency broadcast triggers immediately:
   - SMS alert dispatched to trusted contacts.
   - Platform support notified in < 3 seconds.
   - Tier 1: Nearby Community Anchor moderators within 2 km alerted instantly.
   - Tier 2 countdown (60s) widens the alert to all nearby verified community members.
   - Live SOS Map pulses red at the alert origin and green responder dots light up as helpers acknowledge.
3. Switch user in the Dev Panel to **Meenakshi Sundaram** and navigate to `/sos/responder` to inspect the anonymous responder alert with one-touch **Call 112** instructions.

### Step 6: Relay Multimodal Planner & Pod Rotation
1. Navigate to `/app/relay` to inspect the multimodal graph search providing 3 commute options (**Fastest**, **Cheapest**, **Safest**) combining carpool, Chennai Metro Blue Line, and MTC Bus Route 570.
2. Navigate to `/app/pods` and `/rider/pods` to inspect the recurring pod rotation 7-day strip, savings trackers (Rs 3,840 saved, 54.2 kg CO₂ avoided), and standby substitute pool.
3. Navigate to `/rider/cost-recovery` to verify that total collected funds strictly comply with peer-to-peer carpooling cost caps (never earnings).

---

## 4. Known Limits & Roadmap (PRD Section 9)

1. **Hardware Power-Button SOS:** Web browsers cannot capture native hardware power button events. CommuteCircle provides a 3-second hold shield, triple-tap pattern, and phone shake detection. Native Android/iOS background power button listeners are scheduled for the Flutter mobile release.
2. **Background GPS with Locked Screen:** Modern mobile browsers throttle geolocation pings when the screen locks. CommuteCircle incorporates the Screen Wake Lock API during active trips to keep tracking live.
3. **Transit Ticketing:** In v1 prototype, MTC bus fares are paid onboard with geofence-assisted "Boarded" / "Alighted" check-ins. Official transit ticketing API integration is on the pilot roadmap.
4. **Emergency Services:** Community responder alerts complement, but never replace, official emergency services. Every distress alert explicitly advises calling 112 first and warns responders not to confront anyone.

---

## 5. Architectural Documents

- `docs/PRD.md`: Full product requirements and algorithm specifications.
- `docs/DECISIONS.md`: Log of architectural, cryptographic, and geographic decisions.
- `docs/ACCEPTANCE.md`: Validation results for all 12 PRD acceptance test scenarios.
- `docs/PROGRESS.md`: Phase-by-phase implementation log.
