import { NextResponse } from 'next/server';
import { extractProfileFromText, extractVoiceCommandIntent, generateVerbalProfileSummary } from '@/lib/ai-engine';
import { BeneficiaryProfile } from '@/lib/types';

export type DialogueStage =
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

interface StepContent {
  prompt: (p: Partial<BeneficiaryProfile>) => string;
  suggestions: string[];
}

const INTERACTIVE_DIALOGUE: Record<string, Record<DialogueStage, StepContent>> = {
  'English': {
    name: {
      prompt: () => "Namaste! I am SakshamAI, your PM-AJAY voice guide. What is your full name?",
      suggestions: ["My name is Satil", "My name is Ramesh", "Pooja Sharma"]
    },
    age: {
      prompt: (p) => `Nice to meet you, ${p.name || 'friend'}. What is your age?`,
      suggestions: ["I am 24", "26 years old", "28"]
    },
    dob: {
      prompt: () => "Thank you. What is your date of birth?",
      suggestions: ["15 August 2002", "15/08/2000", "12 June 1998"]
    },
    education: {
      prompt: () => "Thank you. What is your highest level of education?",
      suggestions: ["10th Pass", "12th Pass", "Graduate & Above", "ITI / Diploma", "8th Pass", "Below 8th"]
    },
    skills: {
      prompt: () => "Good. What skills or work do you know?",
      suggestions: ["Tailoring and sewing", "Plumbing and pipe fitting", "House wiring & electricals", "Organic farming", "Mobile repair"]
    },
    experience: {
      prompt: (p) => `Great. How many years of work experience do you have${p.existingSkills && p.existingSkills.length > 0 ? ` in ${p.existingSkills[0]}` : ''}?`,
      suggestions: ["Two years", "3 years", "1 year", "No experience, want to learn"]
    },
    occupation: {
      prompt: () => "What work are you currently doing?",
      suggestions: ["Tailoring from home", "Electrician apprentice", "Farming", "Unemployed / Looking for work"]
    },
    location: {
      prompt: () => "Which village, town, district, or city do you live in?",
      suggestions: ["Theni", "Vizianagaram", "Varanasi", "Mysuru", "Ernakulam", "Solapur"]
    },
    livelihood_goal: {
      prompt: () => "What kind of livelihood are you looking for: a job, self-employment, or both?",
      suggestions: ["Self-employment with PM-AJAY toolkit grant", "Salaried Job in a company", "Both"]
    },
    confirm_summary: {
      prompt: (p) => generateVerbalProfileSummary(p, 'English'),
      suggestions: ["Yes, that's correct", "No, I want to change something"]
    },
    complete: {
      prompt: (p) => `Awesome ${p.name || 'Beneficiary'}! Your details have been verified and your official PM-AJAY account is registered. Analyzing your personalized NSQF training opportunities now.`,
      suggestions: ["Show my opportunities", "View PM-AJAY toolkit grant"]
    }
  },

  'Tamil': {
    name: {
      prompt: () => "வணக்கம்! நான் சக்ஷம் AI, PM-AJAY திட்டத்தின் குரல் வழிகாட்டி. உங்கள் முழு பெயர் என்ன?",
      suggestions: ["என் பெயர் சதீல்", "என் பெயர் முருகன்", "சுனிதா"]
    },
    age: {
      prompt: (p) => `வணக்கம் ${p.name || 'அன்பரே'}! உங்கள் வயது என்ன?`,
      suggestions: ["வயது 24", "26", "28 வயது"]
    },
    dob: {
      prompt: () => "நன்றி. உங்கள் பிறந்த தேதி என்ன? (எ.கா. 15 ஆகஸ்ட் 2002 அல்லது 15/08/2000)",
      suggestions: ["15 ஆகஸ்ட் 2002", "15/08/2000", "12 ஜூன் 1998"]
    },
    education: {
      prompt: () => "நன்றி. உங்கள் கல்வித் தகுதி என்ன? (எ.கா. 10-வது வகுப்பு, 12-வது வகுப்பு, பட்டப்படிப்பு, ITI அல்லது பள்ளிக்கு செல்லவில்லை)",
      suggestions: ["10-வது வகுப்பு (10th)", "12-வது வகுப்பு (+2)", "பட்டப்படிப்பு (Degree)", "ஐடிஐ / டிப்ளமோ", "8-வது வகுப்பு"]
    },
    skills: {
      prompt: () => "அருமை. உங்களுக்கு என்னென்ன தொழில் வேலைகள் அல்லது கைவினைத் திறன்கள் தெரியும்?",
      suggestions: ["தையல் மற்றும் ஆடை தைப்பது", "ப்ளம்பிங் குழாய் வேலை", "எலக்ட்ரிக்கல் வயரிங்", "விவசாயம்", "மொபைல் ரிப்பேர்"]
    },
    experience: {
      prompt: () => "மிக நன்று. இந்த வேலையில் உங்களுக்கு எத்தனை வருட அனுபவம் உள்ளது?",
      suggestions: ["2 வருட அனுபவம்", "3 வருடங்கள்", "1 வருடம்", "அனுபவம் இல்லை"]
    },
    occupation: {
      prompt: () => "தற்போது நீங்கள் என்ன வேலை செய்கிறீர்கள்?",
      suggestions: ["வீட்டில் தையல் வேலை", "எலக்ட்ரீசியன் வேலை", "விவசாயம்", "வேலை தேடுகிறேன்"]
    },
    location: {
      prompt: () => "நீங்கள் எந்த கிராமம், ஊர், அல்லது மாவட்டத்தில் வசிக்கிறீர்கள்?",
      suggestions: ["தேனி", "மதுரை", "சென்னை", "கோயம்புத்தூர்", "திருச்சி"]
    },
    livelihood_goal: {
      prompt: () => "நீங்கள் மாதச் சம்பள வேலை விரும்புகிறீர்களா, அல்லது 100% PM-AJAY டூல்கிட் மானியத்துடன் சொந்த தொழில் தொடங்க விரும்புகிறீர்களா?",
      suggestions: ["PM-AJAY டூல்கிட் மானியத்துடன் சொந்த தொழில்", "மாதச் சம்பள வேலை (Job)"]
    },
    confirm_summary: {
      prompt: (p) => generateVerbalProfileSummary(p, 'Tamil'),
      suggestions: ["ஆம், சரியானது", "இல்லை, மாற்ற வேண்டும்"]
    },
    complete: {
      prompt: (p) => `அற்புதம் ${p.name || 'பயனாளி'}! உங்கள் விவரங்கள் பதிவு செய்யப்பட்டு கணக்கு உருவாக்கப்பட்டது. உங்களுக்கான NSQF பயிற்சிகளை இப்போது பகுப்பாய்வு செய்கிறேன்.`,
      suggestions: ["என் வாய்ப்புகளை காட்டுங்கள்", "PM-AJAY டூல்கிட் விவரங்கள்"]
    }
  },

  'Telugu': {
    name: {
      prompt: () => "నమస్తే! నేను సాక్షమ్ AI, PM-AJAY వాయిస్ గైడ్. మీ పూర్తి పేరు ఏమిటి?",
      suggestions: ["నా పేరు సతీల్", "నా పేరు రమేష్", "సునీత"]
    },
    age: {
      prompt: (p) => `నమస్తే ${p.name || 'మిత్రమా'}! మీ వయస్సు ఎంత?`,
      suggestions: ["వయస్సు 24", "26", "28 సంవత్సరాలు"]
    },
    dob: {
      prompt: () => "ధన్యవాదాలు. మీ పుట్టిన తేదీ ఏమిటి?",
      suggestions: ["15 ఆగస్టు 2002", "15/08/2000", "12 జూన్ 1998"]
    },
    education: {
      prompt: () => "ధన్యవాదాలు. మీ అత్యున్నత విద్యార్హత ఏమిటి? (ఉదా: 10వ తరగతి, ఇంటర్, డిగ్రీ, ITI)",
      suggestions: ["10వ తరగతి పాస్", "ఇంటర్ / 12వ", "డిగ్రీ (Degree)", "ఐటీఐ / డిప్లొమా", "8వ తరగతి"]
    },
    skills: {
      prompt: () => "చాలా బాగుంది. మీకు ఏయే పనుల్లో నైపుణ్యం ఉంది?",
      suggestions: ["టైలరింగ్ & కుట్టుపని", "ప్లంబింగ్ పని", "ఎలక్ట్రికల్ వైరింగ్", "వ్యవసాయం", "కంప్యూటర్ & టైపింగ్"]
    },
    experience: {
      prompt: () => "ఈ పనిలో మీకు ఎన్ని సంవత్సరాల అనుభవం ఉంది?",
      suggestions: ["2 సంవత్సరాల అనుభవం", "3 సంవత్సరాలు", "1 సంవత్సరం", "అనుభవం లేదు"]
    },
    occupation: {
      prompt: () => "ప్రస్తుతం మీరు ఏ పని చేస్తున్నారు?",
      suggestions: ["ఇంట్లో కుట్టుపని", "ఎలక్ట్రీషియన్", "వ్యవసాయం", "ఉద్యోగం కోసం చూస్తున్నాను"]
    },
    location: {
      prompt: () => "మీరు ఏ గ్రామం, పట్టణం లేదా జిల్లాలో నివసిస్తున్నారు?",
      suggestions: ["విజయనగరం", "విశాఖపట్నం", "గుంటూరు", "హైదరాబాద్"]
    },
    livelihood_goal: {
      prompt: () => "మీరు కంపెనీలో ఉద్యోగం కోరుకుంటున్నారా, లేదా PM-AJAY టూల్‌కిట్ గ్రాంట్‌తో స్వయం ఉపాధి పొందాలనుకుంటున్నారా?",
      suggestions: ["PM-AJAY టూల్‌కిట్ గ్రాంట్‌తో స్వయం ఉపాధి", "కంపెనీలో ఉద్యోగం (Job)"]
    },
    confirm_summary: {
      prompt: (p) => generateVerbalProfileSummary(p, 'Telugu'),
      suggestions: ["అవును, సరైనదే", "కాదు, మార్చాలి"]
    },
    complete: {
      prompt: (p) => `అద్భుతం ${p.name || 'లబ్ధిదారు'} గారు! మీ వివరాలు నమోదు చేయబడ్డాయి. మీ NSQF శిక్షణ అవకాశాలను ఇప్పుడు విశ్లేషిస్తున్నాను.`,
      suggestions: ["నా అవకాశాలు చూపించండి", "టూల్‌కిట్ గ్రాంట్ వివరాలు"]
    }
  },

  'Hindi': {
    name: {
      prompt: () => "नमस्ते! मैं सक्षम AI हूँ, पीएम-अजय योजना के तहत आपका आवाज़ सहायक। आपका पूरा नाम क्या है?",
      suggestions: ["मेरा नाम सतील है", "मेरा नाम राहुल है", "सुनीता देवी"]
    },
    age: {
      prompt: (p) => `नमस्ते ${p.name || 'मित्र'}! आपकी उम्र क्या है?`,
      suggestions: ["उम्र 24 वर्ष", "26", "28 साल"]
    },
    dob: {
      prompt: () => "धन्यवाद। आपकी जन्म तिथि क्या है?",
      suggestions: ["15 अगस्त 2002", "15/08/2000", "12 जून 1998"]
    },
    education: {
      prompt: () => "आपकी उच्चतम शिक्षा कितनी है? (जैसे: 10वीं पास, 12वीं पास, स्नातक, आईटीआई)",
      suggestions: ["10वीं पास", "12वीं पास / इंटर", "स्नातक (Graduate)", "आईटीआई / डिप्लोमा", "8वीं पास"]
    },
    skills: {
      prompt: () => "अच्छा, आपको कौन-सा काम या हुनर आता है?",
      suggestions: ["सिलाई-कटाई और टेलरिंग", "प्लंबिंग का काम", "बिजली वायरिंग", "खेती और पोल्ट्री", "कंप्यूटर और टाइपिंग"]
    },
    experience: {
      prompt: () => "आपको इस काम में कितने साल का कार्य अनुभव है?",
      suggestions: ["2 साल का अनुभव", "3 साल", "1 साल", "अनुभव नहीं है"]
    },
    occupation: {
      prompt: () => "वर्तमान में आप क्या काम करते हैं?",
      suggestions: ["घर से सिलाई का काम", "इलेक्ट्रीशियन", "खेती", "बेरोजगार / काम की तलाश"]
    },
    location: {
      prompt: () => "आप किस गाँव, शहर या जिले में रहते हैं?",
      suggestions: ["वाराणसी", "सीतापुर", "गया", "पटना", "लखनऊ"]
    },
    livelihood_goal: {
      prompt: () => "आप नौकरी चाहते हैं, या पीएम-अजय टूलकिट अनुदान के साथ अपना स्वरोजगार?",
      suggestions: ["PM-AJAY टूलकिट अनुदान के साथ स्वरोजगार", "मासिक वेतन वाली नौकरी (Job)"]
    },
    confirm_summary: {
      prompt: (p) => generateVerbalProfileSummary(p, 'Hindi'),
      suggestions: ["हाँ, सही है", "नहीं, बदलना है"]
    },
    complete: {
      prompt: (p) => `शानदार ${p.name || 'लाभार्थी'}! आपकी जानकारी सत्यापित हो गई है और खाता पंजीकृत हो गया है।`,
      suggestions: ["मेरी आजीविका योजना दिखाएं", "टूलकिट अनुदान जानकारी"]
    }
  },

  'Kannada': {
    name: {
      prompt: () => "ನಮಸ್ಕಾರ! ನಾನು ಸಕ್ಷಮ್ AI, PM-AJAY ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ. ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ಏನು?",
      suggestions: ["ನನ್ನ ಹೆಸರು ಸತೀಲ್", "ಮಂಜುನಾಥ್", "ಸುನೀತಾ"]
    },
    age: {
      prompt: (p) => `ನಮಸ್ಕಾರ ${p.name || 'ಸ್ನೇಹಿತರೆ'}! ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು?`,
      suggestions: ["ವಯಸ್ಸು 24", "26", "28 ವರ್ಷ"]
    },
    dob: {
      prompt: () => "ಧನ್ಯವಾದಗಳು. ನಿಮ್ಮ ಹುಟ್ಟಿದ ದಿನಾಂಕ ಯಾವುದು?",
      suggestions: ["15 ಆಗಸ್ಟ್ 2002", "15/08/2000"]
    },
    education: {
      prompt: () => "ನಿಮ್ಮ ವಿದ್ಯಾಭ್ಯಾಸ ಎಷ್ಟು ಆಗಿದೆ? (ಉದಾ: 10ನೇ ತರಗತಿ, ಪಿಯುಸಿ, ಪದವಿ, ITI)",
      suggestions: ["10ನೇ ತರಗತಿ ಪಾಸ್", "ಪಿಯುಸಿ / 12ನೇ", "ಪದವಿ (Degree)", "ಐಟಿಐ / ಡಿಪ್ಲೋಮಾ"]
    },
    skills: {
      prompt: () => "ಉತ್ತಮ. ನಿಮಗೆ ಯಾವ ಕೆಲಸ ಅಥವಾ ಕೌಶಲ್ಯ ಗೊತ್ತು?",
      suggestions: ["ಟೈಲರಿಂಗ್ ಮತ್ತು ಹೊಲಿಗೆ", "ಪ್ಲಂಬಿಂಗ್ ಕೆಲಸ", "ಎಲೆಕ್ಟ್ರಿಕಲ್ ವೈರಿಂಗ್", "ಕೃಷಿ"]
    },
    experience: {
      prompt: () => "ಈ ಕೆಲಸದಲ್ಲಿ ನಿಮಗೆ ಎಷ್ಟು ವರ್ಷಗಳ ಅನುಭವವಿದೆ?",
      suggestions: ["2 ವರ್ಷಗಳ ಅನುಭವ", "3 ವರ್ಷ", "1 ವರ್ಷ", "ಅನುಭವವಿಲ್ಲ"]
    },
    occupation: {
      prompt: () => "ಪ್ರಸ್ತುತ ನೀವು ಯಾವ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ?",
      suggestions: ["ಮನೆಯಲ್ಲಿ ಹೊಲಿಗೆ ಕೆಲಸ", "ಎಲೆಕ್ಟ್ರಿಷಿಯನ್", "ಕೃಷಿ", "ಉದ್ಯೋಗ ಹುಡುಕುತ್ತಿದ್ದೇನೆ"]
    },
    location: {
      prompt: () => "ನೀವು ಯಾವ ಊರು ಅಥವಾ ಜಿಲ್ಲೆಯಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದೀರಿ?",
      suggestions: ["ಮೈಸೂರು", "ಬೆಂಗಳೂರು", "ಬೆಳಗಾವಿ", "ಕಲಬುರಗಿ"]
    },
    livelihood_goal: {
      prompt: () => "ನೀವು ಉದ್ಯೋಗ ಬಯಸುತ್ತೀರಾ, ಅಥವಾ PM-AJAY ಟೂಲ್‌ಕಿಟ್ ಅನುದಾನದೊಂದಿಗೆ ಸ್ವಯಂ ಉದ್ಯೋಗ ಬಯಸುತ್ತೀರಾ?",
      suggestions: ["PM-AJAY ಟೂಲ್‌ಕಿಟ್ ಅನುದಾನದೊಂದಿಗೆ ಸ್ವಯಂ ಉದ್ಯೋಗ", "ಉದ್ಯೋಗ (Job)"]
    },
    confirm_summary: {
      prompt: (p) => generateVerbalProfileSummary(p, 'Kannada'),
      suggestions: ["ಹೌದು, ಸರಿಯಾಗಿದೆ", "ಇಲ್ಲ, ಬದಲಾಯಿಸಬೇಕು"]
    },
    complete: {
      prompt: (p) => `ಅದ್ಭುತ ${p.name || 'ಫಲಾನುಭವಿ'}! ನಿಮ್ಮ ವಿವರಗಳು ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿವೆ.`,
      suggestions: ["ನನ್ನ ಅವಕಾಶಗಳನ್ನು ತೋರಿಸಿ", "ಟೂಲ್‌ಕಿಟ್ ವಿವರಗಳು"]
    }
  },

  'Malayalam': {
    name: {
      prompt: () => "നമസ്കാരം! ഞാൻ സക്ഷം AI, PM-AJAY വോയ്‌സ് ഗൈഡ്. നിങ്ങളുടെ പൂർണ്ണ പേര് എന്താണ്?",
      suggestions: ["എന്റെ പേര് സതീൽ", "വിഷ്ണു", "രമേഷ്"]
    },
    age: {
      prompt: (p) => `നമസ്കാരം ${p.name || 'സുഹൃത്തേ'}! നിങ്ങളുടെ പ്രായം എത്രയാണ്?`,
      suggestions: ["പ്രായം 24", "26", "28 വയസ്സ്"]
    },
    dob: {
      prompt: () => "നന്ദി. നിങ്ങളുടെ ജനനത്തീയതി എന്താണ്?",
      suggestions: ["15 ഓഗസ്റ്റ് 2002", "15/08/2000"]
    },
    education: {
      prompt: () => "നിങ്ങളുടെ വിദ്യാഭ്യാസ യോഗ്യത എന്താണ്? (ഉദാ: 10-ാം ക്ലാസ്, പ്ലസ് ടു, ബിരുദം, ITI)",
      suggestions: ["10-ാം ക്ലാസ് പാസ്", "പ്ലസ് ടു / 12th", "ബിരുദം (Degree)", "ഐടിഐ / ഡിപ്ലോമ"]
    },
    skills: {
      prompt: () => "നല്ലത്. നിങ്ങൾക്ക് എന്തൊക്കെ തൊഴിൽ കഴിവുകൾ അറിയാം?",
      suggestions: ["തയ്യൽ ജോലി", "പ്ലംബിംഗ് ജോലി", "ഇലക്ട്രിക്കൽ വയറിംഗ്", "കൃഷി"]
    },
    experience: {
      prompt: () => "ഈ ജോലിയിൽ നിങ്ങൾക്ക് എത്ര വർഷത്തെ പരിചയമുണ്ട്?",
      suggestions: ["2 വർഷത്തെ പരിചയം", "3 വർഷം", "1 വർഷം", "പരിചയമില്ല"]
    },
    occupation: {
      prompt: () => "നിലവിൽ നിങ്ങൾ എന്ത് ജോലിയാണ് ചെയ്യുന്നത്?",
      suggestions: ["വീട്ടിൽ തയ്യൽ ജോലി", "ഇലക്ട്രീഷ്യൻ", "കൃഷി", "ജോലി അന്വേഷിക്കുന്നു"]
    },
    location: {
      prompt: () => "നിങ്ങൾ ഏത് ഗ്രാമം, നഗരം അല്ലെങ്കിൽ ജില്ലയിലാണ് താമസിക്കുന്നത്?",
      suggestions: ["എറണാകുളം", "തിരുവനന്തപുരം", "കോഴിക്കോട്", "തൃശ്ശൂർ"]
    },
    livelihood_goal: {
      prompt: () => "നിങ്ങൾക്ക് ശമ്പളമുള്ള ജോലി വേണോ, അതോ PM-AJAY ടൂൾകിറ്റ് ഗ്രാന്റോടെ സ്വയം തൊഴിൽ വേണോ?",
      suggestions: ["PM-AJAY ടൂൾകിറ്റ് ഗ്രാന്റോടെ സ്വയം തൊഴിൽ", "ശമ്പളമുള്ള ജോലി (Job)"]
    },
    confirm_summary: {
      prompt: (p) => generateVerbalProfileSummary(p, 'Malayalam'),
      suggestions: ["അതെ, ശരിയാണ്", "അല്ല, മാറ്റണം"]
    },
    complete: {
      prompt: (p) => `മികച്ചത് ${p.name || 'ഗുണഭോക്താവ്'}! നിങ്ങളുടെ വിവരങ്ങൾ സ്ഥിരീകരിച്ചു.`,
      suggestions: ["എന്റെ അവസരങ്ങൾ കാണിക്കുക", "ടൂൾകിറ്റ് വിവരങ്ങൾ"]
    }
  },

  'Marathi': {
    name: {
      prompt: () => "नमस्ते! मी सक्षम AI आहे, PM-AJAY योजनेतील तुमचा व्हॉईस मार्गदर्शक. आपले पूर्ण नाव काय आहे?",
      suggestions: ["माझे नाव सतील आहे", "सचिन", "राहुल"]
    },
    age: {
      prompt: (p) => `नमस्ते ${p.name || 'मित्रा'}! आपले वय किती आहे?`,
      suggestions: ["वय 24 वर्षे", "26", "28 वर्षे"]
    },
    dob: {
      prompt: () => "धन्यवाद. आपली जन्मतारीख काय आहे?",
      suggestions: ["15 ऑगस्ट 2002", "15/08/2000"]
    },
    education: {
      prompt: () => "आपले शिक्षण किती झाले आहे? (उदा: 10वी पास, 12वी पास, पदवीधर, ITI)",
      suggestions: ["10वी पास", "12वी पास", "पदवीधर (Graduate)", "आयटीआय / डिप्लोमा", "8वी पास"]
    },
    skills: {
      prompt: () => "छान. आपल्याला कोणते कामाचे कौशल्य येते?",
      suggestions: ["टेलरिंग आणि शिवणकाम", "प्लंबिंगचे काम", "इलेक्ट्रिकल वायरिंग", "शेती"]
    },
    experience: {
      prompt: () => "या कामात आपल्याला किती वर्षांचा अनुभव आहे?",
      suggestions: ["2 वर्षे अनुभव", "3 वर्षे", "1 वर्ष", "अनुभव नाही"]
    },
    occupation: {
      prompt: () => "सध्या आपण काय काम करता?",
      suggestions: ["घरी शिवणकाम", "इलेक्ट्रीशियन", "शेती", "नोकरी शोधत आहे"]
    },
    location: {
      prompt: () => "आपण कोणत्या गाव, शहर किंवा जिल्ह्यात राहता?",
      suggestions: ["सोलापूर", "पुणे", "मुंबई", "नागपूर"]
    },
    livelihood_goal: {
      prompt: () => "आपल्याला नोकरी हवी आहे की PM-AJAY टूलकिट अनुदानासह स्वतःचा व्यवसाय?",
      suggestions: ["PM-AJAY टूलकिट अनुदानासह स्वतःचा व्यवसाय", "नोकरी (Job)"]
    },
    confirm_summary: {
      prompt: (p) => generateVerbalProfileSummary(p, 'Marathi'),
      suggestions: ["हो, बरोबर आहे", "नाही, बदलायचे आहे"]
    },
    complete: {
      prompt: (p) => `उत्तम ${p.name || 'लाभार्थी'}! आपली माहिती पडताळली गेली आहे आणि खाते तयार झाले आहे.`,
      suggestions: ["माझ्या संधी दाखवा", "टूलकिट अनुदान माहिती"]
    }
  }
};

export async function POST(request: Request) {
  try {
    const { message, language = 'English', currentProfile = {}, stage = 'name' } = await request.json();

    const text = message ? message.trim() : '';
    const extractedFields = text ? extractProfileFromText(text, currentProfile) : {};

    const updatedProfile: Partial<BeneficiaryProfile> = {
      ...currentProfile,
      ...extractedFields
    };

    // Normalize selected language
    let langKey = 'English';
    const langLower = (language || '').toLowerCase();

    if (langLower.includes('tamil') || language.includes('தமிழ்') || langLower.startsWith('ta')) langKey = 'Tamil';
    else if (langLower.includes('telugu') || language.includes('తెలుగు') || langLower.startsWith('te')) langKey = 'Telugu';
    else if (langLower.includes('kannada') || language.includes('ಕನ್ನಡ') || langLower.startsWith('kn')) langKey = 'Kannada';
    else if (langLower.includes('malayalam') || language.includes('മലയാളം') || langLower.startsWith('ml')) langKey = 'Malayalam';
    else if (langLower.includes('marathi') || language.includes('मराठी') || langLower.startsWith('mr')) langKey = 'Marathi';
    else if (langLower.includes('hindi') || language.includes('हिंदी') || langLower.startsWith('hi')) langKey = 'Hindi';

    const langPack = INTERACTIVE_DIALOGUE[langKey] || INTERACTIVE_DIALOGUE['English'];

    // Contextual stage fallbacks: ensure active stage consumes the user's answer
    if (text) {
      if (stage === 'name' && !updatedProfile.name) {
        const cleanedName = text.replace(/^(my\s+name\s+is|i\s+am|myself|i['’]m|என்\s+பெயர்|నా\s+పేరు|मेरा\s+नाम|ನನ್ನ\s+ಹೆಸರು|എന്റെ\s+പേര്|माझे\s+नाव)\s+/i, '').trim();
        if (cleanedName.length >= 2 && !/^\d+$/.test(cleanedName)) {
          updatedProfile.name = cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1);
        }
      } else if (stage === 'age' && !updatedProfile.age) {
        const numMatch = text.match(/\b(\d{1,2})\b/);
        if (numMatch) {
          const num = parseInt(numMatch[1], 10);
          if (num >= 15 && num <= 75) updatedProfile.age = num;
        }
      } else if (stage === 'dob' && !updatedProfile.dob) {
        const digits = text.match(/(\d{1,2})[\/\-\.\s](\d{1,2})[\/\-\.\s](\d{4})/);
        if (digits) {
          updatedProfile.dob = `${digits[1].padStart(2, '0')}/${digits[2].padStart(2, '0')}/${digits[3]}`;
        }
      } else if (stage === 'education' && !updatedProfile.education) {
        if (/grad|degree|college|btech|bsc|bcom|ba/i.test(text)) updatedProfile.education = 'Graduate & Above';
        else if (/iti|diploma/i.test(text)) updatedProfile.education = 'ITI / Diploma';
        else if (/12|twelve|\+2|puc|inter/i.test(text)) updatedProfile.education = '12th Pass';
        else if (/8|eight/i.test(text)) updatedProfile.education = '8th Pass';
        else updatedProfile.education = '10th Pass';
      } else if (stage === 'skills' && (!updatedProfile.existingSkills || updatedProfile.existingSkills.length === 0)) {
        if (text.length >= 3) {
          updatedProfile.existingSkills = [text.charAt(0).toUpperCase() + text.slice(1)];
        }
      } else if (stage === 'experience' && updatedProfile.workExperienceYears === undefined) {
        const numMatch = text.match(/\b(\d{1,2})\b/);
        if (numMatch) {
          updatedProfile.workExperienceYears = parseInt(numMatch[1], 10);
        } else if (/no|zero|fresher|none|இல்லை|లేదు|ಇಲ್ಲ|അല്ല|नहीं|नाही/i.test(text)) {
          updatedProfile.workExperienceYears = 0;
        } else {
          updatedProfile.workExperienceYears = 1;
        }
      } else if (stage === 'occupation' && !updatedProfile.currentOccupation) {
        if (text.length >= 2) {
          const cleanedOcc = text.replace(/^(i\s+work\s+as|i\s+do|currently\s+doing|my\s+work\s+is)\s+/i, '').trim();
          updatedProfile.currentOccupation = cleanedOcc.charAt(0).toUpperCase() + cleanedOcc.slice(1);
        }
      } else if (stage === 'location' && !updatedProfile.district) {
        if (text.length >= 3) {
          const cleanedLoc = text.replace(/^(i\s+live\s+in|from|in|district)\s+/i, '').trim();
          updatedProfile.district = cleanedLoc.charAt(0).toUpperCase() + cleanedLoc.slice(1);
        }
      } else if (stage === 'livelihood_goal' && !updatedProfile.preferredLivelihood) {
        if (/self|business|shop|toolkit|grant|own|சுயதொழில்|స్వయం|स्वरोजगार|both/i.test(text)) {
          updatedProfile.preferredLivelihood = 'Self-employment';
          updatedProfile.careerGoal = 'Establish an independent enterprise with PM-AJAY 100% GIA toolkit grant.';
        } else {
          updatedProfile.preferredLivelihood = 'Job';
          updatedProfile.careerGoal = 'Secure a salaried job with certified NSQF credentials.';
        }
      }
    }

    // Voice Intent Detection (Yes/No/Repeat/Change)
    const voiceIntent = text ? extractVoiceCommandIntent(text) : null;

    // Strict sequential 10-stage evaluation
    let nextStage: DialogueStage = 'name';

    if (stage === 'confirm_summary') {
      if (voiceIntent === 'CONFIRM_YES') {
        nextStage = 'complete';
      } else if (voiceIntent === 'CONFIRM_NO') {
        nextStage = 'name';
      } else {
        nextStage = 'confirm_summary';
      }
    } else if (voiceIntent === 'CHANGE_AGE') {
      nextStage = 'age';
    } else if (voiceIntent === 'CHANGE_LOCATION') {
      nextStage = 'location';
    } else if (voiceIntent === 'CHANGE_SKILL') {
      nextStage = 'skills';
    } else {
      // Find the next missing field in strict order:
      // 1. Name
      if (!updatedProfile.name) {
        nextStage = 'name';
      }
      // 2. Age
      else if (!updatedProfile.age) {
        nextStage = 'age';
      }
      // 3. Date of Birth
      else if (!updatedProfile.dob) {
        nextStage = 'dob';
      }
      // 4. Education
      else if (!updatedProfile.education) {
        nextStage = 'education';
      }
      // 5. Skills
      else if (!updatedProfile.existingSkills || updatedProfile.existingSkills.length === 0) {
        nextStage = 'skills';
      }
      // 6. Experience
      else if (updatedProfile.workExperienceYears === undefined || updatedProfile.workExperienceYears === null) {
        nextStage = 'experience';
      }
      // 7. Current Occupation
      else if (!updatedProfile.currentOccupation) {
        nextStage = 'occupation';
      }
      // 8. Location
      else if (!updatedProfile.district && !updatedProfile.state) {
        nextStage = 'location';
      }
      // 9. Livelihood Goal
      else if (!updatedProfile.preferredLivelihood) {
        nextStage = 'livelihood_goal';
      }
      // 10. All collected -> Confirmation
      else {
        nextStage = 'confirm_summary';
      }
    }

    const stageConfig = langPack[nextStage] || langPack['name'];
    const assistantResponseText = stageConfig.prompt(updatedProfile);

    return NextResponse.json({
      success: true,
      data: {
        reply: assistantResponseText,
        stage: nextStage,
        language: langKey,
        extractedFields,
        updatedProfile,
        suggestedPrompts: stageConfig.suggestions,
        isConfirmed: nextStage === 'complete'
      }
    });

  } catch (error: any) {
    console.error('Error in /api/chat route:', error);
    return NextResponse.json({ error: 'Failed to process voice assistant chat', details: error.message }, { status: 500 });
  }
}
