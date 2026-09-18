import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  Share2,
  Check,
  Sparkles,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { MoodEntry } from '../../lib/supabase';
import { MOODS } from '../sections/HeroSection';

export type ConstellationDateRange = 'this-month' | 'past-30-days' | 'all';

export interface ConstellationShareCardProps {
  isOpen: boolean;
  onClose: () => void;
  entries: MoodEntry[];
}

export const ConstellationShareCard: React.FC<ConstellationShareCardProps> = ({
  isOpen,
  onClose,
  entries,
}) => {
  const [dateRange, setDateRange] = useState<ConstellationDateRange>('this-month');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  // Filter entries according to selected date range
  const filteredEntries = useMemo(() => {
    if (!entries.length) return [];
    const now = new Date();

    let list: MoodEntry[];
    if (dateRange === 'this-month') {
      list = entries.filter((e) => {
        const d = new Date(e.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    } else if (dateRange === 'past-30-days') {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
      list = entries.filter((e) => new Date(e.created_at) >= thirtyDaysAgo);
    } else {
      list = [...entries];
    }

    // Gracefully fallback to all entries if date-range filter yields empty
    return list.length > 0 ? list : entries;
  }, [entries, dateRange]);

  // Compute visual star nodes for preview
  const previewNodes = useMemo(() => {
    const total = filteredEntries.length;
    if (!total) return [];

    const width = 640;
    const height = 340;
    const paddingX = 60;

    return filteredEntries.map((entry, index) => {
      const stepX = (width - paddingX * 2) / Math.max(total - 1, 1);
      const baseX = paddingX + index * stepX;

      const moodBonus =
        entry.mood_category === 'happy'
          ? -26
          : entry.mood_category === 'energetic'
          ? -16
          : entry.mood_category === 'sad'
          ? 26
          : 0;

      const waveY = Math.sin((index / Math.max(total, 1)) * Math.PI * 2) * 40;
      const baseY = height / 2 + waveY + moodBonus;
      const moodConfig = MOODS[entry.mood_category] || MOODS.neutral;
      const radius = 5 + (entry.confidence_score || 0.8) * 5;

      return {
        x: baseX,
        y: baseY,
        radius,
        color: moodConfig.color,
      };
    });
  }, [filteredEntries]);

  const previewPath = useMemo(() => {
    if (previewNodes.length < 2) return '';
    return previewNodes.reduce((acc, curr, idx) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      return `${acc} L ${curr.x} ${curr.y}`;
    }, '');
  }, [previewNodes]);

  if (!isOpen) return null;

  const captionText =
    dateRange === 'this-month'
      ? 'My Sky This Month'
      : dateRange === 'past-30-days'
      ? 'My Sky Past 30 Days'
      : 'My Celestial Sky';

  // High-Resolution 1080x1350 (4:5 social portrait) PNG export via HTML5 Canvas
  const handleExportCanvas = () => {
    setIsExporting(true);

    try {
      confetti({
        particleCount: 50,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#FFC978', '#6FBFC4', '#FF9EAA', '#B8B4D9', '#FFFFFF'],
      });
    } catch {
      // ignore
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsExporting(false);
      return;
    }

    // 1. Deep Space Cosmic Background
    const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1350);
    bgGradient.addColorStop(0, '#0D0B1E');
    bgGradient.addColorStop(0.35, '#1A1836');
    bgGradient.addColorStop(0.7, '#24214A');
    bgGradient.addColorStop(1, '#0B0918');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1350);

    // 2. Ambient Nebula Glow Pools
    const glow1 = ctx.createRadialGradient(540, 400, 50, 540, 400, 500);
    glow1.addColorStop(0, 'rgba(255, 201, 120, 0.18)');
    glow1.addColorStop(1, 'rgba(255, 201, 120, 0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, 1080, 1350);

    const glow2 = ctx.createRadialGradient(540, 950, 50, 540, 950, 550);
    glow2.addColorStop(0, 'rgba(111, 191, 196, 0.15)');
    glow2.addColorStop(1, 'rgba(111, 191, 196, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, 1080, 1350);

    // 3. Faint Background Starfield (Twinkling ambient dots)
    for (let i = 0; i < 95; i++) {
      const sx = (Math.sin(i * 137) * 0.5 + 0.5) * 1080;
      const sy = (Math.cos(i * 91) * 0.5 + 0.5) * 1350;
      const sRadius = (i % 3 === 0 ? 3 : 1.8) + Math.random();
      const sAlpha = (i % 4 === 0 ? 0.8 : 0.35) + Math.random() * 0.25;

      ctx.fillStyle = `rgba(255, 242, 214, ${sAlpha})`;
      ctx.beginPath();
      ctx.arc(sx, sy, sRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Subtle Astronomical Coordinate Grid Lines
    ctx.strokeStyle = 'rgba(184, 180, 217, 0.08)';
    ctx.lineWidth = 1;
    const gridSize = 72;
    for (let x = 80; x <= 1000; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 80);
      ctx.lineTo(x, 1270);
      ctx.stroke();
    }
    for (let y = 80; y <= 1270; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(80, y);
      ctx.lineTo(1000, y);
      ctx.stroke();
    }

    // 5. Double Starlight Outer Border
    ctx.strokeStyle = 'rgba(255, 201, 120, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 60, 960, 1230);

    ctx.strokeStyle = 'rgba(184, 180, 217, 0.18)';
    ctx.lineWidth = 1;
    ctx.strokeRect(75, 75, 930, 1200);

    // 6. Header Branding: VYNURA Wordmark
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFC978';
    ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '7px';
    ctx.fillText('✦ V Y N U R A ✦', 540, 180);

    ctx.fillStyle = '#B8B4D9';
    ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('ASTRONOMICAL CONSTELLATION MAP', 540, 225);

    // 7. Generic Caption & Star Count Badge (NO mood labels, NO confidence scores)
    ctx.fillStyle = 'rgba(255, 201, 120, 0.12)';
    ctx.strokeStyle = 'rgba(255, 201, 120, 0.45)';
    ctx.lineWidth = 2;
    const pillW = 380;
    const pillH = 56;
    const pillX = 540 - pillW / 2;
    const pillY = 280;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 28);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFC978';
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(captionText.toUpperCase(), 540, 316);

    ctx.fillStyle = '#F5F2ED';
    ctx.font = '600 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '1px';
    ctx.fillText(`✦ ${filteredEntries.length} Stars Inscribed ✦`, 540, 390);

    // 8. Core Constellation Visual Layout (Pure visual pattern only)
    const totalStars = filteredEntries.length;
    const constW = 860;
    const startX = 540 - constW / 2 + 50;
    const centerY = 710;

    const exportNodes = filteredEntries.map((entry, idx) => {
      const stepX = (constW - 100) / Math.max(totalStars - 1, 1);
      const ex = startX + idx * stepX;

      const moodBonus =
        entry.mood_category === 'happy'
          ? -55
          : entry.mood_category === 'energetic'
          ? -32
          : entry.mood_category === 'sad'
          ? 55
          : 0;

      const waveY = Math.sin((idx / Math.max(totalStars, 1)) * Math.PI * 2) * 85;
      const ey = centerY + waveY + moodBonus;
      const moodConfig = MOODS[entry.mood_category] || MOODS.neutral;
      const rad = 10 + (entry.confidence_score || 0.8) * 8;

      return { x: ex, y: ey, radius: rad, color: moodConfig.color };
    });

    // Connecting Starlight Beam (Glow + Core line)
    if (exportNodes.length > 1) {
      // Outer Glow line
      ctx.strokeStyle = 'rgba(255, 201, 120, 0.25)';
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      exportNodes.forEach((node, i) => {
        if (i === 0) ctx.moveTo(node.x, node.y);
        else ctx.lineTo(node.x, node.y);
      });
      ctx.stroke();

      // Sharp Core line
      ctx.strokeStyle = 'rgba(255, 201, 120, 0.7)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      exportNodes.forEach((node, i) => {
        if (i === 0) ctx.moveTo(node.x, node.y);
        else ctx.lineTo(node.x, node.y);
      });
      ctx.stroke();
    }

    // Draw Star Nodes (Glow, Ring, Core)
    exportNodes.forEach((node) => {
      // Outer aura
      const nGlow = ctx.createRadialGradient(node.x, node.y, 4, node.x, node.y, node.radius * 3.5);
      nGlow.addColorStop(0, `${node.color}AA`);
      nGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = nGlow;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Outer ring
      ctx.strokeStyle = `${node.color}80`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 1.5, 0, Math.PI * 2);
      ctx.stroke();

      // Inner Star core
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();

      // Center bright specular sparkle
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();
    });

    // 9. Poetic Footer
    ctx.fillStyle = '#FFF2D6';
    ctx.font = 'italic 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('"Silent constellations woven across the calm night sky."', 540, 1140);

    ctx.fillStyle = '#B8B4D9';
    ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText('ANONYMOUS STARLIGHT SNAPSHOT · VYNURA', 540, 1195);

    // 10. Trigger PNG Download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `vynura-constellation-${dateRange}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setIsExporting(false);
  };

  const handleShareWeb = async () => {
    const text = `✦ My Sky This Month: An anonymous constellation of ${filteredEntries.length} starlight moments on Vynura.`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Vynura Constellation',
          text,
          url: window.location.origin,
        });
      } catch {
        // User cancelled
      }
    } else {
      await navigator.clipboard.writeText(`${text} ${window.location.origin}`);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 3000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#070514]/85 backdrop-blur-md -z-10"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 25 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative w-full max-w-2xl my-6 rounded-3xl bg-gradient-to-b from-[#24214A] via-[#1A1836] to-[#121029] border border-[#FFC978]/40 p-6 sm:p-8 shadow-[0_25px_70px_rgba(7,5,20,0.95)] overflow-hidden space-y-6 text-[#F5F2ED]"
        >
          {/* Top Luminous Rim */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFC978] to-transparent pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-[#24214A]/80 hover:bg-[#2D2A5C] text-[#B8B4D9] hover:text-[#F5F2ED] border border-[#B8B4D9]/20 transition-all cursor-pointer z-20"
            aria-label="Close Snapshot"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Title */}
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FFC978]/15 border border-[#FFC978]/30 text-[#FFC978]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ANONYMOUS CONSTELLATION SNAPSHOT</span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F2ED]">
              Share Your Night Sky
            </h2>
            <p className="text-xs text-[#B8B4D9] leading-relaxed">
              A pure visual constellation map. Zero mood labels, zero dates, and zero journal text are included.
            </p>
          </div>

          {/* Date Range Selector Segmented Control */}
          <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
            <span className="text-xs font-mono text-[#B8B4D9] hidden sm:inline flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#FFC978]" /> Range:
            </span>
            <div className="inline-flex p-1 rounded-2xl bg-[#121029]/80 border border-[#B8B4D9]/20 text-xs">
              <button
                onClick={() => setDateRange('this-month')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                  dateRange === 'this-month'
                    ? 'bg-[#FFC978] text-[#1A1836] font-bold shadow-sm'
                    : 'text-[#B8B4D9] hover:text-[#F5F2ED]'
                }`}
              >
                This Month
              </button>
              <button
                onClick={() => setDateRange('past-30-days')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                  dateRange === 'past-30-days'
                    ? 'bg-[#FFC978] text-[#1A1836] font-bold shadow-sm'
                    : 'text-[#B8B4D9] hover:text-[#F5F2ED]'
                }`}
              >
                Past 30 Days
              </button>
              <button
                onClick={() => setDateRange('all')}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer ${
                  dateRange === 'all'
                    ? 'bg-[#FFC978] text-[#1A1836] font-bold shadow-sm'
                    : 'text-[#B8B4D9] hover:text-[#F5F2ED]'
                }`}
              >
                All Stars
              </button>
            </div>
          </div>

          {/* Clean Visual Preview Card (Stripped of all text, tooltips, dates, and labels) */}
          <div className="relative rounded-3xl bg-[#0D0B1F]/90 border border-[#FFC978]/30 p-5 overflow-hidden shadow-inner text-center space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#B8B4D9] px-2">
              <span className="text-[#FFC978] font-bold tracking-widest">✦ VYNURA</span>
              <span>{captionText} · {filteredEntries.length} Stars</span>
            </div>

            {/* SVG Visual Constellation (Pure lines and glowing stars) */}
            <div className="w-full h-52 relative flex items-center justify-center overflow-hidden rounded-2xl bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1C183E] via-[#100D28] to-[#0A0818]">
              {/* Astronomical grid lines */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#2D2A5C_1px,transparent_1px),linear-gradient(to_bottom,#2D2A5C_1px,transparent_1px)] bg-[size:36px_36px] opacity-10 pointer-events-none" />

              <svg
                className="w-full h-full"
                viewBox="0 0 640 340"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <filter id="shareStarGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Starlight Beam Path */}
                {previewPath && (
                  <path
                    d={previewPath}
                    fill="none"
                    stroke="rgba(255, 201, 120, 0.45)"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Star Nodes */}
                {previewNodes.map((node, i) => (
                  <g key={i}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius * 2}
                      fill={node.color}
                      opacity={0.25}
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius}
                      fill={node.color}
                      filter="url(#shareStarGlow)"
                    />
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.radius * 0.4}
                      fill="#FFFFFF"
                    />
                  </g>
                ))}
              </svg>
            </div>

            <div className="text-[10px] font-mono text-[#B8B4D9]/80 italic">
              "Silent constellations woven across the calm night sky."
            </div>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="p-3.5 rounded-2xl bg-[#121029]/80 border border-[#6FBFC4]/25 flex items-start gap-2.5 text-xs text-[#B8B4D9]">
            <ShieldCheck className="w-4 h-4 text-[#6FBFC4] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#F5F2ED]">Zero Data Leakage:</strong> This image contains solely geometrical stellar nodes and connecting beams. No journal notes, mood labels, or confidence metrics can ever be deduced.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleExportCanvas}
              disabled={isExporting}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FFC978] to-[#FFAE68] hover:from-[#FFD88A] hover:to-[#FFBF78] text-[#1A1836] font-bold text-xs tracking-wide transition-all shadow-[0_4px_20px_rgba(255,201,120,0.4)] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating...' : 'Download PNG (1080p)'}</span>
            </button>

            <button
              onClick={handleShareWeb}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-[#24214A] hover:bg-[#2D2A5C] text-[#F5F2ED] border border-[#B8B4D9]/30 hover:border-[#FFC978]/50 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {hasCopied ? (
                <>
                  <Check className="w-4 h-4 text-[#78FFD6]" />
                  <span>Copied Link!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#FFC978]" />
                  <span>Share Snapshot</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
