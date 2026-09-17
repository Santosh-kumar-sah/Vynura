import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bell,
  BellRing,
  BellOff,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import {
  isNotificationSupported,
  getNotificationPermission,
  getNotificationPreference,
  setNotificationPreference,
  sendStarlightNudge,
} from '../../utils/notificationManager';

interface PreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreferencesModal: React.FC<PreferencesModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<NotificationPermission>('default');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [testSent, setTestSent] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setPermissionState(getNotificationPermission());
      getNotificationPreference().then(setNotificationsEnabled);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleToggleNotifications = async () => {
    setIsUpdating(true);
    const nextState = !notificationsEnabled;
    const res = await setNotificationPreference(nextState);
    setNotificationsEnabled(res.success);
    setPermissionState(res.permission);
    setIsUpdating(false);
  };

  const handleTestNudge = () => {
    sendStarlightNudge();
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const isSupported = isNotificationSupported();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070514]/85 backdrop-blur-md">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 -z-10"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          className="relative w-full max-w-lg rounded-3xl bg-gradient-to-b from-[#24214A] via-[#1A1836] to-[#121029] border border-[#FFC978]/40 p-6 sm:p-8 shadow-[0_25px_70px_rgba(7,5,20,0.95)] overflow-hidden space-y-6 text-[#F5F2ED]"
        >
          {/* Top Luminous Rim */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFC978] to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-[#24214A]/80 hover:bg-[#2D2A5C] text-[#B8B4D9] hover:text-[#F5F2ED] border border-[#B8B4D9]/20 transition-all cursor-pointer z-20"
            aria-label="Close Preferences"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#FFC978]/15 border border-[#FFC978]/30 text-[#FFC978]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CELESTIAL PREFERENCES · 環境設定</span>
            </div>
            <h2 className="font-heading text-2xl font-bold text-[#F5F2ED]">
              Starlight Reminders & Sanctuary
            </h2>
            <p className="text-xs text-[#B8B4D9] leading-relaxed">
              Customize gentle re-engagement reminders and browser presence cues.
            </p>
          </div>

          {/* Notification Setting Card */}
          <div className="p-5 rounded-2xl bg-[#1E1B3E]/80 border border-[#B8B4D9]/20 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center border shrink-0 transition-colors ${
                    notificationsEnabled
                      ? 'bg-[#FFC978]/20 border-[#FFC978]/50 text-[#FFC978]'
                      : 'bg-[#24214A] border-[#B8B4D9]/20 text-[#B8B4D9]'
                  }`}
                >
                  {notificationsEnabled ? (
                    <BellRing className="w-5 h-5 animate-pulse" />
                  ) : (
                    <Bell className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-sm font-bold text-[#F5F2ED]">
                      Evening Starlight Nudge (Past 8 PM)
                    </h3>
                  </div>
                  <p className="text-xs text-[#B8B4D9] leading-relaxed">
                    A soft, non-guilting reminder if today's star has not yet been inscribed.
                  </p>
                </div>
              </div>

              {/* Opt-in Toggle Switch */}
              <button
                onClick={handleToggleNotifications}
                disabled={isUpdating || !isSupported}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
                  notificationsEnabled ? 'bg-[#FFC978]' : 'bg-[#2D2A5C]'
                } ${!isSupported ? 'opacity-40 cursor-not-allowed' : ''}`}
                role="switch"
                aria-checked={notificationsEnabled}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#1A1836] shadow ring-0 transition duration-300 ease-in-out ${
                    notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Permission / Status Row */}
            <div className="pt-3 border-t border-[#B8B4D9]/15 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-[#B8B4D9]">
                <span>Status:</span>
                {permissionState === 'granted' ? (
                  <span className="font-mono text-[#6FBFC4] font-bold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Permission Granted
                  </span>
                ) : permissionState === 'denied' ? (
                  <span className="font-mono text-[#FF9EAA] font-bold flex items-center gap-1">
                    <BellOff className="w-3 h-3" /> Blocked in Browser Settings
                  </span>
                ) : (
                  <span className="font-mono text-[#FFC978]">
                    Opt-in Required
                  </span>
                )}
              </div>

              {notificationsEnabled && permissionState === 'granted' && (
                <button
                  onClick={handleTestNudge}
                  className="px-2.5 py-1 rounded-lg bg-[#24214A] hover:bg-[#2D2A5C] text-[#FFC978] border border-[#FFC978]/30 text-[11px] font-mono transition-colors cursor-pointer"
                >
                  {testSent ? '✓ Reminder Sent' : 'Test Reminder ✨'}
                </button>
              )}
            </div>
          </div>

          {/* Philosophy & Privacy Notice */}
          <div className="p-4 rounded-2xl bg-[#121029]/80 border border-[#6FBFC4]/20 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#6FBFC4]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Gentle Sanctuary Philosophy</span>
            </div>
            <p className="text-[11px] text-[#B8B4D9] leading-relaxed">
              Vynura never punishes missed days or resets progress with punitive red badges. This is a lightweight, client-side reminder scheduled for active browser sessions past 8:00 PM local time.
            </p>
          </div>

          {/* Footer Save & Close */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FFC978] to-[#FFAE68] text-[#1A1836] font-bold text-xs tracking-wide transition-all shadow-glow-sm cursor-pointer"
            >
              Done ✦
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
