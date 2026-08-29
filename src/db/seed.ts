import { categories, subCategories, sellers, bales } from './schema';
import { MASKED_SELLERS, MOCK_BALES } from '../lib/mock-catalog';

export interface CategorySeed {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  sortOrder: number;
  isActive: boolean;
  subCategories: {
    id: string;
    name: string;
    slug: string;
    defaultMoq: number;
    isActive: boolean;
  }[];
}

export const SEED_CATEGORIES: CategorySeed[] = [
  {
    id: 'winter-jackets-outerwear',
    name: 'Winter Jackets & Outerwear',
    slug: 'winter-jackets-outerwear',
    iconName: 'Layers',
    sortOrder: 1,
    isActive: true,
    subCategories: [
      { id: 'heavy-puffers', name: 'Korean Heavy Puffers (Grade A)', slug: 'heavy-puffers', defaultMoq: 25, isActive: true },
      { id: 'leather-bombers', name: 'Leather Flight Bombers & Aviators', slug: 'leather-bombers', defaultMoq: 20, isActive: true },
      { id: 'sherpa-truckers', name: 'Sherpa Lined Trucker Jackets', slug: 'sherpa-truckers', defaultMoq: 25, isActive: true },
      { id: 'quilted-vests', name: 'Insulated Quilted Winter Vests', slug: 'quilted-vests', defaultMoq: 30, isActive: true },
    ],
  },
  {
    id: 'fleece-sweatshirts',
    name: 'Fleece & Sweatshirts',
    slug: 'fleece-sweatshirts',
    iconName: 'Shirt',
    sortOrder: 2,
    isActive: true,
    subCategories: [
      { id: '450gsm-hoodies', name: '450 GSM Heavyweight Hoodies', slug: '450gsm-hoodies', defaultMoq: 30, isActive: true },
      { id: 'graphic-crewnecks', name: 'Embroidered Graphic Crewnecks', slug: 'graphic-crewnecks', defaultMoq: 30, isActive: true },
      { id: 'track-jackets', name: 'Zipper Track Tops & Warmups', slug: 'track-jackets', defaultMoq: 35, isActive: true },
    ],
  },
  {
    id: 'pants-joggers-cargo',
    name: 'Pants, Joggers & Cargo',
    slug: 'pants-joggers-cargo',
    iconName: 'Scissors',
    sortOrder: 3,
    isActive: true,
    subCategories: [
      { id: 'fleece-joggers', name: 'Heavy Fleece Winter Joggers', slug: 'fleece-joggers', defaultMoq: 30, isActive: true },
      { id: 'tactical-cargo', name: 'Multi-Pocket Tactical Cargo Pants', slug: 'tactical-cargo', defaultMoq: 25, isActive: true },
      { id: 'utility-chinos', name: 'Heavy Twill Utility Chinos', slug: 'utility-chinos', defaultMoq: 25, isActive: true },
    ],
  },
  {
    id: 'jeans-denim-workwear',
    name: 'Jeans & Denim Workwear',
    slug: 'jeans-denim-workwear',
    iconName: 'Sparkles',
    sortOrder: 4,
    isActive: true,
    subCategories: [
      { id: 'heavy-duck-canvas', name: 'USA Heavy Duck Canvas & Chore Coats', slug: 'heavy-duck-canvas', defaultMoq: 25, isActive: true },
      { id: '90s-baggy-denim', name: 'Vintage 90s Baggy Selvedge Denim', slug: '90s-baggy-denim', defaultMoq: 30, isActive: true },
      { id: 'distressed-workwear', name: 'Distressed Workwear Jackets', slug: 'distressed-workwear', defaultMoq: 20, isActive: true },
    ],
  },
  {
    id: 'overcoats-trench',
    name: 'Overcoats & Trench',
    slug: 'overcoats-trench',
    iconName: 'Building',
    sortOrder: 5,
    isActive: true,
    subCategories: [
      { id: 'cashmere-overcoats', name: 'Cashmere & Merino Wool Overcoats', slug: 'cashmere-overcoats', defaultMoq: 20, isActive: true },
      { id: 'wool-trench', name: 'Double-Breasted Wool Trench Coats', slug: 'wool-trench', defaultMoq: 20, isActive: true },
      { id: 'formal-blazers', name: 'Tailored Wool Blazers', slug: 'formal-blazers', defaultMoq: 25, isActive: true },
    ],
  },
  {
    id: 'summer-tees-tops',
    name: 'Summer Tees & Tops',
    slug: 'summer-tees-tops',
    iconName: 'Sun',
    sortOrder: 6,
    isActive: true,
    subCategories: [
      { id: '240gsm-graphic-tees', name: 'Heavyweight 240+ GSM Graphic Tees', slug: '240gsm-graphic-tees', defaultMoq: 50, isActive: true },
      { id: 'acid-wash-oversized', name: 'Acid Wash & Mineral Dyed Oversized', slug: 'acid-wash-oversized', defaultMoq: 50, isActive: true },
      { id: 'vintage-polos', name: 'Vintage Knit & Striped Polos', slug: 'vintage-polos', defaultMoq: 40, isActive: true },
    ],
  },
  {
    id: 'womens-thrift-y2k',
    name: "Women's Thrift & Y2K",
    slug: 'womens-thrift-y2k',
    iconName: 'Heart',
    sortOrder: 7,
    isActive: true,
    subCategories: [
      { id: 'chunky-cardigans', name: 'Chunky Pastel Cardigans & Knits', slug: 'chunky-cardigans', defaultMoq: 30, isActive: true },
      { id: 'cropped-sweats', name: 'Cropped Fleece Sweats & Hoodies', slug: 'cropped-sweats', defaultMoq: 30, isActive: true },
      { id: 'y2k-tops', name: 'Y2K Mesh & Fitted Knit Tops', slug: 'y2k-tops', defaultMoq: 40, isActive: true },
    ],
  },
  {
    id: 'home-furnishings-mink',
    name: 'Home Furnishings & Mink',
    slug: 'home-furnishings-mink',
    iconName: 'Package',
    sortOrder: 8,
    isActive: true,
    subCategories: [
      { id: 'mink-blankets', name: 'Double-Ply Embossed Heavy Mink Blankets', slug: 'mink-blankets', defaultMoq: 15, isActive: true },
      { id: 'polar-fleece-throws', name: 'Polar Fleece Winter Throws', slug: 'polar-fleece-throws', defaultMoq: 30, isActive: true },
      { id: 'panipat-dhurries', name: 'Panipat Cotton & Woolen Floor Rugs', slug: 'panipat-dhurries', defaultMoq: 25, isActive: true },
    ],
  },
];

export async function seedDatabase(drizzleDb: any) {
  console.log('Seeding Master Categories and Sub-Categories into Turso Database...');
  
  for (const cat of SEED_CATEGORIES) {
    await drizzleDb.insert(categories).values({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      iconName: cat.iconName,
      sortOrder: cat.sortOrder,
      isActive: cat.isActive,
    }).onConflictDoNothing();

    for (const sub of cat.subCategories) {
      await drizzleDb.insert(subCategories).values({
        id: sub.id,
        categoryId: cat.id,
        name: sub.name,
        slug: sub.slug,
        defaultMoq: sub.defaultMoq,
        isActive: sub.isActive,
      }).onConflictDoNothing();
    }
  }

  console.log('Categories seeded successfully!');
}
