import { LivelihoodOpportunity } from './types';

export const LIVELIHOOD_OPPORTUNITIES_DATASET: LivelihoodOpportunity[] = [
  // SELF-EMPLOYMENT / GIA TOOLKITS
  {
    id: 'live-se-01',
    title: 'PM-AJAY Home-Based Garment Tailoring Enterprise',
    category: 'Self-employment',
    sector: 'Apparel & Garmenting',
    location: 'District Level / Rural & Urban',
    requiredSkills: ['Pattern Making', 'Garment Construction', 'Sewing Machine Operation'],
    incomeRange: '₹14,000 – ₹26,000 / month',
    giaSupport: 'Full GIA Grant for Motorized Sewing Machine + Cutting Table + Initial Fabric Raw Material Toolkit (up to ₹50,000 subsidy)',
    financialAssistance: '100% GIA Subsidy for SC Beneficiaries under PM-AJAY component',
    description: 'Establish a custom stitching enterprise from home or rented micro-shop. High demand for school uniforms, festive wear, and ladies apparel.',
    isVerifiedGovernmentData: true
  },
  {
    id: 'live-se-02',
    title: 'Suryamitra Rooftop Solar Installation Service Kiosk',
    category: 'Self-employment',
    sector: 'Renewable Energy & Electronics',
    location: 'District & Block Centers',
    requiredSkills: ['Solar Panel Mounting', 'Inverter Wiring', 'Electrical Testing'],
    incomeRange: '₹18,000 – ₹35,000 / month',
    giaSupport: 'PM-AJAY GIA Toolset Grant: Safety Harness, Digital Multimeter, Solar Crimping Tools & Battery Tester',
    financialAssistance: 'PM-Surya Ghar Scheme Integration + GIA Micro-Credit Linkage',
    description: 'Operate a local solar installation and maintenance agency catering to rural households and PM-Surya Ghar beneficiaries.',
    isVerifiedGovernmentData: true
  },
  {
    id: 'live-se-03',
    title: 'Village Mobile Hardware Repair & CSC Digital Outlet',
    category: 'Self-employment',
    sector: 'Electronics & IT Services',
    location: 'Panchayat / Village Market Center',
    requiredSkills: ['SMD Soldering', 'PCB Diagnostics', 'Digital Payments & UPI', 'Office Software'],
    incomeRange: '₹15,000 – ₹30,000 / month',
    giaSupport: 'GIA Equipment Grant for SMD Rework Station, Microscope, Soldering Kit & Thermal Printer',
    financialAssistance: 'PM-AJAY GIA Grant + CSC VLE Registration Support',
    description: 'Provide smartphone repair, digital bill payments, e-governance application filing, and banking correspondent services for rural communities.',
    isVerifiedGovernmentData: true
  },
  {
    id: 'live-se-04',
    title: 'Backyard Organic Poultry & Egg Supply Unit',
    category: 'Self-employment',
    sector: 'Agriculture & Livestock',
    location: 'Rural Villages & Peri-Urban Areas',
    requiredSkills: ['Shed Management', 'Poultry Feeding', 'Vaccination Basics'],
    incomeRange: '₹12,000 – ₹22,000 / month',
    giaSupport: 'PM-AJAY GIA Grant for 100 Country Chicks + Feed Supply + Shed Construction Subsidy',
    financialAssistance: '100% Grant under PM-AJAY GIA SC Beneficiary Livelihood Scheme',
    description: 'Set up a high-margin organic free-range poultry unit producing country eggs and meat with zero ongoing feed stress.',
    isVerifiedGovernmentData: true
  },
  {
    id: 'live-se-05',
    title: 'Home Beauty Parlour & Doorstep Wellness Service',
    category: 'Self-employment',
    sector: 'Beauty & Wellness',
    location: 'Urban & Semi-Urban Colonies',
    requiredSkills: ['Facial Treatments', 'Bridal Makeup', 'Threading & Waxing'],
    incomeRange: '₹16,000 – ₹32,000 / month',
    giaSupport: 'GIA Beauty Kit Grant: Professional Facial Steamer, Hair Dryer, Makeup Trolley & Consumables',
    financialAssistance: 'PM-AJAY GIA Grant + Mudra Shishu Loan Linkage',
    description: 'Provide salon and bridal grooming services at home or via mobile doorstep bookings for events and weddings.',
    isVerifiedGovernmentData: true
  },

  // JOBS
  {
    id: 'live-job-01',
    title: 'General Duty Assistant (GDA) - District Hospital / Private Clinic',
    category: 'Job',
    sector: 'Healthcare & Nursing Support',
    location: 'District Headquarter Hospitals & Nursing Homes',
    requiredSkills: ['Patient Care', 'Vital Signs Monitoring', 'Infection Control'],
    incomeRange: '₹15,000 – ₹22,000 / month + ESI / PF',
    giaSupport: 'Free PM-AJAY NSQF Level 4 GDA Training + Placement Assistance',
    financialAssistance: 'Stipend during training period',
    description: 'Immediate appointment as bedside healthcare assistant in super-specialty hospitals and regional medical centers.',
    isVerifiedGovernmentData: true
  },
  {
    id: 'live-job-02',
    title: 'Domestic Data Entry Operator (DEO)',
    category: 'Job',
    sector: 'IT-ITeS & Digital',
    location: 'District Collectorate / CSC / Private IT Parks',
    requiredSkills: ['Alphanumeric Data Typing', 'MS Office & Excel', 'Document Digitization'],
    incomeRange: '₹14,000 – ₹20,000 / month',
    giaSupport: 'Skill Training + Computer Lab Access under PM-AJAY',
    financialAssistance: 'Direct Benefit Transfer (DBT) Skilling Allowance',
    description: 'Desk role managing data entry, record maintenance, and digital document processing in government and private offices.',
    isVerifiedGovernmentData: true
  },
  {
    id: 'live-job-03',
    title: 'Apparel Factory Sewing Machine Technician',
    category: 'Job',
    sector: 'Apparel & Garmenting',
    location: 'Textile Parks & Industrial Garment Hubs',
    requiredSkills: ['Lockstitch Machine Operation', 'Garment Assembly Line'],
    incomeRange: '₹13,500 – ₹19,000 / month + Subsidized Hostel',
    giaSupport: 'Free NSQF Skilling + On-the-Job Training (OJT)',
    financialAssistance: 'Post-Placement Transport & Housing Allowance under PM-AJAY',
    description: 'Employment in major garment export manufacturers with structured career advancement to line supervisor.',
    isVerifiedGovernmentData: true
  },
  {
    id: 'live-job-04',
    title: 'Solar Power Plant Operations & Maintenance Assistant',
    category: 'Job',
    sector: 'Renewable Energy',
    location: 'State Solar Parks / Commercial Sites',
    requiredSkills: ['PV Panel Mounting', 'Electrical Safety', 'System Testing'],
    incomeRange: '₹16,000 – ₹25,000 / month',
    giaSupport: 'Suryamitra Certified Course Placement Drive',
    financialAssistance: 'Insurance Cover + Safety Equipment Kit',
    description: 'Technical field role maintaining solar array strings, inverters, and transformer connections at utility-scale solar farms.',
    isVerifiedGovernmentData: true
  },

  // ENTREPRENEURSHIP
  {
    id: 'live-ent-01',
    title: 'SC Farmer Producers Organisation (FPO) - Bio-Fertilizer Unit',
    category: 'Entrepreneurship',
    sector: 'Agriculture & Bio-Tech',
    location: 'Block Level Agro Cluster',
    requiredSkills: ['Vermi-composting', 'Organic Certification', 'Direct Farmer Marketing'],
    incomeRange: '₹25,000 – ₹50,000 / month per member',
    giaSupport: 'PM-AJAY Capital Grant up to ₹10 Lakhs for SC Enterprise Group / Collective',
    financialAssistance: 'NABARD + PM-AJAY Co-Financing',
    description: 'Scale up from individual organic farming to a bio-fertilizer manufacturing collective serving 500+ local farmers.',
    isVerifiedGovernmentData: true
  },
  {
    id: 'live-ent-02',
    title: 'Multi-Brand Two-Wheeler & EV Service Workshop',
    category: 'Entrepreneurship',
    sector: 'Automotive',
    location: 'Highway / Town Junction',
    requiredSkills: ['Engine Diagnostics', 'EV Battery Servicing', 'Workshop Management'],
    incomeRange: '₹30,000 – ₹60,000 / month',
    giaSupport: 'PM-AJAY Infrastructure Subsidy for Hydraulic Lift & Diagnostic Computer',
    financialAssistance: 'Stand-Up India / Mudra Tarun Loan Linkage',
    description: 'Set up a high-volume garage facility offering regular servicing, spare parts sales, and EV battery swapping.',
    isVerifiedGovernmentData: true
  }
];
