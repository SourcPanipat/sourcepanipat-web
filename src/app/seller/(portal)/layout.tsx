'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SellerProfile } from '@/types';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { SellerTopBar } from '@/components/seller/SellerTopBar';
import { SquareLoader } from '@/components/SquareLoader';
import { getSellerByIdFromDb, getSellerByEmailFromDb } from '@/lib/supabase-db';
import { AlertTriangle, Lock } from 'lucide-react';

export default function SellerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadActiveSeller() {
      if (typeof window === 'undefined') return;

      const cached = localStorage.getItem('sp_active_seller');
      let currentCached: SellerProfile | null = null;
      if (cached) {
        try { currentCached = JSON.parse(cached); } catch (e) {}
      }

      if (!currentCached) {
        if (isMounted) {
          setIsLoading(false);
          router.push('/seller/login');
        }
        return;
      }

      try {
        // Fetch fresh status from Supabase
        let fresh: SellerProfile | null = null;
        if (currentCached.id) {
          fresh = await getSellerByIdFromDb(currentCached.id);
        }
        if (!fresh && currentCached.email) {
          fresh = await getSellerByEmailFromDb(currentCached.email);
        }

        const activeSeller = fresh || currentCached;

        if (isMounted) {
          if (activeSeller.verificationStatus === 'pending_approval') {
            router.push('/seller/status/pending');
            return;
          }

          if (activeSeller.accountStatus === 'deactivated') {
            localStorage.removeItem('sp_active_seller');
            router.push('/seller/login');
            return;
          }

          setSeller(activeSeller);
          localStorage.setItem('sp_active_seller', JSON.stringify(activeSeller));
          setIsLoading(false);
        }
      } catch (err) {
        console.warn('Error fetching fresh seller:', err);
        if (isMounted) {
          setSeller(currentCached);
          setIsLoading(false);
        }
      }
    }

    loadActiveSeller();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  if (isLoading || !seller) {
    return <SquareLoader fullScreen={true} />;
  }

  const isFrozen = seller.accountStatus === 'frozen';

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Desktop Left Sidebar */}
      <div className="hidden md:flex">
        <SellerSidebar seller={seller} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <SellerTopBar seller={seller} />
        
        {/* Frozen Account Warning Banner */}
        {isFrozen && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs font-bold flex items-center justify-center gap-2 border-b border-amber-600 shadow-xs">
            <Lock className="w-4 h-4 shrink-0" />
            <span>
              ACCOUNT FROZEN BY ADMIN DESK: Your wholesale listings are temporarily hidden from the marketplace, and lot edits/additions are disabled. Contact Panipat Ground Desk (+91 89502 02286).
            </span>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
