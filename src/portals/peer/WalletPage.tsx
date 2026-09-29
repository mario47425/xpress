import React, { useState } from 'react';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { BottomSheet } from '../../components/primitives/BottomSheet';
import { useAppStore } from '../../store/useAppStore';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Plus, History, HelpCircle } from 'lucide-react';

export const PeerWalletPage: React.FC = () => {
  const { wallet, topUpWallet } = useAppStore();

  const [topUpOpen, setTopUpOpen] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('200');
  const [submitting, setSubmitting] = useState(false);

  const balance = wallet?.balance ?? 412;
  const ledger = wallet?.ledger ?? [
    { id: 'tx-1', timestamp: 'Yesterday 17:30', description: 'UPI Top-up', amount: 500, type: 'topup' },
    { id: 'tx-2', timestamp: 'Yesterday 09:12', description: 'Ride to IIT Madras share', amount: -28, type: 'fare_debit' },
    { id: 'tx-3', timestamp: '27 Sep 18:05', description: 'Ride from Campus share', amount: -30, type: 'fare_debit' },
    { id: 'tx-4', timestamp: '26 Sep 08:45', description: 'Relay pass metro leg', amount: -15, type: 'fare_debit' },
  ];

  const handleTopUp = async () => {
    setSubmitting(true);
    await topUpWallet(Number(topUpAmount) || 100);
    setSubmitting(false);
    setTopUpOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col font-mono bg-bg text-text">
      <AppBar
        title="Wallet & Fare Split"
        showBack={false}
        pill={<Pill variant="available" label="UPI LINKED" />}
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-8 no-scrollbar">
        {/* Balance Hero Card */}
        <Card variant="glow" className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-label text-primary-soft flex items-center gap-1.5">
              <WalletIcon size={16} /> COMMUTECIRCLE BALANCE
            </span>
            <Pill variant="progress" label="HEALTHY" />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-display-l text-white text-4xl font-bold">
              Rs {balance}
            </span>
            <span className="text-xs text-text-3">Available</span>
          </div>

          <Button
            variant="primary"
            onClick={() => setTopUpOpen(true)}
            className="w-full text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            <span>Top Up via Mock UPI</span>
          </Button>
        </Card>

        {/* Transparent Fair-Fare Reason Card (PRD §3.10 J1 & UI Spec §8.11) */}
        <div className="space-y-2">
          <span className="font-label text-text-2 flex items-center gap-1">
            <HelpCircle size={14} className="text-primary-soft" /> HOW YOUR FARE IS CALCULATED
          </span>
          <Card variant="flat" className="space-y-3">
            <div className="text-xs text-white font-semibold leading-relaxed">
              "Your fare is Rs 28 because you shared 6.2 km and added 0.4 km detour offset."
            </div>
            <div className="p-3 bg-surface-2 rounded-inner border border-border text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-text-2">
                <span>Base Fuel & Toll Share:</span>
                <span className="text-white">Rs 24</span>
              </div>
              <div className="flex justify-between text-text-2">
                <span>Detour Kilometer Offset (0.4 km):</span>
                <span className="text-white">Rs 3</span>
              </div>
              <div className="flex justify-between text-text-2">
                <span>Platform Maintenance Fee (5%):</span>
                <span className="text-white">Rs 1</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Double-Entry Transaction Ledger Rows (PRD §3.10 J2) */}
        <div className="space-y-2">
          <span className="font-label text-text-2 flex items-center gap-1.5">
            <History size={14} /> TRANSACTION LEDGER
          </span>
          <div className="space-y-2">
            {ledger.map((tx: any) => {
              const isPositive = tx.amount > 0;
              return (
                <div
                  key={tx.id}
                  className="p-3 bg-surface rounded-inner border border-border flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isPositive
                          ? 'bg-success/20 text-success'
                          : 'bg-surface-2 text-text-3'
                      }`}
                    >
                      {isPositive ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{tx.description}</div>
                      <div className="text-[10px] text-text-3 font-mono">{tx.timestamp}</div>
                    </div>
                  </div>
                  <span
                    className={`font-semibold font-mono text-sm ${
                      isPositive ? 'text-success' : 'text-white'
                    }`}
                  >
                    {isPositive ? `+Rs ${tx.amount}` : `-Rs ${Math.abs(tx.amount)}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top-up Modal */}
      <BottomSheet
        isOpen={topUpOpen}
        onClose={() => setTopUpOpen(false)}
        title="Mock UPI Wallet Top-up"
      >
        <div className="space-y-4 font-mono text-xs">
          <p className="text-text-2">
            Select amount to load into your CommuteCircle ride pool wallet:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {['100', '200', '500'].map((amt) => (
              <button
                key={amt}
                onClick={() => setTopUpAmount(amt)}
                className={`py-2.5 px-3 rounded-inner border font-bold text-sm transition-all ${
                  topUpAmount === amt
                    ? 'bg-primary text-white border-primary-soft shadow-md'
                    : 'bg-surface-2 text-text-2 border-border'
                }`}
              >
                Rs {amt}
              </button>
            ))}
          </div>

          <Button
            variant="primary"
            onClick={handleTopUp}
            loading={submitting}
            className="w-full text-sm font-semibold"
          >
            Authorize Rs {topUpAmount} via UPI Sandbox
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
};
