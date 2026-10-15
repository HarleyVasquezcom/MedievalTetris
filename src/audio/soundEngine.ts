// Web Audio API Procedural Audio Generator for Medieval Tetris

class SoundEngine {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private musicInterval: any = null;
  private isMusicPlaying: boolean = false;
  private noteIndex: number = 0;

  // Medieval lute / organ melody frequencies in Hz (A minor / Dorian mode)
  private melodyNotes: number[] = [
    220, // A3
    246.94, // B3
    261.63, // C4
    293.66, // D4
    329.63, // E4
    349.23, // F4
    392.0, // G4
    440, // A4
  ];

  // Medieval song sequence
  private melodySequence: number[] = [0, 2, 4, 3, 2, 0, 1, 0, 4, 5, 7, 6, 4, 3, 2, 0];

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleAudio(): boolean {
    this.enabled = !this.enabled;
    if (!this.enabled) {
      this.stopMusic();
    }
    return this.enabled;
  }

  public playMove() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playRotate() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  public playDrop() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  public playClearLine() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Medieval fanfare arpeggio
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.06);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + idx * 0.06 + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.06);
      osc.stop(this.ctx.currentTime + idx * 0.06 + 0.15);
    });
  }

  public playSpecialEvent() {
    if (!this.enabled) return;
    this.initCtx();
    if (!this.ctx) return;

    // Catapult / Tax explosion rumble sound
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  public startMusic(tempoMs: number = 260) {
    if (!this.enabled || this.isMusicPlaying) return;
    this.initCtx();
    this.isMusicPlaying = true;

    this.musicInterval = setInterval(() => {
      if (!this.enabled || !this.ctx) return;
      const noteDegree = this.melodySequence[this.noteIndex % this.melodySequence.length];
      const freq = this.melodyNotes[noteDegree];

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Alternate organ/flute sound synthesis
      osc.type = this.noteIndex % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (tempoMs / 1000) * 0.9);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + (tempoMs / 1000) * 0.9);

      this.noteIndex++;
    }, tempoMs);
  }

  public stopMusic() {
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    this.isMusicPlaying = false;
  }
}

export const soundEngine = new SoundEngine();
