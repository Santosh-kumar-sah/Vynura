import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Wind, 
  BookOpen, 
  Music, 
  Sparkles, 
  CheckCircle2, 
  Volume2
} from 'lucide-react';
import type { RecommendationItem } from '../../types/recommendations';
import type { MoodType } from '../../types';
import { Button } from '../common/Button';

interface ActionModalProps {
  item: RecommendationItem | null;
  mood: MoodType;
  isOpen: boolean;
  onClose: () => void;
}

export const ActionModal: React.FC<ActionModalProps> = ({
  item,
  mood: _mood,
  isOpen,
  onClose,
}) => {
  const [journalText, setJournalText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [breathingStep, setBreathingStep] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B091C]/85 backdrop-blur-lg">
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
          <div className="text-center py-4 space-y-6">
            <p className="text-xs text-[#B8B4D9] max-w-sm mx-auto">
              Follow the celestial breathing pacer. Expand your lungs with firefly light.
            </p>

            {/* Pacer Sphere Animation */}
            <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
              <motion.div
                animate={{
                  scale: breathingStep === 'inhale' ? 1.35 : breathingStep === 'hold' ? 1.35 : 0.85,
                  opacity: breathingStep === 'hold' ? 0.9 : 0.65,
                }}
                transition={{
                  duration: breathingStep === 'inhale' ? 4 : breathingStep === 'hold' ? 4 : 4,
                  ease: 'easeInOut',
                }}
                className="w-28 h-28 rounded-full border-2 flex items-center justify-center relative shadow-lg"
                style={{
                  borderColor: item.accentColor,
                  backgroundColor: `${item.accentColor}18`,
                  boxShadow: `0 0 35px ${item.accentColor}50`,
                }}
              >
                <span className="text-xs font-heading font-bold text-[#F5F2ED] uppercase tracking-wider">
                  {breathingStep}
                </span>
              </motion.div>
            </div>

            {/* Pacer Control Buttons */}
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setBreathingStep('inhale')}
                className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${
                  breathingStep === 'inhale' ? 'bg-[#2D2A5C] text-[#F5F2ED] border-[#FFC978]' : 'text-[#B8B4D9] border-transparent'
                }`}
              >
                Inhale (4s)
              </button>
              <button
                onClick={() => setBreathingStep('hold')}
                className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${
                  breathingStep === 'hold' ? 'bg-[#2D2A5C] text-[#F5F2ED] border-[#6FBFC4]' : 'text-[#B8B4D9] border-transparent'
                }`}
              >
                Hold (7s)
              </button>
              <button
                onClick={() => setBreathingStep('exhale')}
                className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${
                  breathingStep === 'exhale' ? 'bg-[#2D2A5C] text-[#F5F2ED] border-[#FF9E7D]' : 'text-[#B8B4D9] border-transparent'
                }`}
              >
                Exhale (8s)
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#121029]/80 border border-[#B8B4D9]/15 text-[11px] text-[#B8B4D9]">
              ✦ Phase 5 Full-Screen Firefly Lung Pacer integrated in upcoming hub.
            </div>
          </div>
        )}

        {item.action.type === 'journal' && (
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-[#121029]/80 border border-[#FFC978]/30 text-xs text-[#FFF2D6] font-heading italic">
              {item.description}
            </div>

            <textarea
              rows={4}
              value={journalText}
              onChange={(e) => setJournalText(e.target.value)}
              placeholder="Inscribe your thoughts under the night sky..."
              className="w-full rounded-xl bg-[#121029]/90 border border-[#B8B4D9]/25 p-3.5 text-xs text-[#F5F2ED] placeholder:text-[#B8B4D9]/50 focus:outline-none focus:border-[#FFC978] transition-colors resize-none font-body"
            />

            {isSaved ? (
              <div className="p-3 rounded-xl bg-[#6FBFC4]/15 border border-[#6FBFC4]/40 text-xs text-[#6FBFC4] flex items-center justify-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Inscription Saved to Local Star Memory</span>
              </div>
            ) : (
              <Button
                size="md"
                variant="primary"
                className="w-full"
                icon={<Sparkles className="w-4 h-4" />}
                onClick={() => {
                  if (journalText.trim()) {
                    setIsSaved(true);
                    setTimeout(() => {
                      onClose();
                      setIsSaved(false);
                      setJournalText('');
                    }, 1200);
                  }
                }}
              >
                Inscribe into Constellation
              </Button>
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
              <p className="text-xs text-[#B8B4D9] max-w-xs mx-auto mt-1">
                {item.description}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#121029]/80 border border-[#B8B4D9]/15 text-[11px] text-[#FFC978]">
              🎵 Phase 6 Spotify Ambient Playlist Stream Connected.
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

        {(item.action.type === 'grounding' || item.action.type === 'reflection' || item.action.type === 'meditation') && (
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
