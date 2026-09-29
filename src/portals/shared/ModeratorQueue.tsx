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
    <div className="flex-1 flex flex-col bg-bg text-text">
      <AppBar
        title="Community Moderator & Audit Console"
        showBack={true}
        pill={<Pill variant="available" label="COMMUNITY ANCHOR" />}
      />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 no-scrollbar">
        {/* Eligibility Check Banner */}
        {!isAnchor && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-card space-y-1 text-amber-700 text-xs">
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
            <div className="space-y-4">
              {filteredCases.map((c) => (
                <Card key={c.id} variant="flat" className="space-y-4 p-5 sm:p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-label text-primary text-xs font-bold uppercase tracking-wider">
                        Case #{c.id} · {c.type.replace('_', ' ')}
                      </span>
                      <h4 className="font-title-m text-text text-base sm:text-lg font-bold mt-1">
                        {c.reason}
                      </h4>
                    </div>
                    <Pill
                      variant={c.status === 'pending' ? 'waiting' : 'neutral'}
                      label={c.status.toUpperCase()}
                    />
                  </div>

                  {/* Anonymised Participant IDs */}
                  <div className="p-3.5 bg-surface-2 rounded-inner border border-border text-xs text-text-muted space-y-1.5">
                    <div>
                      Parties: <span className="text-text font-bold">{c.anonymisedUserA}</span>
                      {c.anonymisedUserB ? ` vs ${c.anonymisedUserB}` : ''}
                    </div>
                    <p className="text-xs text-text-muted leading-relaxed">{c.details}</p>
                  </div>

                  {/* Conflict of interest warning */}
                  {c.conflictPodId && (
                    <div className="text-xs text-amber-600 flex items-center gap-1.5 font-semibold">
                      <AlertTriangle size={15} />
                      <span>Conflict of Interest Flag: Involves members of your pod</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-caption text-text-muted text-xs">
                      Submitted {c.submittedAt}
                    </span>
                    <Button
                      variant="primary"
                      size="default"
                      onClick={() => setSelectedCase(c)}
                      disabled={!isAnchor}
                      className="text-xs font-semibold px-4 min-h-[44px]"
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
              <span className="font-label text-text font-bold text-xs flex items-center gap-1.5 tracking-wider">
                <History size={16} /> IMMUTABLE MODERATOR AUDIT LOG
              </span>
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto no-scrollbar">
                {auditLog.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 bg-surface rounded-card border border-border text-xs space-y-1.5 shadow-card"
                  >
                    <div className="flex justify-between text-text-muted text-[11px]">
                      <span className="text-primary font-bold">{log.moderatorName}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <div className="text-text font-semibold text-sm">{log.action}</div>
                    {log.notes && (
                      <div className="text-text-muted text-xs italic bg-surface-2 p-2.5 rounded-inner border border-border/50">
                        "{log.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Anchor Standards */}
            <div className="p-5 bg-surface rounded-card border border-border shadow-card space-y-2.5 text-xs text-text-muted">
              <div className="flex items-center gap-2 text-text font-semibold">
                <ShieldCheck size={18} className="text-success" />
                <span className="text-sm">Anchor Adjudication Code</span>
              </div>
              <p className="text-xs leading-relaxed font-normal">
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
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-surface-2 rounded-inner border border-border space-y-1">
              <span className="font-label text-primary text-[11px] font-bold">INCIDENT SUMMARY</span>
              <p className="text-text font-medium text-xs leading-relaxed">{selectedCase.details}</p>
            </div>

            <div className="space-y-2">
              <span className="font-label text-text font-bold text-xs">DECISION RULING</span>
              <div className="grid grid-cols-3 gap-2">
                {(['approved', 'dismissed', 'escalated'] as const).map((act) => (
                  <button
                    key={act}
                    onClick={() => setReviewAction(act)}
                    className={`min-h-[44px] py-2.5 px-3 rounded-btn border text-xs font-semibold capitalize transition-all ${
                      reviewAction === act
                        ? 'bg-primary text-white border-transparent shadow-md'
                        : 'bg-surface text-text-muted border-border hover:bg-surface-2 hover:text-text'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="font-label text-text font-bold text-xs">AUDIT REASON JUSTIFICATION</span>
              <textarea
                placeholder="State your justification for this ruling (recorded permanently in immutable audit log)..."
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                className="w-full h-24 bg-surface-2 border border-border rounded-input p-3 text-text text-xs outline-none focus:border-primary transition-colors"
              />
            </div>

            <Button
              variant="primary"
              onClick={handleReviewSubmit}
              loading={submitting}
              className="w-full text-xs font-semibold shadow-md min-h-[48px]"
            >
              Sign & Commit to Immutable Audit Log
            </Button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
};
