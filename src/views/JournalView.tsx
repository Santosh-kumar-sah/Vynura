import React, { useState } from 'react';
import { BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { RouteTransition } from '../components/common/RouteTransition';
import { CloseButton } from '../components/common/CloseButton';
import { GratitudePromptHub } from '../components/wellness/GratitudePromptHub';
import { Button } from '../components/common/Button';
import { saveMoodEntry } from '../lib/supabase';
import type { MoodType } from '../types';
import { MOODS } from '../components/sections/HeroSection';

interface JournalViewProps {
  activeMood: MoodType;
}

export const JournalView: React.FC<JournalViewProps> = ({ activeMood }) => {
  const [journalText, setJournalText] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const currentMoodData = MOODS[activeMood];

  const handleSave = async () => {
    if (!journalText.trim()) return;
    try {
      await saveMoodEntry({
        mood_category: activeMood,
        confidence_score: 0.95,
        journal_text: journalText.trim(),
      });

      // Signature shooting-star burst upon new star inscription
      try {
        confetti({
          particleCount: 55,
          spread: 85,
          origin: { y: 0.55 },
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
        setIsSaved(false);
        setJournalText('');
      }, 3000);
    } catch (e) {
      console.error('Error saving journal:', e);
    }
  };

  return (
    <RouteTransition>
      {/* Floating On-Brand X Close Button */}
      <CloseButton to="/" ariaLabel="Return to Night Sky Hub" />

      <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto z-10 space-y-10">
        {/* Room Header */}
        <div className="border-b border-[#B8B4D9]/15 pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FFC978] mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Room 03 / Mindful Micro-Journaling</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-5xl font-bold text-[#F5F2ED] tracking-tight mb-3">
            Celestial Reflections
          </h1>
          <p className="text-sm sm:text-base text-[#B8B4D9] max-w-2xl leading-relaxed">
            Inscribe your thoughts under the calm night sky. Every entry crystallizes into a star on your living constellation map.
          </p>
        </div>

        {/* Journal Inscription Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#24214A]/80 via-[#1A1836] to-[#121029] border border-[#FFC978]/30 shadow-2xl space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-[#FFC978]">
              <Sparkles className="w-4 h-4" />
              <span>Resonating in {currentMoodData.label}</span>
            </div>
            <span className="text-[11px] font-mono text-[#B8B4D9]">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <textarea
            rows={6}
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            placeholder="Inscribe what is stirring inside you right now... No judgment, just pure presence."
            className="w-full rounded-2xl bg-[#100D28]/90 border border-[#B8B4D9]/20 p-4 text-sm sm:text-base text-[#F5F2ED] placeholder:text-[#B8B4D9]/40 focus:outline-none focus:border-[#FFC978] transition-colors resize-none font-body leading-relaxed"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-[#B8B4D9] italic font-heading">
              "Whatever you release here is held gently by the stars."
            </span>

            {isSaved ? (
              <div className="px-4 py-2.5 rounded-xl bg-[#6FBFC4]/20 border border-[#6FBFC4]/50 text-xs text-[#6FBFC4] font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Inscribed into Constellation ✦</span>
              </div>
            ) : (
              <Button
                size="md"
                variant="primary"
                icon={<Sparkles className="w-4 h-4" />}
                onClick={handleSave}
              >
                Inscribe Star ✦
              </Button>
            )}
          </div>
        </div>

        {/* Rotating Gratitude Deck */}
        <GratitudePromptHub />
      </div>
    </RouteTransition>
  );
};
