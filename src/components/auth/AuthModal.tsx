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
      const demoUser = {
        id: 'celestial_' + (email ? email.replace(/[^a-zA-Z0-9]/g, '_') : 'guest'),
        email: email || 'celestial@vynura.io',
      };
      try {
        localStorage.setItem('vynura_demo_user', JSON.stringify(demoUser));
      } catch {
        // ignore
      }
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-md rounded-2xl bg-[#121316] border border-white/[0.08] p-6 sm:p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)] overflow-hidden"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-6">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" strokeWidth={1.5} />
          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
              {isSignUp ? 'Account Creation' : 'Sign In'}
            </div>
            <h3 className="text-xl font-semibold text-white tracking-tight mt-0.5">
              {isSignUp ? 'Create your account' : 'Welcome back to Vynura'}
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              {isSignUp ? 'Persist your mood patterns and notes across sessions.' : 'Enter your credentials or proceed instantly as guest.'}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-neutral-400" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full rounded-lg bg-[#18191c] border border-white/[0.08] px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400/60 transition-colors font-sans"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-neutral-400" />
              <span>Password</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg bg-[#18191c] border border-white/[0.08] px-3.5 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400/60 transition-colors font-sans"
            />
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 flex items-center gap-2">
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
            {loading ? 'Authenticating...' : isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        {/* Quick Guest Access */}
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={handleGuestQuickLogin}
            className="w-full py-2.5 px-4 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-neutral-300 hover:text-white border border-white/[0.08] text-xs font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4 text-neutral-400" />
            <span>Continue as Guest</span>
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
            className="text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Create one"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
