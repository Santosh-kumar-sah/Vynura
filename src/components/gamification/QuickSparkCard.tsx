import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Flame,
  Clock,
  CheckCircle2,
  Trophy,
  Zap,
  PenTool,
  Palette,
  Wand2,
  Activity,
  RotateCw,
  Compass,
  Droplets,
  Eye,
  Volume2,
  Send,
  Mic,
  HeartHandshake,
  Music,
  ArrowRight,
  Share2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { SparkActivity, SparkCompletionResult, SparkStreak } from '../../types/sparks';
import { completeSparkActivity, getSparkStreak } from '../../utils/sparkSelector';
import { SparkShareCard } from './SparkShareCard';

interface QuickSparkCardProps {
  activity: SparkActivity;
  onCompleted?: (activity: SparkActivity, result: SparkCompletionResult) => void;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Sparkles,
  Flame,
  Zap,
  PenTool,
  Palette,
  Wand2,
  Activity,
  RotateCw,
  Compass,
  Droplets,
  Eye,
  Volume2,
  Send,
  Mic,
  HeartHandshake,
  Music,
};

export const QuickSparkCard: React.FC<QuickSparkCardProps> = ({
  activity,
  onCompleted,
}) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [completionResult, setCompletionResult] = useState<SparkCompletionResult | null>(null);
  const [streak, setStreak] = useState<SparkStreak | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  useEffect(() => {
    getSparkStreak().then((s) => setStreak(s));
  }, []);

  const handleIgnite = async () => {
    if (isSubmitting || isCompleted) return;
    setIsSubmitting(true);

    // Trigger radiant celebration confetti
    try {
      confetti({
        particleCount: 45,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#FFC978', '#FFAE68', '#78FFD6', '#FFF2D6'],
      });
    } catch {
      // Ignore confetti if not supported
    }

    const result = await completeSparkActivity(activity.id);
    setIsCompleted(true);
    setCompletionResult(result);
    setStreak(result.streak);
    setIsSubmitting(false);

    // Auto-open shareable card modal after ignition
    setTimeout(() => {
      setIsShareModalOpen(true);
    }, 450);

    if (onCompleted) {
      onCompleted(activity, result);
    }
  };

  const IconComponent = ICON_MAP[activity.iconName] || Sparkles;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative rounded-2xl p-6 sm:p-7 overflow-hidden border border-white/[0.08] bg-[#121316] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] group transition-colors"
      >
        {/* Top Header Badge & Micro-Timer */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md text-xs font-mono font-medium uppercase tracking-wider bg-white/[0.04] border border-white/[0.08] text-neutral-300 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              <span>Micro-Shift Prompt</span>
            </span>

            <span className="px-2.5 py-1 rounded-md text-[11px] font-mono capitalize border border-white/[0.06] text-neutral-400 bg-white/[0.02]">
              {activity.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-neutral-400">
            <Clock className="w-3.5 h-3.5 text-neutral-400" />
            <span>{activity.durationSeconds}s Micro-Burst</span>
          </div>
        </div>

        {/* Activity Core Details */}
        <div className="space-y-3 mb-6 relative z-10">
          <div className="flex items-start gap-3.5">
            <IconComponent className="w-5 h-5 text-amber-400 mt-1 shrink-0" strokeWidth={1.5} />

            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                {activity.title}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {activity.instructions}
              </p>
            </div>
          </div>

          {activity.promptExample && (
            <div className="p-3 rounded-lg bg-[#18191c] border border-white/[0.06] text-xs text-neutral-300 font-mono flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <span>Example: {activity.promptExample}</span>
            </div>
          )}
        </div>

        {/* Action / Completion Status Bar */}
        <div className="relative z-10 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Streak Counter Chip */}
          <div className="flex items-center gap-2.5 text-xs text-neutral-400 font-mono">
            <div className="flex items-center gap-1.5 text-amber-400 font-medium">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-white">{streak?.current_streak || 0}</span>
              <span className="text-neutral-400">day streak</span>
            </div>
            <span className="text-white/20">•</span>
            <span>Best: {streak?.longest_streak || 0}</span>
          </div>

          {/* Completion Button / Feedback */}
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <div className="flex items-center gap-2">
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-lg"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Action Logged</span>
                </motion.div>

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Summary</span>
                </button>
              </div>
            ) : (
              <motion.button
                key="ignite-btn"
                onClick={handleIgnite}
                disabled={isSubmitting}
                whileTap={{ scale: 0.98 }}
                className="px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-neutral-950 font-medium text-xs tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-sm"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{isSubmitting ? 'Logging...' : 'Mark Completed'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Gentle Soft Messaging when streak broke */}
        {completionResult && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-neutral-400 font-mono flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>{completionResult.message}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Shareable Starlight Card Modal (Social Loop) */}
      <SparkShareCard
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        activity={activity}
        streak={streak || { current_streak: 1, longest_streak: 1, last_completed_date: null }}
      />
    </>
  );
};
