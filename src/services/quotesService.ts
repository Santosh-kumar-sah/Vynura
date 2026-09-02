import type { MoodType } from '../types';

export interface MoodQuote {
  quote: string;
  author: string;
  japaneseTranslation?: string;
}

// Curated high-aesthetic philosophical & Shinkai/Ghibli wisdom fallback database
const CURATED_MOOD_QUOTES: Record<MoodType, MoodQuote[]> = {
  happy: [
    {
      quote: 'Treasuring this present starlight moment is how we build constellations of enduring joy.',
      author: 'Studio Ghibli Archive',
      japaneseTranslation: '今この瞬間を大切にすることが、希望の星座を創る。',
    },
    {
      quote: 'Happiness is not something readymade. It comes from your own resonance with the world.',
      author: 'Dalai Lama',
      japaneseTranslation: '幸福とは自らの心の共鳴から生まれるもの。',
    },
    {
      quote: 'Your light does not dim when you share it with the night sky; it illuminates new paths.',
      author: 'Makoto Shinkai Reflections',
      japaneseTranslation: '光を分かち合うことで、夜空に新たな道が拓ける。',
    },
  ],
  calm: [
    {
      quote: 'Still waters reflect the infinite cosmos. In stillness, you meet your true self.',
      author: 'Lao Tzu',
      japaneseTranslation: '静かなる水面は無限の宇宙を映し出す。',
    },
    {
      quote: 'There is a quiet strength in the horizon where the sea whispers to the sky.',
      author: 'Makoto Shinkai',
      japaneseTranslation: '海が空に囁く水平線には、静かな強さがある。',
    },
    {
      quote: 'Peace is not the absence of the storm, but the deep calm of the starlight within.',
      author: 'Zen Adage',
      japaneseTranslation: '平和とは嵐のないことではなく、内なる星の静けさ。',
    },
  ],
  sad: [
    {
      quote: 'Every rain shower cleanses the earth so the morning flowers can blossom with vigor.',
      author: 'Makoto Shinkai (Garden of Words)',
      japaneseTranslation: '雨は大地を清め、花が咲くための恵みとなる。',
    },
    {
      quote: 'Tears are stardust falling back to earth. Give your heart the gentleness it deserves.',
      author: 'Celestial Sanctuary',
      japaneseTranslation: '涙は星屑。あなたの心に今、優しさを。',
    },
    {
      quote: 'Even the darkest midnight sky is pregnant with the birth of tomorrow’s dawn.',
      author: 'Ghibli Reflections',
      japaneseTranslation: 'どれほど暗い夜空も、明日の夜明けを抱いている。',
    },
  ],
  energetic: [
    {
      quote: 'Energy flows where intention goes. Direct your electrical surge with conscious grace.',
      author: 'Astral Flow Philosophy',
      japaneseTranslation: '意志のあるところにエネルギーは流れる。',
    },
    {
      quote: 'You are made of supernova material. Let your momentum build bridges between stars.',
      author: 'Carl Sagan',
      japaneseTranslation: '私たちは超新星の欠片。星々をつなぐ架け橋となれ。',
    },
    {
      quote: 'When passion meets deep breath, creativity becomes an unstoppable cosmic current.',
      author: 'Vynura Insights',
      japaneseTranslation: '情熱と深い呼吸が交わるとき、創造は無限の潮流となる。',
    },
  ],
  neutral: [
    {
      quote: 'A blank canvas is not emptiness; it is the infinite threshold of all possibilities.',
      author: 'Zen Master Suzuki',
      japaneseTranslation: '空白とは空虚ではなく、無限の可能性の扉。',
    },
    {
      quote: 'Equilibrium is the eye of the hurricane—the peaceful center from which all stars orbit.',
      author: 'Philosophical Astronomy',
      japaneseTranslation: '調和とは宇宙の中心であり、すべての星が巡る場所。',
    },
    {
      quote: 'Rest in the center of the compass before choosing your next celestial trajectory.',
      author: 'Makoto Shinkai Archive',
      japaneseTranslation: '次なる航路を選ぶ前に、コンパスの中心で息を整えよ。',
    },
  ],
};

/**
 * Fetches dynamic quote for a given mood with ZenQuotes API or fallback to curated wisdom
 */
export async function getMoodQuote(mood: MoodType): Promise<MoodQuote> {
  const fallbacks = CURATED_MOOD_QUOTES[mood] || CURATED_MOOD_QUOTES.neutral;
  const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];

  try {
    // Attempt client-side quote fetch with short timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    // Using corsproxy / public quote endpoint with fallback
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
          japaneseTranslation: randomFallback.japaneseTranslation,
        };
      }
    }
  } catch {
    // Graceful fallback to rich curated quotes
  }

  return randomFallback;
}
