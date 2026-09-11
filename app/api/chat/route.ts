import { NextResponse } from 'next/server';
import {
  extractProfileFromText,
  extractVoiceCommandIntent,
  generateVerbalProfileSummary,
  getLanguageInstruction
} from '@/lib/ai-engine';
import { BeneficiaryProfile } from '@/lib/types';
import {
  normalizeStateName,
  normalizeDistrictName,
  isValidState,
  isValidDistrictForState,
  getDistrictsForState,
  getDistrictInfo,
  validateStateAndDistrict
} from '@/lib/india-locations';

export type DialogueStage =
  | 'name'
  | 'state'
  | 'district'
  | 'education'
  | 'age'
  | 'occupation'
  | 'experience'
  | 'skills'
  | 'interest'
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
      suggestions: ["My name is Satil", "My name is Ramesh Kumar", "Pooja Sharma"]
    },
    state: {
      prompt: (p) => p.name ? `Nice to meet you, ${p.name}! Which Indian State do you live in?` : "Which Indian State do you live in?",
      suggestions: ["Tamil Nadu", "Karnataka", "Maharashtra", "Andhra Pradesh", "Uttar Pradesh", "Bihar"]
    },
    district: {
      prompt: (p) => p.state ? `Great! Which District in ${p.state} do you reside in?` : "Which District do you reside in?",
      suggestions: ["Theni", "Bengaluru Urban", "Pune", "Vizianagaram", "Sitapur", "Gaya"]
    },
    education: {
      prompt: () => "What is your highest level of education? (e.g., 10th Pass, 12th Pass, Graduate, ITI, 8th Pass)",
      suggestions: ["10th Pass", "12th Pass", "Graduate & Above", "ITI / Diploma", "8th Pass", "Below 8th"]
    },
    age: {
      prompt: () => "Thank you. What is your age?",
      suggestions: ["24 years old", "28 years", "32 years old"]
    },
    occupation: {
      prompt: () => "What work or occupation are you currently doing?",
      suggestions: ["Tailoring from home", "Electrician assistant", "Automotive helper", "Food processing worker", "Unemployed / Looking for work"]
    },
    experience: {
      prompt: (p) => p.existingSkills && p.existingSkills.length > 0
        ? `How many years of work experience do you have in ${p.existingSkills[0]}?`
        : "How many years of work experience do you have?",
      suggestions: ["2 years", "3 years", "1 year", "No experience, want to learn"]
    },
    skills: {
      prompt: () => "What vocational or technical skills do you currently possess?",
      suggestions: ["Automobile & mechanics", "Electrical wiring & solar", "Tailoring & sewing", "Food processing & packaging", "Computer & typing"]
    },
    interest: {
      prompt: () => "Which industry sector or job role are you most interested in pursuing?",
      suggestions: ["Automotive & EV", "Electrical & Power", "Food Processing", "Apparel & Tailoring", "Agriculture & Dairy", "IT & Digital Services"]
    },
    livelihood_goal: {
      prompt: () => "What is your career goal: a salaried job, self-employment with PM-AJAY toolkit grant, or enterprise?",
      suggestions: ["Self-employment with PM-AJAY toolkit grant", "Salaried Job in a company", "Entrepreneurship"]
    },
    confirm_summary: {
      prompt: (p) => generateVerbalProfileSummary(p, 'English'),
      suggestions: ["Yes, that's correct", "No, I want to change something"]
    },
    complete: {
      prompt: (p) => `Awesome ${p.name || 'Beneficiary'}! Your PM-AJAY profile for ${p.district || 'your district'}, ${p.state || 'your state'} has been registered. Mapping personalized opportunities now.`,
      suggestions: ["Show my opportunities", "View PM-AJAY toolkit grant"]
    }
  },

  'Tamil': {
    name: {
      prompt: () => "வணக்கம்! நான் சக்ஷம் AI, PM-AJAY திட்டத்தின் குரல் வழிகாட்டி. உங்கள் முழு பெயர் என்ன?",
      suggestions: ["என் பெயர் சதீல்", "என் பெயர் சதீஷ்", "என் பெயர் முருகன்", "சுனிதா"]
    },
    state: {
      prompt: (p) => p.name ? `வணக்கம் ${p.name}! நீங்கள் எந்த மாநிலத்தில் வசிக்கிறீர்கள்?` : "நீங்கள் எந்த மாநிலத்தில் வசிக்கிறீர்கள்?",
      suggestions: ["தமிழ்நாடு (Tamil Nadu)", "கர்நாடகா", "ஆந்திரப் பிரதேசம்", "கேரளா", "மகாராஷ்டிரா"]
    },
    district: {
      prompt: (p) => p.state ? `அருமை! ${p.state} மாநிலத்தில் உங்கள் மாவட்டம் எது?` : "உங்கள் மாவட்டம் எது?",
      suggestions: ["தேனி (Theni)", "மதுரை (Madurai)", "சென்னை (Chennai)", "கோயம்புத்தூர் (Coimbatore)", "சேலம் (Salem)", "திண்டுக்கல்"]
    },
    education: {
      prompt: () => "நன்றி. நீங்கள் எவ்வளவு வரை படித்திருக்கிறீர்கள்? (எ.கா. 10-வது வகுப்பு, 12-வது வகுப்பு, பட்டப்படிப்பு, ITI)",
      suggestions: ["10-வது வகுப்பு (10th)", "12-வது வகுப்பு (+2)", "பட்டப்படிப்பு (Degree)", "ஐடிஐ / டிப்ளமோ", "8-வது வகுப்பு"]
    },
    age: {
      prompt: () => "உங்கள் வயது என்ன?",
      suggestions: ["வயது 24", "26 வயது", "28", "30 வயது"]
    },
    occupation: {
      prompt: () => "தற்போது நீங்கள் என்ன வேலை செய்கிறீர்கள்?",
      suggestions: ["வீட்டில் தையல் வேலை", "எலக்ட்ரீசியன் வேலை", "விவசாயம்", "வேலை தேடுகிறேன்"]
    },
    experience: {
      prompt: (p) => p.existingSkills && p.existingSkills.length > 0
        ? `உங்களுக்கு ${p.existingSkills[0]} வேலையில் எத்தனை வருட அனுபவம் உள்ளது?`
        : "இந்த வேலையில் உங்களுக்கு எத்தனை வருட அனுபவம் உள்ளது?",
      suggestions: ["2 வருட அனுபவம்", "3 வருடங்கள்", "1 வருடம்", "அனுபவம் இல்லை"]
    },
    skills: {
      prompt: () => "உங்களுக்கு என்னென்ன தொழில் வேலைகள் அல்லது கைவினைத் திறன்கள் தெரியும்?",
      suggestions: ["தையல் மற்றும் ஆடை தைப்பது", "ஆட்டோமொபைல் மெக்கானிக்", "எலக்ட்ரிக்கல் வயரிங்", "உணவு பதப்படுத்துதல்", "கணினி"]
    },
    interest: {
      prompt: () => "நீங்கள் எந்த துறையில் வாய்ப்பு பெற விரும்புகிறீர்கள்?",
      suggestions: ["ஆட்டோமொபைல் (Automotive)", "எலக்ட்ரிக்கல் & பவர்", "தையல் மற்றும் ஆடை", "உணவு பதப்படுத்துதல்", "விவசாயம்"]
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
      prompt: (p) => `அற்புதம் ${p.name || 'பயனாளி'}! ${p.district || ''}, ${p.state || ''} பகுதிக்கான உங்கள் விவரங்கள் பதிவு செய்யப்பட்டன. வாய்ப்புகளை இப்போது காண்பிக்கிறேன்.`,
      suggestions: ["என் வாய்ப்புகளை காட்டுங்கள்", "PM-AJAY டூல்கிட் விவரங்கள்"]
    }
  },

  'Telugu': {
    name: {
      prompt: () => "నమస్కారం! నేను సాక్షమ్ AI, PM-AJAY వాయిస్ గైడ్. మీ పూర్తి పేరు ఏమిటి?",
      suggestions: ["నా పేరు సతీల్", "నా పేరు రమేష్", "సునీత"]
    },
    state: {
      prompt: (p) => p.name ? `ధన్యవాదాలు ${p.name}! మీరు ఏ రాష్ట్రంలో నివసిస్తున్నారు?` : "మీరు ఏ రాష్ట్రంలో నివసిస్తున్నారు?",
      suggestions: ["ఆంధ్రప్రదేశ్", "తెలంగాణ", "తమిళనాడు", "కర్ణాటక", "మహారాష్ట్ర"]
    },
    district: {
      prompt: (p) => p.state ? `చాలా మంచిది! ${p.state}లో మీ జిల్లా ఏది?` : "మీ జిల్లా ఏది?",
      suggestions: ["విజయనగరం", "విశాఖపట్నం", "గుంటూరు", "కృష్ణా", "హైదరాబాద్"]
    },
    education: {
      prompt: () => "మీరు ఎంతవరకు చదువుకున్నారు? (ఉదా: 10వ తరగతి, ఇంటర్, డిగ్రీ, ITI)",
      suggestions: ["10వ తరగతి పాస్", "ఇంటర్ / 12వ", "డిగ్రీ (Degree)", "ఐటీఐ / డిప్లొమా", "8వ తరగతి"]
    },
    age: {
      prompt: () => "మీ వయస్సు ఎంత?",
      suggestions: ["24 సంవత్సరాలు", "26 సంవత్సరాలు", "28 సంవత్సరాలు"]
    },
    occupation: {
      prompt: () => "ప్రస్తుతం మీరు ఏ పని చేస్తున్నారు?",
      suggestions: ["ఇంట్లో కుట్టుపని", "ఎలక్ట్రీషియన్", "ఆటోమొబైల్ మెకానిక్", "ఉద్యోగం కోసం చూస్తున్నాను"]
    },
    experience: {
      prompt: (p) => "ఈ పనిలో మీకు ఎన్ని సంవత్సరాల అనుభవం ఉంది?",
      suggestions: ["2 సంవత్సరాల అనుభవం", "3 సంవత్సరాలు", "1 సంవత్సరం", "అనుభవం లేదు"]
    },
    skills: {
      prompt: () => "మీకు ఏయే పనుల్లో నైపుణ్యం ఉంది?",
      suggestions: ["టైలరింగ్ & కుట్టుపని", "ఆటోమొబైల్ రిపేర్", "ఎలక్ట్రికల్ వైరింగ్", "ఫుడ్ ప్రాసెసింగ్", "కంప్యూటర్ & టైపింగ్"]
    },
    interest: {
      prompt: () => "మీరు ఏ రంగంలో పనిచేయడానికి ఆసక్తి చూపుతున్నారు?",
      suggestions: ["ఆటోమొబైల్", "ఎలక్ట్రికల్ & పవర్", "ఫుడ్ ప్రాసెసింగ్", "టైలరింగ్", "వ్యవసాయం"]
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
      prompt: (p) => `అద్భుతం ${p.name || 'లబ్ధిదారు'} గారు! ${p.district || ''}, ${p.state || ''} వివరాలు నమోదు చేయబడ్డాయి.`,
      suggestions: ["నా అవకాశాలు చూపించండి", "టూల్‌కిట్ గ్రాంట్ వివరాలు"]
    }
  },

  'Hindi': {
    name: {
      prompt: () => "नमस्ते! मैं सक्षम AI हूँ, पीएम-अजय योजना के तहत आपका आवाज़ सहायक। आपका पूरा नाम क्या है?",
      suggestions: ["मेरा नाम सतील है", "मेरा नाम राहुल कुमार है", "सुनीता देवी"]
    },
    state: {
      prompt: (p) => p.name ? `धन्यवाद ${p.name}! आप भारत के किस राज्य में रहते हैं?` : "आप भारत के किस राज्य में रहते हैं?",
      suggestions: ["तमिलनाडु (Tamil Nadu)", "महाराष्ट्र (Maharashtra)", "उत्तर प्रदेश", "बिहार", "कर्नाटक"]
    },
    district: {
      prompt: (p) => p.state ? `बहुत अच्छा! ${p.state} में आपका जिला कौन-सा है?` : "आपका जिला कौन-सा है?",
      suggestions: ["थेनी (Theni)", "पुणे (Pune)", "वाराणसी", "सीतापुर", "गया", "पटना"]
    },
    education: {
      prompt: () => "आपकी उच्चतम शिक्षा कितनी है? (जैसे: 10वीं पास, 12वीं पास, स्नातक, आईटीआई)",
      suggestions: ["10वीं पास", "12वीं पास / इंटर", "स्नातक (Graduate)", "आईटीआई / डिप्लोमा", "8वीं पास"]
    },
    age: {
      prompt: () => "आपकी उम्र कितनी है?",
      suggestions: ["24 वर्ष", "26 साल", "28 वर्ष", "30 साल"]
    },
    occupation: {
      prompt: () => "वर्तमान में आप क्या काम करते हैं?",
      suggestions: ["घर से सिलाई का काम", "इलेक्ट्रीशियन", "ऑटोमोबाइल मैकेनिक", "बेरोजगार / काम की तलाश"]
    },
    experience: {
      prompt: (p) => "आपको इस काम में कितने साल का कार्य अनुभव है?",
      suggestions: ["2 साल का अनुभव", "3 साल", "1 साल", "अनुभव नहीं है"]
    },
    skills: {
      prompt: () => "आपको कौन-सा काम या हुनर आता है?",
      suggestions: ["सिलाई-कटाई और टेलरिंग", "ऑटोमोबाइल रिपेयर", "बिजली वायरिंग और सोलर", "खाद्य प्रसंस्करण", "कंप्यूटर"]
    },
    interest: {
      prompt: () => "आप किस क्षेत्र में अवसर पाना चाहते हैं?",
      suggestions: ["ऑटोमोबाइल (Automotive)", "इलेक्ट्रिकल और पावर", "खाद्य प्रसंस्करण (Food Processing)", "सिलाई और परिधान", "कृषि"]
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
      prompt: (p) => `शानदार ${p.name || 'लाभार्थी'}! ${p.district || ''}, ${p.state || ''} के लिए आपका पंजीकरण पूरा हुआ।`,
      suggestions: ["मेरी आजीविका योजना दिखाएं", "टूलकिट अनुदान जानकारी"]
    }
  },

  'Kannada': {
    name: {
      prompt: () => "ನಮಸ್ಕಾರ! ನಾನು ಸಕ್ಷಮ್ AI, PM-AJAY ಧ್ವನಿ ಮಾರ್ಗದರ್ಶಿ. ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು ಏನು?",
      suggestions: ["ನನ್ನ ಹೆಸರು ಸತೀಲ್", "ಮಂಜುನಾಥ್", "ಸುನೀತಾ"]
    },
    state: {
      prompt: (p) => p.name ? `ಧನ್ಯವಾದಗಳು ${p.name}! ನೀವು ಯಾವ ರಾಜ್ಯದಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದೀರಿ?` : "ನೀವು ಯಾವ ರಾಜ್ಯದಲ್ಲಿ ವಾಸಿಸುತ್ತಿದ್ದೀರಿ?",
      suggestions: ["ಕರ್ನಾಟಕ (Karnataka)", "ತಮಿಳುನಾಡು", "ಆಂಧ್ರಪ್ರದೇಶ", "ಮಹಾರಾಷ್ಟ್ರ"]
    },
    district: {
      prompt: (p) => p.state ? `ಉತ್ತಮ! ${p.state} ರಾಜ್ಯದಲ್ಲಿ ನಿಮ್ಮ ಜಿಲ್ಲೆ ಯಾವುದು?` : "ನಿಮ್ಮ ಜಿಲ್ಲೆ ಯಾವುದು?",
      suggestions: ["ಬೆಂಗಳೂರು (Bengaluru)", "ಮೈಸೂರು (Mysuru)", "ಬೆಳಗಾವಿ", "ಕಲಬುರಗಿ"]
    },
    education: {
      prompt: () => "ನಿಮ್ಮ ವಿದ್ಯಾಭ್ಯಾಸ ಎಷ್ಟು ಆಗಿದೆ? (ಉದಾ: 10ನೇ ತರಗತಿ, ಪಿಯುಸಿ, ಪದವಿ, ITI)",
      suggestions: ["10ನೇ ತರಗತಿ ಪಾಸ್", "ಪಿಯುಸಿ / 12ನೇ", "ಪದವಿ (Degree)", "ಐಟಿಐ / ಡಿಪ್ಲೋಮಾ"]
    },
    age: {
      prompt: () => "ನಿಮ್ಮ ವಯಸ್ಸು ಎಷ್ಟು?",
      suggestions: ["24 ವರ್ಷ", "26 ವರ್ಷ", "28 ವರ್ಷ"]
    },
    occupation: {
      prompt: () => "ಪ್ರಸ್ತುತ ನೀವು ಯಾವ ಕೆಲಸ ಮಾಡುತ್ತಿದ್ದೀರಿ?",
      suggestions: ["ಮನೆಯಲ್ಲಿ ಹೊಲಿಗೆ ಕೆಲಸ", "ಎಲೆಕ್ಟ್ರಿಷಿಯನ್", "ಕೃಷಿ", "ಉದ್ಯೋಗ ಹುಡುಕುತ್ತಿದ್ದೇನೆ"]
    },
    experience: {
      prompt: (p) => "ಈ ಕೆಲಸದಲ್ಲಿ ನಿಮಗೆ ಎಷ್ಟು ವರ್ಷಗಳ ಅನುಭವವಿದೆ?",
      suggestions: ["2 ವರ್ಷಗಳ ಅನುಭವ", "3 ವರ್ಷ", "1 ವರ್ಷ", "ಅನುಭವವಿಲ್ಲ"]
    },
    skills: {
      prompt: () => "ನಿಮಗೆ ಯಾವ ಕೆಲಸ ಅಥವಾ ಕೌಶಲ್ಯ ಗೊತ್ತು?",
      suggestions: ["ಟೈಲರಿಂಗ್ ಮತ್ತು ಹೊಲಿಗೆ", "ಆಟೋಮೊಬೈಲ್ ರಿಪೇರಿ", "ಎಲೆಕ್ಟ್ರಿಕಲ್ ವೈರಿಂಗ್", "ಆಹಾರ ಸಂಸ್ಕರಣೆ"]
    },
    interest: {
      prompt: () => "ನೀವು ಯಾವ ಕ್ಷೇತ್ರದಲ್ಲಿ ತರಬೇತಿ ಅಥವಾ ಉದ್ಯೋಗ ಬಯಸುತ್ತೀರಿ?",
      suggestions: ["ಆಟೋಮೊಬೈಲ್", "ಎಲೆಕ್ಟ್ರಿಕಲ್ & ಪವರ್", "ಆಹಾರ ಸಂಸ್ಕರಣೆ", "ಟೈಲರಿಂಗ್"]
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
      prompt: (p) => `ಅದ್ಭುತ ${p.name || 'ಫಲಾನುಭವಿ'}! ${p.district || ''}, ${p.state || ''} ವಿವರಗಳು ದೃಢೀಕರಿಸಲ್ಪಟ್ಟಿವೆ.`,
      suggestions: ["ನನ್ನ ಅವಕಾಶಗಳನ್ನು ತೋರಿಸಿ", "ಟೂಲ್‌ಕಿಟ್ ವಿವರಗಳು"]
    }
  },

  'Malayalam': {
    name: {
      prompt: () => "നമസ്കാരം! ഞാൻ സക്ഷം AI, PM-AJAY വോയ്‌സ് ഗൈഡ്. നിങ്ങളുടെ പൂർണ്ണ പേര് എന്താണ്?",
      suggestions: ["എന്റെ പേര് സതീൽ", "വിഷ്ണു", "രമേഷ്"]
    },
    state: {
      prompt: (p) => p.name ? `നന്ദി ${p.name}! നിങ്ങൾ ഏത് സംസ്ഥാനത്താണ് താമസിക്കുന്നത്?` : "നിങ്ങൾ ഏത് സംസ്ഥാനത്താണ് താമസിക്കുന്നത്?",
      suggestions: ["കേരളം (Kerala)", "തമിഴ്നാട് (Tamil Nadu)", "കർണാടക"]
    },
    district: {
      prompt: (p) => p.state ? `നല്ലത്! ${p.state}ൽ നിങ്ങളുടെ ജില്ല ഏതാണ്?` : "നിങ്ങളുടെ ജില്ല ഏതാണ്?",
      suggestions: ["എറണാകുളം (Ernakulam)", "തിരുവനന്തപുരം", "കോഴിക്കോട്", "തൃശ്ശൂർ"]
    },
    education: {
      prompt: () => "നിങ്ങളുടെ വിദ്യാഭ്യാസ യോഗ്യത എന്താണ്? (ഉദാ: 10-ാം ക്ലാസ്, പ്ലസ് ടു, ബിരുദം, ITI)",
      suggestions: ["10-ാം ക്ലാസ് പാസ്", "പ്ലസ് ടു / 12th", "ബിരുദം (Degree)", "ഐടിഐ / ഡിപ്ലോമ"]
    },
    age: {
      prompt: () => "നിങ്ങളുടെ പ്രായം എത്രയാണ്?",
      suggestions: ["24 വയസ്സ്", "26 വയസ്സ്", "28 വയസ്സ്"]
    },
    occupation: {
      prompt: () => "നിലവിൽ നിങ്ങൾ എന്ത് ജോലിയാണ് ചെയ്യുന്നത്?",
      suggestions: ["വീട്ടിൽ തയ്യൽ ജോലി", "ഇലക്ട്രീഷ്യൻ", "കൃഷി", "ജോലി അന്വേഷിക്കുന്നു"]
    },
    experience: {
      prompt: (p) => "ഈ ജോലിയിൽ നിങ്ങൾക്ക് എത്ര വർഷത്തെ പരിചയമുണ്ട്?",
      suggestions: ["2 വർഷത്തെ പരിചയം", "3 വർഷം", "1 വർഷം", "പരിചയമില്ല"]
    },
    skills: {
      prompt: () => "നിങ്ങൾക്ക് എന്തൊക്കെ തൊഴിൽ കഴിവുകൾ അറിയാം?",
      suggestions: ["തയ്യൽ ജോലി", "ഓട്ടോമൊബൈൽ", "ഇലക്ട്രിക്കൽ വയറിംഗ്", "ഭക്ഷ്യ സംസ്കരണം"]
    },
    interest: {
      prompt: () => "നിങ്ങൾക്ക് ഏത് മേഖലയിലാണ് താൽപ്പര്യം?",
      suggestions: ["ഓട്ടോമൊബൈൽ", "ഇലക്ട്രിക്കൽ & പവർ", "ഭക്ഷ്യ സംസ്കരണം", "തയ്യൽ"]
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
      prompt: (p) => `മികച്ചത് ${p.name || 'ഗുണഭോക്താവ്'}! ${p.district || ''}, ${p.state || ''} വിവരങ്ങൾ സ്ഥിരീകരിച്ചു.`,
      suggestions: ["എന്റെ അവസരങ്ങൾ കാണിക്കുക", "ടൂൾകിറ്റ് വിവരങ്ങൾ"]
    }
  },

  'Marathi': {
    name: {
      prompt: () => "नमस्ते! मी सक्षम AI आहे, PM-AJAY योजनेतील तुमचा व्हॉईस मार्गदर्शक. आपले पूर्ण नाव काय आहे?",
      suggestions: ["माझे नाव सतील आहे", "सचिन", "राहुल"]
    },
    state: {
      prompt: (p) => p.name ? `धन्यवाद ${p.name}! आपण कोणत्या राज्यात राहता?` : "आपण कोणत्या राज्यात राहता?",
      suggestions: ["महाराष्ट्र (Maharashtra)", "गुजरात", "कर्नाटक", "मध्य प्रदेश"]
    },
    district: {
      prompt: (p) => p.state ? `छान! ${p.state} मध्ये आपला जिल्हा कोणता आहे?` : "आपला जिल्हा कोणता आहे?",
      suggestions: ["पुणे (Pune)", "सोलापूर (Solapur)", "मुंबई", "नागपूर", "नाशिक"]
    },
    education: {
      prompt: () => "आपले शिक्षण किती झाले आहे? (उदा: 10वी पास, 12वी पास, पदवीधर, ITI)",
      suggestions: ["10वी पास", "12वी पास", "पदवीधर (Graduate)", "आयटीआय / डिप्लोमा"]
    },
    age: {
      prompt: () => "आपले वय किती आहे?",
      suggestions: ["24 वर्षे", "26 वर्षे", "28 वर्षे"]
    },
    occupation: {
      prompt: () => "सध्या आपण काय काम करता?",
      suggestions: ["घरी शिवणकाम", "इलेक्ट्रीशियन", "ऑटोमोबाईल", "शेती", "नोकरी शोधत आहे"]
    },
    experience: {
      prompt: (p) => "या कामात आपल्याला किती वर्षांचा अनुभव आहे?",
      suggestions: ["2 वर्षे अनुभव", "3 वर्षे", "1 वर्ष", "अनुभव नाही"]
    },
    skills: {
      prompt: () => "आपल्याला कोणते कामाचे कौशल्य येते?",
      suggestions: ["टेलरिंग आणि शिवणकाम", "ऑटोमोबाईल मेकॅनिक", "इलेक्ट्रिकल वायरिंग", "अन्न प्रक्रिया"]
    },
    interest: {
      prompt: () => "आपल्याला कोणत्या क्षेत्रात संधी हवी आहे?",
      suggestions: ["ऑटोमोबाईल", "इलेक्ट्रिकल & पॉवर", "अन्न प्रक्रिया (Food Processing)", "टेलरिंग"]
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
      prompt: (p) => `उत्तम ${p.name || 'लाभार्थी'}! ${p.district || ''}, ${p.state || ''} साठी आपली माहिती नोंदवली गेली आहे.`,
      suggestions: ["माझ्या संधी दाखवा", "टूलकिट अनुदान माहिती"]
    }
  }
};

export async function POST(request: Request) {
  try {
    const {
      message,
      language = 'English',
      preferredLanguage,
      currentProfile = {},
      stage = 'name'
    } = await request.json();

    // Resolve explicit language configuration & system instruction
    const chosenLangInput = preferredLanguage || language || 'English';
    const langConfig = getLanguageInstruction(chosenLangInput);
    const langKey = langConfig.languageName;
    const prefLangCode = langConfig.preferredLanguage;

    const text = message ? message.trim() : '';
    const extractedFields = text ? extractProfileFromText(text, currentProfile) : {};

    const updatedProfile: Partial<BeneficiaryProfile> = {
      ...currentProfile,
      ...extractedFields,
      preferredLanguage: prefLangCode
    };

    const langPack = INTERACTIVE_DIALOGUE[langKey] || INTERACTIVE_DIALOGUE['English'];
    let validationErrorMsg: string | null = null;

    // Stage-specific processing and rigorous State/District validation
    if (text) {
      if (stage === 'name' && !updatedProfile.name) {
        const cleanedName = text.replace(/^(my\s+name\s+is|i\s+am|myself|i['’]m|என்\s+பெயர்|నా\s+పేరు|मेरा\s+नाम|ನನ್ನ\s+ಹೆಸರು|എന്റെ\s+പേര്|माझे\s+नाव)\s+/i, '').trim();
        if (cleanedName.length >= 2 && !/^\d+$/.test(cleanedName)) {
          updatedProfile.name = cleanedName.charAt(0).toUpperCase() + cleanedName.slice(1);
        }
      } else if (stage === 'state') {
        const normalizedSt = normalizeStateName(text);
        if (normalizedSt && isValidState(normalizedSt)) {
          updatedProfile.state = normalizedSt;
          // Check if user also gave a valid district in that state
          const dInfo = getDistrictInfo(text, normalizedSt);
          if (dInfo && isValidDistrictForState(normalizedSt, dInfo.district)) {
            updatedProfile.district = dInfo.district;
          }
        } else {
          // Invalid state provided
          validationErrorMsg = `State "${text}" is not recognized in India. Please provide a valid Indian State (e.g., Tamil Nadu, Karnataka, Maharashtra, Andhra Pradesh, Uttar Pradesh).`;
        }
      } else if (stage === 'district') {
        const userState = updatedProfile.state || 'Tamil Nadu';
        const cleanedDist = text.replace(/^(i\s+live\s+in|from|in|district|மாவட்டம்|జిల్లా|जिला)\s+/i, '').trim();
        
        // Validate district against current state
        const isDistValidForState = isValidDistrictForState(userState, cleanedDist);
        if (isDistValidForState) {
          updatedProfile.district = normalizeDistrictName(cleanedDist, userState);
        } else {
          // District does NOT belong to this state (e.g. State: Tamil Nadu, District: Jaipur)
          const validDists = getDistrictsForState(userState);
          const sampleDists = validDists.slice(0, 5).join(', ');
          validationErrorMsg = `District "${cleanedDist}" does not belong to ${userState}. Please provide a valid district in ${userState} (e.g., ${sampleDists}).`;
        }
      } else if (stage === 'education' && !updatedProfile.education) {
        if (/grad|degree|college|btech|bsc|bcom|ba/i.test(text)) updatedProfile.education = 'Graduate & Above';
        else if (/iti|diploma/i.test(text)) updatedProfile.education = 'ITI / Diploma';
        else if (/12|twelve|\+2|puc|inter/i.test(text)) updatedProfile.education = '12th Pass';
        else if (/8|eight/i.test(text)) updatedProfile.education = '8th Pass';
        else if (/below|5th|primary/i.test(text)) updatedProfile.education = 'Below 8th';
        else updatedProfile.education = '10th Pass';
      } else if (stage === 'age' && !updatedProfile.age) {
        const numMatch = text.match(/\b(\d{1,2})\b/);
        if (numMatch) {
          const num = parseInt(numMatch[1], 10);
          if (num >= 15 && num <= 75) updatedProfile.age = num;
        }
      } else if (stage === 'occupation' && !updatedProfile.currentOccupation) {
        if (text.length >= 2) {
          const cleanedOcc = text.replace(/^(i\s+work\s+as|i\s+do|currently\s+doing|my\s+work\s+is)\s+/i, '').trim();
          updatedProfile.currentOccupation = cleanedOcc.charAt(0).toUpperCase() + cleanedOcc.slice(1);
        }
      } else if (stage === 'experience' && (updatedProfile.workExperienceYears === undefined || updatedProfile.workExperienceYears === null)) {
        const numMatch = text.match(/\b(\d{1,2})\b/);
        if (numMatch) {
          updatedProfile.workExperienceYears = parseInt(numMatch[1], 10);
        } else if (/no|zero|fresher|none|இல்லை|లేదు|ಇಲ್ಲ|അല്ല|नहीं|नाही/i.test(text)) {
          updatedProfile.workExperienceYears = 0;
        } else {
          updatedProfile.workExperienceYears = 1;
        }
      } else if (stage === 'skills' && (!updatedProfile.existingSkills || updatedProfile.existingSkills.length === 0)) {
        if (text.length >= 3) {
          updatedProfile.existingSkills = [text.charAt(0).toUpperCase() + text.slice(1)];
        }
      } else if (stage === 'interest' && !updatedProfile.interests?.length) {
        if (text.length >= 3) {
          const interestVal = text.charAt(0).toUpperCase() + text.slice(1);
          updatedProfile.interests = [interestVal];
        }
      } else if (stage === 'livelihood_goal' && !updatedProfile.preferredLivelihood) {
        if (/self|business|shop|toolkit|grant|own|சுயதொழில்|స్వయం|स्वरोजगार|both/i.test(text)) {
          updatedProfile.preferredLivelihood = 'Self-employment';
          updatedProfile.careerGoal = 'Establish an independent enterprise with PM-AJAY 100% GIA toolkit grant.';
        } else if (/entrepreneur|startup/i.test(text)) {
          updatedProfile.preferredLivelihood = 'Entrepreneurship';
          updatedProfile.careerGoal = 'Establish an MSME enterprise with PM-AJAY support.';
        } else {
          updatedProfile.preferredLivelihood = 'Job';
          updatedProfile.careerGoal = 'Secure a salaried job with certified NSQF credentials.';
        }
      }
    }

    // Voice Intent Detection (Yes/No/Repeat/Change)
    const voiceIntent = text ? extractVoiceCommandIntent(text) : null;

    // Strict sequential 10-field evaluation:
    // 1. Name -> 2. State -> 3. District -> 4. Education -> 5. Age -> 6. Occupation -> 7. Experience -> 8. Skills -> 9. Interest -> 10. Goal
    let nextStage: DialogueStage = 'name';

    if (validationErrorMsg) {
      // Retain current stage if validation failed
      nextStage = stage as DialogueStage;
    } else if (stage === 'confirm_summary') {
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
      nextStage = 'state';
    } else if (voiceIntent === 'CHANGE_SKILL') {
      nextStage = 'skills';
    } else {
      // Strict 10-step sequence
      if (!updatedProfile.name) {
        nextStage = 'name';
      } else if (!updatedProfile.state) {
        nextStage = 'state';
      } else if (!updatedProfile.district) {
        nextStage = 'district';
      } else if (!updatedProfile.education) {
        nextStage = 'education';
      } else if (!updatedProfile.age) {
        nextStage = 'age';
      } else if (!updatedProfile.currentOccupation) {
        nextStage = 'occupation';
      } else if (updatedProfile.workExperienceYears === undefined || updatedProfile.workExperienceYears === null) {
        nextStage = 'experience';
      } else if (!updatedProfile.existingSkills || updatedProfile.existingSkills.length === 0) {
        nextStage = 'skills';
      } else if (!updatedProfile.interests || updatedProfile.interests.length === 0) {
        nextStage = 'interest';
      } else if (!updatedProfile.preferredLivelihood) {
        nextStage = 'livelihood_goal';
      } else {
        nextStage = 'confirm_summary';
      }
    }

    const stageConfig = langPack[nextStage] || langPack['name'];
    const assistantResponseText = validationErrorMsg || stageConfig.prompt(updatedProfile);

    // Dynamic suggestions based on selected state when in district stage
    let suggestions = stageConfig.suggestions;
    if (nextStage === 'district' && updatedProfile.state) {
      const stateDists = getDistrictsForState(updatedProfile.state);
      if (stateDists.length > 0) {
        suggestions = stateDists.slice(0, 6);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        reply: assistantResponseText,
        stage: nextStage,
        language: langKey,
        preferredLanguage: prefLangCode,
        extractedFields,
        updatedProfile,
        suggestedPrompts: suggestions,
        isConfirmed: nextStage === 'complete',
        validationError: validationErrorMsg || undefined
      }
    });

  } catch (error: any) {
    console.error('Error in /api/chat route:', error);
    return NextResponse.json({ error: 'Failed to process voice assistant chat', details: error.message }, { status: 500 });
  }
}
