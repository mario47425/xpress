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
        title="Safety Centre"
        pill={<Pill variant="progress" label="PROTECTED" />}
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-8 no-scrollbar">
        {/* 1. Privacy Reveal Ladder (PRD §3.2 & UI Spec §10.1 B2/B3) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label text-primary-soft flex items-center gap-1.5">
              <Eye size={14} /> WHAT OTHERS CAN SEE (PRIVACY LADDER)
            </span>
            <Lock size={12} className="text-text-3" />
          </div>

          <Card variant="flat" className="space-y-3">
            <div className="flex items-start gap-3 pb-2.5 border-b border-border/50">
              <span className="w-6 h-6 rounded-full bg-surface-2 border border-border flex items-center justify-center text-[10px] text-text-3 shrink-0">
                1
              </span>
              <div>
                <div className="text-xs font-semibold text-white">Stranger / Browse View</div>
                <div className="text-[11px] text-text-3">
                  Blurred zone only (e.g. "Velachery Zone"). Exact coordinates are never revealed or stored.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 pb-2.5 border-b border-border/50">
              <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[10px] text-primary-soft shrink-0">
                2
              </span>
              <div>
                <div className="text-xs font-semibold text-white">Matched Partner View</div>
                <div className="text-[11px] text-text-3">
                  Route corridor and designated safe pickup hotspot.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-success/20 border border-success/40 flex items-center justify-center text-[10px] text-success shrink-0">
                3
              </span>
              <div>
                <div className="text-xs font-semibold text-white">Confirmed + Within 10 min View</div>
                <div className="text-[11px] text-text-3">
                  Exact landmark revealed only after mutual confirmation and within 10 minutes of departure.
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* 2. Trusted Contacts (PRD §3.1 A5 & G3) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-label text-text-2 flex items-center gap-1.5">
              <Users size={14} /> TRUSTED EMERGENCY CONTACTS ({contacts.length}/5)
            </span>
            {contacts.length < 5 && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="font-caption text-primary-soft text-xs flex items-center gap-1"
              >
                <Plus size={14} /> Add
              </button>
            )}
          </div>

          <div className="space-y-2">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-3 bg-surface rounded-inner border border-border flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-semibold text-white">{contact.name}</div>
                  <div className="text-[11px] text-text-3">{contact.phone}</div>
                </div>
                <button
                  onClick={() => handleRemoveContact(contact.id)}
                  aria-label="Remove contact"
                  className="text-text-3 hover:text-danger p-1"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            {showAddForm && (
              <div className="p-3 bg-surface-2 rounded-inner border border-primary-soft/40 space-y-2 animate-in fade-in">
                <input
                  placeholder="Contact Name (e.g. Amma / Friend)"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full h-10 px-3 bg-surface text-white placeholder-text-3 text-xs rounded-input border border-border outline-none focus:border-primary-soft"
                />
                <input
                  placeholder="Phone (+91 98401 xxxxx)"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-full h-10 px-3 bg-surface text-white placeholder-text-3 text-xs rounded-input border border-border outline-none focus:border-primary-soft"
                />
                <Button variant="primary" size="sm" onClick={handleAddContact} className="w-full text-xs">
                  Save Emergency Contact
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* 3. Safety Preferences Toggles (UI Spec §10.1 & PRD §3.7) */}
        <div className="space-y-2">
          <span className="font-label text-text-2">SAFETY FILTERS & PREFERENCES</span>
          <Card variant="flat" className="space-y-4">
            <Toggle
              label="Women-Only Pods & Matches"
              helper="Only match with verified women commuters"
              checked={womenOnly}
              onChange={setWomenOnly}
            />

            <div className="border-t border-border/50 pt-3">
              <Toggle
                label="Safe Route After 20:00"
                helper="Prioritises well-lit arterial roads and CCTV junctions"
                checked={safeRouteLate}
                onChange={setSafeRouteLate}
              />
            </div>

            <div className="border-t border-border/50 pt-3">
              <Toggle
                label="Community SOS Responder Standby"
                helper="Receive nearby emergency alerts when app is open"
                checked={responderToggle}
                onChange={setResponderToggle}
              />
            </div>
          </Card>
        </div>

        {/* 4. Sandbox Emergency SOS Simulation (UI Spec §10.1) */}
        <div className="space-y-2 pt-1">
          <span className="font-label text-danger">EMERGENCY DRILL & TEST MODE</span>
          <Card variant="flat" className="space-y-3 border-danger/30">
            <p className="text-xs text-text-2">
              Test your device SOS trigger, 112 escalation pipeline, and verified trusted contact notifications without dispatching real emergency services.
            </p>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                triggerSOS();
                navigate('/sos/active');
              }}
              className="w-full flex items-center justify-center gap-2"
            >
              <ShieldAlert size={16} />
              <span>Initiate Test SOS Broadcast</span>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
