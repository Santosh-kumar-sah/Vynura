import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  RotateCw, 
  BookOpen, 
  CheckCircle2, 
  Heart 
} from 'lucide-react';
import { Button } from '../common/Button';
import { saveMoodEntry } from '../../lib/supabase';
import type { MoodType } from '../../types';

interface GratitudePrompt {
  id: string;
  theme: string;
  kanji: string;
  prompt: string;
  suggestedMood: MoodType;
  accentColor: string;
}

const ROTATING_PROMPTS: GratitudePrompt[] = [
  {
    id: 'p1',
    theme: 'Radiant Glance',
    kanji: '小さな光',
    prompt: 'What subtle, unexpected kindness made your spirit soften or smile today?',
    suggestedMood: 'happy',
    accentColor: '#FF9E7D',
  },
  {
    id: 'p2',
    theme: 'Quiet Grounding',
    kanji: '静かな錨',
    prompt: 'Where in your physical body did you experience a sudden moment of peaceful release?',
    suggestedMood: 'calm',
    accentColor: '#6FBFC4',
  },
  {
    id: 'p3',
    theme: 'Gentle Harbor',
    kanji: '心の許し',
    prompt: 'What heavy expectation can you gently give yourself permission to set down tonight?',
    suggestedMood: 'sad',
    accentColor: '#4A5B8C',
  },
  {
    id: 'p4',
    theme: 'Starlight Spark',
    kanji: '情熱の種',
    prompt: 'What bold curiosity or creative idea sparked electrical excitement in your mind today?',
    suggestedMood: 'energetic',
    accentColor: '#C25AE0',
  },
  {
    id: 'p5',
    theme: 'Pure Horizon',
    kanji: '中庸の美',
    prompt: 'Looking out toward the horizon of tomorrow, what single intention brings you ease?',
    suggestedMood: 'neutral',
    accentColor: '#FFC978',
  },
];

interface GratitudePromptHubProps {
  onSaved?: () => void;
}

export const GratitudePromptHub: React.FC<GratitudePromptHubProps> = ({ onSaved }) => {
  const [promptIdx, setPromptIdx] = useState(0);
  const [journalText, setJournalText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const currentPrompt = ROTATING_PROMPTS[promptIdx];

  const handleNextPrompt = () => {
    setPromptIdx((prev) => (prev + 1) % ROTATING_PROMPTS.length);
    setJournalText('');
    setIsSaved(false);
  };

  const handleSaveEntry = async () => {
    if (!journalText.trim()) return;
    setIsSaving(true);
    try {
      await saveMoodEntry({
        mood_category: currentPrompt.suggestedMood,
        confidence_score: 0.95,
        journal_text: `[${currentPrompt.theme}] ${journalText.trim()}`,
        metadata: {
          promptId: currentPrompt.id,
          promptTheme: currentPrompt.theme,
          entryType: 'gratitude_reflection',
        },
      });

      setIsSaved(true);
      if (onSaved) onSaved();
      setTimeout(() => {
        setIsSaved(false);
        setJournalText('');
      }, 2000);
    } catch (e) {
      console.error('Error saving gratitude entry:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#24214A]/85 via-[#1A1836]/90 to-[#121029]/95 border backdrop-blur-xl relative overflow-hidden transition-all duration-500 shadow-lg"
      style={{
        borderColor: `${currentPrompt.accentColor}40`,
        boxShadow: `0 10px 40px -10px ${currentPrompt.accentColor}25`,
      }}
    >
      {/* Top Rim Glow */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] transition-colors duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${currentPrompt.accentColor}, transparent)`,
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-[#B8B4D9]/15">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-glow-sm"
            style={{
              backgroundColor: `${currentPrompt.accentColor}20`,
              borderColor: `${currentPrompt.accentColor}50`,
              color: currentPrompt.accentColor,
            }}
          >
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-widest"
                style={{ color: currentPrompt.accentColor }}
              >
                Gratitude & Reflection Deck
              </span>
              <span className="text-xs text-[#FFC978] font-heading font-semibold">
                {currentPrompt.kanji}
              </span>
            </div>
            <h4 className="font-heading text-lg sm:text-xl font-bold text-[#F5F2ED]">
              Theme: {currentPrompt.theme}
            </h4>
          </div>
        </div>

        <button
          onClick={handleNextPrompt}
          className="px-3 py-1.5 rounded-xl bg-[#2D2A5C]/60 hover:bg-[#2D2A5C] text-xs font-semibold text-[#FFC978] border border-[#FFC978]/30 hover:border-[#FFC978]/60 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
          <span>Rotate Prompt ✦</span>
        </button>
      </div>

      {/* Rotating Prompt Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPrompt.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
          className="p-4 rounded-2xl bg-[#121029]/80 border border-[#B8B4D9]/20 mb-4"
        >
          <p className="font-heading text-sm sm:text-base text-[#FFF2D6] italic leading-relaxed">
            "{currentPrompt.prompt}"
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Input Area */}
      <div className="space-y-3">
        <textarea
          rows={3}
          value={journalText}
          onChange={(e) => setJournalText(e.target.value)}
          placeholder="Capture your reflection under the starlight..."
          className="w-full rounded-2xl bg-[#121029]/90 border border-[#B8B4D9]/25 p-3.5 text-xs text-[#F5F2ED] placeholder:text-[#B8B4D9]/40 focus:outline-none focus:border-[#FFC978] transition-colors resize-none font-body leading-relaxed"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-[#B8B4D9] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FFC978]" />
            <span>Saves directly as an illuminated star in your constellation map.</span>
          </div>

          {isSaved ? (
            <div className="px-4 py-2.5 rounded-xl bg-[#6FBFC4]/20 border border-[#6FBFC4]/50 text-xs text-[#6FBFC4] flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Inscribed into Sky ✦</span>
            </div>
          ) : (
            <Button
              size="md"
              variant="primary"
              disabled={isSaving || !journalText.trim()}
              icon={<BookOpen className="w-4 h-4" />}
              onClick={handleSaveEntry}
            >
              {isSaving ? 'Inscribing...' : 'Save Starlight Reflection'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
