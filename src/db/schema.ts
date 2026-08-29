import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// 1. Dynamic Master Categories Table (Admin Managed)
export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(), // e.g. "winter-jackets"
  name: text('name').notNull(), // "Winter Jackets & Outerwear"
  slug: text('slug').notNull().unique(),
  iconName: text('icon_name').notNull(), // Lucide icon key
  logoUrl: text('logo_url'), // Custom uploaded icon/image URL
  sortOrder: integer('sort_order').default(0).notNull(), // Ranking order on home screen
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// 2. Dynamic Sub-Categories Table (Seller Selectable)
export const subCategories = sqliteTable('sub_categories', {
  id: text('id').primaryKey(), // e.g. "heavy-puffers"
  categoryId: text('category_id').notNull().references(() => categories.id),
  name: text('name').notNull(), // "Korean Heavy Puffers (Grade A)"
  slug: text('slug').notNull().unique(),
  defaultMoq: integer('default_moq').default(25).notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true).notNull(),
});

// 3. Users / Buyers Table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  phone: text('phone').notNull().unique(),
  fullName: text('full_name').notNull(),
  businessName: text('business_name').notNull(),
  gstin: text('gstin'),
  email: text('email'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  address: text('address').notNull(),
  isGstinVerified: integer('is_gstin_verified', { mode: 'boolean' }).default(false),
  createdAt: text('created_at').notNull(),
});

// 4. Seller Profiles Table (Panipat Godowns, Importers & Vetted Mills)
export const sellerProfiles = sqliteTable('seller_profiles', {
  id: text('id').primaryKey(), // e.g. 'pnp-001'
  maskedCode: text('masked_code').notNull().unique(), // '#PNP-001'
  fullName: text('full_name').notNull(),
  phone: text('phone').notNull().unique(),
  email: text('email').notNull().unique(),
  businessName: text('business_name').notNull(),
  supplierTier: text('supplier_tier').default('Gold Vetted Importer'), // 'Gold Vetted Importer' | 'Direct Mill Godown' | 'Graded Sorting Hub'
  godownZone: text('godown_zone').notNull(), // 'Sanoli Road Godown Hub' | 'Noorwala Industrial Area' | 'Barsat Road Sorting Yard'
  yardAddress: text('yard_address').notNull(),
  primaryInventoryTypes: text('primary_inventory_types'), // JSON string array
  logoUrl: text('logo_url'), // 90% compressed logo URL
  
  // Banking & Financials
  gstin: text('gstin'),
  isGstinRegistered: integer('is_gstin_registered', { mode: 'boolean' }).default(true),
  bankAccountNumber: text('bank_account_number').notNull(),
  bankIfscCode: text('bank_ifsc_code').notNull(),
  accountHolderName: text('account_holder_name').notNull(),
  bankName: text('bank_name').notNull(),
  
  // KYC Docs (Cloudflare R2 URLs)
  gstDocUrl: text('gst_doc_url'),
  yardPhotoUrl: text('yard_photo_url'),
  
  // Vetting Status
  verificationStatus: text('verification_status').notNull().default('pending_approval'), // 'pending_approval' | 'approved' | 'rejected'
  rejectionReason: text('rejection_reason'),
  approvedAt: text('approved_at'),
  isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
  
  // Trust Scoring & Fulfillment Tracking
  trustScore: real('trust_score').default(100.0).notNull(), // Starts at 100%
  totalOrders: integer('total_orders').default(0).notNull(),
  fulfilledOrders: integer('fulfilled_orders').default(0).notNull(),
  cancelledOrders: integer('cancelled_orders').default(0).notNull(),
  rating: real('rating').default(4.9),
  totalDispatchedBales: integer('total_dispatched_bales').default(0),
  repeatBuyerRate: integer('repeat_buyer_rate').default(95),
  memberSince: text('member_since'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

// Backward compatibility alias for legacy references
export const sellers = sellerProfiles;

// 5. Bales & Wholesale Inventory Catalog Table
export const bales = sqliteTable('bales', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  sellerId: text('seller_id').notNull().references(() => sellerProfiles.id),
  categoryId: text('category_id').references(() => categories.id),
  subCategoryId: text('sub_category_id').references(() => subCategories.id),
  title: text('title').notNull(),
  shortDescription: text('short_description').notNull(),
  category: text('category').notNull(),
  listingMode: text('listing_mode').notNull().default('both'), // 'bale_only' | 'pieces_only' | 'both'
  originCountry: text('origin_country').notNull(),
  originFlag: text('origin_flag').notNull(),
  thumbnailUrl: text('thumbnail_url').notNull(),
  galleryImages: text('gallery_images').notNull(), // JSON string array
  
  // Listing Approval Workflow & Staging
  status: text('status').notNull().default('pending_approval'), // 'draft' | 'pending_approval' | 'approved' | 'rejected'
  pendingEditJson: text('pending_edit_json'), // Holds unapproved edits JSON snapshot until admin review
  rejectionReason: text('rejection_reason'),
  statusUpdatedAt: text('status_updated_at'),
  
  // Weight & Lot metrics
  weightKg: real('weight_kg').notNull(), // e.g. 80.0
  estimatedPieceCount: integer('estimated_piece_count').notNull(), // e.g. 120
  
  // Buying Mode Pricing (INR)
  sealedBalePrice: integer('sealed_bale_price').notNull(), // e.g. 24000
  curatedPiecePrice: integer('curated_piece_price').notNull(), // e.g. 280
  curatedMoq: integer('curated_moq').notNull().default(25), // MOQ 25 pcs
  
  // Grade Distribution JSON: { gradeA: 85, gradeB: 12, gradeC: 3 }
  gradeDistributionJson: text('grade_distribution_json').notNull(),
  
  // Videos: Array of up to 2 inspection videos (max 30s)
  videos: text('videos', { mode: 'json' }),
  
  // Photos: Array of up to 4 high-res photos
  photos: text('photos', { mode: 'json' }),
  
  videoGradeUrlsJson: text('video_grade_urls_json').notNull(),
  
  godownBatchId: text('godown_batch_id').notNull(),
  qcVerified: integer('qc_verified', { mode: 'boolean' }).default(true),
  inStockCount: integer('in_stock_count').notNull().default(1),
  viewCount: integer('view_count').default(0),
  inquiryCount: integer('inquiry_count').default(0),
  isHotDeal: integer('is_hot_deal', { mode: 'boolean' }).default(false),
  isFlashArrival: integer('is_flash_arrival', { mode: 'boolean' }).default(false),
  
  fabricComposition: text('fabric_composition').notNull(),
  recommendedResaleChannel: text('recommended_resale_channel').notNull(),
  expectedGrossMargin: text('expected_gross_margin').notNull(),
  tags: text('tags').notNull(),
  createdAt: text('created_at').notNull(),
});

// 6. Escrow Orders Table
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(),
  orderNumber: text('order_number').notNull().unique(), // e.g. 'SP-ESCROW-782190'
  buyerId: text('buyer_id').references(() => users.id),
  baleId: text('bale_id').notNull().references(() => bales.id),
  sellerId: text('seller_id').notNull().references(() => sellerProfiles.id),
  buyMode: text('buy_mode').notNull(), // 'sealed_bale' | 'curated_lot'
  quantityBales: integer('quantity_bales').default(1),
  curatedPieceCount: integer('curated_piece_count').default(0),
  
  // Financials (INR)
  subtotal: integer('subtotal').notNull(),
  platformFee: integer('platform_fee').notNull().default(0),
  inspectionShieldSelected: integer('inspection_shield_selected', { mode: 'boolean' }).default(false),
  inspectionShieldFee: integer('inspection_shield_fee').default(0),
  totalAmount: integer('total_amount').notNull(),
  
  // 5-Stage Escrow Lifecycle
  escrowStatus: text('escrow_status').notNull().default('ESCROW_LOCKED'),
  // 'ESCROW_LOCKED' | 'INSPECTOR_ASSIGNED' | 'QC_APPROVAL_PENDING' | 'DISPATCHED_BILTI_UPLOADED' | 'DELIVERED_SETTLED'
  currentStageIndex: integer('current_stage_index').default(0).notNull(),
  
  // Seller Order Workflow & Trust Scoring
  sellerStatus: text('seller_status').notNull().default('new'), // 'new' | 'confirmed' | 'dispatched' | 'completed' | 'cancelled_by_seller'
  sellerConfirmedAt: text('seller_confirmed_at'),
  sellerCancelledAt: text('seller_cancelled_at'),
  sellerCancellationReason: text('seller_cancellation_reason'),
  
  // Settlement & Escrow Payouts
  settlementStatus: text('settlement_status').notNull().default('escrow_locked'), // 'escrow_locked' | 'bank_transferred'
  settlementDate: text('settlement_date'),
  settlementUtr: text('settlement_utr'),
  netPayoutAmount: integer('net_payout_amount'),
  
  // Shipping & Consignee
  shippingName: text('shipping_name').notNull(),
  shippingPhone: text('shipping_phone').notNull(),
  shippingBusinessName: text('shipping_business_name').notNull(),
  shippingGstin: text('shipping_gstin'),
  shippingCity: text('shipping_city').notNull(),
  shippingState: text('shipping_state').notNull(),
  shippingAddress: text('shipping_address').notNull(),
  transportPreference: text('transport_preference').notNull(),
  
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// 7. On-Ground Tare Inspections Table
export const inspections = sqliteTable('inspections', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orders.id),
  inspectorName: text('inspector_name').notNull(),
  inspectorCode: text('inspector_code').notNull(),
  inspectorPhone: text('inspector_phone').notNull(),
  
  // Verified Tare Metrics
  tareWeightGrossKg: real('tare_weight_gross_kg'),
  tareWeightNetKg: real('tare_weight_net_kg'),
  openingVideoUrl: text('opening_video_url'),
  isApprovedByBuyer: integer('is_approved_by_buyer', { mode: 'boolean' }).default(false),
  approvedAt: text('approved_at'),
  
  // Bilti Dispatch Proof
  transportCarrier: text('transport_carrier'),
  transportLrNumber: text('transport_lr_number'),
  biltiScanUrl: text('bilti_scan_url'),
  dispatchedAt: text('dispatched_at'),
  
  status: text('status').notNull().default('ASSIGNED'),
  createdAt: text('created_at').notNull(),
});

// 8. Saved Delivery Addresses Table (Multi-Address Book: Address 1, Address 2, etc.)
export const buyerAddresses = sqliteTable('buyer_addresses', {
  id: text('id').primaryKey(), // e.g. 'addr-98124'
  userId: text('user_id').notNull(),
  label: text('label').notNull(), // 'Address 1 (Main Store)', 'Address 2 (Warehouse)'
  contactName: text('contact_name').notNull(),
  phone: text('phone').notNull(),
  addressLine: text('address_line').notNull(),
  landmark: text('landmark'),
  city: text('city').notNull(),
  state: text('state').notNull(),
  pincode: text('pincode').notNull(),
  isDefault: integer('is_default', { mode: 'boolean' }).default(false),
  transportPreference: text('transport_preference').notNull().default('V-Trans / TCI Freight'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

