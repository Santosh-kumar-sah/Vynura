import React from 'react';
import type { MoodType } from '../../types';

interface FaceBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FaceLandmarkPoint {
  x: number;
  y: number;
}

interface FaceCanvasOverlayProps {
  box: FaceBox | null;
  landmarks?: FaceLandmarkPoint[];
  mood: MoodType;
  moodColor: string;
  confidence: number;
  videoWidth: number;
  videoHeight: number;
}

export const FaceCanvasOverlay: React.FC<FaceCanvasOverlayProps> = ({
  box,
  landmarks = [],
  moodColor,
  confidence,
  videoWidth,
  videoHeight,
}) => {
  if (!box || videoWidth === 0 || videoHeight === 0) return null;

  // Scale coordinates to percentages
  const leftPct = (box.x / videoWidth) * 100;
  const topPct = (box.y / videoHeight) * 100;
  const widthPct = (box.width / videoWidth) * 100;
  const heightPct = (box.height / videoHeight) * 100;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {/* Organic glowing facial bounding reticle (not harsh rectangle) */}
      <div
        className="absolute rounded-3xl transition-all duration-300 ease-out"
        style={{
          left: `${Math.max(leftPct - 4, 2)}%`,
          top: `${Math.max(topPct - 4, 2)}%`,
          width: `${Math.min(widthPct + 8, 96)}%`,
          height: `${Math.min(heightPct + 8, 96)}%`,
          border: `1.5px solid ${moodColor}80`,
          boxShadow: `0 0 20px ${moodColor}40, inset 0 0 15px ${moodColor}20`,
        }}
      >
        {/* Anime Ghibli / Sci-fi corner celestial accents */}
        <div
          className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg"
          style={{ borderColor: moodColor }}
        />
        <div
          className="absolute -top-1.5 -right-1.5 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg"
          style={{ borderColor: moodColor }}
        />
        <div
          className="absolute -bottom-1.5 -left-1.5 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg"
          style={{ borderColor: moodColor }}
        />
        <div
          className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 rounded-br-lg"
          style={{ borderColor: moodColor }}
        />

        {/* Live Starlight HUD Indicator */}
        <div
          className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider whitespace-nowrap backdrop-blur-md shadow-glow-sm flex items-center gap-1.5"
          style={{
            backgroundColor: '#121029E6',
            borderColor: `${moodColor}70`,
            borderWidth: '1px',
            color: '#F5F2ED',
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-ping"
            style={{ backgroundColor: moodColor }}
          />
          <span>LOCK: {Math.round(confidence * 100)}%</span>
        </div>
      </div>

      {/* Subtle constellation landmark dots */}
      {landmarks.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {landmarks.map((pt, idx) => {
            // Render a subset of points (e.g. eyes, nose tip, chin) to keep visual celestial aesthetic clean
            if (idx % 3 !== 0) return null;
            const px = (pt.x / videoWidth) * 100;
            const py = (pt.y / videoHeight) * 100;
            return (
              <circle
                key={idx}
                cx={`${px}%`}
                cy={`${py}%`}
                r="1.5"
                fill="#FFF2D6"
                opacity="0.65"
              />
            );
          })}
        </svg>
      )}
    </div>
  );
};
