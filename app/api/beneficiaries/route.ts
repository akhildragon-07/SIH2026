import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { BeneficiaryProfile } from '@/lib/types';
import { DEMO_BENEFICIARIES } from '@/lib/demo-data';

const DATA_DIR = path.join(process.cwd(), 'backend', 'data');
const DATA_FILE = path.join(DATA_DIR, 'registered_beneficiaries.json');

function hashPassword(dob: string): string {
  // Normalize DOB string (e.g. "15/08/1998" -> "15081998")
  const cleanDob = (dob || '01/01/2000').replace(/[\/\-\.\s]/g, '');
  return crypto.createHash('sha256').update(cleanDob).digest('hex');
}

function generateUniqueUserId(name: string, existingList: BeneficiaryProfile[]): string {
  const baseId = (name || 'beneficiary').toLowerCase().trim().replace(/\s+/g, ' ');
  let candidate = baseId;
  let counter = 2;

  const existingIds = new Set(existingList.map((b) => b.userId?.toLowerCase()));
  while (existingIds.has(candidate)) {
    candidate = `${baseId}${counter}`;
    counter++;
  }

  return candidate;
}

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    const initialList: BeneficiaryProfile[] = DEMO_BENEFICIARIES.map((d, index) => {
      const dob = `15/06/${new Date().getFullYear() - d.profile.age}`;
      const nameBasedUserId = d.profile.name.toLowerCase().trim();
      return {
        ...d.profile,
        beneficiaryId: `SC-AJAY-2026-100${index + 1}`,
        userId: nameBasedUserId,
        dob,
        passwordHash: hashPassword(dob),
        phone: `987654321${index}`,
        email: `${d.profile.name.toLowerCase().replace(/\s+/g, '')}@pmajay.gov.in`,
        category: 'Scheduled Caste (SC)',
        isBackendSynced: true,
        createdAt: new Date().toISOString(),
        giaEligibilityStatus: 'Eligible for 100% GIA Toolkit Grant'
      };
    });
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialList, null, 2), 'utf-8');
  }
}

function sanitizeProfile(prof: BeneficiaryProfile): BeneficiaryProfile {
  const sanitized = { ...prof };
  delete sanitized.passwordHash;
  return sanitized;
}

export async function GET(request: Request) {
  try {
    ensureDataFile();
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const beneficiaries: BeneficiaryProfile[] = JSON.parse(data);

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.toLowerCase();

    if (query) {
      const filtered = beneficiaries
        .filter((b) =>
          b.name.toLowerCase().includes(query) ||
          b.userId?.toLowerCase().includes(query) ||
          b.beneficiaryId?.toLowerCase().includes(query) ||
          b.district?.toLowerCase().includes(query) ||
          b.existingSkills?.some((s) => s.toLowerCase().includes(query))
        )
        .map(sanitizeProfile);
      return NextResponse.json({ success: true, count: filtered.length, data: filtered });
    }

    return NextResponse.json({
      success: true,
      count: beneficiaries.length,
      data: beneficiaries.map(sanitizeProfile)
    });
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

    // If login check mode
    if (body.action === 'login') {
      const targetUserId = (body.userId || body.name || '').toLowerCase().trim();
      const inputDob = (body.dob || body.password || '').trim();
      const inputHash = hashPassword(inputDob);

      const found = beneficiaries.find(
        (b) =>
          (b.userId?.toLowerCase() === targetUserId || b.name.toLowerCase() === targetUserId) &&
          (b.passwordHash === inputHash || !b.passwordHash)
      );

      if (!found) {
        return NextResponse.json({
          success: false,
          error: 'Beneficiary account not found or Date of Birth does not match.'
        }, { status: 401 });
      }

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        data: sanitizeProfile(found)
      });
    }

    // Standard Registration / Update mode
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const assignedId = body.beneficiaryId || `SC-AJAY-2026-${randomSuffix}`;

    // Generate unique name-based lowercase user ID if not provided
    const assignedUserId = body.userId || generateUniqueUserId(body.name || 'beneficiary', beneficiaries);

    // Compute DOB and secure SHA-256 hash
    const assignedDob = body.dob || (body.age ? `15/06/${new Date().getFullYear() - body.age}` : '15/06/1998');
    const pwdHash = hashPassword(assignedDob);

    const newBeneficiary: BeneficiaryProfile = {
      ...body,
      id: assignedId,
      beneficiaryId: assignedId,
      userId: assignedUserId,
      dob: assignedDob,
      passwordHash: pwdHash,
      category: body.category || 'Scheduled Caste (SC)',
      giaEligibilityStatus: 'Eligible for 100% GIA Toolkit Grant',
      isBackendSynced: true,
      createdAt: body.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const existingIndex = beneficiaries.findIndex(
      (b) =>
        b.beneficiaryId === assignedId ||
        (b.userId && b.userId.toLowerCase() === assignedUserId.toLowerCase()) ||
        (b.phone && body.phone && b.phone === body.phone)
    );

    if (existingIndex >= 0) {
      beneficiaries[existingIndex] = {
        ...beneficiaries[existingIndex],
        ...newBeneficiary,
        passwordHash: pwdHash || beneficiaries[existingIndex].passwordHash
      };
    } else {
      beneficiaries.unshift(newBeneficiary);
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(beneficiaries, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Beneficiary account successfully created and saved in PM-AJAY National Backend',
      beneficiaryId: assignedId,
      userId: assignedUserId,
      data: sanitizeProfile(newBeneficiary)
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to save beneficiary account', details: err.message }, { status: 500 });
  }
}
