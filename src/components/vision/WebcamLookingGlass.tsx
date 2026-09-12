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
  Activity,
  Sparkles,
  EyeOff,
  Cpu,
  ShieldCheck,
  VideoOff,
  ArrowDown,
  Lock,
} from 'lucide-react';
import { SwirlLoadingState } from './SwirlLoadingState';
import { FaceCanvasOverlay } from './FaceCanvasOverlay';
import { ManualMoodSelector } from './ManualMoodSelector';
import { Button } from '../common/Button';
import { mapExpressionsToVynuraMood, analyzeLighting } from '../../utils/expressionMapper';
import type { MoodType } from '../../types';
import { MOODS } from '../sections/HeroSection';

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
      <div className="w-full rounded-3xl bg-gradient-to-b from-[#24214A]/90 via-[#1A1836] to-[#14122C] border border-[#FFC978]/35 p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(10,8,28,0.95)] overflow-hidden text-center relative">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFC978] to-transparent" />

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#FFC978]/15 border border-[#FFC978]/40 flex items-center justify-center text-[#FFC978] shadow-glow-sm">
            <Camera className="w-7 h-7" />
          </div>

          <div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FFC978] font-bold">
                Private Looking Glass Sanctuary
              </span>
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F2ED]">
              Mirror of the Celestial Sky
            </h2>
          </div>

          <p className="text-sm text-[#B8B4D9] leading-relaxed max-w-lg mx-auto">
            Vynura uses real-time facial micro-landmark detection to reflect your emotional frequency and guide personalized sensory shifts.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left bg-[#121029]/80 p-4 rounded-2xl border border-[#B8B4D9]/15">
            <div className="flex items-start gap-2.5">
              <EyeOff className="w-4 h-4 text-[#6FBFC4] mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#F5F2ED]">Zero Uploads</div>
                <div className="text-[11px] text-[#B8B4D9]">Never stored or transmitted</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Cpu className="w-4 h-4 text-[#FFC978] mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#F5F2ED]">On-Device Neural</div>
                <div className="text-[11px] text-[#B8B4D9]">Runs in local browser memory</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#FF9E7D] mt-0.5 shrink-0" />
              <div>
                <div className="text-xs font-bold text-[#F5F2ED]">Auto-Turns Off</div>
                <div className="text-[11px] text-[#B8B4D9]">Camera stops right after capture</div>
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
              Allow Camera & Enter Mirror
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div
        className="relative rounded-3xl bg-gradient-to-b from-[#24214A]/90 via-[#1A1836]/95 to-[#121029]/95 border p-5 sm:p-7 shadow-[0_20px_60px_-15px_rgba(10,8,28,0.9)] overflow-hidden transition-all duration-500 backdrop-blur-xl"
        style={{
          borderColor: `${activeMoodData.color}45`,
          boxShadow: `0 20px 60px -15px ${activeMoodData.color}25, 0 0 0 1px ${activeMoodData.color}30`,
        }}
      >
        {/* Dynamic Top Rim Light Accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2.5px] transition-colors duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${activeMoodData.color}, transparent)`,
          }}
        />

        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#B8B4D9]/15">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-glow-sm transition-colors duration-300"
              style={{
                backgroundColor: `${activeMoodData.color}20`,
                borderColor: `${activeMoodData.color}60`,
                color: activeMoodData.color,
              }}
            >
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#FFC978] font-bold">
                  Looking Glass Feed
                </span>
                <span className="text-xs text-[#FFC978]/90 font-mono">
                  {activeMoodData.sublabel}
                </span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#F5F2ED]">
                Biometric Emotional Scanner
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Camera On/Off Toggle Button */}
            <button
              onClick={handleToggleCamera}
              className="px-3.5 py-1.5 rounded-xl bg-[#121029]/80 hover:bg-[#2D2A5C] border border-[#B8B4D9]/25 text-xs font-semibold text-[#F5F2ED] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {isCameraActive ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-[#6FBFC4] animate-pulse" />
                  <span>Camera Live</span>
                </>
              ) : (
                <>
                  <VideoOff className="w-3.5 h-3.5 text-[#FF9E7D]" />
                  <span>Camera Off</span>
                </>
              )}
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#121029]/80 border border-[#6FBFC4]/30 text-xs text-[#6FBFC4]">
              <Shield className="w-3.5 h-3.5" />
              <span>Local Wasm Neural</span>
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
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#121029]/95 z-30 space-y-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-glow-sm"
                    style={{
                      backgroundColor: `${activeMoodData.color}25`,
                      borderColor: activeMoodData.color,
                      color: activeMoodData.color,
                    }}
                  >
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase tracking-widest text-[#6FBFC4] font-bold block mb-1">
                      Camera Safely Turned Off
                    </span>
                    <h4 className="font-heading text-xl font-bold text-[#F5F2ED]">
                      Captured: {activeMoodData.label} ({activeMoodData.sublabel})
                    </h4>
                    <p className="text-xs text-[#B8B4D9] mt-1">
                      Personalized mood-shift suggestions have been generated below.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <Button
                      size="sm"
                      variant="primary"
                      icon={<ArrowDown className="w-4 h-4" />}
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

            {/* Live 5-Channel Mood Spectrum Telemetry */}
            <div className="grid grid-cols-5 gap-2 px-1">
              {(Object.keys(MOODS) as MoodType[]).map((mKey) => {
                const val = Math.round((breakdown[mKey] || 0.1) * 100);
                const isWinner = detectedMood === mKey;
                return (
                  <div key={mKey} className="text-center space-y-1">
                    <div className="flex justify-between items-center text-[10px] text-[#B8B4D9] font-mono px-1">
                      <span className={isWinner ? 'text-[#F5F2ED] font-bold' : ''}>
                        {mKey.slice(0, 3)}
                      </span>
                      <span>{val}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#1A1836] rounded-full overflow-hidden border border-[#B8B4D9]/15">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${val}%`,
                          backgroundColor: MOODS[mKey].color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Confirmation Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#1A1836]/90 border border-[#B8B4D9]/20">
              <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                <div
                  className="w-4 h-4 rounded-full animate-pulse shrink-0"
                  style={{
                    backgroundColor: activeMoodData.color,
                    boxShadow: `0 0 12px ${activeMoodData.color}`,
                  }}
                />
                <div>
                  <div className="text-xs text-[#B8B4D9] flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#FFC978]" />
                    <span>Real-Time Biometric Match:</span>
                    <span className="font-mono font-bold text-[#F5F2ED]">
                      {Math.round(confidence * 100)}%
                    </span>
                  </div>
                  <div className="font-heading text-lg font-bold text-[#F5F2ED] flex items-center gap-2">
                    <span style={{ color: activeMoodData.color }}>
                      {activeMoodData.label}
                    </span>
                    <span className="text-xs text-[#B8B4D9] font-normal">
                      ({activeMoodData.sublabel})
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Capture Action Button */}
              <Button
                size="md"
                variant="primary"
                className="w-full sm:w-auto shadow-glow-sm cursor-pointer"
                icon={isConfirmed ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                onClick={() => handleConfirm(detectedMood, confidence)}
              >
                {isConfirmed ? 'Calibrating...' : 'Capture & Get Suggested Actions'}
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
