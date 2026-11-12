let audioContext: AudioContext | null = null;

/** Call from a click handler so the browser allows sound later. */
export function unlockAudio(): void {
  try {
    audioContext ??= new AudioContext();
    if (audioContext.state === "suspended") void audioContext.resume();
  } catch {
    // Sound is optional.
  }
}

/** Short beep plus a small vibration (phones). */
export function beep(): void {
  try {
    if (audioContext) {
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      oscillator.frequency.value = 880;
      gain.gain.value = 0.15;
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.25);
    }
    navigator.vibrate?.(200);
  } catch {
    // Sound is optional.
  }
}
