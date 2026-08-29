'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SellerProfile } from '@/types';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Package, 
  Truck, 
  CreditCard, 
  TrendingUp, 
  UserCircle,
  Store,
  ExternalLink,
  PlusCircle,
  ShieldCheck
} from 'lucide-react';

interface SellerTopBarProps {
  seller: SellerProfile | null;
}

export function SellerTopBar({ seller }: SellerTopBarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', href: '/seller/dashboard', icon: LayoutDashboard },
    { label: 'My Listings', href: '/seller/listings', icon: Package },
    { label: 'Orders', href: '/seller/orders', icon: Truck },
    { label: 'Payouts', href: '/seller/payouts', icon: CreditCard },
    { label: 'Performance', href: '/seller/performance', icon: TrendingUp },
    { label: 'Godown Profile', href: '/seller/profile', icon: UserCircle },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 py-2.5">
      <div className="flex items-center justify-between">
        
        {/* Left Mobile Menu Toggle + Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="md:hidden flex items-center">
            <Link href="/" className="relative h-6 w-28">
              <Image
                src="/logo-horizontal.png"
                alt="SourcePanipat"
                fill
                priority
                className="object-contain object-left"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs">
            <span className="text-slate-400">Seller Portal</span>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-slate-900 capitalize">
              {pathname.split('/')[2] || 'Dashboard'}
            </span>
          </div>
        </div>

        {/* Right Info */}
        <div className="flex items-center gap-2 sm:gap-3">
          {seller && (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                {seller.maskedCode || '#PNP-001'}
              </span>
              <span className="hidden sm:inline-flex text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {seller.trustScore || 100}% Trust
              </span>
            </div>
          )}

          <Link
            href="/"
            className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Marketplace</span>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden pt-3 pb-2 border-t border-slate-100 mt-2 space-y-1">
          <Link
            href="/seller/listings/new"
            onClick={() => setIsMobileOpen(false)}
            className="w-full mb-2 py-2 px-3 rounded-lg bg-amber-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Create New Lot</span>
          </Link>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/seller/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-100">
            <Link
              href="/"
              onClick={() => setIsMobileOpen(false)}
              className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <span>Back to Buyer Marketplace</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
