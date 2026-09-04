import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Wind, 
  BookOpen, 
  Music, 
  Sparkles, 
  CheckCircle2, 
  Volume2, 
  Moon, 
  ArrowRight 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { RecommendationItem } from '../../types/recommendations';
import type { MoodType } from '../../types';
import type { MeditationCategoryId } from '../../types/meditation';
import { Button } from '../common/Button';
import { saveMoodEntry } from '../../lib/supabase';

interface ActionModalProps {
  item: RecommendationItem | null;
  mood: MoodType;
  isOpen: boolean;
  onClose: () => void;
  onLaunchBreathing?: (technique: '478' | 'box' | 'calm') => void;
  onLaunchMeditation?: (category?: MeditationCategoryId) => void;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  item,
  mood,
  isOpen,
  onClose,
  onLaunchBreathing,
  onLaunchMeditation,
}) => {
  const navigate = useNavigate();
  const [journalText, setJournalText] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen || !item) return null;

  const handleSaveJournal = async () => {
    if (!journalText.trim()) return;
    try {
      await saveMoodEntry({
        mood_category: mood,
        confidence_score: 0.94,
        journal_text: `[${item.title}] ${journalText.trim()}`,
      });
      setIsSaved(true);
      setTimeout(() => {
        onClose();
        setIsSaved(false);
        setJournalText('');
      }, 1200);
    } catch (e) {
      console.error('Error saving entry:', e);
    }
  };

  // Determine category mapping based on mood
  const getCategoryForMood = (): MeditationCategoryId => {
    switch (mood) {
      case 'happy':
        return 'joy';
      case 'sad':
        return 'healing';
      case 'energetic':
        return 'focus';
      case 'calm':
        return 'calm';
      default:
        return 'starlight';
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0B091C]/85 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#24214A] via-[#1A1836] to-[#121029] border p-6 sm:p-8 shadow-[0_25px_70px_rgba(10,8,28,0.95)] overflow-hidden"
        style={{
          borderColor: `${item.accentColor}50`,
          boxShadow: `0 0 35px -5px ${item.accentColor}30`,
        }}
      >
        {/* Top Rim Glow */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${item.accentColor}, transparent)`,
          }}
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#B8B4D9] hover:text-[#F5F2ED] hover:bg-[#2D2A5C]/60 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-glow-sm"
            style={{
              backgroundColor: `${item.accentColor}20`,
              borderColor: `${item.accentColor}60`,
              color: item.accentColor,
            }}
          >
            {item.category === 'somatic' ? (
              <Wind className="w-5 h-5" />
            ) : item.category === 'cognitive' ? (
              <BookOpen className="w-5 h-5" />
            ) : (
              <Music className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-widest"
                style={{ color: item.accentColor }}
              >
                {item.tag} · {item.durationText}
              </span>
              <span className="text-xs text-[#FFC978] font-heading">{item.kanji}</span>
            </div>
            <h3 className="font-heading text-xl font-bold text-[#F5F2ED]">
              {item.title}
            </h3>
          </div>
        </div>

        {/* Dynamic Action Body based on action type */}
        {item.action.type === 'breathing' && (
          <div className="text-center py-3 space-y-5">
            <div className="p-4 rounded-2xl bg-[#121029]/80 border border-[#6FBFC4]/30 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#6FBFC4] mb-1.5">
                <Wind className="w-4 h-4" />
                <span>Somatic Breath Guidance</span>
              </div>
              <p className="text-xs text-[#B8B4D9] leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                size="lg"
                variant="primary"
                className="w-full"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  onClose();
                  const tech = item.id.includes('box') ? 'box' : item.id.includes('478') ? '478' : 'calm';
                  if (onLaunchBreathing) {
                    onLaunchBreathing(tech);
                  } else {
                    navigate(`/wellness/breathing?tech=${tech}`);
                  }
                }}
              >
                Launch Firefly Particle Breath Room ✦
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="w-full text-xs text-[#B8B4D9] hover:text-[#F5F2ED]"
                onClick={() => {
                  onClose();
                  navigate('/wellness');
                }}
              >
                Enter Wellness Actions Sanctuary →
              </Button>
            </div>
          </div>
        )}

        {item.action.type === 'meditation' && (
          <div className="text-center py-3 space-y-5">
            <div className="p-4 rounded-2xl bg-[#121029]/80 border border-[#FFC978]/30 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#FFC978] mb-1.5">
                <Moon className="w-4 h-4" />
                <span>Immersive Meditation Realm</span>
              </div>
              <p className="text-xs text-[#B8B4D9] leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                size="lg"
                variant="primary"
                className="w-full"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  onClose();
                  const cat = getCategoryForMood();
                  if (onLaunchMeditation) {
                    onLaunchMeditation(cat);
                  } else {
                    navigate(`/wellness/meditate?category=${cat}`);
                  }
                }}
              >
                Enter Immersive Meditation Sanctuary ✦
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="w-full text-xs text-[#B8B4D9] hover:text-[#F5F2ED]"
                onClick={() => {
                  onClose();
                  navigate('/wellness');
                }}
              >
                Explore All 8 Meditation Sanctuaries →
              </Button>
            </div>
          </div>
        )}

        {item.action.type === 'journal' && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#121029]/80 border border-[#FFC978]/30 text-xs text-[#FFF2D6] font-heading italic">
              {item.description}
            </div>

            <textarea
              rows={4}
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Inscribe your thoughts under the night sky..."
              className="w-full rounded-2xl bg-[#121029]/90 border border-[#B8B4D9]/25 p-3.5 text-xs text-[#F5F2ED] placeholder:text-[#B8B4D9]/50 focus:outline-none focus:border-[#FFC978] transition-colors resize-none font-body leading-relaxed"
            />

            {isSaved ? (
              <div className="p-3 rounded-xl bg-[#6FBFC4]/15 border border-[#6FBFC4]/40 text-xs text-[#6FBFC4] flex items-center justify-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Inscription Saved to Personal Constellation ✦</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  size="md"
                  variant="primary"
                  className="w-full"
                  icon={<Sparkles className="w-4 h-4" />}
                  onClick={handleSaveJournal}
                >
                  Inscribe into Constellation
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="w-full text-xs text-[#B8B4D9] hover:text-[#F5F2ED]"
                  onClick={() => {
                    onClose();
                    navigate('/journal');
                  }}
                >
                  Open Full Journal Room →
                </Button>
              </div>
            )}
          </div>
        )}

        {item.action.type === 'soundscape' && (
          <div className="text-center py-4 space-y-5">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-[#2D2A5C] to-[#433E7E] border border-[#FFC978]/40 flex items-center justify-center text-[#FFC978] shadow-glow-md">
              <Volume2 className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              <h4 className="font-heading text-lg font-bold text-[#F5F2ED]">
                {item.subtitle}
              </h4>
              <p className="text-xs text-[#B8B4D9] max-w-xs mx-auto mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#121029]/80 border border-[#B8B4D9]/15 text-[11px] text-[#FFC978]">
              🎵 Phase 6 Spotify Playlist Stream Connected.
            </div>

            <Button
              size="md"
              variant="primary"
              className="w-full"
              onClick={onClose}
            >
              Done Listening ✦
            </Button>
          </div>
        )}

        {(item.action.type === 'grounding' || item.action.type === 'reflection') && (
          <div className="space-y-4 py-2">
            <div className="p-4 rounded-xl bg-[#121029]/90 border border-[#B8B4D9]/20 text-xs text-[#F5F2ED] leading-relaxed">
              {item.description}
            </div>

            <div className="p-3 rounded-xl bg-[#2D2A5C]/60 border border-[#FFC978]/30 text-xs text-[#FFC978] text-center font-heading">
              "Take a deep breath and let the night sky hold your space."
            </div>

            <Button
              size="md"
              variant="primary"
              className="w-full"
              onClick={onClose}
            >
              Complete Shift ✦
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
