import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Wind, 
  BookOpen, 
  Music, 
  Clock, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  Flame,
  Heart
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
    switch (category) {
      case 'somatic':
        return <Wind className="w-4 h-4" />;
      case 'cognitive':
        return <BookOpen className="w-4 h-4" />;
      case 'sonic':
        return <Music className="w-4 h-4" />;
      case 'mindful':
        return <Flame className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const handleActionClick = () => {
    setHasEngaged(true);
    logRecommendationEngagement(item.id, mood, item.action.type);
    onTriggerAction(item);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.35,
        delay,
        ease: [0.34, 1.56, 0.64, 1],
      }}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl bg-gradient-to-b from-[#24214A]/90 to-[#181636]/95 p-6 backdrop-blur-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
      style={{
        boxShadow: `0 0 0 1px ${item.accentColor}35, 0 10px 30px -5px rgba(10,8,28,0.85)`,
      }}
    >
      {/* Top Luminous Accent Strip */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-70 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, ${item.accentColor}, transparent)`,
        }}
      />

      <div>
        {/* Header Row: Category Badge, Kanji & Duration */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center border"
              style={{
                backgroundColor: `${item.accentColor}18`,
                borderColor: `${item.accentColor}40`,
                color: item.accentColor,
              }}
            >
              {getCategoryIcon(item.category)}
            </div>
            <div>
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-wider block"
                style={{ color: item.accentColor }}
              >
                {item.tag}
              </span>
              <span className="text-xs text-[#B8B4D9] font-heading font-semibold">
                {item.kanji}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#121029]/80 border border-[#B8B4D9]/15 text-[11px] font-mono text-[#B8B4D9]">
            <Clock className="w-3 h-3 text-[#FFC978]" />
            <span>{item.durationText}</span>
          </div>
        </div>

        {/* Title and Subtitle */}
        <h3 className="font-heading text-xl font-bold text-[#F5F2ED] mb-1 group-hover:text-[#FFC978] transition-colors">
          {item.title}
        </h3>
        <div className="text-xs text-[#6FBFC4] font-medium mb-3">
          {item.subtitle}
        </div>

        {/* Description Body */}
        <p className="text-xs sm:text-sm text-[#B8B4D9] leading-relaxed mb-4">
          {item.description}
        </p>

        {/* Optional Shinkai Quote */}
        {item.quote && (
          <div className="p-3 rounded-xl bg-[#121029]/70 border border-[#FFC978]/25 mb-4 relative">
            <p className="text-xs italic text-[#FFF2D6] font-heading leading-relaxed mb-1">
              "{item.quote.text}"
            </p>
            <span className="text-[10px] text-[#FFC978] block text-right font-medium">
              — {item.quote.author}
            </span>
          </div>
        )}
      </div>

      {/* Action CTA Button */}
      <div className="pt-4 border-t border-[#B8B4D9]/15 flex items-center justify-between gap-3">
        <button
          onClick={handleActionClick}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
            hasEngaged
              ? 'bg-[#2D2A5C] text-[#6FBFC4] border border-[#6FBFC4]/40'
              : 'text-[#1A1836] shadow-glow-sm hover:opacity-95'
          }`}
          style={{
            backgroundColor: hasEngaged ? undefined : item.accentColor,
          }}
        >
          {hasEngaged ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-[#6FBFC4]" />
              <span>Shift Engaged</span>
            </>
          ) : (
            <>
              <span>{item.action.label}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {hasEngaged && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="p-2 rounded-lg bg-[#FFC978]/15 text-[#FFC978]"
          >
            <Heart className="w-4 h-4 fill-[#FFC978]" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
