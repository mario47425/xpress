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
    <div className="flex-1 flex flex-col font-mono bg-bg text-text">
      <AppBar
        title={isRider ? 'Rider Onboarding' : 'Commuter Verification'}
        pill={<Pill variant="available" label={`SCORE ${completedSteps}/4`} />}
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-8 no-scrollbar">
        {/* Verification Progress Hero (UI Spec §8.1) */}
        <Card variant="glow" className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-label text-primary-soft">VERIFICATION LADDER</span>
            <span className="text-xs text-white font-bold">{completedSteps} of 4 Complete</span>
          </div>

          <TickProgress
            value={completedSteps / 4}
            totalTicks={28}
            color="success"
            leftLabel="NEWCOMER"
            rightLabel="COMMUNITY ANCHOR"
          />

          <p className="text-[11px] text-text-3 italic">
            Each completed verification raises your trust tier and unlocks pod formation and women-only matching.
          </p>
        </Card>

        {/* Verification Checklist Card (UI Spec §8.1) */}
        <div className="space-y-2">
          <span className="font-label text-text-2">IDENTITY VERIFICATION STEPS</span>
          <Card variant="flat" className="space-y-3">
            {/* Step 1: Phone OTP */}
            <div className="flex items-center justify-between p-2.5 rounded-inner bg-surface-2 border border-border">
              <div className="flex items-center gap-2.5">
                <CheckCircle size={18} className="text-success shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-white">Phone OTP Verification</div>
                  <div className="text-[10px] text-text-3">+91 98401 12345 (Sandbox 123456)</div>
                </div>
              </div>
              <Pill variant="progress" label="DONE" />
            </div>

            {/* Step 2: College / Employer ID */}
            <div className="flex items-center justify-between p-2.5 rounded-inner bg-surface-2 border border-border">
              <div className="flex items-center gap-2.5">
                <CheckCircle size={18} className="text-success shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-white">College / Employer ID</div>
                  <div className="text-[10px] text-text-3">IIT Madras / Tech Domain Email</div>
                </div>
              </div>
              <Pill variant="progress" label="DONE" />
            </div>

            {/* Step 3: Government ID */}
            <div className="flex items-center justify-between p-2.5 rounded-inner bg-surface-2 border border-border">
              <div className="flex items-center gap-2.5">
                <CheckCircle size={18} className="text-success shrink-0" />
                <div>
                  <div className="text-xs font-semibold text-white">Government ID Card</div>
                  <div className="text-[10px] text-text-3">Aadhaar / Driving License OCR</div>
                </div>
              </div>
              <Pill variant="progress" label="DONE" />
            </div>

            {/* Step 4: Selfie Match */}
            <div className="flex items-center justify-between p-2.5 rounded-inner bg-surface-2 border border-border">
              <div className="flex items-center gap-2.5">
                {selfieVerified ? (
                  <CheckCircle size={18} className="text-success shrink-0" />
                ) : (
                  <Camera size={18} className="text-primary-soft shrink-0" />
                )}
                <div>
                  <div className="text-xs font-semibold text-white">Ride-Start Selfie Match</div>
                  <div className="text-[10px] text-text-3">Mutual check against profile photo</div>
                </div>
              </div>
              {selfieVerified ? (
                <Pill variant="progress" label="DONE" />
              ) : (
                <button
                  onClick={() => setSelfieVerified(true)}
                  className="px-2.5 py-1 bg-primary text-white text-[10px] font-semibold rounded-pill"
                >
                  Verify Now
                </button>
              )}
            </div>
          </Card>
        </div>

        {/* Vehicle Setup for Riders (UI Spec §9.1 & PRD §3.1 A4) */}
        {isRider && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-label text-success flex items-center gap-1.5">
                <Car size={14} /> VEHICLE & DRIVER LICENCE
              </span>
              <Pill variant="progress" label="APPROVED" />
            </div>

            <Card variant="flat" className="space-y-3.5">
              <div className="space-y-1">
                <span className="font-label text-text-3 text-[10px]">VEHICLE BODY TYPE</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['sedan', 'hatchback', 'suv'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setCarType(type)}
                      className={`py-2 px-3 rounded-inner border text-xs font-semibold capitalize ${
                        carType === type
                          ? 'bg-primary text-white border-primary-soft shadow-md'
                          : 'bg-surface-2 text-text-3 border-border'
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

              <div className="p-3 bg-surface-2 rounded-inner border border-border flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-success" />
                  <span className="text-white">Driving Licence Document</span>
                </div>
                <span className="text-success font-semibold text-[11px]">Approved ✓</span>
              </div>
            </Card>
          </div>
        )}

        <Button
          variant="primary"
          onClick={() => navigate(isRider ? '/rider' : '/app')}
          className="w-full text-base font-semibold"
        >
          Save & Return to Portal
        </Button>
      </div>
    </div>
  );
};
