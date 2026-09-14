import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Download,
  Share2,
  Check,
  Star,
  Orbit,
  Quote,
  Compass,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { MonthlyRecapData } from '../../types/recap';
import { MOODS } from '../sections/HeroSection';
import { markMonthlyRecapSeen } from '../../utils/monthlyRecap';

interface MonthlyRecapModalProps {
  isOpen: boolean;
  onClose: () => void;
  recapData: MonthlyRecapData;
}

export const MonthlyRecapModal: React.FC<MonthlyRecapModalProps> = ({
  isOpen,
  onClose,
  recapData,
}) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  // Total slides: Cover (0) + Dominant Mood (1) + Highlight Moments (N) + Summary (Final)
  const totalSlides = 2 + recapData.highlights.length + 1;
  const lastSlideIndex = totalSlides - 1;

  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0);
      markMonthlyRecapSeen(recapData.monthKey);
    }
  }, [isOpen, recapData.monthKey]);

  // Trigger confetti when arriving at final summary slide
  useEffect(() => {
    if (isOpen && currentSlide === lastSlideIndex) {
      try {
        confetti({
          particleCount: 65,
          spread: 90,
          origin: { y: 0.55 },
          colors: ['#FFC978', '#6FBFC4', '#FF9EAA', '#B8B4D9', '#FFFFFF'],
          shapes: ['circle', 'star'],
        });
      } catch {
        // ignore
      }
    }
  }, [isOpen, currentSlide, lastSlideIndex]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentSlide < lastSlideIndex) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const dominantMoodMeta = MOODS[recapData.dominantMood] || MOODS.happy;

  // Generate 1080x1920 high-res memory canvas card
  const handleExportCanvas = () => {
    setIsExporting(true);

    try {
      confetti({
        particleCount: 45,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFC978', '#6FBFC4', '#FF9EAA', '#FFF2D6'],
      });
    } catch {
      // ignore
    }

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsExporting(false);
      return;
    }

    // 1. Deep Celestial Nebula Background
    const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGradient.addColorStop(0, '#0E0C22');
    bgGradient.addColorStop(0.3, '#1A1836');
    bgGradient.addColorStop(0.7, '#24214A');
    bgGradient.addColorStop(1, '#0B091B');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Cosmic Ambient Glow Pools
    const glow1 = ctx.createRadialGradient(540, 500, 50, 540, 500, 550);
    glow1.addColorStop(0, `${dominantMoodMeta.color}35`);
    glow1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, 1080, 1920);

    const glow2 = ctx.createRadialGradient(540, 1400, 50, 540, 1400, 600);
    glow2.addColorStop(0, 'rgba(255, 201, 120, 0.25)');
    glow2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, 1080, 1920);

    // 3. Starlight Particles
    for (let i = 0; i < 110; i++) {
      const x = (Math.sin(i * 123) * 0.5 + 0.5) * 1080;
      const y = (Math.cos(i * 87) * 0.5 + 0.5) * 1920;
      const radius = (i % 3 === 0 ? 3.5 : 2) + Math.random();
      const alpha = (i % 4 === 0 ? 0.9 : 0.4) + Math.random() * 0.3;

      ctx.fillStyle = `rgba(255, 242, 214, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Double Starlight Frame
    ctx.strokeStyle = 'rgba(255, 201, 120, 0.45)';
    ctx.lineWidth = 3;
    ctx.strokeRect(70, 70, 940, 1780);

    ctx.strokeStyle = 'rgba(184, 180, 217, 0.2)';
    ctx.lineWidth = 1;
    ctx.strokeRect(85, 85, 910, 1750);

    // 5. Header Branding
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFC978';
    ctx.font = 'bold 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('✦ V Y N U R A ✦', 540, 210);

    ctx.fillStyle = '#B8B4D9';
    ctx.font = '500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('MONTHLY BRIGHTEST NIGHTS REEL', 540, 260);

    // 6. Month Pill
    ctx.fillStyle = 'rgba(255, 201, 120, 0.15)';
    ctx.strokeStyle = 'rgba(255, 201, 120, 0.5)';
    ctx.lineWidth = 2;
    const pillWidth = 360;
    const pillHeight = 60;
    const pillX = 540 - pillWidth / 2;
    const pillY = 360;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 30);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFC978';
    ctx.font = 'bold 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(`${recapData.monthName.toUpperCase()} ${recapData.year}`, 540, 400);

    // 7. Dominant Frequency Visual
    ctx.fillStyle = dominantMoodMeta.color;
    ctx.font = 'bold 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(recapData.dominantMoodLabel, 540, 560);

    ctx.fillStyle = '#B8B4D9';
    ctx.font = '500 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`Primary Cosmic Resonance (${recapData.dominantMoodPercentage}%)`, 540, 615);

    // 8. Stats Metrics Box
    const boxY = 720;
    ctx.fillStyle = 'rgba(36, 33, 74, 0.6)';
    ctx.strokeStyle = 'rgba(255, 201, 120, 0.3)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(140, boxY, 800, 320, 24);
    ctx.fill();
    ctx.stroke();

    // Metric 1: Bright Moments
    ctx.fillStyle = '#FFC978';
    ctx.font = 'bold 54px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${recapData.totalPositiveMoments}`, 300, boxY + 130);
    ctx.fillStyle = '#F5F2ED';
    ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Bright Moments', 300, boxY + 180);

    // Metric 2: Freeze Captures
    ctx.fillStyle = '#6FBFC4';
    ctx.font = 'bold 54px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${recapData.freezeCapturesCount || recapData.highlights.length}`, 540, boxY + 130);
    ctx.fillStyle = '#F5F2ED';
    ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Frozen Insights', 540, boxY + 180);

    // Metric 3: Streak Days
    ctx.fillStyle = '#FF9EAA';
    ctx.font = 'bold 54px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${recapData.longestStreakDays}d`, 780, boxY + 130);
    ctx.fillStyle = '#F5F2ED';
    ctx.font = '600 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Starlight Streak', 780, boxY + 180);

    // 9. Featured Highlight Reflection
    const topHighlight = recapData.highlights[0];
    if (topHighlight) {
      ctx.fillStyle = '#FFF2D6';
      ctx.font = 'italic 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      const quoteText = `"${topHighlight.journalText || topHighlight.label}"`;

      // Word wrapping
      const words = quoteText.split(' ');
      let line = '';
      let qY = 1200;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 760 && n > 0) {
          ctx.fillText(line.trim(), 540, qY);
          line = words[n] + ' ';
          qY += 50;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), 540, qY);

      ctx.fillStyle = '#FFC978';
      ctx.font = '600 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`— Captured ${topHighlight.dateFormatted}`, 540, qY + 60);
    }

    // 10. Poetic Summary
    ctx.fillStyle = '#B8B4D9';
    ctx.font = '400 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('"Every star you inscribe brings quiet clarity to the night sky."', 540, 1540);

    // 11. Footer
    ctx.fillStyle = '#B8B4D9';
    ctx.font = '500 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`Vynura Starlight Harmony · ${recapData.monthName} ${recapData.year}`, 540, 1740);

    // Trigger PNG Download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `vynura-brightest-nights-${recapData.monthKey}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setIsExporting(false);
  };

  const handleShare = async () => {
    const text = `My Brightest Nights in ${recapData.monthName}: ${recapData.totalPositiveMoments} moments of starlight with ${recapData.dominantMoodLabel} on Vynura! 🌌✨`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Vynura Brightest Nights · ${recapData.monthName}`,
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

        {/* Modal Reel Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative w-full max-w-lg my-6 rounded-3xl bg-[#1A1836]/95 border border-[#FFC978]/40 shadow-[0_25px_70px_rgba(7,5,20,0.95)] p-6 sm:p-8 space-y-6 text-[#F5F2ED] overflow-hidden flex flex-col justify-between min-h-[580px]"
        >
          {/* Top Story Stepper Progress Bars */}
          <div className="flex items-center gap-1.5 w-full">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className="h-1.5 flex-1 rounded-full overflow-hidden bg-[#B8B4D9]/25 transition-all cursor-pointer"
              >
                <div
                  className="h-full bg-gradient-to-r from-[#FFC978] to-[#FFAE68] transition-all duration-300"
                  style={{
                    width: idx <= currentSlide ? '100%' : '0%',
                  }}
                />
              </button>
            ))}
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-[#24214A]/80 hover:bg-[#2D2A5C] text-[#B8B4D9] hover:text-[#F5F2ED] border border-[#B8B4D9]/20 transition-all cursor-pointer z-20"
            aria-label="Close Highlight Reel"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Dynamic Story Slide Content */}
          <div className="relative flex-1 flex flex-col justify-center py-4">
            <AnimatePresence mode="wait">
              {/* SLIDE 0: Introduction Cover */}
              {currentSlide === 0 && (
                <motion.div
                  key="slide-cover"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                  className="text-center space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-[#FFC978]/15 border border-[#FFC978]/40 text-[#FFC978]">
                    <Orbit className="w-4 h-4 animate-spin" style={{ animationDuration: '12s' }} />
                    <span>MONTHLY MEMORY REEL</span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="font-heading text-3xl sm:text-4xl font-bold text-[#F5F2ED] tracking-tight">
                      Your Brightest Nights
                    </h2>
                    <div className="text-lg sm:text-xl font-heading text-[#FFC978] font-semibold">
                      {recapData.monthName} {recapData.year}
                    </div>
                  </div>

                  {/* Ambient Celestial Orb */}
                  <div className="relative mx-auto w-36 h-36 rounded-full bg-gradient-to-tr from-[#FFC978]/30 via-[#6FBFC4]/25 to-[#FF9EAA]/30 border border-[#FFC978]/40 flex items-center justify-center shadow-[0_0_40px_rgba(255,201,120,0.3)]">
                    <Sparkles className="w-14 h-14 text-[#FFC978] animate-pulse" />
                  </div>

                  <p className="text-sm text-[#B8B4D9] max-w-sm mx-auto leading-relaxed">
                    A retrospective journey through your moments of joy, presence, and stillness under the stars.
                  </p>
                </motion.div>
              )}

              {/* SLIDE 1: Dominant Cosmic Frequency */}
              {currentSlide === 1 && (
                <motion.div
                  key="slide-dominant"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                  className="text-center space-y-6"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold bg-[#24214A] border border-[#B8B4D9]/20 text-[#B8B4D9]">
                    <Compass className="w-3.5 h-3.5 text-[#FFC978]" />
                    <span>DOMINANT HARMONIC</span>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs uppercase font-mono tracking-widest text-[#B8B4D9]">
                      Your Sky Resonated Primarily In
                    </div>
                    <h3
                      className="font-heading text-4xl sm:text-5xl font-bold tracking-tight"
                      style={{ color: dominantMoodMeta.color }}
                    >
                      {recapData.dominantMoodLabel}
                    </h3>
                  </div>

                  {/* Frequency Card */}
                  <div className="p-5 rounded-2xl bg-[#24214A]/70 border border-[#B8B4D9]/20 space-y-3">
                    <div className="flex items-center justify-between text-xs font-mono text-[#B8B4D9]">
                      <span>Harmonic Concentration</span>
                      <span className="font-bold text-[#FFC978]">
                        {recapData.dominantMoodPercentage}% of logs
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#100D28] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${recapData.dominantMoodPercentage}%`,
                          backgroundColor: dominantMoodMeta.color,
                        }}
                      />
                    </div>
                    <p className="text-xs text-[#F5F2ED] italic font-heading pt-1">
                      "{dominantMoodMeta.quote}"
                    </p>
                  </div>
                </motion.div>
              )}

              {/* SLIDES 2 to N: Individual Highlight Moments */}
              {currentSlide >= 2 && currentSlide < lastSlideIndex && (
                (() => {
                  const momentIndex = currentSlide - 2;
                  const moment = recapData.highlights[momentIndex];
                  if (!moment) return null;
                  const momentMoodMeta = MOODS[moment.mood] || MOODS.happy;

                  return (
                    <motion.div
                      key={`slide-moment-${moment.id}`}
                      initial={{ opacity: 0, x: 25 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -25 }}
                      transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                      className="space-y-5"
                    >
                      {/* Moment Badge Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5"
                            style={{
                              backgroundColor: `${momentMoodMeta.color}20`,
                              borderColor: `${momentMoodMeta.color}50`,
                              color: momentMoodMeta.color,
                            }}
                          >
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{moment.label}</span>
                          </span>

                          {moment.isFreezeCapture && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#FFC978]/20 border border-[#FFC978]/50 text-[#FFC978]">
                              ✨ Frozen Moment
                            </span>
                          )}

                          {moment.blendLabel && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#6FBFC4]/20 border border-[#6FBFC4]/50 text-[#6FBFC4]">
                              ✦ Dual Blend
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-mono text-[#B8B4D9]">
                          {moment.dateFormatted}
                        </span>
                      </div>

                      {/* Main Reflection Quote Card */}
                      <div
                        className="p-6 rounded-2xl border shadow-xl relative overflow-hidden space-y-4"
                        style={{
                          background: `linear-gradient(145deg, #24214A 0%, #1A1836 100%)`,
                          borderColor: `${momentMoodMeta.color}40`,
                        }}
                      >
                        <Quote className="w-8 h-8 opacity-20 text-[#FFC978] absolute top-4 right-4" />

                        <div className="text-xs font-mono uppercase tracking-wider text-[#FFC978]">
                          {moment.sparkTitle || (moment.isFreezeCapture ? 'Captured Memory' : 'Starlight Log')}
                        </div>

                        <p className="text-base sm:text-lg text-[#F5F2ED] font-heading font-medium leading-relaxed">
                          "{moment.journalText || 'A moment of calm equilibrium under the starlit sky.'}"
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-[#B8B4D9]/15 text-xs text-[#B8B4D9]">
                          <span>Resonance Match</span>
                          <span className="font-mono font-bold text-[#FFC978]">
                            {Math.round(moment.confidence * 100)}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })()
              )}

              {/* FINAL SLIDE: Recap Scorecard & Canvas Export */}
              {currentSlide === lastSlideIndex && (
                <motion.div
                  key="slide-summary"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -25 }}
                  transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
                  className="space-y-5 text-center"
                >
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FFC978]/15 border border-[#FFC978]/40 text-[#FFC978]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>MONTHLY CONSTELLATION COMPLETE</span>
                  </div>

                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F2ED]">
                    {recapData.monthName} Retrospective
                  </h3>

                  {/* 3-Column Metrics Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#24214A]/70 border border-[#B8B4D9]/20">
                      <div className="font-heading text-2xl font-bold text-[#FFC978]">
                        {recapData.totalPositiveMoments}
                      </div>
                      <div className="text-[10px] font-mono text-[#B8B4D9] uppercase mt-1">
                        Bright Moments
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#24214A]/70 border border-[#B8B4D9]/20">
                      <div className="font-heading text-2xl font-bold text-[#6FBFC4]">
                        {recapData.freezeCapturesCount || recapData.highlights.length}
                      </div>
                      <div className="text-[10px] font-mono text-[#B8B4D9] uppercase mt-1">
                        Frozen Insights
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#24214A]/70 border border-[#B8B4D9]/20">
                      <div className="font-heading text-2xl font-bold text-[#FF9EAA]">
                        {recapData.longestStreakDays}d
                      </div>
                      <div className="text-[10px] font-mono text-[#B8B4D9] uppercase mt-1">
                        Streak
                      </div>
                    </div>
                  </div>

                  {/* Poetic Outro Note */}
                  <p className="text-xs text-[#B8B4D9] italic font-heading max-w-md mx-auto leading-relaxed">
                    "{recapData.poeticSummary}"
                  </p>

                  {/* Export & Share Action Buttons */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <button
                      onClick={handleExportCanvas}
                      disabled={isExporting}
                      className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#FFC978] to-[#FFAE68] hover:from-[#FFD88A] hover:to-[#FFBF78] text-[#1A1836] font-bold text-xs tracking-wide transition-all shadow-[0_4px_20px_rgba(255,201,120,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>{isExporting ? 'Generating...' : 'Export Card (1080p)'}</span>
                    </button>

                    <button
                      onClick={handleShare}
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
                          <span>Share Recap</span>
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Stepper Controls (Previous / Next) */}
          <div className="flex items-center justify-between pt-4 border-t border-[#B8B4D9]/15">
            <button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentSlide === 0
                  ? 'opacity-30 cursor-not-allowed text-[#B8B4D9]'
                  : 'bg-[#24214A] hover:bg-[#2D2A5C] text-[#F5F2ED] border border-[#B8B4D9]/20'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <span className="text-xs font-mono text-[#B8B4D9]">
              {currentSlide + 1} / {totalSlides}
            </span>

            <button
              onClick={handleNext}
              disabled={currentSlide === lastSlideIndex}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentSlide === lastSlideIndex
                  ? 'opacity-30 cursor-not-allowed text-[#B8B4D9]'
                  : 'bg-[#FFC978] hover:bg-[#FFD88A] text-[#1A1836] font-bold shadow-glow-sm'
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
