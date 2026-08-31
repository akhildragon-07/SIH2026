'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Sparkles, User, Bot, Check, ArrowRight, AlertCircle, Languages, RefreshCw, CheckCircle2, MapPin, GraduationCap, Briefcase, Award } from 'lucide-react';
import { BeneficiaryProfile, ChatMessage } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';
import { startSpeechRecognition, stopSpeechRecognition, speakText, stopSpeechSynthesis, SUPPORTED_LANGUAGES, isSpeechRecognitionSupported } from '@/lib/speech';
import { extractProfileFromText } from '@/lib/ai-engine';

interface VoiceAssistantProps {
  currentProfile: Partial<BeneficiaryProfile>;
  onProfileUpdated: (updatedProfile: Partial<BeneficiaryProfile>) => void;
  onGeneratePlan: () => void;
}

type StageType = 'name_age' | 'education' | 'skills_exp' | 'location' | 'livelihood_goal' | 'complete';

const STAGE_LABELS: Record<StageType, { step: number; title: string; desc: string }> = {
  name_age: { step: 1, title: 'Name & Age', desc: 'Personal info' },
  education: { step: 2, title: 'Education', desc: 'Highest qualification' },
  skills_exp: { step: 3, title: 'Skills & Exp', desc: 'Trade & Experience' },
  location: { step: 4, title: 'Location', desc: 'State & District' },
  livelihood_goal: { step: 5, title: 'Career Goal', desc: 'Job or Self-employment' },
  complete: { step: 6, title: 'Account Ready', desc: 'NSQF Mapped' }
};

const INITIAL_WELCOME: Record<string, { welcome: string; prompts: string[] }> = {
  'Tamil': {
    welcome: "வணக்கம்! நான் சக்ஷம் AI, PM-AJAY திட்டத்தின் குரல் வழிகாட்டி. உங்கள் முழு பெயர் மற்றும் வயதை சொல்லுங்கள்.",
    prompts: ["யஷ்வந்த், 24", "என் பேரு குமார், வயது 28", "என் பெயர் சுனிதா, வயது 26"]
  },
  'Telugu': {
    welcome: "నమస్తే! నేను సాక్షమ్ AI, PM-AJAY వాయిస్ గైడ్. దయచేసి మీ పూర్తి పేరు మరియు వయస్సు చెప్పండి.",
    prompts: ["అఖిల్, 24", "నా పేరు రవి కుమార్, వయస్సు 26", "నా పేరు మనీష్, వయస్సు 22"]
  },
  'Hindi': {
    welcome: "नमस्ते! मैं सक्षम AI हूँ, पीएम-अजय योजना के तहत आपका आवाज़ सहायक। कृपया अपना पूरा नाम और उम्र बताएं।",
    prompts: ["राहुल, 25", "मेरा नाम रवि कुमार, उम्र 26 वर्ष", "मेरा नाम सुनीता देवी, उम्र 32 वर्ष"]
  },
  'Marathi': {
    welcome: "नमस्ते! मी सक्षम-AI आहे, PM-AJAY योजनेतील तुमचा व्हॉईस मार्गदर्शक. कृपया आपले पूर्ण नाव आणि वय सांगा.",
    prompts: ["सचिन, 24", "माझे नाव राहुल, वय 26 वर्षे", "माझे नाव सुनिता, वय 30 वर्षे"]
  },
  'English': {
    welcome: "Namaste! I am SakshamAI, your PM-AJAY voice guide. Please tell me your full name and age.",
    prompts: ["Yashwant, 24", "My name is Yashwant, age 24", "Hey I'm Akhil, age 26"]
  }
};

export default function VoiceAssistant({ currentProfile, onProfileUpdated, onGeneratePlan }: VoiceAssistantProps) {
  const { registerBeneficiary, profile } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [currentStage, setCurrentStage] = useState<StageType>('name_age');
  const [inputText, setInputText] = useState('');
  const [liveSpokenTranscript, setLiveSpokenTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isLoadingReply, setIsLoadingReply] = useState(false);

  const activeLangConfig = SUPPORTED_LANGUAGES[selectedLanguage] || SUPPORTED_LANGUAGES['English'];

  const getLangKey = (lang: string) => {
    if (lang.includes('Tamil') || lang.includes('தமிழ்') || lang.startsWith('ta')) return 'Tamil';
    if (lang.includes('Telugu') || lang.includes('తెలుగు') || lang.startsWith('te')) return 'Telugu';
    if (lang.includes('Hindi') || lang.includes('हिंदी') || lang.startsWith('hi')) return 'Hindi';
    if (lang.includes('Marathi') || lang.includes('मराठी') || lang.startsWith('mr')) return 'Marathi';
    return 'English';
  };

  const [activePrompts, setActivePrompts] = useState<string[]>(
    INITIAL_WELCOME[getLangKey(selectedLanguage)]?.prompts || INITIAL_WELCOME['English'].prompts
  );

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: INITIAL_WELCOME[getLangKey(selectedLanguage)]?.welcome || INITIAL_WELCOME['English'].welcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLanguage,
      suggestedPrompts: INITIAL_WELCOME[getLangKey(selectedLanguage)]?.prompts || INITIAL_WELCOME['English'].prompts
    }
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRecording, liveSpokenTranscript]);

  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    if (isRecording) {
      stopSpeechRecognition();
      setIsRecording(false);
    }
    stopSpeechSynthesis();
    setIsPlayingAudio(false);

    const langKey = getLangKey(newLang);
    const welcomePack = INITIAL_WELCOME[langKey] || INITIAL_WELCOME['English'];
    setCurrentStage('name_age');
    setActivePrompts(welcomePack.prompts);

    const resetMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: welcomePack.welcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: newLang,
      suggestedPrompts: welcomePack.prompts
    };

    setMessages([resetMsg]);

    setIsPlayingAudio(true);
    speakText(welcomePack.welcome, newLang, () => {
      setIsPlayingAudio(false);
    });
  };

  useEffect(() => {
    return () => {
      stopSpeechRecognition();
      stopSpeechSynthesis();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  const startRecording = () => {
    if (!isSpeechRecognitionSupported()) {
      setSpeechError('Web Speech API is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari, or click the sample phrases below.');
      return;
    }

    setSpeechError(null);
    setLiveSpokenTranscript('');
    setIsRecording(true);

    startSpeechRecognition(
      (transcript, _isFinal) => {
        setLiveSpokenTranscript(transcript);
        setInputText(transcript);

        if (transcript.trim().length > 3) {
          const liveExtracted = extractProfileFromText(transcript, currentProfile);
          onProfileUpdated(liveExtracted);
        }

        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = setTimeout(() => {
          if (transcript.trim().length > 3) {
            finishRecordingAndSend(transcript);
          }
        }, 3000);
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

  const finishRecordingAndSend = (finalText?: string) => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    const stoppedText = stopSpeechRecognition();
    setIsRecording(false);
    setAudioLevel(0);

    const textToSend = finalText || liveSpokenTranscript || stoppedText || inputText;
    if (textToSend && textToSend.trim()) {
      handleSendMessage(textToSend.trim());
    }
    setLiveSpokenTranscript('');
  };

  const toggleRecording = () => {
    if (isRecording) {
      finishRecordingAndSend();
    } else {
      startRecording();
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    stopSpeechRecognition();
    setIsRecording(false);
    setLiveSpokenTranscript('');

    const instantExtracted = extractProfileFromText(text, currentProfile);
    const mergedProfile = { ...currentProfile, ...instantExtracted };
    onProfileUpdated(mergedProfile);

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
          onProfileUpdated(updatedProfile);
        }
        if (stage) {
          setCurrentStage(stage);
        }
        if (suggestedPrompts) {
          setActivePrompts(suggestedPrompts);
        }

        const effectiveLang = serverLang || selectedLanguage;

        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: effectiveLang,
          suggestedPrompts: suggestedPrompts || activePrompts
        };

        setMessages((prev) => [...prev, assistantMsg]);

        setIsPlayingAudio(true);
        speakText(reply, effectiveLang, () => {
          setIsPlayingAudio(false);
        });
      }
    } catch (err) {
      console.error('Error contacting chat API:', err);
    } finally {
      setIsLoadingReply(false);
    }
  };

  const handlePlayTTS = (text: string, lang?: string) => {
    if (isPlayingAudio) {
      stopSpeechSynthesis();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakText(text, lang || selectedLanguage, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  const getLocalizedPlaceholder = () => {
    const l = selectedLanguage.toLowerCase();
    if (l.includes('tamil') || l.includes('தமிழ்')) return 'தமிழில் உங்கள் பதிலை சொல்லுங்கள் அல்லது இங்கே தட்டச்சு செய்யுங்கள்...';
    if (l.includes('telugu') || l.includes('తెలుగు')) return 'తెలుగులో మీ సమాధానం చెప్పండి లేదా ఇక్కడ టైప్ చేయండి...';
    if (l.includes('hindi') || l.includes('हिंदी')) return 'हिंदी में अपना उत्तर बोलें या यहाँ लिखें...';
    if (l.includes('marathi') || l.includes('मराठी')) return 'मराठीत आपले उत्तर सांगा किंवा येथे टाईप करा...';
    return 'Speak or type your answer in English...';
  };

  return (
    <div className="w-full mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col gap-5 border-b border-slate-800 pb-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
              <Sparkles size={14} />
              <span>Interactive AI Voice Assistant · 5 Regional Indian Languages</span>
            </div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold font-serif text-slate-100">
              PM-AJAY Voice Assistant
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Select your native language below. The assistant will ask questions and reply aloud in that language!
            </p>
          </div>

          <button
            onClick={onGeneratePlan}
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            <span>View Mapped Pathway</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
          <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-2">
            <Languages size={15} className="text-emerald-400" />
            <span>Choose Language:</span>
          </span>

          {[
            { key: 'தமிழ்', label: 'தமிழ் (Tamil)', flag: '🇮🇳' },
            { key: 'తెలుగు', label: 'తెలుగు (Telugu)', flag: '🇮🇳' },
            { key: 'हिंदी', label: 'हिंदी (Hindi)', flag: '🇮🇳' },
            { key: 'मराठी', label: 'मराठी (Marathi)', flag: '🇮🇳' },
            { key: 'English', label: 'English', flag: '🌐' }
          ].map((langItem) => {
            const isSelected =
              selectedLanguage === langItem.key ||
              getLangKey(selectedLanguage) === getLangKey(langItem.key);

            return (
              <button
                key={langItem.key}
                onClick={() => handleLanguageChange(langItem.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 scale-[1.02] ring-2 ring-emerald-400'
                    : 'bg-slate-900/90 text-slate-300 border border-slate-700/80 hover:bg-slate-800 hover:text-emerald-300'
                }`}
              >
                <span>{langItem.flag}</span>
                <span>{langItem.label}</span>
                {isSelected && <Check size={13} className="stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6">
        {(Object.keys(STAGE_LABELS) as StageType[]).map((stageKey) => {
          const info = STAGE_LABELS[stageKey];
          const isCurrent = currentStage === stageKey;
          const isPassed = STAGE_LABELS[currentStage].step > info.step;

          return (
            <div
              key={stageKey}
              className={`p-3 rounded-2xl border text-center transition-all ${
                isCurrent
                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300 ring-2 ring-emerald-500/30 shadow-md'
                  : isPassed
                  ? 'border-emerald-500/40 bg-slate-900/60 text-slate-300'
                  : 'border-slate-800/80 bg-slate-950/40 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 text-xs font-bold">
                {isPassed ? (
                  <Check size={13} className="text-emerald-400 font-bold" />
                ) : (
                  <span className="size-4 rounded-full bg-slate-800 text-[10px] grid place-items-center">{info.step}</span>
                )}
                <span className="truncate">{info.title}</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5 truncate">{info.desc}</span>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        <div className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden min-h-[600px]">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 p-4 px-6">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 shadow-inner">
                <Bot size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-200">SakshamAI Voice Guide</p>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-semibold">
                  <span className={`size-2 rounded-full ${isRecording ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
                  {isRecording ? (
                    <span className="text-rose-400 font-bold">Listening in {activeLangConfig.nativeName}...</span>
                  ) : (
                    <span>Speaking & Listening in {activeLangConfig.nativeName} ({activeLangConfig.code})</span>
                  )}
                </p>
              </div>
            </div>

            {isPlayingAudio && (
              <button
                onClick={() => {
                  stopSpeechSynthesis();
                  setIsPlayingAudio(false);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
              >
                <VolumeX size={14} /> Mute Voice
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 max-w-[90%] ${isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                >
                  <div
                    className={`size-8 rounded-full grid place-items-center text-xs shrink-0 ${
                      isAssistant ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-200'
                    }`}
                  >
                    {isAssistant ? <Bot size={15} /> : <User size={15} />}
                  </div>
                  <div>
                    <div
                      className={`p-4 rounded-3xl text-sm leading-relaxed ${
                        isAssistant
                          ? 'bg-slate-800/90 text-slate-100 border border-slate-700/60 rounded-tl-sm'
                          : 'bg-emerald-600 text-slate-950 font-medium rounded-tr-sm'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>

                    {isAssistant && (
                      <div className="flex items-center gap-3 mt-1.5 px-1">
                        <button
                          onClick={() => handlePlayTTS(msg.text, msg.language)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                        >
                          <Volume2 size={13} />
                          <span>🔊 Listen ({msg.language || selectedLanguage})</span>
                        </button>
                        <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoadingReply && (
              <div className="flex items-center gap-2 text-xs text-slate-400 italic">
                <RefreshCw size={14} className="animate-spin text-emerald-400" />
                <span>SakshamAI is mapping your skills & recommendations...</span>
              </div>
            )}

            {/* Live Speech Recognition Preview Bubble */}
            {isRecording && (
              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                  <div className="flex items-center gap-2">
                    <Mic size={15} className="animate-pulse text-rose-400" />
                    <span>Live Speech Recognition:</span>
                  </div>
                  <span className="text-[11px] text-slate-400">Speak freely · auto-send on pause</span>
                </div>
                <p className="text-sm font-medium text-slate-100 min-h-[24px]">
                  {liveSpokenTranscript || (
                    <span className="text-slate-500 italic">Listening... start speaking into your microphone now</span>
                  )}
                </p>
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] text-amber-300">
                    <span>Mic Activity:</span>
                    <div className="h-2 w-24 rounded-full bg-slate-950 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 transition-all duration-100"
                        style={{ width: `${Math.max(10, audioLevel)}%` }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => finishRecordingAndSend()}
                    className="rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1 text-xs font-bold transition-all"
                  >
                    Done Speaking & Send
                  </button>
                </div>
              </div>
            )}

            {/* Quick Regional Voice Prompt Pills for Current Step */}
            <div className="rounded-2xl bg-slate-950/80 p-4 border border-slate-800 space-y-2.5">
              <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles size={14} /> Quick voice prompts for Step {STAGE_LABELS[currentStage].step} ({activeLangConfig.nativeName}):
              </p>
              <div className="flex flex-wrap gap-2">
                {activePrompts.map((phrase, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(phrase)}
                    className="rounded-xl bg-slate-900 hover:bg-emerald-950/80 text-emerald-300 hover:text-emerald-200 border border-slate-700/80 px-3.5 py-1.5 text-xs font-semibold transition-all hover:scale-[1.01]"
                  >
                    🗣️ "{phrase}"
                  </button>
                ))}
              </div>
            </div>

            {speechError && (
              <div className="flex items-start gap-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 text-rose-300 text-xs leading-relaxed">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Microphone Note</p>
                  <p className="mt-0.5">{speechError}</p>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Controls & Waveform */}
          <div className="border-t border-slate-800 bg-slate-950/80 p-4 space-y-3">
            {/* Live Audio Visualizer Bars */}
            <div className="flex items-center justify-center gap-1 py-1">
              {Array.from({ length: 32 }).map((_, i) => {
                const dynamicHeight = isRecording
                  ? Math.max(6, Math.min(32, Math.round((audioLevel / 100) * 30 * Math.sin((i / 32) * Math.PI) + 6)))
                  : 6;
                return (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all duration-100 ${
                      isRecording ? (audioLevel > 15 ? 'bg-emerald-400' : 'bg-amber-400') : 'bg-slate-800'
                    }`}
                    style={{ height: `${dynamicHeight}px` }}
                  />
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleRecording}
                className={`relative grid size-12 place-items-center rounded-2xl transition-all shadow-lg shrink-0 ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-500/30'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
                title={isRecording ? 'Click to Stop and Send' : `Record Voice in ${selectedLanguage}`}
              >
                {isRecording ? <MicOff size={22} /> : <Mic size={22} />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={getLocalizedPlaceholder()}
                className="flex-1 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3.5 text-sm text-slate-100 outline-none focus:border-emerald-500/60 placeholder:text-slate-500"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="grid size-12 place-items-center rounded-2xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 disabled:opacity-40 transition-all shrink-0 shadow-md"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Extracted Profile & Account Preview */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-7 shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={16} />
                <span>Live Extracted Profile</span>
              </div>
              <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full font-bold">
                Step {STAGE_LABELS[currentStage].step} of 5
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {/* Name & Age */}
              <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <User size={14} className="text-emerald-400" />
                    <span>Beneficiary Name & Age</span>
                  </p>
                  {currentProfile.name && !['Ravi Kumar', 'Sunil', 'Demo User'].includes(currentProfile.name) && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                      <CheckCircle2 size={12} /> Verified
                    </span>
                  )}
                </div>
                <p className="text-base font-bold text-slate-100 mt-1 flex items-center justify-between">
                  <span>{currentProfile.name || <span className="text-slate-500 font-normal italic">Waiting for name...</span>}</span>
                  {currentProfile.age && (
                    <span className="text-xs font-semibold text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      Age: {currentProfile.age} yrs
                    </span>
                  )}
                </p>
              </div>

              {/* State & District */}
              <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <MapPin size={14} className="text-sky-400" />
                    <span>State & District</span>
                  </p>
                  {currentProfile.district && currentProfile.state && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-sky-400 font-bold bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/30">
                      <CheckCircle2 size={12} /> Captured
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-slate-100 mt-1">
                  {currentProfile.district || currentProfile.state ? (
                    <span className="text-sky-300">{currentProfile.district ? `${currentProfile.district}, ` : ''}{currentProfile.state || ''}</span>
                  ) : (
                    <span className="text-slate-500 font-normal italic">Waiting for state & district...</span>
                  )}
                </p>
              </div>

              {/* Education & Preferred Goal */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-950/60 p-3.5 border border-slate-800/80">
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <GraduationCap size={13} className="text-purple-400" />
                    <span>Education</span>
                  </p>
                  <p className="text-sm font-bold text-purple-300 mt-1">
                    {currentProfile.education || <span className="text-slate-500 font-normal italic text-xs">Waiting...</span>}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950/60 p-3.5 border border-slate-800/80">
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Briefcase size={13} className="text-amber-400" />
                    <span>Preference</span>
                  </p>
                  <p className="text-sm font-bold text-amber-400 mt-1">
                    {currentProfile.preferredLivelihood || <span className="text-slate-500 font-normal italic text-xs">Waiting...</span>}
                  </p>
                </div>
              </div>

              {/* Skills & Experience */}
              <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                    <Award size={14} className="text-emerald-400" />
                    <span>Skills & Trade Experience</span>
                  </p>
                  {currentProfile.workExperienceYears !== undefined && currentProfile.workExperienceYears > 0 && (
                    <span className="text-[11px] font-bold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                      {currentProfile.workExperienceYears} Years Exp
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.existingSkills && currentProfile.existingSkills.length > 0 ? (
                    currentProfile.existingSkills.map((sk) => (
                      <span
                        key={sk}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300"
                      >
                        <CheckCircle2 size={13} className="text-emerald-400" /> {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No skills extracted yet. Speak your experience!</span>
                  )}
                </div>
              </div>

              {currentProfile.careerGoal && (
                <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80">
                  <p className="text-xs font-bold text-slate-400">Career Goal & PM-AJAY Path</p>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                    "{currentProfile.careerGoal}"
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
            <button
              onClick={async () => {
                if (currentProfile.name && !['Ravi Kumar', 'Sunil', 'Demo User'].includes(currentProfile.name)) {
                  const fullProf: BeneficiaryProfile = {
                    ...profile,
                    ...currentProfile,
                    id: currentProfile.id || `ben-${Date.now()}`,
                    name: currentProfile.name,
                    phone: currentProfile.phone || '9848022338',
                    email: currentProfile.email || `${currentProfile.name.toLowerCase().replace(/\s+/g, '.')}@pmajay.gov.in`,
                    category: currentProfile.category || 'Scheduled Caste (SC)',
                    age: currentProfile.age || 24,
                    gender: currentProfile.gender || 'Male',
                    state: currentProfile.state || 'Tamil Nadu',
                    district: currentProfile.district || 'Theni',
                    areaType: currentProfile.areaType || 'Rural',
                    education: currentProfile.education || '10th Pass',
                    currentOccupation: currentProfile.currentOccupation || (currentProfile.existingSkills?.[0] ? `${currentProfile.existingSkills[0]} Worker` : 'Trainee'),
                    existingSkills: currentProfile.existingSkills && currentProfile.existingSkills.length > 0 ? currentProfile.existingSkills : ['Plumbing & Pipe Fitting'],
                    workExperienceYears: currentProfile.workExperienceYears || 2,
                    monthlyIncome: currentProfile.monthlyIncome || '₹5,000 – ₹8,000',
                    preferredLivelihood: currentProfile.preferredLivelihood || 'Job',
                    interests: currentProfile.interests || ['Skill Certification', 'PM-AJAY Employment'],
                    careerGoal: currentProfile.careerGoal || `Pursue career in ${currentProfile.existingSkills?.[0] || 'Technical Trades'} with PM-AJAY support.`
                  };
                  await registerBeneficiary(fullProf);
                }
                onGeneratePlan();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 px-6 py-4 font-bold text-sm transition-all shadow-xl shadow-emerald-500/20 hover:scale-[1.01]"
            >
              <span>Confirm & Generate Livelihood Plan</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


