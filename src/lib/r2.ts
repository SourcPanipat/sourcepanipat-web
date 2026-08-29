import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const accountId = process.env.R2_ACCOUNT_ID || 'mock-account-id';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || 'mock-access-key';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || 'mock-secret-key';
export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'sourcepanipat-media';
export const R2_PUBLIC_DOMAIN = process.env.R2_PUBLIC_DOMAIN || 'https://media.sourcepanipat.com';

export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export function getPublicMediaUrl(key: string): string {
  if (key.startsWith('http://') || key.startsWith('https://')) {
    return key;
  }
  return `${R2_PUBLIC_DOMAIN}/${key.replace(/^\//, '')}`;
}
