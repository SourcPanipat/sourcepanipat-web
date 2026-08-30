'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { SellerProfile } from '@/types';
import { SellerSidebar } from '@/components/seller/SellerSidebar';
import { SellerTopBar } from '@/components/seller/SellerTopBar';
import { SquareLoader } from '@/components/SquareLoader';

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
    setIsLoading(true);

    const timer = setTimeout(() => {
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
    }, 650);

    return () => clearTimeout(timer);
  }, [pathname, router]);

  if (isLoading || !seller) {
    return <SquareLoader fullScreen={true} />;
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
