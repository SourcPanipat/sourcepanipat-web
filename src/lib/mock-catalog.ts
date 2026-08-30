import { BaleListing, MaskedSeller, EscrowOrderRecord, Category } from '@/types';
import { getSellerSlug } from './format-seller';

export const MASKED_SELLERS: Record<string, MaskedSeller> = {};

export const CATEGORIES: Category[] = [
  {
    "id": "winter-jackets-outerwear",
    "name": "Winter Jackets & Outerwear",
    "slug": "winter-jackets-outerwear",
    "iconName": "Layers",
    "sortOrder": 1,
    "isActive": true,
    "subCategories": [
      {
        "id": "heavy-puffers",
        "categoryId": "winter-jackets-outerwear",
        "name": "Korean Heavy Puffers (Grade A)",
        "slug": "heavy-puffers",
        "defaultMoq": 25,
        "isActive": true
      },
      {
        "id": "leather-bombers",
        "categoryId": "winter-jackets-outerwear",
        "name": "Leather Flight Bombers & Aviators",
        "slug": "leather-bombers",
        "defaultMoq": 20,
        "isActive": true
      },
      {
        "id": "sherpa-truckers",
        "categoryId": "winter-jackets-outerwear",
        "name": "Sherpa Lined Trucker Jackets",
        "slug": "sherpa-truckers",
        "defaultMoq": 25,
        "isActive": true
      },
      {
        "id": "quilted-vests",
        "categoryId": "winter-jackets-outerwear",
        "name": "Insulated Quilted Winter Vests",
        "slug": "quilted-vests",
        "defaultMoq": 30,
        "isActive": true
      },
      {
        "id": "ski-jackets",
        "categoryId": "winter-jackets-outerwear",
        "name": "Waterproof Ski & Mountain Parkas",
        "slug": "ski-jackets",
        "defaultMoq": 25,
        "isActive": true
      },
      {
        "id": "varsity-jackets",
        "categoryId": "winter-jackets-outerwear",
        "name": "USA Wool & Leather Varsity Jackets",
        "slug": "varsity-jackets",
        "defaultMoq": 20,
        "isActive": true
      }
    ]
  },
  {
    "id": "fleece-sweatshirts",
    "name": "Fleece & Sweatshirts",
    "slug": "fleece-sweatshirts",
    "iconName": "Shirt",
    "sortOrder": 2,
    "isActive": true,
    "subCategories": [
      {
        "id": "450gsm-hoodies",
        "categoryId": "fleece-sweatshirts",
        "name": "450 GSM Heavyweight Hoodies",
        "slug": "450gsm-hoodies",
        "defaultMoq": 30,
        "isActive": true
      },
      {
        "id": "graphic-crewnecks",
        "categoryId": "fleece-sweatshirts",
        "name": "Embroidered Graphic Crewnecks",
        "slug": "graphic-crewnecks",
        "defaultMoq": 30,
        "isActive": true
      },
      {
        "id": "half-zip-polars",
        "categoryId": "fleece-sweatshirts",
        "name": "Vintage Half-Zip Polar Fleeces",
        "slug": "half-zip-polars",
        "defaultMoq": 25,
        "isActive": true
      },
      {
        "id": "oversized-hoodies",
        "categoryId": "fleece-sweatshirts",
        "name": "Japanese Oversized Drop-Shoulder Hoodies",
        "slug": "oversized-hoodies",
        "defaultMoq": 25,
        "isActive": true
      }
    ]
  },
  {
    "id": "jeans-denim-workwear",
    "name": "Jeans & Denim Workwear",
    "slug": "jeans-denim-workwear",
    "iconName": "Scissors",
    "sortOrder": 3,
    "isActive": true,
    "subCategories": [
      {
        "id": "vintage-denim",
        "categoryId": "jeans-denim-workwear",
        "name": "USA Vintage Denim (501 / Heavy 14oz)",
        "slug": "vintage-denim",
        "defaultMoq": 30,
        "isActive": true
      },
      {
        "id": "carpenter-cargos",
        "categoryId": "jeans-denim-workwear",
        "name": "Heavy Duck Canvas Carpenter Pants",
        "slug": "carpenter-cargos",
        "defaultMoq": 25,
        "isActive": true
      },
      {
        "id": "denim-truckers",
        "categoryId": "jeans-denim-workwear",
        "name": "Aged Patina Denim Trucker Jackets",
        "slug": "denim-truckers",
        "defaultMoq": 20,
        "isActive": true
      },
      {
        "id": "baggy-skater-denim",
        "categoryId": "jeans-denim-workwear",
        "name": "Y2K Wide-Leg Baggy Skater Jeans",
        "slug": "baggy-skater-denim",
        "defaultMoq": 30,
        "isActive": true
      }
    ]
  },
  {
    "id": "overcoats-trench",
    "name": "Overcoats & Trench Coats",
    "slug": "overcoats-trench",
    "iconName": "Building",
    "sortOrder": 4,
    "isActive": true,
    "subCategories": [
      {
        "id": "wool-cashmere-overcoats",
        "categoryId": "overcoats-trench",
        "name": "Wool & Cashmere Blend Long Overcoats",
        "slug": "wool-cashmere-overcoats",
        "defaultMoq": 15,
        "isActive": true
      },
      {
        "id": "double-breasted-trench",
        "categoryId": "overcoats-trench",
        "name": "Classic British Double-Breasted Trench",
        "slug": "double-breasted-trench",
        "defaultMoq": 20,
        "isActive": true
      },
      {
        "id": "wool-peacoats",
        "categoryId": "overcoats-trench",
        "name": "Nautical Heavy Wool Peacoats",
        "slug": "wool-peacoats",
        "defaultMoq": 25,
        "isActive": true
      },
      {
        "id": "duster-coats",
        "categoryId": "overcoats-trench",
        "name": "Long Belted Woolen Duster Coats",
        "slug": "duster-coats",
        "defaultMoq": 20,
        "isActive": true
      }
    ]
  },
  {
    "id": "knit-sweaters-cardigans",
    "name": "Knit Sweaters & Cardigans",
    "slug": "knit-sweaters-cardigans",
    "iconName": "Sparkles",
    "sortOrder": 5,
    "isActive": true,
    "subCategories": [
      {
        "id": "chunky-cable-knits",
        "categoryId": "knit-sweaters-cardigans",
        "name": "Chunky Cable Knit Sweaters",
        "slug": "chunky-cable-knits",
        "defaultMoq": 30,
        "isActive": true
      },
      {
        "id": "mohair-cardigans",
        "categoryId": "knit-sweaters-cardigans",
        "name": "Mohair & Alpaca Blend Cardigans",
        "slug": "mohair-cardigans",
        "defaultMoq": 25,
        "isActive": true
      },
      {
        "id": "y2k-pastel-knits",
        "categoryId": "knit-sweaters-cardigans",
        "name": "Korean Y2K Pastel Knit Sweaters",
        "slug": "y2k-pastel-knits",
        "defaultMoq": 30,
        "isActive": true
      },
      {
        "id": "wool-turtlenecks",
        "categoryId": "knit-sweaters-cardigans",
        "name": "Fine Merino Wool Turtlenecks",
        "slug": "wool-turtlenecks",
        "defaultMoq": 30,
        "isActive": true
      }
    ]
  },
  {
    "id": "summer-tees-tops",
    "name": "Summer Tees & Vintage Tops",
    "slug": "summer-tees-tops",
    "iconName": "Sun",
    "sortOrder": 6,
    "isActive": true,
    "subCategories": [
      {
        "id": "band-graphic-tees",
        "categoryId": "summer-tees-tops",
        "name": "90s Band & Rock Graphic Tees (USA)",
        "slug": "band-graphic-tees",
        "defaultMoq": 50,
        "isActive": true
      },
      {
        "id": "heavyweight-blanks",
        "categoryId": "summer-tees-tops",
        "name": "240 GSM Heavy Cotton Oversized Blanks",
        "slug": "heavyweight-blanks",
        "defaultMoq": 50,
        "isActive": true
      },
      {
        "id": "hawaiian-resort-shirts",
        "categoryId": "summer-tees-tops",
        "name": "Rayon & Silk Resort Printed Shirts",
        "slug": "hawaiian-resort-shirts",
        "defaultMoq": 35,
        "isActive": true
      },
      {
        "id": "nfl-nascar-jerseys",
        "categoryId": "summer-tees-tops",
        "name": "Vintage Racing & Sports Jerseys",
        "slug": "nfl-nascar-jerseys",
        "defaultMoq": 30,
        "isActive": true
      }
    ]
  },
  {
    "id": "womens-thrift-y2k",
    "name": "Women's Thrift & Y2K Fashion",
    "slug": "womens-thrift-y2k",
    "iconName": "Heart",
    "sortOrder": 7,
    "isActive": true,
    "subCategories": [
      {
        "id": "y2k-baby-tees",
        "categoryId": "womens-thrift-y2k",
        "name": "Y2K Rhinestone & Baby Crop Tees",
        "slug": "y2k-baby-tees",
        "defaultMoq": 40,
        "isActive": true
      },
      {
        "id": "korean-vintage-dresses",
        "categoryId": "womens-thrift-y2k",
        "name": "Floral & Cottagecore Midi Dresses",
        "slug": "korean-vintage-dresses",
        "defaultMoq": 30,
        "isActive": true
      },
      {
        "id": "low-rise-cargos",
        "categoryId": "womens-thrift-y2k",
        "name": "Low-Rise Parachute & Cargo Pants",
        "slug": "low-rise-cargos",
        "defaultMoq": 30,
        "isActive": true
      },
      {
        "id": "corset-tops",
        "categoryId": "womens-thrift-y2k",
        "name": "Structured Lace & Denim Corset Tops",
        "slug": "corset-tops",
        "defaultMoq": 25,
        "isActive": true
      }
    ]
  },
  {
    "id": "home-furnishings-mink",
    "name": "Mink Blankets & Heavy Quilts",
    "slug": "home-furnishings-mink",
    "iconName": "Package",
    "sortOrder": 8,
    "isActive": true,
    "subCategories": [
      {
        "id": "embossed-mink-blankets",
        "categoryId": "home-furnishings-mink",
        "name": "Korean 2-Ply Embossed Mink Blankets (6-8kg)",
        "slug": "embossed-mink-blankets",
        "defaultMoq": 15,
        "isActive": true
      },
      {
        "id": "heavy-sherpa-throws",
        "categoryId": "home-furnishings-mink",
        "name": "Double Sided Plush Sherpa Throws",
        "slug": "heavy-sherpa-throws",
        "defaultMoq": 20,
        "isActive": true
      },
      {
        "id": "hotel-quilt-comforters",
        "categoryId": "home-furnishings-mink",
        "name": "Microfiber All-Weather Hotel Quilts",
        "slug": "hotel-quilt-comforters",
        "defaultMoq": 20,
        "isActive": true
      },
      {
        "id": "wool-military-blankets",
        "categoryId": "home-furnishings-mink",
        "name": "100% Wool Heavy Military Blankets",
        "slug": "wool-military-blankets",
        "defaultMoq": 25,
        "isActive": true
      }
    ]
  }
];

export const MOCK_ORDERS: Record<string, EscrowOrderRecord> = {};

export const MOCK_BALES: BaleListing[] = [];

// Helper to get live bales including client localStorage staged/approved lots
export function getLiveBales(): BaleListing[] {
  let allBales = [...MOCK_BALES];
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('sp_seller_lots');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const approvedOnly = parsed.filter((l: any) => l.status === 'approved');
        allBales = [...approvedOnly, ...allBales];
      } catch (e) {
        console.error(e);
      }
    }
  }
  return allBales;
}

export function enrichBaleAttributes(bale: BaleListing): BaleListing {
  return bale;
}

export function getBaleBySlug(slug: string): BaleListing | undefined {
  const all = getLiveBales();
  const found = all.find((b) => b.slug === slug || b.id === slug);
  if (found) return enrichBaleAttributes(found);
  return undefined;
}

export function getOrderById(orderId: string): EscrowOrderRecord | undefined {
  if (typeof window !== 'undefined') {
    const recent = localStorage.getItem('sp_recent_order');
    if (recent) {
      try {
        const parsed = JSON.parse(recent);
        if (parsed.id === orderId || parsed.orderNumber === orderId) {
          return parsed;
        }
      } catch (e) {}
    }
  }
  return MOCK_ORDERS[orderId] || Object.values(MOCK_ORDERS).find((o) => o.orderNumber === orderId || o.id === orderId);
}

export function getBalesByCategory(category: string, subCategory?: string): BaleListing[] {
  const allBales = getLiveBales();
  if (!category || category === 'all') {
    if (subCategory && subCategory !== 'all') {
      return allBales.filter((bale) => bale.subCategoryId === subCategory);
    }
    return allBales;
  }

  return allBales.filter((bale) => {
    const matchesCategory =
      bale.categoryId === category ||
      bale.category === category;

    if (!matchesCategory) return false;
    if (subCategory && subCategory !== 'all') {
      return bale.subCategoryId === subCategory;
    }
    return true;
  });
}

export function searchBales(query: string, category: string = 'all', subCategory?: string): BaleListing[] {
  let filtered = getBalesByCategory(category, subCategory);
  if (!query.trim()) return filtered;
  
  const q = query.toLowerCase();
  return filtered.filter(
    (bale) =>
      bale.title?.toLowerCase().includes(q) ||
      bale.shortDescription?.toLowerCase().includes(q) ||
      bale.originCountry?.toLowerCase().includes(q) ||
      bale.seller?.maskedCode?.toLowerCase().includes(q) ||
      bale.tags?.some((tag) => tag.toLowerCase().includes(q))
  );
}

export function getAllSellerSlugs(): string[] {
  const slugs = new Set<string>();
  Object.values(MASKED_SELLERS).forEach((s) => {
    if (s.slug) slugs.add(s.slug);
    const gen = getSellerSlug(s.fullName, s.maskedCode);
    if (gen) slugs.add(gen);
  });
  if (slugs.size === 0) {
    slugs.add('trader-pnp-001');
  }
  return Array.from(slugs);
}

export function getSellerBySlug(slug: string): MaskedSeller | undefined {
  if (!slug) return undefined;
  const clean = slug.toLowerCase().trim();

  // 1. Direct match on slug
  const direct = Object.values(MASKED_SELLERS).find((s) => s.slug?.toLowerCase() === clean);
  if (direct) return direct;

  // 2. Fallback matching active registered seller in localStorage
  if (typeof window !== 'undefined') {
    const activeSeller = localStorage.getItem('sp_active_seller');
    if (activeSeller) {
      try {
        const s = JSON.parse(activeSeller);
        const sSlug = getSellerSlug(s.fullName, s.maskedCode);
        if (sSlug.toLowerCase() === clean || s.maskedCode?.toLowerCase().replace('#', '') === clean) {
          return {
            id: s.id,
            maskedCode: s.maskedCode,
            fullName: s.fullName,
            slug: sSlug,
            supplierTier: 'Gold Vetted Importer',
            godownZone: s.godownZone || 'Sanoli Road Godown Hub',
            rating: s.rating || 5.0,
            trustScore: s.trustScore || 100,
            totalDispatchedBales: s.totalDispatchedBales || 0,
            repeatBuyerRate: s.repeatBuyerRate || 100,
            isVerified: s.verificationStatus === 'approved',
            memberSince: 'Aug 2026',
          };
        }
      } catch (e) {}
    }
  }

  return undefined;
}

export function getBalesBySeller(sellerIdOrSlug: string): BaleListing[] {
  if (!sellerIdOrSlug) return [];
  const clean = sellerIdOrSlug.toLowerCase().trim();

  const seller = getSellerBySlug(clean);
  const targetId = seller?.id?.toLowerCase() || clean;
  const targetCode = seller?.maskedCode?.toLowerCase() || '';

  const allBales = getLiveBales();
  return allBales.filter((bale) => {
    const baleSellerId = bale.seller?.id?.toLowerCase();
    const baleSellerCode = bale.seller?.maskedCode?.toLowerCase();
    const baleSellerSlug = bale.seller?.slug?.toLowerCase() || getSellerSlug(bale.seller?.fullName, bale.seller?.maskedCode);

    return (
      baleSellerId === targetId ||
      baleSellerCode === targetCode ||
      baleSellerSlug === clean ||
      (baleSellerCode && clean.includes(baleSellerCode.replace('#', '')))
    );
  });
}

export function getAllCategorySlugs(): string[] {
  return CATEGORIES.map((c) => c.slug);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  if (!slug) return undefined;
  const clean = slug.toLowerCase().trim();
  return CATEGORIES.find(
    (c) => c.slug.toLowerCase() === clean || c.id.toLowerCase() === clean
  );
}

export function getBalesByCategorySlug(catSlug: string, subSlug?: string): BaleListing[] {
  const cat = getCategoryBySlug(catSlug);
  const catId = cat ? cat.id : catSlug;
  return getBalesByCategory(catId, subSlug);
}
