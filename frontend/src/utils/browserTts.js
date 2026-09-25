/**
 * Browser TTS Utility: Provides fallback speech synthesis using the user's native Web Speech API.
 * Ensures the agent can speak directly on the user's device even if external TTS APIs fail or run out of credits.
 */

export function speakWithBrowserTts(text, onStart, onEnd) {
  if (!('speechSynthesis' in window)) {
    console.warn('Browser does not support SpeechSynthesis');
    if (onEnd) onEnd();
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.05;
  utterance.pitch = 1.0;

  // Pick best available voice (prefer natural / online voices)
  const voices = window.speechSynthesis.getVoices();
  const naturalVoice = voices.find(
    (v) =>
      v.lang.startsWith('en') &&
      (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Aria'))
  ) || voices.find((v) => v.lang.startsWith('en')) || voices[0];

  if (naturalVoice) {
    utterance.voice = naturalVoice;
  }

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('Browser TTS playback error:', e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopBrowserTts() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
