import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCw, 
  BookOpen, 
  CheckCircle2, 
  Heart 
} from 'lucide-react';
import { saveMoodEntry } from '../../lib/supabase';
import type { MoodType } from '../../types';

interface GratitudePrompt {
  id: string;
  theme: string;
  tag: string;
  prompt: string;
  suggestedMood: MoodType;
  accentColor: string;
}

const ROTATING_PROMPTS: GratitudePrompt[] = [
  {
    id: 'p1',
    theme: 'Radiant Glance',
    tag: 'Subtle Spark',
    prompt: 'What subtle, unexpected kindness made your spirit soften or smile today?',
    suggestedMood: 'happy',
    accentColor: '#FF9E7D',
  },
  {
    id: 'p2',
    theme: 'Quiet Grounding',
    tag: 'Calm Anchor',
    prompt: 'Where in your physical body did you experience a sudden moment of peaceful release?',
    suggestedMood: 'calm',
    accentColor: '#6FBFC4',
  },
  {
    id: 'p3',
    theme: 'Gentle Harbor',
    tag: 'Self Forgiveness',
    prompt: 'What heavy expectation can you gently give yourself permission to set down tonight?',
    suggestedMood: 'sad',
    accentColor: '#4A5B8C',
  },
  {
    id: 'p4',
    theme: 'Starlight Spark',
    tag: 'Passion Seed',
    prompt: 'What bold curiosity or creative idea sparked electrical excitement in your mind today?',
    suggestedMood: 'energetic',
    accentColor: '#C25AE0',
  },
  {
    id: 'p5',
    theme: 'Pure Horizon',
    tag: 'Horizon',
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
    <div className="p-6 sm:p-8 rounded-2xl bg-[#121316] border border-white/[0.08]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <Heart className="w-4 h-4 text-white/70 stroke-[1.5] shrink-0" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-medium uppercase tracking-wider text-amber-400">
                Reflective Inquiry
              </span>
              <span className="text-[10px] font-mono text-neutral-500">
                · {currentPrompt.tag}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-medium text-white">
              {currentPrompt.theme}
            </h4>
          </div>
        </div>

        <button
          onClick={handleNextPrompt}
          className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-mono text-neutral-300 hover:text-white border border-white/[0.08] transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5 stroke-[1.5]" />
          <span>Rotate prompt</span>
        </button>
      </div>

      {/* Rotating Prompt Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPrompt.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] mb-4"
        >
          <p className="text-sm sm:text-base text-neutral-200 font-normal leading-relaxed">
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
          placeholder="Record your reflection..."
          className="w-full rounded-xl bg-white/[0.02] border border-white/[0.08] p-3.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-white/30 transition-colors resize-none font-sans leading-relaxed"
        />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-neutral-400">
            Encrypted client-side and saved to your local constellation map.
          </div>

          {isSaved ? (
            <div className="px-3.5 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-neutral-200 flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 stroke-[1.5]" />
              <span>Entry recorded</span>
            </div>
          ) : (
            <button
              disabled={isSaving || !journalText.trim()}
              onClick={handleSaveEntry}
              className="px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-white text-neutral-950 text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <BookOpen className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>{isSaving ? 'Saving...' : 'Record reflection'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
