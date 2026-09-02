import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  Heart 
} from 'lucide-react';
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-[#0B091C]/85 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#24214A] via-[#1A1836] to-[#121029] border p-6 sm:p-8 shadow-[0_25px_70px_rgba(10,8,28,0.95)] overflow-hidden"
        style={{
          borderColor: `${currentMoodData.color}50`,
          boxShadow: `0 0 35px -5px ${currentMoodData.color}35`,
        }}
      >
        {/* Top Rim Glow */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${currentMoodData.color}, transparent)`,
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
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center border shadow-glow-sm"
            style={{
              backgroundColor: `${currentMoodData.color}20`,
              borderColor: `${currentMoodData.color}60`,
              color: currentMoodData.color,
            }}
          >
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-widest"
                style={{ color: currentMoodData.color }}
              >
                Constellation Inscription
              </span>
              <span className="text-xs text-[#FFC978] font-mono">
                {currentMoodData.sublabel}
              </span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F2ED]">
              Inscribe This Starlight Moment
            </h3>
          </div>
        </div>

        {/* Mood Affirmation Quote Card */}
        <div className="p-3.5 rounded-xl bg-[#121029]/80 border border-[#B8B4D9]/15 mb-4">
          <div className="flex items-center gap-1.5 text-xs text-[#FFC978] font-medium mb-1">
            <Heart className="w-3.5 h-3.5" />
            <span>Harmonic Resonance: {currentMoodData.label}</span>
          </div>
          <p className="text-xs text-[#F5F2ED] italic font-heading leading-relaxed">
            "{currentMoodData.quote}"
          </p>
        </div>

        {/* Soft-Glow Textarea */}
        <div className="space-y-2 mb-6">
          <label className="block text-xs font-semibold text-[#B8B4D9] flex items-center justify-between">
            <span>Reflective Journal Notes (Optional)</span>
            <span className="text-[10px] text-[#FFC978]/80 font-mono">Inner Voice</span>
          </label>
          <textarea
            rows={5}
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="What is present in your awareness right now? Capture the nuance before it floats away like a comet..."
            className="w-full rounded-2xl bg-[#121029]/90 border border-[#B8B4D9]/25 p-4 text-xs text-[#F5F2ED] placeholder:text-[#B8B4D9]/40 focus:outline-none transition-all duration-300 resize-none font-body leading-relaxed"
            style={{
              boxShadow: 'inset 0 2px 8px rgba(10,8,28,0.8)',
            }}
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3">
          {isSaved ? (
            <div className="w-full py-3 rounded-xl bg-[#6FBFC4]/20 border border-[#6FBFC4]/50 text-xs text-[#6FBFC4] flex items-center justify-center gap-2 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Inscribed into Personal Constellation ✦</span>
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
                {isSaving ? 'Inscribing Star...' : 'Save into Sky Constellation'}
              </Button>
              <button
                onClick={onClose}
                className="px-4 py-3 rounded-xl bg-[#2D2A5C]/60 hover:bg-[#2D2A5C] text-xs text-[#B8B4D9] hover:text-[#F5F2ED] border border-[#B8B4D9]/20 font-semibold transition-colors cursor-pointer"
              >
                Skip Journal
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};
