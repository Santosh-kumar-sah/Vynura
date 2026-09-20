import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  Camera, 
  ArrowRight,
  Sliders,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './Button';
import { PreferencesModal } from './PreferencesModal';

interface NavbarProps {
  onOpenFaceDetection?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenFaceDetection }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', to: '/', hash: '#concept' },
    { label: 'Shift Engine', to: '/mood' },
    { label: 'Constellation', to: '/constellation' },
    { label: 'Sanctuary', to: '/wellness' },
    { label: 'Privacy', to: '/', hash: '#privacy' },
  ];

  const handleNavClick = (link: { to: string; hash?: string }) => {
    if (link.hash) {
      if (location.pathname !== '/') {
        navigate('/' + link.hash);
      } else {
        const el = document.querySelector(link.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(link.to);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#08090A]/80 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Brand Logo & Wordmark (Left) */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2.5 focus:outline-none select-none shrink-0 cursor-pointer text-left bg-transparent border-none p-0 group"
        >
          <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-white transition-all group-hover:border-white/30">
            <span className="text-[#F59E0B] text-xs font-semibold">✦</span>
          </div>
          <span className="font-semibold text-base tracking-tight text-white group-hover:text-white/90 transition-colors">
            Vynura
          </span>
        </button>

        {/* Center-Aligned Nav Links (plain text, 14px, gray-400, hover to white — no background pill) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to && !link.hash;
            return (
              <button
                key={link.label}
                onClick={() => handleNavClick(link)}
                className={`text-[14px] font-normal transition-colors cursor-pointer bg-transparent border-none p-0 ${
                  isActive
                    ? 'text-white font-medium'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Side: Settings icon + Exactly ONE solid white button */}
        <div className="flex items-center gap-3">
          {/* Quick Preferences Trigger (Max 1 icon) */}
          <button
            onClick={() => setIsPreferencesOpen(true)}
            className="p-2 rounded-lg bg-transparent hover:bg-white/[0.05] text-white/60 hover:text-white transition-colors cursor-pointer border-none"
            title="System Preferences"
            aria-label="System Preferences"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Exactly One Solid White Button */}
          <div className="hidden sm:block">
            <Button
              size="sm"
              variant="primary"
              icon={<Camera className="w-3.5 h-3.5" />}
              onClick={() => {
                if (onOpenFaceDetection) {
                  onOpenFaceDetection();
                } else {
                  navigate('/mood');
                }
              }}
            >
              Launch Vision
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-transparent text-white/70 border border-white/[0.1] hover:text-white transition-colors cursor-pointer"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Preferences Modal */}
      <PreferencesModal
        isOpen={isPreferencesOpen}
        onClose={() => setIsPreferencesOpen(false)}
      />

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden max-w-6xl mx-auto mt-2 rounded-2xl bg-[#0B0A10]/95 backdrop-blur-2xl border border-white/[0.08] shadow-2xl p-4 space-y-3"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleNavClick(link);
                  }}
                  className="px-3 py-2.5 rounded-lg text-left text-xs font-medium text-white/70 hover:text-white hover:bg-white/[0.04] transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-white/[0.08]">
              <Button
                size="md"
                variant="primary"
                className="w-full text-xs"
                icon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenFaceDetection) {
                    onOpenFaceDetection();
                  } else {
                    navigate('/mood');
                  }
                }}
              >
                Launch Vision Calibration
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
