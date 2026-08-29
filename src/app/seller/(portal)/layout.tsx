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
        } catch (e) {}
      } else {
        // Fallback default approved seller
        const defaultApproved: SellerProfile = {
          id: 'pnp-001',
          maskedCode: '#PNP-001',
          fullName: 'Ramesh Gupta',
          phone: '+91 98120 34567',
          email: 'seller@guptatextiles.com',
          businessName: 'Gupta Woollen & Import Syndicate',
          godownZone: 'Sanoli Road Godown Hub',
          yardAddress: 'Plot 42, Sanoli Road Wholesale Godown Hub, Panipat',
          primaryInventoryTypes: ['Korean Heavy Puffers', 'Heavy 450 GSM Fleece Hoodies'],
          isGstinRegistered: true,
          gstin: '06AAAAA0000A1Z5',
          bankAccountNumber: '50200012345678',
          bankIfscCode: 'HDFC0001234',
          accountHolderName: 'Gupta Woollen Syndicate',
          bankName: 'HDFC Bank, Panipat',
          verificationStatus: 'approved',
          rating: 4.96,
          trustScore: 100.0,
          totalOrders: 1420,
          fulfilledOrders: 1420,
          cancelledOrders: 0,
          totalDispatchedBales: 1420,
          repeatBuyerRate: 96,
          createdAt: '2021-10-15T10:00:00Z',
        };
        localStorage.setItem('sp_active_seller', JSON.stringify(defaultApproved));
        setSeller(defaultApproved);
      }
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading || !seller) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-500">
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
