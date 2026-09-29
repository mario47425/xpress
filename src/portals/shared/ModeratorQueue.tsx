import React, { useState } from 'react';
import { AppBar } from '../../layouts/AppBar';
import { Card } from '../../components/primitives/Card';
import { Button } from '../../components/primitives/Button';
import { Pill } from '../../components/primitives/Pill';
import { Segmented } from '../../components/primitives/Segmented';
import { BottomSheet } from '../../components/primitives/BottomSheet';
import { useAppStore } from '../../store/useAppStore';
import { ModeratorCase } from '../../types';
import { Gavel, AlertTriangle, ShieldCheck, CheckCircle2, Lock, History } from 'lucide-react';

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
        title="Moderator Queue"
        showBack={true}
        pill={<Pill variant="available" label="COMMUNITY ANCHOR" />}
      />

      <div className="flex-1 overflow-y-auto p-5 space-y-5 pb-8 no-scrollbar">
        {/* Eligibility Check Banner */}
        {!isAnchor && (
          <div className="p-4 bg-warn/15 border border-warn/40 rounded-card space-y-1 text-warn text-xs">
            <div className="flex items-center gap-2 font-bold">
              <Lock size={16} /> RESTRICTED ROLE ACCESS
            </div>
            <p>
              Moderator powers are granted to Community Anchor members (Score &ge; 90, 100 clean rides). Switch to Meenakshi Sundaram in the Dev Panel to test moderation tools.
            </p>
          </div>
        )}

        {/* Tab Filters */}
        <Segmented
          options={[
            { value: 'all', label: 'All Cases' },
            { value: 'flagged', label: 'Flags' },
            { value: 'disputes', label: 'Disputes' },
            { value: 'hotspots', label: 'Hotspots' },
          ]}
          value={activeTab}
          onChange={(val) => setActiveTab(val as any)}
        />

        {/* Case Cards List (PRD §3.9 I2 & I3) */}
        <div className="space-y-3">
          {filteredCases.map((c) => (
            <Card key={c.id} variant="flat" className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label text-primary-soft text-[10px] uppercase">
                    Case #{c.id} · {c.type.replace('_', ' ')}
                  </span>
                  <h4 className="font-title-m text-white text-sm font-semibold mt-0.5">
                    {c.reason}
                  </h4>
                </div>
                <Pill
                  variant={c.status === 'pending' ? 'waiting' : 'neutral'}
                  label={c.status.toUpperCase()}
                />
              </div>

              {/* Anonymised Participant IDs */}
              <div className="p-2.5 bg-surface-2 rounded-inner border border-border text-xs text-text-2 space-y-1">
                <div>
                  Parties: <span className="text-white">{c.anonymisedUserA}</span>
                  {c.anonymisedUserB ? ` vs ${c.anonymisedUserB}` : ''}
                </div>
                <p className="text-[11px] text-text-3 font-mono">{c.details}</p>
              </div>

              {/* Conflict of interest warning */}
              {c.conflictPodId && (
                <div className="text-[10px] text-warn flex items-center gap-1 font-semibold">
                  <AlertTriangle size={12} />
                  <span>Conflict flag: Involves members of Velachery Pod</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="font-caption text-text-3 text-[11px]">
                  Submitted {c.submittedAt}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedCase(c)}
                  disabled={!isAnchor}
                  className="text-xs py-1.5 px-3"
                >
                  Review Case
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Immutable Audit Log Section (PRD §3.9 I2) */}
        <div className="space-y-2 pt-2">
          <span className="font-label text-text-2 flex items-center gap-1.5">
            <History size={14} /> IMMUTABLE MODERATOR AUDIT LOG
          </span>
          <div className="space-y-2">
            {auditLog.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-surface rounded-inner border border-border text-xs space-y-1"
              >
                <div className="flex justify-between text-text-3 font-mono text-[10px]">
                  <span>{log.moderatorName}</span>
                  <span>{log.timestamp}</span>
                </div>
                <div className="text-white font-medium">{log.action}</div>
                {log.notes && <div className="text-text-3 text-[11px] italic">Note: {log.notes}</div>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Modal BottomSheet */}
      <BottomSheet
        isOpen={!!selectedCase}
        onClose={() => setSelectedCase(null)}
        title={`Review Case #${selectedCase?.id}`}
      >
        {selectedCase && (
          <div className="space-y-4 font-mono text-xs">
            <div className="p-3 bg-surface-2 rounded-inner border border-border space-y-1">
              <span className="font-label text-primary-soft text-[10px]">SUMMARY</span>
              <p className="text-white font-medium">{selectedCase.details}</p>
            </div>

            <div className="space-y-2">
              <span className="font-label text-text-2">DECISION ACTION</span>
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
              <span className="font-label text-text-2">AUDIT REASON NOTES</span>
              <textarea
                placeholder="State your justification for this decision (recorded in immutable audit log)..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full h-20 bg-surface-2 border border-border rounded-input p-3 text-white text-xs outline-none focus:border-primary-soft"
              />
            </div>

            <Button
              variant="primary"
              onClick={handleReviewSubmit}
              loading={submitting}
              className="w-full"
            >
              Sign & Commit to Audit Log
            </Button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
