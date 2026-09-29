import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { Input, OtpInput } from '../../components/primitives/Input';
import { TickProgress } from '../../components/signature/TickProgress';
import { useAppStore } from '../../store/useAppStore';
import {
  CheckCircle,
  Clock,
  Lock,
  Upload,
  Camera,
  Car,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, activeRole } = useAppStore();

  const isRider = activeRole === 'rider';

  const [otpValue, setOtpValue] = useState('123456'); // Fixed sandbox OTP (PRD §8.1)
  const [phoneVerified, setPhoneVerified] = useState(true);
  const [collegeIdUploaded, setCollegeIdUploaded] = useState(true);
  const [govtIdUploaded, setGovtIdUploaded] = useState(true);
  const [selfieVerified, setSelfieVerified] = useState(isRider);

  // Vehicle form state for riders (PRD §3.1 A4 & UI Spec §9.1)
  const [carType, setCarType] = useState<'hatchback' | 'sedan' | 'suv'>('sedan');
  const [carPlate, setCarPlate] = useState('TN 09 AB 4821');
  const [carSeats, setCarSeats] = useState(3);
  const [fuelType, setFuelType] = useState('petrol');
  const [mileage, setMileage] = useState('15');
  const [vehicleApproved, setVehicleApproved] = useState(true);

  const completedSteps =
    (phoneVerified ? 1 : 0) +
    (collegeIdUploaded ? 1 : 0) +
    (govtIdUploaded ? 1 : 0) +
    (selfieVerified ? 1 : 0);

  return (
    <div className="flex-1 flex flex-col bg-bg text-text">
      <AppBar
        title={isRider ? 'Rider Onboarding' : 'Commuter Verification'}
        pill={<Pill variant="available" label={`SCORE ${completedSteps}/4`} />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full space-y-6 pb-8 no-scrollbar">
        {/* Verification Progress Hero (UI Spec §8.1) */}
        <Card variant="glow" className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <span className="font-label text-primary text-xs font-bold uppercase tracking-wider">VERIFICATION LADDER</span>
            <span className="text-xs text-text font-bold">{completedSteps} of 4 Complete</span>
          </div>

          <TickProgress
            value={completedSteps / 4}
            totalTicks={28}
            color="success"
            leftLabel="NEWCOMER"
            rightLabel="COMMUNITY ANCHOR"
          />

          <p className="text-xs text-text-muted italic leading-relaxed">
            Each completed verification raises your trust tier and unlocks pod formation and women-only matching.
          </p>
        </Card>

        {/* Verification Checklist Card (UI Spec §8.1) */}
        <div className="space-y-3">
          <span className="font-label text-text font-bold text-xs tracking-wider">IDENTITY VERIFICATION STEPS</span>
          <Card variant="flat" className="space-y-3 p-5 sm:p-6">
            {/* Step 1: Phone OTP */}
            <div className="flex items-center justify-between p-3.5 rounded-inner bg-surface-2 border border-border">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-success shrink-0" />
                <div>
                  <div className="text-xs font-bold text-text">Phone OTP Verification</div>
                  <div className="text-[11px] text-text-muted mt-0.5">+91 98401 12345 (Sandbox 123456)</div>
                </div>
              </div>
              <Pill variant="progress" label="DONE" />
            </div>

            {/* Step 2: College / Employer ID */}
            <div className="flex items-center justify-between p-3.5 rounded-inner bg-surface-2 border border-border">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-success shrink-0" />
                <div>
                  <div className="text-xs font-bold text-text">College / Employer ID</div>
                  <div className="text-[11px] text-text-muted mt-0.5">IIT Madras / Tech Domain Email</div>
                </div>
              </div>
              <Pill variant="progress" label="DONE" />
            </div>

            {/* Step 3: Government ID */}
            <div className="flex items-center justify-between p-3.5 rounded-inner bg-surface-2 border border-border">
              <div className="flex items-center gap-3">
                <CheckCircle size={20} className="text-success shrink-0" />
                <div>
                  <div className="text-xs font-bold text-text">Government ID Card</div>
                  <div className="text-[11px] text-text-muted mt-0.5">Aadhaar / Driving License OCR</div>
                </div>
              </div>
              <Pill variant="progress" label="DONE" />
            </div>

            {/* Step 4: Selfie Match */}
            <div className="flex items-center justify-between p-3.5 rounded-inner bg-surface-2 border border-border">
              <div className="flex items-center gap-3">
                {selfieVerified ? (
                  <CheckCircle size={20} className="text-success shrink-0" />
                ) : (
                  <Camera size={20} className="text-primary shrink-0" />
                )}
                <div>
                  <div className="text-xs font-bold text-text">Ride-Start Selfie Match</div>
                  <div className="text-[11px] text-text-muted mt-0.5">Mutual check against profile photo</div>
                </div>
              </div>
              {selfieVerified ? (
                <Pill variant="progress" label="DONE" />
              ) : (
                <button
                  onClick={() => setSelfieVerified(true)}
                  className="min-h-[44px] px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-pill shadow-sm"
                >
                  Verify Now
                </button>
              )}
            </div>
          </Card>
        </div>

        {/* Vehicle Setup for Riders (UI Spec §9.1 & PRD §3.1 A4) */}
        {isRider && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-label text-success flex items-center gap-1.5 text-xs font-bold">
                <Car size={16} /> VEHICLE & DRIVER LICENCE
              </span>
              <Pill variant="progress" label="APPROVED" />
            </div>

            <Card variant="flat" className="space-y-4 p-5 sm:p-6">
              <div className="space-y-1.5">
                <span className="font-label text-text-muted text-xs font-bold">VEHICLE BODY TYPE</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['sedan', 'hatchback', 'suv'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCarType(type)}
                      className={`min-h-[44px] py-2 px-3 rounded-btn border text-xs font-semibold capitalize transition-all ${
                        carType === type
                          ? 'bg-primary text-white border-transparent shadow-md'
                          : 'bg-surface-2 text-text-muted border-border hover:bg-surface-2/80 hover:text-text'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="REGISTRATION PLATE"
                value={carPlate}
                onChange={(e) => setCarPlate(e.target.value)}
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="SEATS OFFERED"
                  type="number"
                  value={carSeats}
                  onChange={(e) => setCarSeats(Number(e.target.value))}
                />
                <Input
                  label="MILEAGE (KM / L)"
                  value={mileage}
                  onChange={(e) => setMileage(e.target.value)}
                />
              </div>

              <div className="p-3.5 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-success" />
                  <span className="text-text font-bold">Driving Licence Document</span>
                </div>
                <span className="text-success font-semibold text-xs">Approved ✓</span>
              </div>
            </Card>
          </div>
        )}

        <Button
          variant="primary"
          onClick={() => navigate(isRider ? '/rider' : '/app')}
          className="w-full text-base font-semibold min-h-[48px] shadow-lg"
        >
          Save & Return to Portal
        </Button>
      </div>
    </div>
  );
};
