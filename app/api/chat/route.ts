import { NextResponse } from 'next/server';
import { extractProfileFromText } from '@/lib/ai-engine';
import { BeneficiaryProfile } from '@/lib/types';

const TRANSLATED_RESPONSES: Record<string, { welcome: string; eduPrompt: string; skillPrompt: string; completePrompt: string }> = {
  'English': {
    welcome: "Namaste! I am SakshamAI, your PM-AJAY voice guide. I am here to map your skills and find official NSQF training and livelihood opportunities for you. What is your name and location?",
    eduPrompt: "Great! Tell me about your education level (e.g. 8th pass, 10th pass, 12th pass) and your current work experience.",
    skillPrompt: "Wonderful. What skills do you already have, and would you prefer a Job, Self-Employment with PM-AJAY GIA toolkit support, or a Business?",
    completePrompt: "Excellent! I have recorded your details and mapped your strengths. Tap 'Analyze My Pathway' below to view your personalized NSQF training and PM-AJAY livelihood plan!"
  },
  'हिंदी': {
    welcome: "नमस्ते! मैं सक्षम-एआई हूँ, पीएम-अजय योजना के तहत आपका आवाज़ सहायक। मैं आपकी कुशलता को समझकर उपयुक्त एनएसक्यूएफ (NSQF) प्रशिक्षण और आजीविका के अवसर खोजने में मदद करूंगा। आपका नाम और स्थान क्या है?",
    eduPrompt: "बहुत अच्छा! कृपया अपनी शिक्षा (जैसे 8वीं पास, 10वीं पास, 12वीं पास) और वर्तमान अनुभव के बारे में बताएं।",
    skillPrompt: "शाबाश! आपके पास पहले से कौन से कौशल (Skills) हैं, और आप नौकरी (Job) चाहते हैं या पीएम-अजय टूलकिट अनुदान के साथ स्वरोजगार?",
    completePrompt: "शानदार! आपकी सभी जानकारियां रिकॉर्ड कर ली गई हैं। अपनी व्यक्तिगत एनएसक्यूएफ ट्रेनिंग और आजीविका योजना देखने के लिए 'मार्गदर्शन देखें' बटन दबाएं!"
  },
  'తెలుగు': {
    welcome: "నమస్తే! నేను సాక్షమ్ AI, PM-AJAY వాయిస్ గైడ్. మీ నైపుణ్యాలను అంచనా వేసి తగిన NSQF శిక్షణ మరియు ఉపాధి అవకాశాలను సూచిస్తాను. మీ పేరు మరియు ప్రాంతం చెప్పండి.",
    eduPrompt: "చాలా బాగుంది! మీ చదువు (10వ తరగతి / 12వ తరగతి) మరియు అనుభవం గురించి వివరించండి.",
    skillPrompt: "మీకు ఉన్న నైపుణ్యాలు ఏమిటి? మీరు ఉద్యోగం కోరుకుంటున్నారా లేదా PM-AJAY ツールకిట్ సాయంతో స్వయం ఉపాధి పొందుతారా?",
    completePrompt: "మీ వివరాలన్నీ నమోదు చేయబడ్డాయి. మీ NSQF శిక్షణ మరియు ఉపాధి ప్రణాళికను చూడటానికి 'విశ్లేషించు' బటన్ నొక్కండి!"
  },
  'தமிழ்': {
    welcome: "வணக்கம்! நான் சக்ஷம் AI, PM-AJAY திட்டத்தின் குரல் வழிகாட்டி. உங்கள் திறன்களை கண்டறிந்து சிறந்த NSQF பயிற்சி மற்றும் வாழ்வாதார வாய்ப்புகளை பரிந்துரைப்பேன்.",
    eduPrompt: "மிக்க மகிழ்ச்சி! உங்கள் கல்வித் தகுதி மற்றும் வேலை அனுபவத்தைப் பற்றி சொல்லுங்கள்.",
    skillPrompt: "உங்களிடம் உள்ள திறன்கள் என்ன? வேலை விரும்புகிறீர்களா அல்லது PM-AJAY உதவித்தொகையுடன் சுயதொழில் தொடங்குவீர்களா?",
    completePrompt: "உங்கள் விவரங்கள் பதிவு செய்யப்பட்டன. உங்கள் NSQF பயிற்சி மற்றும் வாழ்வாதார திட்டத்தை காண 'பகுப்பாய்வு செய்' பொத்தானை அழுத்தவும்!"
  },
  'मराठी': {
    welcome: "नमस्ते! मी सक्षम-AI आहे, PM-AJAY योजनेतील तुमचा व्हॉईस मार्गदर्शक. मी तुमच्या कौशल्यांचे मॅपिंग करून तुम्हाला योग्य NSQF प्रशिक्षण आणि उपजीविकेच्या संधी शोधण्यात मदत करेन.",
    eduPrompt: "खूप छान! तुमचे शिक्षण (8वी, 10वी, 12वी पास) आणि कामाच्या अनुभवाबद्दल सांगा.",
    skillPrompt: "तुमच्याकडे कोणती कौशल्ये आहेत, आणि तुम्हाला नोकरी हवी आहे की PM-AJAY टूलकिट अनुदानासह स्वयंरोजगार?",
    completePrompt: "उत्तम! तुमची सर्व माहिती नोंदवली गेली आहे. तुमची वैयक्तिक NSQF प्रशिक्षण योजना पाहण्यासाठी 'विश्लेषण करा' बटण दाबा!"
  }
};

export async function POST(request: Request) {
  try {
    const { message, language = 'English', currentProfile = {}, history = [] } = await request.json();

    const text = message ? message.trim() : '';
    const extractedFields = text ? extractProfileFromText(text, currentProfile) : {};

    const updatedProfile: Partial<BeneficiaryProfile> = {
      ...currentProfile,
      ...extractedFields
    };

    const langPack = TRANSLATED_RESPONSES[language] || TRANSLATED_RESPONSES['English'];

    let assistantResponseText = langPack.welcome;
    let suggestedPrompts = [
      "I passed 10th standard",
      "I know tailoring and garment stitching",
      "I want to set up my own home unit"
    ];

    if (!updatedProfile.education) {
      assistantResponseText = langPack.eduPrompt;
      suggestedPrompts = [
        "I am 10th Pass",
        "I have completed 8th Pass",
        "12th Pass with basic computer knowledge"
      ];
    } else if (!updatedProfile.existingSkills || updatedProfile.existingSkills.length === 0) {
      assistantResponseText = langPack.skillPrompt;
      suggestedPrompts = [
        "I know basic tailoring & cutting",
        "I have experience in farming & livestock",
        "I have basic computer & typing skills"
      ];
    } else {
      assistantResponseText = langPack.completePrompt;
      suggestedPrompts = [
        "Analyze my profile and generate my career roadmap",
        "What PM-AJAY GIA toolkit grants am I eligible for?",
        "Show me recommended NSQF courses"
      ];
    }

    return NextResponse.json({
      success: true,
      data: {
        reply: assistantResponseText,
        extractedFields,
        updatedProfile,
        suggestedPrompts
      }
    });

  } catch (error: any) {
    console.error('Error in /api/chat route:', error);
    return NextResponse.json({ error: 'Failed to process voice assistant chat', details: error.message }, { status: 500 });
  }
}
