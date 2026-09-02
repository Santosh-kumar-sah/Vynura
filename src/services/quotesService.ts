import type { MoodType } from '../types';

export interface MoodQuote {
  quote: string;
  author: string;
}

// Curated philosophical & celestial wisdom database
const CURATED_MOOD_QUOTES: Record<MoodType, MoodQuote[]> = {
  happy: [
    {
      quote: 'Treasuring this present starlight moment is how we build constellations of enduring joy.',
      author: 'Sanctuary Archive',
    },
    {
      quote: 'Happiness is not something readymade. It comes from your own resonance with the world.',
      author: 'Dalai Lama',
    },
    {
      quote: 'Your light does not dim when you share it with the night sky; it illuminates new paths.',
      author: 'Celestial Reflections',
    },
  ],
  calm: [
    {
      quote: 'Still waters reflect the infinite cosmos. In stillness, you meet your true self.',
      author: 'Lao Tzu',
    },
    {
      quote: 'There is a quiet strength in the horizon where the sea whispers to the sky.',
      author: 'Horizon Reflections',
    },
    {
      quote: 'Peace is not the absence of the storm, but the deep calm of the starlight within.',
      author: 'Wisdom Adage',
    },
  ],
  sad: [
    {
      quote: 'Every rain shower cleanses the earth so the morning flowers can blossom with vigor.',
      author: 'Solitude Reflections',
    },
    {
      quote: 'Tears are stardust falling back to earth. Give your heart the gentleness it deserves.',
      author: 'Celestial Sanctuary',
    },
    {
      quote: 'Even the darkest midnight sky is pregnant with the birth of tomorrow’s dawn.',
      author: 'Sky Archive',
    },
  ],
  energetic: [
    {
      quote: 'Energy flows where intention goes. Direct your electrical surge with conscious grace.',
      author: 'Astral Flow Philosophy',
    },
    {
      quote: 'You are made of supernova material. Let your momentum build bridges between stars.',
      author: 'Carl Sagan',
    },
    {
      quote: 'When passion meets deep breath, creativity becomes an unstoppable cosmic current.',
      author: 'Vynura Insights',
    },
  ],
  neutral: [
    {
      quote: 'A blank canvas is not emptiness; it is the infinite threshold of all possibilities.',
      author: 'Zen Master Suzuki',
    },
    {
      quote: 'Equilibrium is the eye of the hurricane—the peaceful center from which all stars orbit.',
      author: 'Philosophical Astronomy',
    },
    {
      quote: 'Rest in the center of the compass before choosing your next celestial trajectory.',
      author: 'Sanctuary Archive',
    },
  ],
};

/**
 * Fetches dynamic quote for a given mood with API or fallback to curated wisdom
 */
export async function getMoodQuote(mood: MoodType): Promise<MoodQuote> {
  const fallbacks = CURATED_MOOD_QUOTES[mood] || CURATED_MOOD_QUOTES.neutral;
  const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const res = await fetch('https://dummyjson.com/quotes/random', {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.quote && data.author) {
        return {
          quote: data.quote,
          author: data.author,
        };
      }
    }
  } catch {
    // Fallback to rich curated quotes
  }

  return randomFallback;
}
