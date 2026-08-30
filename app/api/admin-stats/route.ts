import { NextResponse } from 'next/server';
import { AdminAnalyticsData } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const selectedState = searchParams.get('state') || 'All';
  const selectedDistrict = searchParams.get('district') || 'All';

  // Realistic SIH Demo Analytics Dataset for PM-AJAY GIA Component
  const analyticsData: AdminAnalyticsData = {
    totalBeneficiaries: 18450,
    scBeneficiariesPercentage: 100, // 100% target under PM-AJAY SC GIA component
    totalSkillsMapped: 42780,
    skillGapsIdentified: 14220,
    nsqfCoursesRecommended: 26890,
    totalGiaGrantAllocatedINR: 94250000, // ₹9.42 Crores GIA Component
    educationBreakdown: [
      { label: 'Below 8th Pass', count: 4240, percentage: 23 },
      { label: '8th Pass', count: 5350, percentage: 29 },
      { label: '10th Pass', count: 6270, percentage: 34 },
      { label: '12th Pass', count: 1840, percentage: 10 },
      { label: 'Graduate & Above', count: 750, percentage: 4 }
    ],
    topExistingSkills: [
      { skill: 'Garment Tailoring & Stitching', count: 6890, percentage: 37.3 },
      { skill: 'Agriculture & Allied Farming', count: 5210, percentage: 28.2 },
      { skill: 'Handicrafts & Embroidery', count: 3120, percentage: 16.9 },
      { skill: 'Retail Counter Sales', count: 1940, percentage: 10.5 },
      { skill: 'Construction & Plumbing', count: 1290, percentage: 7.1 }
    ],
    topSkillGaps: [
      { skill: 'Digital Payments & Online Selling', count: 11400, percentage: 61.8 },
      { skill: 'Equipment Maintenance & Costing', count: 8950, percentage: 48.5 },
      { skill: 'Formal NSQF Level 4 Certification', count: 7620, percentage: 41.3 },
      { skill: 'Solar PV Panel Installation', count: 4810, percentage: 26.1 }
    ],
    livelihoodPreferences: [
      { category: 'Self-employment (PM-AJAY GIA Toolkit)', percentage: 56 },
      { category: 'Wage Employment (Job Placement)', percentage: 28 },
      { category: 'Micro-Entrepreneurship / FPO', percentage: 11 },
      { category: 'Advanced Skilling Pathway', percentage: 5 }
    ],
    districtDistribution: [
      { district: 'Vizianagaram (AP)', beneficiaries: 3420, topNeed: 'Apparel Tailoring & GIA Toolkits' },
      { district: 'Sitapur (UP)', beneficiaries: 4180, topNeed: 'Organic Poultry & Vermi-composting' },
      { district: 'Gaya (Bihar)', beneficiaries: 2910, topNeed: 'Data Entry & Mobile Electronics' },
      { district: 'Solapur (MH)', beneficiaries: 3150, topNeed: 'Beauty & Wellness Enterprise' },
      { district: 'Jalandhar (Punjab)', beneficiaries: 2490, topNeed: 'Automotive 2-Wheeler Mechanics' },
      { district: 'Coimbatore (TN)', beneficiaries: 2300, topNeed: 'Textile Machine Operation' }
    ],
    sectorDemand: [
      { sector: 'Apparel & Textiles', demandPercentage: 35 },
      { sector: 'Agriculture & Livestock', demandPercentage: 26 },
      { sector: 'Electronics & Solar', demandPercentage: 18 },
      { sector: 'IT & Digital Services', demandPercentage: 12 },
      { sector: 'Beauty & Healthcare', demandPercentage: 9 }
    ]
  };

  return NextResponse.json({
    success: true,
    filters: { state: selectedState, district: selectedDistrict },
    data: analyticsData
  });
}
