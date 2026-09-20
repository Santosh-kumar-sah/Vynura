import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Footer: React.FC = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-white/[0.06] bg-[#0D0B14] py-16 text-xs text-[#B8B3CE]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-white/[0.08] border border-white/[0.14] flex items-center justify-center text-amber-400 font-semibold text-xs">
                ✦
              </div>
              <span className="font-semibold text-base tracking-tight text-white">
                Vynura
              </span>
            </div>
            <p className="text-xs text-[#94A3B8] max-w-sm leading-relaxed">
              Intelligent emotional state engine. High-performance on-device facial landmark tracking and physiological regulation.
            </p>
            <div className="inline-flex items-center gap-2 pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-mono text-[#64748B]">All Local Engines Operational</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => navigate('/mood')}
                  className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-xs text-[#94A3B8]"
                >
                  Shift Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/constellation')}
                  className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-xs text-[#94A3B8]"
                >
                  Constellation Map
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/wellness/breathing')}
                  className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-xs text-[#94A3B8]"
                >
                  Breath Regulation
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/wellness')}
                  className="hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 text-xs text-[#94A3B8]"
                >
                  Sanctuary Hub
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Security
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#concept" className="hover:text-white transition-colors">
                  Inference Architecture
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition-colors">
                  Zero Data Retention
                </a>
              </li>
              <li>
                <a href="#paired-checkins" className="hover:text-white transition-colors">
                  Mutual Consent Social
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#64748B]">
          <div>
            © {new Date().getFullYear()} Vynura. Private on-device biometric intelligence.
          </div>
          <div className="flex items-center gap-4">
            <span>Inter / WebGL 2.0</span>
            <span>·</span>
            <span>Client-Side Wasm</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
