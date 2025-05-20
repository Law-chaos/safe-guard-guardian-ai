
class AlarmSystem {
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gain: GainNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private isPlaying: boolean = false;

  constructor() {
    // Initialize if we're in a browser environment
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  startAlarm(type: 'emergency-siren' | 'police-siren' | 'standard-alarm' = 'emergency-siren'): void {
    if (this.isPlaying) {
      this.stopAlarm();
    }
    
    this.isPlaying = true;
    
    if (this.audioContext) {
      // Create a more attention-grabbing sound based on type
      switch (type) {
        case 'emergency-siren':
          // Emergency siren (wailing up and down with intensity)
          this.createEmergencySiren();
          break;
        case 'police-siren':
          // Police-like siren (alternating between two tones)
          this.createPoliceSiren();
          break;
        case 'standard-alarm':
        default:
          // Original standard alarm
          this.createStandardAlarm();
          break;
      }
    }
  }
  
  private createEmergencySiren(): void {
    if (!this.audioContext) return;
    
    this.oscillator = this.audioContext.createOscillator();
    this.gain = this.audioContext.createGain();
    
    // Set up oscillator
    this.oscillator.type = 'sawtooth';
    this.oscillator.frequency.value = 880; // Starting frequency (A5)
    
    // Create more complex sound with distortion
    const distortion = this.audioContext.createWaveShaper();
    
    function makeDistortionCurve(amount: number) {
      const k = typeof amount === 'number' ? amount : 50;
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      const deg = Math.PI / 180;
      
      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
      return curve;
    }
    
    distortion.curve = makeDistortionCurve(50);
    distortion.oversample = '4x';
    
    // Set up gain
    this.gain.gain.value = 0.3; // Start at 30% volume
    
    // Connect nodes
    this.oscillator.connect(distortion);
    distortion.connect(this.gain);
    this.gain.connect(this.audioContext.destination);
    
    // Start oscillator
    this.oscillator.start();
    
    // Create wailing effect by modulating frequency and volume
    let up = true;
    let frequencyValue = 880;
    let gainValue = 0.3;
    
    const intervalId = setInterval(() => {
      if (!this.oscillator || !this.gain || !this.isPlaying) {
        clearInterval(intervalId);
        return;
      }
      
      if (up) {
        frequencyValue += 50;
        gainValue += 0.03;
        if (frequencyValue >= 1400) {
          up = false;
        }
      } else {
        frequencyValue -= 50;
        gainValue -= 0.03;
        if (frequencyValue <= 680) {
          up = true;
        }
      }
      
      // Limit gain to avoid clipping
      gainValue = Math.max(0.2, Math.min(0.7, gainValue));
      
      this.oscillator.frequency.setValueAtTime(frequencyValue, this.audioContext.currentTime);
      this.gain.gain.setValueAtTime(gainValue, this.audioContext.currentTime);
    }, 50);
  }
  
  private createPoliceSiren(): void {
    if (!this.audioContext) return;
    
    this.oscillator = this.audioContext.createOscillator();
    this.gain = this.audioContext.createGain();
    
    // Set up oscillator
    this.oscillator.type = 'square';
    this.oscillator.frequency.value = 760; // Starting frequency
    
    // Set up gain
    this.gain.gain.value = 0.3;
    
    // Connect nodes
    this.oscillator.connect(this.gain);
    this.gain.connect(this.audioContext.destination);
    
    // Start oscillator
    this.oscillator.start();
    
    // Alternate between two frequencies
    let useHighTone = true;
    
    const intervalId = setInterval(() => {
      if (!this.oscillator || !this.isPlaying) {
        clearInterval(intervalId);
        return;
      }
      
      this.oscillator.frequency.setValueAtTime(
        useHighTone ? 880 : 660,
        this.audioContext.currentTime
      );
      
      useHighTone = !useHighTone;
    }, 400);
  }
  
  private createStandardAlarm(): void {
    if (!this.audioContext) return;
    
    this.oscillator = this.audioContext.createOscillator();
    this.gain = this.audioContext.createGain();
    
    // Set up oscillator
    this.oscillator.type = 'sine';
    this.oscillator.frequency.value = 800;
    
    // Set up gain
    this.gain.gain.value = 0.5;
    
    // Connect nodes
    this.oscillator.connect(this.gain);
    this.gain.connect(this.audioContext.destination);
    
    // Start oscillator
    this.oscillator.start();
    
    // Modulate the gain to create a beeping effect
    const intervalId = setInterval(() => {
      if (!this.gain || !this.isPlaying) {
        clearInterval(intervalId);
        return;
      }
      
      // Toggle gain between 0 and 0.5 to create a beeping effect
      this.gain.gain.value = this.gain.gain.value > 0 ? 0 : 0.5;
    }, 500);
  }

  stopAlarm(): void {
    this.isPlaying = false;
    
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }
    
    if (this.gain) {
      this.gain.disconnect();
      this.gain = null;
    }
    
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
      this.audioElement = null;
    }
  }
}

export const alarmSystem = new AlarmSystem();
