'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { SellerProfile } from '@/types';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  CreditCard, 
  TrendingUp, 
  UserCircle, 
  ExternalLink,
  Store,
  ShieldCheck,
  PlusCircle,
  LogOut
} from 'lucide-react';

interface SellerSidebarProps {
  seller: SellerProfile | null;
}

export function SellerSidebar({ seller }: SellerSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      href: '/seller/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'My Listings',
      href: '/seller/listings',
      icon: Package,
    },
    {
      label: 'Orders & Dispatches',
      href: '/seller/orders',
      icon: Truck,
    },
    {
      label: 'Payouts & Revenue',
      href: '/seller/payouts',
      icon: CreditCard,
    },
    {
      label: 'Performance',
      href: '/seller/performance',
      icon: TrendingUp,
    },
    {
      label: 'Godown Profile',
      href: '/seller/profile',
      icon: UserCircle,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-screen">
      {/* Top Section */}
      <div className="space-y-5 p-4">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <Link href="/" className="flex items-center">
            <div className="relative h-7 w-36">
              <Image
                src="/logo-horizontal.png"
                alt="SourcePanipat"
                fill
                priority
                className="object-contain object-left"
              />
            </div>
          </Link>
          <span className="text-[9.5px] font-bold uppercase tracking-wider bg-slate-900 text-amber-400 px-1.5 py-0.5 rounded">
            Seller Desk
          </span>
        </div>

        {/* Seller Info Badge */}
        {seller && (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-900 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded">
                {seller.maskedCode || '#PNP-001'}
              </span>
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {seller.trustScore || 100}% Trust
              </span>
            </div>
            <div className="font-bold text-xs text-slate-900 truncate">
              {seller.businessName}
            </div>
            <div className="text-[10px] text-slate-500 truncate">
              {seller.godownZone}
            </div>
          </div>
        )}

        {/* Quick Action */}
        <Link
          href="/seller/listings/new"
          className="w-full py-2 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Create New Lot</span>
        </Link>

        {/* Nav Links */}
        <nav className="space-y-1 pt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/seller/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-200 space-y-2 bg-slate-50/50">
        <Link
          href="/"
          className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold flex items-center justify-between transition-colors shadow-2xs"
        >
          <span className="flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-slate-600" />
            <span>Buyer Marketplace</span>
          </span>
          <ExternalLink className="w-3 h-3 text-slate-400" />
        </Link>

        <Link
          href="/seller/login"
          className="w-full px-3 py-1.5 text-slate-500 hover:text-rose-600 text-[11px] font-medium flex items-center gap-1.5 transition-colors"
        >
          <LogOut className="w-3 h-3" />
          <span>Switch / Log Out Seller</span>
        </Link>
      </div>
    </aside>
  );
}
