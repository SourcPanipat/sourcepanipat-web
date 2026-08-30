'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SellerPublicNav } from '@/components/seller/SellerPublicNav';
import { SellerFooter } from '@/components/seller/SellerFooter';
import { SellerProfile } from '@/types';
import { 
  Clock, 
  ShieldCheck, 
  Phone, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export default function PendingApprovalPage() {
  const router = useRouter();
  const [seller, setSeller] = useState<SellerProfile | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sp_active_seller') || localStorage.getItem('sp_pending_seller');
      if (stored) {
        try {
          setSeller(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  const handleSimulateApproval = () => {
    if (!seller) return;
    const approved: SellerProfile = {
      ...seller,
      verificationStatus: 'approved',
      maskedCode: seller.maskedCode || '#PNP-007',
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('sp_active_seller', JSON.stringify(approved));
    }
    setSeller(approved);
    router.push('/seller/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <SellerPublicNav />

      <main className="max-w-2xl mx-auto px-4 py-12 flex-1 w-full flex flex-col justify-center">
        
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-sm text-center space-y-5">
          
          {/* Status Icon */}
          <div className="w-16 h-16 rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto">
            <Clock className="w-8 h-8 stroke-[2.5]" />
          </div>

          <div>
            <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 px-3 py-1 rounded-full uppercase tracking-wider">
              Verification in Progress
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              Application Under Review by Panipat Trader Desk
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1">
              Our on-ground Panipat coordinator is auditing your godown details and GST registration.
            </p>
          </div>

          {/* Submitted Profile Summary */}
          {seller && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
              <div className="font-bold text-slate-900 border-b border-slate-200 pb-1.5 flex items-center justify-between">
                <span>Submitted Godown Profile</span>
                <span className="font-mono text-[11px] text-slate-500">{seller.id}</span>
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
                  <strong className="text-slate-900">{seller.bankName}</strong>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps Info */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
            <div className="font-bold text-slate-900">What happens next?</div>
            <ul className="space-y-1.5 text-slate-600 text-[11.5px]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Our Panipat Field Coordinator will call you to schedule a quick godown visit.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>You will receive your unique masked supplier code (e.g. <strong>#PNP-007</strong>).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>Your seller dashboard will unlock to list whole bales and curated lots.</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="https://wa.me/918950202286?text=Hi%20SourcePanipat,%20I%20have%20submitted%20my%20godown%20application%20and%20need%20expedited%20verification."
              target="_blank"

              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Panipat Desk on WhatsApp</span>
            </a>

            {/* Test Simulation Button */}
            <button
              onClick={handleSimulateApproval}
              className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Instant Admin Approval</span>
            </button>
          </div>

        </div>

      </main>

      <SellerFooter />
    </div>
  );
}
