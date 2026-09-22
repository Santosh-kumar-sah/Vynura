import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Bell,
  BellRing,
  BellOff,
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
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
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-lg rounded-2xl bg-[#121316] border border-white/[0.08] p-6 sm:p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)] overflow-hidden space-y-6 text-white"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer z-20"
            aria-label="Close Preferences"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="space-y-1">
            <div className="text-[11px] font-mono font-medium uppercase tracking-wider text-neutral-400">
              Preferences
            </div>
            <h2 className="text-xl font-semibold text-white tracking-tight">
              Notification & Check-in Settings
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Configure gentle session cues and presence reminders.
            </p>
          </div>

          {/* Notification Setting Card */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#18191c] border border-white/[0.06] space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                {notificationsEnabled ? (
                  <BellRing className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" strokeWidth={1.5} />
                ) : (
                  <Bell className="w-5 h-5 text-neutral-400 mt-0.5 shrink-0" strokeWidth={1.5} />
                )}

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">
                      Evening Check-in Reminder (After 8 PM)
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    A non-intrusive nudge if today's check-in hasn't been logged yet.
                  </p>
                </div>
              </div>

              {/* Opt-in Toggle Switch */}
              <button
                onClick={handleToggleNotifications}
                disabled={isUpdating || !isSupported}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  notificationsEnabled ? 'bg-amber-400' : 'bg-neutral-800'
                } ${!isSupported ? 'opacity-40 cursor-not-allowed' : ''}`}
                role="switch"
                aria-checked={notificationsEnabled}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-neutral-950 shadow ring-0 transition duration-200 ease-in-out ${
                    notificationsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Permission / Status Row */}
            <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-neutral-400">
                <span>Status:</span>
                {permissionState === 'granted' ? (
                  <span className="font-mono text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" /> Permission Granted
                  </span>
                ) : permissionState === 'denied' ? (
                  <span className="font-mono text-rose-400 font-medium flex items-center gap-1">
                    <BellOff className="w-3 h-3" /> Blocked in Browser Settings
                  </span>
                ) : (
                  <span className="font-mono text-neutral-400">
                    Opt-in Required
                  </span>
                )}
              </div>

              {notificationsEnabled && permissionState === 'granted' && (
                <button
                  onClick={handleTestNudge}
                  className="px-2.5 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] text-[11px] font-mono transition-colors cursor-pointer"
                >
                  {testSent ? '✓ Sent' : 'Send Test Notification'}
                </button>
              )}
            </div>
          </div>

          {/* Philosophy & Privacy Notice */}
          <div className="p-4 rounded-xl bg-[#18191c] border border-white/[0.06] space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
              <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
              <span>Client-side scheduling</span>
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Vynura never punishes missed days or resets progress streaks. Notifications are scheduled locally in the browser.
            </p>
          </div>

          {/* Footer Save & Close */}
          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-neutral-950 font-medium text-xs tracking-wide transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
