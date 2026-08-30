import { b2Client, B2_BUCKET_NAME, getPresignedMediaUrl } from './b2-storage';

export { b2Client, B2_BUCKET_NAME };

/**
 * Helper to return direct media URL if already HTTP, or presigned URL
 */
export function getPublicMediaUrl(keyOrUrl: string): string {
  if (!keyOrUrl) return '';
  if (keyOrUrl.startsWith('http://') || keyOrUrl.startsWith('https://') || keyOrUrl.startsWith('data:')) {
    return keyOrUrl;
  }
  return `https://sourcepanipat-media-bucket.s3.eu-central-003.backblazeb2.com/${keyOrUrl.replace(/^\//, '')}`;
}
