import React from 'react';

export interface StarBadge {
  id: string;
  title: string;
  tag: string;
  description: string;
  requirement: string;
  isUnlocked: boolean;
  progressText: string;
  progressPercent: number;
}

interface StarBadgeGridProps {
  streakDays?: number;
  calibrationsCount?: number;
}

export const StarBadgeGrid: React.FC<StarBadgeGridProps> = ({
  streakDays = 7,
  calibrationsCount = 12,
}) => {
  const badges: StarBadge[] = [
    {
      id: 'b1',
      title: 'First Light',
      tag: 'Calibration',
      description: 'Initial biometric calibration completed in local session.',
      requirement: '1 Calibration',
      isUnlocked: calibrationsCount >= 1,
      progressText: 'Unlocked',
      progressPercent: 100,
    },
    {
      id: 'b2',
      title: 'Orion Weaver',
      tag: 'Streak',
      description: 'Maintained longitudinal resonance continuity for 3 consecutive days.',
      requirement: '3-Day Streak',
      isUnlocked: streakDays >= 3,
      progressText: streakDays >= 3 ? 'Unlocked' : `${streakDays}/3 Days`,
      progressPercent: Math.min(100, Math.round((streakDays / 3) * 100)),
    },
    {
      id: 'b3',
      title: 'Cassiopeia Cluster',
      tag: 'Streak',
      description: 'Formed a complete 7-day longitudinal checkpoint chain.',
      requirement: '7-Day Streak',
      isUnlocked: streakDays >= 7,
      progressText: streakDays >= 7 ? 'Unlocked' : `${streakDays}/7 Days`,
      progressPercent: Math.min(100, Math.round((streakDays / 7) * 100)),
    },
    {
      id: 'b4',
      title: 'Harmonic Spectrum',
      tag: 'Coverage',
      description: 'Recorded telemetry across all 5 discrete emotional frequencies.',
      requirement: '5 Emotional Frequencies',
      isUnlocked: calibrationsCount >= 5,
      progressText: '5 / 5 States',
      progressPercent: 100,
    },
    {
      id: 'b5',
      title: 'Parasympathetic Master',
      tag: 'Pacing',
      description: 'Completed 10 full somatic breath pacing protocols.',
      requirement: '10 Breath Sessions',
      isUnlocked: true,
      progressText: 'Completed',
      progressPercent: 100,
    },
    {
      id: 'b6',
      title: 'Longitudinal Guardian',
      tag: 'Retention',
      description: 'Recorded 30 client-side checkpoints in memory.',
      requirement: '30 Total Checkpoints',
      isUnlocked: calibrationsCount >= 30,
      progressText: `${calibrationsCount}/30 Checkpoints`,
      progressPercent: Math.min(100, Math.round((calibrationsCount / 30) * 100)),
    },
  ];

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <div className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/50 mb-1">
            Trajectory Milestones
          </div>
          <h3 className="text-xl font-semibold text-white tracking-tight">
            Longitudinal Milestones
          </h3>
        </div>

        <div className="text-xs font-mono text-white/60">
          <span className="text-white font-semibold">{unlockedCount} of {badges.length}</span> Unlocked
        </div>
      </div>

      {/* Flat, Icon-Free Compact Progress List (Single-level unboxed layout) */}
      <div className="divide-y divide-white/[0.06] border-b border-white/[0.06]">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
          >
            <div className="sm:w-1/2 space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="text-sm font-semibold text-white">
                  {badge.title}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-white/40">
                  {badge.tag}
                </span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed max-w-md">
                {badge.description}
              </p>
            </div>

            {/* Requirement & Progress Bar */}
            <div className="sm:w-1/3 flex flex-col items-end space-y-2">
              <div className="w-full flex items-center justify-between text-xs font-mono">
                <span className="text-white/45 text-[11px]">{badge.requirement}</span>
                <span className={badge.isUnlocked ? 'text-emerald-400 font-medium' : 'text-white/60'}>
                  {badge.progressText}
                </span>
              </div>
              {/* Thin 2px progress track */}
              <div className="w-full h-1 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    badge.isUnlocked ? 'bg-emerald-400' : 'bg-[#F59E0B]'
                  }`}
                  style={{ width: `${badge.progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
