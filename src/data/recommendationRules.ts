import type { MoodType } from '../types';
import type { MoodRecommendationGroup } from '../types/recommendations';

export const MOOD_RECOMMENDATIONS: Record<MoodType, MoodRecommendationGroup> = {
  sad: {
    mood: 'sad',
    headline: 'Gentle Harbor for Introspective Rain',
    subheadline:
      'Allow yourself to feel softly held. Your nervous system is seeking tenderness, slow rhythmic pacing, and warmth.',
    kanjiTheme: '慈愛 · Compassionate Sanctuary',
    recommendations: [
      {
        id: 'sad-breath-478',
        category: 'somatic',
        title: '4-7-8 Parasympathetic Downshift',
        subtitle: 'Vagus Nerve Reset',
        description:
          'Inhale warm starlight for 4s, gently hold for 7s, and release heavy chest tension on an 8s exhale. Calms cortisol response in under 2 minutes.',
        kanji: '深呼吸',
        tag: 'Somatic Reset',
        durationText: '2 mins',
        accentColor: '#6FBFC4',
        action: {
          label: 'Start Breathing Guide',
          type: 'breathing',
          targetId: 'breathing-478',
        },
        quote: {
          text: 'The darkest night is often the bridge to the brightest dawn.',
          author: 'Makoto Shinkai',
        },
      },
      {
        id: 'sad-journal-tender',
        category: 'cognitive',
        title: 'Tender Self-Inquiry Inscription',
        subtitle: 'Reflective Journaling',
        description:
          'Prompt: "What is one gentle boundary or kindness I can give myself right now?" Write one sentence to anchor your heart.',
        kanji: '日記',
        tag: 'Journal Prompt',
        durationText: '3 mins',
        accentColor: '#FFC978',
        action: {
          label: 'Write a Journal Entry',
          type: 'journal',
          targetId: 'journal-prompt-sad',
        },
      },
      {
        id: 'sad-sonic-rain',
        category: 'sonic',
        title: 'Midnight Rain & Soft Shinkai Piano',
        subtitle: '432Hz Healing Frequency',
        description:
          'Warm acoustic piano layered with gentle binaural raindrops designed to cradle heavy emotions into peaceful release.',
        kanji: '音響',
        tag: 'Soundscape',
        durationText: '5 mins',
        accentColor: '#4A5B8C',
        action: {
          label: 'Immerse in Rain Lofi',
          type: 'soundscape',
          targetId: 'rain-lofi',
        },
      },
    ],
  },

  energetic: {
    mood: 'energetic',
    headline: 'Channeling The Starlight Surge',
    subheadline:
      'High arousal detected. Direct this vibrant voltage into grounded creative flow or soothe overstimulated circuits.',
    kanjiTheme: '情熱 · High Resonance',
    recommendations: [
      {
        id: 'energetic-box-breath',
        category: 'somatic',
        title: 'Box Breathing Grounding Circuit',
        subtitle: '4-4-4-4 Tactical Equilibrium',
        description:
          'Inhale 4s, hold 4s, exhale 4s, pause 4s. Instantly stabilizes adrenaline surges while retaining razor-sharp mental focus.',
        kanji: '調息',
        tag: 'Breath Pacing',
        durationText: '2 mins',
        accentColor: '#C25AE0',
        action: {
          label: 'Start Box Breathing',
          type: 'breathing',
          targetId: 'breathing-box',
        },
      },
      {
        id: 'energetic-step-away',
        category: 'mindful',
        title: 'Horizon Gaze & Sensory Grounding',
        subtitle: '5-4-3-2-1 Reset',
        description:
          'Step back from screens. Look at the farthest horizon point for 60 seconds to release ocular strain and lower sympathetic tone.',
        kanji: '遠見',
        tag: 'Micro-Break',
        durationText: '1 min',
        accentColor: '#6FBFC4',
        action: {
          label: 'Practice Grounding',
          type: 'grounding',
          targetId: 'grounding-54321',
        },
      },
      {
        id: 'energetic-sprint-focus',
        category: 'cognitive',
        title: 'High-Vibe Creative Sprint',
        subtitle: 'Momentum Capture',
        description:
          'Capture your peak inspiration right now. Write down your top 3 high-impact ideas before the energetic crest recedes.',
        kanji: '集注',
        tag: 'Focus Journal',
        durationText: '5 mins',
        accentColor: '#FFC978',
        action: {
          label: 'Open Sprint Log',
          type: 'journal',
          targetId: 'journal-sprint',
        },
      },
    ],
  },

  happy: {
    mood: 'happy',
    headline: 'Radiant Resonance Amplification',
    subheadline:
      'Your emotional frequency is glowing bright. Anchor this luminous joy into a lasting constellation in your memory.',
    kanjiTheme: '歓喜 · Celestial Radiance',
    recommendations: [
      {
        id: 'happy-journal-anchor',
        category: 'cognitive',
        title: 'Gratitude Starlight Inscription',
        subtitle: 'Savoring The Spark',
        description:
          'Prompt: "What specific glance, victory, or realization made your spirit glow today?" Anchor this feeling for future rainy days.',
        kanji: '感謝',
        tag: 'Gratitude Anchor',
        durationText: '3 mins',
        accentColor: '#FF9E7D',
        action: {
          label: 'Write Gratitude Entry',
          type: 'journal',
          targetId: 'journal-gratitude',
        },
        quote: {
          text: 'Treasuring this moment is how we build constellations of hope.',
          author: 'Studio Ghibli Archive',
        },
      },
      {
        id: 'happy-sonic-groove',
        category: 'sonic',
        title: 'Summer Fireflies & Euphoric Lofi',
        subtitle: '528Hz Transformation Tone',
        description:
          'Upbeat Japanese lofi hip-hop infused with warm organic kalimba and glowing campfire crackle to sustain your joyful stride.',
        kanji: '躍動',
        tag: 'Upbeat Soundscape',
        durationText: '4 mins',
        accentColor: '#FFC978',
        action: {
          label: 'Play Euphoric Track',
          type: 'soundscape',
          targetId: 'soundscape-happy',
        },
      },
      {
        id: 'happy-kindness-nudge',
        category: 'mindful',
        title: 'Radiate Light — Ripple Shift',
        subtitle: 'Social Micro-Action',
        description:
          'Send a spontaneous two-word appreciation message to a friend, mentor, or loved one while your energy is overflowing.',
        kanji: '共鳴',
        tag: 'Micro-Action',
        durationText: '1 min',
        accentColor: '#C25AE0',
        action: {
          label: 'Complete Ripple Shift',
          type: 'reflection',
          targetId: 'ripple-shift',
        },
      },
    ],
  },

  calm: {
    mood: 'calm',
    headline: 'Still Waters Under The Infinite Sky',
    subheadline:
      'Grounded equilibrium detected. Deepen your serenity with theta frequencies and contemplative stillness.',
    kanjiTheme: '静寂 · Deep Stillness',
    recommendations: [
      {
        id: 'calm-sonic-theta',
        category: 'sonic',
        title: 'Binaural Theta Ocean (432Hz)',
        subtitle: 'Subtle Harmonic Drift',
        description:
          'Gentle tide soundscapes interlaced with 6Hz binaural theta pulses to support deep restorative meditation or focused creative writing.',
        kanji: '波音',
        tag: 'Binaural Waves',
        durationText: '5 mins',
        accentColor: '#6FBFC4',
        action: {
          label: 'Listen to Ocean Drift',
          type: 'soundscape',
          targetId: 'soundscape-calm',
        },
      },
      {
        id: 'calm-meditation-timer',
        category: 'mindful',
        title: 'Ambient Starlight Meditation',
        subtitle: 'Uncluttered Awareness',
        description:
          'Set a soft 3-minute silence timer. Rest your gaze on the drifting fireflies and watch thoughts float like distant comets.',
        kanji: '瞑想',
        tag: 'Meditation',
        durationText: '3 mins',
        accentColor: '#FFC978',
        action: {
          label: 'Start Meditation Timer',
          type: 'meditation',
          targetId: 'meditation-calm',
        },
      },
      {
        id: 'calm-journal-stillness',
        category: 'cognitive',
        title: 'Clarity Reflection Prompt',
        subtitle: 'Mindful Observation',
        description:
          'Prompt: "In the stillness of right now, what truth feels simplest and clearest?"',
        kanji: '省察',
        tag: 'Reflection',
        durationText: '2 mins',
        accentColor: '#8B87B0',
        action: {
          label: 'Write Reflection',
          type: 'journal',
          targetId: 'journal-calm',
        },
      },
    ],
  },

  neutral: {
    mood: 'neutral',
    headline: 'Clear Canvas Before The Stars Awaken',
    subheadline:
      'Equilibrium restored. A peaceful zero-point to consciously choose your direction, tune your senses, or gently explore.',
    kanjiTheme: '調和 · Pure Balance',
    recommendations: [
      {
        id: 'neutral-body-scan',
        category: 'somatic',
        title: 'Micro Body Scan Alignment',
        subtitle: 'Posture & Jaw Softening',
        description:
          'Drop your shoulders 2 inches, un-clench your jaw, and let your tongue rest on the roof of your mouth. Feel the effortless weight of gravity.',
        kanji: '身体',
        tag: 'Somatic Scan',
        durationText: '1 min',
        accentColor: '#8B87B0',
        action: {
          label: 'Practice Body Scan',
          type: 'grounding',
          targetId: 'grounding-body-scan',
        },
      },
      {
        id: 'neutral-chimes-ambient',
        category: 'sonic',
        title: 'Bamboo Wind Chimes in Forest Mist',
        subtitle: 'Subtle Natural Harmony',
        description:
          'Delicate high-frequency wind chime tones designed to gently stimulate neural clarity without cognitive fatigue.',
        kanji: '風鈴',
        tag: 'Ambient Audio',
        durationText: '4 mins',
        accentColor: '#6FBFC4',
        action: {
          label: 'Play Wind Chimes',
          type: 'soundscape',
          targetId: 'soundscape-neutral',
        },
      },
      {
        id: 'neutral-journal-intent',
        category: 'cognitive',
        title: 'Intentional Direction Setting',
        subtitle: 'Intention Setting',
        description:
          'Prompt: "If the next hour had a single theme, what energy would serve me best?"',
        kanji: '志向',
        tag: 'Intention Log',
        durationText: '2 mins',
        accentColor: '#FFC978',
        action: {
          label: 'Set Hour Intention',
          type: 'journal',
          targetId: 'journal-intent',
        },
      },
    ],
  },
};
