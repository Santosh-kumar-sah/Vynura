import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as faceapi from '@vladmandic/face-api';
import confetti from 'canvas-confetti';
import {
  Camera,
  X,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Sun,
  Shield,
  Activity,
} from 'lucide-react';
import { ConsentModal } from './ConsentModal';
import { SwirlLoadingState } from './SwirlLoadingState';
import { FaceCanvasOverlay } from './FaceCanvasOverlay';
import { ManualMoodSelector } from './ManualMoodSelector';
import { Button } from '../common/Button';
import { mapExpressionsToVynuraMood, analyzeLighting, type RawExpressions } from '../../utils/expressionMapper';
import type { MoodType } from '../../types';
import { MOODS } from '../sections/HeroSection';

interface FaceDetectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmMood: (mood: MoodType, confidence: number) => void;
}

export const FaceDetectionModal: React.FC<FaceDetectionModalProps> = ({
  isOpen,
  onClose,
  onConfirmMood,
}) => {
  // State management
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [isModelsLoading, setIsModelsLoading] = useState<boolean>(true);
  const [modelError, setModelError] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);

  // Detection feedback state
  const [detectedMood, setDetectedMood] = useState<MoodType>('neutral');
  const [confidence, setConfidence] = useState<number>(0.85);
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
  const [, setIsConfirmed] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);

  // 1. Load face-api.js Models Client-Side
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

    if (isOpen) {
      loadModels();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

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
          videoRef.current?.play();
          setIsCameraActive(true);
        };
      }
    } catch (err: unknown) {
      console.error('Webcam permission error:', err);
      setCameraError('Camera access denied or unavailable. You may enable camera or choose your mood manually below.');
      setIsCameraActive(false);
    }
  }, []);

  // 3. Stop Stream on Unmount/Close
  const stopCamera = useCallback(() => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  useEffect(() => {
    if (isOpen && hasConsented && !isModelsLoading && !isCameraActive && !cameraError) {
      startCamera();
    }
  }, [isOpen, hasConsented, isModelsLoading, isCameraActive, cameraError, startCamera]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // 4. Real-Time Detection Loop (Interval ~600ms)
  useEffect(() => {
    if (!isCameraActive || isModelsLoading) {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      return;
    }

    const runDetection = async () => {
      const video = videoRef.current;
      if (!video || video.paused || video.ended || video.readyState < 2) return;

      try {
        // Lighting check
        const lightResult = analyzeLighting(video);
        setLightingWarning(lightResult.isGood ? null : (lightResult.warning || null));

        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.45 }))
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

          if (detection.landmarks) {
            setLandmarks(detection.landmarks.positions);
          }

          if (detection.expressions) {
            const raw = detection.expressions as RawExpressions;
            const mapped = mapExpressionsToVynuraMood(raw);
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

    // Run first pass immediately, then on 600ms interval
    runDetection();
    detectionIntervalRef.current = window.setInterval(runDetection, 600);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, [isCameraActive, isModelsLoading]);

  // 5. Signature Mood Confirmation Trigger
  const handleConfirm = () => {
    setIsConfirmed(true);
    const activeMoodData = MOODS[detectedMood];

    // Trigger signature firefly shooting star burst
    try {
      confetti({
        particleCount: 50,
        spread: 85,
        origin: { y: 0.55 },
        colors: [activeMoodData.color, '#FFC978', '#FFFFFF', '#6FBFC4'],
        disableForReducedMotion: true,
        ticks: 200,
        shapes: ['circle'],
        scalar: 1.15,
      });
    } catch {
      // Fallback
    }

    // Sky tint shift transition
    document.documentElement.style.setProperty('--accent-glow', activeMoodData.color);

    // Call parent handler with confirmed mood
    setTimeout(() => {
      onConfirmMood(detectedMood, confidence);
      stopCamera();
      onClose();
      setIsConfirmed(false);
    }, 600);
  };

  const handleManualSelect = (mood: MoodType) => {
    setDetectedMood(mood);
    setConfidence(0.95);
    setBreakdown((prev) => ({
      ...prev,
      [mood]: 0.95,
    }));
  };

  if (!isOpen) return null;

  // Show Consent Modal first if not yet consented
  if (!hasConsented) {
    return (
      <ConsentModal
        isOpen={isOpen}
        onGrantAccess={() => setHasConsented(true)}
        onClose={onClose}
      />
    );
  }

  const currentMoodData = MOODS[detectedMood];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-[#0B091C]/85 backdrop-blur-lg overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        className="relative w-full max-w-2xl rounded-3xl bg-gradient-to-b from-[#24214A] via-[#1A1836] to-[#121029] border border-[#FFC978]/35 p-5 sm:p-7 shadow-[0_25px_70px_-15px_rgba(10,8,28,0.95)] overflow-hidden my-auto"
      >
        {/* Dynamic Glowing Mood Halo Top Rim */}
        <div
          className="absolute top-0 left-0 right-0 h-[2.5px] transition-colors duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${currentMoodData.color}, transparent)`,
          }}
        />

        {/* Modal Close Button */}
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl text-[#B8B4D9] hover:text-[#F5F2ED] hover:bg-[#2D2A5C]/60 transition-colors z-20 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-[#B8B4D9]/15">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center border shadow-glow-sm transition-colors duration-300"
              style={{
                backgroundColor: `${currentMoodData.color}20`,
                borderColor: `${currentMoodData.color}60`,
                color: currentMoodData.color,
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
                  {currentMoodData.sublabel}
                </span>
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-[#F5F2ED]">
                Real-Time Expression Calibration
              </h3>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121029]/80 border border-[#6FBFC4]/30 text-[11px] text-[#6FBFC4]">
            <Shield className="w-3.5 h-3.5" />
            <span>Private Wasm Runtime</span>
          </div>
        </div>

        {/* Main Body State */}
        {isModelsLoading ? (
          <SwirlLoadingState progressMessage="Awakening Face Landmark Tensor Network..." />
        ) : modelError ? (
          <div className="p-6 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-[#FF9E7D] mx-auto" />
            <div className="text-sm text-[#F5F2ED] font-semibold">{modelError}</div>
            <Button size="sm" variant="secondary" onClick={() => window.location.reload()}>
              Retry Initialization
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Webcam Live Feed Container with Glowing Organic Aperture */}
            <div
              className="relative mx-auto w-full max-w-md aspect-[4/3] rounded-2xl bg-[#0F0D24] border-2 overflow-hidden flex items-center justify-center transition-all duration-500 shadow-lg"
              style={{
                borderColor: currentMoodData.color,
                boxShadow: `0 0 30px -5px ${currentMoodData.color}35`,
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

              {/* Facial Bounding & Landmark Overlay */}
              {isCameraActive && (
                <FaceCanvasOverlay
                  box={faceBox}
                  landmarks={landmarks}
                  mood={detectedMood}
                  moodColor={currentMoodData.color}
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
                    {cameraError || 'Camera initializing... You can also choose your mood manually below.'}
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

              {/* No Face Detected Pill Overlay */}
              <AnimatePresence>
                {isCameraActive && noFaceDetected && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-[#121029]/90 border border-[#FF9E7D]/40 text-xs font-semibold text-[#FF9E7D] shadow-md flex items-center gap-1.5 z-20 pointer-events-none"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Center your face within frame</span>
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
            <div className="grid grid-cols-5 gap-1.5 px-1">
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

            {/* Real-time Mood Resonance Badge & Confirmation Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#1A1836]/90 border border-[#B8B4D9]/20">
              <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                <div
                  className="w-3.5 h-3.5 rounded-full animate-pulse"
                  style={{
                    backgroundColor: currentMoodData.color,
                    boxShadow: `0 0 10px ${currentMoodData.color}`,
                  }}
                />
                <div>
                  <div className="text-xs text-[#B8B4D9] flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-[#FFC978]" />
                    <span>Dominant Harmonic:</span>
                    <span className="font-mono font-bold text-[#F5F2ED]">
                      {Math.round(confidence * 100)}% Match
                    </span>
                  </div>
                  <div className="font-heading text-base font-bold text-[#F5F2ED] flex items-center gap-2">
                    <span style={{ color: currentMoodData.color }}>
                      {currentMoodData.label}
                    </span>
                    <span className="text-xs text-[#B8B4D9] font-normal">
                      ({currentMoodData.sublabel})
                    </span>
                  </div>
                </div>
              </div>

              {/* Primary Confirmation Action */}
              <Button
                size="md"
                variant="primary"
                className="w-full sm:w-auto"
                icon={<CheckCircle2 className="w-4 h-4" />}
                onClick={handleConfirm}
              >
                Confirm Emotional State
              </Button>
            </div>

            {/* Manual Override Selector */}
            <ManualMoodSelector
              currentMood={detectedMood}
              onSelectMood={handleManualSelect}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};
