import { NextResponse } from 'next/server';
import { AdminAnalyticsData } from '@/lib/types';
import { getDistrictOpportunityStats } from '@/lib/opportunity-matcher';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'backend', 'data', 'registered_beneficiaries.json');

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const selectedState = searchParams.get('state') || 'All';
  const selectedDistrict = searchParams.get('district') || 'All';

  // Read live registered beneficiaries count if file exists
  let registeredCount = 0;
  try {
    if (fs.existsSync(DATA_FILE)) {
      const bList = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      if (Array.isArray(bList)) registeredCount = bList.length;
    }
  } catch (e) {}

  const districtOpportunityStats = getDistrictOpportunityStats();

  const analyticsData: AdminAnalyticsData = {
    totalBeneficiaries: 18450 + registeredCount,
    scBeneficiariesPercentage: 100, // 100% target under PM-AJAY SC GIA component
    totalSkillsMapped: 42780 + registeredCount * 3,
    skillGapsIdentified: 14220 + registeredCount * 2,
    nsqfCoursesRecommended: 26890 + registeredCount * 2,
    totalGiaGrantAllocatedINR: 94250000 + registeredCount * 50000,
    educationBreakdown: [
      { label: 'Below 8th Pass', count: 4240, percentage: 23 },
      { label: '8th Pass', count: 5350, percentage: 29 },
      { label: '10th Pass', count: 6270, percentage: 34 },
      { label: '12th Pass', count: 1840, percentage: 10 },
      { label: 'Graduate & Above', count: 750, percentage: 4 }
    ],
    topExistingSkills: [
      { skill: 'Automotive Repair & Servicing', count: 7420, percentage: 32.5 },
      { skill: 'Electrical Wiring & Solar Installation', count: 6890, percentage: 30.2 },
      { skill: 'Garment Tailoring & Stitching', count: 5890, percentage: 25.8 },
      { skill: 'Food Processing & Packaging', count: 5210, percentage: 22.8 },
      { skill: 'Agriculture & Allied Farming', count: 4120, percentage: 18.0 }
    ],
    topSkillGaps: [
      { skill: 'Digital Diagnostics & EV Servicing', count: 12400, percentage: 65.2 },
      { skill: 'Industrial Automation & CNC Operation', count: 9950, percentage: 52.3 },
      { skill: 'FSSAI Food Standards & Commercial Preservation', count: 8620, percentage: 45.3 },
      { skill: 'Solar PV Inverter Synchronization', count: 7810, percentage: 41.0 }
    ],
    livelihoodPreferences: [
      { category: 'Self-employment (PM-AJAY GIA Toolkit)', percentage: 52 },
      { category: 'Wage Employment (Job Placement)', percentage: 32 },
      { category: 'Micro-Entrepreneurship / FPO', percentage: 11 },
      { category: 'Apprenticeship / Skilling', percentage: 5 }
    ],
    districtDistribution: [
      { district: 'Theni (TN)', beneficiaries: 3850, topNeed: 'Automotive & Tailoring GIA Toolkits' },
      { district: 'Madurai (TN)', beneficiaries: 3420, topNeed: 'Welding & Solar PV Installation' },
      { district: 'Bengaluru Urban (KA)', beneficiaries: 4180, topNeed: 'Electrician & EV Technician' },
      { district: 'Pune (MH)', beneficiaries: 3950, topNeed: 'Food Processing & CNC Machining' },
      { district: 'Vizianagaram (AP)', beneficiaries: 2910, topNeed: 'Apparel Tailoring & Bio-farming' },
      { district: 'Sitapur (UP)', beneficiaries: 3150, topNeed: 'Solar Pumps & Food Preservation' }
    ],
    sectorDemand: [
      { sector: 'Automotive & EV', demandPercentage: 30 },
      { sector: 'Electrical & Power', demandPercentage: 25 },
      { sector: 'Food Processing', demandPercentage: 20 },
      { sector: 'Apparel & Tailoring', demandPercentage: 15 },
      { sector: 'Agriculture & Green Energy', demandPercentage: 10 }
    ]
  };

  return NextResponse.json({
    success: true,
    filters: { state: selectedState, district: selectedDistrict },
    districtOpportunityStats,
    data: analyticsData
  });
}

