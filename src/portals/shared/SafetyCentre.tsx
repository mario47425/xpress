import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Toggle } from '../../components/primitives/Toggle';
import { Pill } from '../../components/primitives/Pill';
import { Button } from '../../components/primitives/Button';
import { useAppStore } from '../../store/useAppStore';
import {
  ShieldCheck,
  Users,
  Eye,
  ShieldAlert,
  Moon,
  Plus,
  Trash2,
  Lock,
  PhoneCall,
  CheckCircle,
} from 'lucide-react';

export const SafetyCentre: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, triggerSOS } = useAppStore();

  const [womenOnly, setWomenOnly] = useState(currentUser?.genderPref === 'women-only');
  const [safeRouteLate, setSafeRouteLate] = useState(currentUser?.safeRoutePref ?? true);
  const [responderToggle, setResponderToggle] = useState(currentUser?.responderActive ?? false);
  const [contacts, setContacts] = useState(currentUser?.trustedContacts || [
    { id: 'c-1', name: 'Ramesh (Father)', phone: '+91 98401 99991' },
    { id: 'c-2', name: 'Divya (Friend)', phone: '+91 98401 99992' },
  ]);

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddContact = () => {
    if (newContactName && newContactPhone) {
      setContacts((prev) => [
        ...prev,
        { id: `c-${Date.now()}`, name: newContactName, phone: newContactPhone },
      ]);
      setNewContactName('');
      setNewContactPhone('');
      setShowAddForm(false);
    }
  };

  const handleRemoveContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="flex-1 flex flex-col font-mono bg-bg text-text">
      <AppBar
        title="Safety Centre & Emergency Shield"
        showBack={false}
        pill={<Pill variant="progress" label="SAFETRAIL ACTIVE" />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
        {/* Responsive 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (6 cols): Privacy Ladder & Trusted Emergency Contacts */}
          <div className="lg:col-span-6 space-y-6">
            {/* 1. Privacy Reveal Ladder (PRD §3.2 & UI Spec §10.1 B2/B3) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-label text-primary-soft text-xs flex items-center gap-1.5">
                  <Eye size={14} /> WHAT OTHERS CAN SEE (PRIVACY LADDER)
                </span>
                <div className="flex items-center gap-1 text-[11px] text-text-3">
                  <Lock size={12} />
                  <span>3-Tier Cryptographic Masking</span>
                </div>
              </div>

              <Card variant="flat" className="space-y-4 p-5">
                <div className="flex items-start gap-3.5 pb-3 border-b border-border/50">
                  <span className="w-7 h-7 rounded-full bg-surface-2 border border-border flex items-center justify-center text-xs text-text-3 font-bold shrink-0">
                    1
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-white">Stranger / Browse View</div>
                    <div className="text-[11px] text-text-3 mt-0.5 leading-relaxed">
                      Blurred zone only (e.g. "Velachery Zone"). Exact coordinates are never revealed or stored on server.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 pb-3 border-b border-border/50">
                  <span className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs text-primary-soft font-bold shrink-0">
                    2
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-white">Matched Partner View</div>
                    <div className="text-[11px] text-text-3 mt-0.5 leading-relaxed">
                      Corridor route and designated high-visibility safe pickup hotspot only.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <span className="w-7 h-7 rounded-full bg-success/20 border border-success/40 flex items-center justify-center text-xs text-success font-bold shrink-0">
                    3
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-white">Confirmed + Boarding View</div>
                    <div className="text-[11px] text-text-3 mt-0.5 leading-relaxed">
                      Exact drop-off and pickup landmark unlocked strictly after mutual confirmation and single-use QR handshake.
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* 2. Trusted Contacts (PRD §3.1 A5 & G3) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-label text-text-2 text-xs flex items-center gap-1.5">
                  <Users size={14} /> TRUSTED EMERGENCY CONTACTS ({contacts.length}/5)
                </span>
                {contacts.length < 5 && (
                  <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="font-caption text-primary-soft text-xs flex items-center gap-1 hover:underline"
                  >
                    <Plus size={14} /> Add Contact
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="p-3.5 bg-surface hover:bg-surface-2 rounded-inner border border-border flex items-center justify-between transition-colors shadow-sm"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{contact.name}</div>
                      <div className="text-[11px] text-text-3 font-mono">{contact.phone}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveContact(contact.id)}
                      aria-label="Remove contact"
                      className="text-text-3 hover:text-danger p-1 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}

                {showAddForm && (
                  <div className="p-4 bg-surface rounded-card border border-primary-soft/40 space-y-3 animate-in fade-in shadow-lg">
                    <input
                      placeholder="Contact Name (e.g. Father / Roommate)"
                      value={newContactName}
                      onChange={(e) => setNewContactName(e.target.value)}
                      className="w-full h-10 px-3 bg-surface-2 text-white placeholder-text-3 text-xs rounded-input border border-border outline-none focus:border-primary-soft"
                    />
                    <input
                      placeholder="Phone (+91 98401 xxxxx)"
                      value={newContactPhone}
                      onChange={(e) => setNewContactPhone(e.target.value)}
                      className="w-full h-10 px-3 bg-surface-2 text-white placeholder-text-3 text-xs rounded-input border border-border outline-none focus:border-primary-soft"
                    />
                    <Button variant="primary" size="sm" onClick={handleAddContact} className="w-full text-xs">
                      Save Emergency Contact
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (6 cols): Safety Filters, Helplines & Emergency Test Sandbox */}
          <div className="lg:col-span-6 space-y-6">
            {/* 3. Safety Preferences Toggles (UI Spec §10.1 & PRD §3.7) */}
            <div className="space-y-3">
              <span className="font-label text-text-2 text-xs">SAFETY FILTERS & AUTOMATIC ROUTING</span>
              <Card variant="flat" className="p-5 space-y-4">
                <Toggle
                  label="Women-Only Pods & Matches"
                  helper="Only match with verified women commuters along corridor"
                  checked={womenOnly}
                  onChange={setWomenOnly}
                />

                <div className="border-t border-border/50 pt-3">
                  <Toggle
                    label="Safe Route Routing After 20:00"
                    helper="Prioritises well-lit arterial roads, police kiosks, and CCTV junctions"
                    checked={safeRouteLate}
                    onChange={setSafeRouteLate}
                  />
                </div>

                <div className="border-t border-border/50 pt-3">
                  <Toggle
                    label="Community SOS Responder Standby"
                    helper="Receive nearby emergency alerts when app is active (1 km radius)"
                    checked={responderToggle}
                    onChange={setResponderToggle}
                  />
                </div>
              </Card>
            </div>

            {/* 4. Official Emergency Hotlines */}
            <Card variant="flat" className="p-5 space-y-3">
              <span className="font-label text-text-2 text-xs flex items-center gap-1.5">
                <PhoneCall size={14} className="text-success" /> CHENNAI EMERGENCY HELPLINES
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-surface-2 rounded-inner border border-border flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">112</span>
                    <span className="text-[10px] text-text-3">National Emergency</span>
                  </div>
                  <a href="tel:112" className="text-success font-semibold underline text-xs">Call</a>
                </div>
                <div className="p-3 bg-surface-2 rounded-inner border border-border flex items-center justify-between">
                  <div>
                    <span className="text-white font-bold block">1091</span>
                    <span className="text-[10px] text-text-3">Women Helpline</span>
                  </div>
                  <a href="tel:1091" className="text-success font-semibold underline text-xs">Call</a>
                </div>
              </div>
            </Card>

            {/* 5. Emergency SOS Simulation */}
            <div className="space-y-3">
              <span className="font-label text-danger text-xs">COMMUNITY SOS EMERGENCY DRILL</span>
              <Card variant="flat" className="p-5 space-y-3 border-danger/40">
                <p className="text-xs text-text-2 leading-relaxed">
                  Test your device SOS trigger, 2-tier escalation pipeline (T1: 0s contacts, T2: 60s community), and telemetry heartbeats safely in sandbox mode.
                </p>
                <Button
                  variant="danger"
                  size="default"
                  onClick={() => {
                    triggerSOS();
                    navigate('/sos/active');
                  }}
                  className="w-full flex items-center justify-center gap-2 shadow-lg"
                >
                  <ShieldAlert size={16} />
                  <span>Initiate Test SOS Broadcast</span>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
