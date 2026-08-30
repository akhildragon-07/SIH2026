'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Send, Sparkles, User, Bot, Check, ArrowRight, AlertCircle, Languages } from 'lucide-react';
import { BeneficiaryProfile, ChatMessage } from '@/lib/types';
import { startSpeechRecognition, stopSpeechRecognition, speakText, stopSpeechSynthesis, SUPPORTED_LANGUAGES } from '@/lib/speech';

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
  const [speechError, setSpeechError] = useState<string | null>(null);

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

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRecording]);

  // Handle Speech Recognition Toggle
  const toggleRecording = () => {
    if (isRecording) {
      stopSpeechRecognition();
      setIsRecording(false);
    } else {
      setSpeechError(null);
      setIsRecording(true);

      startSpeechRecognition(
        (transcript, isFinal) => {
          setInputText(transcript);
          if (isFinal) {
            handleSendMessage(transcript);
            stopSpeechRecognition();
            setIsRecording(false);
          }
        },
        (error) => {
          setSpeechError(`Voice Error (${selectedLanguage}): ${error}. You can also tap sample voice phrases below!`);
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        },
        selectedLanguage
      );
    }
  };

  // Handle Sending Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      language: selectedLanguage
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language: selectedLanguage,
          currentProfile
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
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
            <Sparkles size={13} />
            <span>PM-AJAY Multilingual Voice AI (Tamil, Telugu, Hindi, Marathi, English)</span>
          </div>
          <h1 className="mt-2 text-3xl font-bold font-serif text-slate-100">
            Voice Assistant & Speech-to-Text Converter
          </h1>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300">
            <Languages size={16} className="text-emerald-400" />
            <span>Voice Language:</span>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-transparent font-bold text-emerald-400 outline-none cursor-pointer"
            >
              {Object.keys(SUPPORTED_LANGUAGES).map((lang) => (
                <option key={lang} value={lang} className="bg-slate-900 text-slate-200">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onGeneratePlan}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-4 py-2.5 text-xs font-bold transition-all shadow-md"
          >
            <span>Analyze My Pathway</span>
            <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
        {/* Left: Multilingual Voice Chat */}
        <div className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden min-h-[580px]">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 p-4 px-6">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <Bot size={18} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-200">SakshamAI Voice Assistant</p>
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Listening Code: <strong className="text-slate-200">{activeLangConfig.code}</strong> ({selectedLanguage})
                </p>
              </div>
            </div>

            {isPlayingAudio && (
              <button
                onClick={() => {
                  stopSpeechSynthesis();
                  setIsPlayingAudio(false);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-full border border-amber-500/20"
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
                  className={`flex gap-3 max-w-[88%] ${isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
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
                          : 'rounded-tr-sm bg-emerald-600 text-slate-950 font-medium'
                      }`}
                    >
                      <p>{msg.text}</p>
                    </div>

                    {isAssistant && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePlayTTS(msg.text)}
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-emerald-400"
                        >
                          <Volume2 size={13} /> Speak response in {selectedLanguage}
                        </button>
                        <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Quick Regional Voice Prompt Pills for Tamil, Telugu, Hindi, Marathi */}
            <div className="rounded-2xl bg-slate-950/80 p-4 border border-slate-800 space-y-2">
              <p className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Sparkles size={14} /> Quick Voice Test Prompts ({selectedLanguage}):
              </p>
              <div className="flex flex-wrap gap-2">
                {activeLangConfig.samplePhrases.map((phrase, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(phrase)}
                    className="rounded-xl bg-slate-900 hover:bg-emerald-950/80 text-emerald-300 hover:text-emerald-200 border border-slate-700/80 px-3 py-1.5 text-xs font-semibold transition-all"
                  >
                    🗣️ "{phrase}"
                  </button>
                ))}
              </div>
            </div>

            {isRecording && (
              <div className="flex items-center gap-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 p-4 text-amber-300 text-xs font-semibold animate-pulse">
                <Mic size={18} className="animate-bounce" />
                <span>Listening in {selectedLanguage} ({activeLangConfig.code}). Speak into your microphone now!</span>
              </div>
            )}

            {speechError && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-rose-300 text-xs">
                <AlertCircle size={15} />
                <span>{speechError}</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Controls */}
          <div className="border-t border-slate-800 bg-slate-950/80 p-4 space-y-3">
            <div className="flex items-center justify-center gap-1 py-1">
              {Array.from({ length: 28 }).map((_, i) => (
                <span
                  key={i}
                  className={`w-1 rounded-full transition-all duration-300 ${
                    isRecording ? 'bg-emerald-400 animate-pulse' : 'bg-slate-800'
                  }`}
                  style={{
                    height: isRecording ? `${Math.floor(Math.sin(i + Date.now()) * 14 + 16)}px` : '8px'
                  }}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={toggleRecording}
                className={`relative grid size-12 place-items-center rounded-2xl transition-all shadow-lg shrink-0 ${
                  isRecording
                    ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-500/30'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
                title={`Record Voice in ${selectedLanguage}`}
              >
                {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={`Speak in ${selectedLanguage} or type here...`}
                className="flex-1 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-emerald-500/60"
              />

              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim()}
                className="grid size-12 place-items-center rounded-2xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 disabled:opacity-40 transition-all shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Live Extracted Profile */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-7 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={15} />
                <span>Extracted Profile JSON</span>
              </div>
              <span className="text-[11px] text-slate-400 bg-slate-800 px-2.5 py-1 rounded-full">
                AI Extracted
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80">
                <p className="text-xs font-bold text-slate-400">Beneficiary Name & State</p>
                <p className="text-base font-bold text-slate-100 mt-1">
                  {currentProfile.name || 'Ravi'} ({currentProfile.state || 'Andhra Pradesh'})
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-slate-950/60 p-3.5 border border-slate-800/80">
                  <p className="text-xs text-slate-400">Education</p>
                  <p className="text-sm font-bold text-emerald-400 mt-1">
                    {currentProfile.education || '10th'}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-950/60 p-3.5 border border-slate-800/80">
                  <p className="text-xs text-slate-400">Career Goal</p>
                  <p className="text-sm font-bold text-amber-400 mt-1">
                    {currentProfile.careerGoal || 'self-employment'}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-950/60 p-4 border border-slate-800/80">
                <p className="text-xs font-bold text-slate-400 mb-2">Existing Skills Mapped</p>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.existingSkills && currentProfile.existingSkills.length > 0 ? (
                    currentProfile.existingSkills.map((sk) => (
                      <span
                        key={sk}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-300"
                      >
                        <Check size={13} /> {sk}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No skills extracted yet. Speak to assistant!</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800 space-y-3">
            <button
              onClick={onGeneratePlan}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 px-6 py-4 font-bold text-sm transition-all shadow-lg"
            >
              <span>Generate Hybrid AI Recommendations</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
