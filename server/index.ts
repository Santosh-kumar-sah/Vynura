import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize Supabase admin client if keys exist
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// In-memory fallback if Supabase credentials are not provided
const fallbackMoodEntries = [
  {
    id: 'star-seed-1',
    mood_category: 'calm',
    confidence_score: 0.94,
    journal_text: 'Still waters before the dawn. Felt deep grounding in the 4-7-8 breathing practice.',
    created_at: new Date(Date.now() - 6 * 86400000).toISOString(),
    metadata: {},
  },
  {
    id: 'star-seed-2',
    mood_category: 'happy',
    confidence_score: 0.88,
    journal_text: 'Radiant momentum. Felt spontaneous gratitude for sunset skies and tea with family.',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    metadata: {},
  },
  {
    id: 'star-seed-3',
    mood_category: 'energetic',
    confidence_score: 0.92,
    journal_text: 'High electrical focus. Channeled the starlight surge into creative architecture.',
    created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
    metadata: {},
  },
  {
    id: 'star-seed-4',
    mood_category: 'sad',
    confidence_score: 0.82,
    journal_text: 'Gentle rainy feelings. Embraced self-compassion and let the night sky hold space.',
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    metadata: {},
  },
  {
    id: 'star-seed-5',
    mood_category: 'calm',
    confidence_score: 0.96,
    journal_text: 'Deep ocean tranquility. Fireflies floating outside the window.',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    metadata: {},
  },
];

// Health endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    sanctuary: 'Vynura API Server',
    supabaseConnected: Boolean(supabase),
    timestamp: new Date().toISOString(),
  });
});

// GET /api/mood-entries: Fetch all mood constellation entries
app.get('/api/mood-entries', async (req, res) => {
  const userId = req.query.userId as string | undefined;

  if (supabase) {
    try {
      let query = supabase.from('mood_entries').select('*').order('created_at', { ascending: true });
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      if (error) throw error;
      return res.json({ entries: data });
    } catch (err: unknown) {
      console.warn('Supabase query error, falling back to local seed data:', err);
    }
  }

  return res.json({ entries: fallbackMoodEntries });
});

// POST /api/mood-entries: Inscribe a new mood entry
app.post('/api/mood-entries', async (req, res) => {
  const { user_id, mood_category, confidence_score, journal_text, metadata } = req.body;

  if (!mood_category) {
    return res.status(400).json({ error: 'mood_category is required' });
  }

  const newEntry = {
    id: `star_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    user_id: user_id || null,
    mood_category,
    confidence_score: typeof confidence_score === 'number' ? confidence_score : 0.9,
    journal_text: journal_text || null,
    metadata: metadata || {},
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('mood_entries').insert(newEntry).select().single();
      if (error) throw error;
      return res.status(201).json({ entry: data });
    } catch (err: unknown) {
      console.warn('Supabase insert error, persisting to memory:', err);
    }
  }

  fallbackMoodEntries.push(newEntry);
  return res.status(201).json({ entry: newEntry });
});

app.listen(PORT, () => {
  console.log(`✦ Vynura Express API Sanctuary running on http://localhost:${PORT}`);
});

export default app;
