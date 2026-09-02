import React from 'react';
import { motion } from 'framer-motion';
import { Music, ExternalLink, Headphones } from 'lucide-react';
import type { MoodType } from '../../types';
import { MOODS } from '../sections/HeroSection';

interface SpotifyPlayerProps {
  mood: MoodType;
}

// Curated Spotify Playlists for each harmonic mood
const SPOTIFY_PLAYLISTS: Record<MoodType, { id: string; title: string; subtitle: string; kanji: string; themeColor: string }> = {
  happy: {
    id: '37i9dQZF1DXdPec7aLTmlC', // Happy Lofi Beats
    title: 'Euphoric Starlight Lofi',
    subtitle: 'Warm Acoustic Kalimba & Summer Vibes',
    kanji: '喜びの調べ',
    themeColor: '#FF9E7D',
  },
  calm: {
    id: '37i9dQZF1DX4sWSpwq3LiO', // Peaceful Piano
    title: 'Binaural Theta Serenity',
    subtitle: '432Hz Ambient Waves & Makoto Shinkai Piano',
    kanji: '静寂の海',
    themeColor: '#6FBFC4',
  },
  sad: {
    id: '37i9dQZF1DXbvABifmGZ5j', // Rainy Day Lofi
    title: 'Midnight Rain & Soft Shinkai Solitude',
    subtitle: 'Gentle Piano Raindrops & Emotional Release',
    kanji: '夜雨の安らぎ',
    themeColor: '#4A5B8C',
  },
  energetic: {
    id: '37i9dQZF1DXdLEN7aqioXM', // Synthwave / Retro electro flow
    title: 'Cosmic Momentum & Starlight Surge',
    subtitle: 'High-Vibe Synth Pulses & Creative Flow',
    kanji: '情熱の波動',
    themeColor: '#C25AE0',
  },
  neutral: {
    id: '37i9dQZF1DWZeKCadgRdKQ', // Deep Ambient Focus
    title: 'Bamboo Chimes & Mountain Mist',
    subtitle: 'Subtle Equilibrium & Natural Resonance',
    kanji: '調和の風鈴',
    themeColor: '#8B87B0',
  },
};

export const SpotifyPlayer: React.FC<SpotifyPlayerProps> = ({ mood }) => {
  const currentPlaylist = SPOTIFY_PLAYLISTS[mood] || SPOTIFY_PLAYLISTS.neutral;
  const moodData = MOODS[mood] || MOODS.neutral;

  return (
    <div
      className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#24214A]/90 via-[#1A1836]/95 to-[#121029]/95 border backdrop-blur-xl relative overflow-hidden transition-all duration-500 shadow-xl"
      style={{
        borderColor: `${currentPlaylist.themeColor}50`,
        boxShadow: `0 15px 45px -10px ${currentPlaylist.themeColor}30`,
      }}
    >
      {/* Top Luminous Neon Strip */}
      <div
        className="absolute top-0 left-0 right-0 h-[2.5px] transition-colors duration-500"
        style={{
          background: `linear-gradient(90deg, transparent, ${currentPlaylist.themeColor}, transparent)`,
        }}
      />

      {/* Header Container */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#B8B4D9]/15">
        <div className="flex items-center gap-3.5">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center border shadow-glow-sm transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundColor: `${currentPlaylist.themeColor}20`,
              borderColor: `${currentPlaylist.themeColor}60`,
              color: currentPlaylist.themeColor,
            }}
          >
            <Music className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-mono font-bold uppercase tracking-widest"
                style={{ color: currentPlaylist.themeColor }}
              >
                Adaptive Sonic Frequency
              </span>
              <span className="text-xs text-[#FFC978] font-heading font-semibold">
                {currentPlaylist.kanji}
              </span>
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#F5F2ED]">
              {currentPlaylist.title}
            </h3>
          </div>
        </div>

        {/* Live Audio Telemetry Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#121029]/80 border border-[#B8B4D9]/20 text-xs text-[#F5F2ED]">
          {/* Animated Equalizer Waveform Bars */}
          <div className="flex items-end gap-0.5 h-3.5 w-4">
            <motion.div
              animate={{ height: ['30%', '90%', '40%', '80%', '30%'] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 rounded-full"
              style={{ backgroundColor: currentPlaylist.themeColor }}
            />
            <motion.div
              animate={{ height: ['70%', '30%', '100%', '40%', '70%'] }}
              transition={{ duration: 1.0, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 rounded-full"
              style={{ backgroundColor: currentPlaylist.themeColor }}
            />
            <motion.div
              animate={{ height: ['40%', '80%', '30%', '90%', '40%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 rounded-full"
              style={{ backgroundColor: currentPlaylist.themeColor }}
            />
          </div>
          <span className="font-mono text-[11px] text-[#B8B4D9]">
            {moodData.soundscape.split(' ')[0]} Harmonic Stream
          </span>
        </div>
      </div>

      <p className="text-xs text-[#B8B4D9] mb-4 leading-relaxed">
        {currentPlaylist.subtitle}. Tuned to match your verified biometric emotional state.
      </p>

      {/* Spotify Custom On-Brand Frame Embed */}
      <div
        className="relative w-full rounded-2xl overflow-hidden border transition-all duration-300 bg-[#0E0C20]"
        style={{
          borderColor: `${currentPlaylist.themeColor}35`,
          boxShadow: `inset 0 0 20px rgba(10,8,28,0.8), 0 8px 25px rgba(10,8,28,0.7)`,
        }}
      >
        <iframe
          src={`https://open.spotify.com/embed/playlist/${currentPlaylist.id}?utm_source=generator&theme=0`}
          width="100%"
          height="152"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title={`Spotify Soundscape for ${mood}`}
          className="rounded-2xl"
        />
      </div>

      {/* Footer Info & Quick Link */}
      <div className="mt-4 pt-3 border-t border-[#B8B4D9]/10 flex items-center justify-between text-xs text-[#B8B4D9]">
        <span className="flex items-center gap-1.5 text-[#6FBFC4]">
          <Headphones className="w-3.5 h-3.5" />
          <span>Optimal with noise-canceling headphones</span>
        </span>

        <a
          href={`https://open.spotify.com/playlist/${currentPlaylist.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline flex items-center gap-1 font-semibold transition-colors"
          style={{ color: currentPlaylist.themeColor }}
        >
          <span>Open in Spotify App</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
