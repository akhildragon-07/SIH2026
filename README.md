# SakshamAI — AI-Driven Voice Assistant for Livelihood Mapping & NSQF Recommendations

> **Smart India Hackathon Prototype**  
> *Problem Statement: AI-Driven Voice Assistant for Livelihood Mapping and NSQF-Aligned Skilling Recommendations for SC Communities under the GIA component of PM-AJAY.*

---

## Overview

**SakshamAI** is a production-style public-service platform designed specifically for Scheduled Caste (SC) beneficiaries under the Grants-in-Aid (GIA) component of **Pradhan Mantri Anusuchit Jaati Abhyuday Yojana (PM-AJAY)**.

By leveraging browser-native **Web Speech API (Speech-to-Text & Text-to-Speech)** and a multi-factor recommendation engine, SakshamAI eliminates literacy, language, and technological barriers. Beneficiaries can speak naturally in English or regional Indian languages (Hindi, Telugu, Tamil, Marathi) to receive personalized **NSQF Qualification Pack (Levels 1-5)** recommendations, **PM-AJAY GIA equipment toolkits**, and **sustainable career roadmaps**.

---

## Key Features

1. **Multilingual AI Voice Assistant (`VoiceAssistant.tsx`)**:
   - Real-time Speech-to-Text (STT) and Text-to-Speech (TTS) audio playback.
   - Animated pulse waveform visualizer during mic recording.
   - Dynamic prompt pills to guide conversation.
   - Real-time live profile extraction panel.

2. **NSQF Qualification Pack Matching Engine (`NSQFRecommendations.tsx`)**:
   - Dataset covering 12+ sectors (Apparel, Agriculture, IT-ITeS, Electronics, Renewable Energy, Beauty & Wellness, Healthcare, Automotive, Retail, Construction).
   - Official Qualification Pack (QP) Codes, NSQF Levels (1-5), duration, eligibility, skills taught, and certifying bodies (AMHSSC, ASCI, ESSCI, NASSCOM, etc.).
   - Transparent AI rationale ("Why this course was recommended").

3. **PM-AJAY GIA Livelihood Scheme Hub (`LivelihoodRecommendations.tsx`)**:
   - Self-employment toolkits with PM-AJAY GIA financial grants (e.g., motorized sewing machine + cutting table kit, solar maintenance toolkit, mobile repair Rework station).
   - Job placements, micro-entrepreneurship, and FPO collectives.

4. **Skill Gap Analysis & Diagnostic (`SkillGapAnalysis.tsx`)**:
   - Mapped existing baseline skills vs missing target skills.
   - Skilling Readiness Index (0-100 score) and priority training callouts.

5. **Personalized 5-Step Career Roadmap (`CareerRoadmap.tsx`)**:
   - Visual flowchart tracking progress from current skill baseline → NSQF training → NCVET certification → PM-AJAY GIA toolkit → target monthly income (₹16,000–₹28,000).

6. **Ministry Admin Dashboard (`AdminDashboard.tsx`)**:
   - Real-time analytics for government/NGO administrators.
   - District-wise demand mapping, education level breakdown, top skill gaps, GIA grant allocation metrics, and district filter tools.

7. **Hackathon 1-Click Demo Beneficiary Mode (`DemoBeneficiarySelector.tsx`)**:
   - Pre-loaded sample profiles for instant live judge testing:
     - **Ravi Kumar** (Rural Tailor · 10th Pass · AP)
     - **Sunita Devi** (Organic Farmer & Poultry · 8th Pass · UP)
     - **Manoj Paswan** (Digital & Electronics Youth · 12th Pass · Bihar)
     - **Priya Valmiki** (Beauty Therapist · 10th Pass · Maharashtra)

---

## Technical Stack

- **Framework**: Next.js 16 (React 19, TypeScript)
- **Styling**: Tailwind CSS v4
- **Voice Engine**: Browser SpeechRecognition & SpeechSynthesis API
- **API Routes**:
  - `POST /api/chat`: Multilingual conversational AI dialogue & follow-ups
  - `POST /api/analyze`: Profile parsing, skill gap calculation, NSQF course matching, and career roadmap generation
  - `GET /api/admin-stats`: Aggregated analytics for PM-AJAY GIA administrators
- **Icons**: Lucide React

---

## Setup & Running Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Open Browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## Data Safety & Architecture

- **Separation of Demo vs. Official Data**: The prototype clearly tags verified NCVET NSQF dataset elements while establishing extensible JSON schemas to integrate directly with official Skill India Digital Hub and PM-AJAY backend APIs.
- **Privacy First**: Voice processing executes locally within the browser Web Speech engine without recording sensitive biometric audio files.
