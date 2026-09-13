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
        initial={{ opacity: 0, y: 25, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative rounded-3xl p-6 sm:p-7 overflow-hidden border border-[#FFC978]/40 shadow-[0_12px_45px_rgba(255,201,120,0.18)] backdrop-blur-xl group transition-all duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(36, 33, 74, 0.95) 0%, rgba(26, 24, 54, 0.98) 50%, rgba(18, 16, 41, 0.95) 100%)',
        }}
      >
        {/* Radiant Starlight Shimmer Animation Layer */}
        <motion.div
          className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-[#FFC978]/10 to-transparent pointer-events-none"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 4.5,
            ease: 'easeInOut',
            repeatDelay: 2,
          }}
        />

        {/* Top Header Badge & Micro-Timer */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-[#FFC978]/20 border border-[#FFC978]/50 text-[#FFC978] flex items-center gap-1.5 shadow-glow-sm">
              <Flame className="w-3.5 h-3.5 animate-pulse text-[#FFC978]" />
              <span>Daily Quick Spark · Amplify Surge</span>
            </span>

            <span className="px-2.5 py-1 rounded-full text-[11px] font-mono capitalize border border-[#B8B4D9]/25 text-[#B8B4D9] bg-[#121029]/60">
              {activity.category}
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#121029]/80 border border-[#FFC978]/30 text-xs font-mono text-[#FFC978]">
            <Clock className="w-3.5 h-3.5 text-[#FFC978]" />
            <span>{activity.durationSeconds}s Micro-Burst</span>
          </div>
        </div>

        {/* Activity Core Details */}
        <div className="space-y-3 mb-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#FFC978]/25 to-[#FFAE68]/15 border border-[#FFC978]/40 text-[#FFC978] shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-300">
              <IconComponent className="w-6 h-6 text-[#FFC978]" />
            </div>

            <div className="space-y-1">
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F2ED] tracking-tight group-hover:text-[#FFF2D6] transition-colors">
                {activity.title}
              </h3>
              <p className="text-sm text-[#B8B4D9] leading-relaxed">
                {activity.instructions}
              </p>
            </div>
          </div>

          {activity.promptExample && (
            <div className="p-3 rounded-xl bg-[#121029]/70 border border-[#FFC978]/20 text-xs text-[#FFC978]/90 italic font-mono flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 shrink-0 text-[#FFC978]" />
              <span>Spark idea: {activity.promptExample}</span>
            </div>
          )}
        </div>

        {/* Action / Completion Status Bar */}
        <div className="relative z-10 pt-2 border-t border-[#B8B4D9]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Streak Counter Chip */}
          <div className="flex items-center gap-2.5 text-xs text-[#B8B4D9] font-mono">
            <div className="flex items-center gap-1 text-[#FFC978]">
              <Trophy className="w-4 h-4 text-[#FFC978]" />
              <span className="font-bold">{streak?.current_streak || 0}</span>
              <span>day streak</span>
            </div>
            <span className="text-[#B8B4D9]/40">•</span>
            <span>Best: {streak?.longest_streak || 0}</span>
          </div>

          {/* Completion Button / Feedback */}
          <AnimatePresence mode="wait">
            {isCompleted ? (
              <div className="flex items-center gap-2">
                <motion.div
                  key="completed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                  className="flex items-center gap-2 text-xs font-bold text-[#78FFD6] bg-[#78FFD6]/15 border border-[#78FFD6]/40 px-3.5 py-2 rounded-xl"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#78FFD6]" />
                  <span>Spark Ignited! ✦</span>
                </motion.div>

                <button
                  onClick={() => setIsShareModalOpen(true)}
                  className="px-3.5 py-2 rounded-xl bg-[#FFC978]/20 hover:bg-[#FFC978]/30 border border-[#FFC978]/50 text-xs font-bold text-[#FFC978] transition-all flex items-center gap-1.5 cursor-pointer shadow-glow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Card</span>
                </button>
              </div>
            ) : (
              <motion.button
                key="ignite-btn"
                onClick={handleIgnite}
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFC978] to-[#FFAE68] text-[#1A1836] font-bold text-xs tracking-wide transition-all shadow-[0_4px_20px_rgba(255,201,120,0.4)] hover:shadow-[0_6px_25px_rgba(255,201,120,0.6)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>{isSubmitting ? 'Igniting...' : 'I Did This! Stoke the Spark ✦'}</span>
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
            className="mt-4 pt-3 border-t border-[#FFC978]/20 text-xs text-[#FFF2D6] font-mono flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FFC978] shrink-0" />
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
