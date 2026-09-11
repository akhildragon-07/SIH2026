import { NextResponse } from 'next/server';
import { analyzeBeneficiaryProfile, extractProfileFromText } from '@/lib/ai-engine';
import { BeneficiaryProfile } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    let profile: BeneficiaryProfile;

    if (body.profile) {
      profile = body.profile;
    } else if (body.transcript) {
      const extracted = extractProfileFromText(body.transcript, body.currentProfile);
      profile = {
        name: extracted.name || body.currentProfile?.name || 'Ravi',
        age: extracted.age || body.currentProfile?.age || 24,
        gender: extracted.gender || body.currentProfile?.gender || 'Male',
        state: extracted.state || body.currentProfile?.state || 'Andhra Pradesh',
        district: extracted.district || body.currentProfile?.district || 'Vizianagaram',
        areaType: extracted.areaType || body.currentProfile?.areaType || 'Rural',
        education: extracted.education || body.currentProfile?.education || '10th Pass',
        currentOccupation: extracted.currentOccupation || body.currentProfile?.currentOccupation || 'Unemployed',
        existingSkills: extracted.existingSkills && extracted.existingSkills.length > 0 ? extracted.existingSkills : ['Tailoring', 'Sewing', 'Stitching'],
        workExperienceYears: extracted.workExperienceYears || body.currentProfile?.workExperienceYears || 2,
        monthlyIncome: extracted.monthlyIncome || body.currentProfile?.monthlyIncome || '₹4,000 – ₹7,000',
        preferredLivelihood: extracted.preferredLivelihood || body.currentProfile?.preferredLivelihood || 'Self-employment',
        interests: extracted.interests || body.currentProfile?.interests || ['garments'],
        careerGoal: extracted.careerGoal || body.currentProfile?.careerGoal || 'self-employment'
      };
    } else {
      return NextResponse.json({ error: 'Missing profile or transcript in request body' }, { status: 400 });
    }

    // Attempt calling Python FastAPI Backend (http://127.0.0.1:8000/recommend)
    try {
      const pythonRes = await fetch('http://127.0.0.1:8000/recommend?top_k=5', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          education: profile.education.replace(' Pass', ''),
          age: profile.age,
          state: profile.state,
          district: profile.district,
          location: profile.district ? `${profile.district}, ${profile.state}` : profile.state,
          occupation: profile.currentOccupation,
          experience_years: profile.workExperienceYears,
          skills: profile.existingSkills,
          interest: (profile.interests && profile.interests[0]) || '',
          interests: profile.interests,
          career_goal: profile.careerGoal,
          preferred_livelihood: profile.preferredLivelihood
        })
      });

      if (pythonRes.ok) {
        const pyData = await pythonRes.json();
        const fallbackAnalysis = analyzeBeneficiaryProfile(profile);

        // Enrich response with Python FastAPI hybrid recommendations
        return NextResponse.json({
          success: true,
          source: "Python FastAPI Hybrid Recommender",
          data: {
            ...fallbackAnalysis,
            fastapiRecommendations: pyData
          }
        });
      }
    } catch (pyErr) {
      // Python server not active locally; proceed with internal AI engine
    }

    // Fallback to internal TS AI Engine
    const analysis = analyzeBeneficiaryProfile(profile);
    return NextResponse.json({ success: true, source: "Internal AI Engine", data: analysis });

  } catch (error: any) {
    console.error('Error in /api/analyze route:', error);
    return NextResponse.json({ error: 'Failed to process AI analysis', details: error.message }, { status: 500 });
  }
}
