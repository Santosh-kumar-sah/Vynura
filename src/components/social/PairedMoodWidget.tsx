import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  Lock,
  RefreshCw,
  AlertCircle,
  XCircle,
  HeartHandshake,
  Share2,
  Moon,
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

  // Invite input & actions
  const [inputCode, setInputCode] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
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
      setSuccessMessage('Invite beacon ignited! Share your code with your companion.');
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
        setSuccessMessage('Successfully paired with companion! Resonance synchronized.');
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
      setSuccessMessage('Pairing revoked. Mutual visibility has been completely severed.');
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

  const handleCopyLink = (code: string) => {
    const origin = window.location.origin;
    const path = window.location.pathname;
    const link = `${origin}${path}?pairCode=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-[#A78BFA]/10 via-[#FFC978]/10 to-transparent rounded-full blur-[100px]" />
      </div>

      <div className="bg-[#131127]/80 backdrop-blur-xl border border-[#FFC978]/20 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle Decorative Star Accent */}
        <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
          <Sparkles className="w-32 h-32 text-[#FFC978]" />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FFC978]/15 border border-[#FFC978]/30 flex items-center justify-center text-[#FFC978] shadow-inner">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-mono uppercase text-[#FFC978] tracking-widest font-bold">
                  OPT-IN SANCTUARY · 伴走
                </span>
                <span className="w-1 h-1 rounded-full bg-[#FFC978]" />
                <span className="text-[11px] text-[#A78BFA] font-mono flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Zero Leakage
                </span>
              </div>
              <h2 className="font-heading text-xl sm:text-2xl font-bold text-[#F5F2ED] tracking-tight">
                Paired Check-ins
              </h2>
            </div>
          </div>

          {/* Refresh / Status Pill */}
          <div className="flex items-center gap-2">
            {currentUser && (
              <Button
                variant="ghost"
                size="sm"
                onClick={loadPairingData}
                disabled={loading || actionLoading}
                className="text-xs text-[#B8B4D9] hover:text-[#F5F2ED]"
                icon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
              >
                Refresh
              </Button>
            )}
            {connection?.status === 'active' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active Link
              </span>
            )}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-200 text-xs flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2"
            >
              <Check className="w-4 h-4 flex-shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content Body */}
        <div className="mt-6">
          {/* STATE 1: GUEST / UNAUTHENTICATED GUARD */}
          {authChecked && !currentUser && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 text-center flex flex-col items-center justify-center space-y-4"
            >
              <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#B8B4D9]">
                <Lock className="w-6 h-6 text-[#FFC978]" />
              </div>
              <div className="max-w-md space-y-1.5">
                <h3 className="font-heading text-lg font-bold text-[#F5F2ED]">
                  Sign in to enable paired check-ins
                </h3>
                <p className="text-sm text-[#B8B4D9] leading-relaxed">
                  Mutual check-ins require an authenticated celestial identity so only your invited partner can exchange daily resonances. Guest sessions cannot establish permanent paired links.
                </p>
              </div>
              <Button
                variant="glow"
                size="md"
                onClick={() => setIsAuthOpen(true)}
                className="mt-2"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Sign in to enable paired check-ins
              </Button>
            </motion.div>
          )}

          {/* STATE 2: AUTHENTICATED BUT UNPAIRED OR PENDING */}
          {currentUser && (!connection || connection.status === 'pending') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              {/* Option A: Generate / Display Beacon Invite */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[#FFC978] text-xs font-mono uppercase tracking-wider mb-2 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Invite A Companion</span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#F5F2ED] mb-1.5">
                    Share Your Beacon Code
                  </h3>
                  <p className="text-xs text-[#B8B4D9] leading-relaxed">
                    Generate an invite code to share with a partner or trusted friend. Pairing is strictly mutual and can be revoked at any instant.
                  </p>
                </div>

                {connection?.status === 'pending' ? (
                  <div className="space-y-4 pt-2">
                    <div className="p-4 rounded-xl bg-black/40 border border-[#FFC978]/30 flex flex-col items-center justify-center text-center relative overflow-hidden">
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#FFC978] animate-ping" />
                        <span className="text-[10px] font-mono text-[#FFC978] uppercase">Awaiting</span>
                      </div>
                      <span className="text-[11px] font-mono text-[#B8B4D9] uppercase tracking-widest mb-1">
                        Companion Code
                      </span>
                      <span className="text-2xl sm:text-3xl font-mono font-bold tracking-widest text-[#FFC978] select-all">
                        {connection.invite_code}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopyCode(connection.invite_code)}
                        className="text-xs"
                        icon={copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      >
                        {copiedCode ? 'Copied!' : 'Copy Code'}
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleCopyLink(connection.invite_code)}
                        className="text-xs"
                        icon={copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                      >
                        {copiedLink ? 'Copied Link!' : 'Copy Link'}
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRevoke}
                      disabled={actionLoading}
                      className="w-full text-xs text-red-400/80 hover:text-red-300 hover:bg-red-500/10"
                      icon={<XCircle className="w-3.5 h-3.5" />}
                    >
                      Cancel Beacon Invite
                    </Button>
                  </div>
                ) : (
                  <div className="pt-2">
                    <Button
                      variant="glow"
                      size="md"
                      onClick={handleCreateInvite}
                      disabled={actionLoading}
                      className="w-full text-xs sm:text-sm"
                      icon={<Sparkles className="w-4 h-4" />}
                    >
                      {actionLoading ? 'Igniting...' : 'Generate Companion Invite Code ✦'}
                    </Button>
                  </div>
                )}
              </div>

              {/* Option B: Enter Companion Code */}
              <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-2 text-[#A78BFA] text-xs font-mono uppercase tracking-wider mb-2 font-semibold">
                    <Users className="w-3.5 h-3.5" />
                    <span>Accept Invite</span>
                  </div>
                  <h3 className="font-heading text-base font-bold text-[#F5F2ED] mb-1.5">
                    Enter Companion Code
                  </h3>
                  <p className="text-xs text-[#B8B4D9] leading-relaxed">
                    Have an invite code from your companion? Enter it below to establish your mutual sanctuary link.
                  </p>
                </div>

                <form onSubmit={handleAcceptInvite} className="space-y-3 pt-2">
                  <div className="relative">
                    <input
                      type="text"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      placeholder="STAR-XXXX"
                      maxLength={12}
                      className="w-full px-4 py-3 bg-white/5 border border-white/15 focus:border-[#FFC978]/60 rounded-xl text-center font-mono text-base tracking-widest text-[#F5F2ED] placeholder:text-[#B8B4D9]/40 outline-none transition-all uppercase"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={actionLoading || !inputCode.trim()}
                    className="w-full text-xs sm:text-sm"
                    icon={<ArrowRight className="w-4 h-4" />}
                  >
                    {actionLoading ? 'Connecting...' : 'Connect With Companion'}
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* STATE 3: ACTIVE PAIRED CONNECTION */}
          {currentUser && connection && connection.status === 'active' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Partner Today's Status Banner */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.03] border border-white/15 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Left: Companion Presence */}
                  <div className="flex items-center gap-4 text-center md:text-left">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        backgroundColor: partnerMood?.todayMoodColor
                          ? `${partnerMood.todayMoodColor}25`
                          : 'rgba(255, 255, 255, 0.05)',
                        borderColor: partnerMood?.todayMoodColor
                          ? `${partnerMood.todayMoodColor}60`
                          : 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        boxShadow: partnerMood?.todayMoodColor
                          ? `0 0 24px ${partnerMood.todayMoodColor}30`
                          : 'none',
                      }}
                    >
                      {partnerMood?.hasCalibratedToday ? (
                        <Sparkles
                          className="w-8 h-8"
                          style={{ color: partnerMood.todayMoodColor || '#FFC978' }}
                        />
                      ) : (
                        <Moon className="w-8 h-8 text-[#B8B4D9]/60" />
                      )}
                    </div>

                    <div>
                      <span className="text-[11px] font-mono uppercase tracking-widest text-[#B8B4D9] block mb-1">
                        Companion Status · Today Only
                      </span>
                      {partnerMood?.hasCalibratedToday ? (
                        <div>
                          <h3 className="font-heading text-lg sm:text-xl font-bold text-[#F5F2ED]">
                            Companion is resonating in{' '}
                            <span
                              style={{ color: partnerMood.todayMoodColor || '#FFC978' }}
                              className="font-extrabold"
                            >
                              {partnerMood.todayMoodLabel || partnerMood.todayMoodCategory}
                            </span>{' '}
                            today ✨
                          </h3>
                          <p className="text-xs text-[#B8B4D9] mt-0.5">
                            Calibrated today · Resonance aligned with your celestial space.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-heading text-base sm:text-lg font-bold text-[#F5F2ED]">
                            Companion has not yet calibrated today 🌙
                          </h3>
                          <p className="text-xs text-[#B8B4D9] mt-0.5">
                            Check back once they record their daily presence.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Pairing Details & Status */}
                  <div className="flex flex-col items-center md:items-end gap-2 text-xs text-[#B8B4D9]">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="font-mono text-[#F5F2ED]">Mutual Consent Active</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#B8B4D9]/60">
                      Paired Code: {connection.invite_code}
                    </span>
                  </div>
                </div>
              </div>

              {/* Privacy Sealed Guarantee Badge */}
              <div className="p-4 rounded-xl bg-black/40 border border-emerald-500/20 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-300 flex-shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="text-xs leading-relaxed text-[#B8B4D9]">
                  <strong className="text-[#F5F2ED] font-medium">Privacy Sealed:</strong> Today's overarching category label is the only data shared. Journal notes, confidence scores, facial biometrics, and historical timelines are strictly guarded and never disclosed.
                </div>
              </div>

              {/* Revoke Action Section */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
                <span className="text-xs text-[#B8B4D9]">
                  You can end this paired check-in at any time. Visibility severs immediately.
                </span>

                {showRevokeConfirm ? (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setShowRevokeConfirm(false)}
                      className="text-xs"
                    >
                      Keep Connected
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleRevoke}
                      disabled={actionLoading}
                      className="text-xs bg-red-600 hover:bg-red-700 text-white border-red-500/40"
                    >
                      {actionLoading ? 'Severing...' : 'Yes, Revoke Pairing'}
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRevokeConfirm(true)}
                    className="text-xs text-red-400/90 hover:text-red-300 hover:bg-red-500/10"
                    icon={<XCircle className="w-3.5 h-3.5" />}
                  >
                    Revoke pairing
                  </Button>
                )}
              </div>
            </motion.div>
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
