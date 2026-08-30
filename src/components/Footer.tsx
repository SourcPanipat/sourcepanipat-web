import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, MapPin, Lock } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-slate-100 border-t border-slate-200 text-slate-600 text-xs mt-12">
      {/* Top Value Assurance Banner */}
      <div className="border-b border-slate-200 py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-0.5">Nodal Escrow Settlement</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Buyer funds remain securely locked until on-ground inspection is verified and Transport Bilti (LR) is uploaded.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-0.5">₹1,000 Inspection Shield</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Panipat ground QC inspectors audit digital scale tare weight and record 10-second opening video clips.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
              <MapPin className="w-5 h-5 text-slate-700" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 mb-0.5">Direct Panipat Godowns</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Direct access to Sanoli Road, Noorwala, and Barsat Road godown inventory without broker commission markups.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="space-y-2.5">
            <div className="relative h-9 w-44">
              <Image
                src="/logo-horizontal.png"
                alt="SourcePanipat"
                fill
                sizes="176px"
                className="object-contain object-left"
              />
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              India&apos;s B2B managed marketplace connecting thrift store owners, retailers, and boutique buyers directly with Panipat&apos;s wholesale textile & imported winter bale godowns.
            </p>
            <div className="text-[10px] text-slate-400">
              Operating under strict supplier masking & verified escrow protocols.
            </div>
          </div>

          {/* Sourcing Hubs */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Panipat Godown Hubs
            </h5>
            <ul className="space-y-1.5 text-[11px]">
              <li className="text-slate-700">Sanoli Road Import Yard</li>
              <li className="text-slate-700">Noorwala Sorting Godowns</li>
              <li className="text-slate-700">Barsat Road Export Mill Yard</li>
              <li className="text-slate-700">G.T. Road Transport Bilti Hub</li>
            </ul>
          </div>

          {/* Wholesale Categories */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Popular B2B Bale Lots
            </h5>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link href="/" className="text-slate-700 hover:text-slate-900">
                  Korean Heavy Puffer Jackets
                </Link>
              </li>
              <li>
                <Link href="/" className="text-slate-700 hover:text-slate-900">
                  Vintage USA Denim & Workwear
                </Link>
              </li>
              <li>
                <Link href="/" className="text-slate-700 hover:text-slate-900">
                  Japanese Heavy Fleece & Hoodies
                </Link>
              </li>
              <li>
                <Link href="/" className="text-slate-700 hover:text-slate-900">
                  Cashmere & Wool Overcoats
                </Link>
              </li>
              <li>
                <Link href="/" className="text-slate-700 hover:text-slate-900">
                  Double-Ply Mink Blankets
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Escrow Desk */}
          <div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Panipat Escrow Desk
            </h5>
            <div className="space-y-2 text-[11px] text-slate-600">
              <div>
                <strong>Support Desk:</strong> 10:00 AM – 8:00 PM IST (Mon-Sat)
              </div>
              <div>
                <strong>Godown Coordinators:</strong> Sanoli Road & Noorwala Hubs
              </div>
              <div className="pt-1">
                <a
                  href="https://wa.me/918950202286"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
                >
                  <span>Chat with Trader Desk (+91 89502 02286)</span>
                </a>
              </div>

            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-slate-200 mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10.5px] text-slate-500">
          <div>
            © {new Date().getFullYear()} SourcePanipat Marketplace. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Escrow Powered by ICICI Nodal</span>
            <span>•</span>
            <span>Panipat Godown Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
