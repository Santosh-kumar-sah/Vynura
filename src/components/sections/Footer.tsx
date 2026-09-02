import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-[#B8B4D9]/15 bg-[#121029]/80 backdrop-blur-md pt-16 pb-12 overflow-hidden">
      {/* Top subtle glow horizon line */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-[#FFC978]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#2D2A5C] border border-[#FFC978]/40 flex items-center justify-center text-[#FFC978] shadow-glow-sm">
                <span>✦</span>
              </div>
              <span className="font-heading font-bold text-2xl text-[#F5F2ED]">Vynura</span>
              <span className="text-xs text-[#FFC978] font-mono uppercase tracking-widest">Sanctuary</span>
            </div>

            <p className="font-heading italic text-[#FFC978] text-base">
              "See it. Feel it. Shift it."
            </p>

            <p className="text-xs text-[#B8B4D9] max-w-sm leading-relaxed">
              An emotion companion inspired by twilight night skies and firefly warmth. Handcrafted for inner peace and grounded clarity.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A1836] border border-[#B8B4D9]/20 text-[11px] text-[#B8B4D9]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#6FBFC4]" />
              <span>Full System Active · 6 Phases Deployed</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold text-[#F5F2ED] uppercase tracking-wider">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#B8B4D9]">
              <li>
                <a href="#concept" className="hover:text-[#FFC978] transition-colors">
                  The Concept & Workflow
                </a>
              </li>
              <li>
                <a href="#recommendations" className="hover:text-[#FFC978] transition-colors">
                  Shift Engine
                </a>
              </li>
              <li>
                <a href="#constellation" className="hover:text-[#FFC978] transition-colors">
                  Constellation Mood Map
                </a>
              </li>
              <li>
                <a href="#wellness" className="hover:text-[#FFC978] transition-colors">
                  Wellness Actions Hub
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-[#FFC978] transition-colors">
                  Privacy Sanctuary
                </a>
              </li>
            </ul>
          </div>

          {/* Architecture Modules */}
          <div className="space-y-3">
            <h4 className="font-heading text-sm font-bold text-[#F5F2ED] uppercase tracking-wider">
              Sanctuary Core
            </h4>
            <ul className="space-y-2 text-xs text-[#B8B4D9]">
              <li className="flex items-center gap-1.5 text-[#FFC978] font-semibold">
                <span className="text-[10px]">✦</span> Face-API Neural Vision Core
              </li>
              <li className="flex items-center gap-1.5 text-[#6FBFC4] font-semibold">
                <span className="text-[10px]">✦</span> Smart Shift Recommendation
              </li>
              <li className="flex items-center gap-1.5 text-[#FF9E7D] font-semibold">
                <span className="text-[10px]">✦</span> Living Constellation History
              </li>
              <li className="flex items-center gap-1.5 text-[#C25AE0] font-semibold">
                <span className="text-[10px]">✦</span> Somatic Firefly Pacer
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer */}
        <div className="pt-8 border-t border-[#B8B4D9]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#B8B4D9]">
          <div className="flex items-center gap-1.5">
            <span>Crafted with</span>
            <span className="text-[#FF9E7D]">♥</span>
            <span>& starlight for calm minds</span>
          </div>

          <div className="flex items-center gap-6">
            <span>100% In-Browser Privacy</span>
            <span>© {new Date().getFullYear()} Vynura. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
