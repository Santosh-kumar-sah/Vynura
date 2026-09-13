import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Download,
  Share2,
  Sparkles,
  Check,
  Flame,
  Star,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { SparkActivity, SparkStreak } from '../../types/sparks';

interface SparkShareCardProps {
  isOpen: boolean;
  onClose: () => void;
  activity: SparkActivity;
  streak: SparkStreak;
}

export const SparkShareCard: React.FC<SparkShareCardProps> = ({
  isOpen,
  onClose,
  activity,
  streak,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  // Generate high-resolution 1080x1920 PNG export via HTML5 Canvas
  const handleDownloadImage = () => {
    setIsExporting(true);

    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FFC978', '#FFAE68', '#78FFD6', '#FFF2D6'],
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

    // 1. Deep Celestial Background Gradient
    const bgGradient = ctx.createLinearGradient(0, 0, 1080, 1920);
    bgGradient.addColorStop(0, '#100E26');
    bgGradient.addColorStop(0.3, '#1A1836');
    bgGradient.addColorStop(0.7, '#24214A');
    bgGradient.addColorStop(1, '#0D0B1F');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1920);

    // 2. Ambient Nebula Glow Pools
    const glow1 = ctx.createRadialGradient(540, 450, 50, 540, 450, 500);
    glow1.addColorStop(0, 'rgba(255, 201, 120, 0.22)');
    glow1.addColorStop(1, 'rgba(255, 201, 120, 0)');
    ctx.fillStyle = glow1;
    ctx.fillRect(0, 0, 1080, 1920);

    const glow2 = ctx.createRadialGradient(540, 1300, 50, 540, 1300, 600);
    glow2.addColorStop(0, 'rgba(120, 166, 255, 0.18)');
    glow2.addColorStop(1, 'rgba(120, 166, 255, 0)');
    ctx.fillStyle = glow2;
    ctx.fillRect(0, 0, 1080, 1920);

    // 3. Ambient Starlight Starfield Particles
    for (let i = 0; i < 90; i++) {
      const x = (Math.sin(i * 99) * 0.5 + 0.5) * 1080;
      const y = (Math.cos(i * 77) * 0.5 + 0.5) * 1920;
      const radius = (i % 3 === 0 ? 3.5 : 2) + Math.random();
      const alpha = (i % 4 === 0 ? 0.9 : 0.4) + Math.random() * 0.3;

      ctx.fillStyle = `rgba(255, 242, 214, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Card Inner Frame / Glass Border
    ctx.strokeStyle = 'rgba(255, 201, 120, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(80, 80, 920, 1760);

    ctx.strokeStyle = 'rgba(184, 180, 217, 0.15)';
    ctx.lineWidth = 1;
    ctx.strokeRect(95, 95, 890, 1730);

    // 5. Header Branding: VYNURA Wordmark
    ctx.textAlign = 'center';
    ctx.fillStyle = '#FFC978';
    ctx.font = 'bold 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '6px';
    ctx.fillText('✦ V Y N U R A ✦', 540, 230);

    ctx.fillStyle = '#B8B4D9';
    ctx.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('STARLIGHT HARMONY & MINDFUL COMPANION', 540, 280);

    // 6. Category Pill
    ctx.fillStyle = 'rgba(255, 201, 120, 0.15)';
    ctx.strokeStyle = 'rgba(255, 201, 120, 0.5)';
    ctx.lineWidth = 2;
    const pillWidth = 320;
    const pillHeight = 56;
    const pillX = 540 - pillWidth / 2;
    const pillY = 400;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 28);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FFC978';
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '2px';
    ctx.fillText(`SPARK · ${activity.category.toUpperCase()}`, 540, 436);

    // 7. Activity Title (Wrapped)
    ctx.fillStyle = '#F5F2ED';
    ctx.font = 'bold 56px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '-0.5px';

    const words = activity.title.split(' ');
    let line = '';
    let currentY = 590;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 780 && n > 0) {
        ctx.fillText(line.trim(), 540, currentY);
        line = words[n] + ' ';
        currentY += 70;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), 540, currentY);

    // 8. Duration Micro-Badge
    ctx.fillStyle = '#FFC978';
    ctx.font = '600 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`⚡ ${activity.durationSeconds}s Micro-Activity Completed`, 540, currentY + 70);

    // 9. Central Star-Chain Visual (Streak Representation)
    const streakCount = Math.max(1, streak.current_streak);
    const starChainY = 1000;
    const maxDisplayedStars = Math.min(7, streakCount);
    const starSpacing = 90;
    const startX = 540 - ((maxDisplayedStars - 1) * starSpacing) / 2;

    // Connecting Starlight Beam
    if (maxDisplayedStars > 1) {
      ctx.strokeStyle = 'rgba(255, 201, 120, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(startX, starChainY);
      ctx.lineTo(startX + (maxDisplayedStars - 1) * starSpacing, starChainY);
      ctx.stroke();
    }

    // Star Nodes
    for (let s = 0; s < maxDisplayedStars; s++) {
      const sx = startX + s * starSpacing;
      // Outer glow
      const sGlow = ctx.createRadialGradient(sx, starChainY, 5, sx, starChainY, 35);
      sGlow.addColorStop(0, 'rgba(255, 201, 120, 0.8)');
      sGlow.addColorStop(1, 'rgba(255, 201, 120, 0)');
      ctx.fillStyle = sGlow;
      ctx.beginPath();
      ctx.arc(sx, starChainY, 35, 0, Math.PI * 2);
      ctx.fill();

      // Inner Star core
      ctx.fillStyle = '#FFC978';
      ctx.beginPath();
      ctx.arc(sx, starChainY, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(sx, starChainY, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 10. Streak Big Counter
    ctx.fillStyle = '#FFC978';
    ctx.font = 'bold 96px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${streakCount}`, 540, 1180);

    ctx.fillStyle = '#F5F2ED';
    ctx.font = '600 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.letterSpacing = '3px';
    ctx.fillText('DAY STARLIGHT STREAK', 540, 1240);

    if (streak.longest_streak > streakCount) {
      ctx.fillStyle = '#B8B4D9';
      ctx.font = '400 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(`All-time Celestial Best: ${streak.longest_streak} Days`, 540, 1290);
    }

    // 11. Affirmation Quote
    ctx.fillStyle = '#FFF2D6';
    ctx.font = 'italic 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('"A small spark creates boundless light across the night sky."', 540, 1500);

    // 12. Footer Date & Starlight Attunement
    ctx.fillStyle = '#B8B4D9';
    ctx.font = '500 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${todayFormatted} · Vynura Celestial Companion`, 540, 1720);

    // Trigger PNG Download
    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `vynura-spark-streak-${streakCount}d-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setIsExporting(false);
  };

  const handleShareWeb = async () => {
    const text = `I just completed "${activity.title}" and reached a ${streak.current_streak}-day Starlight Streak on Vynura! ✦`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vynura Starlight Spark',
          text,
          url: window.location.origin,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback copy to clipboard
      await navigator.clipboard.writeText(`${text} ${window.location.origin}`);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 3000);
    }
  };

  const streakCount = Math.max(1, streak.current_streak);
  const maxStars = Math.min(7, streakCount);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#0A081C]/80 backdrop-blur-md -z-10"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative w-full max-w-md my-8 rounded-3xl bg-[#1A1836]/95 border border-[#FFC978]/40 shadow-[0_20px_60px_rgba(10,8,28,0.95)] p-6 sm:p-7 space-y-6 text-[#F5F2ED] overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-[#24214A]/80 hover:bg-[#2D2A5C] text-[#B8B4D9] hover:text-[#F5F2ED] border border-[#B8B4D9]/20 transition-all cursor-pointer z-20"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header Title */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#FFC978] bg-[#FFC978]/15 border border-[#FFC978]/30 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Shareable Starlight Card</span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#F5F2ED]">
              Starlight Spark Ignited
            </h2>
            <p className="text-xs text-[#B8B4D9]">
              Zero private data included. Safe to share with friends or socials.
            </p>
          </div>

          {/* Portrait Share Card Visual Preview (9:16 aspect preview) */}
          <div
            ref={cardRef}
            className="relative rounded-2xl p-6 border border-[#FFC978]/50 shadow-[0_10px_35px_rgba(255,201,120,0.2)] overflow-hidden space-y-5 text-center"
            style={{
              background: 'linear-gradient(180deg, #100E26 0%, #1A1836 40%, #24214A 70%, #0D0B1F 100%)',
            }}
          >
            {/* Ambient Background Light */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#FFC978]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Branding Wordmark */}
            <div className="relative z-10 space-y-0.5">
              <div className="text-xs font-bold tracking-[0.25em] text-[#FFC978] uppercase">
                ✦ V Y N U R A ✦
              </div>
              <div className="text-[9px] tracking-widest text-[#B8B4D9] uppercase">
                Starlight Mindful Companion
              </div>
            </div>

            {/* Category Pill */}
            <div className="relative z-10">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FFC978]/15 border border-[#FFC978]/40 text-[#FFC978]">
                SPARK · {activity.category.toUpperCase()}
              </span>
            </div>

            {/* Activity Title */}
            <div className="relative z-10 space-y-1">
              <h3 className="font-heading text-xl font-bold text-[#F5F2ED] leading-snug">
                {activity.title}
              </h3>
              <div className="text-[11px] font-mono text-[#FFC978] flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5" />
                <span>{activity.durationSeconds}s Micro-Activity Completed</span>
              </div>
            </div>

            {/* Constellation Star-Chain Visual */}
            <div className="relative z-10 py-2 flex items-center justify-center gap-2">
              {Array.from({ length: maxStars }).map((_, idx) => (
                <div key={idx} className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-[#FFC978]/25 border border-[#FFC978] flex items-center justify-center text-[#FFC978] shadow-[0_0_12px_#FFC978]">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                  {idx < maxStars - 1 && (
                    <div className="w-3 h-0.5 bg-[#FFC978]/60" />
                  )}
                </div>
              ))}
            </div>

            {/* Streak Number Big */}
            <div className="relative z-10 space-y-0.5">
              <div className="font-heading text-4xl font-bold text-[#FFC978] tracking-tight">
                {streakCount}
              </div>
              <div className="text-[11px] font-mono tracking-widest uppercase text-[#F5F2ED]">
                Day Starlight Streak
              </div>
            </div>

            {/* Quote & Date */}
            <div className="relative z-10 pt-3 border-t border-[#B8B4D9]/15 space-y-1">
              <p className="text-[11px] text-[#FFF2D6] italic font-heading">
                "A small spark creates boundless light across the night sky."
              </p>
              <div className="text-[9px] font-mono text-[#B8B4D9]">
                {todayFormatted} · Vynura
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleDownloadImage}
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
                  <span>Share / Copy</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
