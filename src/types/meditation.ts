export type MeditationCategoryId =
  | 'starlight'
  | 'joy'
  | 'calm'
  | 'focus'
  | 'sleep'
  | 'stress'
  | 'gratitude'
  | 'healing';

export interface MeditationCategoryConfig {
  id: MeditationCategoryId;
  name: string;
  subtitle: string;
  tagline: string;
  emotion: string;
  emotionalGoal: string;
  colors: {
    primary: string;
    secondary: string;
    ambientGlow: string;
    backgroundFrom: string;
    backgroundVia: string;
    backgroundTo: string;
    textAccent: string;
    badgeBg: string;
  };
  visualMetaphor: string;
  breathingPaceSeconds: number;
  completionMessage: string;
  completionSubtitle: string;
  soundscapeType: 'starlight-drone' | 'warm-sunrise' | 'ocean-mist' | 'focus-binaural' | 'sleep-pink' | 'release-wind' | 'amber-resonance' | 'healing-crystal';
}

export const MEDITATION_CATEGORIES: Record<MeditationCategoryId, MeditationCategoryConfig> = {
  starlight: {
    id: 'starlight',
    name: 'Ambient Starlight',
    subtitle: 'Uncluttered Awareness',
    tagline: 'Sit quietly. Let your attention become spacious.',
    emotion: 'Stillness · Spaciousness · Awareness',
    emotionalGoal: 'Silence, spaciousness, and unhurried inner stillness.',
    colors: {
      primary: '#FFC978',
      secondary: '#6FBFC4',
      ambientGlow: 'rgba(255, 201, 120, 0.35)',
      backgroundFrom: '#0A081C',
      backgroundVia: '#070614',
      backgroundTo: '#03020A',
      textAccent: '#FFC978',
      badgeBg: 'rgba(255, 201, 120, 0.15)',
    },
    visualMetaphor: 'Meditating monk in lotus posture under deep black night sky with soft celestial glow behind head and twinkling stars.',
    breathingPaceSeconds: 8,
    completionMessage: 'Meditation Complete',
    completionSubtitle: 'Take one slow breath before returning to the world.',
    soundscapeType: 'starlight-drone',
  },
  joy: {
    id: 'joy',
    name: 'Joy',
    subtitle: 'Lightness & Positive Energy',
    tagline: 'Open your chest to warmth, lightness, and gentle optimism.',
    emotion: 'Happiness · Gratitude · Warmth · Optimism',
    emotionalGoal: 'Everything feels lighter and brighter.',
    colors: {
      primary: '#FFA96B',
      secondary: '#FFD166',
      ambientGlow: 'rgba(255, 169, 107, 0.4)',
      backgroundFrom: '#2B1429',
      backgroundVia: '#1E0C1F',
      backgroundTo: '#0E0611',
      textAccent: '#FFD166',
      badgeBg: 'rgba(255, 169, 107, 0.18)',
    },
    visualMetaphor: 'Warm sunrise environment: large soft sun rising from horizon, warm golden-orange-pink sky, soft clouds, gentle light rays, and floating upward particles.',
    breathingPaceSeconds: 7,
    completionMessage: 'Joy Embraced',
    completionSubtitle: 'Carry this warm lightness gently in your heart today.',
    soundscapeType: 'warm-sunrise',
  },
  calm: {
    id: 'calm',
    name: 'Calm',
    subtitle: 'Deep Relaxation',
    tagline: 'Settle into safe, quiet waters and nervous-system ease.',
    emotion: 'Relaxation · Safety · Nervous-System Calm',
    emotionalGoal: 'Deep parasympathetic relaxation and quiet water stillness.',
    colors: {
      primary: '#6FBFC4',
      secondary: '#4A90E2',
      ambientGlow: 'rgba(111, 191, 196, 0.35)',
      backgroundFrom: '#081C26',
      backgroundVia: '#05121B',
      backgroundTo: '#02090F',
      textAccent: '#6FBFC4',
      badgeBg: 'rgba(111, 191, 196, 0.15)',
    },
    visualMetaphor: 'Minimal peaceful water scene: calm dark-blue/teal water, soft moonlight reflection, gentle water ripples, and drifting night mist.',
    breathingPaceSeconds: 9,
    completionMessage: 'Peace Restored',
    completionSubtitle: 'Your nervous system has settled into quiet stillness.',
    soundscapeType: 'ocean-mist',
  },
  focus: {
    id: 'focus',
    name: 'Focus',
    subtitle: 'Mental Clarity',
    tagline: 'One subject. One point of attention. Zero distractions.',
    emotion: 'Concentration · Discipline · Mental Sharpness',
    emotionalGoal: 'One point. One thought. Complete focus.',
    colors: {
      primary: '#8A99FF',
      secondary: '#5E72EB',
      ambientGlow: 'rgba(138, 153, 255, 0.35)',
      backgroundFrom: '#0D1127',
      backgroundVia: '#080B1B',
      backgroundTo: '#04060F',
      textAccent: '#A3B1FF',
      badgeBg: 'rgba(138, 153, 255, 0.15)',
    },
    visualMetaphor: 'Abstract single glowing point: dark navy/black background, central luminous orb with breathing pulse, subtle concentric rings, lots of empty space.',
    breathingPaceSeconds: 6,
    completionMessage: 'Clarity Achieved',
    completionSubtitle: 'Your mind is centered, sharp, and undisturbed.',
    soundscapeType: 'focus-binaural',
  },
  sleep: {
    id: 'sleep',
    name: 'Sleep',
    subtitle: 'Deep Rest',
    tagline: 'Let the weight of the day dissolve into twilight tranquility.',
    emotion: 'Drowsiness · Safety · Surrender',
    emotionalGoal: 'Gradually drifting into effortless, quiet slumber.',
    colors: {
      primary: '#8874C2',
      secondary: '#4F3B78',
      ambientGlow: 'rgba(136, 116, 194, 0.25)',
      backgroundFrom: '#0B0917',
      backgroundVia: '#06050E',
      backgroundTo: '#020206',
      textAccent: '#B4A5DF',
      badgeBg: 'rgba(136, 116, 194, 0.12)',
    },
    visualMetaphor: 'Quiet nighttime sky: large soft moon, slow-moving clouds passing in front, deep twilight sky, and progressive fading into safe darkness.',
    breathingPaceSeconds: 10,
    completionMessage: 'Deep Rest',
    completionSubtitle: 'Rest gently in this safe, quiet twilight darkness.',
    soundscapeType: 'sleep-pink',
  },
  stress: {
    id: 'stress',
    name: 'Stress Relief',
    subtitle: 'Release & Letting Go',
    tagline: 'Observe tension dissolve into soft, expansive clarity.',
    emotion: 'Releasing Tension · Emotional Decompression',
    emotionalGoal: 'Tension → Release → Spaciousness ("Let it go").',
    colors: {
      primary: '#FF8A8A',
      secondary: '#69D2E7',
      ambientGlow: 'rgba(255, 138, 138, 0.3)',
      backgroundFrom: '#1E121D',
      backgroundVia: '#120E1C',
      backgroundTo: '#08060F',
      textAccent: '#FFB3B3',
      badgeBg: 'rgba(255, 138, 138, 0.15)',
    },
    visualMetaphor: 'Abstract dissolving particles: dense swirling cluster at start gradually moving outward, dispersing, and leaving clean peaceful open space.',
    breathingPaceSeconds: 8,
    completionMessage: 'Tension Released',
    completionSubtitle: 'What was heavy has dissolved into spacious peace.',
    soundscapeType: 'release-wind',
  },
  gratitude: {
    id: 'gratitude',
    name: 'Gratitude',
    subtitle: 'Warmth & Appreciation',
    tagline: 'Rest in heartfelt recognition of the goodness in your life.',
    emotion: 'Appreciation · Emotional Warmth · Contentment',
    emotionalGoal: 'Heartfelt emotional warmth and grounded appreciation.',
    colors: {
      primary: '#FFB852',
      secondary: '#E06D53',
      ambientGlow: 'rgba(255, 184, 82, 0.4)',
      backgroundFrom: '#24140D',
      backgroundVia: '#170C08',
      backgroundTo: '#0A0503',
      textAccent: '#FFD48F',
      badgeBg: 'rgba(255, 184, 82, 0.16)',
    },
    visualMetaphor: 'Warm field of golden light: hundreds of tiny soft golden lights gently floating upward with an expanding warm central glow.',
    breathingPaceSeconds: 7,
    completionMessage: 'Gratitude Welcomed',
    completionSubtitle: 'May this gentle warmth stay with you throughout your moments.',
    soundscapeType: 'amber-resonance',
  },
  healing: {
    id: 'healing',
    name: 'Healing',
    subtitle: 'Inner Peace & Recovery',
    tagline: 'Nurture your spirit with gentle, restorative kindness.',
    emotion: 'Emotional Recovery · Acceptance · Gentle Renewal',
    emotionalGoal: 'Safe, peaceful, and slowly becoming whole.',
    colors: {
      primary: '#B692FE',
      secondary: '#6BD4B8',
      ambientGlow: 'rgba(182, 146, 254, 0.35)',
      backgroundFrom: '#14142B',
      backgroundVia: '#0E1322',
      backgroundTo: '#060A13',
      textAccent: '#C9B2FF',
      badgeBg: 'rgba(182, 146, 254, 0.15)',
    },
    visualMetaphor: 'Growing soft light with organic shapes: central light source slowly growing, surrounded by slow translucent flowing organic forms.',
    breathingPaceSeconds: 8,
    completionMessage: 'Restoration Complete',
    completionSubtitle: 'You are safe, whole, and gently renewed.',
    soundscapeType: 'healing-crystal',
  },
};

export const MEDITATION_CATEGORIES_LIST: MeditationCategoryConfig[] = Object.values(MEDITATION_CATEGORIES);
