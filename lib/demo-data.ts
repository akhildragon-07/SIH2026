import { BeneficiaryProfile } from './types';

export const DEMO_BENEFICIARIES: { id: string; label: string; tag: string; profile: BeneficiaryProfile }[] = [
  {
    id: 'demo-ravi',
    label: 'Ravi Kumar (Rural Tailor)',
    tag: '10th Pass · Rural AP · Self-Employment',
    profile: {
      id: 'demo-ravi',
      name: 'Ravi Kumar',
      age: 26,
      gender: 'Male',
      state: 'Andhra Pradesh',
      district: 'Vizianagaram',
      areaType: 'Rural',
      education: '10th Pass',
      currentOccupation: 'Local Stitching Worker',
      existingSkills: ['Basic Tailoring', 'Garment Finishing', 'Hand Stitching'],
      workExperienceYears: 2,
      monthlyIncome: '₹4,000 – ₹7,000',
      preferredLivelihood: 'Self-employment',
      interests: ['Garment Design', 'Boutique Setup', 'Uniform Stitching'],
      careerGoal: 'Establish an independent home tailoring unit with motorized equipment under PM-AJAY GIA'
    }
  },
  {
    id: 'demo-sunita',
    label: 'Sunita Devi (Organic Farmer & Poultry)',
    tag: '8th Pass · Rural UP · Agro GIA Grant',
    profile: {
      id: 'demo-sunita',
      name: 'Sunita Devi',
      age: 32,
      gender: 'Female',
      state: 'Uttar Pradesh',
      district: 'Sitapur',
      areaType: 'Rural',
      education: '8th Pass',
      currentOccupation: 'Agricultural Labourer',
      existingSkills: ['Cattle Care', 'Soil Preparation', 'Crop Harvesting'],
      workExperienceYears: 5,
      monthlyIncome: 'Below ₹5,000',
      preferredLivelihood: 'Self-employment',
      interests: ['Organic Farming', 'Backyard Poultry', 'Vermi-composting'],
      careerGoal: 'Run an organic bio-fertilizer and backyard egg production unit for sustainable daily income'
    }
  },
  {
    id: 'demo-manoj',
    label: 'Manoj Paswan (Digital & Electronics Youth)',
    tag: '12th Pass · Peri-Urban Bihar · Job / Tech Kiosk',
    profile: {
      id: 'demo-manoj',
      name: 'Manoj Paswan',
      age: 22,
      gender: 'Male',
      state: 'Bihar',
      district: 'Gaya',
      areaType: 'Semi-Urban',
      education: '12th Pass',
      currentOccupation: 'Unemployed Youth',
      existingSkills: ['English Typing', 'Smartphone Repair', 'MS Office Basics'],
      workExperienceYears: 1,
      monthlyIncome: 'Below ₹3,000',
      preferredLivelihood: 'Job',
      interests: ['Data Entry', 'Mobile Hardware Repair', 'Digital CSC Outlet'],
      careerGoal: 'Secure a Data Entry Operator job or launch a Mobile Repair & Digital Service Center'
    }
  },
  {
    id: 'demo-priya',
    label: 'Priya Valmiki (Beauty Therapist)',
    tag: '10th Pass · Urban Maharashtra · Home Parlour',
    profile: {
      id: 'demo-priya',
      name: 'Priya Valmiki',
      age: 24,
      gender: 'Female',
      state: 'Maharashtra',
      district: 'Solapur',
      areaType: 'Urban',
      education: '10th Pass',
      currentOccupation: 'Assistant at Local Parlour',
      existingSkills: ['Threading & Waxing', 'Basic Facials', 'Customer Service'],
      workExperienceYears: 2,
      monthlyIncome: '₹6,000 – ₹8,000',
      preferredLivelihood: 'Self-employment',
      interests: ['Bridal Grooming', 'Skin Treatments', 'Salon Management'],
      careerGoal: 'Establish a certified doorstep bridal & beauty salon with PM-AJAY GIA toolkit support'
    }
  }
];
