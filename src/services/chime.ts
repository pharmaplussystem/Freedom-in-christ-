// Web Audio API offline sound synthesis for Sacred Prayer Altar alarms
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export type ChimeType = 'cathedral-bell' | 'temple-chime' | 'sacred-harp' | 'gentle-gong';

export function playAltarChime(type: ChimeType = 'cathedral-bell') {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (type === 'cathedral-bell') {
      // Harmonic cathedral bell with fundamental 440Hz (A4) and rich overtones
      const frequencies = [440, 880, 1320, 1760];
      const gains = [0.4, 0.25, 0.15, 0.08];

      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(gains[idx], now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 3.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 3.2);
      });
    } else if (type === 'temple-chime') {
      // High celestial wind chime (E6, G#6, B6)
      const notes = [1318.51, 1661.22, 1975.53];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const delay = idx * 0.12;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.3, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 2.5);
      });
    } else if (type === 'sacred-harp') {
      // Arpeggiated harp chord in D major (D4, F#4, A4, D5)
      const chord = [293.66, 369.99, 440.00, 587.33];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const delay = idx * 0.15;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.35, now + delay);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 2.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 2.8);
      });
    } else {
      // Gentle deep bronze gong (fundamental 130.81Hz C3)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(130.81, now);
      osc.frequency.exponentialRampToValueAtTime(128, now + 4.0);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.0);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 4.0);
    }
  } catch (err) {
    console.warn('Audio playback error (requires user interaction first):', err);
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
}

export function triggerAltarNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/pwa-192x192.png',
      badge: '/icon.svg',
      tag: 'prayer-altar-watch'
    });
  }
}
