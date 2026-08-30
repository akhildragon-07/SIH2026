// Speech Recognition and Text-to-Speech Helper for Web Browsers with Multilingual Support

export interface SpeechLanguage {
  name: string;
  code: string;
  voiceLang: string;
  samplePhrases: string[];
}

export const SUPPORTED_LANGUAGES: Record<string, SpeechLanguage> = {
  'English': {
    name: 'English',
    code: 'en-IN',
    voiceLang: 'en-IN',
    samplePhrases: [
      "I completed 10th pass",
      "I know tailoring and stitching",
      "I have 2 years experience and want self-employment"
    ]
  },
  'हिंदी': {
    name: 'Hindi',
    code: 'hi-IN',
    voiceLang: 'hi-IN',
    samplePhrases: [
      "मैंने 10वीं पास की है",
      "मुझे सिलाई और कटाई का अनुभव है",
      "मैं सिलाई की दुकान खोलना चाहता हूँ"
    ]
  },
  'తెలుగు': {
    name: 'Telugu',
    code: 'te-IN',
    voiceLang: 'te-IN',
    samplePhrases: [
      "నేను 10వ తరగతి పూర్తి చేసాను",
      "నాకు టైలరింగ్ మరియు కుట్టు పని వచ్చు",
      "నేను స్వయం ఉపాధి షాపు ప్రారంభించాలనుకుంటున్నాను"
    ]
  },
  'தமிழ்': {
    name: 'Tamil',
    code: 'ta-IN',
    voiceLang: 'ta-IN',
    samplePhrases: [
      "நான் 10 ஆம் வகுப்பு முடித்துள்ளேன்",
      "எனக்கு தையல் மற்றும் ஆடை தைக்க தெரியும்",
      "நான் சொந்தமாக தொழில் தொடங்க விரும்புகிறேன்"
    ]
  },
  'मराठी': {
    name: 'Marathi',
    code: 'mr-IN',
    voiceLang: 'mr-IN',
    samplePhrases: [
      "मी 10वी पास झालो आहे",
      "मला टेलरिंग आणि शिवणकाम येते",
      "मला स्वतःचा व्यवसाय सुरू करायचा आहे"
    ]
  }
};

let recognitionInstance: any = null;

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}

export function startSpeechRecognition(
  onResult: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onEnd: () => void,
  languageName: string = 'English'
) {
  if (typeof window === 'undefined') return;

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    onError('Speech recognition is not supported in this browser. Try Chrome, Edge, or Safari.');
    return;
  }

  if (recognitionInstance) {
    try {
      recognitionInstance.abort();
    } catch (e) {
      // ignore
    }
  }

  const langConfig = SUPPORTED_LANGUAGES[languageName] || SUPPORTED_LANGUAGES['English'];

  recognitionInstance = new SpeechRecognition();
  recognitionInstance.continuous = true;
  recognitionInstance.interimResults = true;
  recognitionInstance.lang = langConfig.code; // Dynamic BCP 47 code e.g. ta-IN, te-IN, hi-IN

  recognitionInstance.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    const currentText = finalTranscript || interimTranscript;
    if (currentText) {
      onResult(currentText, Boolean(finalTranscript));
    }
  };

  recognitionInstance.onerror = (event: any) => {
    console.warn('Speech recognition error:', event.error);
    onError(event.error || 'Error recording audio');
  };

  recognitionInstance.onend = () => {
    onEnd();
  };

  try {
    recognitionInstance.start();
  } catch (err: any) {
    onError(err.message || 'Failed to start microphone');
  }
}

export function stopSpeechRecognition() {
  if (recognitionInstance) {
    try {
      recognitionInstance.stop();
    } catch (e) {
      // ignore
    }
  }
}

export function speakText(text: string, languageName: string = 'English', onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  const langConfig = SUPPORTED_LANGUAGES[languageName] || SUPPORTED_LANGUAGES['English'];
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = langConfig.voiceLang;
  utterance.rate = 0.95;

  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.toLowerCase().includes(langConfig.code.toLowerCase()));
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
