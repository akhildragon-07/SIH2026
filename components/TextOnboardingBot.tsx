'use client';

import React, { useState } from 'react';
import { BeneficiaryProfile } from '@/lib/types';
import { Bot, Send, Sparkles, User, ArrowRight } from 'lucide-react';

import { normalizeStateName, normalizeDistrictName, isValidState, isValidDistrictForState, getDistrictsForState } from '@/lib/india-locations';

interface TextBotProps {
  onCompleteTextOnboarding: (extractedProfile: Partial<BeneficiaryProfile>) => void;
}

const BOT_QUESTIONS = [
  { id: 'name', question: '1. What is your full name?', placeholder: 'e.g. Ravi Kumar' },
  { id: 'state', question: '2. Which Indian State do you live in?', placeholder: 'e.g. Tamil Nadu, Karnataka, Maharashtra' },
  { id: 'district', question: '3. Which District in your state do you reside in?', placeholder: 'e.g. Theni, Bengaluru Urban, Pune, Madurai' },
  { id: 'education', question: '4. What is your highest level of education?', placeholder: 'e.g. 10th Pass, 12th Pass, 8th Pass, ITI, Graduate' },
  { id: 'age', question: '5. What is your age?', placeholder: 'e.g. 24' },
  { id: 'occupation', question: '6. What is your current work or occupation?', placeholder: 'e.g. Tailoring from home, Electrician helper, Unemployed' },
  { id: 'experience', question: '7. How many years of work experience do you have?', placeholder: 'e.g. 2 years, 1 year, 0' },
  { id: 'skills', question: '8. What existing vocational or technical skills do you currently have?', placeholder: 'e.g. Automobile repair, Electrical wiring, Tailoring, Food processing' },
  { id: 'interest', question: '9. Which industry sector are you most interested in?', placeholder: 'e.g. Automotive, Electrical & Power, Food Processing, Apparel' },
  { id: 'goal', question: '10. What is your career goal (Job, Self-employment with PM-AJAY toolkit grant, or Entrepreneurship)?', placeholder: 'e.g. Self-employment / start boutique with grant' }
];

export default function TextOnboardingBot({ onCompleteTextOnboarding }: TextBotProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [collectedData, setCollectedData] = useState<Partial<BeneficiaryProfile>>({
    name: undefined,
    state: undefined,
    district: undefined,
    education: undefined,
    age: undefined,
    gender: 'Male',
    currentOccupation: undefined,
    workExperienceYears: undefined,
    existingSkills: [],
    interests: [],
    preferredLivelihood: undefined
  });

  const [chatLog, setChatLog] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    { sender: 'bot', text: 'Hello! I am SakshamAI. I will ask you 10 simple questions one by one to register your PM-AJAY beneficiary profile.' },
    { sender: 'bot', text: BOT_QUESTIONS[0].question }
  ]);

  const handleSend = () => {
    if (!inputVal.trim()) return;

    const currentQ = BOT_QUESTIONS[currentStepIndex];
    const userText = inputVal.trim();

    const newLog = [...chatLog, { sender: 'user' as const, text: userText }];

    const updated = { ...collectedData };
    if (currentQ.id === 'name') {
      updated.name = userText;
    } else if (currentQ.id === 'state') {
      const normState = normalizeStateName(userText);
      if (normState && isValidState(normState)) {
        updated.state = normState;
      } else {
        newLog.push({ sender: 'bot', text: `State "${userText}" is not recognized. Please type a valid Indian State (e.g. Tamil Nadu, Karnataka, Maharashtra).` });
        setChatLog(newLog);
        setInputVal('');
        return;
      }
    } else if (currentQ.id === 'district') {
      const userState = updated.state || 'Tamil Nadu';
      if (isValidDistrictForState(userState, userText)) {
        updated.district = normalizeDistrictName(userText, userState);
      } else {
        const sample = getDistrictsForState(userState).slice(0, 5).join(', ');
        newLog.push({ sender: 'bot', text: `District "${userText}" does not belong to ${userState}. Please type a valid district in ${userState} (e.g., ${sample}).` });
        setChatLog(newLog);
        setInputVal('');
        return;
      }
    } else if (currentQ.id === 'education') {
      if (userText.includes('10th')) updated.education = '10th Pass';
      else if (userText.includes('12th')) updated.education = '12th Pass';
      else if (userText.includes('8th')) updated.education = '8th Pass';
      else if (userText.includes('5th') || userText.toLowerCase().includes('below')) updated.education = 'Below 8th';
      else if (userText.toLowerCase().includes('grad') || userText.toLowerCase().includes('degree')) updated.education = 'Graduate & Above';
      else if (userText.toLowerCase().includes('iti') || userText.toLowerCase().includes('diploma')) updated.education = 'ITI / Diploma';
      else updated.education = '10th Pass';
    } else if (currentQ.id === 'age') {
      const parsedAge = parseInt(userText, 10);
      updated.age = !isNaN(parsedAge) && parsedAge >= 15 ? parsedAge : 24;
    } else if (currentQ.id === 'occupation') {
      updated.currentOccupation = userText;
    } else if (currentQ.id === 'experience') {
      const parsedExp = parseInt(userText, 10);
      updated.workExperienceYears = !isNaN(parsedExp) ? parsedExp : 0;
    } else if (currentQ.id === 'skills') {
      updated.existingSkills = userText.split(',').map(s => s.trim()).filter(Boolean);
    } else if (currentQ.id === 'interest') {
      updated.interests = [userText];
    } else if (currentQ.id === 'goal') {
      if (userText.toLowerCase().includes('self') || userText.toLowerCase().includes('shop') || userText.toLowerCase().includes('toolkit')) {
        updated.preferredLivelihood = 'Self-employment';
        updated.careerGoal = 'Establish an independent enterprise with PM-AJAY toolkit grant.';
      } else if (userText.toLowerCase().includes('entrepreneur')) {
        updated.preferredLivelihood = 'Entrepreneurship';
        updated.careerGoal = 'Establish an enterprise under PM-AJAY.';
      } else {
        updated.preferredLivelihood = 'Job';
        updated.careerGoal = 'Secure a salaried wage employment with certified NSQF credentials.';
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
