'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Send,
  Sparkles,
  User,
  Bot,
  Check,
  ArrowRight,
  AlertCircle,
  Languages,
  RefreshCw,
  CheckCircle2,
  MapPin,
  GraduationCap,
  Briefcase,
  Award,
  Key,
  LogIn,
  RotateCcw,
  ShieldCheck,
  CreditCard,
  ExternalLink,
  ChevronRight,
  Radio,
  Calendar,
  Wrench,
  Compass,
  FileCheck,
  CheckCircle,
  FileText
} from 'lucide-react';
import { BeneficiaryProfile, ChatMessage, AnalysisResponse, NSQFCourse, LivelihoodOpportunity, EducationLevel, LivelihoodType } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { useToast } from '@/components/ui/ToastProvider';
import {
  startSpeechRecognition,
  stopSpeechRecognition,
  speakText,
  stopSpeechSynthesis,
  SUPPORTED_LANGUAGES,
  isSpeechRecognitionSupported,
  resolveLanguageConfig
} from '@/lib/speech';
import {
  extractProfileFromText,
  extractVoiceCommandIntent,
  generateVerbalProfileSummary,
  generateSpokenRecommendationsSummary,
  analyzeBeneficiaryProfile
} from '@/lib/ai-engine';
import AiOrb, { AiOrbState } from './ui/AiOrb';
import VoiceRecordButton from './ui/VoiceRecordButton';

interface VoiceAssistantProps {
  currentProfile?: Partial<BeneficiaryProfile>;
  onProfileUpdated?: (updatedProfile: Partial<BeneficiaryProfile>) => void;
  onGeneratePlan?: () => void;
}

export type StageType =
  | 'name'
  | 'age'
  | 'dob'
  | 'education'
  | 'skills'
  | 'experience'
  | 'occupation'
  | 'location'
  | 'livelihood_goal'
  | 'confirm_summary'
  | 'complete';

interface StepMeta {
  step: number;
  title: string;
  shortDesc: string;
  fieldLabel: string;
}

const STAGE_METAS: Record<StageType, StepMeta> = {
  name: { step: 1, title: 'Full Name', shortDesc: 'Your Name', fieldLabel: 'Beneficiary Name' },
  age: { step: 2, title: 'Age', shortDesc: 'Your Age', fieldLabel: 'Age in Years' },
  dob: { step: 3, title: 'Date of Birth', shortDesc: 'Birth Date', fieldLabel: 'Date of Birth' },
  education: { step: 4, title: 'Highest Qualification', shortDesc: 'Education', fieldLabel: 'Education Level' },
  skills: { step: 5, title: 'Skills & Trade', shortDesc: 'Known Skills', fieldLabel: 'Vocational Skills' },
  experience: { step: 6, title: 'Work Experience', shortDesc: 'Years Exp', fieldLabel: 'Years of Experience' },
  occupation: { step: 7, title: 'Current Occupation', shortDesc: 'Current Work', fieldLabel: 'Current Occupation' },
  location: { step: 8, title: 'State & District', shortDesc: 'Location', fieldLabel: 'District & State' },
  livelihood_goal: { step: 9, title: 'Livelihood Goal', shortDesc: 'Job vs Grant', fieldLabel: 'Career Preference' },
  confirm_summary: { step: 10, title: 'Verbal Verification', shortDesc: 'Confirmation', fieldLabel: 'Summary Verification' },
  complete: { step: 11, title: 'Account Registered', shortDesc: 'NSQF Mapped', fieldLabel: 'Official Account' }
};

const INITIAL_WELCOME: Record<string, { welcome: string; prompts: string[] }> = {
  'English': {
    welcome: "Namaste! I am SakshamAI, your PM-AJAY voice guide. What is your full name?",
    prompts: ["My name is Satil", "My name is Ramesh", "Pooja Sharma"]
  },
  'Tamil': {
    welcome: "வணக்கம்! நான் சக்ஷம் AI, PM-AJAY திட்டத்தின் குரல் வழிகாட்டி. உங்கள் முழு பெயர் என்ன?",
    prompts: ["என் பெயர் சதீல்", "என் பெயர் முருகன்", "சுனிதா"]
  },
  'Telugu': {
    welcome: "నమస్తే! నేను సాక్షమ్ AI, PM-AJAY వాయిస్ గైడ్. మీ పూర్తి పేరు ఏమిటి?",
    prompts: ["నా పేరు సతీల్", "నా పేరు రమేష్", "సునీత"]
  },
  'Hindi': {
    welcome: "नमस्ते! मैं सक्षम AI हूँ, पीएम-अजय योजना के तहत आपका आवाज़ सहायक। आपका पूरा नाम क्या है?",
    prompts: ["मेरा नाम सतील है", "मेरा नाम राहुल है", "सुनीता देवी"]
  },
  'Kannada': {
    welcome: "ನಮಸ್ಕಾರ! ನಾನು ಸಕ್ಷಮ್ AI, PM-AJAY ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ. ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ಏನು?",
    prompts: ["ನನ್ನ ಹೆಸರು ಸತೀಲ್", "ಮಂಜುನಾಥ್", "ಸುನೀತಾ"]
  },
  'Malayalam': {
    welcome: "നമസ്കാരം! ഞാൻ സക്ഷം AI, PM-AJAY വോയ്‌സ് ഗൈഡ്. നിങ്ങളുടെ പൂർണ്ണ പേര് എന്താണ്?",
    prompts: ["എന്റെ പേര് സതീൽ", "വിഷ്ണു", "രമേഷ്"]
  },
  'Marathi': {
    welcome: "नमस्ते! मी सक्षम AI आहे, PM-AJAY योजनेतील तुमचा व्हॉईस मार्गदर्शक. आपले पूर्ण नाव काय आहे?",
    prompts: ["माझे नाव सतील आहे", "सचिन", "राहुल"]
  }
};

const EDUCATION_OPTIONS: EducationLevel[] = [
  'Below 8th',
  '8th Pass',
  '10th Pass',
  '12th Pass',
  'ITI / Diploma',
  'Graduate & Above'
];

const LOCALIZED_REPEAT_LABELS: Record<string, string> = {
  'Tamil': '🔊 மீண்டும் கேட்க (Listen)',
  'Telugu': '🔊 మళ్ళీ వినండి (Listen)',
  'Hindi': '🔊 दोबारा सुनें (Listen)',
  'Kannada': '🔊 ಮತ್ತೊಮ್ಮೆ ಕೇಳಿ (Listen)',
  'Malayalam': '🔊 വീണ്ടും കേൾക്കുക (Listen)',
  'Marathi': '🔊 पुन्हा ऐका (Listen)',
  'English': '🔊 Repeat Voice'
};

export default function VoiceAssistant({
  currentProfile,
  onProfileUpdated,
  onGeneratePlan
}: VoiceAssistantProps) {
  const { registerBeneficiary, login, profile: userProfile } = useAuth();
  const { showToast } = useToast();

  // Clean empty conversation profile (Strictly NO mock / demo fallbacks)
  const [convProfile, setConvProfile] = useState<Partial<BeneficiaryProfile>>({
    name: undefined,
    age: undefined,
    dob: undefined,
    education: undefined,
    existingSkills: [],
    workExperienceYears: undefined,
    currentOccupation: undefined,
    district: undefined,
    state: undefined,
    preferredLivelihood: undefined,
    careerGoal: undefined
  });

  // Voice Interaction States
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [autoListenEnabled, setAutoListenEnabled] = useState<boolean>(true);

  // Workflow Stages: 1. name -> 2. age -> 3. dob -> 4. education -> 5. skills -> 6. experience -> 7. occupation -> 8. location -> 9. livelihood_goal -> 10. confirm_summary -> 11. complete
  const [currentStage, setCurrentStage] = useState<StageType>('name');
  const [inputText, setInputText] = useState('');
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isLoadingReply, setIsLoadingReply] = useState(false);
  const [showTypeInput, setShowTypeInput] = useState(false);

  // Analysis & Recommendation state
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [registeredUserAccount, setRegisteredUserAccount] = useState<BeneficiaryProfile | null>(null);
  const [isRegisteringAccount, setIsRegisteringAccount] = useState(false);

  // Returning User Modal State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginUserId, setLoginUserId] = useState('');
  const [loginDob, setLoginDob] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const activeLangConfig = resolveLanguageConfig(selectedLanguage);

  const getLangKey = (lang: string) => {
    const l = lang.toLowerCase();
    if (l.includes('tamil') || l.includes('தமிழ்') || l.startsWith('ta')) return 'Tamil';
    if (l.includes('telugu') || l.includes('తెలుగు') || l.startsWith('te')) return 'Telugu';
    if (l.includes('hindi') || l.includes('हिंदी') || l.startsWith('hi')) return 'Hindi';
    if (l.includes('kannada') || l.includes('ಕನ್ನಡ') || l.startsWith('kn')) return 'Kannada';
    if (l.includes('malayalam') || l.includes('മലയാളം') || l.startsWith('ml')) return 'Malayalam';
    if (l.includes('marathi') || l.includes('मराठी') || l.startsWith('mr')) return 'Marathi';
    return 'English';
  };

  const [activePrompts, setActivePrompts] = useState<string[]>(
    INITIAL_WELCOME[getLangKey(selectedLanguage)]?.prompts || INITIAL_WELCOME['English'].prompts
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'assistant',
      text: INITIAL_WELCOME[getLangKey(selectedLanguage)]?.welcome || INITIAL_WELCOME['English'].welcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLanguage,
      suggestedPrompts: INITIAL_WELCOME[getLangKey(selectedLanguage)]?.prompts || INITIAL_WELCOME['English'].prompts
    }
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const autoListenTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRecording, liveTranscript]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      stopSpeechRecognition();
      stopSpeechSynthesis();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      if (autoListenTimerRef.current) clearTimeout(autoListenTimerRef.current);
    };
  }, []);

  // Compute Completion Percentage
  const computeFormProgress = (): number => {
    let completedCount = 0;
    if (convProfile.name && convProfile.name.trim()) completedCount++;
    if (convProfile.age) completedCount++;
    if (convProfile.dob) completedCount++;
    if (convProfile.education) completedCount++;
    if (convProfile.existingSkills && convProfile.existingSkills.length > 0) completedCount++;
    if (convProfile.workExperienceYears !== undefined) completedCount++;
    if (convProfile.currentOccupation) completedCount++;
    if (convProfile.district || convProfile.state) completedCount++;
    if (convProfile.preferredLivelihood) completedCount++;

    return Math.round((completedCount / 9) * 100);
  };

  // Compute Current AiOrb State
  const computeOrbState = (): AiOrbState => {
    if (currentStage === 'complete' && analysisResult) return 'RECOMMENDING';
    if (isLoadingReply || isRegisteringAccount) return 'PROCESSING';
    if (currentStage === 'confirm_summary') return 'CONFIRMING';
    if (isPlayingAudio) return 'AI_SPEAKING';
    if (isRecording) return 'LISTENING';
    return 'IDLE';
  };

  // Language Change Handler
  const handleLanguageChange = async (newLang: string) => {
    setSelectedLanguage(newLang);
    if (isRecording) {
      stopSpeechRecognition();
      setIsRecording(false);
    }
    stopSpeechSynthesis();
    setIsPlayingAudio(false);
    if (autoListenTimerRef.current) clearTimeout(autoListenTimerRef.current);

    const langKey = getLangKey(newLang);
    const welcomePack = INITIAL_WELCOME[langKey] || INITIAL_WELCOME['English'];
    setActivePrompts(welcomePack.prompts);

    if (currentStage === 'name') {
      const resetMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: welcomePack.welcome,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: newLang,
        suggestedPrompts: welcomePack.prompts
      };
      setMessages([resetMsg]);
      speakAssistantText(welcomePack.welcome, newLang);
    } else {
      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: '',
            language: newLang,
            currentProfile: convProfile,
            stage: currentStage
          })
        });
        const json = await res.json();
        if (json.success && json.data) {
          const { reply, suggestedPrompts } = json.data;
          const switchMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            sender: 'assistant',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            language: newLang,
            suggestedPrompts: suggestedPrompts || []
          };
          setMessages((prev) => [...prev, switchMsg]);
          if (suggestedPrompts) setActivePrompts(suggestedPrompts);
          speakAssistantText(reply, newLang);
        }
      } catch (e) {
        showToast({ type: 'info', title: `Language: ${newLang}`, description: `Speaking & listening in ${newLang}` });
      }
    }
  };

  // Safe speak assistant text with auto-listen trigger on speech end
  const speakAssistantText = (text: string, langToUse?: string) => {
    stopSpeechSynthesis();
    setIsPlayingAudio(true);
    const targetLang = langToUse || selectedLanguage;

    speakText(text, targetLang, () => {
      setIsPlayingAudio(false);
      // Auto-listen loop: after AI finishes speaking, start microphone automatically
      if (autoListenEnabled && currentStage !== 'complete') {
        if (autoListenTimerRef.current) clearTimeout(autoListenTimerRef.current);
        autoListenTimerRef.current = setTimeout(() => {
          startRecording();
        }, 450);
      }
    });
  };

  // Speech Recognition Start
  const startRecording = () => {
    if (!isSpeechRecognitionSupported()) {
      setSpeechError('Web Speech API is not supported in this browser. Please use Chrome, Edge, or Safari, or click the sample phrases below.');
      return;
    }

    if (autoListenTimerRef.current) clearTimeout(autoListenTimerRef.current);
    stopSpeechSynthesis();
    setIsPlayingAudio(false);

    setSpeechError(null);
    setLiveTranscript('');
    setIsRecording(true);

    startSpeechRecognition(
      (transcript, _isFinal) => {
        setLiveTranscript(transcript);
        setInputText(transcript);

        // Immediate extraction to update local profile in real time on the form!
        if (transcript.trim().length > 1) {
          const liveExtracted = extractProfileFromText(transcript, convProfile);
          setConvProfile((prev) => ({ ...prev, ...liveExtracted }));
        }

        // Auto commit when beneficiary pauses speaking (2.6s silence)
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (transcript.trim().length > 1) {
            finishRecordingAndSend(transcript);
          }
        }, 2600);
      },
      (error) => {
        setSpeechError(`${error}`);
        setIsRecording(false);
        setAudioLevel(0);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      },
      () => {
        setIsRecording(false);
        setAudioLevel(0);
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      },
      selectedLanguage,
      (level) => {
        setAudioLevel(level);
      }
    );
  };

  // Finish Recording and Send
  const finishRecordingAndSend = (finalText?: string) => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    const stoppedText = stopSpeechRecognition();
    setIsRecording(false);
    setAudioLevel(0);

    const textToSend = finalText || liveTranscript || stoppedText || inputText;
    if (textToSend && textToSend.trim()) {
      handleSendMessage(textToSend.trim());
    }
    setLiveTranscript('');
  };

  // Toggle Recording
  const toggleRecording = () => {
    if (isRecording) {
      finishRecordingAndSend();
    } else {
      startRecording();
    }
  };

  // Main Conversational Message Dispatcher
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    if (autoListenTimerRef.current) clearTimeout(autoListenTimerRef.current);
    stopSpeechRecognition();
    setIsRecording(false);
    setLiveTranscript('');

    // Check voice command intents (e.g. Yes/No/Repeat/Change)
    const intent = extractVoiceCommandIntent(text);

    // Extract updated profile attributes from speech
    const instantExtracted = extractProfileFromText(text, convProfile);
    const mergedProfile: Partial<BeneficiaryProfile> = {
      ...convProfile,
      ...instantExtracted
    };

    setConvProfile(mergedProfile);
    if (onProfileUpdated) onProfileUpdated(mergedProfile);

    // Add user message to chat feed
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLanguage
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoadingReply(true);

    // Special Handling: If we are at confirm_summary stage
    if (currentStage === 'confirm_summary') {
      if (intent === 'CONFIRM_YES' || text.toLowerCase().includes('yes') || text.toLowerCase().includes('correct')) {
        await handleFinalAccountCreationAndAnalysis(mergedProfile);
        setIsLoadingReply(false);
        return;
      } else if (intent === 'CONFIRM_NO' || text.toLowerCase().includes('no') || text.toLowerCase().includes('change')) {
        setCurrentStage('skills');
        const retryMsgText = selectedLanguage === 'Tamil'
          ? "சரி, நீங்கள் எந்த விவரத்தை மாற்ற விரும்புகிறீர்கள்? உங்கள் திறன்கள், கல்வி, அல்லது மாவட்டத்தை சொல்லுங்கள்."
          : selectedLanguage === 'Telugu'
          ? "సరే, మీరు ఏ వివరాలను మార్చాలనుకుంటున్నారు? మీ నైపుణ్యాలు, చదువు లేదా జిల్లాను చెప్పండి."
          : selectedLanguage === 'Hindi'
          ? "ठीक है, आप कौन सा विवरण बदलना चाहते हैं? अपने कौशल, शिक्षा, या जिले का नाम बताएं।"
          : "Understood. What would you like to correct? You can tell me your age, skills, education, or location.";

        const asstMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: retryMsgText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: selectedLanguage,
          suggestedPrompts: ["Change skills", "Change age", "Change education", "Change location"]
        };
        setMessages((prev) => [...prev, asstMsg]);
        speakAssistantText(retryMsgText);
        setIsLoadingReply(false);
        return;
      }
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: selectedLanguage,
          currentProfile: mergedProfile,
          stage: currentStage
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const { reply, updatedProfile, stage, suggestedPrompts, language: serverLang } = json.data;

        if (updatedProfile) {
          setConvProfile(updatedProfile);
          if (onProfileUpdated) onProfileUpdated(updatedProfile);
        }
        if (stage) {
          setCurrentStage(stage);
        }
        if (suggestedPrompts) {
          setActivePrompts(suggestedPrompts);
        }

        const effectiveLang = serverLang || selectedLanguage;

        if (stage === 'complete') {
          await handleFinalAccountCreationAndAnalysis(updatedProfile || mergedProfile);
        } else {
          const assistantMsg: ChatMessage = {
            id: `asst-${Date.now()}`,
            sender: 'assistant',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            language: effectiveLang,
            suggestedPrompts: suggestedPrompts || activePrompts
          };

          setMessages((prev) => [...prev, assistantMsg]);
          speakAssistantText(reply, effectiveLang);
        }
      }
    } catch (err) {
      console.error('Error contacting chat API:', err);
      showToast({ type: 'error', title: 'Connection Error', description: 'Unable to reach SakshamAI service.' });
    } finally {
      setIsLoadingReply(false);
    }
  };

  // Final Registration, Backend Persistence & NSQF Analysis Workflow
  const handleFinalAccountCreationAndAnalysis = async (prof?: Partial<BeneficiaryProfile>) => {
    setIsRegisteringAccount(true);
    const targetProf = prof || convProfile;

    try {
      const fullProfileToRegister: Partial<BeneficiaryProfile> = {
        ...targetProf,
        name: targetProf.name || 'Beneficiary',
        age: targetProf.age || 24,
        dob: targetProf.dob || `15/06/${2026 - (targetProf.age || 24)}`,
        education: targetProf.education || '10th Pass',
        existingSkills: (targetProf.existingSkills && targetProf.existingSkills.length > 0)
          ? targetProf.existingSkills
          : ['Vocational Skills'],
        workExperienceYears: targetProf.workExperienceYears !== undefined ? targetProf.workExperienceYears : 1,
        currentOccupation: targetProf.currentOccupation || 'Self Employed',
        district: targetProf.district || 'Theni',
        state: targetProf.state || 'Tamil Nadu',
        preferredLivelihood: targetProf.preferredLivelihood || 'Self-employment'
      };

      // 1. Register with backend DB with unique name-based user ID & SHA-256 password
      const savedAccount = await registerBeneficiary(fullProfileToRegister);
      setRegisteredUserAccount(savedAccount);
      setConvProfile(savedAccount);
      if (onProfileUpdated) onProfileUpdated(savedAccount);

      // 2. Fetch official AI Analysis & NSQF recommendations
      const analysisRes = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: savedAccount })
      });

      const analysisJson = await analysisRes.json();
      const analysis: AnalysisResponse = (analysisJson.success && analysisJson.data)
        ? analysisJson.data
        : analyzeBeneficiaryProfile(savedAccount as BeneficiaryProfile);

      setAnalysisResult(analysis);
      setCurrentStage('complete');

      // 3. Spoken Recommendations Summary in Native Language
      const spokenRecommendation = generateSpokenRecommendationsSummary(analysis, selectedLanguage);

      const completionMsg: ChatMessage = {
        id: `asst-complete-${Date.now()}`,
        sender: 'assistant',
        text: spokenRecommendation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        language: selectedLanguage,
        suggestedPrompts: [
          selectedLanguage === 'Tamil' ? 'பயிற்சி விவரங்கள் காட்டு' : 'View NSQF Details',
          'Explore Full Roadmap',
          'View Beneficiary Card'
        ]
      };

      setMessages((prev) => [...prev, completionMsg]);
      speakAssistantText(spokenRecommendation, selectedLanguage);

      showToast({
        type: 'success',
        title: 'Beneficiary Account Registered!',
        description: `User ID: ${savedAccount.userId} · Password: DOB (${savedAccount.dob})`
      });

    } catch (err) {
      console.error('Failed to complete onboarding & analysis:', err);
      showToast({ type: 'error', title: 'Registration Error', description: 'Could not persist account.' });
    } finally {
      setIsRegisteringAccount(false);
    }
  };

  // Returning User Login Handler
  const handleReturningUserLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!loginUserId.trim()) {
      setLoginError('Please enter or speak your User ID (e.g. "satil")');
      return;
    }

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const success = await login(loginUserId.trim(), loginDob.trim());
      if (success) {
        showToast({
          type: 'success',
          title: 'Welcome Back!',
          description: `Logged in as ${loginUserId}. Mapped recommendations loaded.`
        });
        setShowLoginModal(false);
        if (onGeneratePlan) onGeneratePlan();
      } else {
        setLoginError('User ID or DOB does not match. Please verify.');
      }
    } catch (err) {
      setLoginError('Login failed. Please check network connection.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Repeat TTS Audio Handler
  const handlePlayTTS = (text: string, lang?: string) => {
    if (isPlayingAudio) {
      stopSpeechSynthesis();
      setIsPlayingAudio(false);
    } else {
      speakAssistantText(text, lang || selectedLanguage);
    }
  };

  // Jump to specific form step
  const handleJumpToStep = (stage: StageType) => {
    setCurrentStage(stage);
    const meta = STAGE_METAS[stage];
    showToast({ type: 'info', title: `Step ${meta.step}: ${meta.title}`, description: 'Speak or edit this field' });
  };

  const progressPercent = computeFormProgress();

  return (
    <div className="w-full mx-auto max-w-7xl px-4 py-6 space-y-6">
      {/* Top Header & 7-Language Switcher Toolbar */}
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              <Sparkles size={14} />
              <span>Voice-Guided Auto-Filling Digital Registration · 7 Indian Languages</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold font-serif text-slate-100">
              PM-AJAY Interactive Voice Registration
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Speak one-by-one in your native language. The AI assistant automatically fills your government beneficiary form in real-time.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-1.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-4 py-2 text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <LogIn size={14} className="text-emerald-400" />
              <span>Returning User Login</span>
            </button>

            {onGeneratePlan && (
              <button
                onClick={onGeneratePlan}
                className="flex items-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2 text-xs font-bold transition-all shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                <span>View Full Roadmap</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* 7-Language Switcher Bar */}
        <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-2">
            <Languages size={15} className="text-emerald-400" />
            <span>Select Language:</span>
          </span>

          {[
            { key: 'English', label: 'English', flag: '🌐' },
            { key: 'தமிழ்', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
            { key: 'తెలుగు', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
            { key: 'हिंदी', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
            { key: 'ಕನ್ನಡ', label: 'ಕನ್ನಡ (Kannada)', flag: '🇮🇳' },
            { key: 'മലയാളം', label: 'മലയാളം (Malayalam)', flag: '🇮🇳' },
            { key: 'मराठी', label: 'मराठी (Marathi)', flag: '🇮🇳' }
          ].map((langItem) => {
            const isSelected =
              selectedLanguage === langItem.key ||
              getLangKey(selectedLanguage) === getLangKey(langItem.key);

            return (
              <button
                key={langItem.key}
                onClick={() => handleLanguageChange(langItem.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 scale-[1.02] ring-2 ring-emerald-400'
                    : 'bg-slate-900/90 text-slate-300 border border-slate-700/80 hover:bg-slate-800 hover:text-emerald-300'
                }`}
              >
                <span>{langItem.flag}</span>
                <span>{langItem.label}</span>
                {isSelected && <Check size={12} className="stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Dual-Panel Interactive Workspace */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr] items-start">
        {/* LEFT PANEL: SakshamAI Voice Conversational Guide */}
        <div className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/95 shadow-2xl overflow-hidden min-h-[660px]">
          {/* Header Status Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 p-4 px-5">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 shadow-inner">
                <Bot size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-200">SakshamAI Voice Assistant</p>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-semibold">
                  <span
                    className={`size-2 rounded-full ${
                      isRecording ? 'bg-rose-500 animate-ping' : isPlayingAudio ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                    }`}
                  />
                  {isRecording ? (
                    <span className="text-rose-400 font-bold">Listening in {activeLangConfig.nativeName}...</span>
                  ) : isPlayingAudio ? (
                    <span className="text-amber-300 font-bold">Speaking in {activeLangConfig.nativeName}...</span>
                  ) : (
                    <span>Ready ({activeLangConfig.nativeName})</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setAutoListenEnabled(!autoListenEnabled)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                  autoListenEnabled
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}
                title="When enabled, mic starts automatically after AI finishes speaking"
              >
                <Radio size={11} className={autoListenEnabled ? 'animate-pulse text-emerald-400' : ''} />
                <span>Auto-Listen: {autoListenEnabled ? 'ON' : 'OFF'}</span>
              </button>

              {isPlayingAudio && (
                <button
                  onClick={() => {
                    stopSpeechSynthesis();
                    setIsPlayingAudio(false);
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
                >
                  <VolumeX size={12} /> Mute
                </button>
              )}
            </div>
          </div>

          {/* Glowing Hero AiOrb */}
          <div className="p-4 bg-gradient-to-b from-slate-950/60 to-transparent border-b border-slate-800/60 flex flex-col items-center">
            <AiOrb
              state={computeOrbState()}
              audioLevel={audioLevel}
              onClick={toggleRecording}
              size="md"
              subtitle={
                isRecording
                  ? `Listening to your response in ${activeLangConfig.nativeName}...`
                  : isPlayingAudio
                  ? `Asking question in ${activeLangConfig.nativeName}...`
                  : currentStage === 'confirm_summary'
                  ? 'All details collected! Say "Yes" to confirm or "No" to change.'
                  : currentStage === 'complete'
                  ? 'Account registered! Matched NSQF courses ready.'
                  : `Currently collecting: ${STAGE_METAS[currentStage].title}`
              }
            />

            {/* Direct Voice & Audio Action Bar for Low Literacy */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => {
                  const lastAsst = [...messages].reverse().find((m) => m.sender === 'assistant');
                  if (lastAsst) {
                    handlePlayTTS(lastAsst.text, lastAsst.language || selectedLanguage);
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer shadow-sm ${
                  isPlayingAudio
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse ring-2 ring-amber-400/30'
                    : 'bg-slate-800/90 hover:bg-slate-700/90 border-slate-700 text-slate-200 hover:text-emerald-300'
                }`}
              >
                {isPlayingAudio ? (
                  <>
                    <VolumeX size={13} className="text-amber-400" />
                    <span>Stop Audio / ஆடியோ நிறுத்து</span>
                  </>
                ) : (
                  <>
                    <Volume2 size={13} className="text-emerald-400" />
                    <span>
                      {selectedLanguage === 'Tamil'
                        ? '🔊 கேள்வி கேட்க (Listen Question)'
                        : selectedLanguage === 'Telugu'
                        ? '🔊 ప్రశ్న వినండి (Listen Question)'
                        : selectedLanguage === 'Hindi'
                        ? '🔊 प्रश्न सुनें (Listen Question)'
                        : '🔊 Listen to Question'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Live Voice Input Text Bar */}
            {isRecording && (
              <div className="mt-2 w-full max-w-md p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-center animate-in fade-in zoom-in-95 duration-200">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Live Voice Input</span>
                <p className="text-sm font-semibold text-slate-100 mt-1 italic">
                  "{liveTranscript || 'Listening for speech...'}"
                </p>
              </div>
            )}
          </div>

          {/* Conversation Log Feed */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 max-h-[300px]">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[92%] ${isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  <div
                    className={`size-7 rounded-full grid place-items-center text-xs shrink-0 ${
                      isAssistant ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isAssistant ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  <div>
                    <div
                      className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isAssistant
                          ? 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-sm'
                          : 'bg-emerald-600 text-slate-950 font-semibold rounded-tr-sm'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>

                    {isAssistant && (
                      <div className="flex items-center gap-3 mt-1 px-1">
                        <button
                          onClick={() => handlePlayTTS(msg.text, msg.language)}
                          className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          <Volume2 size={12} className="text-emerald-400" />
                          <span>{LOCALIZED_REPEAT_LABELS[getLangKey(msg.language || selectedLanguage)] || '🔊 Repeat Voice'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoadingReply && (
              <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                <RefreshCw size={13} className="animate-spin text-emerald-400" />
                <span>SakshamAI is processing your answer in {activeLangConfig.nativeName}...</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Quick Spoken Answers (Tap to Answer) */}
          <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40">
            <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase tracking-wider">
              Quick One-Tap Answers:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activePrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSendMessage(p)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-emerald-500/20 hover:border-emerald-500/40 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-emerald-300 transition-all cursor-pointer text-left"
                >
                  {p}
                </button>
              ))}

              {currentStage === 'confirm_summary' && (
                <>
                  <button
                    type="button"
                    onClick={() => handleSendMessage('Yes, this is correct')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all shadow-md flex items-center gap-1"
                  >
                    <Check size={13} className="stroke-[3]" />
                    <span>Yes / சரி / అవును / हाँ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendMessage('No, I want to change details')}
                    className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all"
                  >
                    <span>No / இல்லை / కాదు / नहीं</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Mic Controller Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-col items-center gap-2.5">
            {speechError && (
              <div className="w-full flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                <AlertCircle size={14} className="shrink-0" />
                <span>{speechError}</span>
              </div>
            )}

            <VoiceRecordButton
              isRecording={isRecording}
              isProcessing={isLoadingReply || isRegisteringAccount}
              isComplete={currentStage === 'complete'}
              audioLevel={audioLevel}
              onToggleRecord={toggleRecording}
              onToggleTypeMode={() => setShowTypeInput(!showTypeInput)}
              isTypeModeActive={showTypeInput}
              languageName={activeLangConfig.nativeName}
            />

            {showTypeInput && (
              <div className="w-full flex items-center gap-2 pt-1 animate-in fade-in duration-200">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Type your answer in your language..."
                  className="flex-1 rounded-2xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:border-emerald-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  disabled={!inputText.trim()}
                  className="rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 p-2 transition-all cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANEL: Live Auto-Filling Digital PM-AJAY Beneficiary Form */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/95 shadow-2xl overflow-hidden p-5 sm:p-6 space-y-4">
          {/* Form Header with Live Progress Bar */}
          <div className="border-b border-slate-800 pb-3.5 space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-emerald-500/20 text-emerald-400 grid place-items-center">
                  <FileText size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold font-serif text-slate-100">
                    PM-AJAY GIA Application Form
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Auto-filling live as you answer each voice question
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  {progressPercent}% Complete
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 transition-all duration-500 shadow-md shadow-emerald-500/40"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Form Fields List (Strictly 1-by-1 Highlighted) */}
          <div className="space-y-3">
            {/* Field 1: Full Name */}
            <div
              onClick={() => handleJumpToStep('name')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                currentStage === 'name'
                  ? 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30 shadow-md'
                  : convProfile.name
                  ? 'border-emerald-500/40 bg-slate-950/70'
                  : 'border-slate-800 bg-slate-950/40 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User size={13} className="text-emerald-400" />
                  <span>1. Full Name</span>
                </label>
                {currentStage === 'name' ? (
                  <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 animate-pulse">
                    <span className="size-1.5 rounded-full bg-rose-400" /> Currently Asking
                  </span>
                ) : convProfile.name ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Captured
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Waiting for answer...</span>
                )}
              </div>
              <div className="text-sm font-bold text-slate-100">
                {convProfile.name || <span className="text-slate-500 italic text-xs">Waiting for voice input...</span>}
              </div>
            </div>

            {/* Field 2: Age */}
            <div
              onClick={() => handleJumpToStep('age')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                currentStage === 'age'
                  ? 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30 shadow-md'
                  : convProfile.age
                  ? 'border-emerald-500/40 bg-slate-950/70'
                  : 'border-slate-800 bg-slate-950/40 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar size={13} className="text-emerald-400" />
                  <span>2. Age</span>
                </label>
                {currentStage === 'age' ? (
                  <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 animate-pulse">
                    <span className="size-1.5 rounded-full bg-rose-400" /> Currently Asking
                  </span>
                ) : convProfile.age ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Captured
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Waiting for answer...</span>
                )}
              </div>
              <div className="text-sm font-bold text-slate-100">
                {convProfile.age ? `${convProfile.age} Years Old` : <span className="text-slate-500 italic text-xs">Waiting for voice input...</span>}
              </div>
            </div>

            {/* Field 3: Date of Birth */}
            <div
              onClick={() => handleJumpToStep('dob')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                currentStage === 'dob'
                  ? 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30 shadow-md'
                  : convProfile.dob
                  ? 'border-emerald-500/40 bg-slate-950/70'
                  : 'border-slate-800 bg-slate-950/40 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Calendar size={13} className="text-emerald-400" />
                  <span>3. Date of Birth (Password)</span>
                </label>
                {currentStage === 'dob' ? (
                  <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 animate-pulse">
                    <span className="size-1.5 rounded-full bg-rose-400" /> Currently Asking
                  </span>
                ) : convProfile.dob ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Captured
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Waiting for answer...</span>
                )}
              </div>
              <div className="text-sm font-bold text-slate-100 font-mono">
                {convProfile.dob || <span className="text-slate-500 italic text-xs font-sans">Waiting for voice input...</span>}
              </div>
            </div>

            {/* Field 4: Highest Education */}
            <div
              onClick={() => handleJumpToStep('education')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                currentStage === 'education'
                  ? 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30 shadow-md'
                  : convProfile.education
                  ? 'border-emerald-500/40 bg-slate-950/70'
                  : 'border-slate-800 bg-slate-950/40 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <GraduationCap size={13} className="text-emerald-400" />
                  <span>4. Highest Qualification</span>
                </label>
                {currentStage === 'education' ? (
                  <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 animate-pulse">
                    <span className="size-1.5 rounded-full bg-rose-400" /> Currently Asking
                  </span>
                ) : convProfile.education ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Captured
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Waiting for answer...</span>
                )}
              </div>
              <div className="text-sm font-bold text-slate-100">
                {convProfile.education || <span className="text-slate-500 italic text-xs">Waiting for voice input...</span>}
              </div>
            </div>

            {/* Field 5: Known Skills */}
            <div
              onClick={() => handleJumpToStep('skills')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                currentStage === 'skills'
                  ? 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30 shadow-md'
                  : convProfile.existingSkills && convProfile.existingSkills.length > 0
                  ? 'border-emerald-500/40 bg-slate-950/70'
                  : 'border-slate-800 bg-slate-950/40 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Wrench size={13} className="text-emerald-400" />
                  <span>5. Known Skills & Trade</span>
                </label>
                {currentStage === 'skills' ? (
                  <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 animate-pulse">
                    <span className="size-1.5 rounded-full bg-rose-400" /> Currently Asking
                  </span>
                ) : convProfile.existingSkills && convProfile.existingSkills.length > 0 ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Captured
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Waiting for answer...</span>
                )}
              </div>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {convProfile.existingSkills && convProfile.existingSkills.length > 0 ? (
                  convProfile.existingSkills.map((sk) => (
                    <span
                      key={sk}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-xs font-bold text-emerald-300"
                    >
                      <CheckCircle2 size={11} className="text-emerald-400" /> {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic text-xs">Waiting for voice input...</span>
                )}
              </div>
            </div>

            {/* Field 6: Experience */}
            <div
              onClick={() => handleJumpToStep('experience')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                currentStage === 'experience'
                  ? 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30 shadow-md'
                  : convProfile.workExperienceYears !== undefined
                  ? 'border-emerald-500/40 bg-slate-950/70'
                  : 'border-slate-800 bg-slate-950/40 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Briefcase size={13} className="text-emerald-400" />
                  <span>6. Years of Experience</span>
                </label>
                {currentStage === 'experience' ? (
                  <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 animate-pulse">
                    <span className="size-1.5 rounded-full bg-rose-400" /> Currently Asking
                  </span>
                ) : convProfile.workExperienceYears !== undefined ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Captured
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Waiting for answer...</span>
                )}
              </div>
              <div className="text-sm font-bold text-slate-100">
                {convProfile.workExperienceYears !== undefined ? `${convProfile.workExperienceYears} Years Experience` : <span className="text-slate-500 italic text-xs">Waiting for voice input...</span>}
              </div>
            </div>

            {/* Field 7: Current Occupation */}
            <div
              onClick={() => handleJumpToStep('occupation')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                currentStage === 'occupation'
                  ? 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30 shadow-md'
                  : convProfile.currentOccupation
                  ? 'border-emerald-500/40 bg-slate-950/70'
                  : 'border-slate-800 bg-slate-950/40 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Briefcase size={13} className="text-emerald-400" />
                  <span>7. Current Occupation</span>
                </label>
                {currentStage === 'occupation' ? (
                  <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 animate-pulse">
                    <span className="size-1.5 rounded-full bg-rose-400" /> Currently Asking
                  </span>
                ) : convProfile.currentOccupation ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Captured
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Waiting for answer...</span>
                )}
              </div>
              <div className="text-sm font-bold text-slate-100">
                {convProfile.currentOccupation || <span className="text-slate-500 italic text-xs">Waiting for voice input...</span>}
              </div>
            </div>

            {/* Field 8: Location */}
            <div
              onClick={() => handleJumpToStep('location')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                currentStage === 'location'
                  ? 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30 shadow-md'
                  : convProfile.district || convProfile.state
                  ? 'border-emerald-500/40 bg-slate-950/70'
                  : 'border-slate-800 bg-slate-950/40 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MapPin size={13} className="text-emerald-400" />
                  <span>8. Location (Town / District / State)</span>
                </label>
                {currentStage === 'location' ? (
                  <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 animate-pulse">
                    <span className="size-1.5 rounded-full bg-rose-400" /> Currently Asking
                  </span>
                ) : convProfile.district || convProfile.state ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Captured
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Waiting for answer...</span>
                )}
              </div>
              <div className="text-sm font-bold text-slate-100">
                {convProfile.district || convProfile.state ? (
                  <span>{convProfile.district || 'District'}, {convProfile.state || 'State'}</span>
                ) : (
                  <span className="text-slate-500 italic text-xs">Waiting for voice input...</span>
                )}
              </div>
            </div>

            {/* Field 9: Livelihood Goal */}
            <div
              onClick={() => handleJumpToStep('livelihood_goal')}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                currentStage === 'livelihood_goal'
                  ? 'border-emerald-500 bg-emerald-500/15 ring-2 ring-emerald-500/30 shadow-md'
                  : convProfile.preferredLivelihood
                  ? 'border-emerald-500/40 bg-slate-950/70'
                  : 'border-slate-800 bg-slate-950/40 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-0.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Compass size={13} className="text-emerald-400" />
                  <span>9. Livelihood Goal</span>
                </label>
                {currentStage === 'livelihood_goal' ? (
                  <span className="text-[10px] font-bold text-rose-400 flex items-center gap-1 animate-pulse">
                    <span className="size-1.5 rounded-full bg-rose-400" /> Currently Asking
                  </span>
                ) : convProfile.preferredLivelihood ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Captured
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500">Waiting for answer...</span>
                )}
              </div>
              <div className="text-sm font-bold text-amber-300">
                {convProfile.preferredLivelihood ? (
                  <span>
                    {convProfile.preferredLivelihood === 'Self-employment'
                      ? 'Self-employment (100% PM-AJAY Toolkit Grant)'
                      : 'Salaried Job in a Company'}
                  </span>
                ) : (
                  <span className="text-slate-500 italic text-xs">Waiting for voice input...</span>
                )}
              </div>
            </div>
          </div>

          {/* Form Action: Register Account Button */}
          <div className="pt-2 border-t border-slate-800 space-y-2">
            {registeredUserAccount ? (
              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 space-y-2 animate-in zoom-in-95 duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <ShieldCheck size={13} /> Official Beneficiary Registered
                  </span>
                  <span className="text-[10px] font-mono text-slate-300">DB Synced</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-sans">User ID (Voice Login)</span>
                    <strong className="text-emerald-300">{registeredUserAccount.userId}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-sans">DOB Password</span>
                    <strong className="text-slate-200">{registeredUserAccount.dob?.replace(/\D/g, '') || '15062000'}</strong>
                  </div>
                </div>
                {onGeneratePlan && (
                  <button
                    onClick={onGeneratePlan}
                    className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 py-2.5 text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <span>Explore Personalized NSQF Pathway</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleFinalAccountCreationAndAnalysis()}
                disabled={isRegisteringAccount || progressPercent < 40}
                className={`w-full flex items-center justify-center gap-2 rounded-2xl py-3 px-4 text-xs sm:text-sm font-bold transition-all shadow-xl cursor-pointer ${
                  progressPercent >= 80
                    ? 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 text-slate-950 shadow-emerald-500/25 ring-2 ring-emerald-400/40 animate-pulse'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {isRegisteringAccount ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Registering Beneficiary Account in Database...</span>
                  </>
                ) : (
                  <>
                    <FileCheck size={15} />
                    <span>Register Account & Map Opportunities ({progressPercent}% Ready)</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Returning User Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-slate-100 font-bold">
                <LogIn size={18} className="text-emerald-400" />
                <span>Returning Beneficiary Login</span>
              </div>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Enter your lowercase name-based User ID and Date of Birth password (e.g. 15082002) to access your account.
            </p>

            {loginError && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {loginError}
              </div>
            )}

            <form onSubmit={handleReturningUserLogin} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  User ID (e.g. "satil")
                </label>
                <input
                  type="text"
                  value={loginUserId}
                  onChange={(e) => setLoginUserId(e.target.value.toLowerCase())}
                  placeholder="e.g. satil"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Password (Date of Birth e.g. 15082002 or 15/08/2002)
                </label>
                <input
                  type="text"
                  value={loginDob}
                  onChange={(e) => setLoginDob(e.target.value)}
                  placeholder="e.g. 15082002 or 15/08/2002"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowLoginModal(false)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2 text-xs font-bold transition-all shadow-md disabled:opacity-50"
                >
                  {isLoggingIn ? 'Verifying...' : 'Login & View Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
