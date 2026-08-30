export type BuyMode = 'sealed_bale' | 'curated_lot';

export type SourcingMode = 'bale_only' | 'pieces_only' | 'both';

export type ListingStatus = 'draft' | 'pending_approval' | 'approved' | 'rejected';

export type SellerVerificationStatus = 'pending_approval' | 'approved' | 'rejected';

export type GodownZone = 
  | 'Sanoli Road Godown Hub'
  | 'Noorwala Industrial Area'
  | 'Barsat Road Sorting Yard'
  | 'G.T. Road Wholesale Cluster';

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  logoUrl?: string;
  sortOrder: number;
  isActive: boolean;
  subCategories?: SubCategory[];
}

export interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  defaultMoq: number;
  isActive: boolean;
}

export type BaleCategory =
  | 'all'
  | 'winter-jackets-outerwear'
  | 'fleece-sweatshirts'
  | 'pants-joggers-cargo'
  | 'jeans-denim-workwear'
  | 'overcoats-trench'
  | 'summer-tees-tops'
  | 'womens-thrift-y2k'
  | 'home-furnishings-mink'
  | 'korean_heavy_puffers'
  | 'vintage_denim_workwear'
  | 'heavy_fleece_hoodies'
  | 'curated_handpicked_lots'
  | 'woolen_overcoats_trench'
  | 'mink_fleece_blankets';

export interface GradeDistribution {
  gradeA: number; // Percentage e.g. 70
  gradeB: number; // Percentage e.g. 25
  gradeC: number; // Percentage e.g. 5
}

export interface VideoGradeClip {
  id?: string;
  type?: 'opening_inspection' | 'godown_walkthrough';
  grade: 'Grade A' | 'Grade B' | 'Grade C';
  videoUrl: string;
  durationSeconds: number; // 30s
  label: string;
  description: string;
  conditionNotes?: string[];
}

export interface MediaItem {
  id: string;
  type: 'video' | 'image';
  title: string;
  url: string;
  durationSeconds?: number;
  grade?: string;
  label?: string;
  description?: string;
}

export interface MaskedSeller {
  id: string; // e.g. 'PNP-001'
  maskedCode: string; // '#PNP-001'
  fullName?: string; // e.g. 'Rajesh Kumar'
  supplierTier: 'Gold Vetted Importer' | 'Direct Mill Godown' | 'Graded Sorting Hub';
  godownZone: 'Sanoli Road Godown Hub' | 'Noorwala Industrial Area' | 'Barsat Road Sorting Yard' | 'G.T. Road Wholesale Cluster';
  rating: number; // 4.9
  trustScore?: number; // e.g. 100 or 98.5
  totalDispatchedBales: number;
  repeatBuyerRate: number; // e.g. 94%
  isVerified: boolean;
  memberSince: string;
}


export interface SellerProfile {
  id: string;
  maskedCode: string; // e.g. '#PNP-001'
  fullName: string;
  phone: string;
  email: string;
  businessName: string;
  godownZone: GodownZone;
  yardAddress: string;
  primaryInventoryTypes: string[];
  logoUrl?: string;
  gstin?: string;
  isGstinRegistered: boolean;
  bankAccountNumber: string;
  bankIfscCode: string;
  accountHolderName: string;
  bankName: string;
  gstDocUrl?: string;
  yardPhotoUrl?: string;
  verificationStatus: SellerVerificationStatus;
  rejectionReason?: string;
  approvedAt?: string;
  rating: number;
  trustScore: number; // Starts at 100.0
  totalOrders: number;
  fulfilledOrders: number;
  cancelledOrders: number;
  totalDispatchedBales: number;
  repeatBuyerRate: number;
  createdAt: string;
}

export interface BaleListing {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  category: string;
  categoryId?: string;
  subCategoryId?: string;
  categoryLabel: string;
  originCountry: string;
  originFlag: string;
  thumbnailUrl: string;
  galleryImages: string[];
  
  // Listing Approval Workflow & Staging
  status?: ListingStatus; // 'draft' | 'pending_approval' | 'approved' | 'rejected'
  pendingEditJson?: string;
  rejectionReason?: string;
  
  // Flexible Sourcing Mode
  sourcingMode: SourcingMode; // 'bale_only' | 'pieces_only' | 'both'

  // Weight & Bulk Packaging
  weightKg: number; // e.g. 80, 100
  estimatedPieceCount: number; // e.g. 110-130 pcs
  
  // Pricing
  sealedBalePrice: number; // e.g. 24000 (INR for whole sealed bale)
  curatedPiecePrice: number; // e.g. 280 (INR per hand-picked piece)
  curatedMoq: number; // Minimum order quantity e.g. 25 pcs
  
  // Quality & Grades (2 x 30s Videos + Photos)
  gradeBreakdown: GradeDistribution;
  videoClips: VideoGradeClip[];
  
  // Godown & Supplier Masking
  seller: MaskedSeller;
  godownBatchId: string; // e.g. 'BATCH-PNP-2026-W09'
  
  // Platform & Trust
  qcVerified: boolean;
  inStockCount: number;
  viewCount: number;
  inquiryCount: number;
  isHotDeal?: boolean;
  isFlashArrival?: boolean;
  
  // SEO & Technical Specs
  garmentType?: string;
  targetGender?: string;
  primaryFabric?: string;
  fabricComposition: string;
  recommendedResaleChannel: string;
  expectedGrossMargin: string;
  tags: string[];
  createdAt: string;
}

// Seller-side listing view item
export interface BaleListingItem {
  id: string;
  slug: string;
  sellerId: string;
  categoryId: string;
  subCategoryId: string;
  categoryLabel: string;
  title: string;
  shortDescription: string;
  sourcingMode: SourcingMode;
  originCountry: string;
  originFlag: string;
  thumbnailUrl: string;
  galleryImages: string[];
  weightKg: number;
  estimatedPieceCount: number;
  sealedBalePrice: number;
  curatedPiecePrice: number;
  curatedMoq: number;
  gradeA: number;
  gradeB: number;
  gradeC: number;
  videos: VideoGradeClip[];
  photos: string[];
  godownBatchId: string;
  qcVerified: boolean;
  inStockCount: number;
  garmentType?: string;
  targetGender?: string;
  primaryFabric?: string;
  fabricComposition: string;
  expectedGrossMargin: string;
  status: ListingStatus; // 'draft' | 'pending_approval' | 'approved' | 'rejected'
  pendingEditJson?: string;
  rejectionReason?: string;
  createdAt: string;
}


export interface BuyerAddress {
  id: string;
  userId: string;
  label: string; // e.g. 'Address 1 (Main Store)', 'Address 2 (Warehouse)'
  contactName: string;
  phone: string;
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  transportPreference: string;
  createdAt: string;
}

export interface BuyerUser {
  id: string;
  email: string;
  phone: string;
  contactName?: string;
  businessName?: string;
  gstin?: string;
  city?: string;
  state?: string;
  addresses?: BuyerAddress[];
}

export type OrderStage = 
  | 'ESCROW_LOCKED'
  | 'INSPECTOR_ASSIGNED'
  | 'QC_APPROVAL_PENDING'
  | 'DISPATCHED_BILTI_UPLOADED'
  | 'DELIVERED_SETTLED';

export interface EscrowOrderRecord {
  id: string;
  orderNumber: string;
  baleId: string;
  baleTitle: string;
  baleThumbnail: string;
  baleWeightKg: number;
  sellerMaskedCode: string;
  godownZone: string;
  buyMode: BuyMode;
  quantityBales?: number;
  curatedPieceCount?: number;
  subtotal: number;
  inspectionShieldFee: number;
  platformFee: number;
  totalPayable: number;
  escrowStatus: OrderStage;
  currentStageIndex: number; // 0 to 4
  sellerStatus?: 'new' | 'confirmed' | 'dispatched' | 'completed' | 'cancelled_by_seller';
  settlementStatus?: 'escrow_locked' | 'bank_transferred';
  settlementDate?: string;
  settlementUtr?: string;
  createdAt: string;
  estimatedDispatch: string;
  buyerName: string;
  buyerPhone: string;
  buyerBusinessName: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryAddress: string;
  transportPreference: string;
  inspector?: {
    name: string;
    code: string;
    phone: string;
    assignedAt: string;
    verifiedTareWeightKg?: number;
    openingVideoUrl?: string;
    approvedAt?: string;
  };
  bilti?: {
    transporterName: string;
    lrNumber: string;
    dispatchDate: string;
    scanImageUrl: string;
  };
}

export interface SellerOrderDispatch {
  id: string;
  orderNumber: string;
  baleId: string;
  baleTitle: string;
  baleThumbnail: string;
  baleWeightKg: number;
  buyMode: 'sealed_bale' | 'curated_lot';
  quantity: number;
  totalAmount: number;
  buyerName?: string;
  buyerPhone?: string;
  buyerBusinessName?: string;
  buyerCity: string;
  buyerState: string;
  deliveryAddress?: string;
  escrowStatus: OrderStage;
  sellerStatus: 'new' | 'confirmed' | 'dispatched' | 'completed' | 'cancelled_by_seller';
  settlementStatus: 'escrow_locked' | 'bank_transferred';
  settlementDate?: string;
  settlementUtr?: string;
  inspectorName?: string;
  inspectorPhone?: string;
  verifiedTareWeightKg?: number;
  biltiLrNumber?: string;
  transporterName?: string;
  biltiScanUrl?: string;
  createdAt: string;
}

export interface EscrowOrderRequest {
  baleId: string;
  baleTitle: string;
  buyMode: BuyMode;
  quantityBales?: number;
  curatedPieceCount?: number;
  includeInspectionShield: boolean;
  buyerName: string;
  buyerPhone: string;
  buyerBusinessName: string;
  buyerGstin?: string;
  deliveryCity: string;
  deliveryState: string;
  deliveryAddress: string;
  transportPreference?: string;
}

export interface EscrowOrderResponse {
  orderId: string;
  orderNumber: string;
  subtotal: number;
  platformFee: number;
  inspectionShieldFee: number;
  totalPayable: number;
  escrowStatus: string;
  estimatedDispatch: string;
  createdAt: string;
}

