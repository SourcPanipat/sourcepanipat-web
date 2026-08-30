import { browserSupabase as supabase } from './supabase-client';
import { SellerProfile, BaleListingItem, BaleListing, EscrowOrderRecord, SellerOrderDispatch } from '@/types';

// Helper: map DB row to SellerProfile
export function mapDbSellerToProfile(row: any): SellerProfile {
  return {
    id: row.id,
    maskedCode: row.masked_code || '#PNP-PENDING',
    fullName: row.full_name,
    slug: row.slug || `${(row.full_name || 'trader').toLowerCase().replace(/\s+/g, '-')}-${(row.masked_code || row.id || '').replace('#', '').toLowerCase()}`,
    phone: row.phone,
    email: row.email,
    businessName: row.business_name,
    godownZone: row.godown_zone,
    yardAddress: row.yard_address,
    primaryInventoryTypes: Array.isArray(row.primary_inventory_types) 
      ? row.primary_inventory_types 
      : (typeof row.primary_inventory_types === 'string' ? JSON.parse(row.primary_inventory_types) : []),
    logoUrl: row.logo_url,
    gstin: row.gstin,
    isGstinRegistered: Boolean(row.is_gstin_registered),
    bankAccountNumber: row.bank_account_number || '',
    bankIfscCode: row.bank_ifsc_code || '',
    accountHolderName: row.account_holder_name || '',
    bankName: row.bank_name || '',
    gstDocUrl: row.gst_doc_url,
    yardPhotoUrl: row.yard_photo_url,
    verificationStatus: row.verification_status || 'pending_approval',
    accountStatus: row.account_status || 'active',
    rejectionReason: row.rejection_reason,
    approvedAt: row.approved_at,
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

// Helper: map DB row to BaleListingItem
export function mapDbListingToItem(row: any): BaleListingItem {
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
    galleryImages: Array.isArray(row.gallery_images) ? row.gallery_images : [],
    weightKg: row.weight_kg ?? 80,
    estimatedPieceCount: row.estimated_piece_count ?? 70,
    sealedBalePrice: row.sealed_bale_price ?? 30000,
    curatedPiecePrice: row.curated_piece_price ?? 450,
    curatedMoq: row.curated_moq ?? 25,
    gradeA: row.grade_a ?? 85,
    gradeB: row.grade_b ?? 12,
    gradeC: row.grade_c ?? 3,
    videos: Array.isArray(row.videos) ? row.videos : [],
    photos: Array.isArray(row.photos) ? row.photos : [],
    godownBatchId: row.godown_batch_id || 'BATCH-SANOLI-2026',
    qcVerified: Boolean(row.qc_verified),
    inStockCount: row.in_stock_count ?? 1,
    fabricComposition: row.fabric_composition || 'Premium Graded Fabric',
    expectedGrossMargin: row.expected_gross_margin || '3.5x - 5.0x Margin',
    status: row.status || 'pending_approval',
    pendingEditJson: typeof row.pending_edit_json === 'string' ? row.pending_edit_json : JSON.stringify(row.pending_edit_json),
    rejectionReason: row.rejection_reason,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

// Helper: map DB listing + seller to marketplace BaleListing
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
    galleryImages: item.galleryImages,
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
    seller: {
      id: seller?.id || item.sellerId,
      maskedCode: seller?.maskedCode || '#PNP-001',
      fullName: seller?.fullName,
      slug: seller?.slug,
      supplierTier: 'Gold Vetted Importer',
      godownZone: seller?.godownZone || 'Sanoli Road Godown Hub',
      rating: seller?.rating || 4.9,
      trustScore: seller?.trustScore || 100.0,
      totalDispatchedBales: seller?.totalDispatchedBales || 0,
      repeatBuyerRate: seller?.repeatBuyerRate || 95,
      isVerified: seller?.verificationStatus === 'approved',
      memberSince: seller?.createdAt ? new Date(seller.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Jan 2026',
    },
    godownBatchId: item.godownBatchId,
    qcVerified: item.qcVerified,
    inStockCount: item.inStockCount,
    viewCount: 140,
    inquiryCount: 18,
    fabricComposition: item.fabricComposition,
    recommendedResaleChannel: 'Instagram Boutique & Thrift Outlets',
    expectedGrossMargin: item.expectedGrossMargin,
    tags: ['Wholesale', 'Grade A', 'Direct Godown'],
    createdAt: item.createdAt,
  };
}

// -------------------------------------------------------------
// SELLER PROFILE OPERATIONS
// -------------------------------------------------------------

export async function registerSellerInDb(seller: SellerProfile & { password?: string }) {
  const row = {
    id: seller.id,
    masked_code: seller.maskedCode || null,
    full_name: seller.fullName,
    slug: seller.slug || `${seller.fullName.toLowerCase().replace(/\s+/g, '-')}-${seller.id.slice(-4)}`,
    phone: seller.phone,
    email: seller.email.toLowerCase(),
    password_hash: seller.password || null,
    business_name: seller.businessName,
    godown_zone: seller.godownZone,
    yard_address: seller.yardAddress,
    primary_inventory_types: seller.primaryInventoryTypes,
    logo_url: seller.logoUrl || null,
    gstin: seller.gstin || null,
    is_gstin_registered: seller.isGstinRegistered,
    bank_account_number: seller.bankAccountNumber,
    bank_ifsc_code: seller.bankIfscCode,
    account_holder_name: seller.accountHolderName,
    bank_name: seller.bankName,
    gst_doc_url: seller.gstDocUrl || null,
    yard_photo_url: seller.yardPhotoUrl || null,
    verification_status: 'pending_approval',
    account_status: 'active',
    rating: 5.0,
    trust_score: 100.0,
    total_orders: 0,
    fulfilled_orders: 0,
    cancelled_orders: 0,
    total_dispatched_bales: 0,
    repeat_buyer_rate: 100,
  };

  const { data, error } = await supabase.from('sellers').upsert(row).select().single();
  if (error) throw error;
  return mapDbSellerToProfile(data);
}

export async function getSellerByEmailFromDb(email: string): Promise<(SellerProfile & { password?: string }) | null> {
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .ilike('email', email.trim().toLowerCase())
    .maybeSingle();

  if (error) {
    console.error('Error fetching seller by email:', error);
    return null;
  }
  if (!data) return null;

  const profile = mapDbSellerToProfile(data);
  return {
    ...profile,
    password: data.password_hash || undefined,
  };
}

export async function getSellerByIdFromDb(id: string): Promise<SellerProfile | null> {
  const { data, error } = await supabase
    .from('sellers')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error || !data) return null;
  return mapDbSellerToProfile(data);
}

export async function updateSellerProfileInDb(sellerId: string, updates: Partial<SellerProfile>) {
  const dbUpdates: any = {};
  if (updates.fullName) dbUpdates.full_name = updates.fullName;
  if (updates.businessName) dbUpdates.business_name = updates.businessName;
  if (updates.phone) dbUpdates.phone = updates.phone;
  if (updates.yardAddress) dbUpdates.yard_address = updates.yardAddress;
  if (updates.logoUrl !== undefined) dbUpdates.logo_url = updates.logoUrl;
  if (updates.gstin !== undefined) dbUpdates.gstin = updates.gstin;
  if (updates.bankAccountNumber) dbUpdates.bank_account_number = updates.bankAccountNumber;
  if (updates.bankIfscCode) dbUpdates.bank_ifsc_code = updates.bankIfscCode;
  if (updates.bankName) dbUpdates.bank_name = updates.bankName;
  if (updates.accountHolderName) dbUpdates.account_holder_name = updates.accountHolderName;

  const { data, error } = await supabase
    .from('sellers')
    .update(dbUpdates)
    .eq('id', sellerId)
    .select()
    .single();

  if (error) throw error;
  return mapDbSellerToProfile(data);
}

// -------------------------------------------------------------
// LISTINGS OPERATIONS
// -------------------------------------------------------------

export async function getSellerListingsFromDb(sellerId: string): Promise<BaleListingItem[]> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('seller_id', sellerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching seller listings:', error);
    return [];
  }
  return (data || []).map(mapDbListingToItem);
}

export async function createListingInDb(item: BaleListingItem): Promise<BaleListingItem> {
  const row = {
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
    gallery_images: item.galleryImages,
    weight_kg: item.weightKg,
    estimated_piece_count: item.estimatedPieceCount,
    sealed_bale_price: item.sealedBalePrice,
    curated_piece_price: item.curatedPiecePrice,
    curated_moq: item.curatedMoq,
    grade_a: item.gradeA,
    grade_b: item.gradeB,
    grade_c: item.gradeC,
    videos: item.videos,
    photos: item.photos,
    godown_batch_id: item.godownBatchId,
    qc_verified: item.qcVerified,
    in_stock_count: item.inStockCount,
    fabric_composition: item.fabricComposition,
    expected_gross_margin: item.expectedGrossMargin,
    status: 'pending_approval',
    pending_edit_json: null,
    rejection_reason: null,
  };

  const { data, error } = await supabase.from('listings').insert(row).select().single();
  if (error) throw error;
  return mapDbListingToItem(data);
}

export async function updateListingInDb(listingId: string, updates: Partial<BaleListingItem>, asPendingApproval = true): Promise<BaleListingItem> {
  const dbUpdates: any = {
    updated_at: new Date().toISOString(),
  };

  if (asPendingApproval) {
    dbUpdates.status = 'pending_approval';
    dbUpdates.pending_edit_json = updates;
  } else {
    if (updates.title) dbUpdates.title = updates.title;
    if (updates.sealedBalePrice !== undefined) dbUpdates.sealed_bale_price = updates.sealedBalePrice;
    if (updates.curatedPiecePrice !== undefined) dbUpdates.curated_piece_price = updates.curatedPiecePrice;
    if (updates.inStockCount !== undefined) dbUpdates.in_stock_count = updates.inStockCount;
  }

  const { data, error } = await supabase
    .from('listings')
    .update(dbUpdates)
    .eq('id', listingId)
    .select()
    .single();

  if (error) throw error;
  return mapDbListingToItem(data);
}

export async function deleteListingFromDb(listingId: string): Promise<boolean> {
  const { error } = await supabase.from('listings').delete().eq('id', listingId);
  if (error) {
    console.error('Error deleting listing:', error);
    return false;
  }
  return true;
}

// Get live approved listings for marketplace where seller is active (not deactivated, not frozen)
export async function getApprovedMarketplaceListings(categoryId?: string, subCategoryId?: string, limit = 50): Promise<BaleListing[]> {
  try {
    let query = supabase
      .from('listings')
      .select('*, sellers!inner(*)')
      .eq('status', 'approved')
      .eq('sellers.verification_status', 'approved')
      .eq('sellers.account_status', 'active')
      .order('created_at', { ascending: false })
      .limit(limit);


    if (categoryId && categoryId !== 'all') {
      query = query.eq('category_id', categoryId);
    }
    if (subCategoryId) {
      query = query.eq('sub_category_id', subCategoryId);
    }

    const { data, error } = await query;
    if (error) {
      console.warn('Error fetching approved marketplace listings:', error);
      return [];
    }

    return (data || []).map((row: any) => mapDbListingToMarketplaceBale(row, row.sellers));
  } catch (err) {
    console.error('getApprovedMarketplaceListings exception:', err);
    return [];
  }
}

export async function getMarketplaceListingBySlug(slug: string): Promise<BaleListing | null> {
  try {
    const { data, error } = await supabase
      .from('listings')
      .select('*, sellers!inner(*)')
      .eq('slug', slug)
      .eq('status', 'approved')
      .eq('sellers.account_status', 'active')
      .maybeSingle();

    if (error || !data) return null;
    return mapDbListingToMarketplaceBale(data, data.sellers);
  } catch (err) {
    console.error('getMarketplaceListingBySlug exception:', err);
    return null;
  }
}

// -------------------------------------------------------------
// ESCROW ORDERS OPERATIONS
// -------------------------------------------------------------

export async function createEscrowOrderInDb(order: EscrowOrderRecord) {
  const row = {
    id: order.id,
    order_number: order.orderNumber,
    bale_id: order.baleId,
    seller_id: null, // Will be linked if known
    bale_title: order.baleTitle,
    bale_thumbnail: order.baleThumbnail,
    bale_weight_kg: order.baleWeightKg,
    buyer_name: order.buyerName,
    buyer_phone: order.buyerPhone,
    buyer_business_name: order.buyerBusinessName,
    buyer_city: order.deliveryCity,
    buyer_state: order.deliveryState,
    delivery_address: order.deliveryAddress,
    transport_preference: order.transportPreference,
    buy_mode: order.buyMode,
    quantity: order.quantityBales || 1,
    subtotal: order.subtotal,
    platform_fee: order.platformFee,
    inspection_fee: order.inspectionShieldFee,
    total_amount: order.totalPayable,
    escrow_status: order.escrowStatus || 'ESCROW_LOCKED',
    seller_status: 'new',
    settlement_status: 'escrow_locked',
    inspector_name: order.inspector?.name || 'Vikram S. (#PNP-INSP-04)',
    inspector_phone: order.inspector?.phone || '+91 89502 02286',
    verified_tare_weight_kg: order.inspector?.verifiedTareWeightKg || order.baleWeightKg,
  };

  const { data, error } = await supabase.from('escrow_orders').insert(row).select().single();
  if (error) throw error;
  return data;
}

export async function getSellerOrdersFromDb(sellerId: string): Promise<SellerOrderDispatch[]> {
  try {
    const { data, error } = await supabase
      .from('escrow_orders')
      .select('*')
      .or(`seller_id.eq.${sellerId},seller_id.is.null`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching seller orders:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      orderNumber: row.order_number,
      baleId: row.bale_id || 'bale-001',
      baleTitle: row.bale_title || 'Wholesale Lot',
      baleThumbnail: row.bale_thumbnail || '',
      baleWeightKg: row.bale_weight_kg || 80,
      buyMode: row.buy_mode || 'sealed_bale',
      quantity: row.quantity || 1,
      totalAmount: row.total_amount || 30000,
      buyerName: row.buyer_name,
      buyerPhone: row.buyer_phone,
      buyerBusinessName: row.buyer_business_name,
      buyerCity: row.buyer_city || 'Delhi',
      buyerState: row.buyer_state || 'Delhi NCR',
      deliveryAddress: row.delivery_address,
      escrowStatus: row.escrow_status || 'ESCROW_LOCKED',
      sellerStatus: row.seller_status || 'new',
      settlementStatus: row.settlement_status || 'escrow_locked',
      inspectorName: row.inspector_name,
      inspectorPhone: row.inspector_phone,
      verifiedTareWeightKg: row.verified_tare_weight_kg,
      biltiLrNumber: row.bilti_lr_number,
      transporterName: row.transporter_name,
      biltiScanUrl: row.bilti_scan_url,
      createdAt: row.created_at,
    }));
  } catch (err) {
    console.error('getSellerOrdersFromDb exception:', err);
    return [];
  }
}
