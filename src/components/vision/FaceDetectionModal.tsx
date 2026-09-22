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
  VideoOff,
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
  onConfirmMood: (
    mood: MoodType,
    confidence: number,
    rawExpressions?: RawExpressions | null
  ) => void;
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
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

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

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectionIntervalRef = useRef<number | null>(null);
  const isTerminatedRef = useRef<boolean>(false);
  const latestRawExpressionsRef = useRef<RawExpressions | null>(null);

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
          setModelError('Failed to load neural vision models. Please refresh to try again.');
          setIsModelsLoading(false);
        }
      }
    }

    if (isOpen) {
      isTerminatedRef.current = false;
      loadModels();
    }

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // 2. Stop Camera Streams immediately and release hardware locks
  const stopCamera = useCallback(() => {
    isTerminatedRef.current = true;
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
      detectionIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
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
    if (isTerminatedRef.current) return;
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

      if (isTerminatedRef.current) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().then(() => {
            setIsCameraActive(true);
          }).catch(() => {
            setIsCameraActive(true);
          });
        };
      }
    } catch (err: unknown) {
      console.error('Webcam permission error:', err);
      setCameraError('Camera access denied or unavailable. You may enable camera or choose your mood manually below.');
      setIsCameraActive(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && hasConsented && !isModelsLoading && !isCameraActive && !cameraError && !isTerminatedRef.current) {
      startCamera();
    }
  }, [isOpen, hasConsented, isModelsLoading, isCameraActive, cameraError, startCamera]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // 4. Real-Time Detection Loop (Interval ~500ms)
  useEffect(() => {
    if (!isCameraActive || isModelsLoading || isCapturing) {
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
        const lightResult = analyzeLighting(video);
        setLightingWarning(lightResult.isGood ? null : (lightResult.warning || null));

        const detection = await faceapi
          .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.4 }))
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
            latestRawExpressionsRef.current = raw;
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

    runDetection();
    detectionIntervalRef.current = window.setInterval(runDetection, 500);

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    };
  }, [isCameraActive, isModelsLoading, isCapturing]);

  // 5. Signature Mood Confirmation Trigger
  const handleConfirm = () => {
    setIsCapturing(true);
    const chosenMood = detectedMood;
    const chosenConfidence = confidence;
    const activeMoodData = MOODS[chosenMood];

    // 1. Immediately terminate camera hardware stream so webcam light goes OFF
    stopCamera();

    // 2. Confetti burst
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

    // 3. Shift atmospheric sky tint
    document.documentElement.style.setProperty('--accent-glow', activeMoodData.color);

    // 4. Pass confirmed mood and raw expressions, and close modal
    onConfirmMood(chosenMood, chosenConfidence, latestRawExpressionsRef.current);
    onClose();
    setIsCapturing(false);
  };

  const handleManualSelect = (mood: MoodType) => {
    setDetectedMood(mood);
    setConfidence(0.95);
    setBreakdown((prev) => ({
      ...prev,
      [mood]: 0.95,
    }));
  };

  const handleCloseModal = () => {
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  // Show Consent Modal first if not yet consented
  if (!hasConsented) {
    return (
      <ConsentModal
        isOpen={isOpen}
        onGrantAccess={() => setHasConsented(true)}
        onClose={handleCloseModal}
      />
    );
  }

  const currentMoodData = MOODS[detectedMood];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl rounded-2xl bg-[#121316] border border-white/[0.08] p-5 sm:p-7 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.8)] overflow-hidden my-auto"
      >
        {/* Modal Close Button */}
        <button
          onClick={handleCloseModal}
          className="absolute top-4 right-4 p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-white/[0.06] transition-colors z-20 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Camera className="w-5 h-5 text-amber-400 shrink-0" strokeWidth={1.5} />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-medium">
                  Biometric Sensor
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  {currentMoodData.sublabel}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                Real-Time Expression Calibration
              </h3>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/[0.03] border border-white/[0.08] text-[11px] font-mono text-neutral-400">
              <Shield className="w-3.5 h-3.5 text-neutral-400" />
              <span>100% On-Device</span>
            </div>
          </div>
        </div>

        {/* Main Body State */}
        {isModelsLoading ? (
          <SwirlLoadingState progressMessage="Loading neural vision tensors..." />
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
            {/* Webcam Live Feed Container */}
            <div className="relative mx-auto w-full max-w-md aspect-[4/3] rounded-xl bg-[#08090A] border border-white/[0.12] overflow-hidden flex items-center justify-center transition-all duration-300">
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

              {/* Camera Off / Paused Overlay */}
              {!isCameraActive && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#121029]/95 z-20 space-y-3">
                  <VideoOff className="w-10 h-10 text-[#B8B4D9]/50" />
                  <p className="text-xs text-[#B8B4D9] max-w-xs leading-relaxed">
                    {cameraError || 'Camera stream paused. You can restart the camera or choose your mood manually below.'}
                  </p>
                  <Button
                    size="sm"
                    variant="primary"
                    icon={<RefreshCw className="w-3.5 h-3.5" />}
                    onClick={() => {
                      isTerminatedRef.current = false;
                      startCamera();
                    }}
                  >
                    Start Camera
                  </Button>
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-xl bg-[#18191c] border border-white/[0.08]">
              <div className="flex items-center gap-3 text-left w-full sm:w-auto">
                <div
                  className="w-2.5 h-2.5 rounded-full animate-pulse shrink-0"
                  style={{ backgroundColor: currentMoodData.color }}
                />
                <div>
                  <div className="text-xs text-neutral-400 flex items-center gap-1.5">
                    <Activity className="w-3 h-3 text-neutral-400" />
                    <span>Dominant State:</span>
                    <span className="font-mono font-medium text-white">
                      {Math.round(confidence * 100)}% Match
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <span style={{ color: currentMoodData.color }}>
                      {currentMoodData.label}
                    </span>
                    <span className="text-xs text-neutral-400 font-normal">
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
                Capture & Apply Shift
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
