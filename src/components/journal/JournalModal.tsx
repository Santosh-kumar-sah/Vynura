import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Heart 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { MoodType } from '../../types';
import { MOODS } from '../sections/HeroSection';
import { Button } from '../common/Button';
import { saveMoodEntry } from '../../lib/supabase';

interface JournalModalProps {
  isOpen: boolean;
  mood: MoodType;
  confidence?: number;
  onClose: () => void;
  onSaved?: () => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  isOpen,
  mood,
  confidence = 0.92,
  onClose,
  onSaved,
}) => {
  const [journalText, setJournalText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const currentMoodData = MOODS[mood] || MOODS.neutral;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveMoodEntry({
        mood_category: mood,
        confidence_score: confidence,
        journal_text: journalText.trim() || undefined,
      });

      // Signature shooting-star firefly burst upon new entry inscription
      try {
        confetti({
          particleCount: 50,
          spread: 80,
          origin: { y: 0.6 },
          colors: [currentMoodData.color, '#FFC978', '#FFFFFF', '#6FBFC4'],
          disableForReducedMotion: true,
          ticks: 200,
          shapes: ['circle'],
        });
      } catch {
        // Fallback
      }

      setIsSaved(true);
      setTimeout(() => {
        if (onSaved) onSaved();
        onClose();
        setIsSaved(false);
        setJournalText('');
      }, 1000);
    } catch (e) {
      console.error('Error saving journal entry:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg rounded-2xl bg-[#121316] border border-white/[0.08] p-6 sm:p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-5">
          <BookOpen className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono font-medium uppercase tracking-wider text-neutral-400">
                Reflection Log
              </span>
              <span className="text-xs text-neutral-400 font-mono">
                {currentMoodData.sublabel}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-white tracking-tight mt-0.5">
              Capture reflection notes
            </h3>
          </div>
        </div>

        {/* Mood Affirmation Quote Card */}
        <div className="p-3.5 rounded-xl bg-[#18191c] border border-white/[0.06] mb-4">
          <div className="flex items-center gap-1.5 text-xs text-neutral-300 font-medium mb-1">
            <Heart className="w-3.5 h-3.5 text-amber-400" />
            <span>State: {currentMoodData.label}</span>
          </div>
          <p className="text-xs text-neutral-300 italic leading-relaxed">
            "{currentMoodData.quote}"
          </p>
        </div>

        {/* Textarea */}
        <div className="space-y-2 mb-6">
          <label className="block text-xs font-medium text-neutral-300 flex items-center justify-between">
            <span>Notes (Optional)</span>
            <span className="text-[10px] text-neutral-400 font-mono">Journal</span>
          </label>
          <textarea
            rows={5}
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Record any thoughts, triggers, or somatic sensations present right now..."
            className="w-full rounded-xl bg-[#18191c] border border-white/[0.08] p-3.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400/60 transition-colors resize-none font-sans leading-relaxed"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3">
          {isSaved ? (
            <div className="w-full py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center justify-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Saved to reflection history</span>
            </div>
          ) : (
            <>
              <Button
                size="lg"
                variant="primary"
                className="flex-1"
                disabled={isSaving}
                icon={<Sparkles className="w-4 h-4" />}
                onClick={handleSave}
              >
                {isSaving ? 'Saving note...' : 'Save Reflection'}
              </Button>
              <button
                onClick={onClose}
                className="px-4 py-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs text-neutral-300 hover:text-white border border-white/[0.08] font-medium transition-colors cursor-pointer"
              >
                Skip
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
