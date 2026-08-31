import { NextResponse } from 'next/server';
import { extractProfileFromText } from '@/lib/ai-engine';
import { BeneficiaryProfile } from '@/lib/types';

export type DialogueStage = 'name_age' | 'education' | 'skills_exp' | 'location' | 'livelihood_goal' | 'complete';

interface StepContent {
  prompt: (name?: string, edu?: string, skills?: string, dist?: string, state?: string, age?: number) => string;
  suggestions: string[];
}

const INTERACTIVE_DIALOGUE: Record<string, Record<DialogueStage, StepContent>> = {
  'Tamil': {
    name_age: {
      prompt: () => "வணக்கம்! நான் சக்ஷம் AI, PM-AJAY திட்டத்தின் குரல் வழிகாட்டி. உங்கள் முழு பெயர் மற்றும் வயதை சொல்லுங்கள்.",
      suggestions: [
        "யஷ்வந்த், 24",
        "என் பேரு குமார், வயது 28",
        "என் பெயர் சுனிதா, வயது 26"
      ]
    },
    education: {
      prompt: (name, _edu, _skills, _dist, _state, age) =>
        `நன்றி ${name || 'அன்பரே'}${age ? ` (வயது ${age})` : ''}! உங்கள் கல்வித் தகுதி என்ன? (உதாரணமாக: 8-வது வகுப்பு, 10-வது வகுப்பு, 12-வது வகுப்பு, ITI அல்லது பள்ளிக்கு செல்லவில்லை)`,
      suggestions: [
        "10-வது வகுப்பு (10th standard)",
        "12-வது வகுப்பு (+2 pass)",
        "8-வது வகுப்பு (8th Pass)",
        "பள்ளிக்கு செல்லவில்லை (Below 8th)",
        "ஐடிஐ / டிப்ளமோ (ITI)"
      ]
    },
    skills_exp: {
      prompt: (name, edu) =>
        `புரிந்தது, ${edu || 'கல்வி'}! உங்களுக்கு என்னென்ன தொழில் வேலைகள் அல்லது திறன்கள் தெரியும், மற்றும் எத்தனை வருட அனுபவம் உள்ளது? (எ.கா. ப்ளம்பிங், தையல், எலக்ட்ரிக்கல், விவசாயம், கம்ப்யூட்டர்)`,
      suggestions: [
        "ப்ளம்பிங் வேலை, 2 வருட அனுபவம்",
        "தையல் மற்றும் துணி தைப்பது, 3 வருட அனுபவம்",
        "எலக்ட்ரிக்கல் மற்றும் வயரிங் வேலை",
        "கம்ப்யூட்டர், எம்எஸ் வேர்ட் & டைப்பிங்"
      ]
    },
    location: {
      prompt: (name, _edu, skills) =>
        `அருமை${skills ? ` (${skills})` : ''}! நீங்கள் எந்த மாநிலம் மற்றும் மாவட்டத்தில் வசிக்கிறீர்கள்? (எ.கா. தமிழ்நாடு, தேனி மாவட்டம் அல்லது மதுரை)`,
      suggestions: [
        "தமிழ்நாடு, தேனி மாவட்டம்",
        "தமிழ்நாடு, மதுரை மாவட்டம்",
        "தமிழ்நாடு, சென்னை"
      ]
    },
    livelihood_goal: {
      prompt: (name, _edu, _skills, dist, state) =>
        `பதிவு செய்யப்பட்டது (${dist || ''}, ${state || 'தமிழ்நாடு'})! நீங்கள் மாதச் சம்பள வேலை (Job) விரும்புகிறீர்களா அல்லது PM-AJAY டூல்கிட் மானியத்துடன் சொந்த தொழில் (Self-employment) தொடங்க விரும்புகிறீர்களா?`,
      suggestions: [
        "நான் மாதச் சம்பள வேலை (Job) விரும்புகிறேன்",
        "நான் PM-AJAY டூல்கிட் மானியத்துடன் சுயதொழில் தொடங்க விரும்புகிறேன்"
      ]
    },
    complete: {
      prompt: (name, edu, skills, dist, state, age) =>
        `அற்புதம் ${name || 'பயனாளி'}! உங்கள் அதிகாரப்பூர்வ PM-AJAY பயனாளி கணக்கு உருவாக்கப்பட்டது! பதிவு செய்யப்பட்ட விவரங்கள்: பெயர்: ${name || ''}${age ? ` (வயது ${age})` : ''}, கல்வி: ${edu || '10th'}, திறன்கள்: ${skills || 'தொழில் திறன்'}, மாவட்டம்: ${dist || 'தேனி'}, ${state || 'தமிழ்நாடு'}. உங்கள் NSQF பயிற்சி மற்றும் வேலை வாய்ப்புகளைக் காண கீழே உள்ள 'பகுப்பாய்வு செய்' பொத்தானை அழுத்தவும்!`,
      suggestions: [
        "எனது NSQF பயிற்சி மற்றும் PM-AJAY திட்டத்தை காட்டுங்கள்",
        "எனக்கு என்னென்ன டூல்கிட் மானியம் கிடைக்கும்?"
      ]
    }
  },

  'Telugu': {
    name_age: {
      prompt: () => "నమస్తే! నేను సాక్షమ్ AI, PM-AJAY వాయిస్ గైడ్. దయచేసి మీ పూర్తి పేరు మరియు వయస్సు చెప్పండి.",
      suggestions: [
        "అఖిల్, 24",
        "నా పేరు రవి కుమార్, వయస్సు 26",
        "నా పేరు మనీష్, వయస్సు 22"
      ]
    },
    education: {
      prompt: (name, _edu, _skills, _dist, _state, age) =>
        `ధన్యవాదాలు ${name || 'మిత్రమా'}${age ? ` (వయస్సు ${age})` : ''}! మీ చదువు ఎంతవరకు చదివారు? (ఉదాహరణకు: 8వ తరగతి, 10వ తరగతి, 12వ తరగతి, ITI లేదా చదువుకోలేదు)`,
      suggestions: [
        "10వ తరగతి పాస్ (10th standard)",
        "12వ తరగతి / ఇంటర్ (12th standard)",
        "8వ తరగతి పాస్ (8th Pass)",
        "చదువుకోలేదు (Below 8th)",
        "ఐటీఐ / డిప్లొమా"
      ]
    },
    skills_exp: {
      prompt: (name, edu) =>
        `తెలుసుకున్నాను, ${edu || 'చదువు'}! మీకు ఏయే పనుల్లో నైపుణ్యం మరియు ఎంత అనుభవం ఉంది? (ఉదా. ప్లంబింగ్, కుట్టుపని, వైరింగ్, కంప్యూటర్, వ్యవసాయం)`,
      suggestions: [
        "ప్లంబింగ్ పని, 2 సంవత్సరాల అనుభవం",
        "టైలరింగ్ మరియు బట్టలు కుట్టడం, 3 సంవత్సరాల అనుభవం",
        "కంప్యూటర్, ఎంఎస్ వర్డ్ & టైపింగ్",
        "ఎలక్ట్రికల్ వైరింగ్ మరియు మోటార్ పని"
      ]
    },
    location: {
      prompt: (name, _edu, skills) =>
        `చాలా బాగుంది${skills ? ` (${skills})` : ''}! మీరు ఏ రాష్ట్రం మరియు ఏ జిల్లాలో నివసిస్తున్నారు? (ఉదా. ఆంధ్రప్రదేశ్, విజయనగరం జిల్లా)`,
      suggestions: [
        "ఆంధ్రప్రదేశ్, విజయనగరం జిల్లా",
        "ఆంధ్రప్రదేశ్, గుంటూరు జిల్లా",
        "తెలంగాణ, హైదరాబాద్"
      ]
    },
    livelihood_goal: {
      prompt: (name, _edu, _skills, dist, state) =>
        `నమోదైంది (${dist || ''}, ${state || 'ఆంధ్రప్రదేశ్'})! మీరు కంపెనీలో ఉద్యోగం (Job) కోరుకుంటున్నారా లేదా PM-AJAY టూల్‌కిట్ గ్రాంట్‌తో స్వయం ఉపాధి (Self-employment) పొందాలనుకుంటున్నారా?`,
      suggestions: [
        "నేను ఉద్యోగం (Job) కోరుకుంటున్నాను",
        "నేను PM-AJAY టూల్‌కిట్ గ్రాంట్‌తో స్వయం ఉపాధి పొందాలనుకుంటున్నాను"
      ]
    },
    complete: {
      prompt: (name, edu, skills, dist, state, age) =>
        `అద్భుతం ${name || 'లబ్ధిదారు'} గారు! మీ అధికారిక PM-AJAY లబ్ధిదారు ఖాతా సిద్ధమైంది! విద్య: ${edu || '10th'}, నైపుణ్యం: ${skills || 'నైపుణ్యాలు'}, ప్రాంతం: ${dist || 'విజయనగరం'}, ${state || 'ఆంధ్రప్రదేశ్'}. మీ NSQF శిక్షణ మరియు ఉద్యోగ అవకాశాలను చూడటానికి క్రింది బటన్ నొక్కండి!`,
      suggestions: [
        "నా NSQF శిక్షణ మరియు ఉపాధి రోడ్‌మ్యాప్ చూపించండి",
        "నేను ఏ PM-AJAY టూల్‌కిట్ గ్రాంట్‌కు అర్హుడిని?"
      ]
    }
  },

  'Hindi': {
    name_age: {
      prompt: () => "नमस्ते! मैं सक्षम AI हूँ, पीएम-अजय योजना के तहत आपका आवाज़ सहायक। कृपया अपना पूरा नाम और उम्र बताएं।",
      suggestions: [
        "राहुल, 25",
        "मेरा नाम रवि कुमार, उम्र 26 वर्ष",
        "मेरा नाम सुनीता देवी, उम्र 32 वर्ष"
      ]
    },
    education: {
      prompt: (name, _edu, _skills, _dist, _state, age) =>
        `धन्यवाद ${name || 'मित्र'}${age ? ` (उम्र ${age} वर्ष)` : ''}! आपकी पढ़ाई/शिक्षा कितनी हुई है? (जैसे: 8वीं पास, 10वीं पास, 12वीं पास, ITI या स्कूल नहीं गए)`,
      suggestions: [
        "10वीं पास (10th standard)",
        "12वीं पास / इंटर (12th standard)",
        "8वीं पास (8th Pass)",
        "स्कूल नहीं गए (Below 8th)",
        "आईटीआई / डिप्लोमा (ITI)"
      ]
    },
    skills_exp: {
      prompt: (name, edu) =>
        `समझ गया, ${edu || 'शिक्षा'}! आपको कौन-सा काम या हुनर आता है, और कितने साल का अनुभव है? (जैसे: प्लंबिंग, सिलाई-कटाई, बिजली वायरिंग, कंप्यूटर, खेती)`,
      suggestions: [
        "मुझे प्लंबिंग का काम आता है, 2 साल का अनुभव",
        "सिलाई-कटाई और टेलरिंग, 3 साल का अनुभव",
        "कंप्यूटर, एमएस वर्ड और टाइपिंग",
        "बिजली वायरिंग और मोटर रिपेयर"
      ]
    },
    location: {
      prompt: (name, _edu, skills) =>
        `बहुत बढ़िया${skills ? ` (${skills})` : ''}! आप किस राज्य और जिले में रहते हैं? (जैसे उत्तर प्रदेश, वाराणसी जिला या सीतापुर)`,
      suggestions: [
        "उत्तर प्रदेश, वाराणसी जिला",
        "बिहार, गया जिला",
        "उत्तर प्रदेश, सीतापुर जिला"
      ]
    },
    livelihood_goal: {
      prompt: (name, _edu, _skills, dist, state) =>
        `दर्ज कर लिया (${dist || ''}, ${state || 'उत्तर प्रदेश'})! क्या आप मासिक वेतन वाली नौकरी (Job) चाहते हैं या PM-AJAY टूलकिट अनुदान के साथ अपना स्वरोजगार (Self-employment)?`,
      suggestions: [
        "मुझे नौकरी (Job) चाहिए",
        "मुझे PM-AJAY टूलकिट अनुदान के साथ स्वरोजगार शुरू करना है"
      ]
    },
    complete: {
      prompt: (name, edu, skills, dist, state, age) =>
        `शानदार ${name || 'लाभार्थी'}! आपका आधिकारिक PM-AJAY लाभार्थी खाता तैयार है! दर्ज विवरण: नाम: ${name || ''}${age ? ` (उम्र ${age})` : ''}, शिक्षा: ${edu || '10वीं'}, कौशल: ${skills || 'हुनर'}, जिला: ${dist || 'वाराणसी'}, ${state || 'उत्तर प्रदेश'}। अपनी NSQF ट्रेनिंग और आजीविका योजना देखने के लिए नीचे बटन दबाएं!`,
      suggestions: [
        "मेरी व्यक्तिगत NSQF ट्रेनिंग योजना दिखाएं",
        "मुझे कौन सा PM-AJAY टूलकिट अनुदान मिलेगा?"
      ]
    }
  },

  'Marathi': {
    name_age: {
      prompt: () => "नमस्ते! मी सक्षम-AI आहे, PM-AJAY योजनेतील तुमचा व्हॉईस मार्गदर्शक. कृपया आपले पूर्ण नाव आणि वय सांगा.",
      suggestions: [
        "सचिन, 24",
        "माझे नाव राहुल, वय 26 वर्षे",
        "माझे नाव सुनिता, वय 30 वर्षे"
      ]
    },
    education: {
      prompt: (name, _edu, _skills, _dist, _state, age) =>
        `धन्यवाद ${name || 'मित्रा'}${age ? ` (वय ${age} वर्षे)` : ''}! तुमचे शिक्षण किती झाले आहे? (उदा. 8वी पास, 10वी पास, 12वी पास, ITI किंवा शिक्षण झालेले नाही)`,
      suggestions: [
        "10वी पास (10th standard)",
        "12वी पास (12th standard)",
        "8वी पास (8th Pass)",
        "शिक्षण झालेले नाही (Below 8th)",
        "आयटीआय / डिप्लोमा"
      ]
    },
    skills_exp: {
      prompt: (name, edu) =>
        `समजले, ${edu || 'शिक्षण'}! तुम्हाला कोणते कामाचे कौशल्य आणि किती वर्षांचा अनुभव आहे? (उदा. प्लंबिंग, शिवणकाम, वायरिंग, संगणक, शेती)`,
      suggestions: [
        "मला प्लंबिंगचे काम येते, 2 वर्षे अनुभव",
        "टेलरिंग आणि शिवणकाम, 3 वर्षे अनुभव",
        "संगणक, एमएस वर्ड आणि टायपिंग",
        "इलेक्ट्रिकल वायरिंगचे काम"
      ]
    },
    location: {
      prompt: (name, _edu, skills) =>
        `छान${skills ? ` (${skills})` : ''}! आपण कोणत्या राज्य आणि जिल्ह्यात राहता? (उदा. महाराष्ट्र, सोलापूर जिल्हा किंवा पुणे)`,
      suggestions: [
        "महाराष्ट्र, सोलापूर जिल्हा",
        "महाराष्ट्र, पुणे जिल्हा",
        "महाराष्ट्र, मुंबई"
      ]
    },
    livelihood_goal: {
      prompt: (name, _edu, _skills, dist, state) =>
        `नोंदवले (${dist || ''}, ${state || 'महाराष्ट्र'})! तुम्हाला नोकरी (Job) हवी आहे की PM-AJAY टूलकिट अनुदानासह स्वतःचा व्यवसाय (Self-employment)?`,
      suggestions: [
        "मला नोकरी (Job) हवी आहे",
        "मला PM-AJAY टूलकिट अनुदानासह स्वतःचा व्यवसाय सुरू करायचा आहे"
      ]
    },
    complete: {
      prompt: (name, edu, skills, dist, state, age) =>
        `उत्तम ${name || 'लाभार्थी'}! तुमचे अधिकृत PM-AJAY खाते तयार झाले आहे! नाव: ${name || ''}${age ? ` (वय ${age})` : ''}, शिक्षण: ${edu || '10th'}, कौशल्ये: ${skills || 'कौशल्य'}, जिल्हा: ${dist || 'सोलापूर'}, ${state || 'महाराष्ट्र'}. तुमची NSQF प्रशिक्षण योजना पाहण्यासाठी खालील बटण दाबा!`,
      suggestions: [
        "माझी NSQF प्रशिक्षण आणि उपजीविका योजना दाखवा",
        "मला कोणते PM-AJAY टूलकिट अनुदान मिळेल?"
      ]
    }
  },

  'English': {
    name_age: {
      prompt: () => "Namaste! I am SakshamAI, your PM-AJAY voice guide. Please tell me your full name and age.",
      suggestions: [
        "Yashwant, 24",
        "My name is Yashwant, age 24",
        "Hey I'm Akhil, age 26"
      ]
    },
    education: {
      prompt: (name, _edu, _skills, _dist, _state, age) =>
        `Thank you ${name || 'friend'}${age ? ` (Age ${age})` : ''}! What is your educational qualification? (For example: 8th Pass, 10th Pass, 12th Pass, ITI, or did not attend school)`,
      suggestions: [
        "10th standard pass",
        "12th standard pass",
        "8th Pass",
        "Did not attend school (Below 8th)",
        "ITI / Diploma",
        "Graduate & Above"
      ]
    },
    skills_exp: {
      prompt: (name, edu) =>
        `Got it, ${edu || 'Education'}! What trade skills or work experience do you have, and how many years? (For example: Plumbing, Tailoring, Electrical, Computers, Farming)`,
      suggestions: [
        "Plumbing with 2 years of experience",
        "Tailoring & Stitching with 3 years experience",
        "MS Word & Excel computer skills",
        "Electrical House Wiring & Testing",
        "Organic Farming & Agriculture"
      ]
    },
    location: {
      prompt: (name, _edu, skills) =>
        `Great${skills ? ` (${skills})` : ''}! Which State and District do you live in? (For example: Tamil Nadu Theni, Andhra Pradesh Vizianagaram, Uttar Pradesh Varanasi)`,
      suggestions: [
        "Tamil Nadu, Theni district",
        "Andhra Pradesh, Vizianagaram",
        "Uttar Pradesh, Varanasi",
        "Maharashtra, Solapur"
      ]
    },
    livelihood_goal: {
      prompt: (name, _edu, _skills, dist, state) =>
        `Recorded (${dist || ''}, ${state || 'India'})! Are you looking for a salaried Job in a company, or do you want to start Self-Employment with 100% PM-AJAY GIA equipment toolkit support?`,
      suggestions: [
        "I am looking for a salaried Job",
        "I want Self-employment with PM-AJAY toolkit grant"
      ]
    },
    complete: {
      prompt: (name, edu, skills, dist, state, age) =>
        `Awesome ${name || 'Beneficiary'}! Your official PM-AJAY Beneficiary Account is ready! We have recorded: Name: ${name || ''}${age ? ` (Age ${age})` : ''}, Education: ${edu || '10th Pass'}, Skills: ${skills || 'Trade Skills'}, Location: ${dist || 'District'}, ${state || 'State'}. Tap 'View Mapped Pathway' below to view your personalized NSQF training and verified job placements!`,
      suggestions: [
        "Show my NSQF Training & Livelihood Pathway",
        "What PM-AJAY GIA toolkit grants am I eligible for?"
      ]
    }
  }
};

export async function POST(request: Request) {
  try {
    const { message, language = 'English', currentProfile = {}, stage } = await request.json();

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
    else if (langLower.includes('hindi') || language.includes('हिंदी') || langLower.startsWith('hi')) langKey = 'Hindi';
    else if (langLower.includes('marathi') || language.includes('मराठी') || langLower.startsWith('mr')) langKey = 'Marathi';
    else {
      // Auto-detect native script from spoken message only if default English was selected
      if (/[\u0B80-\u0BFF]/.test(text)) langKey = 'Tamil';
      else if (/[\u0C00-\u0C7F]/.test(text)) langKey = 'Telugu';
      else if (/[\u0900-\u097F]/.test(text)) {
        if (text.includes('आहे') || text.includes('माझे') || text.includes('नाव') || text.includes('वर्षे')) {
          langKey = 'Marathi';
        } else {
          langKey = 'Hindi';
        }
      }
    }

    const langPack = INTERACTIVE_DIALOGUE[langKey] || INTERACTIVE_DIALOGUE['English'];

    // Stage progression strictly follows:
    // 1. name_age -> 2. education -> 3. skills_exp -> 4. location -> 5. livelihood_goal -> 6. complete
    let nextStage: DialogueStage = 'name_age';

    const hasName = updatedProfile.name && !['Ravi Kumar', 'Sunil', 'Demo User'].includes(updatedProfile.name);
    const hasEducation = updatedProfile.education;
    const hasSkills = updatedProfile.existingSkills && updatedProfile.existingSkills.length > 0;
    const hasLocation = updatedProfile.district && updatedProfile.state;
    const hasGoal = updatedProfile.preferredLivelihood;

    if (!hasName) {
      nextStage = 'name_age';
    } else if (!hasEducation) {
      nextStage = 'education';
    } else if (!hasSkills) {
      nextStage = 'skills_exp';
    } else if (!hasLocation) {
      nextStage = 'location';
    } else if (!hasGoal) {
      nextStage = 'livelihood_goal';
    } else {
      nextStage = 'complete';
    }

    const stageConfig = langPack[nextStage];
    const skillsSummary = (updatedProfile.existingSkills || []).slice(0, 2).join(', ');
    const assistantResponseText = stageConfig.prompt(
      updatedProfile.name,
      updatedProfile.education,
      skillsSummary,
      updatedProfile.district,
      updatedProfile.state,
      updatedProfile.age
    );

    return NextResponse.json({
      success: true,
      data: {
        reply: assistantResponseText,
        stage: nextStage,
        language: langKey,
        extractedFields,
        updatedProfile,
        suggestedPrompts: stageConfig.suggestions
      }
    });

  } catch (error: any) {
    console.error('Error in /api/chat route:', error);
    return NextResponse.json({ error: 'Failed to process voice assistant chat', details: error.message }, { status: 500 });
  }
}


