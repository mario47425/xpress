import React, { useState } from 'react';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { Segmented } from '../../components/primitives/Segmented';
import { BottomSheet } from '../../components/primitives/BottomSheet';
import { useAppStore } from '../../store/useAppStore';
import { ModeratorCase } from '../../types';
import { Gavel, AlertTriangle, ShieldCheck, CheckCircle2, Lock, History, FileText } from 'lucide-react';

export const ModeratorQueue: React.FC = () => {
  const { cases, auditLog, reviewCase, currentUser } = useAppStore();

  const [activeTab, setActiveTab] = useState<'all' | 'flagged' | 'disputes' | 'hotspots'>('all');
  const [selectedCase, setSelectedCase] = useState<ModeratorCase | null>(null);
  const [reviewAction, setReviewAction] = useState<'approved' | 'dismissed' | 'escalated'>('approved');
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Check if current user is Community Anchor
  const isAnchor = currentUser?.tier === 'Community Anchor' || currentUser?.isModerator;

  const filteredCases = cases.filter((c) => {
    if (activeTab === 'flagged') return c.type === 'flagged_ride';
    if (activeTab === 'disputes') return c.type === 'dispute';
    if (activeTab === 'hotspots') return c.type === 'hotspot_nomination';
    return true;
  });

  const handleReviewSubmit = async () => {
    if (!selectedCase) return;
    setSubmitting(true);
    await reviewCase(selectedCase.id, reviewAction, reviewNotes);
    setSubmitting(false);
    setSelectedCase(null);
  };

  return (
    <div className="flex-1 flex flex-col font-mono bg-bg text-text">
      <AppBar
        title="Community Moderator & Audit Console"
        showBack={true}
        pill={<Pill variant="available" label="COMMUNITY ANCHOR" />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
        {/* Eligibility Check Banner */}
        {!isAnchor && (
          <div className="p-4 bg-warn/15 border border-warn/40 rounded-card space-y-1 text-warn text-xs">
            <div className="flex items-center gap-2 font-bold">
              <Lock size={16} /> RESTRICTED ROLE ACCESS
            </div>
            <p>
              Moderator powers are granted to Community Anchor members (Score &ge; 90, 100 clean rides). Switch to Meenakshi Sundaram in the Persona Switcher (top right) to test moderation tools.
            </p>
          </div>
        )}

        {/* Responsive 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Tab filters and Case List */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-5">
            {/* Tab Filters */}
            <Segmented
              options={[
                { value: 'all', label: 'All Cases' },
                { value: 'flagged', label: 'Flagged Rides' },
                { value: 'disputes', label: 'Disputes' },
                { value: 'hotspots', label: 'Hotspot Proposals' },
              ]}
              value={activeTab}
              onChange={(val) => setActiveTab(val as any)}
            />

            {/* Case Cards List (PRD §3.9 I2 & I3) */}
            <div className="space-y-3.5">
              {filteredCases.map((c) => (
                <Card key={c.id} variant="flat" className="space-y-3.5 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-label text-primary-soft text-[10px] uppercase">
                        Case #{c.id} · {c.type.replace('_', ' ')}
                      </span>
                      <h4 className="font-title-m text-white text-base font-semibold mt-0.5">
                        {c.reason}
                      </h4>
                    </div>
                    <Pill
                      variant={c.status === 'pending' ? 'waiting' : 'neutral'}
                      label={c.status.toUpperCase()}
                    />
                  </div>

                  {/* Anonymised Participant IDs */}
                  <div className="p-3 bg-surface-2 rounded-inner border border-border text-xs text-text-2 space-y-1 font-mono">
                    <div>
                      Parties: <span className="text-white font-semibold">{c.anonymisedUserA}</span>
                      {c.anonymisedUserB ? ` vs ${c.anonymisedUserB}` : ''}
                    </div>
                    <p className="text-[11px] text-text-3">{c.details}</p>
                  </div>

                  {/* Conflict of interest warning */}
                  {c.conflictPodId && (
                    <div className="text-[11px] text-warn flex items-center gap-1.5 font-semibold">
                      <AlertTriangle size={14} />
                      <span>Conflict of Interest Flag: Involves members of your pod</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-caption text-text-3 text-[11px]">
                      Submitted {c.submittedAt}
                    </span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedCase(c)}
                      disabled={!isAnchor}
                      className="text-xs py-1.5 px-4"
                    >
                      Review & Adjudicate
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Right Column (5 cols): Immutable Audit Log & Standards */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            {/* Immutable Audit Log Section (PRD §3.9 I2) */}
            <div className="space-y-3">
              <span className="font-label text-text-2 text-xs flex items-center gap-1.5">
                <History size={14} /> IMMUTABLE MODERATOR AUDIT LOG
              </span>
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto no-scrollbar">
                {auditLog.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 bg-surface rounded-inner border border-border text-xs space-y-1.5 shadow-sm"
                  >
                    <div className="flex justify-between text-text-3 font-mono text-[10px]">
                      <span className="text-primary-soft font-semibold">{log.moderatorName}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <div className="text-white font-medium">{log.action}</div>
                    {log.notes && (
                      <div className="text-text-3 text-[11px] italic bg-surface-2 p-2 rounded-inner">
                        "{log.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Anchor Standards */}
            <div className="p-5 bg-surface rounded-card border border-border space-y-2 text-xs text-text-3">
              <div className="flex items-center gap-2 text-white font-semibold">
                <ShieldCheck size={16} className="text-success" />
                <span>Anchor Adjudication Code</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Anchors evaluate logs impartially using anonymised telemetry. All sanctions, trust restorations, and notes are permanently committed to the append-only audit trail.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal BottomSheet */}
      <BottomSheet
        isOpen={!!selectedCase}
        onClose={() => setSelectedCase(null)}
        title={`Adjudicate Case #${selectedCase?.id}`}
      >
        {selectedCase && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-surface-2 rounded-inner border border-border space-y-1">
              <span className="font-label text-primary-soft text-[10px]">INCIDENT SUMMARY</span>
              <p className="text-white font-medium">{selectedCase.details}</p>
            </div>

            <div className="space-y-2">
              <span className="font-label text-text-2">DECISION RULING</span>
              <div className="grid grid-cols-3 gap-2">
                {(['approved', 'dismissed', 'escalated'] as const).map((act) => (
                  <button
                    key={act}
                    onClick={() => setReviewAction(act)}
                    className={`py-2 px-3 rounded-inner border text-xs font-semibold capitalize transition-all ${
                      reviewAction === act
                        ? 'bg-primary text-white border-primary-soft shadow-md'
                        : 'bg-surface text-text-3 border-border hover:bg-surface-2'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-label text-text-2">AUDIT REASON JUSTIFICATION</span>
              <textarea
                placeholder="State your justification for this ruling (recorded permanently in immutable audit log)..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full h-20 bg-surface-2 border border-border rounded-input p-3 text-white text-xs outline-none focus:border-primary-soft"
              />
            </div>

            <Button
              variant="primary"
              onClick={handleReviewSubmit}
              loading={submitting}
              className="w-full text-xs font-semibold shadow-md"
            >
              Sign & Commit to Immutable Audit Log
            </Button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
