'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SellerProfile } from '@/types';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { SellerTopBar } from '@/components/seller/SellerTopBar';

export default function SellerPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sp_active_seller');
      if (stored) {
        try {
          const parsed: SellerProfile = JSON.parse(stored);
          if (parsed.verificationStatus === 'pending_approval') {
            router.push('/seller/status/pending');
            return;
          }
          setSeller(parsed);
          setIsLoading(false);
          return;
        } catch (e) {}
      }
      
      // If no valid active seller logged in, redirect to login
      setIsLoading(false);
      router.push('/seller/login');
    }
  }, [router]);

  if (isLoading || !seller) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500 font-medium">
        Loading Godown Portal...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900">
      {/* Desktop Left Sidebar */}
      <div className="hidden md:flex">
        <SellerSidebar seller={seller} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <SellerTopBar seller={seller} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
