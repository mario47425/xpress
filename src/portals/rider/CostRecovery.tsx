import React from 'react';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Pill } from '../../components/primitives/Pill';
import { TickProgress } from '../../components/signature/TickProgress';
import { useAppStore } from '../../store/useAppStore';
import { ShieldAlert, ArrowDownLeft, ArrowUpRight, Fuel, AlertCircle } from 'lucide-react';

export const RiderCostRecovery: React.FC = () => {
  const { wallet } = useAppStore();

  const actualCost = 720;
  const costRecovered = 640;
  const progress = Math.min(1, costRecovered / actualCost);

  const ledger = [
    { id: 'tx-6', timestamp: '28 Sep 09:15', description: 'Fuel cost recovery · Velachery loop', amount: 84, type: 'cost_recovery_credit' },
    { id: 'tx-7', timestamp: '28 Sep 09:15', description: 'Platform maintenance fee (5%)', amount: -4, type: 'fee_debit' },
    { id: 'tx-8', timestamp: '27 Sep 18:10', description: 'Fuel cost recovery · Guindy drop', amount: 76, type: 'cost_recovery_credit' },
    { id: 'tx-9', timestamp: '26 Sep 09:10', description: 'Fuel cost recovery · IIT corridor', amount: 84, type: 'cost_recovery_credit' },
  ];

  return (
    <div className="flex-1 flex flex-col font-mono bg-bg text-text">
      <AppBar
        title="Cost Recovery & Fuel Ledger"
        showBack={false}
        pill={<Pill variant="available" label="COST CAP COMPLIANT" />}
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-8 no-scrollbar">
        {/* Cost Recovery Hero Card (UI Spec §9.11 & PRD §3.10 J3) */}
        <Card variant="glow" className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-label text-success flex items-center gap-1.5">
              <Fuel size={16} /> MONTHLY COST RECOVERY
            </span>
            <span className="font-label text-text-3">LEGAL CAP: 100%</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-display-l text-white text-4xl font-bold">
              Rs {costRecovered}
            </span>
            <span className="text-xs text-text-3">of Rs {actualCost} actual fuel</span>
          </div>

          {/* Cost Cap Tick Progress (bar never exceeds 100%) */}
          <div className="space-y-1.5">
            <TickProgress
              value={progress}
              totalTicks={30}
              color="success"
              leftLabel="RECOVERED 88%"
              rightLabel="TRIP COST CAP"
            />
          </div>

          {/* Legal Framing Notice (PRD §8.2 Non-negotiable) */}
          <div className="p-3 bg-surface-2 rounded-inner border border-border text-xs text-text-2 space-y-1">
            <p className="font-semibold text-white">
              Peer-to-Peer Cost Sharing Compliance:
            </p>
            <p className="text-[11px] text-text-3 italic">
              "You share the fuel and toll cost of trips you were already making. You do not earn a fare or profit. Total collected can never exceed actual operating expenses."
            </p>
          </div>
        </Card>

        {/* Breakdown of Fuel & Toll Inputs */}
        <div className="space-y-2">
          <span className="font-label text-text-2">VEHICLE FUEL SPECIFICATION</span>
          <Card variant="flat" className="p-4 space-y-2 text-xs">
            <div className="flex justify-between text-text-2">
              <span>Honda City (Petrol):</span>
              <span className="text-white font-semibold">15.0 km / litre</span>
            </div>
            <div className="flex justify-between text-text-2">
              <span>Fuel Baseline Rate (Chennai):</span>
              <span className="text-white font-semibold">Rs 102.63 / L</span>
            </div>
            <div className="flex justify-between text-text-2">
              <span>Platform Maintenance Deductible:</span>
              <span className="text-white font-semibold">5% on settlement</span>
            </div>
          </Card>
        </div>

        {/* Ledger Rows */}
        <div className="space-y-2">
          <span className="font-label text-text-2">COST RECOVERY LEDGER</span>
          <div className="space-y-2">
            {ledger.map((tx) => {
              const isCredit = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  className="p-3 bg-surface rounded-inner border border-border flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCredit
                          ? 'bg-success/20 text-success'
                          : 'bg-surface-2 text-text-3'
                      }`}
                    >
                      {isCredit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{tx.description}</div>
                      <div className="text-[10px] text-text-3 font-mono">{tx.timestamp}</div>
                    </div>
                  </div>
                  <span
                    className={`font-semibold font-mono text-sm ${
                      isCredit ? 'text-success' : 'text-text-3'
                    }`}
                  >
                    {isCredit ? `+Rs ${tx.amount}` : `-Rs ${Math.abs(tx.amount)}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
