<div align="center">

# ✦ V Y N U R A ✦
### Ambient AI Emotional Resonance Sanctuary & Immersive Mindful Platform

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.1-black?style=for-the-badge&logo=framer&logoColor=blue)](https://www.framer.com/motion/)
[![Supabase](https://img.shields.io/badge/Supabase-Supported-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)

<p align="center">
  <em>"Each emotion is a passing weather; you are the sky."</em>
</p>

<p align="center">
  <strong>Vynura</strong> is a modern, privacy-first wellness sanctuary that harmonizes your nervous system through client-side emotional resonance calibration, somatic particle breath pacing, procedural Web Audio soundscapes, and 8 distinct fullscreen immersive meditation environments.
</p>

</div>

---

## 📑 Table of Contents

- [Overview & Design Philosophy](#-overview--design-philosophy)
- [Key Pillars & Features](#-key-pillars--features)
  - [1. On-Device Facial Emotion Calibration](#1-on-device-facial-emotion-calibration)
  - [2. Fullscreen Immersive Meditation Sanctuary](#2-fullscreen-immersive-meditation-sanctuary-8-realms)
  - [3. Firefly Particle Somatic Breathing Pacer](#3-firefly-particle-somatic-breathing-pacer)
  - [4. Procedural Web Audio Soundscapes & Spotify Stream](#4-procedural-web-audio-soundscapes--spotify-stream)
  - [5. Living Constellation Journal & Pattern Insights](#5-living-constellation-journal--pattern-insights)
  - [6. Gamification & Weekly Wellness Score](#6-gamification--weekly-wellness-score)
- [The 8 Meditation Realms](#-the-8-meditation-realms)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Development & Build](#development--build)
- [Privacy & Local-First Guarantees](#-privacy--local-first-guarantees)
- [License](#-license)

---

## 🌌 Overview & Design Philosophy

Most wellness trackers treat human emotions as spreadsheet data points, overwhelming users with clinical dashboards, stressful charts, and gamified pressure.

**Vynura takes the opposite approach:**
- **Cinematic Atmosphere**: Bathed in deep obsidian, twilight violet, cosmic starlight, and reactive firefly particles.
- **Distraction-Free Immersion**: When you practice, the UI gently fades away so you inhabit a dedicated visual and auditory realm.
- **Organic Metaphors**: Emotions form living celestial constellations rather than clinical graphs.
- **Local & Private**: All facial analysis happens strictly on your device using WebGL/WASM models. No camera footage or biometrics are ever transmitted to a server.

---

## ✨ Key Pillars & Features

### 1. On-Device Facial Emotion Calibration
- Real-time facial expression and sentiment detection powered by `@vladmandic/face-api`.
- Calibrates emotional resonance across 5 core emotional frequencies: `Happy`, `Calm`, `Sad`, `Energetic`, and `Neutral`.
- Provides instant recommendations, wisdom quotes, and shifts atmospheric sky lighting in real-time.
- Fallback manual mood selector available at all times.

### 2. Fullscreen Immersive Meditation Sanctuary (8 Realms)
- **100vw × 100vh Borderless Takeover**: Selecting any meditation category instantly covers the entire screen, obscuring all page chrome, dashboard cards, and navigation.
- **Bespoke Visual Environments**: Each category features its own purpose-built procedural canvas art — *only Ambient Starlight utilizes the meditating monk*.
- **Auto-Hiding Minimalist HUD**: Controls and text gently dissolve after 3.5 seconds of idle, keeping attention solely on the breath and visual space.
- **Browser Fullscreen API**: Automatically requests native fullscreen with fallback viewport coverage and safe-area insets.
- **Scroll Locking**: Disables page scrolling while meditating to eliminate accidental touch or wheel gestures.
- **Gentle Completion**: No jarring alarms — gracefully slows animation, softens ambient illumination, and presents restorative reflection cues.

### 3. Firefly Particle Somatic Breathing Pacer
- Dynamic HTML5 Canvas particle swarm that organically expands and contracts with your lungs.
- Three evidence-based breathing cadences:
  - **4-7-8 Parasympathetic Downshift**: Acute anxiety down-regulation and vagal nerve reset.
  - **4-4-4-4 Box Breathing Circuit**: Autonomic nervous system balance and laser focus.
  - **4-6 Coherent Calming Wave**: Heart-rate variability (HRV) coherence and gentle relaxation.

### 4. Procedural Web Audio Soundscapes & Spotify Stream
- **Zero Asset Dependencies**: Uses the browser's native `AudioContext`, biquad filters, low-frequency oscillators (LFO), and brownian noise generators.
- Generates 8 distinct procedural ambient soundscapes (432Hz harmonic drone, solar om frequency, ocean tide brown noise, 10Hz alpha binaural waves, sleep pink noise, sweeping wind, and 528Hz love resonance).
- Includes embedded Spotify on-brand playlists tailored to each calibrated mood.

### 5. Living Constellation Journal & Pattern Insights
- Inscribe personal reflections under the stars.
- Each entry becomes a glowing star node in an interactive constellation canvas.
- Real-time pattern recognition calculates streak counts, emotional equilibrium percentage, and personalized somatic recommendations.
- **Supabase Cloud Sync** with seamless offline `localStorage` fallback.

### 6. Gamification & Weekly Wellness Score
- Celebrate consistency with celestial star badges (e.g., *Starlight Seed, Night Sky Adept, Cosmic Equilibrium*).
- Weekly composite wellness score balancing logging cadence, breathing cycles, and meditation minutes.

---

## 🧘 The 8 Meditation Realms

Every category has a dedicated emotional intent, visual metaphor, and procedural audio frequency:

| Realm | Emotion & Goal | Primary Visual Scene | Human Figure? | Procedural Audio |
|---|---|---|---|---|
| **Ambient Starlight** | Stillness, Spaciousness, Awareness | Deep cosmic void, twinkling stars, soft celestial halo with breathing pulse | 🧘 **Yes (Lotus Monk)** | 108Hz / 432Hz Cosmic Drone |
| **Joy** | Lightness, Warmth, Optimism | Large glowing sun rising over dawn horizon, sunburst rays, upward floating golden light | 🌅 **No (Sunrise Scene)** | 136.1Hz Solar Resonance |
| **Calm** | Deep Relaxation, Safe Waters | Dark teal/blue water, soft moon, gentle undulating ripples, drifting horizon mist | 🌊 **No (Peaceful Water)** | Ocean Tidal Wave Noise |
| **Focus** | Mental Clarity, Sharpness | Dark slate void, central luminous orb with breathing pulse, subtle concentric rings | ✨ **No (Single Point of Light)** | 10Hz Alpha Binaural Waves |
| **Sleep** | Drowsiness, Surrender, Deep Rest | Twilight sky, large soft moon, drifting nocturnal clouds, progressive dimming curve | 🌙 **No (Moon & Clouds)** | Deep Brownian Sleep Noise |
| **Stress Relief** | Tension Release, Decompression | Dense swirling particle cluster dispersing outward into clean, open turquoise stillness | 💨 **No (Dissolving Particles)** | Sweeping Release Wind |
| **Gratitude** | Warmth, Appreciation, Contentment | Dark warm background, hundreds of tiny soft golden lights gently floating upward | ✨ **No (Golden Field of Light)** | 528Hz Love Harmonic |
| **Healing** | Recovery, Acceptance, Inner Peace | Expanding soft central light, translucent organic tendrils moving like slow underwater flora | 💡 **No (Growing Soft Light)** | 432Hz Crystal Bowl Vibrato |

---

## 🛠️ Architecture & Tech Stack

```
vynura/
├── public/                      # Static assets & face-api model weights
│   └── models/                  # TinyFaceDetector & Expression models
├── src/
│   ├── components/
│   │   ├── background/          # Starfield, Firefly Canvas, Shooting Stars
│   │   ├── common/              # Buttons, Glowing Cards, Navbar
│   │   ├── constellation/       # Interactive Constellation Hub & Insights
│   │   ├── gamification/        # Badges & Weekly Wellness Scoring
│   │   ├── music/               # Spotify Embedded Streaming Player
│   │   ├── recommendations/     # Mood Shift Engine & Action Modals
│   │   ├── sections/            # Hero, Features, Concept, Privacy, Footer
│   │   ├── vision/              # Face Detection & Consent Modals
│   │   └── wellness/            # Breathing Guide, Gratitude Deck
│   │       ├── meditation/      # Immersive Fullscreen Meditation System
│   │       │   ├── ImmersiveMeditationModal.tsx
│   │       │   ├── MeditationCategoryPicker.tsx
│   │       │   └── MeditationVisualScene.tsx
│   │       └── MeditationTimer.tsx
│   ├── data/                    # Recommendation rules & feature catalogs
│   ├── lib/                     # Supabase client & local star storage
│   ├── services/                # Procedural Web Audio engine & quote service
│   ├── types/                   # TypeScript schemas for mood & meditation
│   ├── App.tsx                  # Main application orchestrator
│   └── main.tsx                 # React entry point
└── tailwind.config.js           # Theme extensions, celestial palettes & glows
```

### Core Technologies
- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 8](https://vitejs.dev/) + [Oxlint](https://oxc.rs/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Motion & Physics**: [Framer Motion 13](https://www.framer.com/motion/)
- **Vision AI**: [`@vladmandic/face-api`](https://github.com/vladmandic/face-api)
- **Audio Engine**: Procedural [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- **Backend & Auth**: [Supabase](https://supabase.com/)

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.0.0` or later recommended)
- `npm` or `pnpm`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Santosh-kumar-sah/Vynura.git
   cd Vynura
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Environment Configuration

Vynura works out of the box with offline local storage. To enable cloud synchronization for your mood constellation, create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development & Build

- **Start local development server:**
  ```bash
  npm run dev
  ```
  Open `http://localhost:5173` in your browser.

- **Type-check and create production build:**
  ```bash
  npm run build
  ```

- **Preview production build locally:**
  ```bash
  npm run preview
  ```

- **Run linter:**
  ```bash
  npm run lint
  ```

---

## 🔒 Privacy & Local-First Guarantees

1. **Zero Camera Uploads**: Webcam frames are analyzed directly within your browser's memory via WebAssembly/WebGL neural networks.
2. **Explicit Consent**: Face analysis is strictly opt-in and requires explicit user confirmation.
3. **No Tracking Cookies**: User sessions and journal entries are stored locally or within your authenticated Supabase space.
4. **Local Fallback**: Full functionality is available without any cloud dependencies.

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<div align="center">
  <sub>Crafted with stillness and care for your mind.</sub>
</div>
