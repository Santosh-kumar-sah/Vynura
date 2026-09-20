import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Copy,
  Check,
  Lock,
  RefreshCw,
  AlertCircle,
  XCircle,
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
      setSuccessMessage('Invite code generated. Share with your companion.');
    } catch (err) {
      setErrorMessage('Could not generate invite code. Please try again.');
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
        setSuccessMessage('Connected successfully. Mutual resonance active.');
        const mood = await getPartnerTodayMood(result.connection, currentUser.id);
        setPartnerMood(mood);
      } else {
        setErrorMessage(result.error || 'Failed to link companion code.');
      }
    } catch (err) {
      setErrorMessage('Network error while pairing. Please try again.');
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
      setSuccessMessage('Connection revoked. Mutual visibility severed.');
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
    <section id="paired-checkins" className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-white/[0.06]">
      {/* Widget Container */}
      <div className="rounded-2xl bg-[#11131A] border border-white/[0.08] p-6 sm:p-8 shadow-[0_20px_48px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.06)] relative overflow-hidden">
        {/* Top 1px sheen */}
        <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#94A3B8] mb-0.5">
                Opt-In Social · Zero Data Leakage
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                Paired Check-ins
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={loadPairingData}
                disabled={loading || actionLoading}
                className="text-xs"
                icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
              >
                Refresh
              </Button>
            )}
            {connection?.status === 'active' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
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
              className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-300 text-xs flex items-center gap-2"
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
              className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-2"
            >
              <Check className="w-4 h-4 flex-shrink-0" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Body */}
        <div className="mt-6">
          {/* STATE 1: GUEST GUARD */}
          {authChecked && !currentUser && (
            <div className="p-8 rounded-xl bg-[#090A0F]/60 border border-white/[0.06] text-center flex flex-col items-center justify-center space-y-4">
              <div className="w-11 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#94A3B8]">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
              <div className="max-w-md space-y-1">
                <h4 className="text-base font-semibold text-white">
                  Authentication required for paired check-ins
                </h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Paired check-ins require verified mutual identity to guarantee zero unauthorized access. Guest sessions cannot establish permanent links.
                </p>
              </div>
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

          {/* STATE 2: UNPAIRED OR PENDING */}
          {currentUser && (!connection || connection.status === 'pending') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Option A: Share Code */}
              <div className="p-6 rounded-xl bg-[#090A0F]/60 border border-white/[0.06] flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Invite Companion
                  </h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Generate an invite code for your partner. Pairing is strictly mutual and revocable anytime.
                  </p>
                </div>

                {connection?.status === 'pending' ? (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-lg bg-[#11131A] border border-white/[0.1] text-center font-mono text-xl font-bold tracking-widest text-amber-400 select-all">
                      {connection.invite_code}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopyCode(connection.invite_code)}
                        className="w-full text-xs"
                        icon={copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      >
                        {copiedCode ? 'Copied' : 'Copy Code'}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRevoke}
                        disabled={actionLoading}
                        className="w-full text-xs text-red-400 hover:text-red-300"
                        icon={<XCircle className="w-3.5 h-3.5" />}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleCreateInvite}
                    disabled={actionLoading}
                    className="w-full text-xs"
                  >
                    {actionLoading ? 'Generating...' : 'Generate Invite Code'}
                  </Button>
                )}
              </div>

              {/* Option B: Enter Code */}
              <div className="p-6 rounded-xl bg-[#090A0F]/60 border border-white/[0.06] flex flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Accept Companion Code
                  </h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed">
                    Enter the code provided by your companion to initialize mutual visibility.
                  </p>
                </div>

                <form onSubmit={handleAcceptInvite} className="space-y-3">
                  <input
                    type="text"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    placeholder="STAR-XXXX"
                    maxLength={12}
                    className="w-full px-4 py-2.5 bg-[#11131A] border border-white/[0.1] focus:border-white/30 rounded-xl text-center font-mono text-sm tracking-widest text-white placeholder:text-[#64748B] outline-none uppercase"
                  />
                  <Button
                    type="submit"
                    variant="secondary"
                    size="md"
                    disabled={actionLoading || !inputCode.trim()}
                    className="w-full text-xs"
                  >
                    {actionLoading ? 'Connecting...' : 'Connect Companion'}
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* STATE 3: ACTIVE PAIR */}
          {currentUser && connection && connection.status === 'active' && (
            <div className="space-y-5">
              {/* Partner Status Card */}
              <div className="p-6 rounded-xl bg-[#090A0F]/60 border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base"
                    style={{
                      backgroundColor: partnerMood?.todayMoodColor
                        ? `${partnerMood.todayMoodColor}15`
                        : 'rgba(255, 255, 255, 0.05)',
                      color: partnerMood?.todayMoodColor || '#94A3B8',
                      border: `1px solid ${partnerMood?.todayMoodColor || 'rgba(255, 255, 255, 0.1)'}40`,
                    }}
                  >
                    ✦
                  </div>
                  <div>
                    <div className="text-[11px] font-mono text-[#64748B] uppercase tracking-wider mb-0.5">
                      Companion Status · Today
                    </div>
                    {partnerMood?.hasCalibratedToday ? (
                      <div className="text-base font-semibold text-white">
                        Resonating in{' '}
                        <span style={{ color: partnerMood.todayMoodColor || '#FFF' }}>
                          {partnerMood.todayMoodLabel || partnerMood.todayMoodCategory}
                        </span>
                      </div>
                    ) : (
                      <div className="text-sm text-[#94A3B8]">
                        Not yet calibrated today.
                      </div>
                    )}
                  </div>
                </div>

                <div className="font-mono text-xs text-[#64748B]">
                  Link ID: {connection.invite_code}
                </div>
              </div>

              {/* Privacy Guarantee Note */}
              <div className="p-3.5 rounded-lg bg-emerald-500/[0.06] border border-emerald-500/20 text-xs text-[#94A3B8] flex items-center gap-2.5">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong className="text-white font-medium">Zero Leakage Guarantee:</strong> Today's overarching category is the only shared data point. Journal entries, facial coordinates, and historical trends remain strictly private.
                </span>
              </div>

              {/* Revoke Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
                <span className="text-[#64748B]">
                  Revoking terminates mutual access immediately.
                </span>
                {showRevokeConfirm ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRevokeConfirm(false)}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleRevoke}
                      disabled={actionLoading}
                      className="text-xs bg-red-600 hover:bg-red-700 text-white border-red-500"
                    >
                      Confirm Revoke
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRevokeConfirm(true)}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Revoke Connection
                  </Button>
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
