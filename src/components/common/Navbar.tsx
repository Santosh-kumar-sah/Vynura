import React, { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 sm:px-6 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div
        className={`max-w-6xl mx-auto rounded-2xl transition-all duration-300 relative ${
          scrolled
            ? 'bg-[#0D0B14]/85 backdrop-blur-xl border border-white/[0.09] shadow-[0_12px_32px_rgba(0,0,0,0.6)] px-5 py-2.5'
            : 'bg-[#0D0B14]/50 backdrop-blur-md border border-white/[0.06] px-5 py-3'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 focus:outline-none select-none shrink-0 cursor-pointer text-left bg-transparent border-none p-0 group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-white transition-all group-hover:border-white/30">
              <span className="text-amber-400 text-sm font-semibold">✦</span>
            </div>
            <span className="font-semibold text-base sm:text-lg tracking-tight text-white group-hover:text-white/90 transition-colors">
              Vynura
            </span>
          </button>

          {/* Clean Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to && !link.hash;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer bg-transparent border-none ${
                    isActive
                      ? 'text-white bg-white/[0.08]'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Telemetry + Preferences + Primary CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Minimal Live Core Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] text-[11px] text-[#94A3B8]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Local Engine</span>
            </div>

            {/* Quick Preferences Trigger */}
            <button
              onClick={() => setIsPreferencesOpen(true)}
              className="p-2 rounded-lg bg-transparent hover:bg-white/[0.06] text-[#94A3B8] hover:text-white transition-colors cursor-pointer border-none"
              title="System Preferences"
              aria-label="System Preferences"
            >
              <Sliders className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>

            {/* Primary Action Button */}
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
              className="md:hidden p-2 rounded-lg bg-white/[0.04] text-white border border-white/[0.08] hover:bg-white/[0.08] transition-colors cursor-pointer"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
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
            className="md:hidden max-w-6xl mx-auto mt-2 rounded-2xl bg-[#0D0B14]/95 backdrop-blur-2xl border border-white/[0.1] shadow-2xl p-4 space-y-3"
          >
            <div className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleNavClick(link);
                  }}
                  className="px-3 py-2.5 rounded-lg text-left text-xs font-medium text-[#94A3B8] hover:text-white hover:bg-white/[0.05] transition-colors"
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
