'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';

export function SellerFooter() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="relative h-7 w-36">
              <Image
                src="/logo-horizontal.png"
                alt="SourcePanipat"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              India's first B2B wholesale platform connecting Panipat godowns and textile importers directly with verified boutique buyers nationwide.
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Godown Sourcing Hubs</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li>Sanoli Road Godown Hub</li>
              <li>Noorwala Industrial Cluster</li>
              <li>Barsat Road Sorting Yards</li>
              <li>G.T. Road Export Hub</li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Seller Desk Quick Links</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><Link href="/seller/register" className="hover:text-white">Apply for Verification</Link></li>
              <li><Link href="/seller/login" className="hover:text-white">Seller Desk Sign In</Link></li>
              <li><Link href="/seller/dashboard" className="hover:text-white">Godown Portal Dashboard</Link></li>
              <li><Link href="/" className="hover:text-white">Buyer Marketplace Feed</Link></li>
            </ul>
          </div>

          <div className="space-y-2.5">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Panipat Field Desk</h4>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>+91 89502 02286</span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>godown@sourcepanipat.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Sector 25 Phase-2, Panipat, Haryana 132103</span>
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <span>© 2026 SourcePanipat B2B Godown Network. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>100% ICICI Nodal Escrow</span>
            <span>•</span>
            <span>Free On-Ground QC Inspections</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
