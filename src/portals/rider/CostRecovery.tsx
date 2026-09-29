import React from 'react';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Pill } from '../../components/primitives/Pill';
import { TickProgress } from '../../components/signature/TickProgress';
import { useAppStore } from '../../store/useAppStore';
import {
  ShieldAlert,
  ArrowDownLeft,
  ArrowUpRight,
  Fuel,
  AlertCircle,
  TrendingUp,
  Info,
  Car,
} from 'lucide-react';

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
    { id: 'tx-10', timestamp: '25 Sep 18:30', description: 'Fuel cost recovery · Velachery drop', amount: 84, type: 'cost_recovery_credit' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-bg text-text">
      <AppBar
        title="Cost Recovery & Fuel Ledger"
        showBack={false}
        pill={<Pill variant="available" label="COST CAP COMPLIANT" />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
        {/* Top Stats Overview Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="glow" className="p-5 space-y-2 shadow-colored">
            <div className="flex items-center justify-between">
              <span className="text-success font-bold text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <Fuel size={16} /> RECOVERED THIS MONTH
              </span>
              <Pill variant="available" label="88% RECOVERED" />
            </div>
            <div className="text-text text-3xl sm:text-4xl font-extrabold">
              Rs {costRecovered}
            </div>
            <span className="text-xs text-text-muted font-medium">Actual operating fuel spent: Rs {actualCost}</span>
          </Card>

          <Card variant="flat" className="p-5 space-y-2 shadow-colored">
            <div className="flex items-center justify-between">
              <span className="text-text-muted font-bold text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <Car size={16} className="text-primary" /> STATUTORY MONTHLY CAP
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent font-bold text-[10px]">NON-COMMERCIAL</span>
            </div>
            <div className="text-text text-3xl sm:text-4xl font-extrabold">
              Rs {actualCost}
            </div>
            <span className="text-xs text-text-muted font-medium">Cap prevents commercial taxi classification</span>
          </Card>

          <Card variant="flat" className="p-5 space-y-2 shadow-colored">
            <div className="flex items-center justify-between">
              <span className="text-success font-bold text-xs flex items-center gap-1.5 uppercase tracking-wider">
                <TrendingUp size={16} className="text-success" /> NET EXPENSE REDUCTION
              </span>
            </div>
            <div className="text-success text-3xl sm:text-4xl font-extrabold">
              -88.8%
            </div>
            <span className="text-xs text-text-muted font-medium">CommuteCircle shared fuel split efficiency</span>
          </Card>
        </div>

        {/* Responsive 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Fuel Cost Recovery Progress & Ledger */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {/* Cost Recovery Hero Card */}
            <Card variant="flat" className="space-y-4 p-5 sm:p-6 shadow-colored">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-text text-base sm:text-lg font-extrabold">
                    Cost Cap Utilization
                  </h3>
                  <span className="text-xs sm:text-sm text-text-muted font-medium">
                    Rs {costRecovered} of Rs {actualCost} recovered (Remaining headroom: Rs {actualCost - costRecovered})
                  </span>
                </div>
                <span className="text-text-muted font-bold text-xs">LEGAL CAP: 100%</span>
              </div>

              {/* Cost Cap Tick Progress */}
              <div className="space-y-1.5 pt-1">
                <TickProgress
                  value={progress}
                  totalTicks={32}
                  color="success"
                  leftLabel="RECOVERED 88%"
                  rightLabel="TRIP COST CAP (100%)"
                />
              </div>

              {/* Legal Framing Notice */}
              <div className="p-4 bg-surface-2 rounded-card border border-border text-xs sm:text-sm text-text-muted space-y-1">
                <p className="font-bold text-text">
                  Statutory Peer-to-Peer Cost Sharing Compliance:
                </p>
                <p className="text-xs text-text-muted italic leading-relaxed">
                  "You share the fuel and toll cost of trips you were already making. You do not earn a fare or profit. Total collected can never exceed actual vehicle operating expenses."
                </p>
              </div>
            </Card>

            {/* Ledger Rows */}
            <div className="space-y-3">
              <span className="text-text-muted font-bold text-xs uppercase tracking-wider">
                DOUBLE-ENTRY FUEL RECOVERY LEDGER
              </span>
              <div className="space-y-2.5">
                {ledger.map((tx) => {
                  const isCredit = tx.amount > 0;
                  return (
                    <div
                      key={tx.id}
                      className="p-4 bg-surface hover:bg-surface-2 rounded-card border border-border flex items-center justify-between text-xs sm:text-sm transition-all shadow-sm min-h-[52px]"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-10 h-10 rounded-button flex items-center justify-center shrink-0 ${
                            isCredit
                              ? 'bg-success/15 text-success'
                              : 'bg-surface-2 text-text-muted'
                          }`}
                        >
                          {isCredit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                        </div>
                        <div>
                          <div className="text-text font-bold">{tx.description}</div>
                          <div className="text-xs text-text-muted">{tx.timestamp}</div>
                        </div>
                      </div>
                      <span
                        className={`font-extrabold text-base ${
                          isCredit ? 'text-success' : 'text-text-muted'
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

          {/* Right Column (5 cols): Vehicle Fuel Parameters & Compliance */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Breakdown of Fuel & Toll Inputs */}
            <Card variant="flat" className="p-5 sm:p-6 space-y-4 shadow-colored">
              <span className="text-text-muted font-bold text-xs uppercase tracking-wider">VEHICLE FUEL SPECIFICATIONS</span>
              <div className="p-4 bg-surface-2 rounded-card border border-border text-xs sm:text-sm space-y-2.5">
                <div className="flex justify-between text-text-muted">
                  <span>Vehicle:</span>
                  <span className="text-text font-bold">Honda City 1.5 i-VTEC</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Mileage Baseline:</span>
                  <span className="text-text font-bold">15.0 km / litre</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Fuel Price (Chennai):</span>
                  <span className="text-text font-bold">Rs 102.63 / L</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Effective Operating Cost:</span>
                  <span className="text-text font-bold">Rs 6.84 / km</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between text-text-muted">
                  <span>Platform Fee Deductible:</span>
                  <span className="text-text font-bold">5% upon ledger close</span>
                </div>
              </div>
            </Card>

            {/* Non-Commercial Safe Harbour Rules */}
            <div className="p-5 bg-surface rounded-card border border-border space-y-2 text-xs sm:text-sm text-text-muted shadow-sm">
              <div className="flex items-center gap-1.5 text-text font-bold">
                <Info size={16} className="text-primary" />
                <span>Zero Commercial Gain Guarantee</span>
              </div>
              <p className="text-xs leading-relaxed">
                If your cost recovery reaches 100% of actual operating expenses in any billing cycle, the system stops passenger contributions and offers free peer matching until the next month.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
