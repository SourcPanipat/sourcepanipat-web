import { NextResponse } from 'next/server';
import { db, isDatabaseConfigured } from '@/db';
import { users, buyerAddresses } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { BuyerUser, BuyerAddress } from '@/types';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'usr-default';

    if (isDatabaseConfigured()) {
      const userRows = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      const addressRows = await db.select().from(buyerAddresses).where(eq(buyerAddresses.userId, userId));

      if (userRows.length > 0) {
        const u = userRows[0];
        const buyerUser: BuyerUser = {
          id: u.id,
          email: u.email || '',
          phone: u.phone,
          contactName: u.fullName,
          businessName: u.businessName,
          gstin: u.gstin || undefined,
          city: u.city,
          state: u.state,
          addresses: addressRows.map((a) => ({
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
          })),
        };
        return NextResponse.json({ success: true, user: buyerUser, source: 'turso_db' });
      }
    }

    // Default sample buyer response
    const defaultAddresses: BuyerAddress[] = [
      {
        id: 'addr-001',
        userId,
        label: 'Address 1 (Main Storefront)',
        contactName: 'Rahul Sharma',
        phone: '+91 98112 34567',
        addressLine: 'Shop 14, Hauz Khas Village Market',
        landmark: 'Near Deer Park Gate',
        city: 'New Delhi',
        state: 'Delhi NCR',
        pincode: '110016',
        isDefault: true,
        transportPreference: 'V-Trans Panipat Hub (Daily Delhi Transit)',
        createdAt: new Date().toISOString(),
      },
      {
        id: 'addr-002',
        userId,
        label: 'Address 2 (Central Sorting Godown)',
        contactName: 'Rahul Sharma',
        phone: '+91 98112 34567',
        addressLine: 'Shed B-42, Okhla Industrial Area Phase-III',
        landmark: 'Opposite Container Yard',
        city: 'New Delhi',
        state: 'Delhi NCR',
        pincode: '110020',
        isDefault: false,
        transportPreference: 'TCI Freight Panipat Godown Hub',
        createdAt: new Date().toISOString(),
      },
    ];

    const fallbackUser: BuyerUser = {
      id: userId,
      email: 'rahul@urbanthrift.in',
      phone: '+91 98112 34567',
      contactName: 'Rahul Sharma',
      businessName: 'Urban Vintage Thrift Studio',
      gstin: '07AAAAA0000A1Z5',
      city: 'New Delhi',
      state: 'Delhi NCR',
      addresses: defaultAddresses,
    };

    return NextResponse.json({ success: true, user: fallbackUser, source: 'fallback_memory' });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, email, phone, contactName, businessName, gstin, city, state } = body;

    const userId = id || `usr-${Date.now().toString().slice(-6)}`;

    if (isDatabaseConfigured()) {
      const existing = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (existing.length > 0) {
        await db.update(users).set({
          fullName: contactName || existing[0].fullName,
          businessName: businessName || existing[0].businessName,
          phone: phone || existing[0].phone,
          email: email || existing[0].email,
          gstin: gstin || existing[0].gstin,
          city: city || existing[0].city,
          state: state || existing[0].state,
        }).where(eq(users.id, userId));
      } else {
        await db.insert(users).values({
          id: userId,
          fullName: contactName || 'B2B Buyer',
          businessName: businessName || 'Panipat Wholesale Consignee',
          phone: phone || '+91 98112 34567',
          email: email || 'buyer@sourcepanipat.com',
          gstin: gstin || null,
          city: city || 'New Delhi',
          state: state || 'Delhi NCR',
          address: `${city || 'New Delhi'}, ${state || 'Delhi NCR'}`,
          isGstinVerified: Boolean(gstin),
          createdAt: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        id: userId,
        email,
        phone,
        contactName,
        businessName,
        gstin,
        city,
        state,
      },
    });
  } catch (error: any) {
    console.error('Error saving profile:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
