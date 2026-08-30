import { turso } from './turso';
import { SellerProfile, BaleListingItem, BaleListing, EscrowOrderRecord, SellerOrderDispatch } from '@/types';

// Helper: Map Turso row to SellerProfile
export function mapDbSellerToProfile(row: any): SellerProfile {
  let primaryTypes: string[] = [];
  try {
    if (typeof row.primary_inventory_types === 'string') {
      primaryTypes = JSON.parse(row.primary_inventory_types);
    } else if (Array.isArray(row.primary_inventory_types)) {
      primaryTypes = row.primary_inventory_types;
    }
  } catch (e) {}

  return {
    id: row.id,
    maskedCode: row.masked_code || '#PNP-PENDING',
    fullName: row.full_name || '',
    slug: row.slug || `${(row.full_name || 'trader').toLowerCase().replace(/\s+/g, '-')}-${(row.masked_code || row.id || '').replace('#', '').toLowerCase()}`,
    phone: row.phone || '',
    email: row.email || '',
    businessName: row.business_name || '',
    godownZone: row.godown_zone || 'Sanoli Road Godown Hub',
    yardAddress: row.yard_address || '',
    primaryInventoryTypes: primaryTypes,
    logoUrl: row.logo_url || null,
    gstin: row.gstin || null,
    isGstinRegistered: Boolean(row.is_gstin_registered),
    bankAccountNumber: row.bank_account_number || '',
    bankIfscCode: row.bank_ifsc_code || '',
    accountHolderName: row.account_holder_name || '',
    bankName: row.bank_name || '',
    gstDocUrl: row.gst_doc_url || null,
    yardPhotoUrl: row.yard_photo_url || null,
    verificationStatus: row.verification_status || 'pending_approval',
    accountStatus: row.account_status || 'active',
    rejectionReason: row.rejection_reason || null,
    approvedAt: row.approved_at || null,
    rating: row.rating ?? 5.0,
    trustScore: row.trust_score ?? 100.0,
    totalOrders: row.total_orders ?? 0,
    fulfilledOrders: row.fulfilled_orders ?? 0,
    cancelledOrders: row.cancelled_orders ?? 0,
    totalDispatchedBales: row.total_dispatched_bales ?? 0,
    repeatBuyerRate: row.repeat_buyer_rate ?? 100,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

// Helper: Map Turso row to BaleListingItem
export function mapDbListingToItem(row: any): BaleListingItem {
  let gallery: string[] = [];
  let videos: string[] = [];
  let photos: string[] = [];

  try {
    if (typeof row.gallery_images === 'string') gallery = JSON.parse(row.gallery_images);
    else if (Array.isArray(row.gallery_images)) gallery = row.gallery_images;
  } catch (e) {}

  try {
    if (typeof row.videos === 'string') videos = JSON.parse(row.videos);
    else if (Array.isArray(row.videos)) videos = row.videos;
  } catch (e) {}

  try {
    if (typeof row.photos === 'string') photos = JSON.parse(row.photos);
    else if (Array.isArray(row.photos)) photos = row.photos;
  } catch (e) {}

  return {
    id: row.id,
    slug: row.slug,
    sellerId: row.seller_id,
    categoryId: row.category_id || 'winter-jackets-outerwear',
    subCategoryId: row.sub_category_id || 'heavy-puffers',
    categoryLabel: row.category_label || 'Wholesale Textiles',
    title: row.title,
    shortDescription: row.short_description || '',
    sourcingMode: row.sourcing_mode || 'both',
    originCountry: row.origin_country || 'South Korea',
    originFlag: row.origin_flag || 'KR',
    thumbnailUrl: row.thumbnail_url || 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
    galleryImages: gallery,
    weightKg: row.weight_kg ?? 80,
    estimatedPieceCount: row.estimated_piece_count ?? 70,
    sealedBalePrice: row.sealed_bale_price ?? 30000,
    curatedPiecePrice: row.curated_piece_price ?? 450,
    curatedMoq: row.curated_moq ?? 25,
    gradeA: row.grade_a ?? 85,
    gradeB: row.grade_b ?? 12,
    gradeC: row.grade_c ?? 3,
    videos: videos.map((url, idx) => ({
      id: `vid-${idx}`,
      type: (idx === 0 ? 'opening_inspection' : 'godown_walkthrough') as 'opening_inspection' | 'godown_walkthrough',
      grade: 'Grade A' as const,
      videoUrl: url,
      durationSeconds: 30,
      label: idx === 0 ? 'Bale Wire-Cut Inspection' : 'Core Stack Quality Check',
      description: 'Verified 30s uncut Panipat godown opening preview',
      conditionNotes: ['Grade A Verified', 'Intact Bale Seal'],
    })),
    photos: photos,
    godownBatchId: row.godown_batch_id || 'BATCH-SANOLI-2026',
    qcVerified: Boolean(row.qc_verified),
    inStockCount: row.in_stock_count ?? 1,
    fabricComposition: row.fabric_composition || 'Premium Graded Fabric',
    expectedGrossMargin: row.expected_gross_margin || '3.5x - 5.0x Margin',
    status: row.status || 'pending_approval',
    pendingEditJson: typeof row.pending_edit_json === 'string' ? row.pending_edit_json : JSON.stringify(row.pending_edit_json || null),
    rejectionReason: row.rejection_reason || null,
    createdAt: row.created_at || new Date().toISOString(),
  };
}



// Helper: Map Turso listing + seller row to marketplace BaleListing
export function mapDbListingToMarketplaceBale(row: any, sellerRow?: any): BaleListing {
  const item = mapDbListingToItem(row);
  const seller = sellerRow ? mapDbSellerToProfile(sellerRow) : null;

  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    shortDescription: item.shortDescription,
    category: item.categoryId,
    categoryId: item.categoryId,
    subCategoryId: item.subCategoryId,
    categoryLabel: item.categoryLabel,
    originCountry: item.originCountry,
    originFlag: item.originFlag,
    thumbnailUrl: item.thumbnailUrl,
    galleryImages: (item.photos && item.photos.length > 0) ? item.photos : item.galleryImages,
    status: item.status,
    sourcingMode: item.sourcingMode,
    weightKg: item.weightKg,
    estimatedPieceCount: item.estimatedPieceCount,
    sealedBalePrice: item.sealedBalePrice,
    curatedPiecePrice: item.curatedPiecePrice,
    curatedMoq: item.curatedMoq,
    gradeBreakdown: {
      gradeA: item.gradeA,
      gradeB: item.gradeB,
      gradeC: item.gradeC,
    },
    videoClips: item.videos,
    godownBatchId: item.godownBatchId,

    qcVerified: item.qcVerified,
    inStockCount: item.inStockCount,
    fabricComposition: item.fabricComposition,
    expectedGrossMargin: item.expectedGrossMargin,
    recommendedResaleChannel: 'Instagram & Offline Boutiques',
    seller: {
      id: seller?.id || item.sellerId,
      fullName: seller?.fullName || 'Verified Panipat Trader',
      maskedCode: seller?.maskedCode || '#PNP-001',
      supplierTier: 'Gold Vetted Importer',
      godownZone: (seller?.godownZone as any) || 'Sanoli Road Godown Hub',
      rating: seller?.rating ?? 5.0,
      trustScore: seller?.trustScore ?? 100.0,
      totalDispatchedBales: seller?.totalDispatchedBales ?? 100,
      repeatBuyerRate: seller?.repeatBuyerRate ?? 100,
      isVerified: seller?.verificationStatus === 'approved',
      memberSince: '2026',
    },

    viewCount: 150,
    inquiryCount: 20,
    tags: ['Korean Import', 'Winter Stock', 'Grade A'],
    createdAt: item.createdAt,
  };
}

// -------------------------------------------------------------
// SELLER PROFILE OPERATIONS (TURSO LIB-SQL EDGE DB)
// -------------------------------------------------------------

export async function registerSellerInDb(seller: SellerProfile & { password?: string }) {
  const primaryTypesJson = JSON.stringify(seller.primaryInventoryTypes || []);
  const maskedCode = seller.maskedCode || null;

  await turso.execute({
    sql: `
      INSERT INTO sellers (
        id, masked_code, full_name, slug, phone, email, password_hash, business_name,
        godown_zone, yard_address, primary_inventory_types, logo_url, gstin, is_gstin_registered,
        bank_account_number, bank_ifsc_code, account_holder_name, bank_name, gst_doc_url,
        yard_photo_url, verification_status, account_status, rating, trust_score, created_at
      ) VALUES (
        :id, :masked_code, :full_name, :slug, :phone, :email, :password_hash, :business_name,
        :godown_zone, :yard_address, :primary_inventory_types, :logo_url, :gstin, :is_gstin_registered,
        :bank_account_number, :bank_ifsc_code, :account_holder_name, :bank_name, :gst_doc_url,
        :yard_photo_url, 'pending_approval', 'active', 5.0, 100.0, :created_at
      )
      ON CONFLICT(id) DO UPDATE SET
        full_name = excluded.full_name,
        business_name = excluded.business_name,
        phone = excluded.phone,
        email = excluded.email;
    `,
    args: {
      id: seller.id,
      masked_code: maskedCode,
      full_name: seller.fullName,
      slug: seller.slug || `${seller.fullName.toLowerCase().replace(/\s+/g, '-')}-${seller.id.slice(-4)}`,
      phone: seller.phone,
      email: seller.email.toLowerCase(),
      password_hash: seller.password || null,
      business_name: seller.businessName,
      godown_zone: seller.godownZone,
      yard_address: seller.yardAddress,
      primary_inventory_types: primaryTypesJson,
      logo_url: seller.logoUrl || null,
      gstin: seller.gstin || null,
      is_gstin_registered: seller.isGstinRegistered ? 1 : 0,
      bank_account_number: seller.bankAccountNumber || '',
      bank_ifsc_code: seller.bankIfscCode || '',
      account_holder_name: seller.accountHolderName || '',
      bank_name: seller.bankName || '',
      gst_doc_url: seller.gstDocUrl || null,
      yard_photo_url: seller.yardPhotoUrl || null,
      created_at: new Date().toISOString(),
    },
  });

  return seller;
}

export async function getSellerByEmailFromDb(email: string): Promise<(SellerProfile & { password?: string }) | null> {
  const res = await turso.execute({
    sql: 'SELECT * FROM sellers WHERE LOWER(email) = LOWER(:email) LIMIT 1;',
    args: { email: email.trim() },
  });

  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  const profile = mapDbSellerToProfile(row);
  return {
    ...profile,
    password: (row.password_hash as string) || undefined,
  };
}

export async function getSellerByIdFromDb(id: string): Promise<SellerProfile | null> {
  const res = await turso.execute({
    sql: 'SELECT * FROM sellers WHERE id = :id LIMIT 1;',
    args: { id },
  });

  if (res.rows.length === 0) return null;
  return mapDbSellerToProfile(res.rows[0]);
}

export async function updateSellerProfileInDb(sellerId: string, updates: Partial<SellerProfile>) {
  const fields: string[] = [];
  const args: any = { id: sellerId };

  if (updates.fullName !== undefined) { fields.push('full_name = :full_name'); args.full_name = updates.fullName; }
  if (updates.businessName !== undefined) { fields.push('business_name = :business_name'); args.business_name = updates.businessName; }
  if (updates.phone !== undefined) { fields.push('phone = :phone'); args.phone = updates.phone; }
  if (updates.yardAddress !== undefined) { fields.push('yard_address = :yard_address'); args.yard_address = updates.yardAddress; }
  if (updates.logoUrl !== undefined) { fields.push('logo_url = :logo_url'); args.logo_url = updates.logoUrl; }
  if (updates.gstin !== undefined) { fields.push('gstin = :gstin'); args.gstin = updates.gstin; }
  if (updates.bankAccountNumber !== undefined) { fields.push('bank_account_number = :bank_account_number'); args.bank_account_number = updates.bankAccountNumber; }
  if (updates.bankIfscCode !== undefined) { fields.push('bank_ifsc_code = :bank_ifsc_code'); args.bank_ifsc_code = updates.bankIfscCode; }
  if (updates.accountHolderName !== undefined) { fields.push('account_holder_name = :account_holder_name'); args.account_holder_name = updates.accountHolderName; }
  if (updates.bankName !== undefined) { fields.push('bank_name = :bank_name'); args.bank_name = updates.bankName; }

  if (fields.length > 0) {
    await turso.execute({
      sql: `UPDATE sellers SET ${fields.join(', ')} WHERE id = :id;`,
      args,
    });
  }

  return await getSellerByIdFromDb(sellerId);
}

// -------------------------------------------------------------
// LISTINGS OPERATIONS (TURSO LIB-SQL EDGE DB)
// -------------------------------------------------------------

export async function getSellerListingsFromDb(sellerId: string): Promise<BaleListingItem[]> {
  const res = await turso.execute({
    sql: 'SELECT * FROM listings WHERE seller_id = :seller_id ORDER BY created_at DESC;',
    args: { seller_id: sellerId },
  });

  return res.rows.map(mapDbListingToItem);
}

export async function createListingInDb(item: BaleListingItem): Promise<BaleListingItem> {
  await turso.execute({
    sql: `
      INSERT INTO listings (
        id, slug, seller_id, category_id, sub_category_id, category_label, title,
        short_description, sourcing_mode, origin_country, origin_flag, thumbnail_url,
        gallery_images, weight_kg, estimated_piece_count, sealed_bale_price,
        curated_piece_price, curated_moq, grade_a, grade_b, grade_c, videos, photos,
        godown_batch_id, qc_verified, in_stock_count, fabric_composition,
        expected_gross_margin, status, pending_edit_json, rejection_reason, created_at, updated_at
      ) VALUES (
        :id, :slug, :seller_id, :category_id, :sub_category_id, :category_label, :title,
        :short_description, :sourcing_mode, :origin_country, :origin_flag, :thumbnail_url,
        :gallery_images, :weight_kg, :estimated_piece_count, :sealed_bale_price,
        :curated_piece_price, :curated_moq, :grade_a, :grade_b, :grade_c, :videos, :photos,
        :godown_batch_id, :qc_verified, :in_stock_count, :fabric_composition,
        :expected_gross_margin, 'pending_approval', NULL, NULL, :created_at, :updated_at
      );
    `,
    args: {
      id: item.id,
      slug: item.slug,
      seller_id: item.sellerId,
      category_id: item.categoryId,
      sub_category_id: item.subCategoryId,
      category_label: item.categoryLabel,
      title: item.title,
      short_description: item.shortDescription,
      sourcing_mode: item.sourcingMode,
      origin_country: item.originCountry,
      origin_flag: item.originFlag,
      thumbnail_url: item.thumbnailUrl,
      gallery_images: JSON.stringify(item.galleryImages || []),
      weight_kg: item.weightKg,
      estimated_piece_count: item.estimatedPieceCount,
      sealed_bale_price: item.sealedBalePrice,
      curated_piece_price: item.curatedPiecePrice,
      curated_moq: item.curatedMoq,
      grade_a: item.gradeA,
      grade_b: item.gradeB,
      grade_c: item.gradeC,
      videos: JSON.stringify(item.videos || []),
      photos: JSON.stringify(item.photos || []),
      godown_batch_id: item.godownBatchId,
      qc_verified: item.qcVerified ? 1 : 0,
      in_stock_count: item.inStockCount,
      fabric_composition: item.fabricComposition,
      expected_gross_margin: item.expectedGrossMargin,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  });

  return item;
}

export async function updateListingInDb(listingId: string, updates: Partial<BaleListingItem>, asPendingApproval = true): Promise<BaleListingItem> {
  const now = new Date().toISOString();

  if (asPendingApproval) {
    await turso.execute({
      sql: `
        UPDATE listings SET
          status = 'pending_approval',
          pending_edit_json = :pending_edit_json,
          updated_at = :updated_at
        WHERE id = :id;
      `,
      args: {
        id: listingId,
        pending_edit_json: JSON.stringify(updates),
        updated_at: now,
      },
    });
  } else {
    const fields: string[] = ['updated_at = :updated_at'];
    const args: any = { id: listingId, updated_at: now };

    if (updates.title !== undefined) { fields.push('title = :title'); args.title = updates.title; }
    if (updates.sealedBalePrice !== undefined) { fields.push('sealed_bale_price = :sealed_bale_price'); args.sealed_bale_price = updates.sealedBalePrice; }
    if (updates.curatedPiecePrice !== undefined) { fields.push('curated_piece_price = :curated_piece_price'); args.curated_piece_price = updates.curatedPiecePrice; }
    if (updates.inStockCount !== undefined) { fields.push('in_stock_count = :in_stock_count'); args.in_stock_count = updates.inStockCount; }

    await turso.execute({
      sql: `UPDATE listings SET ${fields.join(', ')} WHERE id = :id;`,
      args,
    });
  }

  const res = await turso.execute({
    sql: 'SELECT * FROM listings WHERE id = :id LIMIT 1;',
    args: { id: listingId },
  });

  return mapDbListingToItem(res.rows[0]);
}


export async function deleteListingFromDb(listingId: string): Promise<boolean> {
  try {
    await turso.execute({
      sql: 'DELETE FROM listings WHERE id = :id;',
      args: { id: listingId },
    });
    return true;
  } catch (e) {
    console.error('Error deleting listing from Turso:', e);
    return false;
  }
}

// Get live approved marketplace listings from Turso
export async function getApprovedMarketplaceListings(categoryId?: string, subCategoryId?: string, limit = 50): Promise<BaleListing[]> {
  try {
    let sql = `
      SELECT l.*, s.masked_code, s.full_name as seller_full_name, s.business_name, s.godown_zone,
             s.rating as seller_rating, s.trust_score as seller_trust_score, s.verification_status, s.account_status
      FROM listings l
      JOIN sellers s ON l.seller_id = s.id
      WHERE l.status = 'approved'
        AND s.verification_status = 'approved'
        AND s.account_status = 'active'
    `;
    const args: any = { limit };

    if (categoryId && categoryId !== 'all') {
      sql += ' AND l.category_id = :category_id';
      args.category_id = categoryId;
    }
    if (subCategoryId) {
      sql += ' AND l.sub_category_id = :sub_category_id';
      args.sub_category_id = subCategoryId;
    }

    sql += ' ORDER BY l.created_at DESC LIMIT :limit;';

    const res = await turso.execute({ sql, args });

    return res.rows.map((row: any) => {
      const sellerMock = {
        id: row.seller_id,
        masked_code: row.masked_code,
        full_name: row.seller_full_name,
        business_name: row.business_name,
        godown_zone: row.godown_zone,
        rating: row.seller_rating,
        trust_score: row.seller_trust_score,
        verification_status: row.verification_status,
        account_status: row.account_status,
      };
      return mapDbListingToMarketplaceBale(row, sellerMock);
    });
  } catch (err) {
    console.error('getApprovedMarketplaceListings Turso exception:', err);
    return [];
  }
}

export async function getMarketplaceListingBySlug(slug: string): Promise<BaleListing | null> {
  try {
    const res = await turso.execute({
      sql: `
        SELECT l.*, s.masked_code, s.full_name as seller_full_name, s.business_name, s.godown_zone,
               s.rating as seller_rating, s.trust_score as seller_trust_score, s.verification_status, s.account_status
        FROM listings l
        JOIN sellers s ON l.seller_id = s.id
        WHERE l.slug = :slug
          AND l.status = 'approved'
          AND s.account_status = 'active'
        LIMIT 1;
      `,
      args: { slug },
    });

    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    const sellerMock = {
      id: row.seller_id,
      masked_code: row.masked_code,
      full_name: row.seller_full_name,
      business_name: row.business_name,
      godown_zone: row.godown_zone,
      rating: row.seller_rating,
      trust_score: row.seller_trust_score,
      verification_status: row.verification_status,
      account_status: row.account_status,
    };
    return mapDbListingToMarketplaceBale(row, sellerMock);
  } catch (err) {
    console.error('getMarketplaceListingBySlug Turso exception:', err);
    return null;
  }
}

// -------------------------------------------------------------
// ESCROW ORDERS OPERATIONS (TURSO LIB-SQL EDGE DB)
// -------------------------------------------------------------

export async function createEscrowOrderInDb(order: EscrowOrderRecord) {
  await turso.execute({
    sql: `
      INSERT INTO escrow_orders (
        id, order_number, bale_id, seller_id, bale_title, bale_thumbnail, bale_weight_kg,
        buyer_name, buyer_phone, buyer_business_name, buyer_city, buyer_state, delivery_address,
        transport_preference, buy_mode, quantity, subtotal, platform_fee, inspection_fee,
        total_amount, escrow_status, seller_status, settlement_status, created_at
      ) VALUES (
        :id, :order_number, :bale_id, :seller_id, :bale_title, :bale_thumbnail, :bale_weight_kg,
        :buyer_name, :buyer_phone, :buyer_business_name, :buyer_city, :buyer_state, :delivery_address,
        :transport_preference, :buy_mode, :quantity, :subtotal, :platform_fee, :inspection_fee,
        :total_amount, 'ESCROW_LOCKED', 'new', 'escrow_locked', :created_at
      );
    `,
    args: {
      id: order.id,
      order_number: order.orderNumber,
      bale_id: order.baleId,
      seller_id: null,
      bale_title: order.baleTitle,
      bale_thumbnail: order.baleThumbnail,
      bale_weight_kg: order.baleWeightKg,
      buyer_name: order.buyerName,
      buyer_phone: order.buyerPhone,
      buyer_business_name: order.buyerBusinessName,
      buyer_city: (order as any).buyerCity || order.deliveryCity,
      buyer_state: (order as any).buyerState || order.deliveryState,
      delivery_address: order.deliveryAddress,
      transport_preference: order.transportPreference,
      buy_mode: order.buyMode,
      quantity: order.quantityBales || (order as any).quantity || 1,
      subtotal: order.subtotal,
      platform_fee: order.platformFee,
      inspection_fee: order.inspectionShieldFee || (order as any).inspectionFee || 0,
      total_amount: order.totalPayable || (order as any).totalAmount || 0,
      created_at: new Date().toISOString(),
    },
  });

  return order;
}


export async function getSellerOrdersFromDb(sellerId: string): Promise<SellerOrderDispatch[]> {
  try {
    const res = await turso.execute({
      sql: 'SELECT * FROM escrow_orders WHERE seller_id = :seller_id ORDER BY created_at DESC;',
      args: { seller_id: sellerId },
    });

    return res.rows.map((row: any) => ({
      id: row.id,
      orderNumber: row.order_number,
      baleId: row.bale_id || 'bale-001',
      buyerName: row.buyer_name,
      buyerPhone: row.buyer_phone,
      buyerBusinessName: row.buyer_business_name,
      buyerCity: row.buyer_city,
      buyerState: row.buyer_state,
      deliveryAddress: row.delivery_address,
      baleTitle: row.bale_title,
      baleThumbnail: row.bale_thumbnail,
      baleWeightKg: row.bale_weight_kg || 80,
      weightKg: row.bale_weight_kg || 80,
      buyMode: (row.buy_mode || 'sealed_bale') as any,
      quantity: row.quantity || 1,
      totalAmount: row.total_amount || 0,
      sellerPayoutAmount: row.subtotal || row.total_amount || 0,
      escrowStatus: (row.escrow_status || 'ESCROW_LOCKED') as any,
      sellerStatus: (row.seller_status || 'new') as any,
      settlementStatus: (row.settlement_status || 'escrow_locked') as any,
      settlementDate: row.settlement_date,
      settlementUtr: row.settlement_utr,
      inspectorName: row.inspector_name,
      inspectorPhone: row.inspector_phone,
      verifiedTareWeightKg: row.verified_tare_weight_kg,
      biltiLrNumber: row.bilti_lr_number,
      transporterName: row.transporter_name,
      biltiScanUrl: row.bilti_scan_url,
      currentStageIndex: 1,
      transportPreference: row.transport_preference || 'V-Trans Express',
      createdAt: row.created_at || new Date().toISOString(),
    }));

  } catch (err) {
    console.error('getSellerOrdersFromDb Turso exception:', err);
    return [];
  }
}

export async function updateSellerOrderStatusInDb(orderId: string, status: 'confirmed' | 'cancelled_by_seller', cancellationReason?: string) {
  await turso.execute({
    sql: 'UPDATE escrow_orders SET seller_status = :status WHERE id = :id;',
    args: { id: orderId, status },
  });
}
