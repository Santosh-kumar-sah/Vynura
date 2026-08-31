import React from 'react';
import { motion } from 'framer-motion';
import { ScanFace, Activity, Wind, Music, Sparkles, ShieldCheck } from 'lucide-react';
import { GlowingCard } from '../common/GlowingCard';

export const ConceptSection: React.FC = () => {
  return (
    <section id="concept" className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header with Anime Panel Label */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
        >
          <div className="flex items-center gap-2 text-[#FFC978] text-xs font-semibold uppercase tracking-widest mb-2">
            <span>01 / アーキテクチャ</span>
            <span className="w-1 h-1 rounded-full bg-[#FFC978]" />
            <span>The Concept & Workflow</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl font-bold text-[#F5F2ED] tracking-tight">
            How Vynura shifts your state
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
          className="text-sm sm:text-base text-[#B8B4D9] max-w-md leading-relaxed"
        >
          Not an arbitrary survey. Vynura utilizes high-precision facial landmark geometry processed locally on your hardware to offer immediate sensory grounding.
        </motion.p>
      </div>

      {/* Asymmetric Manga-Panel Composition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Panel 1: The Vision Gaze (Large Left Panel - Span 7 cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <GlowingCard
            accentColor="#FFC978"
            className="flex-1 p-6 sm:p-8 flex flex-col justify-between"
            delay={0.1}
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FFC978]/15 border border-[#FFC978]/40 flex items-center justify-center text-[#FFC978]">
                    <ScanFace className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-heading text-[#FFC978] tracking-widest block">
                      第一章 · STEP 01
                    </span>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F2ED]">
                      The Look — In-Browser Micro-Expressions
                    </h3>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-[#2D2A5C] text-[11px] font-mono text-[#6FBFC4] border border-[#6FBFC4]/30">
                  0ms Latency
                </span>
              </div>

              <p className="text-sm text-[#B8B4D9] leading-relaxed mb-6">
                Position your face within the celestial aperture. The neural model maps 68 distinct biometric coordinate nodes across eye openness, brow tension, and mouth curvature.
              </p>

              {/* Simulated Anime Face-Mesh HUD Visualizer */}
              <div className="relative h-48 rounded-xl bg-[#121029] border border-[#B8B4D9]/20 overflow-hidden flex items-center justify-center p-4">
                {/* Background grid lines */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#2D2A5C_1px,transparent_1px),linear-gradient(to_bottom,#2D2A5C_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />

                {/* Reticle Focus Rings */}
                <div className="absolute w-36 h-36 rounded-full border border-dashed border-[#FFC978]/40 animate-spin" style={{ animationDuration: '30s' }} />
                <div className="absolute w-28 h-28 rounded-full border border-[#6FBFC4]/40" />

                {/* Simulated Landmark Nodes */}
                <div className="relative z-10 flex flex-col items-center gap-2">
                  <div className="flex items-center gap-6">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#6FBFC4] shadow-[0_0_8px_#6FBFC4]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#6FBFC4] shadow-[0_0_8px_#6FBFC4]" />
                  </div>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FFC978] shadow-[0_0_6px_#FFC978]" />
                  <div className="w-12 h-3 rounded-full border-b-2 border-[#FF9E7D] shadow-[0_0_8px_#FF9E7D]" />
                </div>

                {/* Live Floating HUD Telemetry Badges */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-[#1A1836]/90 border border-[#FFC978]/30 text-[10px] font-mono text-[#FFC978]">
                  EYE_ASPECT_RATIO: 0.842
                </div>
                <div className="absolute top-3 right-3 px-2 py-1 rounded bg-[#1A1836]/90 border border-[#6FBFC4]/30 text-[10px] font-mono text-[#6FBFC4]">
                  TENSION_INDEX: 0.12 (LOW)
                </div>
                <div className="absolute bottom-3 left-3 px-2 py-1 rounded bg-[#1A1836]/90 border border-[#B8B4D9]/30 text-[10px] font-mono text-[#B8B4D9]">
                  CONFIDENCE: 99.4%
                </div>
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded bg-[#FF9E7D]/20 border border-[#FF9E7D]/40 text-[10px] font-semibold text-[#FF9E7D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF9E7D] animate-ping" />
                  STATE: JOY_RESONANT
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#B8B4D9]/15 flex items-center justify-between text-xs text-[#B8B4D9]">
              <span className="flex items-center gap-1.5 text-[#6FBFC4]">
                <ShieldCheck className="w-4 h-4" /> 100% Client-Side WebAssembly
              </span>
              <span className="font-heading text-[#FFC978]">プライバシー保護</span>
            </div>
          </GlowingCard>
        </div>

        {/* Panel 2: The Emotional Alchemy (Tall Right Panel - Span 5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <GlowingCard
            accentColor="#6FBFC4"
            className="flex-1 p-6 sm:p-8 flex flex-col justify-between"
            delay={0.2}
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-[#6FBFC4]/15 border border-[#6FBFC4]/40 flex items-center justify-center text-[#6FBFC4]">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-heading text-[#6FBFC4] tracking-widest block">
                    第二章 · STEP 02
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F2ED]">
                    The Translation — Cosmic Alchemy
                  </h3>
                </div>
              </div>

              <p className="text-sm text-[#B8B4D9] leading-relaxed mb-6">
                Facial vectors are translated into emotional frequencies across 5 primary harmonic states, mapping your mental weather.
              </p>

              {/* Harmonic State Frequency Bars */}
              <div className="space-y-3 bg-[#121029]/80 p-4 rounded-xl border border-[#B8B4D9]/15">
                {[
                  { label: 'Radiance / Joy', value: 88, color: '#FF9E7D' },
                  { label: 'Serenity / Calm', value: 72, color: '#6FBFC4' },
                  { label: 'Energy / Drive', value: 64, color: '#C25AE0' },
                  { label: 'Introspection / Neutral', value: 30, color: '#8B87B0' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#F5F2ED] font-medium">{item.label}</span>
                      <span className="font-mono text-[#B8B4D9]">{item.value}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#1A1836] overflow-hidden p-0.5 border border-[#B8B4D9]/15">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.value}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[#B8B4D9]/15 flex items-center justify-between text-xs text-[#B8B4D9]">
              <span>Dynamic Harmonic Mapping</span>
              <span className="font-heading text-[#6FBFC4]">感情の波長</span>
            </div>
          </GlowingCard>
        </div>

        {/* Panel 3: The Shift Actions (Wide Full-Span Bottom Panel - Span 12 cols) */}
        <div className="lg:col-span-12">
          <GlowingCard
            accentColor="#FF9E7D"
            className="p-6 sm:p-8"
            delay={0.3}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FF9E7D]/15 border border-[#FF9E7D]/40 flex items-center justify-center text-[#FF9E7D]">
                  <Wind className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-heading text-[#FF9E7D] tracking-widest block">
                    第三章 · STEP 03
                  </span>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F2ED]">
                    The Shift — Sensory & Somatic Intervention
                  </h3>
                </div>
              </div>
              <p className="text-xs text-[#B8B4D9] max-w-sm">
                Targeted actions designed to amplify positive resonance or soothe overstimulated nervous systems.
              </p>
            </div>

            {/* 3 Modality Sub-Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#1A1836]/90 border border-[#B8B4D9]/15 hover:border-[#FFC978]/40 transition-colors">
                <div className="flex items-center gap-2 text-[#FFC978] text-xs font-bold mb-2">
                  <Music className="w-4 h-4" />
                  <span>Sonic Frequency Shifts</span>
                </div>
                <p className="text-xs text-[#B8B4D9] leading-relaxed">
                  Binaural audio, Shinkai-esque lofi piano, or 432Hz ambient chimes matched to your emotional resonance.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#1A1836]/90 border border-[#B8B4D9]/15 hover:border-[#6FBFC4]/40 transition-colors">
                <div className="flex items-center gap-2 text-[#6FBFC4] text-xs font-bold mb-2">
                  <Wind className="w-4 h-4" />
                  <span>Rhythmic Breath Guides</span>
                </div>
                <p className="text-xs text-[#B8B4D9] leading-relaxed">
                  Anime particle lung animations guiding 4-7-8 parasympathetic down-regulation in under 90 seconds.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#1A1836]/90 border border-[#B8B4D9]/15 hover:border-[#C25AE0]/40 transition-colors">
                <div className="flex items-center gap-2 text-[#C25AE0] text-xs font-bold mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Constellation Inscriptions</span>
                </div>
                <p className="text-xs text-[#B8B4D9] leading-relaxed">
                  One-sentence cognitive reframing prompts that turn transient feelings into permanent celestial stars.
                </p>
              </div>
            </div>
          </GlowingCard>
        </div>
      </div>
    </section>
  );
};
