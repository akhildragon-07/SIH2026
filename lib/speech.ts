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
    nativeName: 'English (India)',
    code: 'en-IN',
    voiceLang: 'en-IN',
    samplePhrases: [
      "I completed 10th pass",
      "I know tailoring and garment stitching",
      "I have 2 years experience and want self-employment with PM-AJAY toolkit grant",
      "I have basic computer typing and data entry skills"
    ]
  },
  'हिंदी': {
    name: 'Hindi',
    nativeName: 'हिंदी (भारत)',
    code: 'hi-IN',
    voiceLang: 'hi-IN',
    samplePhrases: [
      "मैंने 10वीं कक्षा पास की है",
      "मुझे सिलाई, कटाई और टेलरिंग का काम आता है",
      "मैं सिलाई की अपनी दुकान खोलना चाहता हूँ और टूलकिट सहायता चाहता हूँ",
      "मुझे बिजली वायरिंग और सोलर पैनल का अनुभव है"
    ]
  },
  'తెలుగు': {
    name: 'Telugu',
    nativeName: 'తెలుగు (భారత్)',
    code: 'te-IN',
    voiceLang: 'te-IN',
    samplePhrases: [
      "నేను 10వ తరగతి పూర్తి చేసాను",
      "నాకు టైలరింగ్ మరియు బట్టలు కుట్టే పని వచ్చు",
      "నేను PM-AJAY గ్రాంట్‌తో స్వయం ఉపాధి షాపు ప్రారంభించాలనుకుంటున్నాను",
      "నాకు ఎలక్ట్రికల్ వైరింగ్ మరియు మోటార్ రిపేర్ వచ్చు"
    ]
  },
  'தமிழ்': {
    name: 'Tamil',
    nativeName: 'தமிழ் (இந்தியா)',
    code: 'ta-IN',
    voiceLang: 'ta-IN',
    samplePhrases: [
      "நான் 10 ஆம் வகுப்பு தேர்ச்சி பெற்றுள்ளேன்",
      "எனக்கு தையல் மற்றும் ஆடை தைக்கும் திறன் உள்ளது",
      "நான் PM-AJAY கருவி மானியத்துடன் சொந்த தொழில் தொடங்க விரும்புகிறேன்",
      "எனக்கு கணினி தட்டச்சு மற்றும் டேட்டா என்ட்ரி தெரியும்"
    ]
  },
  'मराठी': {
    name: 'Marathi',
    nativeName: 'मराठी (भारत)',
    code: 'mr-IN',
    voiceLang: 'mr-IN',
    samplePhrases: [
      "मी 10वी उत्तीर्ण झालो आहे",
      "मला टेलरिंग आणि कपडे शिवण्याचे कौशल्य आहे",
      "मला PM-AJAY टूलकिट अनुदानासह स्वतःचा व्यवसाय सुरू करायचा आहे",
      "मला मोबाईल रिपेअरिंग आणि कॉम्प्युटरचे ज्ञान आहे"
    ]
  }
};

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

  const langConfig = SUPPORTED_LANGUAGES[languageName] || SUPPORTED_LANGUAGES['English'];

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
 * Text-to-Speech Utterance with Indian Language support
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
    .replace(/https?:\/\/\S+/g, 'link');

  const langConfig = SUPPORTED_LANGUAGES[languageName] || SUPPORTED_LANGUAGES['English'];
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = langConfig.voiceLang;
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find((v) => 
    v.lang.toLowerCase().includes(langConfig.code.toLowerCase()) ||
    v.lang.toLowerCase().replace('_', '-').includes(langConfig.voiceLang.toLowerCase())
  );

  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = () => {
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeechSynthesis() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

