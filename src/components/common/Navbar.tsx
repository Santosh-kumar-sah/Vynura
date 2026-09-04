import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Menu, 
  X, 
  ShieldCheck, 
  Compass, 
  Sparkle, 
  Camera, 
  Wind,
  Radio,
  ArrowRight
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './Button';

interface NavbarProps {
  onOpenFaceDetection?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenFaceDetection }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Concept', to: '/', hash: '#concept', icon: <Compass className="w-3.5 h-3.5" /> },
    { label: 'Shift Engine', to: '/mood', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: 'Constellation', to: '/constellation', icon: <Sparkle className="w-3.5 h-3.5" /> },
    { label: 'Sanctuary Hub', to: '/wellness', icon: <Wind className="w-3.5 h-3.5" /> },
    { label: 'Journal', to: '/journal', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: 'Privacy', to: '/', hash: '#privacy', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out px-3 sm:px-6 ${
        scrolled ? 'pt-2 sm:pt-3 pb-2' : 'pt-4 sm:pt-6 pb-4'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto rounded-2xl sm:rounded-3xl transition-all duration-500 ease-out relative ${
          scrolled
            ? 'bg-[#100D28]/85 backdrop-blur-2xl border border-[#FFC978]/25 shadow-[0_20px_50px_rgba(5,3,15,0.85)] px-4 sm:px-6 py-2.5 sm:py-3'
            : 'bg-[#1A1836]/40 backdrop-blur-md border border-[#B8B4D9]/15 shadow-[0_10px_30px_rgba(5,3,15,0.4)] px-4 sm:px-6 py-3 sm:py-3.5'
        }`}
      >
        {/* Top Rim Luminous Prism Highlight */}
        <div className="absolute top-0 left-8 right-8 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFC978]/60 to-transparent pointer-events-none" />

        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Emblem */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 group focus:outline-none select-none shrink-0 cursor-pointer text-left bg-transparent border-none p-0"
          >
            <div className="relative">
              {/* Outer soft ambient pulse aura */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#FFC978]/30 via-[#6FBFC4]/20 to-[#C25AE0]/30 opacity-70 blur-sm group-hover:opacity-100 transition-opacity duration-300" />

              {/* Emblem icon container */}
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-[#2D2A5C] via-[#1E1B3E] to-[#120F2A] border border-[#FFC978]/50 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-all duration-300 group-hover:scale-105">
                <span className="text-[#FFC978] text-base sm:text-lg font-bold font-heading group-hover:rotate-12 transition-transform duration-300">
                  ✦
                </span>
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#6FBFC4] animate-ping opacity-75" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-xl sm:text-2xl tracking-wide text-[#F5F2ED] group-hover:text-[#FFC978] transition-colors drop-shadow-sm">
                  Vynura
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#FFC978]/15 border border-[#FFC978]/40 text-[9px] font-mono uppercase tracking-widest text-[#FFC978] font-bold shadow-sm hidden sm:inline-block">
                  Sanctuary
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-[#B8B4D9]/80 font-mono -mt-0.5 hidden sm:inline">
                Emotion Companion · v2.0
              </span>
            </div>
          </button>

          {/* Centered Floating Capsule Navigation */}
          <nav
            onMouseLeave={() => setHoveredNav(null)}
            className="hidden lg:flex items-center gap-1 bg-[#0E0C24]/60 backdrop-blur-xl px-2.5 py-1.5 rounded-full border border-[#B8B4D9]/15 shadow-inner relative"
          >
            {navLinks.map((link) => {
              const isHovered = hoveredNav === link.label;
              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link)}
                  onMouseEnter={() => setHoveredNav(link.label)}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 z-10 cursor-pointer bg-transparent border-none ${
                    isHovered ? 'text-[#F5F2ED]' : 'text-[#B8B4D9] hover:text-[#F5F2ED]'
                  }`}
                >
                  {/* Sliding Pill Background Indicator */}
                  {isHovered && (
                    <motion.div
                      layoutId="navHoverPill"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#2D2A5C] via-[#383372] to-[#2D2A5C] border border-[#FFC978]/35 shadow-sm -z-10"
                    />
                  )}

                  <span
                    className={`transition-colors ${
                      isHovered ? 'text-[#FFC978]' : 'text-[#B8B4D9]/70'
                    }`}
                  >
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Group: Live Resonance Status & Primary Action CTA */}
          <div className="flex items-center gap-3">
            {/* Live System Status Pill */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#120F2A]/90 border border-[#6FBFC4]/30 text-xs font-mono text-[#B8B4D9] shadow-inner">
              <Radio className="w-3.5 h-3.5 text-[#6FBFC4] animate-pulse" />
              <span className="text-[11px] text-[#6FBFC4] font-semibold">Resonance Active</span>
            </div>

            {/* Primary Action Button: Looking Glass */}
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
                className="shadow-glow-sm hover:shadow-glow-md px-4 py-2 text-xs"
              >
                Looking Glass
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 sm:p-2.5 rounded-2xl bg-[#1A1836]/80 hover:bg-[#2D2A5C] text-[#F5F2ED] border border-[#B8B4D9]/20 hover:border-[#FFC978]/40 transition-all cursor-pointer shadow-sm"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Glassmorphic Drawer Sheet */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden max-w-7xl mx-auto mt-2 rounded-3xl bg-[#0F0D24]/95 backdrop-blur-2xl border border-[#FFC978]/25 shadow-2xl p-5 overflow-hidden"
          >
            {/* Header info in drawer */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#B8B4D9]/15 text-xs text-[#B8B4D9]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#6FBFC4] animate-pulse" />
                <span className="font-mono text-[11px] text-[#6FBFC4]">Sanctuary Companion Active</span>
              </div>
              <span className="font-mono text-[10px] text-[#FFC978]">8 Meditation Realms</span>
            </div>

            {/* Navigation Grid */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleNavClick(link);
                  }}
                  className="flex items-center gap-2.5 p-3 rounded-2xl bg-[#181538]/70 hover:bg-[#2D2A5C] border border-[#B8B4D9]/10 hover:border-[#FFC978]/40 text-xs font-semibold text-[#F5F2ED] transition-all cursor-pointer text-left"
                >
                  <span className="text-[#FFC978]">{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              ))}
            </div>

            {/* Primary Action Button inside Drawer */}
            <div className="pt-2 border-t border-[#B8B4D9]/15 flex flex-col gap-2">
              <Button
                size="md"
                variant="primary"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold"
                icon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenFaceDetection) {
                    onOpenFaceDetection();
                  } else {
                    navigate('/mood');
                  }
                }}
              >
                <Camera className="w-4 h-4 mr-1" />
                <span>Launch Looking Glass Calibration</span>
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
