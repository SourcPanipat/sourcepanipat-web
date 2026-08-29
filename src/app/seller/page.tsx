'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SellerPublicNav } from '@/components/seller/SellerPublicNav';
import { SellerFooter } from '@/components/seller/SellerFooter';
import { 
  ShieldCheck, 
  Lock, 
  Video, 
  Truck, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Scale, 
  Users, 
  Clock, 
  FileCheck,
  ChevronRight
} from 'lucide-react';

export default function SellerLandingPage() {
  const benefits = [
    {
      icon: <Lock className="w-5 h-5 text-amber-600" />,
      title: '100% Upfront Escrow Security',
      desc: 'Buyer funds are locked in ICICI Nodal Escrow before you strap or dispatch a single bale. Zero payment defaults or bad debt.',
    },
    {
      icon: <Video className="w-5 h-5 text-amber-600" />,
      title: 'Free On-Ground QC Inspector',
      desc: 'SourcePanipat field inspectors visit your godown to shoot 30s live opening clips and verify digital tare weight at zero cost.',
    },
    {
      icon: <Users className="w-5 h-5 text-amber-600" />,
      title: 'Pan-India Boutique Buyers',
      desc: 'Reach 8,500+ verified retail thrift boutique owners and store managers across Delhi NCR, Mumbai, Bengaluru, Pune, and Northeast India.',
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />,
      title: 'Zero Broker Cuts & Transparent Margins',
      desc: 'Eliminate middlemen commissions. Get direct wholesale market prices for sealed 80kg/100kg bales and curated hand-picked lots.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: 'Submit Godown Profile & KYC',
      desc: 'Fill our 2-minute application with your yard location, GST/Trade License, and bank details for escrow payouts.',
    },
    {
      step: '02',
      title: 'On-Ground Yard Verification',
      desc: 'Our Panipat team audits your godown and assigns your verified masked supplier identity (e.g. #PNP-001).',
    },
    {
      step: '03',
      title: 'List Lots with 30s Godown Videos',
      desc: 'Upload whole bales or curated piece lots. B2B buyers across India purchase instantly via escrow.',
    },
    {
      step: '04',
      title: 'Dispatch & Receive Direct Payouts',
      desc: 'Load on transport (V-Trans/TCI), upload Bilti (LR scan), and receive automated bank settlements.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <SellerPublicNav />

      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Panipat Wholesale Importer & Godown Portal</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Sell Wholesale Bales & Textiles Directly to Pan-India Buyers <span className="text-amber-600">Without Middlemen</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                Get 100% upfront escrow protection, free on-ground inspection videos, and direct access to 8,500+ boutique thrift store owners in Delhi, Mumbai, and Bengaluru.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  href="/seller/register"
                  className="px-6 py-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <span>Register as Verified Godown Seller</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  href="/seller/login"
                  className="px-6 py-3.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm flex items-center justify-center border border-slate-300 transition-colors"
                >
                  Seller Desk Login
                </Link>
              </div>

              {/* Mini Trust Checklist */}
              <div className="pt-3 flex flex-wrap items-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  No Upfront Listing Fees
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  ICICI Nodal Escrow Hold
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Sanoli • Noorwala • Barsat Yards
                </span>
              </div>

            </div>

            {/* Right Card (Live Stats & Masked Godown Mockup) */}
            <div className="lg:col-span-5">
              <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white shadow-xl space-y-4 border border-slate-800">
                
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-400">#PNP-SELLER-001</span>
                    <h3 className="text-sm font-bold text-white mt-0.5">Sanoli Road Godown Hub</h3>
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded">
                    KYC Verified
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-xs text-slate-400">Total Escrow Dispatches</div>
                    <div className="text-lg font-black text-white mt-0.5">1,420+ Bales</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-xs text-slate-400">Seller Trust Score</div>
                    <div className="text-lg font-black text-emerald-400 mt-0.5">100% ⭐</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-xs text-slate-400">Avg. Payout Speed</div>
                    <div className="text-lg font-black text-white mt-0.5">T+1 Day</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/80 border border-slate-700">
                    <div className="text-xs text-slate-400">Payment Security</div>
                    <div className="text-lg font-black text-amber-400 mt-0.5">100% Escrow</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-amber-400" />
                    <span>Free Field Tare Weight Audit</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Field inspectors tag each bale with digital weigh scale readings and shoot 30s godown unboxing videos before buyer confirmation.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Benefits Grid */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Why Top Panipat Importers Sell on SourcePanipat
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Built specifically for Panipat’s wholesale textile, imported winter bale, and mink blanket trading ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {benefits.map((b, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-slate-400 transition-colors space-y-2.5"
              >
                <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                  {b.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{b.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4-Step Onboarding Pipeline */}
      <section className="py-12 sm:py-16 bg-white border-t border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Simple 4-Step Vetting
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              How Godown Onboarding Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              We vet every supplier to maintain strict Grade A trust for pan-India buyers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, sIdx) => (
              <div key={sIdx} className="relative space-y-2.5">
                <div className="text-3xl font-black text-slate-200 font-mono">
                  {st.step}
                </div>
                <h3 className="text-sm font-bold text-slate-900">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>

          {/* Bottom Register Action */}
          <div className="p-6 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white">Ready to list your godown lots?</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Takes 2 minutes to apply. Our Panipat team reviews within 24 hours.
              </p>
            </div>

            <Link
              href="/seller/register"
              className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow-sm"
            >
              Start Seller Application →
            </Link>
          </div>

        </div>
      </section>

      <SellerFooter />
    </div>
  );
}
