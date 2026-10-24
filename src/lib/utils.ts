import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Sound effects utility
export const playSound = (type: 'click' | 'pop' | 'toggle' | 'success' | 'alert' | 'transition' | 'robot') => {
  const isMuted = localStorage.getItem('aitopia_muted') === 'true';
  if (isMuted) return;

  const sounds: Record<string, string> = {
    click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
    pop: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    toggle: 'https://assets.mixkit.co/active_storage/sfx/2569/2569-preview.mp3',
    success: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
    alert: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
    transition: 'https://assets.mixkit.co/active_storage/sfx/2561/2561-preview.mp3', // Sci-fi whoosh
    robot: 'https://assets.mixkit.co/active_storage/sfx/2581/2581-preview.mp3', // Droid beep
  };

  const audio = new Audio(sounds[type]);
  audio.volume = 0.5;
  audio.play().catch(() => {}); // Ignore errors from browser autoplay policies
};

export const playBase64Audio = (base64Data: string, sampleRate: number = 24000) => {
  try {
    const binaryString = window.atob(base64Data);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    
    // Create a blob from the bytes
    const blob = new Blob([bytes], { type: 'audio/pcm' }); // Note: Gemini 1.5/2.0 often returns raw PCM, but 3.1 TTS might return encoded data depending on config or defaults.
    // Actually, the SDK example for Lyria uses 'audio/wav'. For TTS, it's often PCM 24kHz.
    
    // Improved version using AudioContext for PCM or standard Audio for encoded
    // For simplicity and since we don't know the exact format (likely PCM), 
    // let's use a more robust way if it's PCM
    
    // If it's a WAV/MP3 blob, this works:
    // const url = URL.createObjectURL(blob);
    // const audio = new Audio(url);
    // audio.play();

    // However, @google/genai TTS usually returns raw PCM.
    // Let's implement a PCM player.
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = bytes.buffer;
    
    // Assuming 16-bit PCM Mono 24kHz
    const pcmData = new Int16Array(arrayBuffer);
    const float32Data = new Float32Array(pcmData.length);
    for (let i = 0; i < pcmData.length; i++) {
      float32Data[i] = pcmData[i] / 32768.0;
    }

    const audioBuffer = audioContext.createBuffer(1, float32Data.length, sampleRate);
    audioBuffer.getChannelData(0).set(float32Data);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  } catch (error) {
    console.error("Error playing base64 audio:", error);
  }
};
