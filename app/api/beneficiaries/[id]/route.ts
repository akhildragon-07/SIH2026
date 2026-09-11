import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { BeneficiaryProfile } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'backend', 'data');
const DATA_FILE = path.join(DATA_DIR, 'registered_beneficiaries.json');

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ error: 'Beneficiary not found' }, { status: 404 });
    }

    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    const beneficiaries: BeneficiaryProfile[] = JSON.parse(data);

    const found = beneficiaries.find(
      (b) => b.beneficiaryId?.toLowerCase() === id.toLowerCase() || b.id?.toLowerCase() === id.toLowerCase()
    );

    if (!found) {
      return NextResponse.json({ error: 'Beneficiary not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: found });
  } catch (err: any) {
    return NextResponse.json({ error: 'Error fetching beneficiary', details: err.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ error: 'Database file not found' }, { status: 404 });
    }

    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    let beneficiaries: BeneficiaryProfile[] = JSON.parse(data);

    const index = beneficiaries.findIndex(
      (b) => b.beneficiaryId?.toLowerCase() === id.toLowerCase() || b.id?.toLowerCase() === id.toLowerCase()
    );

    if (index === -1) {
      return NextResponse.json({ error: 'Beneficiary not found' }, { status: 404 });
    }

    beneficiaries[index] = {
      ...beneficiaries[index],
      ...body,
      updatedAt: new Date().toISOString(),
      isBackendSynced: true
    };

    fs.writeFileSync(DATA_FILE, JSON.stringify(beneficiaries, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Beneficiary profile updated in backend',
      data: beneficiaries[index]
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Error updating beneficiary', details: err.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({ error: 'Database file not found' }, { status: 404 });
    }

    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    let beneficiaries: BeneficiaryProfile[] = JSON.parse(data);

    const initialLength = beneficiaries.length;
    beneficiaries = beneficiaries.filter(
      (b) => b.beneficiaryId?.toLowerCase() !== id.toLowerCase() && b.id?.toLowerCase() !== id.toLowerCase() && b.userId?.toLowerCase() !== id.toLowerCase()
    );

    if (beneficiaries.length === initialLength) {
      return NextResponse.json({ error: 'Beneficiary not found' }, { status: 404 });
    }

    fs.writeFileSync(DATA_FILE, JSON.stringify(beneficiaries, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      message: 'Beneficiary profile successfully removed from backend'
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Error deleting beneficiary', details: err.message }, { status: 500 });
  }
}

