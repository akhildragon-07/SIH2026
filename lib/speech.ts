// Speech Recognition and Text-to-Speech Engine with Multilingual Support & Live Audio Stream
// Supports: English, Tamil (தமிழ்), Telugu (తెలుగు), Hindi (हिंदी), Kannada (ಕನ್ನಡ), Malayalam (മലയാളം), Marathi (मराठी)

export interface SpeechLanguage {
  name: string;
  nativeName: string;
  code: string;
  voiceLang: string;
  flag: string;
  samplePhrases: string[];
  errorMessage: string;
}

export const SUPPORTED_LANGUAGES: Record<string, SpeechLanguage> = {
  'English': {
    name: 'English',
    nativeName: 'English',
    code: 'en-IN',
    voiceLang: 'en-IN',
    flag: '🌐',
    samplePhrases: [
      "Yashwant, 24",
      "I completed 10th standard pass",
      "I know plumbing with 2 years of experience",
      "Tamil Nadu, Theni district",
      "I am looking for a salaried Job"
    ],
    errorMessage: "I couldn't hear you. Please speak after the microphone turns green."
  },
  'தமிழ்': {
    name: 'Tamil',
    nativeName: 'தமிழ்',
    code: 'ta-IN',
    voiceLang: 'ta-IN',
    flag: '🇮🇳',
    samplePhrases: [
      "முருகன், 28",
      "நான் 10-வது வகுப்பு தேர்ச்சி",
      "எனக்கு தையல் வேலை தெரியும், 3 வருட அனுபவம்",
      "தமிழ்நாடு, தேனி மாவட்டம்",
      "நான் PM-AJAY டூல்கிட் மானியத்துடன் சொந்த தொழில் விரும்புகிறேன்"
    ],
    errorMessage: "உங்கள் குரல் கேட்கவில்லை. மைக் பச்சை நிறமாக மாறியதும் மீண்டும் பேசுங்கள்."
  },
  'తెలుగు': {
    name: 'Telugu',
    nativeName: 'తెలుగు',
    code: 'te-IN',
    voiceLang: 'te-IN',
    flag: '🇮🇳',
    samplePhrases: [
      "రమేష్, 26",
      "నేను 10వ తరగతి పాస్ అయ్యాను",
      "నాకు ప్లంబింగ్ పని వచ్చు, 2 సంవత్సరాల అనుభవం",
      "ఆంధ్రప్రదేశ్, విజయనగరం జిల్లా",
      "నేను ఉద్యోగం (Job) కోరుకుంటున్నాను"
    ],
    errorMessage: "మీ మాట వినిపించలేదు. మైక్ పచ్చగా మారిన తర్వాత మళ్ళీ మాట్లాడండి."
  },
  'हिंदी': {
    name: 'Hindi',
    nativeName: 'हिंदी',
    code: 'hi-IN',
    voiceLang: 'hi-IN',
    flag: '🇮🇳',
    samplePhrases: [
      "राहुल कुमार, 25",
      "मैंने 10वीं कक्षा पास की है",
      "मुझे सिलाई-कटाई और टेलरिंग का काम आता है, 3 साल का अनुभव",
      "उत्तर प्रदेश, वाराणसी जिला",
      "मुझे PM-AJAY टूलकिट अनुदान के साथ स्वरोजगार चाहिए"
    ],
    errorMessage: "आपकी आवाज़ सुनाई नहीं दी। माइक हरा होने के बाद कृपया फिर से बोलें।"
  },
  'ಕನ್ನಡ': {
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    code: 'kn-IN',
    voiceLang: 'kn-IN',
    flag: '🇮🇳',
    samplePhrases: [
      "ಮಂಜುನಾಥ್, 27",
      "ನಾನು 10ನೇ ತರಗತಿ ಪಾಸಾಗಿದ್ದೇನೆ",
      "ನನಗೆ ಎಲೆಕ್ಟ್ರಿಕಲ್ ವೈರಿಂಗ್ ಕೆಲಸ ಗೊತ್ತು, 2 ವರ್ಷ ಅನುಭವ",
      "ಕರ್ನಾಟಕ, ಮೈಸೂರು ಜಿಲ್ಲೆ",
      "ನನಗೆ ಸ್ವಯಂ ಉದ್ಯೋಗ (Self-employment) ಬೇಕು"
    ],
    errorMessage: "ನಿಮ್ಮ ಧ್ವನಿ ಕೇಳಿಸಲಿಲ್ಲ. ಮೈಕ್ ಹಸಿರಾದ ನಂತರ ದಯವಿಟ್ಟು ಮತ್ತೊಮ್ಮೆ ಮಾತನಾಡಿ."
  },
  'മലയാളം': {
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    code: 'ml-IN',
    voiceLang: 'ml-IN',
    flag: '🇮🇳',
    samplePhrases: [
      "വിഷ്ണു, 26",
      "ഞാൻ 10-ാം ക്ലാസ് പാസായി",
      "എനിക്ക് പ്ലംബിംഗ് ജോലി അറിയാം, 2 വർഷത്തെ പരിചയം",
      "കേരളം, എറണാകുളം ജില്ല",
      "എനിക്ക് ശമ്പളമുള്ള ജോലി (Job) വേണം"
    ],
    errorMessage: "നിങ്ങളുടെ ശബ്ദം കേൾക്കാൻ കഴിഞ്ഞില്ല. മൈക്ക് പച്ചയായ ശേഷം വീണ്ടും സംസാരിക്കുക."
  },
  'मराठी': {
    name: 'Marathi',
    nativeName: 'मराठी',
    code: 'mr-IN',
    voiceLang: 'mr-IN',
    flag: '🇮🇳',
    samplePhrases: [
      "सचिन, 24",
      "मी 10वी पास झालो आहे",
      "मला प्लंबिंगचे काम येते, 2 वर्षे अनुभव",
      "महाराष्ट्र, सोलापूर जिल्हा",
      "मला PM-AJAY टूलकिट अनुदानासह स्वतःचा व्यवसाय हवा आहे"
    ],
    errorMessage: "तुमचा आवाज ऐकू आला नाही. माइक हिरवा झाल्यावर कृपया पुन्हा बोला."
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
  if (l.includes('kannada') || l.includes('ಕನ್ನಡ') || l.startsWith('kn')) {
    return SUPPORTED_LANGUAGES['ಕನ್ನಡ'];
  }
  if (l.includes('malayalam') || l.includes('മലയാളം') || l.startsWith('ml')) {
    return SUPPORTED_LANGUAGES['മലയാളം'];
  }
  if (l.includes('marathi') || l.includes('मराठी') || l.startsWith('mr')) {
    return SUPPORTED_LANGUAGES['मराठी'];
  }
  if (l.includes('hindi') || l.includes('हिंदी') || l.startsWith('hi')) {
    return SUPPORTED_LANGUAGES['हिंदी'];
  }
  return SUPPORTED_LANGUAGES['English'];
}

/**
 * Detect language script directly from spoken transcript
 */
export function detectLanguageFromText(text: string): string {
  if (/[\u0B80-\u0BFF]/.test(text)) return 'தமிழ்';
  if (/[\u0C00-\u0C7F]/.test(text)) return 'తెలుగు';
  if (/[\u0C80-\u0CFF]/.test(text)) return 'ಕನ್ನಡ';
  if (/[\u0D00-\u0D7F]/.test(text)) return 'മലയാളം';
  if (/[\u0900-\u097F]/.test(text)) {
    if (text.includes('आहे') || text.includes('माझे') || text.includes('नाव') || text.includes('वर्षे') || text.includes('पाहिजे')) {
      return 'मराठी';
    }
    return 'हिंदी';
  }
  return 'English';
}

let recognitionInstance: any = null;
let isCurrentlyListening = false;
let accumulatedFinalText = '';
let audioLevelIntervalId: NodeJS.Timeout | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

// Initialize voices listener eagerly on client
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

/**
 * Start continuous speech recognition with smooth audio activity animation and robust lifecycle handling.
 */
export function startSpeechRecognition(
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onEnd: () => void,
  languageName: string = 'English',
  onAudioLevel?: (level: number) => void
) {
  if (typeof window === 'undefined') return;

  // Stop any ongoing speech synthesis so AI does not speak over user
  stopSpeechSynthesis();

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari.');
    return;
  }

  // Cleanly abort previous instance without triggering error callbacks
  stopSpeechRecognition();

  accumulatedFinalText = '';
  isCurrentlyListening = true;

  const langConfig = resolveLanguageConfig(languageName);

  try {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognition.lang = langConfig.code;

    recognition.onstart = () => {
      isCurrentlyListening = true;
      // Start simulated smooth audio level activity during active listening
      if (onAudioLevel) {
        if (audioLevelIntervalId) clearInterval(audioLevelIntervalId);
        audioLevelIntervalId = setInterval(() => {
          if (!isCurrentlyListening) return;
          // Natural audio level flutter between 25% and 85%
          const base = 30 + Math.random() * 45;
          onAudioLevel(Math.round(base));
        }, 120);
      }
    };

    recognition.onresult = (event: any) => {
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
        if (onAudioLevel) {
          onAudioLevel(Math.min(100, 50 + totalTranscript.length * 3));
        }
        onResult(totalTranscript, false);
      }
    };

    recognition.onerror = (event: any) => {
      const err = event.error;

      // Normal lifecycle cancellations that should NEVER show error banners to user
      if (err === 'aborted' || err === 'no-speech') {
        return;
      }

      console.warn('SpeechRecognition error:', err);

      let userMsg = langConfig.errorMessage;
      if (err === 'not-allowed' || err === 'permission-denied') {
        userMsg = languageName === 'Tamil'
          ? 'மைக் அணுகல் மறுக்கப்பட்டது. முகவரிப் பட்டியில் மைக் ஐகானைக் கிளிக் செய்து அனுமதி வழங்கவும்.'
          : languageName === 'Telugu'
          ? 'మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి బ్రౌజర్‌లో మైక్ అనుమతి ఇవ్వండి.'
          : languageName === 'Hindi'
          ? 'माइक्रोफ़ोन की अनुमति नहीं दी गई। कृपया ब्राउज़र में माइक की अनुमति दें।'
          : 'Microphone access was denied. Please click the microphone icon in your browser address bar to allow access.';
      } else if (err === 'network') {
        userMsg = languageName === 'Tamil'
          ? 'இணைய இணைப்பு பிழை. உங்கள் இணையத்தை சரிபார்க்கவும்.'
          : languageName === 'Hindi'
          ? 'नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।'
          : 'Network error during speech recognition. Please check your internet connection.';
      } else if (err === 'audio-capture') {
        userMsg = 'No microphone device was detected. Please connect a microphone.';
      }

      onError(userMsg);
    };

    recognition.onend = () => {
      isCurrentlyListening = false;
      if (audioLevelIntervalId) {
        clearInterval(audioLevelIntervalId);
        audioLevelIntervalId = null;
      }
      if (onAudioLevel) onAudioLevel(0);
      onEnd();
    };

    recognitionInstance = recognition;
    recognition.start();

  } catch (err: any) {
    isCurrentlyListening = false;
    if (audioLevelIntervalId) {
      clearInterval(audioLevelIntervalId);
      audioLevelIntervalId = null;
    }
    console.error('Failed to start speech recognition:', err);
    if (err.name !== 'InvalidStateError') {
      onError(err.message || 'Unable to start speech recognition');
    }
  }
}

/**
 * Stop active speech recognition safely
 */
export function stopSpeechRecognition(): string {
  isCurrentlyListening = false;
  if (audioLevelIntervalId) {
    clearInterval(audioLevelIntervalId);
    audioLevelIntervalId = null;
  }

  if (recognitionInstance) {
    try {
      recognitionInstance.onend = null;
      recognitionInstance.onerror = null;
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
 * Text-to-Speech Utterance with Indian Regional Language support (Tamil, Telugu, Hindi, English, etc.)
 */
export function speakText(text: string, languageName: string = 'English', onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    // Always cancel any previous speech
    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    // Strip markdown formatting before speaking, preserving parenthetical examples
    const cleanText = text
      .replace(/[*_#`~]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/[\(\)]/g, ', ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/₹/g, ' Rupees ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return;
    }

    const langConfig = resolveLanguageConfig(languageName);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langConfig.voiceLang;
    utterance.rate = 0.90;
    utterance.pitch = 1.0;

    if (cachedVoices.length === 0) {
      cachedVoices = window.speechSynthesis.getVoices();
    }

    const langPrefix = langConfig.code.split('-')[0].toLowerCase();

    // Match regional Indian voices specifically
    const matchedVoice = cachedVoices.find((v) => {
      const vLang = v.lang.toLowerCase().replace('_', '-');
      const vName = v.name.toLowerCase();

      return (
        vLang === langConfig.code.toLowerCase() ||
        vLang.startsWith(langPrefix) ||
        vName.includes(langConfig.name.toLowerCase()) ||
        (langPrefix === 'ta' && (vName.includes('tamil') || vName.includes('valluvar') || vName.includes('ta-in'))) ||
        (langPrefix === 'te' && (vName.includes('telugu') || vName.includes('mohan') || vName.includes('te-in'))) ||
        (langPrefix === 'hi' && (vName.includes('hindi') || vName.includes('kalpana') || vName.includes('hemant') || vName.includes('swara') || vName.includes('madhur') || vName.includes('hi-in'))) ||
        (langPrefix === 'kn' && (vName.includes('kannada') || vName.includes('gagan') || vName.includes('sapna') || vName.includes('kn-in'))) ||
        (langPrefix === 'ml' && (vName.includes('malayalam') || vName.includes('midhun') || vName.includes('sobhana') || vName.includes('ml-in'))) ||
        (langPrefix === 'mr' && (vName.includes('marathi') || vName.includes('aarohi') || vName.includes('mr-in'))) ||
        (langPrefix === 'en' && (vName.includes('india') || vName.includes('ravi') || vName.includes('heera') || vName.includes('prabhat') || vName.includes('neerja') || vName.includes('en-in')))
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
  } catch (err) {
    console.error('TTS error:', err);
    if (onEnd) onEnd();
  }
}

export function stopSpeechSynthesis() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // ignore
    }
  }
}


