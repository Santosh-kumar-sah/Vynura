import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Award, 
  Lock, 
  CheckCircle2, 
  Star, 
  Flame, 
  Moon, 
  Sun, 
  Orbit 
} from 'lucide-react';

export interface StarBadge {
  id: string;
  title: string;
  tag: string;
  description: string;
  requirement: string;
  icon: React.ReactNode;
  accentColor: string;
  isUnlocked: boolean;
  progressText: string;
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
      tag: 'First Light',
      description: 'Awakened your very first starlight reflection in the looking glass.',
      requirement: 'Complete 1 Biometric Calibration',
      icon: <Star className="w-5 h-5" />,
      accentColor: '#FFC978',
      isUnlocked: calibrationsCount >= 1,
      progressText: 'Unlocked ✦',
    },
    {
      id: 'b2',
      title: 'Orion Weaver',
      tag: '3-Day Streak',
      description: 'Sustained emotional continuity for 3 consecutive days.',
      requirement: '3-Day Calibration Streak',
      icon: <Flame className="w-5 h-5" />,
      accentColor: '#FF9E7D',
      isUnlocked: streakDays >= 3,
      progressText: streakDays >= 3 ? 'Unlocked ✦' : `${streakDays}/3 Days`,
    },
    {
      id: 'b3',
      title: 'Cassiopeia Crown',
      tag: '7-Day Crown',
      description: 'Formed a complete 7-day constellation cluster in your night sky.',
      requirement: '7-Day Continuous Streak',
      icon: <Award className="w-5 h-5" />,
      accentColor: '#6FBFC4',
      isUnlocked: streakDays >= 7,
      progressText: streakDays >= 7 ? 'Unlocked ✦' : `${streakDays}/7 Days`,
    },
    {
      id: 'b4',
      title: 'Harmonic Alchemist',
      tag: '5 Harmonics',
      description: 'Observed and calibrated across all 5 emotional frequencies.',
      requirement: 'Experience 5 Harmonic Moods',
      icon: <Orbit className="w-5 h-5" />,
      accentColor: '#C25AE0',
      isUnlocked: calibrationsCount >= 5,
      progressText: '5 / 5 Harmonics',
    },
    {
      id: 'b5',
      title: 'Zenith Master',
      tag: 'Mastery',
      description: 'Completed 10 full somatic firefly particle breathing cycles.',
      requirement: 'Complete 10 Breath Cycles',
      icon: <Moon className="w-5 h-5" />,
      accentColor: '#6FBFC4',
      isUnlocked: true,
      progressText: 'Mastered ✦',
    },
    {
      id: 'b6',
      title: 'Supernova Guardian',
      tag: 'Guardian',
      description: 'Inscribed 30 starlight reflections into your permanent constellation.',
      requirement: '30 Total Inscriptions',
      icon: <Sun className="w-5 h-5" />,
      accentColor: '#FFC978',
      isUnlocked: calibrationsCount >= 30,
      progressText: `${calibrationsCount}/30 Stars`,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FFC978] mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Constellation Milestone Clusters · Honors</span>
          </div>
          <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F2ED]">
            Unlocked Star Badges & Constellations
          </h3>
        </div>

        <div className="px-3.5 py-1.5 rounded-full bg-[#24214A] border border-[#FFC978]/30 text-xs font-mono font-bold text-[#FFC978]">
          {badges.filter((b) => b.isUnlocked).length} / {badges.length} Unlocked
        </div>
      </div>

      {/* Grid of Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge, idx) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.06, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
              badge.isUnlocked
                ? 'bg-gradient-to-b from-[#24214A]/90 to-[#181636]/95 hover:scale-[1.02]'
                : 'bg-[#14122C]/70 border-[#B8B4D9]/15 opacity-70'
            }`}
            style={{
              borderColor: badge.isUnlocked ? `${badge.accentColor}50` : undefined,
              boxShadow: badge.isUnlocked ? `0 8px 30px -5px ${badge.accentColor}25` : undefined,
            }}
          >
            {/* Top Accent Strip */}
            {badge.isUnlocked && (
              <div
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${badge.accentColor}, transparent)`,
                }}
              />
            )}

            <div>
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-glow-sm"
                  style={{
                    backgroundColor: badge.isUnlocked ? `${badge.accentColor}20` : '#1A1836',
                    borderColor: badge.isUnlocked ? `${badge.accentColor}60` : '#2D2A5C',
                    color: badge.isUnlocked ? badge.accentColor : '#B8B4D9',
                  }}
                >
                  {badge.icon}
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono font-bold" style={{ color: badge.accentColor }}>
                    {badge.tag}
                  </span>
                  {badge.isUnlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-[#6FBFC4]" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-[#B8B4D9]" />
                  )}
                </div>
              </div>

              <h4 className="font-heading text-base font-bold text-[#F5F2ED] mb-1">
                {badge.title}
              </h4>

              <p className="text-xs text-[#B8B4D9] leading-relaxed mb-4">
                {badge.description}
              </p>
            </div>

            <div className="pt-3 border-t border-[#B8B4D9]/10 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#B8B4D9]">{badge.requirement}</span>
              <span
                className="font-mono font-bold text-[11px]"
                style={{ color: badge.isUnlocked ? badge.accentColor : '#B8B4D9' }}
              >
                {badge.progressText}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
