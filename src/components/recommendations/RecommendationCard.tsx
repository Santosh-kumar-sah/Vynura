import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wind, 
  BookOpen, 
  Music, 
  Flame, 
  Sparkles, 
  ArrowUpRight, 
  Check 
} from 'lucide-react';
import type { RecommendationItem } from '../../types/recommendations';
import type { MoodType } from '../../types';
import { logRecommendationEngagement } from '../../utils/recommendationLogger';

interface RecommendationCardProps {
  item: RecommendationItem;
  mood: MoodType;
  delay?: number;
  onTriggerAction: (item: RecommendationItem) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  item,
  mood,
  delay = 0,
  onTriggerAction,
}) => {
  const [hasEngaged, setHasEngaged] = useState(false);

  const getCategoryIcon = (category: RecommendationItem['category']) => {
    const iconClass = "w-4 h-4 text-white/60 stroke-[1.5]";
    switch (category) {
      case 'somatic':
        return <Wind className={iconClass} />;
      case 'cognitive':
        return <BookOpen className={iconClass} />;
      case 'sonic':
        return <Music className={iconClass} />;
      case 'mindful':
        return <Flame className={iconClass} />;
      default:
        return <Sparkles className={iconClass} />;
    }
  };

  const handleActionClick = () => {
    setHasEngaged(true);
    logRecommendationEngagement(item.id, mood, item.action.type);
    onTriggerAction(item);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.35,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative rounded-2xl bg-[#121316] border border-white/[0.08] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)] p-6 flex flex-col justify-between"
    >
      <div>
        {/* Header Row: Plain Thin-Stroke Icon, Category Tag & Duration */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            {getCategoryIcon(item.category)}
            <span className="text-[11px] font-mono text-white/50 uppercase tracking-wider">
              {item.tag}
            </span>
          </div>

          <div className="text-[11px] font-mono text-white/45">
            {item.durationText}
          </div>
        </div>

        {/* Title and Subtitle */}
        <h3 className="text-lg font-semibold text-white tracking-tight mb-1">
          {item.title}
        </h3>
        <div className="text-xs text-white/50 mb-3">
          {item.subtitle}
        </div>

        {/* Description Body */}
        <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-6">
          {item.description}
        </p>
      </div>

      {/* Action CTA Button */}
      <div className="pt-4 border-t border-white/[0.06]">
        <button
          onClick={handleActionClick}
          className={`w-full py-2.5 px-4 rounded-lg text-xs font-medium transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97] ${
            hasEngaged
              ? 'bg-white/[0.06] text-white/70 border border-white/[0.1]'
              : 'bg-white text-[#08090A] hover:bg-neutral-100 font-semibold'
          }`}
        >
          {hasEngaged ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>Shift Active</span>
            </>
          ) : (
            <>
              <span>{item.action.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};
