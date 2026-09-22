import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as faceapi from '@vladmandic/face-api';
import confetti from 'canvas-confetti';
import {
  Camera,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Sun,
  Shield,
  Sparkles,
  EyeOff,
  Cpu,
  ShieldCheck,
  VideoOff,
  ArrowDown,
  Lock,
} from 'lucide-react';
import type { MoodType } from '../../types';
import { SwirlLoadingState } from './SwirlLoadingState';
import { FaceCanvasOverlay } from './FaceCanvasOverlay';
import { ManualMoodSelector } from './ManualMoodSelector';
import { Button } from '../common/Button';
import { mapExpressionsToVynuraMood, analyzeLighting } from '../../utils/expressionMapper';
import { MOODS } from '../sections/HeroSection';
import { AnimatedNumber } from '../common/AnimatedNumber';

interface WebcamLookingGlassProps {
  currentMood: MoodType;
  currentConfidence: number;
  onConfirmMood: (
    mood: MoodType,
    confidence: number,
    rawExpressions?: import('../../utils/expressionMapper').RawExpressions | null
  ) => void;
  autoStart?: boolean;
}

export const WebcamLookingGlass: React.FC<WebcamLookingGlassProps> = ({
  currentMood,
  currentConfidence,
  onConfirmMood,
  autoStart = true,
}) => {
  const [hasConsented, setHasConsented] = useState<boolean>(() => {
    return sessionStorage.getItem('vynura_camera_consented') === 'true';
  });
  const [isModelsLoading, setIsModelsLoading] = useState<boolean>(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [isLockedSnapshot, setIsLockedSnapshot] = useState<boolean>(false);

  // Live detection feedback state
  const [detectedMood, setDetectedMood] = useState<MoodType>(currentMood);
  const [confidence, setConfidence] = useState<number>(currentConfidence);
  const [breakdown, setBreakdown] = useState<Record<MoodType, number>>({
    happy: 0.2,
    calm: 0.7,
    sad: 0.1,
    energetic: 0.15,
    neutral: 0.6,
  });
  const [faceBox, setFaceBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [landmarks, setLandmarks] = useState<{ x: number; y: number }[]>([]);
  const [noFaceDetected, setNoFaceDetected] = useState<boolean>(false);
  const [lightingWarning, setLightingWarning] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  const isCameraDisabledRef = useRef<boolean>(false);
  const latestRawExpressionsRef = useRef<import('../../utils/expressionMapper').RawExpressions | null>(null);

  // 1. Load face-api.js Models Client-Side from /public/models
  useEffect(() => {
    let isMounted = true;

    async function loadModels() {
      try {
        setIsModelsLoading(true);
        setModelError(null);

        const MODEL_URL = '/models';
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);

        if (isMounted) {
          setIsModelsLoading(false);
        }
      } catch (err: unknown) {
        console.error('Error loading face-api models:', err);
        if (isMounted) {
          setModelError('Failed to load neural models locally. Please check connectivity or refresh.');
          setIsModelsLoading(false);
        }
      }
    }

    loadModels();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Stop camera helper - shuts down all media tracks immediately
  const stopCamera = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => {
        t.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      } catch {
        // ignore
      }
    }
    setIsCameraActive(false);
  }, []);

  // 3. Start Video Camera Stream
  const startCamera = useCallback(async () => {
    if (isCameraDisabledRef.current) return;
    setCameraError(null);
    setIsLockedSnapshot(false);
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
        audio: false,
      });

      if (isCameraDisabledRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setIsCameraActive(true);
          }).catch((e) => {
            console.warn('Video play deferred:', e);
            setIsCameraActive(true);
          });
        };
      }
    } catch (err: unknown) {
      console.error('Webcam access error:', err);
      setIsCameraActive(false);
      const e = err as Error;
      if (e.name === 'NotAllowedError' || e.name === 'PermissionDeniedError') {
        setCameraError('Camera access was denied. Please allow camera permissions in your browser or choose a mood manually below.');
      } else {
        setCameraError('Unable to open camera stream. Please ensure no other app is using your webcam.');
      }
    }
  }, []);

  // Auto-start camera when consented and models loaded
  useEffect(() => {
    if (hasConsented && !isModelsLoading && !isCameraActive && autoStart && !cameraError && !isCameraDisabledRef.current && !isLockedSnapshot) {
      startCamera();
    }
  }, [hasConsented, isModelsLoading, isCameraActive, autoStart, cameraError, isLockedSnapshot, startCamera]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // 4. Real-Time Neural Detection Loop (every 500ms)
  useEffect(() => {
    if (!isCameraActive || isModelsLoading || isLockedSnapshot) return;

    const runDetection = async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

      try {
        const lightCheck = analyzeLighting(videoRef.current);
        setLightingWarning(lightCheck.warning || null);

        const options = new faceapi.TinyFaceDetectorOptions({
          inputSize: 224,
          scoreThreshold: 0.35,
        });

        const detection = await faceapi
          .detectSingleFace(videoRef.current, options)
          .withFaceLandmarks(true)
          .withFaceExpressions();

        if (detection) {
          setNoFaceDetected(false);

          const box = detection.detection.box;
          setFaceBox({
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height,
          });

          const positions = detection.landmarks.positions;
          setLandmarks(positions.map((p) => ({ x: p.x, y: p.y })));

          if (detection.expressions) {
            latestRawExpressionsRef.current = detection.expressions;
            const mapped = mapExpressionsToVynuraMood(detection.expressions);
            setDetectedMood(mapped.mood);
            setConfidence(mapped.confidence);
            setBreakdown(mapped.breakdown);
          }
        } else {
          setNoFaceDetected(true);
          setFaceBox(null);
          setLandmarks([]);
        }
      } catch (err) {
        console.warn('Face detection pass warning:', err);
      }
    };

    runDetection();
    detectionIntervalRef.current = window.setInterval(runDetection, 500);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, [isCameraActive, isModelsLoading, isLockedSnapshot]);

  // 5. Mood Confirmation Moment (Camera Turns Off immediately + Confetti + Auto-Scroll)
  const handleConfirm = (moodToConfirm: MoodType, confScore: number) => {
    setIsConfirmed(true);
    setIsLockedSnapshot(true);
    isCameraDisabledRef.current = true;
    const moodData = MOODS[moodToConfirm];

    // Immediately stop the camera hardware stream so camera light turns off
    stopCamera();

    // Trigger celebratory firefly confetti burst
    try {
      confetti({
        particleCount: 65,
        spread: 85,
        origin: { y: 0.55 },
        colors: [moodData.color, '#FFC978', '#FFFFFF', '#6FBFC4', '#C25AE0'],
        disableForReducedMotion: true,
        ticks: 220,
        shapes: ['circle'],
        scalar: 1.15,
      });
    } catch {
      // Fallback
    }

    // Sky tint transition via CSS variable
    document.documentElement.style.setProperty('--accent-glow', moodData.color);

    // Call parent confirm callback with raw expressions
    onConfirmMood(moodToConfirm, confScore, latestRawExpressionsRef.current);

    // Smoothly scroll down to recommendations
    setTimeout(() => {
      setIsConfirmed(false);
      const recElem = document.getElementById('recommendations');
      if (recElem) {
        recElem.scrollIntoView({ behavior: 'smooth' });
      }
    }, 500);
  };

  const handleManualSelect = (mood: MoodType) => {
    setDetectedMood(mood);
    setConfidence(0.95);
    setBreakdown((prev) => ({
      ...prev,
      [mood]: 0.95,
    }));
    handleConfirm(mood, 0.95);
  };

  const handleToggleCamera = () => {
    if (isCameraActive) {
      isCameraDisabledRef.current = true;
      stopCamera();
    } else {
      isCameraDisabledRef.current = false;
      setIsLockedSnapshot(false);
      startCamera();
    }
  };

  const activeMoodData = MOODS[detectedMood];

  // Consent Banner
  if (!hasConsented) {
    return (
      <div className="w-full rounded-2xl bg-[#121316] border border-white/[0.08] p-6 sm:p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)] overflow-hidden text-center relative">
        <div className="max-w-2xl mx-auto space-y-6">
          <Camera className="w-8 h-8 mx-auto text-amber-400" strokeWidth={1.5} />

          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
              Private Sensor Telemetry
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              On-Device Expression Calibrator
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-lg mx-auto">
            Vynura uses real-time facial micro-landmark detection to calibrate your current state and adapt auditory and visual paces.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left bg-[#18191c] p-4 rounded-xl border border-white/[0.06]">
            <div className="flex items-start gap-2.5">
              <EyeOff className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-medium text-white">Zero Uploads</div>
                <div className="text-[11px] text-neutral-400">Frames never leave your local RAM</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-medium text-white">Local Neural</div>
                <div className="text-[11px] text-neutral-400">WebGL/Wasm in-browser inference</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-neutral-400 mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-medium text-white">Auto Hardware Stop</div>
                <div className="text-[11px] text-neutral-400">Stream cuts right after confirmation</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              variant="primary"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => {
                sessionStorage.setItem('vynura_camera_consented', 'true');
                setHasConsented(true);
              }}
            >
              Enable Sensor Telemetry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="relative rounded-2xl bg-[#121316] border border-white/[0.08] p-6 sm:p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-white/60 stroke-[1.5]" />
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-white/50">
                Landmark Stream · {activeMoodData.label}
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-white tracking-tight">
                Client-Side Expression Regression
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Camera On/Off Toggle Button */}
            <button
              onClick={handleToggleCamera}
              className="px-3.5 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-medium text-white/80 transition-colors flex items-center gap-2 cursor-pointer active:scale-[0.97]"
            >
              {isCameraActive ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Camera Live</span>
                </>
              ) : (
                <>
                  <VideoOff className="w-3.5 h-3.5 text-white/40" />
                  <span>Camera Off</span>
                </>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-white/50">
              <Shield className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Wasm Runtime</span>
            </div>
          </div>
        </div>

        {/* Center Container: Camera Video or Loading */}
        {isModelsLoading ? (
          <SwirlLoadingState progressMessage="Loading face-api neural weights..." />
        ) : modelError ? (
          <div className="p-8 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-[#FF9E7D] mx-auto" />
            <div className="text-sm text-[#F5F2ED] font-semibold">{modelError}</div>
            <Button size="sm" variant="secondary" onClick={() => window.location.reload()}>
              Retry Initialization
            </Button>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Live Camera Feed Container */}
            <div
              className="relative mx-auto w-full max-w-lg aspect-[4/3] rounded-2xl bg-[#0E0C20] border-2 overflow-hidden flex items-center justify-center transition-all duration-500 shadow-xl"
              style={{
                borderColor: activeMoodData.color,
                boxShadow: `0 0 35px -5px ${activeMoodData.color}35`,
              }}
            >
              {/* HTML5 Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform -scale-x-100 ${
                  isCameraActive ? 'opacity-100' : 'opacity-0'
                } transition-opacity duration-300`}
              />

              {/* Facial Bounding & Landmark Overlay */}
              {isCameraActive && (
                <FaceCanvasOverlay
                  box={faceBox}
                  landmarks={landmarks}
                  mood={detectedMood}
                  moodColor={activeMoodData.color}
                  confidence={confidence}
                  videoWidth={videoRef.current?.videoWidth || 640}
                  videoHeight={videoRef.current?.videoHeight || 480}
                />
              )}

              {/* Snapshot Locked Overlay */}
              {isLockedSnapshot && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#08090A]/95 z-30 space-y-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 stroke-[1.5]" />
                  <div>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-white/50 block mb-1">
                      Frame Processed · Sensor Purged
                    </span>
                    <h4 className="text-xl font-semibold text-white tracking-tight">
                      Calibrated: {activeMoodData.label} ({activeMoodData.sublabel})
                    </h4>
                    <p className="text-xs text-white/60 mt-1">
                      Adaptive sensory protocols have been populated below.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Button
                      size="sm"
                      variant="primary"
                      icon={<ArrowDown className="w-3.5 h-3.5" />}
                      onClick={() => {
                        const recElem = document.getElementById('recommendations');
                        recElem?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      View Suggested Shift Actions
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      icon={<RefreshCw className="w-3.5 h-3.5" />}
                      onClick={() => {
                        isCameraDisabledRef.current = false;
                        setIsLockedSnapshot(false);
                        startCamera();
                      }}
                    >
                      Scan Again
                    </Button>
                  </div>
                </div>
              )}

              {/* Camera Paused / Error Overlay */}
              {!isCameraActive && !isLockedSnapshot && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#121029]/95 z-20 space-y-3">
                  <VideoOff className="w-12 h-12 text-[#B8B4D9]/50" />
                  <p className="text-xs text-[#B8B4D9] max-w-xs leading-relaxed">
                    {cameraError || 'Camera stream is currently off to preserve privacy and battery.'}
                  </p>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<RefreshCw className="w-3.5 h-3.5" />}
                    onClick={() => {
                      isCameraDisabledRef.current = false;
                      startCamera();
                    }}
                  >
                    Turn Camera On
                  </Button>
                </div>
              )}

              {/* No Face Warning */}
              <AnimatePresence>
                {isCameraActive && noFaceDetected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3.5 py-1.5 rounded-full bg-[#121029]/90 border border-[#FF9E7D]/40 text-xs font-semibold text-[#FF9E7D] shadow-md flex items-center gap-1.5 z-20 pointer-events-none"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Please position your face clearly in frame</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lighting Warning Banner */}
              <AnimatePresence>
                {isCameraActive && lightingWarning && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-3 left-3 right-3 px-3 py-1 rounded-xl bg-[#2D2A5C]/90 border border-[#FFC978]/40 text-[11px] text-[#FFC978] shadow-md flex items-center gap-2 z-20 pointer-events-none"
                  >
                    <Sun className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{lightingWarning}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Breakdown Bars (Monochrome & Restrained) */}
            <div className="grid grid-cols-5 gap-2.5 max-w-lg mx-auto">
              {(['calm', 'happy', 'energetic', 'neutral', 'sad'] as MoodType[]).map((mKey) => {
                const val = Math.round((breakdown[mKey] || 0.1) * 100);
                const isWinner = detectedMood === mKey;
                return (
                  <div key={mKey} className="text-center space-y-1">
                    <div className="flex justify-between items-center text-[10px] font-mono px-0.5">
                      <span className={isWinner ? 'text-white font-medium' : 'text-white/40'}>
                        {mKey.slice(0, 3).toUpperCase()}
                      </span>
                      <span className={isWinner ? 'text-[#F59E0B] font-mono' : 'text-white/40 font-mono'}>
                        {val}%
                      </span>
                    </div>
                    <div className="h-1 w-full bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${val}%`,
                          backgroundColor: isWinner ? '#F59E0B' : 'rgba(255, 255, 255, 0.25)',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Confirmation Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.08]">
              <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" />
                <div>
                  <div className="text-[11px] font-mono text-white/50 flex items-center gap-1.5">
                    <span>Biometric Match:</span>
                    <span className="font-semibold text-white">
                      <AnimatedNumber value={Math.round(confidence * 100)} />%
                    </span>
                  </div>
                  <div className="text-base font-semibold text-white">
                    {activeMoodData.label}
                    <span className="text-xs text-white/50 font-normal ml-2">
                      ({activeMoodData.sublabel})
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Capture Action Button */}
              <Button
                size="md"
                variant="primary"
                className="w-full sm:w-auto cursor-pointer"
                icon={isConfirmed ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                onClick={() => handleConfirm(detectedMood, confidence)}
              >
                {isConfirmed ? 'Calibrating...' : 'Confirm & Calibrate'}
              </Button>
            </div>

            {/* Manual Mood Recalibration Override */}
            <ManualMoodSelector
              currentMood={detectedMood}
              onSelectMood={handleManualSelect}
            />
          </div>
        )}
      </div>
    </div>
  );
};
