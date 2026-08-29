import { NextResponse } from 'next/server';
import { db, isDatabaseConfigured } from '@/db';
import { buyerAddresses } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { BuyerAddress } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'usr-default';

    if (isDatabaseConfigured()) {
      const rows = await db.select().from(buyerAddresses).where(eq(buyerAddresses.userId, userId));
      const addresses: BuyerAddress[] = rows.map((a) => ({
        id: a.id,
        userId: a.userId,
        label: a.label,
        contactName: a.contactName,
        phone: a.phone,
        addressLine: a.addressLine,
        landmark: a.landmark || undefined,
        city: a.city,
        state: a.state,
        pincode: a.pincode,
        isDefault: Boolean(a.isDefault),
        transportPreference: a.transportPreference,
        createdAt: a.createdAt || new Date().toISOString(),
      }));

      return NextResponse.json({ success: true, addresses, source: 'turso_db' });
    }

    return NextResponse.json({ success: true, addresses: [], source: 'fallback' });
  } catch (error: any) {
    console.error('Error getting addresses:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId = 'usr-default',
      label,
      contactName,
      phone,
      addressLine,
      landmark,
      city,
      state,
      pincode,
      isDefault = false,
      transportPreference = 'V-Trans / TCI Freight',
    } = body;

    const id = `addr-${Date.now().toString().slice(-6)}`;

    if (isDatabaseConfigured()) {
      if (isDefault) {
        // Unset other defaults for this user
        await db.update(buyerAddresses).set({ isDefault: false }).where(eq(buyerAddresses.userId, userId));
      }

      await db.insert(buyerAddresses).values({
        id,
        userId,
        label: label || 'Address',
        contactName: contactName || 'Consignee',
        phone: phone || '+91 98112 34567',
        addressLine: addressLine || '',
        landmark: landmark || null,
        city: city || 'New Delhi',
        state: state || 'Delhi NCR',
        pincode: pincode || '110001',
        isDefault: Boolean(isDefault),
        transportPreference: transportPreference || 'V-Trans / TCI Freight',
        createdAt: new Date().toISOString(),
      });
    }

    const newAddress: BuyerAddress = {
      id,
      userId,
      label: label || 'Address',
      contactName: contactName || 'Consignee',
      phone: phone || '+91 98112 34567',
      addressLine: addressLine || '',
      landmark,
      city: city || 'New Delhi',
      state: state || 'Delhi NCR',
      pincode: pincode || '110001',
      isDefault: Boolean(isDefault),
      transportPreference: transportPreference || 'V-Trans / TCI Freight',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, address: newAddress });
  } catch (error: any) {
    console.error('Error adding address:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      userId,
      label,
      contactName,
      phone,
      addressLine,
      landmark,
      city,
      state,
      pincode,
      isDefault,
      transportPreference,
    } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Address ID required' }, { status: 400 });
    }

    if (isDatabaseConfigured()) {
      if (isDefault && userId) {
        await db.update(buyerAddresses).set({ isDefault: false }).where(eq(buyerAddresses.userId, userId));
      }

      await db.update(buyerAddresses).set({
        label,
        contactName,
        phone,
        addressLine,
        landmark: landmark || null,
        city,
        state,
        pincode,
        isDefault: Boolean(isDefault),
        transportPreference,
      }).where(eq(buyerAddresses.id, id));
    }

    return NextResponse.json({ success: true, message: 'Address updated' });
  } catch (error: any) {
    console.error('Error updating address:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Address ID required' }, { status: 400 });
    }

    if (isDatabaseConfigured()) {
      await db.delete(buyerAddresses).where(eq(buyerAddresses.id, id));
    }

    return NextResponse.json({ success: true, message: 'Address deleted' });
  } catch (error: any) {
    console.error('Error deleting address:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
