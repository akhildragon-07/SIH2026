import { LivelihoodOpportunity } from './types';

export const LIVELIHOOD_OPPORTUNITIES_DATASET: LivelihoodOpportunity[] = [
  // 1. SELF-EMPLOYMENT / PM-AJAY GIA TOOLKITS
  {
    id: 'live-se-01',
    title: 'PM-AJAY Home-Based Garment Tailoring Enterprise',
    category: 'Self-employment',
    sector: 'Apparel & Garmenting',
    location: 'District Level / Rural & Urban',
    requiredSkills: ['Pattern Making', 'Garment Construction', 'Sewing Machine Operation', 'Fabric Cutting', 'Boutique Management', 'Stitching', 'Tailoring'],
    incomeRange: '₹14,000 – ₹28,000 / month',
    giaSupport: 'Full GIA Grant for Motorized Sewing Machine + Cutting Table + Initial Fabric Raw Material Toolkit (up to ₹50,000 subsidy)',
    financialAssistance: '100% GIA Subsidy for SC Beneficiaries under PM-AJAY component',
    description: 'Establish a custom stitching enterprise from home or rented micro-shop. High demand for school uniforms, festive wear, and ladies apparel.',
    isVerifiedGovernmentData: true
  },
  {
    id: 'live-se-02',
    title: 'Suryamitra Rooftop Solar Installation & Service Agency',
    category: 'Self-employment',
    sector: 'Renewable Energy & Power',
    location: 'District & Block Centers',
    requiredSkills: ['Solar Panel Mounting', 'Inverter Wiring', 'Electrical Testing', 'House Wiring', 'PV Panel Mounting', 'Electrical Safety'],
    incomeRange: '₹18,000 – ₹38,000 / month',
    giaSupport: 'PM-AJAY GIA Toolset Grant: Safety Harness, Digital Multimeter, Solar Crimping Tools & Battery Tester (up to ₹45,000 subsidy)',
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
    requiredSkills: ['SMD Soldering', 'PCB Diagnostics', 'Digital Payments & UPI', 'Office Software', 'Display Replacement', 'Mobile Repair'],
    incomeRange: '₹15,000 – ₹32,000 / month',
    giaSupport: 'GIA Equipment Grant for SMD Rework Station, Microscope, Soldering Kit & Thermal Printer (₹40,000 toolkit)',
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
    requiredSkills: ['Shed Management', 'Poultry Feeding', 'Vaccination Basics', 'Backyard Poultry Housing', 'Farming', 'Livestock'],
    incomeRange: '₹14,000 – ₹24,000 / month',
    giaSupport: 'PM-AJAY GIA Grant for 100 Country Chicks + Feed Supply + Shed Construction Subsidy (₹50,000 grant)',
    financialAssistance: '100% Grant under PM-AJAY GIA SC Beneficiary Livelihood Scheme',
    description: 'Set up a high-margin organic free-range poultry unit producing country eggs and meat with zero ongoing feed stress.',
    isVerifiedGovernmentData: true
  },
  {
    id: 'live-se-05',
    title: 'Home Beauty Parlour & Doorstep Bridal Grooming Unit',
    category: 'Self-employment',
    sector: 'Beauty & Wellness',
    location: 'Urban & Semi-Urban Colonies',
    requiredSkills: ['Facial Treatments', 'Bridal Makeup', 'Threading & Waxing', 'Hair Styling', 'Skincare', 'Beauty Treatments'],
    incomeRange: '₹16,000 – ₹35,000 / month',
    giaSupport: 'GIA Beauty Kit Grant: Professional Facial Steamer, Hair Dryer, Makeup Trolley & Consumables (₹35,000 grant)',
    financialAssistance: 'PM-AJAY GIA Grant + Mudra Shishu Loan Linkage',
    description: 'Provide salon and bridal grooming services at home or via mobile doorstep bookings for events and weddings.',
    isVerifiedGovernmentData: true
  },
  {
    id: 'live-se-06',
    title: 'Independent Electrician & Appliance Repair Enterprise',
    category: 'Self-employment',
    sector: 'Power & Electrical Services',
    location: 'Towns & Rural Mandals',
    requiredSkills: ['House Wiring', 'Switchboard Assembly', 'Earthing', 'Appliance Diagnostics', 'Electrical Safety', 'Motor Rewinding'],
    incomeRange: '₹16,000 – ₹30,000 / month',
    giaSupport: 'GIA Electrical Toolkit Grant: Heavy-Duty Drilling Machine, Insulation Tester, Pipe Bender, Safety Gear (₹30,000 grant)',
    financialAssistance: '100% PM-AJAY GIA Equipment Grant',
    description: 'Provide residential wiring, ceiling fan / motor servicing, and agricultural pump repair services for surrounding villages.',
    isVerifiedGovernmentData: true
  },
  {
    id: 'live-se-07',
    title: 'Two-Wheeler Quick-Service & Puncture Workshop',
    category: 'Self-employment',
    sector: 'Automotive & Mechanical',
    location: 'Highway Junction / Market Yard',
    requiredSkills: ['Engine Overhauling', 'Brake Servicing', 'Tyre Fitting', 'Vehicle Repair', 'Oil Replacement', 'Electrical Diagnostics'],
    incomeRange: '₹18,000 – ₹36,000 / month',
    giaSupport: 'GIA Mechanical Toolkit: Air Compressor, Pneumatic Wrench Kit, Hydraulic Jack & Tool Chest (₹50,000 grant)',
    financialAssistance: 'PM-AJAY GIA Scheme + Mudra Loan Support',
    description: 'Operate an independent bike and scooter repair garage serving daily commuters and farmers.',
    isVerifiedGovernmentData: true
  },
  {
    id: 'live-se-08',
    title: 'Independent Sanitary & Plumbing Service Contractor',
    category: 'Self-employment',
    sector: 'Plumbing & Water Sanitation',
    location: 'District Level / Jal Jeevan Mission Clusters',
    requiredSkills: ['PVC/GI Pipe Jointing', 'Sanitary Fixture Installation', 'Drainage Laying', 'Plumbing', 'Leak Repair'],
    incomeRange: '₹16,000 – ₹32,000 / month',
    giaSupport: 'GIA Plumbing Toolset: Pipe Threader, Fusion Machine, Heavy Wrenches & Safety Boots (₹30,000 grant)',
    financialAssistance: 'PM-AJAY GIA Grant + Jal Jeevan Mission Contractor Enrolment',
    description: 'Undertake household and community plumbing installation, pipeline maintenance, and water tank connections.',
    isVerifiedGovernmentData: true
  },

  // 2. EMPLOYMENT & SALARIED JOBS
  {
    id: 'live-job-01',
    title: 'General Duty Assistant (GDA) - Hospital / Clinic Staff',
    category: 'Job',
    sector: 'Healthcare & Nursing Support',
    location: 'District Headquarter Hospitals & Nursing Homes',
    requiredSkills: ['Patient Care', 'Vital Signs Monitoring', 'Infection Control', 'First Aid', 'Hygiene Care'],
    incomeRange: '₹15,000 – ₹24,000 / month + ESI / PF',
    giaSupport: 'Free PM-AJAY NSQF Level 4 GDA Training + Placement Assistance',
    financialAssistance: 'Stipend during training period + uniform grant',
    description: 'Immediate appointment as bedside healthcare assistant in super-specialty hospitals and regional medical centers.',
    isVerifiedGovernmentData: true
  },
  {
    id: 'live-job-02',
    title: 'Domestic Data Entry Operator (DEO) & Office Assistant',
    category: 'Job',
    sector: 'IT-ITeS & Digital',
    location: 'District Collectorate / CSC / Private IT Parks',
    requiredSkills: ['Alphanumeric Data Typing', 'MS Office & Excel', 'Document Digitization', 'Computer Basics', 'Data Entry'],
    incomeRange: '₹14,000 – ₹22,000 / month',
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
    requiredSkills: ['Lockstitch Machine Operation', 'Garment Assembly Line', 'Sewing', 'Stitching', 'Quality Check'],
    incomeRange: '₹14,000 – ₹20,000 / month + Subsidized Hostel',
    giaSupport: 'Free NSQF Skilling + On-the-Job Training (OJT)',
    financialAssistance: 'Post-Placement Transport & Housing Allowance under PM-AJAY',
    description: 'Employment in major garment export manufacturers with structured career advancement to line supervisor.',
    isVerifiedGovernmentData: true
  },
  {
    id: 'live-job-04',
    title: 'Solar Power Plant Operations & Maintenance Assistant',
    category: 'Job',
    sector: 'Renewable Energy & Power',
    location: 'State Solar Parks / Commercial Sites',
    requiredSkills: ['PV Panel Mounting', 'Electrical Safety', 'System Testing', 'Inverter Wiring', 'Solar Maintenance'],
    incomeRange: '₹16,000 – ₹26,000 / month',
    giaSupport: 'Suryamitra Certified Course Placement Drive',
    financialAssistance: 'Insurance Cover + Safety Equipment Kit',
    description: 'Technical field role maintaining solar array strings, inverters, and transformer connections at utility-scale solar farms.',
    isVerifiedGovernmentData: true
  },
  {
    id: 'live-job-05',
    title: 'Retail Store Sales Associate & Billing Executive',
    category: 'Job',
    sector: 'Retail & Commercial Services',
    location: 'Shopping Malls, Supermarkets & Brand Showrooms',
    requiredSkills: ['Customer Service', 'POS Billing', 'Product Merchandising', 'Communication', 'Inventory Handling'],
    incomeRange: '₹14,000 – ₹22,000 / month + Sales Incentives',
    giaSupport: 'NSQF Retail Skill Training + Direct Campus Placement',
    financialAssistance: 'Skill India Certificate + Placement Allowance',
    description: 'Customer facing retail role managing point-of-sale checkout, customer inquiries, and stock display.',
    isVerifiedGovernmentData: true
  },

  // 3. ENTREPRENEURSHIP & FPO COLLECTIVES
  {
    id: 'live-ent-01',
    title: 'SC Farmer Producers Organisation (FPO) - Bio-Fertilizer Collective',
    category: 'Entrepreneurship',
    sector: 'Agriculture & Livestock',
    location: 'Block Level Agro Cluster',
    requiredSkills: ['Vermi-composting', 'Organic Certification', 'Direct Farmer Marketing', 'Farming', 'Bio-Input Production'],
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
    sector: 'Automotive & Mechanical',
    location: 'Highway / Town Junction',
    requiredSkills: ['Engine Diagnostics', 'EV Battery Servicing', 'Workshop Management', 'Vehicle Repair'],
    incomeRange: '₹30,000 – ₹60,000 / month',
    giaSupport: 'PM-AJAY Infrastructure Subsidy for Hydraulic Lift & Diagnostic Computer (up to ₹2.5 Lakhs)',
    financialAssistance: 'Stand-Up India / Mudra Tarun Loan Linkage',
    description: 'Set up a high-volume garage facility offering regular servicing, spare parts sales, and EV battery swapping.',
    isVerifiedGovernmentData: true
  }
];

