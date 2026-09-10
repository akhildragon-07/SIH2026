'use client';

import React, { useState, useEffect } from 'react';
import { Mic, MicOff, RefreshCw, Check, Keyboard, Volume2 } from 'lucide-react';

interface VoiceRecordButtonProps {
  isRecording: boolean;
  isProcessing?: boolean;
  isComplete?: boolean;
  audioLevel?: number; // 0 to 100
  onToggleRecord: () => void;
  onToggleTypeMode?: () => void;
  isTypeModeActive?: boolean;
  languageName?: string;
  disabled?: boolean;
}

const LOCALIZED_MIC_LABELS: Record<string, { speak: string; listening: string; tapToSpeak: string; processing: string; done: string }> = {
  'Tamil': {
    speak: 'பேசுங்கள்',
    listening: 'கேட்கிறது... தமிழில் பேசுங்கள்',
    tapToSpeak: 'மைக்கை அழுத்தி தமிழில் பேசுங்கள்',
    processing: 'புரிந்து கொள்கிறது...',
    done: 'குரல் பதிவு செய்யப்பட்டது'
  },
  'Telugu': {
    speak: 'మాట్లాడండి',
    listening: 'వింటోంది... తెలుగులో మాట్లాడండి',
    tapToSpeak: 'మైక్ నొక్కి తెలుగులో మాట్లాడండి',
    processing: 'విశ్లేషిస్తోంది...',
    done: 'వాయిస్ రికార్డ్ అయింది'
  },
  'Hindi': {
    speak: 'बोलिए',
    listening: 'सुन रहा है... हिंदी में बोलिए',
    tapToSpeak: 'माइक दबाकर हिंदी में बोलें',
    processing: 'प्रोसेस हो रहा है...',
    done: 'आवाज़ रिकॉर्ड हो गई'
  },
  'Kannada': {
    speak: 'ಮಾತನಾಡಿ',
    listening: 'ಕೇಳುತ್ತಿದೆ... ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ',
    tapToSpeak: 'ಮೈಕ್ ಒತ್ತಿ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ',
    processing: 'ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...',
    done: 'ಧ್ವನಿ ದಾಖಲಾಗಿದೆ'
  },
  'Malayalam': {
    speak: 'സംസാരിക്കുക',
    listening: 'കേൾക്കുന്നു... മലയാളത്തിൽ സംസാരിക്കുക',
    tapToSpeak: 'മൈക്ക് അമർത്തി മലയാളത്തിൽ സംസാരിക്കുക',
    processing: 'പ്രോസസ്സ് ചെയ്യുന്നു...',
    done: 'വോയ്സ് റെക്കോർഡ് ചെയ്തു'
  },
  'Marathi': {
    speak: 'बोला',
    listening: 'ऐकत आहे... मराठीत बोला',
    tapToSpeak: 'माइक दाबून मराठीत बोला',
    processing: 'प्रक्रिया सुरू आहे...',
    done: 'आवाज रेकॉर्ड झाला'
  },
  'English': {
    speak: 'Speak',
    listening: 'Listening... Speak now',
    tapToSpeak: 'Tap microphone and speak in English',
    processing: 'Transcribing & Analyzing...',
    done: 'Speech Captured'
  }
};

export default function VoiceRecordButton({
  isRecording,
  isProcessing = false,
  isComplete = false,
  audioLevel = 0,
  onToggleRecord,
  onToggleTypeMode,
  isTypeModeActive = false,
  languageName = 'English',
  disabled = false
}: VoiceRecordButtonProps) {
  const [recordSeconds, setRecordSeconds] = useState(0);

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

  const loc = LOCALIZED_MIC_LABELS[getLangKey(languageName)] || LOCALIZED_MIC_LABELS['English'];

  // Timer counter during active recording
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRecording) {
      setRecordSeconds(0);
      interval = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 py-2">
      {/* Visual Waveform Radial Atmosphere (when recording) */}
      <div className="relative grid place-items-center">
        {isRecording && (
          <>
            {/* Concentric Pulsing Wave Rings */}
            <div
              className="absolute rounded-full border border-rose-500/40 animate-ping pointer-events-none transition-all duration-300"
              style={{
                width: `${100 + Math.min(60, audioLevel)}px`,
                height: `${100 + Math.min(60, audioLevel)}px`
              }}
            />
            <div className="absolute size-28 rounded-full bg-rose-500/10 blur-md animate-pulse pointer-events-none" />

            {/* Circular Circular Waveform Bars */}
            <div className="absolute -inset-5 flex items-center justify-center pointer-events-none">
              {Array.from({ length: 16 }).map((_, i) => {
                const angle = (i * 360) / 16;
                const dynamicHeight = Math.max(4, Math.round((audioLevel / 100) * 14 * Math.sin(i) + 4));
                return (
                  <div
                    key={i}
                    className="absolute w-1 rounded-full bg-gradient-to-t from-rose-400 to-amber-300 transition-all duration-75"
                    style={{
                      height: `${dynamicHeight}px`,
                      transform: `rotate(${angle}deg) translate(0, -42px)`
                    }}
                  />
                );
              })}
            </div>
          </>
        )}

        {/* Large Central Button */}
        <button
          type="button"
          onClick={onToggleRecord}
          disabled={disabled || isProcessing}
          aria-label={isRecording ? 'Stop recording voice' : loc.tapToSpeak}
          className={`relative size-20 sm:size-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-2xl ${
            isComplete
              ? 'bg-emerald-500 text-slate-950 scale-105 shadow-emerald-500/40 ring-4 ring-emerald-400/40'
              : isProcessing
              ? 'bg-teal-600 text-white cursor-wait ring-4 ring-teal-400/40'
              : isRecording
              ? 'bg-rose-500 text-white scale-110 shadow-rose-500/50 ring-4 ring-rose-400/50 animate-pulse'
              : 'bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 hover:scale-105 shadow-emerald-500/30 ring-4 ring-emerald-500/20'
          }`}
        >
          {isComplete ? (
            <Check size={36} className="stroke-[3] animate-in zoom-in duration-200" />
          ) : isProcessing ? (
            <RefreshCw size={32} className="animate-spin" />
          ) : isRecording ? (
            <MicOff size={32} />
          ) : (
            <Mic size={36} className="group-hover:scale-110 transition-transform" />
          )}

          {/* Micro text inside / below icon if idle */}
          {!isRecording && !isProcessing && !isComplete && (
            <span className="text-[10px] font-extrabold uppercase tracking-wider mt-1 opacity-90 px-1 text-center truncate max-w-full">
              {loc.speak}
            </span>
          )}
        </button>
      </div>

      {/* Button Sub-Label & Status Indicator */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        {isRecording ? (
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold">
            <span className="size-2 rounded-full bg-rose-400 animate-ping" />
            <span>{loc.listening}</span>
            <span className="font-mono text-white bg-slate-950/80 px-2 py-0.5 rounded ml-1">
              {formatTimer(recordSeconds)}
            </span>
          </div>
        ) : isProcessing ? (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30 text-teal-300 text-xs font-bold">
            <RefreshCw size={13} className="animate-spin" />
            <span>{loc.processing}</span>
          </div>
        ) : isComplete ? (
          <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
            <Check size={14} className="stroke-[3]" />
            <span>{loc.done}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold">
            <Volume2 size={14} className="text-emerald-400 shrink-0" />
            <span>{loc.tapToSpeak}</span>
          </div>
        )}

        {/* "Type Instead" Toggle Button */}
        {onToggleTypeMode && (
          <button
            type="button"
            onClick={onToggleTypeMode}
            className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-300 hover:underline transition-colors font-medium py-1 px-3 rounded-lg"
          >
            <Keyboard size={13} />
            <span>{isTypeModeActive ? 'Switch to Voice Input' : 'Prefer to type instead?'}</span>
          </button>
        )}
      </div>
    </div>
  );
}
