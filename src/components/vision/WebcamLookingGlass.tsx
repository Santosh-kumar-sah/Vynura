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
  onConfirmMood: (mood: MoodType, confidence: number) => void;
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

  // 2. Start Video Camera Stream
  const startCamera = useCallback(async () => {
    setCameraError(null);
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

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  // Auto-start camera when consented and models loaded
  useEffect(() => {
    if (hasConsented && !isModelsLoading && !isCameraActive && autoStart && !cameraError) {
      startCamera();
    }
  }, [hasConsented, isModelsLoading, isCameraActive, autoStart, cameraError, startCamera]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // 3. Real-Time Neural Detection Loop (every 600ms)
  useEffect(() => {
    if (!isCameraActive || isModelsLoading) return;

    const runDetection = async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) return;

      try {
        // Evaluate lighting conditions
        const lightCheck = analyzeLighting(videoRef.current);
        setLightingWarning(lightCheck.warning || null);

        // Run client-side inference using TinyFaceDetector
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

          // Update bounding box
          const box = detection.detection.box;
          setFaceBox({
            x: box.x,
            y: box.y,
            width: box.width,
            height: box.height,
          });

          // Update landmark points
          const positions = detection.landmarks.positions;
          setLandmarks(positions.map((p) => ({ x: p.x, y: p.y })));

          // Map 7 raw expression scores to Vynura's 5 mood states
          if (detection.expressions) {
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
    detectionIntervalRef.current = window.setInterval(runDetection, 600);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, [isCameraActive, isModelsLoading]);

  // 4. Mood Confirmation Moment (Signature Firefly Confetti + Sky Tint Shift)
  const handleConfirm = (moodToConfirm: MoodType, confScore: number) => {
    setIsConfirmed(true);
    const moodData = MOODS[moodToConfirm];

    // Trigger signature firefly shooting-star burst
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

    // Call parent confirm callback
    setTimeout(() => {
      onConfirmMood(moodToConfirm, confScore);
      setIsConfirmed(false);
    }, 450);
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

  const activeMoodData = MOODS[detectedMood];

  // If user hasn't granted camera consent, display on-brand consent banner
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
                <div className="text-xs font-bold text-[#F5F2ED]">Label Only</div>
                <div className="text-[11px] text-[#B8B4D9]">Only mood state persists</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              variant="primary"
              icon={<Sparkles className="w-4 h-4" />}
              onClick={() => {
                sessionStorage.setItem('vynura_camera_consented', 'true');
                setHasConsented(true);
                startCamera();
              }}
              className="px-8 shadow-glow-md"
            >
              Enter The Mirror ✦
            </Button>
          </div>

          <div className="pt-4 border-t border-[#B8B4D9]/15">
            <span className="text-xs text-[#B8B4D9] block mb-2">Or select your resonance manually:</span>
            <ManualMoodSelector
              currentMood={detectedMood}
              onSelectMood={handleManualSelect}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-3xl bg-gradient-to-b from-[#24214A] via-[#1A1836] to-[#121029] border border-[#FFC978]/35 p-5 sm:p-8 shadow-[0_25px_70px_-15px_rgba(10,8,28,0.95)] overflow-hidden relative">
      {/* Dynamic Glowing Mood Halo Top Rim */}
      <div
        className="absolute top-0 left-0 right-0 h-[2.5px] transition-colors duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${activeMoodData.color}, transparent)`,
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#B8B4D9]/15">
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
                Biometric Looking Glass
              </span>
              <span className="text-xs text-[#FFC978]/90 font-mono">
                {activeMoodData.sublabel}
              </span>
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#F5F2ED]">
              Real-Time Expression Calibration
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121029]/80 border border-[#6FBFC4]/30 text-[11px] text-[#6FBFC4]">
            <Shield className="w-3.5 h-3.5" />
            <span>Private Wasm Runtime</span>
          </div>
          {isCameraActive && (
            <button
              onClick={stopCamera}
              className="p-2 rounded-xl bg-[#1A1836] border border-[#B8B4D9]/20 hover:border-[#FF9E7D]/50 text-[#B8B4D9] hover:text-[#FF9E7D] transition-colors cursor-pointer text-xs flex items-center gap-1"
              title="Pause Camera"
            >
              <VideoOff className="w-4 h-4" />
              <span className="hidden sm:inline">Pause</span>
            </button>
          )}
          {!isCameraActive && !isModelsLoading && (
            <button
              onClick={startCamera}
              className="p-2 rounded-xl bg-[#2D2A5C] border border-[#FFC978]/40 text-[#FFC978] hover:bg-[#383372] transition-colors cursor-pointer text-xs flex items-center gap-1"
              title="Resume Camera"
            >
              <Camera className="w-4 h-4" />
              <span className="hidden sm:inline">Resume</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Detector Body */}
      {isModelsLoading ? (
        <SwirlLoadingState progressMessage="Awakening Neural Landmark Tensor Network..." />
      ) : modelError ? (
        <div className="p-8 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-[#FF9E7D] mx-auto" />
          <div className="text-sm text-[#F5F2ED] font-semibold">{modelError}</div>
          <Button size="sm" variant="secondary" onClick={() => window.location.reload()}>
            Retry Initialization
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Webcam Live Feed Container with On-Brand Glowing Organic Aperture */}
          <div
            className="relative mx-auto w-72 h-72 sm:w-80 sm:h-80 rounded-[2.5rem] bg-[#0F0D24] border-2 overflow-hidden flex items-center justify-center transition-all duration-500 shadow-2xl"
            style={{
              borderColor: activeMoodData.color,
              boxShadow: `0 0 35px -5px ${activeMoodData.color}40`,
            }}
          >
            {/* Video Element */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover transform -scale-x-100 ${
                isCameraActive ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300`}
            />

            {/* Facial Bounding & Landmark Overlay (Organic Reticle) */}
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

            {/* Camera Error or Off State */}
            {!isCameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#121029]/95 z-20 space-y-3">
                <Camera className="w-10 h-10 text-[#FFC978]/60" />
                <p className="text-xs text-[#B8B4D9] max-w-xs leading-relaxed">
                  {cameraError || 'Camera paused. Click resume or calibrate your frequency manually.'}
                </p>
                {cameraError && (
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<RefreshCw className="w-3.5 h-3.5" />}
                    onClick={startCamera}
                  >
                    Retry Camera
                  </Button>
                )}
              </div>
            )}

            {/* No Face Detected Overlay Pill */}
            <AnimatePresence>
              {isCameraActive && noFaceDetected && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-[#121029]/90 border border-[#FF9E7D]/40 text-xs font-semibold text-[#FF9E7D] shadow-md flex items-center gap-1.5 z-20 pointer-events-none whitespace-nowrap"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Center your face within the frame</span>
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

          {/* Live Frequency Resonance Telemetry Bar */}
          <div className="bg-[#121029]/80 p-4 rounded-2xl border border-[#B8B4D9]/15 max-w-xl mx-auto">
            <div className="flex items-center justify-between text-xs mb-2.5">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#FFC978]" />
                <span className="font-semibold text-[#F5F2ED]">Harmonic Resonance Spectrum</span>
              </div>
              <span className="font-mono text-[11px] text-[#FFC978]">
                {Math.round(confidence * 100)}% Coherence
              </span>
            </div>

            {/* 5 Mood Category Progress Gauges */}
            <div className="grid grid-cols-5 gap-2 text-center">
              {(['happy', 'calm', 'sad', 'energetic', 'neutral'] as MoodType[]).map((mKey) => {
                const isDominant = detectedMood === mKey;
                const score = breakdown[mKey] || 0;
                const mData = MOODS[mKey];
                return (
                  <div key={mKey} className="space-y-1">
                    <div className="text-[10px] font-mono text-[#B8B4D9] uppercase truncate">
                      {mData.sublabel}
                    </div>
                    <div className="h-1.5 w-full bg-[#1A1836] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: mData.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.round(score * 100)}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <div
                      className={`text-[10px] font-mono ${
                        isDominant ? 'font-bold text-[#F5F2ED]' : 'text-[#B8B4D9]/60'
                      }`}
                    >
                      {Math.round(score * 100)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Confirmation Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="lg"
              variant="primary"
              className="w-full sm:w-auto px-8 shadow-glow-md"
              icon={isConfirmed ? <CheckCircle2 className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              onClick={() => handleConfirm(detectedMood, confidence)}
            >
              {isConfirmed
                ? 'Resonance Locked ✦'
                : `Confirm ${activeMoodData.label} (${Math.round(confidence * 100)}%)`}
            </Button>
          </div>

          {/* Manual Mood Override Selector */}
          <ManualMoodSelector
            currentMood={detectedMood}
            onSelectMood={handleManualSelect}
          />
        </div>
      )}
    </div>
  );
};
