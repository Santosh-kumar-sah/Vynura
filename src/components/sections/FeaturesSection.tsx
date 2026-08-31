import React from 'react';
import { motion } from 'framer-motion';
import { 
  ScanFace, 
  Sparkles, 
  Orbit, 
  HeartHandshake, 
  Check, 
  ChevronRight, 
  Star 
} from 'lucide-react';
import { GlowingCard } from '../common/GlowingCard';

interface FeatureCardData {
  id: string;
  badge: string;
  kanji: string;
  title: string;
  description: string;
  accentColor: string;
  icon: React.ReactNode;
  highlights: string[];
  mockVisual: React.ReactNode;
}

export const FeaturesSection: React.FC = () => {
  const features: FeatureCardData[] = [
    {
      id: 'detection',
      badge: 'Local Vision Model',
      kanji: '表情認識',
      title: 'Neural Expression Detection',
      description:
        'Local, high-speed neural face analysis that maps 68 facial points in real-time. Detects subtle emotional nuances from micro-smiles to eyebrow tension without any latency.',
      accentColor: '#FFC978',
      icon: <ScanFace className="w-5 h-5" />,
      highlights: [
        'Real-time landmark tracking (60 FPS)',
        'Zero cloud dependency / 100% on-device',
        'Multi-axis emotional tensor mapping',
      ],
      mockVisual: (
        <div className="h-36 rounded-xl bg-[#121029]/90 border border-[#FFC978]/30 p-3 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#FFC978] font-mono">VISION_STREAM_ACTIVE</span>
            <span className="px-2 py-0.5 rounded bg-[#FFC978]/20 text-[#FFC978] font-bold text-[10px]">
              60 FPS
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 my-2">
            <div className="relative w-14 h-14 rounded-full border border-dashed border-[#FFC978] flex items-center justify-center">
              <span className="text-xl">✨</span>
              <div className="absolute inset-0 rounded-full border border-[#FFC978]/40 animate-ping opacity-30" />
            </div>
            <div className="text-left space-y-1">
              <div className="text-xs font-bold text-[#F5F2ED]">Joy & Vitality Detected</div>
              <div className="text-[10px] text-[#B8B4D9] font-mono">Expression: Radiant (96.4%)</div>
              <div className="w-28 h-1.5 bg-[#1A1836] rounded-full overflow-hidden">
                <div className="w-[96%] h-full bg-[#FFC978]" />
              </div>
            </div>
          </div>
          <div className="text-[10px] text-[#B8B4D9] flex justify-between">
            <span>Latency: 4.2ms</span>
            <span className="text-[#FFC978]">Model: TFJS-BlazeFace</span>
          </div>
        </div>
      ),
    },
    {
      id: 'shifts',
      badge: 'Adaptive Alchemy',
      kanji: '気分変換',
      title: 'Smart Shift Engine',
      description:
        'Translates detected state into immediate sensory shifts: ambient Shinkai-esque lofi soundscapes, 4-7-8 breathing guides, and introspective journaling prompts tailored to your exact frequency.',
      accentColor: '#FF9E7D',
      icon: <Sparkles className="w-5 h-5" />,
      highlights: [
        'Curated sonic frequencies & binaural loops',
        'Interactive somatic breath pacing',
        'Deep inquiry gratitude prompts',
      ],
      mockVisual: (
        <div className="h-36 rounded-xl bg-[#121029]/90 border border-[#FF9E7D]/30 p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#FF9E7D] font-mono">RECOMMENDED_INTERVENTION</span>
            <span className="text-[#F5F2ED] text-[10px]">Instant Shift</span>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-[#1A1836] border border-[#FF9E7D]/20">
            <div className="w-10 h-10 rounded-lg bg-[#FF9E7D]/20 flex items-center justify-center text-[#FF9E7D] text-lg font-bold">
              🎵
            </div>
            <div className="text-left flex-1 min-w-0">
              <div className="text-xs font-bold text-[#F5F2ED] truncate">Midnight Sky Lofi</div>
              <div className="text-[10px] text-[#B8B4D9] truncate">432Hz Calm Anchor · 3 min</div>
            </div>
            <div className="w-6 h-6 rounded-full bg-[#FF9E7D] text-[#1A1836] flex items-center justify-center font-bold text-xs">
              ▶
            </div>
          </div>
          <div className="text-[10px] text-[#B8B4D9] flex justify-between">
            <span>Somatic: Box Breath (4-4-4-4)</span>
            <span className="text-[#FF9E7D]">Shift Ready</span>
          </div>
        </div>
      ),
    },
    {
      id: 'constellation',
      badge: 'Visual History',
      kanji: '星座記録',
      title: 'Constellation Mood Map',
      description:
        'Forget cold, generic corporate bar charts. Vynura maps your emotional history into a living, interconnected night-sky constellation. High-radiance days shine like Sirius; calm days glow as steady stellar clusters.',
      accentColor: '#6FBFC4',
      icon: <Orbit className="w-5 h-5" />,
      highlights: [
        'Celestial star-node emotional tracking',
        'Interconnected astral day-links',
        'Longitudinal emotional pattern resonance',
      ],
      mockVisual: (
        <div className="h-36 rounded-xl bg-[#121029]/90 border border-[#6FBFC4]/30 p-3 flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#6FBFC4] font-mono">ASTRAL_HISTORY_MAP</span>
            <span className="text-[#6FBFC4] text-[10px]">7-Day Cycle</span>
          </div>
          {/* Simulated Constellation Graphic */}
          <div className="relative h-16 w-full flex items-center justify-around px-2">
            <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 240 64">
              <path
                d="M 20 45 L 60 20 L 110 38 L 160 15 L 210 28"
                fill="none"
                stroke="rgba(111, 191, 196, 0.4)"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />
            </svg>
            {[
              { label: 'Mon', color: '#6FBFC4', size: 8 },
              { label: 'Tue', color: '#FF9E7D', size: 12 },
              { label: 'Wed', color: '#FFC978', size: 10 },
              { label: 'Thu', color: '#6FBFC4', size: 14 },
              { label: 'Fri', color: '#C25AE0', size: 11 },
            ].map((node, i) => (
              <div key={i} className="flex flex-col items-center gap-1 z-10">
                <div
                  className="rounded-full shadow-glow-sm"
                  style={{
                    width: `${node.size}px`,
                    height: `${node.size}px`,
                    backgroundColor: node.color,
                  }}
                />
                <span className="text-[9px] text-[#B8B4D9] font-mono">{node.label}</span>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-[#B8B4D9] flex justify-between">
            <span>Dominant: Orion Nebula (Calm)</span>
            <span className="text-[#6FBFC4]">5 Constellations Formed</span>
          </div>
        </div>
      ),
    },
    {
      id: 'actions',
      badge: 'Somatic Hub',
      kanji: '安らぎ',
      title: 'Wellness Actions Hub',
      description:
        'A dedicated sanctuary for somatic calming: particle-driven breathing lungs, high-focus binaural timers, and micro-gratitude anchors designed to reset your parasympathetic nervous system.',
      accentColor: '#C25AE0',
      icon: <HeartHandshake className="w-5 h-5" />,
      highlights: [
        'Particle lung breathing pacer',
        'Vagus nerve somatic activation',
        'Gentle anime streak anchors',
      ],
      mockVisual: (
        <div className="h-36 rounded-xl bg-[#121029]/90 border border-[#C25AE0]/30 p-3 flex flex-col justify-between">
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-[#C25AE0] font-mono">PARASYMPATHETIC_PACER</span>
            <span className="text-[#F5F2ED] text-[10px]">Active Wave</span>
          </div>
          <div className="flex items-center justify-center gap-4 my-1">
            <div className="w-12 h-12 rounded-full border-2 border-[#C25AE0] flex items-center justify-center relative">
              <span className="text-xs font-bold text-[#F5F2ED]">4s</span>
              <div className="absolute -inset-1 rounded-full border border-[#C25AE0]/40 animate-ping opacity-40" />
            </div>
            <div className="text-left text-xs">
              <div className="font-bold text-[#F5F2ED]">Inhale Firefly Light...</div>
              <div className="text-[10px] text-[#B8B4D9]">Cycle 2 of 4 · Deep belly breath</div>
            </div>
          </div>
          <div className="text-[10px] text-[#B8B4D9] flex justify-between">
            <span>HRV Optimization</span>
            <span className="text-[#C25AE0]">90s Reset</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFC978]/10 border border-[#FFC978]/30 text-xs font-semibold text-[#FFC978] mb-3"
        >
          <Star className="w-3.5 h-3.5" />
          <span>Crafted Modules · 機能紹介</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.08, ease: [0.34, 1.56, 0.64, 1] }}
          className="font-heading text-3xl sm:text-5xl font-bold text-[#F5F2ED] tracking-tight mb-4"
        >
          Every feature illuminated by glowing night-sky edges
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.15, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-base sm:text-lg text-[#B8B4D9]"
        >
          Built to be tactile, snappy, and deeply reassuring. Zero generic SaaS styling.
        </motion.p>
      </div>

      {/* 4 Glowing-Edge Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {features.map((feature, idx) => (
          <GlowingCard
            key={feature.id}
            accentColor={feature.accentColor}
            delay={idx * 0.1}
            interactive
            className="flex flex-col justify-between h-full"
          >
            <div>
              {/* Header Badge & Kanji */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-110"
                    style={{
                      backgroundColor: `${feature.accentColor}18`,
                      borderColor: `${feature.accentColor}50`,
                      color: feature.accentColor,
                    }}
                  >
                    {feature.icon}
                  </div>
                  <div>
                    <span
                      className="text-[10px] font-mono uppercase tracking-wider font-bold block"
                      style={{ color: feature.accentColor }}
                    >
                      {feature.badge}
                    </span>
                    <span className="text-xs text-[#B8B4D9] font-heading">{feature.kanji}</span>
                  </div>
                </div>

                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: feature.accentColor,
                    boxShadow: `0 0 8px ${feature.accentColor}`,
                  }}
                />
              </div>

              {/* Title & Description */}
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F2ED] mb-3">
                {feature.title}
              </h3>
              <p className="text-sm text-[#B8B4D9] leading-relaxed mb-6">
                {feature.description}
              </p>

              {/* Mock Visual Engine Display */}
              <div className="mb-6">{feature.mockVisual}</div>

              {/* Highlight bullet points */}
              <div className="space-y-2 mb-6">
                {feature.highlights.map((highlight, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2 text-xs text-[#F5F2ED]">
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px]"
                      style={{
                        backgroundColor: `${feature.accentColor}25`,
                        color: feature.accentColor,
                      }}
                    >
                      <Check className="w-2.5 h-2.5" />
                    </div>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Card Footer */}
            <div className="pt-4 border-t border-[#B8B4D9]/15 flex items-center justify-between text-xs">
              <span className="text-[#B8B4D9] font-medium">Architecture Phase 1 Preview</span>
              <span
                className="font-bold flex items-center gap-1 hover:underline cursor-pointer"
                style={{ color: feature.accentColor }}
              >
                <span>Inspect Spec</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </GlowingCard>
        ))}
      </div>
    </section>
  );
};
