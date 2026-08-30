'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SellerPublicNav } from '@/components/seller/SellerPublicNav';
import { SellerFooter } from '@/components/seller/SellerFooter';
import { SellerProfile } from '@/types';
import { getSellerByIdFromDb, getSellerByEmailFromDb } from '@/lib/supabase-db';
import { 
  Clock, 
  ShieldCheck, 
  Phone, 
  CheckCircle2, 
  XCircle,
  Loader2,
  RefreshCw,
  Building2,
  AlertCircle
} from 'lucide-react';

export default function PendingApprovalPage() {
  const router = useRouter();
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  // Load active seller cache
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sp_active_seller') || localStorage.getItem('sp_pending_seller');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSeller(parsed);
        } catch (e) {}
      }
    }
  }, []);

  // Real-time Database Polling
  const checkStatusInDatabase = async () => {
    if (!seller) return;
    setIsChecking(true);
    try {
      let freshProfile: SellerProfile | null = null;
      if (seller.id) {
        freshProfile = await getSellerByIdFromDb(seller.id);
      }
      if (!freshProfile && seller.email) {
        freshProfile = await getSellerByEmailFromDb(seller.email);
      }

      if (freshProfile) {
        setSeller(freshProfile);
        if (typeof window !== 'undefined') {
          localStorage.setItem('sp_active_seller', JSON.stringify(freshProfile));
        }

        if (freshProfile.verificationStatus === 'approved') {
          router.push('/seller/dashboard');
        }
      }
    } catch (err) {
      console.warn('Status check warning:', err);
    } finally {
      setIsChecking(false);
    }
  };

  // Auto-poll every 6 seconds
  useEffect(() => {
    if (!seller) return;

    if (seller.verificationStatus === 'approved') {
      router.push('/seller/dashboard');
      return;
    }

    const interval = setInterval(() => {
      checkStatusInDatabase();
    }, 6000);

    return () => clearInterval(interval);
  }, [seller, router]);

  const isRejected = seller?.verificationStatus === 'rejected';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <SellerPublicNav />

      <main className="max-w-2xl mx-auto px-4 py-12 flex-1 w-full flex flex-col justify-center">
        
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-5">
          
          {/* Status Icon */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
            isRejected 
              ? 'bg-rose-100 border border-rose-300 text-rose-800' 
              : 'bg-amber-100 border border-amber-300 text-amber-800'
          }`}>
            {isRejected ? (
              <XCircle className="w-8 h-8 stroke-[2.5]" />
            ) : (
              <Clock className="w-8 h-8 stroke-[2.5]" />
            )}
          </div>

          <div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border ${
              isRejected
                ? 'bg-rose-50 border-rose-300 text-rose-900'
                : 'bg-amber-50 border-amber-300 text-amber-900'
            }`}>
              {isRejected ? 'Application Declined' : 'Verification Under Review'}
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              {isRejected 
                ? 'KYC Verification Was Not Approved' 
                : 'Application Under Review by Panipat Trader Desk'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
              {isRejected
                ? (seller?.rejectionReason || 'Your trade credentials could not be verified by on-ground auditors.')
                : 'Our on-ground Panipat coordinator is auditing your godown details and trade credentials in the Central Admin Desk.'}
            </p>
          </div>

          {/* Live Check Indicator */}
          {!isRejected && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Checking Central Admin approval status live...</span>
              <button 
                onClick={checkStatusInDatabase} 
                disabled={isChecking}
                className="ml-1 text-slate-900 font-bold hover:underline flex items-center gap-1"
              >
                {isChecking ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                <span>Refresh</span>
              </button>
            </div>
          )}

          {/* Submitted Profile Summary */}
          {seller && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center justify-between">
                <span>Submitted Godown Profile</span>
                <span className="font-mono text-[11px] text-slate-500">ID: {seller.id}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600 pt-1">
                <div>
                  <span className="text-slate-400 block text-[10px]">Business Firm Name</span>
                  <strong className="text-slate-900">{seller.businessName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Sourcing Yard Hub</span>
                  <strong className="text-slate-900">{seller.godownZone}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Owner / Contact</span>
                  <strong className="text-slate-900">{seller.fullName} ({seller.phone})</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Escrow Payout Account</span>
                  <strong className="text-slate-900">{seller.bankName || 'Verified Bank'}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps Info */}
          {!isRejected && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="font-bold text-slate-900">What happens next?</div>
              <ul className="space-y-1.5 text-slate-600 text-[11.5px]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>The Panipat Central Admin reviews your submitted details in the Operations Desk.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Once approved, you will receive your unique masked supplier code (e.g. <strong>#PNP-001</strong>).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>This page will automatically redirect you to your active Godown Dashboard.</span>
                </li>
              </ul>
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`https://wa.me/918950202286?text=${encodeURIComponent(
                `Hi Panipat Ground Desk, I have applied for godown verification for "${seller?.businessName || 'My Business'}" (ID: ${seller?.id || ''}) and need expedited verification.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Panipat Desk on WhatsApp</span>
            </a>

            <Link
              href="/"
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center transition-colors"
            >
              Back to Marketplace
            </Link>
          </div>

        </div>

      </main>

      <SellerFooter />
    </div>
  );
}
