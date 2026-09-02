// Procedural Web Audio Ambient Soundscapes for Meditation Categories

class AmbientSoundEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeNodes: { stop: () => void }[] = [];
  private isPlaying = false;
  private currentType: string | null = null;

  private initContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.audioCtx = new AudioContextClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    if (!this.masterGain && this.audioCtx) {
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);
    }
  }

  public play(soundscapeType: string) {
    this.initContext();
    if (!this.audioCtx || !this.masterGain) return;

    if (this.isPlaying && this.currentType === soundscapeType) return;
    this.stop();

    this.isPlaying = true;
    this.currentType = soundscapeType;
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Smooth fade in
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0.001, now);
    this.masterGain.gain.exponentialRampToValueAtTime(0.18, now + 3);

    switch (soundscapeType) {
      case 'starlight-drone':
        this.createStarlightDrone(ctx);
        break;
      case 'warm-sunrise':
        this.createWarmSunriseTone(ctx);
        break;
      case 'ocean-mist':
        this.createOceanMistSound(ctx);
        break;
      case 'focus-binaural':
        this.createFocusBinaural(ctx);
        break;
      case 'sleep-pink':
        this.createSleepPinkNoise(ctx);
        break;
      case 'release-wind':
        this.createReleaseWind(ctx);
        break;
      case 'amber-resonance':
        this.createAmberResonance(ctx);
        break;
      case 'healing-crystal':
        this.createHealingCrystal(ctx);
        break;
      default:
        this.createStarlightDrone(ctx);
    }
  }

  private createStarlightDrone(ctx: AudioContext) {
    if (!this.masterGain) return;
    // 108Hz base + 216Hz fifth + slow subtle chorus modulation
    const freqs = [108, 162, 216, 432];
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + idx * 0.3, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);

      gain.gain.setValueAtTime(idx === 0 ? 0.4 : 0.15 / (idx + 1), ctx.currentTime);

      // Slow LFO
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.08 + idx * 0.02, ctx.currentTime);
      lfoGain.gain.setValueAtTime(0.05, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start();
      lfo.start();

      this.activeNodes.push({
        stop: () => {
          try {
            osc.stop();
            lfo.stop();
          } catch {}
        },
      });
    });
  }

  private createWarmSunriseTone(ctx: AudioContext) {
    if (!this.masterGain) return;
    // Warm harmonic major chord (136.1Hz Om / Sun resonance + fifth + major 3rd)
    const baseFreq = 136.1;
    const chords = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];
    chords.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.12 / (i + 1), ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);

      osc.start();
      this.activeNodes.push({
        stop: () => {
          try { osc.stop(); } catch {}
        },
      });
    });
  }

  private createOceanMistSound(ctx: AudioContext) {
    if (!this.masterGain) return;
    // Gentle pink/brown noise modulated like slow tidal wave
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 3.5;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, ctx.currentTime);

    // Filter modulation like ocean tide
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8s wave period
    lfoGain.gain.setValueAtTime(140, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.35, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();
    lfo.start();

    this.activeNodes.push({
      stop: () => {
        try {
          noise.stop();
          lfo.stop();
        } catch {}
      },
    });
  }

  private createFocusBinaural(ctx: AudioContext) {
    if (!this.masterGain) return;
    // Alpha wave binaural pulse (140Hz and 150Hz -> 10Hz alpha difference)
    const oscL = ctx.createOscillator();
    const oscR = ctx.createOscillator();
    const merger = ctx.createChannelMerger(2);

    oscL.type = 'sine';
    oscL.frequency.setValueAtTime(140, ctx.currentTime);
    oscR.type = 'sine';
    oscR.frequency.setValueAtTime(150, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.2, ctx.currentTime);

    oscL.connect(merger, 0, 0);
    oscR.connect(merger, 0, 1);
    merger.connect(gain);
    gain.connect(this.masterGain);

    oscL.start();
    oscR.start();

    this.activeNodes.push({
      stop: () => {
        try {
          oscL.stop();
          oscR.stop();
        } catch {}
      },
    });
  }

  private createSleepPinkNoise(ctx: AudioContext) {
    if (!this.masterGain) return;
    // Ultra deep, low-pass filtered brownian noise (deep twilight calm)
    const bufferSize = ctx.sampleRate * 4;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.015 * white) / 1.015;
      lastOut = data[i];
      data[i] *= 3.0;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(160, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start();

    this.activeNodes.push({
      stop: () => {
        try { noise.stop(); } catch {}
      },
    });
  }

  private createReleaseWind(ctx: AudioContext) {
    if (!this.masterGain) return;
    // Soft sweeping wind release sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(96, ctx.currentTime);
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(280, ctx.currentTime);
    filter.Q.setValueAtTime(3.0, ctx.currentTime);

    gain.gain.setValueAtTime(0.2, ctx.currentTime);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start();

    this.activeNodes.push({
      stop: () => {
        try { osc.stop(); } catch {}
      },
    });
  }

  private createAmberResonance(ctx: AudioContext) {
    if (!this.masterGain) return;
    // 528Hz love/miracle harmonic tone with warm undertone
    const base = 264;
    const freqs = [base, base * 2, base * 1.5];
    freqs.forEach((f, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, ctx.currentTime);
      gain.gain.setValueAtTime(0.1 / (i + 1), ctx.currentTime);

      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();

      this.activeNodes.push({
        stop: () => {
          try { osc.stop(); } catch {}
        },
      });
    });
  }

  private createHealingCrystal(ctx: AudioContext) {
    if (!this.masterGain) return;
    // Pure 432Hz crystal bowl resonance with subtle vibrato
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(432, ctx.currentTime);

    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
    lfoGain.gain.setValueAtTime(1.5, ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    lfo.start();

    this.activeNodes.push({
      stop: () => {
        try {
          osc.stop();
          lfo.stop();
        } catch {}
      },
    });
  }

  public stop() {
    if (!this.audioCtx || !this.masterGain) return;
    const now = this.audioCtx.currentTime;
    try {
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    } catch {}

    setTimeout(() => {
      this.activeNodes.forEach((node) => node.stop());
      this.activeNodes = [];
      this.isPlaying = false;
      this.currentType = null;
    }, 1250);
  }
}

export const meditationSoundEngine = new AmbientSoundEngine();
