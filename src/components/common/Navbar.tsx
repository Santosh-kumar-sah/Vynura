import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Menu, X, ShieldCheck, Compass, Sparkle, Camera, Wind } from 'lucide-react';
import { Button } from './Button';

interface NavbarProps {
  onOpenFaceDetection?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenFaceDetection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'The Concept', href: '#concept', icon: <Compass className="w-3.5 h-3.5" /> },
    { label: 'Shift Engine', href: '#recommendations', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { label: 'Constellation', href: '#constellation', icon: <Sparkle className="w-3.5 h-3.5" /> },
    { label: 'Wellness Hub', href: '#wellness', icon: <Wind className="w-3.5 h-3.5" /> },
    { label: 'Privacy Sanctuary', href: '#privacy', icon: <ShieldCheck className="w-3.5 h-3.5" /> },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#1A1836]/80 backdrop-blur-xl border-b border-[#B8B4D9]/15 shadow-[0_4px_30px_rgba(10,8,28,0.5)] py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo & Wordmark */}
        <a href="#" className="flex items-center gap-3 group focus:outline-none">
          <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2D2A5C] to-[#433E7E] border border-[#FFC978]/40 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-md transition-all duration-300">
            <span className="text-[#FFC978] text-lg font-bold">✦</span>
            <div className="absolute -inset-0.5 rounded-xl bg-[#FFC978] opacity-0 group-hover:opacity-20 blur transition-opacity" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-bold text-2xl tracking-wide text-[#F5F2ED] group-hover:text-[#FFC978] transition-colors">
                Vynura
              </span>
              <span className="text-[10px] text-[#FFC978]/80 font-heading">ヴィニュラ</span>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-[#B8B4D9] font-medium -mt-1 hidden sm:inline">
              Emotion Companion
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-[#24214A]/40 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#B8B4D9]/15 shadow-inner">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-[#B8B4D9] hover:text-[#F5F2ED] hover:bg-[#2D2A5C]/70 transition-all duration-200"
            >
              <span className="text-[#FFC978]/70">{link.icon}</span>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        {/* Action / Badge Group */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#C25AE0]/10 border border-[#C25AE0]/25 text-[11px] font-medium text-[#C25AE0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C25AE0] animate-pulse" />
            <span>Phase 5 · Wellness Hub</span>
          </div>
          <Button
            size="sm"
            variant="primary"
            icon={<Camera className="w-3.5 h-3.5" />}
            onClick={() => {
              if (onOpenFaceDetection) onOpenFaceDetection();
            }}
          >
            Looking Glass
          </Button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl bg-[#2D2A5C]/60 text-[#F5F2ED] border border-[#B8B4D9]/20 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
            className="md:hidden bg-[#1A1836]/95 backdrop-blur-2xl border-b border-[#B8B4D9]/20 px-6 py-5 overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-[#B8B4D9] hover:text-[#F5F2ED] hover:bg-[#2D2A5C]/70"
                >
                  <span className="text-[#FFC978]">{link.icon}</span>
                  <span>{link.label}</span>
                </a>
              ))}
              <div className="pt-2 border-t border-[#B8B4D9]/15 flex flex-col gap-2.5">
                <Button
                  size="md"
                  variant="primary"
                  className="w-full"
                  icon={<Camera className="w-4 h-4" />}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenFaceDetection) onOpenFaceDetection();
                  }}
                >
                  Launch Looking Glass ✦
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
