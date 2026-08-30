'use client';

import React, { useState } from 'react';
import { BeneficiaryProfile } from '@/lib/types';
import { Bot, Send, Sparkles, User, ArrowRight } from 'lucide-react';

interface TextBotProps {
  onCompleteTextOnboarding: (extractedProfile: Partial<BeneficiaryProfile>) => void;
}

const BOT_QUESTIONS = [
  { id: 'name', question: 'What is your full name and age?', placeholder: 'e.g. Ravi Kumar, 24 years old' },
  { id: 'education', question: 'What is your highest level of education?', placeholder: 'e.g. 10th Pass, 12th Pass, 8th Pass' },
  { id: 'skills', question: 'What existing skills do you currently have?', placeholder: 'e.g. Tailoring, Sewing, Stitching, Machine Operation' },
  { id: 'experience', question: 'How many years of work experience do you have, and what was your previous work?', placeholder: 'e.g. 2 years experience in local garment stitching' },
  { id: 'location', question: 'Which State and District are you located in?', placeholder: 'e.g. Vizianagaram, Andhra Pradesh (Rural)' },
  { id: 'goal', question: 'Are you looking for a Job, Self-Employment with PM-AJAY GIA toolkit support, or a Business?', placeholder: 'e.g. Self-employment / start home tailoring unit' }
];

export default function TextOnboardingBot({ onCompleteTextOnboarding }: TextBotProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [collectedData, setCollectedData] = useState<Partial<BeneficiaryProfile>>({
    name: 'Ravi Kumar',
    age: 24,
    gender: 'Male',
    state: 'Andhra Pradesh',
    district: 'Vizianagaram',
    areaType: 'Rural',
    education: '10th Pass',
    currentOccupation: 'Unemployed',
    existingSkills: ['Tailoring', 'Sewing', 'Stitching'],
    workExperienceYears: 2,
    preferredLivelihood: 'Self-employment',
    careerGoal: 'self-employment'
  });

  const [chatLog, setChatLog] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    { sender: 'bot', text: 'Hello! I am SakshamAI. I will ask you a few simple questions one by one to create your profile.' },
    { sender: 'bot', text: BOT_QUESTIONS[0].question }
  ]);

  const handleSend = () => {
    if (!inputVal.trim()) return;

    const currentQ = BOT_QUESTIONS[currentStepIndex];
    const userText = inputVal.trim();

    const newLog = [...chatLog, { sender: 'user' as const, text: userText }];

    // Simple field extraction
    const updated = { ...collectedData };
    if (currentQ.id === 'name') {
      updated.name = userText.split(',')[0] || userText;
    } else if (currentQ.id === 'education') {
      if (userText.includes('10th')) updated.education = '10th Pass';
      else if (userText.includes('12th')) updated.education = '12th Pass';
      else if (userText.includes('8th')) updated.education = '8th Pass';
      else if (userText.includes('5th')) updated.education = 'Below 8th';
    } else if (currentQ.id === 'skills') {
      updated.existingSkills = userText.split(',').map(s => s.trim()).filter(Boolean);
    } else if (currentQ.id === 'location') {
      updated.state = userText;
    } else if (currentQ.id === 'goal') {
      if (userText.toLowerCase().includes('self') || userText.toLowerCase().includes('shop')) {
        updated.preferredLivelihood = 'Self-employment';
        updated.careerGoal = 'self-employment';
      } else {
        updated.preferredLivelihood = 'Job';
        updated.careerGoal = 'job';
      }
    }

    setCollectedData(updated);
    setInputVal('');

    const nextIdx = currentStepIndex + 1;
    if (nextIdx < BOT_QUESTIONS.length) {
      setCurrentStepIndex(nextIdx);
      newLog.push({ sender: 'bot', text: BOT_QUESTIONS[nextIdx].question });
      setChatLog(newLog);
    } else {
      newLog.push({ sender: 'bot', text: 'Thank you! I have gathered all your information. Redirecting to confirmation...' });
      setChatLog(newLog);
      setTimeout(() => {
        onCompleteTextOnboarding(updated);
      }, 1000);
    }
  };

  return (
    <div className="w-full mx-auto max-w-3xl px-4 py-8">
      <div className="flex flex-col rounded-3xl border border-slate-800 bg-slate-900/90 shadow-xl overflow-hidden min-h-[500px]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 p-4 px-6">
          <div className="flex items-center gap-3">
            <div className="grid size-9 place-items-center rounded-xl bg-teal-500/20 text-teal-400">
              <Bot size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-200">SakshamAI Step-by-Step Profile Assistant</p>
              <p className="text-[11px] text-teal-400 font-semibold">Question {Math.min(currentStepIndex + 1, BOT_QUESTIONS.length)} of {BOT_QUESTIONS.length}</p>
            </div>
          </div>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatLog.map((msg, i) => (
            <div key={i} className={`flex gap-3 max-w-[85%] ${msg.sender === 'bot' ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
              <div className={`size-8 rounded-full grid place-items-center text-xs shrink-0 ${msg.sender === 'bot' ? 'bg-teal-500/20 text-teal-400' : 'bg-slate-700 text-slate-200'}`}>
                {msg.sender === 'bot' ? <Bot size={15} /> : <User size={15} />}
              </div>
              <div className={`rounded-2xl p-4 text-sm leading-relaxed ${msg.sender === 'bot' ? 'bg-slate-800 text-slate-100' : 'bg-teal-600 text-slate-950 font-medium'}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-slate-800 bg-slate-950 p-4 flex gap-3">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={BOT_QUESTIONS[currentStepIndex]?.placeholder || 'Type your answer...'}
            className="flex-1 rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-100 outline-none focus:border-teal-500"
          />
          <button
            onClick={handleSend}
            className="grid size-12 place-items-center rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition-all"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
