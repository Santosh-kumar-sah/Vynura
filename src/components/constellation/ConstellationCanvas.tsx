import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  Activity, 
  X,
  Star
} from 'lucide-react';
import type { MoodEntry } from '../../lib/supabase';
import { MOODS } from '../sections/HeroSection';

interface ConstellationCanvasProps {
  entries: MoodEntry[];
  onSelectEntry?: (entry: MoodEntry) => void;
}

interface StarPosition {
  entry: MoodEntry;
  x: number;
  y: number;
  radius: number;
  color: string;
}

export const ConstellationCanvas: React.FC<ConstellationCanvasProps> = ({
  entries,
  onSelectEntry,
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedStar, setSelectedStar] = useState<MoodEntry | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Compute celestial star positions on a natural flowing constellation curve
  const starNodes: StarPosition[] = useMemo(() => {
    if (!entries.length) return [];

    const total = entries.length;
    const width = 800;
    const height = 440;
    const paddingX = 80;

    return entries.map((entry, index) => {
      // Create an organic astronomical wave curve
      const stepX = (width - paddingX * 2) / Math.max(total - 1, 1);
      const baseX = paddingX + index * stepX;
      
      // Calculate organic Y with sinusoidal variance based on mood resonance
      const moodBonus =
        entry.mood_category === 'happy'
          ? -35
          : entry.mood_category === 'energetic'
          ? -20
          : entry.mood_category === 'sad'
          ? 35
          : 0;

      const waveY = Math.sin((index / Math.max(total, 1)) * Math.PI * 2) * 55;
      const baseY = height / 2 + waveY + moodBonus;

      const moodConfig = MOODS[entry.mood_category] || MOODS.neutral;
      const radius = 6 + entry.confidence_score * 7; // Size proportional to confidence

      return {
        entry,
        x: baseX,
        y: baseY,
        radius,
        color: moodConfig.color,
      };
    });
  }, [entries]);

  // Construct constellation path lines
  const constellationPath = useMemo(() => {
    if (starNodes.length < 2) return '';
    return starNodes.reduce((acc, curr, idx) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      return `${acc} L ${curr.x} ${curr.y}`;
    }, '');
  }, [starNodes]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
    setZoom((prev) => Math.min(Math.max(prev * zoomFactor, 0.6), 2.2));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    setSelectedStar(null);
  };

  return (
    <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#14122C]/95 via-[#181636]/90 to-[#0F0D24]/95 border border-[#FFC978]/25 overflow-hidden shadow-[0_20px_60px_-10px_rgba(10,8,28,0.9)]">
      {/* Top Floating Controls Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        {/* Constellation Title Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1836]/90 border border-[#FFC978]/30 backdrop-blur-md pointer-events-auto shadow-glow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[#FFC978]" />
          <span className="text-xs font-semibold text-[#F5F2ED]">
            Living Astral Constellation Map
          </span>
          <span className="text-[10px] text-[#FFC978] font-heading font-bold">
            星図
          </span>
        </div>

        {/* Pan / Zoom Interactive Controls */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#1A1836]/90 border border-[#B8B4D9]/20 backdrop-blur-md pointer-events-auto shadow-md">
          <button
            onClick={() => setZoom((z) => Math.min(z + 0.2, 2.2))}
            className="p-1.5 rounded-xl hover:bg-[#2D2A5C] text-[#B8B4D9] hover:text-[#F5F2ED] transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(z - 0.2, 0.6))}
            className="p-1.5 rounded-xl hover:bg-[#2D2A5C] text-[#B8B4D9] hover:text-[#F5F2ED] transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-1.5 rounded-xl hover:bg-[#2D2A5C] text-[#B8B4D9] hover:text-[#F5F2ED] transition-colors cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive SVG Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        className={`w-full h-[460px] sm:h-[500px] select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } relative overflow-hidden flex items-center justify-center`}
      >
        {/* Subtle Astronomical Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2D2A5C_1px,transparent_1px),linear-gradient(to_bottom,#2D2A5C_1px,transparent_1px)] bg-[size:48px_48px] opacity-15 pointer-events-none" />

        {/* Dynamic Transformed SVG Layer */}
        <svg
          className="w-full h-full"
          viewBox="0 0 800 440"
          preserveAspectRatio="xMidYMid meet"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            transition: isDragging ? 'none' : 'transform 0.15s ease-out',
          }}
        >
          <defs>
            {/* Soft Glow Filter for Star Nodes */}
            <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Intense Stellar Core Gradient */}
            <radialGradient id="celestialCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#FFC978" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFC978" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Connective Constellation Lines */}
          {constellationPath && (
            <>
              {/* Outer soft aura line */}
              <path
                d={constellationPath}
                fill="none"
                stroke="rgba(255, 201, 120, 0.25)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Core dashed astral trajectory */}
              <path
                d={constellationPath}
                fill="none"
                stroke="rgba(255, 242, 214, 0.65)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          )}

          {/* Star Nodes */}
          {starNodes.map((star) => {
            const isSelected = selectedStar?.id === star.entry.id;
            const dateStr = new Date(star.entry.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            });

            return (
              <g
                key={star.entry.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStar(star.entry);
                  if (onSelectEntry) onSelectEntry(star.entry);
                }}
                className="cursor-pointer group"
              >
                {/* Outer Breathing Orbit Ring */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.radius * 2.2}
                  fill="none"
                  stroke={star.color}
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  opacity={isSelected ? 0.9 : 0.35}
                />

                {/* Soft Ambient Starlight Halo */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.radius * 1.5}
                  fill={star.color}
                  opacity={isSelected ? 0.6 : 0.25}
                  filter="url(#starGlow)"
                />

                {/* Primary Radiant Star Sphere */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.radius}
                  fill={star.color}
                  filter="url(#starGlow)"
                />

                {/* Blazing Nucleus Core */}
                <circle
                  cx={star.x}
                  cy={star.y}
                  r={star.radius * 0.45}
                  fill="#FFFFFF"
                />

                {/* Floating Date Label */}
                <text
                  x={star.x}
                  y={star.y + star.radius + 16}
                  textAnchor="middle"
                  fill="#B8B4D9"
                  fontSize="10"
                  fontFamily="'Plus Jakarta Sans', sans-serif"
                  fontWeight="600"
                  opacity={isSelected ? 1 : 0.75}
                >
                  {dateStr}
                </text>

                {/* Order Index Kanji Marker */}
                <text
                  x={star.x}
                  y={star.y - star.radius - 8}
                  textAnchor="middle"
                  fill={star.color}
                  fontSize="9"
                  fontFamily="'Klee One', cursive"
                  fontWeight="bold"
                >
                  {MOODS[star.entry.mood_category]?.kanji || '星'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Star Node Interactive Popover (Tap to Reveal) */}
      <AnimatePresence>
        {selectedStar && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-30 p-4 rounded-2xl bg-[#1A1836]/95 border shadow-[0_15px_40px_rgba(10,8,28,0.95)] backdrop-blur-xl"
            style={{
              borderColor: `${MOODS[selectedStar.mood_category]?.color || '#FFC978'}60`,
              boxShadow: `0 0 30px -5px ${MOODS[selectedStar.mood_category]?.color || '#FFC978'}40`,
            }}
          >
            {/* Popover Header */}
            <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-[#B8B4D9]/15">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{
                    backgroundColor: MOODS[selectedStar.mood_category]?.color,
                    boxShadow: `0 0 8px ${MOODS[selectedStar.mood_category]?.color}`,
                  }}
                />
                <span className="font-heading font-bold text-sm text-[#F5F2ED]">
                  {MOODS[selectedStar.mood_category]?.label}
                </span>
                <span className="text-xs text-[#FFC978] font-heading">
                  ({MOODS[selectedStar.mood_category]?.kanji})
                </span>
              </div>

              <button
                onClick={() => setSelectedStar(null)}
                className="p-1 rounded-lg text-[#B8B4D9] hover:text-[#F5F2ED] hover:bg-[#2D2A5C] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Metrics Row */}
            <div className="flex items-center justify-between text-xs text-[#B8B4D9] mb-2.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#6FBFC4]" />
                <span>{new Date(selectedStar.created_at).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
              </span>
              <span className="flex items-center gap-1 font-mono font-bold text-[#F5F2ED]">
                <Activity className="w-3.5 h-3.5 text-[#FF9E7D]" />
                <span>{Math.round(selectedStar.confidence_score * 100)}% Lock</span>
              </span>
            </div>

            {/* Journal Excerpt */}
            {selectedStar.journal_text ? (
              <div className="p-2.5 rounded-xl bg-[#121029]/80 border border-[#B8B4D9]/15 text-xs text-[#FFF2D6] font-body italic leading-relaxed mb-2">
                <div className="flex items-center gap-1 text-[10px] text-[#FFC978] not-italic font-semibold mb-1">
                  <BookOpen className="w-3 h-3" />
                  <span>Journal Excerpt</span>
                </div>
                "{selectedStar.journal_text}"
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-[#121029]/50 text-[11px] text-[#B8B4D9] italic mb-2">
                No text journal inscribed for this star. Biometric calibration logged.
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] text-[#B8B4D9]">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-[#FFC978]" />
                <span>Star Node #{selectedStar.id.slice(-4)}</span>
              </span>
              <span className="font-heading text-[#6FBFC4]">恒星データ</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
