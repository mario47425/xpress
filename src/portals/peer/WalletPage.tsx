import React, { useState } from 'react';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { BottomSheet } from '../../components/primitives/BottomSheet';
import { useAppStore } from '../../store/useAppStore';
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  History,
  HelpCircle,
  ShieldCheck,
  TrendingDown,
  CreditCard,
} from 'lucide-react';

export const PeerWalletPage: React.FC = () => {
  const { wallet, topUpWallet } = useAppStore();

  const [topUpOpen, setTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('200');
  const [submitting, setSubmitting] = useState(false);

  const balance = wallet?.balance ?? 412;
  const ledger = wallet?.ledger ?? [
    { id: 'tx-1', timestamp: 'Yesterday 17:30', description: 'UPI Top-up (Sandbox)', amount: 500, type: 'topup' },
    { id: 'tx-2', timestamp: 'Yesterday 09:12', description: 'Ride to IIT Madras share', amount: -28, type: 'fare_debit' },
    { id: 'tx-3', timestamp: '27 Sep 18:05', description: 'Ride from Campus share', amount: -30, type: 'fare_debit' },
    { id: 'tx-4', timestamp: '26 Sep 08:45', description: 'Relay pass metro leg', amount: -15, type: 'fare_debit' },
    { id: 'tx-5', timestamp: '25 Sep 18:15', description: 'Ride to Velachery share', amount: -28, type: 'fare_debit' },
  ];

  const handleTopUp = async () => {
    setSubmitting(true);
    await topUpWallet(Number(topUpAmount) || 100);
    setSubmitting(false);
    setTopUpOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-bg text-text">
      <AppBar
        title="Wallet & Fare Split"
        showBack={false}
        pill={<Pill variant="available" label="UPI AUTO-SPLIT" />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
        {/* Top Stats Overview Row on Desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card variant="glow" className="p-5 sm:p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-label text-primary text-xs font-bold flex items-center gap-1.5">
                <WalletIcon size={16} /> AVAILABLE BALANCE
              </span>
              <Pill variant="progress" label="HEALTHY" />
            </div>
            <div className="font-display-l text-text text-3xl sm:text-4xl font-bold">
              ₹{balance}
            </div>
            <span className="text-xs text-text-muted font-medium">Auto-deducted per completed ride pass</span>
          </Card>

          <Card variant="flat" className="p-5 sm:p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-label text-text-muted text-xs font-bold flex items-center gap-1.5">
                <TrendingDown size={16} className="text-success" /> MONTHLY TRANSIT SAVED
              </span>
            </div>
            <div className="font-display-l text-success text-3xl sm:text-4xl font-bold">
              ₹412
            </div>
            <span className="text-xs text-text-muted font-medium">Saved vs commercial app surge pricing</span>
          </Card>

          <Card variant="flat" className="p-5 sm:p-6 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-label text-text-muted text-xs font-bold flex items-center gap-1.5">
                <CreditCard size={16} className="text-amber-500" /> PAYMENT RAILS
              </span>
              <span className="font-pill text-[11px] text-success font-bold">NPCI UPI</span>
            </div>
            <div className="font-title-m text-text text-xl sm:text-2xl font-bold">
              anitha@okhdfc
            </div>
            <span className="text-xs text-text-muted font-medium">Instant escrow release upon QR scan</span>
          </Card>
        </div>

        {/* Responsive 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Double-Entry Transaction Ledger */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-label text-text font-bold text-xs flex items-center gap-1.5">
                <History size={16} /> DOUBLE-ENTRY TRANSACTION LEDGER
              </span>
              <span className="text-[11px] text-text-muted font-medium">
                {ledger.length} ENTRIES RECORDED
              </span>
            </div>

            <div className="space-y-2.5">
              {ledger.map((tx: any) => {
                const isPositive = tx.amount > 0;
                return (
                  <div
                    key={tx.id}
                    className="p-4 bg-surface hover:bg-surface-2/60 rounded-card border border-border flex items-center justify-between text-xs transition-colors shadow-card"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                          isPositive
                            ? 'bg-success/15 text-success'
                            : 'bg-surface-2 text-text-muted'
                        }`}
                      >
                        {isPositive ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                      </div>
                      <div>
                        <div className="text-text font-bold text-sm">{tx.description}</div>
                        <div className="text-[11px] text-text-muted mt-0.5">{tx.timestamp}</div>
                      </div>
                    </div>
                    <span
                      className={`font-bold text-base ${
                        isPositive ? 'text-success' : 'text-text'
                      }`}
                    >
                      {isPositive ? `+₹${tx.amount}` : `-₹${Math.abs(tx.amount)}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column (5 cols): Fair-Fare Breakdown & Quick Top-Up */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Quick Top-Up Card */}
            <Card variant="flat" className="p-5 sm:p-6 space-y-3.5">
              <span className="font-label text-text font-bold text-xs">ADD FUNDS TO RIDE POOL</span>
              <p className="text-xs text-text-muted">
                Load mock UPI funds to auto-settle upcoming ghost commutes:
              </p>
              <Button
                variant="primary"
                onClick={() => setTopUpOpen(true)}
                className="w-full text-xs font-semibold flex items-center justify-center gap-2 shadow-md min-h-[44px]"
              >
                <Plus size={16} />
                <span>Top Up Balance via Mock UPI</span>
              </Button>
            </Card>

            {/* Transparent Fair-Fare Reason Card */}
            <Card variant="flat" className="p-5 sm:p-6 space-y-3.5">
              <span className="font-label text-primary font-bold text-xs flex items-center gap-1.5">
                <HelpCircle size={16} /> HOW YOUR COMMUTE FARE IS CALCULATED
              </span>
              <div className="text-xs text-text font-medium leading-relaxed">
                "Your ride fare is strictly calculated to reimburse vehicle fuel and detour without commercial profit."
              </div>
              <div className="p-3.5 bg-surface-2 rounded-inner border border-border text-xs space-y-2.5">
                <div className="flex justify-between text-text-muted">
                  <span>Base Fuel & Toll Share (6.2 km):</span>
                  <span className="text-text font-semibold">₹24</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Detour Km Offset (0.4 km):</span>
                  <span className="text-text font-semibold">₹3</span>
                </div>
                <div className="flex justify-between text-text-muted">
                  <span>Platform Operations (5%):</span>
                  <span className="text-text font-semibold">₹1</span>
                </div>
                <div className="pt-2 border-t border-border flex justify-between text-text font-bold text-sm">
                  <span>Total Settled Share:</span>
                  <span className="text-success">₹28</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Top-up Modal */}
      <BottomSheet
        isOpen={topUpOpen}
        onClose={() => setTopUpOpen(false)}
        title="Mock UPI Wallet Top-up"
      >
        <div className="space-y-4 text-xs">
          <p className="text-text-muted">
            Select amount to load into your CommuteCircle ride pool wallet:
          </p>
          <div className="grid grid-cols-3 gap-2.5">
            {['100', '200', '500'].map((amt) => (
              <button
                key={amt}
                onClick={() => setTopUpAmount(amt)}
                className={`min-h-[44px] py-2.5 px-3 rounded-btn border font-bold text-sm transition-all ${
                  topUpAmount === amt
                    ? 'bg-primary text-white border-transparent shadow-md'
                    : 'bg-surface-2 text-text border-border hover:bg-surface-2/80'
                }`}
              >
                ₹{amt}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            onClick={handleTopUp}
            loading={submitting}
            className="w-full text-sm font-semibold min-h-[48px]"
          >
            Authorize ₹{topUpAmount} via UPI Sandbox
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
};
