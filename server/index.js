import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Supabase client initialization
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

// In-memory fallback storage when running locally without Supabase env vars
let localMoodStore = [
  {
    id: 'entry-1',
    user_id: 'guest-user',
    mood_category: 'calm',
    confidence_score: 0.94,
    journal_text: 'Stillness before the dawn. Found deep grounding in the morning theta breathwork.',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    id: 'entry-2',
    user_id: 'guest-user',
    mood_category: 'happy',
    confidence_score: 0.88,
    journal_text: 'Radiant momentum. Felt spontaneous gratitude for sunset skies.',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    id: 'entry-3',
    user_id: 'guest-user',
    mood_category: 'energetic',
    confidence_score: 0.92,
    journal_text: 'High electrical focus. Channeled the starlight surge into creative writing.',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
  },
  {
    id: 'entry-4',
    user_id: 'guest-user',
    mood_category: 'sad',
    confidence_score: 0.79,
    journal_text: 'Gentle rainy feelings. Embraced self-compassion and 4-7-8 downshift.',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    id: 'entry-5',
    user_id: 'guest-user',
    mood_category: 'calm',
    confidence_score: 0.96,
    journal_text: 'Deep ocean tranquility. Fireflies floating outside the window.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'entry-6',
    user_id: 'guest-user',
    mood_category: 'neutral',
    confidence_score: 0.85,
    journal_text: 'Balanced equilibrium. Clear canvas ready for tomorrow.',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: 'entry-7',
    user_id: 'guest-user',
    mood_category: 'happy',
    confidence_score: 0.95,
    journal_text: 'A glowing realization. Shared warmth with people I care about.',
    created_at: new Date().toISOString(),
  },
];

// 1. Health check route
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'Vynura Celestial API',
    supabaseConnected: Boolean(supabase),
    timestamp: new Date().toISOString(),
  });
});

// 2. Fetch mood entries
app.get('/api/moods', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (supabase && token) {
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      if (userError || !userData?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userData.user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return res.json({ entries: data || [] });
    }

    // Return local store if no Supabase configured or in guest mode
    return res.json({ entries: localMoodStore });
  } catch (err) {
    console.error('Error fetching mood entries:', err);
    res.status(500).json({ error: 'Failed to fetch mood entries' });
  }
});

// 3. Create a new mood entry
app.post('/api/moods', async (req, res) => {
  try {
    const { mood_category, confidence_score, journal_text, metadata } = req.body;

    if (!mood_category || confidence_score === undefined) {
      return res.status(400).json({ error: 'Missing required mood_category or confidence_score' });
    }

    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

    if (supabase && token) {
      const { data: userData, error: userError } = await supabase.auth.getUser(token);
      if (userError || !userData?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const newEntry = {
        user_id: userData.user.id,
        mood_category,
        confidence_score,
        journal_text: journal_text || null,
        metadata: metadata || {},
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('mood_entries')
        .insert(newEntry)
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json({ entry: data });
    }

    // Guest fallback
    const guestEntry = {
      id: `entry-${Date.now()}`,
      user_id: 'guest-user',
      mood_category,
      confidence_score,
      journal_text: journal_text || '',
      created_at: new Date().toISOString(),
      metadata: metadata || {},
    };

    localMoodStore.push(guestEntry);
    return res.status(201).json({ entry: guestEntry });
  } catch (err) {
    console.error('Error creating mood entry:', err);
    res.status(500).json({ error: 'Failed to create mood entry' });
  }
});

// 4. Lightweight Analytics & Pattern Insights route
app.get('/api/insights', (req, res) => {
  const entries = localMoodStore;
  const moodCounts = entries.reduce((acc, curr) => {
    acc[curr.mood_category] = (acc[curr.mood_category] || 0) + 1;
    return acc;
  }, {});

  let dominantMood = 'calm';
  let maxCount = 0;
  for (const [mood, count] of Object.entries(moodCounts)) {
    if (count > maxCount) {
      maxCount = count;
      dominantMood = mood;
    }
  }

  res.json({
    totalEntries: entries.length,
    dominantMood,
    streakDays: 7,
    moodDistribution: moodCounts,
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`✦ Vynura Express API listening on http://localhost:${PORT}`);
  });
}

export default app;
