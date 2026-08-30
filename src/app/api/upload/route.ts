import { NextResponse } from 'next/server';
import { uploadMediaToB2 } from '@/lib/b2-storage';
import { supabase } from '@/lib/supabase-client';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'uploads';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const timestamp = Date.now();
    const key = `${folder}/${timestamp}-${cleanFileName}`;
    const contentType = file.type || 'application/octet-stream';

    // 1. Sensitive KYC Documents -> Supabase Storage (kyc-docs private bucket)
    if (folder === 'kyc' || folder === 'kyc-docs') {
      try {
        if (supabase) {
          const { data, error } = await supabase.storage
            .from('kyc-docs')
            .upload(key, buffer, {
              contentType,
              upsert: true,
            });

          if (error) {
            console.warn('Supabase storage upload notice:', error.message);
            throw error;
          }

          // Generate 7-day signed URL for escrow & KYC verification
          const { data: signedUrlData, error: signError } = await supabase.storage
            .from('kyc-docs')
            .createSignedUrl(key, 604800); // 7 days (604,800 sec)

          if (signError || !signedUrlData?.signedUrl) {
            throw new Error(signError?.message || 'Failed to sign KYC document URL');
          }

          return NextResponse.json({
            success: true,
            url: signedUrlData.signedUrl,
            key,
            storage: 'supabase',
          });
        }
      } catch (sbErr: any) {
        console.warn('Falling back to Backblaze B2 for KYC storage:', sbErr.message);
      }
    }

    // 2. All Public Media (Listings, 30s Inspection Videos, Photos, Logos, Godowns) -> Backblaze B2
    try {
      const { presignedUrl } = await uploadMediaToB2(buffer, key, contentType);

      return NextResponse.json({
        success: true,
        url: presignedUrl,
        key,
        storage: 'b2',
      });
    } catch (b2Err: any) {
      console.error('Backblaze B2 Upload Error:', b2Err.message);
      // Fallback base64 data URI if connection fails
      const base64Data = `data:${contentType};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        url: base64Data,
        key,
        storage: 'fallback_base64',
      });
    }
  } catch (error: any) {
    console.error('Upload route error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
