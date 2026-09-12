import type { RecommendationMode } from '../utils/valenceArousal';
import type {
  IntensityTier,
  RecommendationItem,
  ModeMetadata,
} from '../types/recommendations';

export const MODE_METADATA: Record<RecommendationMode, ModeMetadata> = {
  amplify: {
    mode: 'amplify',
    headline: 'Radiant Momentum & Creative Surge',
    subheadline:
      'High positive energy detected. Expand your creative flow, savor this peak frequency, and radiate your spark.',
    themeTag: 'Peak Creative Flow',
    accentColor: '#FFC978',
  },
  sustain: {
    mode: 'sustain',
    headline: 'Still Waters of Deep Contentment',
    subheadline:
      'Grounded peace and serenity detected. Rest in this harmonious equilibrium and let your calm linger like twilight.',
    themeTag: 'Enduring Serenity',
    accentColor: '#6FBFC4',
  },
  regulate: {
    mode: 'regulate',
    headline: 'Grounding the Storm & Releasing Tension',
    subheadline:
      'Elevated tension or acute stress detected. Let us gently slow the pulse, ground the nervous system, and clear the air.',
    themeTag: 'Parasympathetic Reset',
    accentColor: '#C25AE0',
  },
  support: {
    mode: 'support',
    headline: 'Gentle Harbor for Introspective Rain',
    subheadline:
      'Tender lows or emotional fatigue detected. You are safe to rest here with slow rhythmic pacing, warmth, and gentle holding space.',
    themeTag: 'Compassionate Sanctuary',
    accentColor: '#4A5B8C',
  },
};

/**
 * Multi-Tier Recommendation Matrix
 * Mode -> Tier (low <0.6, med 0.6–0.85, high >0.85) -> ShiftAction[]
 */
export const MODE_RECOMMENDATIONS: Record<
  RecommendationMode,
  Record<IntensityTier, RecommendationItem[]>
> = {
  amplify: {
    low: [
      {
        id: 'happy-sonic-groove',
        category: 'sonic',
        title: 'Summer Fireflies & Euphoric Lofi',
        subtitle: '528Hz Transformation Tone',
        description:
          'Upbeat lofi hip-hop infused with warm acoustic kalimba and glowing campfire crackle to sustain your joyful stride.',
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
        tag: 'Micro-Action',
        durationText: '1 min',
        accentColor: '#C25AE0',
        action: {
          label: 'Complete Ripple Shift',
          type: 'reflection',
          targetId: 'ripple-shift',
        },
      },
      {
        id: 'neutral-journal-intent',
        category: 'cognitive',
        title: 'Intentional Momentum Setting',
        subtitle: 'Direction Setting',
        description:
          'Prompt: "How can I channel this bright, emerging momentum into something that brings me genuine fulfillment?"',
        tag: 'Intention Log',
        durationText: '2 mins',
        accentColor: '#FFC978',
        action: {
          label: 'Set Intention',
          type: 'journal',
          targetId: 'journal-intent',
        },
      },
    ],
    med: [
      {
        id: 'happy-journal-anchor',
        category: 'cognitive',
        title: 'Gratitude Starlight Inscription',
        subtitle: 'Savoring The Spark',
        description:
          'Prompt: "What specific glance, victory, or realization made your spirit glow today?" Anchor this feeling for future rainy days.',
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
          'Upbeat lofi hip-hop infused with warm organic kalimba and glowing campfire crackle to sustain your joyful stride.',
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
        id: 'energetic-sprint-focus',
        category: 'cognitive',
        title: 'High-Vibe Creative Sprint',
        subtitle: 'Momentum Capture',
        description:
          'Capture your peak inspiration right now. Write down your top 3 high-impact ideas before the energetic crest recedes.',
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
    high: [
      {
        id: 'energetic-sprint-focus',
        category: 'cognitive',
        title: 'Peak Starlight Creative Sprint',
        subtitle: 'Full Momentum Channeling',
        description:
          'Capture your peak creative electrical current. Inscribe your boldest visions while your neural circuits are fired up and glowing.',
        tag: 'Peak Sprint',
        durationText: '5 mins',
        accentColor: '#FFC978',
        action: {
          label: 'Open Creative Sprint',
          type: 'journal',
          targetId: 'journal-sprint',
        },
      },
      {
        id: 'energetic-box-breath',
        category: 'somatic',
        title: '4-4-4-4 Cosmic Breath Circuit',
        subtitle: 'Rhythmic Capacity Mastery',
        description:
          'Inhale 4s, hold 4s, exhale 4s, pause 4s. Savor and master this high-energy flow with clean, expansive lung stamina.',
        tag: 'Breath Mastery',
        durationText: '2 mins',
        accentColor: '#C25AE0',
        action: {
          label: 'Start Breath Mastery',
          type: 'breathing',
          targetId: 'breathing-box',
        },
      },
      {
        id: 'happy-kindness-nudge',
        category: 'mindful',
        title: 'Radiate Light — Ripple Shift',
        subtitle: 'Social Micro-Action',
        description:
          'Send a spontaneous appreciation message to someone who matters while your vibrant joy is at its highest altitude.',
        tag: 'Micro-Action',
        durationText: '1 min',
        accentColor: '#FF9E7D',
        action: {
          label: 'Complete Ripple Shift',
          type: 'reflection',
          targetId: 'ripple-shift',
        },
      },
    ],
  },

  sustain: {
    low: [
      {
        id: 'neutral-chimes-ambient',
        category: 'sonic',
        title: 'Bamboo Wind Chimes in Forest Mist',
        subtitle: 'Subtle Natural Harmony',
        description:
          'Delicate high-frequency wind chime tones designed to gently cradle your quiet contentment without cognitive fatigue.',
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
        id: 'calm-journal-stillness',
        category: 'cognitive',
        title: 'Clarity Reflection Prompt',
        subtitle: 'Mindful Observation',
        description:
          'Prompt: "In the stillness of right now, what subtle beauty feels most present?" Savor this unhurried peace.',
        tag: 'Reflection',
        durationText: '2 mins',
        accentColor: '#8B87B0',
        action: {
          label: 'Write Reflection',
          type: 'journal',
          targetId: 'journal-calm',
        },
      },
      {
        id: 'neutral-body-scan',
        category: 'somatic',
        title: 'Micro Body Ease Alignment',
        subtitle: 'Gentle Presence',
        description:
          'Soften your shoulders, let your breathing stay effortlessly slow, and rest in this peaceful equilibrium.',
        tag: 'Somatic Ease',
        durationText: '1 min',
        accentColor: '#8B87B0',
        action: {
          label: 'Practice Body Ease',
          type: 'grounding',
          targetId: 'grounding-body-scan',
        },
      },
    ],
    med: [
      {
        id: 'calm-sonic-theta',
        category: 'sonic',
        title: 'Binaural Theta Ocean (432Hz)',
        subtitle: 'Subtle Harmonic Drift',
        description:
          'Gentle tide soundscapes interlaced with 6Hz binaural theta pulses to deepen and extend your restorative serenity.',
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
          'Set a soft 3-minute silence timer. Rest your gaze on the drifting fireflies and savor the spaciousness of your awareness.',
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
    high: [
      {
        id: 'calm-meditation-timer',
        category: 'mindful',
        title: 'Deep Starlight Stillness Sanctuary',
        subtitle: 'Profound Inner Peace',
        description:
          'Inhabit the vast cosmic quiet. Let the gentle glow of your stillness recharge your whole parasympathetic foundation.',
        tag: 'Deep Sanctuary',
        durationText: '5 mins',
        accentColor: '#6FBFC4',
        action: {
          label: 'Enter Stillness Realm',
          type: 'meditation',
          targetId: 'meditation-calm',
        },
      },
      {
        id: 'calm-sonic-theta',
        category: 'sonic',
        title: 'Binaural Theta Ocean (432Hz)',
        subtitle: 'Subtle Harmonic Drift',
        description:
          'Continuous 432Hz ocean waves and soothing harmonic tones to sustain your serene equilibrium throughout the day.',
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
        id: 'happy-journal-anchor',
        category: 'cognitive',
        title: 'Serene Starlight Inscription',
        subtitle: 'Anchoring Quiet Joy',
        description:
          'Prompt: "What does this deep peace feel like in my chest and mind?" Inscribe this serene anchor into the sky.',
        tag: 'Serenity Log',
        durationText: '3 mins',
        accentColor: '#FFC978',
        action: {
          label: 'Inscribe Serenity',
          type: 'journal',
          targetId: 'journal-gratitude',
        },
      },
    ],
  },

  regulate: {
    low: [
      {
        id: 'energetic-step-away',
        category: 'mindful',
        title: 'Horizon Gaze & Sensory Grounding',
        subtitle: '5-4-3-2-1 Reset',
        description:
          'Step back from screens. Look at the farthest horizon point for 60 seconds to release ocular strain and lower sympathetic tone.',
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
        id: 'neutral-body-scan',
        category: 'somatic',
        title: 'Micro Body Scan Alignment',
        subtitle: 'Posture & Jaw Softening',
        description:
          'Drop your shoulders 2 inches, un-clench your jaw, and let your tongue rest on the roof of your mouth. Feel the ground beneath you.',
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
        id: 'sad-sonic-rain',
        category: 'sonic',
        title: 'Midnight Rain & Soft Shinkai Piano',
        subtitle: '432Hz Soothing Frequency',
        description:
          'Warm acoustic piano layered with gentle binaural raindrops designed to soften sharp adrenaline spikes into quiet release.',
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
    med: [
      {
        id: 'energetic-box-breath',
        category: 'somatic',
        title: 'Box Breathing Grounding Circuit',
        subtitle: '4-4-4-4 Tactical Equilibrium',
        description:
          'Inhale 4s, hold 4s, exhale 4s, pause 4s. Instantly stabilizes adrenaline surges while retaining clear, centered mental composure.',
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
        id: 'sad-journal-tender',
        category: 'cognitive',
        title: 'Tension Decompression Inscription',
        subtitle: 'Expressive Release',
        description:
          'Prompt: "What external pressure or urgency can I safely set down for the next 30 minutes?"',
        tag: 'Release Journal',
        durationText: '3 mins',
        accentColor: '#FFC978',
        action: {
          label: 'Write Release Entry',
          type: 'journal',
          targetId: 'journal-prompt-sad',
        },
      },
    ],
    high: [
      {
        id: 'sad-breath-478',
        category: 'somatic',
        title: '4-7-8 Parasympathetic Downshift',
        subtitle: 'Vagus Nerve Reset',
        description:
          'Inhale warm starlight for 4s, gently hold for 7s, and release heavy sympathetic charge on an 8s exhale. Calms acute cortisol in under 2 minutes.',
        tag: 'Somatic Reset',
        durationText: '2 mins',
        accentColor: '#6FBFC4',
        action: {
          label: 'Start Breathing Guide',
          type: 'breathing',
          targetId: 'breathing-478',
        },
        quote: {
          text: 'The storm passes; the night sky remains vast and clear.',
          author: 'Vynura Insights',
        },
      },
      {
        id: 'energetic-box-breath',
        category: 'somatic',
        title: 'Box Breathing Grounding Circuit',
        subtitle: '4-4-4-4 Tactical Equilibrium',
        description:
          'Inhale 4s, hold 4s, exhale 4s, pause 4s. Instantly stabilizes heart rate volatility and grounds acute emotional intensity.',
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
        id: 'sad-sonic-rain',
        category: 'sonic',
        title: 'Midnight Rain & Soft Shinkai Piano',
        subtitle: '432Hz Healing Frequency',
        description:
          'Warm acoustic piano layered with gentle binaural raindrops designed to ground racing thoughts into steady peace.',
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

  support: {
    low: [
      {
        id: 'neutral-body-scan',
        category: 'somatic',
        title: 'Gentle Body Scan & Warmth',
        subtitle: 'Shoulder & Chest Softening',
        description:
          'Drop your shoulders, wrap a hand over your heart, and take one unhurried breath. You do not have to perform right now.',
        tag: 'Somatic Care',
        durationText: '1 min',
        accentColor: '#8B87B0',
        action: {
          label: 'Practice Body Scan',
          type: 'grounding',
          targetId: 'grounding-body-scan',
        },
      },
      {
        id: 'sad-sonic-rain',
        category: 'sonic',
        title: 'Midnight Rain & Soft Shinkai Piano',
        subtitle: '432Hz Healing Frequency',
        description:
          'Warm acoustic piano layered with gentle binaural raindrops designed to cradle heavy emotions into peaceful release.',
        tag: 'Soundscape',
        durationText: '5 mins',
        accentColor: '#4A5B8C',
        action: {
          label: 'Immerse in Rain Lofi',
          type: 'soundscape',
          targetId: 'rain-lofi',
        },
      },
      {
        id: 'calm-journal-stillness',
        category: 'cognitive',
        title: 'Soft Kindness Inscription',
        subtitle: 'Gentle Holding Space',
        description:
          'Prompt: "What is one gentle word of patience I can offer myself in this quiet hour?"',
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
    med: [
      {
        id: 'sad-breath-478',
        category: 'somatic',
        title: '4-7-8 Parasympathetic Downshift',
        subtitle: 'Vagus Nerve Reset',
        description:
          'Inhale warm starlight for 4s, gently hold for 7s, and release heavy chest tension on an 8s exhale. Softens emotional heaviness.',
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
    high: [
      {
        id: 'sad-breath-478',
        category: 'somatic',
        title: '4-7-8 Deep Parasympathetic Downshift',
        subtitle: 'Vagus Nerve Reset',
        description:
          'Inhale warm starlight for 4s, hold for 7s, and release all sorrow and fatigue on an 8s exhale. Full vagal calming support.',
        tag: 'Somatic Reset',
        durationText: '2 mins',
        accentColor: '#6FBFC4',
        action: {
          label: 'Start Breathing Guide',
          type: 'breathing',
          targetId: 'breathing-478',
        },
        quote: {
          text: 'Tears are stardust returning home. Give your heart time to rest.',
          author: 'Celestial Sanctuary',
        },
      },
      {
        id: 'sad-journal-tender',
        category: 'cognitive',
        title: 'Deep Self-Compassion Inscription',
        subtitle: 'Tender Sanctuary',
        description:
          'Prompt: "I permit myself to feel tired, tender, or imperfect. What do I need to let go of tonight?"',
        tag: 'Compassion Log',
        durationText: '3 mins',
        accentColor: '#FFC978',
        action: {
          label: 'Write Compassion Entry',
          type: 'journal',
          targetId: 'journal-prompt-sad',
        },
      },
      {
        id: 'calm-meditation-timer',
        category: 'mindful',
        title: 'Healing Sanctuary Meditation',
        subtitle: 'Restorative Holding Space',
        description:
          'Rest in a gentle, warm starlight embrace. Let the soft ambient visualizer hold space for whatever is heavy inside.',
        tag: 'Healing Space',
        durationText: '5 mins',
        accentColor: '#6FBFC4',
        action: {
          label: 'Enter Healing Realm',
          type: 'meditation',
          targetId: 'meditation-calm',
        },
      },
    ],
  },
};
