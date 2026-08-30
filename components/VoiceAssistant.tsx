'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Sparkles, User, Bot, Check, ArrowRight, AlertCircle, Languages, RefreshCw, CheckCircle2, HelpCircle } from 'lucide-react';
import { BeneficiaryProfile, ChatMessage } from '@/lib/types';
import { startSpeechRecognition, stopSpeechRecognition, speakText, stopSpeechSynthesis, SUPPORTED_LANGUAGES, isSpeechRecognitionSupported } from '@/lib/speech';
import { extractProfileFromText } from '@/lib/ai-engine';

interface VoiceAssistantProps {
  currentProfile: Partial<BeneficiaryProfile>;
  onProfileUpdated: (updatedProfile: Partial<BeneficiaryProfile>) => void;
  onGeneratePlan: () => void;
}

export default function VoiceAssistant({ currentProfile, onProfileUpdated, onGeneratePlan }: VoiceAssistantProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('English');
  const [inputText, setInputText] = useState('');
  const [liveSpokenTranscript, setLiveSpokenTranscript] = useState('');
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isLoadingReply, setIsLoadingReply] = useState(false);

  const activeLangConfig = SUPPORTED_LANGUAGES[selectedLanguage] || SUPPORTED_LANGUAGES['English'];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Namaste! I am SakshamAI, your PM-AJAY voice guide. Speak in your language (English, हिंदी, తెలుగు, தமிழ், मराठी) to map your skills and find NSQF recommendations!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: 'English',
      suggestedPrompts: activeLangConfig.samplePhrases
    }
  ]);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRecording, liveSpokenTranscript]);

  // Clean up recording and speech on unmount
  useEffect(() => {
    return () => {
      stopSpeechRecognition();
      stopSpeechSynthesis();
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  // Handle Speech Recognition Toggle
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

        // Instant real-time profile extraction while speaking
        if (transcript.trim().length > 5) {
          const liveExtracted = extractProfileFromText(transcript, currentProfile);
          onProfileUpdated(liveExtracted);
        }

        // Reset silence timer on every spoken word
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

  // Handle Sending Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    stopSpeechRecognition();
    setIsRecording(false);
    setLiveSpokenTranscript('');

    // Instant local extraction
    const instantExtracted = extractProfileFromText(text, currentProfile);
    onProfileUpdated(instantExtracted);

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
          currentProfile: { ...currentProfile, ...instantExtracted }
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        const { reply, updatedProfile } = json.data;

        if (updatedProfile) {
          onProfileUpdated(updatedProfile);
        }

        const assistantMsg: ChatMessage = {
          id: `asst-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: selectedLanguage,
          suggestedPrompts: activeLangConfig.samplePhrases
        };

        setMessages((prev) => [...prev, assistantMsg]);

        // Speak reply using TTS
        setIsPlayingAudio(true);
        speakText(reply, selectedLanguage, () => {
          setIsPlayingAudio(false);
        });
      }
    } catch (err) {
      console.error('Error contacting chat API:', err);
    } finally {
      setIsLoadingReply(false);
    }
  };


  const handlePlayTTS = (text: string) => {
    if (isPlayingAudio) {
      stopSpeechSynthesis();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakText(text, selectedLanguage, () => {
        setIsPlayingAudio(false);
      });
    }
  };

  return (
    <div className="w-full mx-auto max-w-6xl px-4 py-8">
      {/* Top Title & Language Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <Sparkles size={14} />
            <span>AI Voice Engine · Hindi, Telugu, Tamil, Marathi & English</span>
          </div>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold font-serif text-slate-100">
            Voice Assistant & Speech-to-Text Converter
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Talk about your skills, education, and career dream. SakshamAI extracts your details in real time.
          </p>
        </div>

        {/* Language Selector */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-bold text-emerald-300 shadow-sm">
            <Languages size={16} className="text-emerald-400" />
            <span>Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => {
                const newLang = e.target.value;
                setSelectedLanguage(newLang);
                if (isRecording) {
                  stopSpeechRecognition();
                  setIsRecording(false);
                }
              }}
              className="bg-slate-900 px-2 py-1 rounded-lg border border-emerald-500/40 font-bold text-emerald-300 outline-none cursor-pointer"
            >
              {Object.keys(SUPPORTED_LANGUAGES).map((lang) => (
                <option key={lang} value={lang} className="bg-slate-900 text-slate-200">
                  {SUPPORTED_LANGUAGES[lang].nativeName}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onGeneratePlan}
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-5 py-2.5 text-xs font-bold transition-all shadow-md shadow-emerald-500/20"
          >
            <span>View Mapped Pathway</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="grid gap-6 lg:grid-cols-[1.15fr_.85fr]">
        {/* Left: Multilingual Voice Chat */}
        <div className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl overflow-hidden min-h-[600px]">
          {/* Header */}
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
                    <span>Ready ({activeLangConfig.code})</span>
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
                <VolumeX size={14} /> Mute Audio
              </button>
            )}
          </div>

          {/* Chat Messages */}
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

                  <div className="space-y-2">
                    <div
                      className={`rounded-2xl p-4 text-sm leading-relaxed ${
                        isAssistant
                          ? 'rounded-tl-sm bg-slate-800/90 text-slate-100 border border-slate-700/60'
                          : 'rounded-tr-sm bg-emerald-600 text-slate-950 font-semibold shadow-md'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>

                    {isAssistant && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handlePlayTTS(msg.text)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          <Volume2 size={13} /> Listen in {selectedLanguage}
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

            {/* Quick Regional Voice Prompt Pills */}
            <div className="rounded-2xl bg-slate-950/80 p-4 border border-slate-800 space-y-2.5">
              <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles size={14} /> Tap to speak or test voice prompt ({activeLangConfig.nativeName}):
              </p>
              <div className="flex flex-wrap gap-2">
                {activeLangConfig.samplePhrases.map((phrase, i) => (
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
                placeholder={`Speak in ${selectedLanguage} or type here...`}
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
                Auto-Updating
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80">
                <p className="text-xs font-bold text-slate-400">Beneficiary Name & Region</p>
                <p className="text-base font-bold text-slate-100 mt-1 flex items-center justify-between">
                  <span>{currentProfile.name || 'Ravi'}</span>
                  <span className="text-xs font-semibold text-slate-400">
                    {currentProfile.district || 'Vizianagaram'}, {currentProfile.state || 'Andhra Pradesh'}
                  </span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-950/60 p-3.5 border border-slate-800/80">
                  <p className="text-xs text-slate-400">Education Level</p>
                  <p className="text-sm font-bold text-emerald-400 mt-1">
                    {currentProfile.education || '10th Pass'}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950/60 p-3.5 border border-slate-800/80">
                  <p className="text-xs text-slate-400">Preferred Goal</p>
                  <p className="text-sm font-bold text-amber-400 mt-1">
                    {currentProfile.preferredLivelihood || 'Self-employment'}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80">
                <p className="text-xs font-bold text-slate-400 mb-2.5 flex items-center justify-between">
                  <span>Mapped Skills ({currentProfile.existingSkills?.length || 0})</span>
                  <span className="text-[10px] text-emerald-400">NSQF Aligned</span>
                </p>
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
                    <span className="text-xs text-slate-500 italic">No skills extracted yet. Speak your experience into the microphone!</span>
                  )}
                </div>
              </div>

              {currentProfile.careerGoal && (
                <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80">
                  <p className="text-xs font-bold text-slate-400">Beneficiary Vision</p>
                  <p className="text-xs text-slate-200 mt-1 leading-relaxed">
                    "{currentProfile.careerGoal}"
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
            <button
              onClick={onGeneratePlan}
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

