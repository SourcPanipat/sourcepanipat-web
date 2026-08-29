'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SellerPublicNav } from '@/components/seller/SellerPublicNav';
import { SellerFooter } from '@/components/seller/SellerFooter';
import { SellerProfile } from '@/types';
import { Lock, Phone, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export default function SellerLoginPage() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const defaultSeller: SellerProfile = {
      id: 'pnp-001',
      maskedCode: '#PNP-001',
      fullName: 'Ramesh Gupta',
      phone: '+91 98120 34567',
      email: emailOrPhone || 'seller@guptatextiles.com',
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

    if (typeof window !== 'undefined') {
      localStorage.setItem('sp_active_seller', JSON.stringify(defaultSeller));
    }

    setTimeout(() => {
      setIsLoading(false);
      router.push('/seller/dashboard');
    }, 600);
  };

  const handleDemoLogin = (status: 'approved' | 'pending') => {
    if (status === 'approved') {
      const seller: SellerProfile = {
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
      if (typeof window !== 'undefined') {
        localStorage.setItem('sp_active_seller', JSON.stringify(seller));
      }
      router.push('/seller/dashboard');
    } else {
      const pendingSeller: SellerProfile = {
        id: 'pnp-seller-temp',
        maskedCode: '#PNP-007',
        fullName: 'Vikram Choudhary',
        phone: '+91 98111 22334',
        email: 'vikram@noorwalatex.com',
        businessName: 'Noorwala Sorting Yard Ltd',
        godownZone: 'Noorwala Industrial Area',
        yardAddress: 'Sector 25, Noorwala, Panipat',
        primaryInventoryTypes: ['Cashmere & Woolen Overcoats'],
        isGstinRegistered: true,
        bankAccountNumber: '1234567890',
        bankIfscCode: 'ICIC0001234',
        accountHolderName: 'Noorwala Sorting Yard',
        bankName: 'ICICI Bank',
        verificationStatus: 'pending_approval',
        rating: 5.0,
        trustScore: 100.0,
        totalOrders: 0,
        fulfilledOrders: 0,
        cancelledOrders: 0,
        totalDispatchedBales: 0,
        repeatBuyerRate: 100,
        createdAt: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('sp_active_seller', JSON.stringify(pendingSeller));
      }
      router.push('/seller/status/pending');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <SellerPublicNav />

      <main className="max-w-md mx-auto px-4 py-12 flex-1 w-full flex flex-col justify-center">
        
        <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm space-y-5">
          
          <div className="text-center space-y-1">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 mt-2">
              Panipat Godown Portal Login
            </h1>
            <p className="text-xs text-slate-500">
              Sign in to manage lots, track tare inspections, and upload Bilti receipts.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                WhatsApp Mobile or Registered Email
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 9812034567 or seller@panipat.com"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Portal Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors disabled:opacity-50 mt-2"
            >
              {isLoading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In to Seller Desk</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Logins for Testing */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Quick Test Profiles
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('approved')}
                className="p-2 rounded border border-slate-200 hover:bg-slate-50 text-left text-[11px] transition-colors"
              >
                <div className="font-bold text-slate-900">#PNP-001 (Gold)</div>
                <div className="text-[10px] text-emerald-700 font-semibold">✓ Approved Seller</div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('pending')}
                className="p-2 rounded border border-slate-200 hover:bg-slate-50 text-left text-[11px] transition-colors"
              >
                <div className="font-bold text-slate-900">New Applicant</div>
                <div className="text-[10px] text-amber-700 font-semibold">⏳ Pending Status</div>
              </button>
            </div>
          </div>

          <div className="pt-2 text-center text-xs">
            <span className="text-slate-500">New Godown Owner? </span>
            <Link href="/seller/register" className="font-bold text-slate-900 hover:underline">
              Apply for Verification
            </Link>
          </div>

        </div>

      </main>

      <SellerFooter />
    </div>
  );
}
