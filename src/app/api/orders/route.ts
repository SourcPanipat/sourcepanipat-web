import { NextRequest, NextResponse } from 'next/server';
import { EscrowOrderRequest, EscrowOrderResponse } from '@/types';
import { getBaleBySlug, MOCK_BALES } from '@/lib/mock-catalog';

export async function POST(request: NextRequest) {
  try {
    const body: EscrowOrderRequest = await request.json();

    const bale = MOCK_BALES.find((b) => b.id === body.baleId) || MOCK_BALES[0];

    const isSealed = body.buyMode === 'sealed_bale';
    const quantityBales = body.quantityBales || 1;
    const curatedPieces = body.curatedPieceCount || bale.curatedMoq;

    const subtotal = isSealed
      ? bale.sealedBalePrice * quantityBales
      : bale.curatedPiecePrice * curatedPieces;

    const inspectionShieldFee = body.includeInspectionShield ? 1000 : 0;
    const platformFee = 0;
    const totalPayable = subtotal + inspectionShieldFee + platformFee;

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `SP-ORD-${new Date().getFullYear()}-${randomSuffix}`;
    const orderId = `ord_${Date.now()}`;

    const orderResponse: EscrowOrderResponse = {
      orderId,
      orderNumber,
      subtotal,
      platformFee,
      inspectionShieldFee,
      totalPayable,
      escrowStatus: 'ESCROW_HELD',
      estimatedDispatch: '24-48 Hours from Panipat Hub',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Escrow payment recorded in Nodal account',
      order: orderResponse,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to process escrow order' },
      { status: 500 }
    );
  }
}
