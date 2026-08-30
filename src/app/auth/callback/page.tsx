'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getBrowserSupabase } from '@/lib/supabase-client';
import { SquareLoader } from '@/components/SquareLoader';
import { BuyerUser } from '@/types';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [statusText, setStatusText] = useState('Verifying Google authorization...');

  useEffect(() => {
    async function handleAuth() {
      try {
        const supabase = getBrowserSupabase();
        if (!supabase) {
          throw new Error('Supabase client unavailable');
        }

        // Get session from Supabase client (handles hash/PKCE code exchange)
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.warn('Session retrieval note:', error.message);
        }

        let returnUrl = '/';
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('sp_auth_return_url');
          if (stored) {
            returnUrl = stored;
            localStorage.removeItem('sp_auth_return_url');
          }
        }

        if (session?.user) {
          const user = session.user;
          const meta = user.user_metadata || {};
          
          const buyerUser: BuyerUser = {
            id: user.id || `usr-google-${Date.now().toString().slice(-4)}`,
            email: user.email || '',
            phone: meta.phone || '+91 98112 34567',
            contactName: meta.full_name || meta.name || 'Verified Buyer',
            businessName: meta.business_name || 'Panipat Verified Boutique',
            city: 'New Delhi',
            state: 'Delhi NCR',
          };

          if (typeof window !== 'undefined') {
            localStorage.setItem('sp_buyer_user', JSON.stringify(buyerUser));
          }

          setStatusText('Authorization successful! Redirecting to Panipat godown portal...');
        } else {
          // If no session yet, listen to onAuthStateChange
          const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              if (session?.user) {
                const user = session.user;
                const meta = user.user_metadata || {};

                const buyerUser: BuyerUser = {
                  id: user.id || `usr-google-${Date.now().toString().slice(-4)}`,
                  email: user.email || '',
                  phone: meta.phone || '+91 98112 34567',
                  contactName: meta.full_name || meta.name || 'Verified Buyer',
                  businessName: meta.business_name || 'Panipat Verified Boutique',
                  city: 'New Delhi',
                  state: 'Delhi NCR',
                };

                if (typeof window !== 'undefined') {
                  localStorage.setItem('sp_buyer_user', JSON.stringify(buyerUser));
                }

                router.replace(returnUrl);
              }
            }
          );

          // Timeout fallback
          setTimeout(() => {
            router.replace(returnUrl);
          }, 1200);

          return () => {
            authListener?.subscription?.unsubscribe();
          };
        }

        setTimeout(() => {
          router.replace(returnUrl);
        }, 500);

      } catch (err) {
        console.error('Auth callback error:', err);
        router.replace('/');
      }
    }

    handleAuth();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
      <SquareLoader fullScreen={false} />
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<SquareLoader fullScreen={true} />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
