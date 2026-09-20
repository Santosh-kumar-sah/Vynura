import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Copy,
  Check,
  Lock,
  RefreshCw,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../common/Button';
import { AuthModal } from '../auth/AuthModal';
import {
  getAuthenticatedUser,
  getPairConnection,
  createPairInvite,
  acceptPairInvite,
  revokePairConnection,
  getPartnerTodayMood,
  type PairConnection,
  type PairedDailyMood,
} from '../../services/pairedCheckinsService';

export const PairedMoodWidget: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string } | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Pairing state
  const [connection, setConnection] = useState<PairConnection | null>(null);
  const [partnerMood, setPartnerMood] = useState<PairedDailyMood | null>(null);
  const [loading, setLoading] = useState(true);

  // Actions state
  const [inputCode, setInputCode] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showRevokeConfirm, setShowRevokeConfirm] = useState(false);

  // Check URL query parameters for prefilled invite code
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const codeParam = urlParams.get('pairCode');
      if (codeParam) {
        setInputCode(codeParam.toUpperCase().trim());
      }
    } catch {
      // ignore
    }
  }, []);

  const loadPairingData = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const user = await getAuthenticatedUser();
      setCurrentUser(user);
      setAuthChecked(true);

      if (!user) {
        setConnection(null);
        setPartnerMood(null);
        setLoading(false);
        return;
      }

      const activePair = await getPairConnection(user.id);
      setConnection(activePair);

      if (activePair && activePair.status === 'active') {
        const mood = await getPartnerTodayMood(activePair, user.id);
        setPartnerMood(mood);
      } else {
        setPartnerMood(null);
      }
    } catch (err) {
      console.error('Failed to load paired connection:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPairingData();
  }, [loadPairingData]);

  const handleCreateInvite = async () => {
    if (!currentUser) return;
    setActionLoading(true);
    setErrorMessage(null);
    try {
      const newPair = await createPairInvite(currentUser.id);
      setConnection(newPair);
      setSuccessMessage('Invite code generated.');
    } catch (err) {
      setErrorMessage('Could not generate invite code.');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleAcceptInvite = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentUser || !inputCode.trim()) return;

    setActionLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await acceptPairInvite(inputCode.trim(), currentUser.id);
      if (result.success && result.connection) {
        setConnection(result.connection);
        setInputCode('');
        setSuccessMessage('Connected successfully.');
        const mood = await getPartnerTodayMood(result.connection, currentUser.id);
        setPartnerMood(mood);
      } else {
        setErrorMessage(result.error || 'Failed to link companion code.');
      }
    } catch (err) {
      setErrorMessage('Network error while pairing.');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!connection || !currentUser) return;
    setActionLoading(true);
    try {
      await revokePairConnection(connection.id, currentUser.id);
      setConnection(null);
      setPartnerMood(null);
      setShowRevokeConfirm(false);
      setSuccessMessage('Connection revoked.');
    } catch (err) {
      setErrorMessage('Failed to revoke pairing.');
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <section id="paired-checkins" className="py-28 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/[0.08]">
      {/* Soft Elevated Interactive Panel — Linear/Stripe spec surface */}
      <div className="bg-[#131219] border border-white/[0.08] shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] rounded-2xl p-6 sm:p-10 relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-6 border-b border-white/[0.06]">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.16em] text-white/50 mb-1.5">
              Opt-In Companion Link
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              Paired Check-ins
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {currentUser && (
              <button
                onClick={loadPairingData}
                disabled={loading || actionLoading}
                className="text-xs text-white/60 hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Sync</span>
              </button>
            )}
            {connection?.status === 'active' && (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Active Link
              </span>
            )}
          </div>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-4 p-3 rounded-lg bg-red-500/10 text-red-300 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-4 p-3 rounded-lg bg-emerald-500/10 text-emerald-300 text-xs flex items-center gap-2"
            >
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Body */}
        <div className="mt-8">
          {/* STATE 1: GUEST GUARD */}
          {authChecked && !currentUser && (
            <div className="py-6 text-center max-w-md mx-auto space-y-4">
              <p className="text-xs text-white/70 leading-relaxed">
                Paired check-ins require verified mutual identity. Guest sessions cannot establish persistent links.
              </p>
              <Button
                variant="primary"
                size="md"
                onClick={() => setIsAuthOpen(true)}
                icon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                Sign In to Enable
              </Button>
            </div>
          )}

          {/* STATE 2: UNPAIRED / PENDING */}
          {currentUser && (!connection || connection.status === 'pending') && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
              {/* Option A: Generate Beacon */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-white">
                  1. Share your invite code
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Generate an invite code for your partner. Mutual consent only.
                </p>

                {connection?.status === 'pending' ? (
                  <div className="pt-2 space-y-2">
                    <div className="font-mono text-xl font-bold tracking-widest text-[#F59E0B] select-all">
                      {connection.invite_code}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopyCode(connection.invite_code)}
                        className="text-xs"
                        icon={copiedCode ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      >
                        {copiedCode ? 'Copied' : 'Copy Code'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRevoke}
                        disabled={actionLoading}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCreateInvite}
                    disabled={actionLoading}
                    className="text-xs"
                  >
                    {actionLoading ? 'Generating...' : 'Generate Code'}
                  </Button>
                )}
              </div>

              {/* Option B: Enter Code */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-white">
                  2. Accept companion code
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  Enter the code provided by your companion to link states.
                </p>

                <form onSubmit={handleAcceptInvite} className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    placeholder="STAR-XXXX"
                    maxLength={12}
                    className="w-full px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] focus:border-white/20 rounded-lg font-mono text-xs tracking-wider text-white placeholder:text-white/30 outline-none uppercase"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={actionLoading || !inputCode.trim()}
                    className="shrink-0 text-xs"
                  >
                    Connect
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* STATE 3: ACTIVE PAIR */}
          {currentUser && connection && connection.status === 'active' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: partnerMood?.todayMoodColor || '#38BDF8' }}
                  />
                  <div>
                    <div className="text-[11px] font-mono text-white/45 uppercase tracking-wider">
                      Companion Status (Today Only)
                    </div>
                    <div className="text-base font-semibold text-white">
                      {partnerMood?.hasCalibratedToday ? (
                        <>Resonating in <span style={{ color: partnerMood.todayMoodColor || '#FFF' }}>{partnerMood.todayMoodLabel || partnerMood.todayMoodCategory}</span></>
                      ) : (
                        <span className="text-white/60">Not yet calibrated today</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="font-mono text-xs text-white/45">
                  Link ID: {connection.invite_code}
                </div>
              </div>

              {/* Zero Leakage Guarantee Notice */}
              <div className="text-xs text-white/45 flex items-center gap-2 pt-4 border-t border-white/[0.06]">
                <Lock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero-Knowledge: Today's overarching state is the only data shared. Zero journal text or scores exposed.</span>
              </div>

              {/* Revoke Option */}
              <div className="flex items-center justify-between pt-2 text-xs">
                <span className="text-white/45">
                  Revoke pairing terminates mutual access immediately.
                </span>
                {showRevokeConfirm ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowRevokeConfirm(false)}
                      className="text-xs text-white/60 hover:text-white cursor-pointer bg-transparent border-none"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRevoke}
                      disabled={actionLoading}
                      className="text-xs text-red-400 font-medium hover:text-red-300 cursor-pointer bg-transparent border-none"
                    >
                      Confirm Revoke
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowRevokeConfirm(true)}
                    className="text-xs text-red-400 hover:text-red-300 cursor-pointer bg-transparent border-none"
                  >
                    Revoke Connection
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal for Guest Users */}
      <AnimatePresence>
        {isAuthOpen && (
          <AuthModal
            isOpen={isAuthOpen}
            onClose={() => setIsAuthOpen(false)}
            onSuccess={() => {
              setIsAuthOpen(false);
              loadPairingData();
            }}
          />
        )}
      </AnimatePresence>
    </section>
  );
};
