import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Sparkles, 
  Mail, 
  Lock, 
  ArrowRight, 
  UserCheck, 
  Compass,
  AlertCircle
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Button } from '../common/Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!isSupabaseConfigured || !supabase) {
      // Demo guest mode
      setTimeout(() => {
        setLoading(false);
        setSuccessMessage('Logged in as Guest Celestial Explorer ✦');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 800);
      }, 600);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSuccessMessage('Star beacon sent! Check your inbox to confirm your celestial account.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setSuccessMessage('Welcome back to the night sky ✦');
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 800);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestQuickLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Welcome, Celestial Explorer ✦ (Guest Sanctuary Mode)');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 700);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B091C]/85 backdrop-blur-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#24214A] via-[#1A1836] to-[#121029] border border-[#FFC978]/35 p-6 sm:p-8 shadow-[0_25px_70px_rgba(10,8,28,0.95)] overflow-hidden"
      >
        {/* Top Rim Glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFC978] to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#B8B4D9] hover:text-[#F5F2ED] hover:bg-[#2D2A5C]/60 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-[#FFC978]/15 border border-[#FFC978]/40 flex items-center justify-center text-[#FFC978] shadow-glow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFC978] font-bold">
                {isSignUp ? 'New Sanctuary' : 'Celestial Login'}
              </span>
              <span className="text-xs text-[#FFC978]/80 font-mono">Star Key</span>
            </div>
            <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F2ED]">
              {isSignUp ? 'Awaken Your Star Key' : 'Enter Your Sanctuary'}
            </h3>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#B8B4D9] mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#6FBFC4]" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="explorer@nightsky.app"
              className="w-full rounded-xl bg-[#121029]/90 border border-[#B8B4D9]/25 px-4 py-2.5 text-xs text-[#F5F2ED] placeholder:text-[#B8B4D9]/40 focus:outline-none focus:border-[#FFC978] transition-colors font-body"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#B8B4D9] mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#FF9E7D]" />
              <span>Secret Star Key (Password)</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl bg-[#121029]/90 border border-[#B8B4D9]/25 px-4 py-2.5 text-xs text-[#F5F2ED] placeholder:text-[#B8B4D9]/40 focus:outline-none focus:border-[#FFC978] transition-colors font-body"
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-[#FF9E7D]/15 border border-[#FF9E7D]/35 text-xs text-[#FF9E7D] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-[#6FBFC4]/15 border border-[#6FBFC4]/35 text-xs text-[#6FBFC4] flex items-center gap-2">
              <UserCheck className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <Button
            size="md"
            variant="primary"
            className="w-full mt-2"
            disabled={loading}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {loading ? 'Aligning Starlight...' : isSignUp ? 'Create Constellation Key' : 'Enter Looking Glass'}
          </Button>
        </form>

        {/* Quick Guest Access */}
        <div className="mt-4 pt-4 border-t border-[#B8B4D9]/15">
          <button
            type="button"
            onClick={handleGuestQuickLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-[#2D2A5C]/60 hover:bg-[#2D2A5C] text-[#B8B4D9] hover:text-[#F5F2ED] border border-[#B8B4D9]/20 text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-[#FFC978]" />
            <span>Continue as Guest Explorer (Instant)</span>
          </button>
        </div>

        {/* Toggle Mode */}
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className="text-xs text-[#B8B4D9] hover:text-[#FFC978] transition-colors cursor-pointer font-medium"
          >
            {isSignUp
              ? 'Already possess a star key? Enter Sanctuary'
              : "New to Vynura? Awaken a Constellation Account"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
