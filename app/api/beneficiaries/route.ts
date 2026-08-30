import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { BeneficiaryProfile } from '@/lib/types';
import { DEMO_BENEFICIARIES } from '@/lib/demo-data';

const DATA_DIR = path.join(process.cwd(), 'backend', 'data');
const DATA_FILE = path.join(DATA_DIR, 'registered_beneficiaries.json');

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initialList: BeneficiaryProfile[] = DEMO_BENEFICIARIES.map((d, index) => ({
      ...d.profile,
      beneficiaryId: `SC-AJAY-2026-100${index + 1}`,
      userId: `user-00${index + 1}`,
      phone: `987654321${index}`,
      email: `${d.profile.name.toLowerCase().replace(/\s+/g, '')}@pmajay.gov.in`,
      category: 'Scheduled Caste (SC)',
      isBackendSynced: true,
      createdAt: new Date().toISOString(),
      giaEligibilityStatus: 'Eligible for 100% GIA Toolkit Grant'
    }));
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialList, null, 2), 'utf-8');
  }
}

export async function GET(request: Request) {
  try {
    ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const beneficiaries: BeneficiaryProfile[] = JSON.parse(data);

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase();

    if (query) {
      const filtered = beneficiaries.filter((b) =>
        b.name.toLowerCase().includes(query) ||
        b.beneficiaryId?.toLowerCase().includes(query) ||
        b.district?.toLowerCase().includes(query) ||
        b.existingSkills?.some((s) => s.toLowerCase().includes(query))
      );
      return NextResponse.json({ success: true, count: filtered.length, data: filtered });
    }

    return NextResponse.json({ success: true, count: beneficiaries.length, data: beneficiaries });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to read beneficiary database', details: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    ensureDataFile();
    const body = await request.json();

    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const beneficiaries: BeneficiaryProfile[] = JSON.parse(data);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const assignedId = body.beneficiaryId || `SC-AJAY-2026-${randomSuffix}`;
    const assignedUserId = body.userId || `user-${randomSuffix}`;

    const newBeneficiary: BeneficiaryProfile = {
      ...body,
      id: assignedId,
      beneficiaryId: assignedId,
      userId: assignedUserId,
      category: body.category || 'Scheduled Caste (SC)',
      giaEligibilityStatus: 'Eligible for 100% GIA Toolkit Grant',
      isBackendSynced: true,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const existingIndex = beneficiaries.findIndex(
      (b) => b.beneficiaryId === assignedId || (b.phone && body.phone && b.phone === body.phone)
    );

    if (existingIndex >= 0) {
      beneficiaries[existingIndex] = {
        ...beneficiaries[existingIndex],
        ...newBeneficiary
      };
    } else {
      beneficiaries.unshift(newBeneficiary);
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(beneficiaries, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Beneficiary account successfully created and saved in PM-AJAY National Backend',
      beneficiaryId: assignedId,
      data: newBeneficiary
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to save beneficiary account', details: err.message }, { status: 500 });
  }
}

