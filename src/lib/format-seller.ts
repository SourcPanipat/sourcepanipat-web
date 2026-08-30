/**
 * Utility to format seller names safely with the humanized, privacy-safe standard:
 * [First Name] · Verified Panipat Trader (#[SELLER_CODE])
 * Example: "Rajesh · Verified Panipat Trader (#PNP-001)"
 * 
 * And clean URL handles for Instagram/Bio sharing:
 * Example: "rajesh-pnp-001"
 */

export const SELLER_NAME_MAP: Record<string, string> = {
  'pnp-001': 'Rajesh Gupta',
  'pnp-002': 'Vikram Sharma',
  'pnp-003': 'Suresh Goel',
  'pnp-004': 'Anil Batra',
  'pnp-005': 'Harish Chawla',
  'pnp-006': 'Manoj Singhal',
  '#pnp-001': 'Rajesh Gupta',
  '#pnp-002': 'Vikram Sharma',
  '#pnp-003': 'Suresh Goel',
  '#pnp-004': 'Anil Batra',
  '#pnp-005': 'Harish Chawla',
  '#pnp-006': 'Manoj Singhal',
};

export const KNOWN_TRADER_SLUGS = [
  'rajesh-pnp-001',
  'vikram-pnp-002',
  'suresh-pnp-003',
  'anil-pnp-004',
  'harish-pnp-005',
  'manoj-pnp-006',
];

export function getFormattedSellerName(fullName?: string, code?: string): string {
  let name = fullName;
  if (!name && code) {
    const key = code.toLowerCase();
    name = SELLER_NAME_MAP[key] || SELLER_NAME_MAP[key.replace('#', '')];
  }

  const firstName = name && name.trim().length > 0
    ? name.trim().split(/\s+/)[0]
    : 'Trader';
  
  const sellerCode = code && code.trim().length > 0 
    ? (code.startsWith('#') ? code : `#${code}`) 
    : '#PNP-001';

  return `${firstName} · Verified Panipat Trader (${sellerCode})`;
}

export function getSellerSlug(fullName?: string, code?: string): string {
  let name = fullName;
  if (!name && code) {
    const key = code.toLowerCase();
    name = SELLER_NAME_MAP[key] || SELLER_NAME_MAP[key.replace('#', '')];
  }

  const firstName = name && name.trim().length > 0
    ? name.trim().split(/\s+/)[0].toLowerCase().replace(/[^a-z0-9]/g, '')
    : 'trader';

  const cleanCode = code
    ? code.toLowerCase().replace('#', '').replace(/[^a-z0-9-]/g, '')
    : 'pnp-001';

  return `${firstName}-${cleanCode}`;
}
