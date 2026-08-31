// Speech Recognition and Text-to-Speech Engine with Multilingual Support & Live Audio Stream
// Supports: English, Hindi (हिंदी), Telugu (తెలుగు), Tamil (தமிழ்), Marathi (मराठी)

export interface SpeechLanguage {
  name: string;
  nativeName: string;
  code: string;
  voiceLang: string;
  samplePhrases: string[];
}

export const SUPPORTED_LANGUAGES: Record<string, SpeechLanguage> = {
  'English': {
    name: 'English',
    nativeName: 'English',
    code: 'en-IN',
    voiceLang: 'en-IN',
    samplePhrases: [
      "Yashwant, 24",
      "I completed 10th standard pass",
      "I know plumbing with 2 years of experience",
      "Tamil Nadu, Theni district",
      "I am looking for a salaried Job"
    ]
  },
  'हिंदी': {
    name: 'Hindi',
    nativeName: 'हिंदी',
    code: 'hi-IN',
    voiceLang: 'hi-IN',
    samplePhrases: [
      "राहुल कुमार, 25",
      "मैंने 10वीं कक्षा पास की है",
      "मुझे सिलाई-कटाई और टेलरिंग का काम आता है, 3 साल का अनुभव",
      "उत्तर प्रदेश, वाराणसी जिला",
      "मुझे नौकरी (Job) चाहिए"
    ]
  },
  'తెలుగు': {
    name: 'Telugu',
    nativeName: 'తెలుగు',
    code: 'te-IN',
    voiceLang: 'te-IN',
    samplePhrases: [
      "అఖిల్, 24",
      "నేను 10వ తరగతి పూర్తి చేసాను",
      "నాకు ప్లంబింగ్ వచ్చు, 2 సంవత్సరాల అనుభవం",
      "ఆంధ్రప్రదేశ్, విజయనగరం జిల్లా",
      "నేను ఉద్యోగం (Job) కోరుకుంటున్నాను"
    ]
  },
  'தமிழ்': {
    name: 'Tamil',
    nativeName: 'தமிழ்',
    code: 'ta-IN',
    voiceLang: 'ta-IN',
    samplePhrases: [
      "யஷ்வந்த், 24",
      "நான் 10-வது வகுப்பு தேர்ச்சி",
      "எனக்கு ப்ளம்பிங் தெரியும், 2 வருட அனுபவம்",
      "தமிழ்நாடு, தேனி மாவட்டம்",
      "நான் மாதச் சம்பள வேலை (Job) விரும்புகிறேன்"
    ]
  },
  'मराठी': {
    name: 'Marathi',
    nativeName: 'मराठी',
    code: 'mr-IN',
    voiceLang: 'mr-IN',
    samplePhrases: [
      "सचिन, 24",
      "मी 10वी पास झालो आहे",
      "मला प्लंबिंगचे काम येते, 2 वर्षे अनुभव",
      "महाराष्ट्र, सोलापूर जिल्हा",
      "मला नोकरी (Job) हवी आहे"
    ]
  }
};

/**
 * Normalizes any language input into standard SpeechLanguage configuration
 */
export function resolveLanguageConfig(langInput?: string): SpeechLanguage {
  if (!langInput) return SUPPORTED_LANGUAGES['English'];
  const l = langInput.toLowerCase().trim();

  if (l.includes('tamil') || l.includes('தமிழ்') || l.startsWith('ta')) {
    return SUPPORTED_LANGUAGES['தமிழ்'];
  }
  if (l.includes('telugu') || l.includes('తెలుగు') || l.startsWith('te')) {
    return SUPPORTED_LANGUAGES['తెలుగు'];
  }
  if (l.includes('hindi') || l.includes('हिंदी') || l.startsWith('hi')) {
    return SUPPORTED_LANGUAGES['हिंदी'];
  }
  if (l.includes('marathi') || l.includes('मराठी') || l.startsWith('mr')) {
    return SUPPORTED_LANGUAGES['मराठी'];
  }
  return SUPPORTED_LANGUAGES['English'];
}

/**
 * Detect language script directly from spoken transcript
 */
export function detectLanguageFromText(text: string): string {
  if (/[\u0B80-\u0BFF]/.test(text)) return 'தமிழ்';
  if (/[\u0C00-\u0C7F]/.test(text)) return 'తెలుగు';
  if (/[\u0900-\u097F]/.test(text)) {
    if (text.includes('आहे') || text.includes('माझे') || text.includes('नाव') || text.includes('वर्षे') || text.includes('पाहिजे')) {
      return 'मराठी';
    }
    return 'हिंदी';
  }
  return 'English';
}

let recognitionInstance: any = null;
let activeMediaStream: MediaStream | null = null;
let audioContextInstance: AudioContext | null = null;
let analyserNodeInstance: AnalyserNode | null = null;
let audioLevelAnimationId: number | null = null;

let isCurrentlyListening = false;
let accumulatedFinalText = '';

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export interface SpeechRecognitionCallbacks {
  onTranscriptChange: (liveFullTranscript: string, isFinalChunk: boolean, rawChunk: string) => void;
  onError: (errorMessage: string) => void;
  onEnd: () => void;
  onAudioLevel?: (levelPercentage: number) => void; // 0 to 100
}

/**
 * Start continuous speech recognition with Web Audio API mic level detection and persistent buffer.
 */
export function startSpeechRecognition(
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onEnd: () => void,
  languageName: string = 'English',
  onAudioLevel?: (level: number) => void
) {
  if (typeof window === 'undefined') return;

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Speech recognition is not supported in this browser. Please use Chrome, Microsoft Edge, or Safari.');
    return;
  }

  // Abort any existing instance cleanly
  stopSpeechRecognition();

  accumulatedFinalText = '';
  isCurrentlyListening = true;

  const langConfig = resolveLanguageConfig(languageName);

  try {
    recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.maxAlternatives = 1;
    recognitionInstance.lang = langConfig.code;

    // Handle speech results with dual accumulation
    recognitionInstance.onresult = (event: any) => {
      let interimChunk = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const item = event.results[i];
        if (item.isFinal) {
          const chunkText = item[0].transcript.trim();
          if (chunkText) {
            accumulatedFinalText = accumulatedFinalText 
              ? `${accumulatedFinalText} ${chunkText}` 
              : chunkText;
          }
        } else {
          interimChunk += item[0].transcript;
        }
      }

      const totalTranscript = [accumulatedFinalText, interimChunk.trim()].filter(Boolean).join(' ').trim();

      if (totalTranscript) {
        onResult(totalTranscript, false);
      }
    };

    recognitionInstance.onerror = (event: any) => {
      const err = event.error;
      console.warn('SpeechRecognition error:', err);

      let userMsg = `Speech recognition error (${err})`;
      if (err === 'not-allowed' || err === 'permission-denied') {
        userMsg = 'Microphone access was denied. Please click the camera/mic icon in your browser address bar to allow microphone access.';
      } else if (err === 'no-speech') {
        // Soft timeout when quiet, do not hard crash
        return;
      } else if (err === 'network') {
        userMsg = 'Network error during voice recognition. Please check your internet connection or use manual text input.';
      } else if (err === 'audio-capture') {
        userMsg = 'No microphone device was detected. Please connect a microphone.';
      }

      onError(userMsg);
    };

    recognitionInstance.onend = () => {
      isCurrentlyListening = false;
      cleanupAudioLevelStream();
      onEnd();
    };

    recognitionInstance.start();

    // Start Web Audio API mic level visualization
    if (onAudioLevel && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      startAudioLevelMonitor(onAudioLevel);
    }

  } catch (err: any) {
    isCurrentlyListening = false;
    cleanupAudioLevelStream();
    console.error('Failed to start speech recognition:', err);
    onError(err.message || 'Unable to start speech recognition');
  }
}

/**
 * Stop active speech recognition and clean up streams
 */
export function stopSpeechRecognition(): string {
  isCurrentlyListening = false;
  cleanupAudioLevelStream();

  if (recognitionInstance) {
    try {
      recognitionInstance.stop();
    } catch (e) {
      try {
        recognitionInstance.abort();
      } catch (err) {
        // ignore
      }
    }
    recognitionInstance = null;
  }

  return accumulatedFinalText;
}

/**
 * Sets up Web Audio API microphone stream to compute live sound volume (0-100%)
 */
async function startAudioLevelMonitor(callback: (level: number) => void) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    activeMediaStream = stream;

    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    audioContextInstance = new AudioContextClass();
    const source = audioContextInstance.createMediaStreamSource(stream);
    analyserNodeInstance = audioContextInstance.createAnalyser();
    analyserNodeInstance.fftSize = 256;
    analyserNodeInstance.smoothingTimeConstant = 0.5;
    source.connect(analyserNodeInstance);

    const dataArray = new Uint8Array(analyserNodeInstance.frequencyBinCount);

    const updateLevel = () => {
      if (!isCurrentlyListening || !analyserNodeInstance) return;

      analyserNodeInstance.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const avg = sum / dataArray.length;
      const normalized = Math.min(100, Math.round((avg / 128) * 100));

      callback(normalized);
      audioLevelAnimationId = requestAnimationFrame(updateLevel);
    };

    updateLevel();
  } catch (err) {
    // Microphone level monitoring optional, ignore error if denied
  }
}

function cleanupAudioLevelStream() {
  if (audioLevelAnimationId) {
    cancelAnimationFrame(audioLevelAnimationId);
    audioLevelAnimationId = null;
  }
  if (activeMediaStream) {
    activeMediaStream.getTracks().forEach((track) => track.stop());
    activeMediaStream = null;
  }
  if (audioContextInstance && audioContextInstance.state !== 'closed') {
    try {
      audioContextInstance.close();
    } catch (e) {
      // ignore
    }
    audioContextInstance = null;
  }
}

/**
 * Text-to-Speech Utterance with Indian Regional Language support
 */
export function speakText(text: string, languageName: string = 'English', onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  // Strip excessive markdown formatting before speaking
  const cleanText = text
    .replace(/[*_#`~]/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\([^)]+\)/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .trim();

  if (!cleanText) {
    if (onEnd) onEnd();
    return;
  }

  const langConfig = resolveLanguageConfig(languageName);
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = langConfig.voiceLang;
  utterance.rate = 0.92;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const langPrefix = langConfig.code.split('-')[0].toLowerCase(); // e.g. 'ta', 'te', 'hi', 'mr', 'en'

  // Match regional Indian voices specifically
  const matchedVoice = voices.find((v) => {
    const vLang = v.lang.toLowerCase().replace('_', '-');
    const vName = v.name.toLowerCase();

    return (
      vLang === langConfig.code.toLowerCase() ||
      vLang.startsWith(langPrefix) ||
      vName.includes(langConfig.name.toLowerCase()) ||
      (langPrefix === 'ta' && (vName.includes('tamil') || vName.includes('valluvar'))) ||
      (langPrefix === 'te' && (vName.includes('telugu') || vName.includes('mohan'))) ||
      (langPrefix === 'hi' && (vName.includes('hindi') || vName.includes('kalpana') || vName.includes('hemant') || vName.includes('swara') || vName.includes('madhur'))) ||
      (langPrefix === 'mr' && (vName.includes('marathi') || vName.includes('aarohi')))
    );
  });

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (e) => {
    console.warn('SpeechSynthesis error:', e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeechSynthesis() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}


