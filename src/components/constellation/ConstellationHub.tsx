import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Orbit, 
  Sparkles, 
  Plus, 
  RefreshCw, 
  LogIn,
  Camera
} from 'lucide-react';
import { 
  fetchMoodEntries, 
  generatePatternInsights, 
  type MoodEntry, 
  type PatternInsight 
} from '../../lib/supabase';
import { ConstellationCanvas } from './ConstellationCanvas';
import { StreakDisplay } from './StreakDisplay';
import { PatternInsights } from './PatternInsights';
import { JournalModal } from '../journal/JournalModal';
import { AuthModal } from '../auth/AuthModal';
import { Button } from '../common/Button';
import type { MoodType } from '../../types';

interface ConstellationHubProps {
  activeMood: MoodType;
  onOpenFaceDetection?: () => void;
}

export const ConstellationHub: React.FC<ConstellationHubProps> = ({
  activeMood,
  onOpenFaceDetection,
}) => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [insights, setInsights] = useState<PatternInsight | null>(null);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMoodEntries();
      setEntries(data);
      setInsights(generatePatternInsights(data));
    } catch (e) {
      console.error('Error loading constellation data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <section
      id="constellation"
      className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#6FBFC4] mb-2">
            <Orbit className="w-4 h-4" />
            <span>03 / 星座記録 · Living Constellation Analytics</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#F5F2ED] tracking-tight mb-2">
            Your Emotional Constellation
          </h2>

          <p className="text-sm sm:text-base text-[#B8B4D9] max-w-xl leading-relaxed">
            No cold corporate bar charts. Each mood calibration ignites a luminous star in your night sky, weaving personal patterns across weeks and months.
          </p>
        </motion.div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {onOpenFaceDetection && (
            <Button
              size="sm"
              variant="secondary"
              icon={<Camera className="w-3.5 h-3.5 text-[#FFC978]" />}
              iconPosition="left"
              onClick={onOpenFaceDetection}
            >
              Face Scan Star
            </Button>
          )}

          <Button
            size="sm"
            variant="primary"
            icon={<Plus className="w-3.5 h-3.5" />}
            onClick={() => setIsJournalOpen(true)}
          >
            Inscribe Journal Star
          </Button>

          <Button
            size="sm"
            variant="secondary"
            icon={<LogIn className="w-3.5 h-3.5 text-[#FFC978]" />}
            iconPosition="left"
            onClick={() => setIsAuthOpen(true)}
          >
            Account / Sync
          </Button>

          <button
            onClick={loadData}
            className="p-2.5 rounded-xl bg-[#2D2A5C]/60 hover:bg-[#2D2A5C] text-[#B8B4D9] hover:text-[#F5F2ED] border border-[#B8B4D9]/20 transition-colors cursor-pointer"
            title="Refresh Constellation"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid: Streak Arc + Constellation Map */}
      <div className="space-y-8 mb-12">
        {/* Streak Visualizer */}
        <StreakDisplay
          entries={entries}
          streakCount={insights?.streakCount || 7}
        />

        {/* Interactive Constellation Map Canvas (Pan, Zoom, Tap to Reveal) */}
        <ConstellationCanvas
          entries={entries}
          onSelectEntry={() => {}}
        />
      </div>

      {/* Lightweight Pattern Insights */}
      {insights && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#FFC978]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Harmonic Pattern Synthesis · 傾向分析</span>
          </div>

          <PatternInsights insight={insights} />
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {isJournalOpen && (
          <JournalModal
            isOpen={isJournalOpen}
            mood={activeMood}
            onClose={() => setIsJournalOpen(false)}
            onSaved={loadData}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onSuccess={loadData}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
