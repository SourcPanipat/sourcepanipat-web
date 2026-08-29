'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { BuyerUser, SellerProfile } from '@/types';
import { AuthModal } from './AuthModal';
import { 
  MapPin, 
  Search, 
  Phone, 
  ShoppingBag, 
  ChevronDown, 
  ShieldCheck, 
  User, 
  UserPlus, 
  LogIn, 
  LogOut, 
  PackageCheck, 
  Building2, 
  MapPinned,
  ExternalLink,
  Store,
  LayoutDashboard,
  Clock
} from 'lucide-react';

interface HeaderProps {
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

export function Header({
  searchQuery = '',
  onSearchChange,
  cartCount = 0,
  onOpenCart,
}: HeaderProps) {
  const router = useRouter();
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'signup' | 'signin'>('signup');
  const [currentUser, setCurrentUser] = useState<BuyerUser | null>(null);
  const [activeSeller, setActiveSeller] = useState<SellerProfile | null>(null);
  const [selectedYard, setSelectedYard] = useState('Panipat Wholesale Yard');

  const profileRef = useRef<HTMLDivElement>(null);
  const locationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedBuyer = localStorage.getItem('sp_buyer_user');
      if (storedBuyer) {
        try {
          setCurrentUser(JSON.parse(storedBuyer));
        } catch (e) {}
      }

      const storedSeller = localStorage.getItem('sp_active_seller');
      if (storedSeller) {
        try {
          setActiveSeller(JSON.parse(storedSeller));
        } catch (e) {}
      }
    }
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sp_buyer_user');
    }
    setCurrentUser(null);
    setIsProfileMenuOpen(false);
  };

  const handleOpenAuth = (mode: 'signup' | 'signin') => {
    setAuthInitialMode(mode);
    setIsProfileMenuOpen(false);
    setIsAuthOpen(true);
  };

  const yards = [
    { name: 'Panipat Wholesale Yard (All Hubs)', code: 'PNP-ALL', count: '730+ Bales' },
    { name: 'Sanoli Road Godown Hub', code: 'PNP-HUB-A', count: '340+ Bales' },
    { name: 'Noorwala Sorting Cluster', code: 'PNP-HUB-B', count: '210+ Bales' },
    { name: 'Barsat Road Export Mill Yard', code: 'PNP-HUB-C', count: '180+ Bales' },
  ];

  // Compute User Initials
  const getInitials = (name?: string, business?: string) => {
    const source = name || business || 'User';
    const parts = source.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return source.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200 shadow-xs">
      {/* Top Notice Strip */}
      <div className="bg-slate-100 border-b border-slate-200/80 px-3 sm:px-4 py-1 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Panipat B2B Yard:</span>
            <span className="text-slate-600 truncate">
              Direct imported winter bales & factory lots from verified Panipat godowns
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-500 text-[11px]">
            <Link
              href="/seller"
              className="hover:text-slate-900 font-medium flex items-center gap-1 transition-colors text-amber-700 font-semibold"
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>Seller Godown Portal</span>
            </Link>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Verified Inspection Shield
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar (Strict OLX Layout) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-3">
          
          {/* 1. Official Logo (Transparent, No Background) */}
          <Link href="/" className="flex items-center shrink-0 hover:opacity-90 transition-opacity">
            <div className="relative h-8 sm:h-9 w-36 sm:w-44">
              <Image
                src="/logo-horizontal.png"
                alt="SourcePanipat - Sourcing, Trust, Growth"
                fill
                priority
                sizes="(max-width: 640px) 144px, 176px"
                className="object-contain object-left"
              />
            </div>
          </Link>

          {/* 2. City / Yard Selector (OLX Style) */}
          <div ref={locationRef} className="relative hidden md:block shrink-0">
            <button
              onClick={() => setIsLocationOpen(!isLocationOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-50 border border-slate-300 text-xs text-slate-800 hover:border-slate-400 transition-colors w-52 justify-between"
            >
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="font-medium truncate">{selectedYard}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {isLocationOpen && (
              <div className="absolute top-full mt-1 left-0 w-64 bg-white border border-slate-200 rounded-lg shadow-lg p-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="text-[11px] font-semibold text-slate-400 px-2 py-1 uppercase tracking-wider">
                  Select Sourcing Hub
                </div>
                {yards.map((yard) => (
                  <button
                    key={yard.name}
                    onClick={() => {
                      setSelectedYard(yard.name);
                      setIsLocationOpen(false);
                    }}
                    className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-50 text-xs flex items-center justify-between text-slate-700 hover:text-slate-900 transition-colors"
                  >
                    <span className="font-medium truncate">{yard.name}</span>
                    <span className="text-[10px] text-slate-400 shrink-0 ml-1">{yard.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 3. Main Search Bar with Action Button (OLX Style) */}
          <div className="flex-1 max-w-2xl">
            <div className="flex items-center rounded-lg border-2 border-slate-800 bg-white overflow-hidden focus-within:border-amber-600 transition-colors">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange?.(e.target.value)}
                placeholder="Find Korean heavy jackets, USA denim, fleece bales, mink blankets..."
                className="w-full px-3 py-1.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none bg-transparent"
              />
              <button
                type="button"
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 transition-colors flex items-center justify-center shrink-0"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 4. Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* WhatsApp Trader Desk */}
            <a
              href="https://wa.me/919876543210?text=Hello%20SourcePanipat%20Trader%20Desk,%20I%20want%20to%20inquire%20about%20winter%20bale%20rates"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-colors shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Trader Desk</span>
            </a>

            {/* Escrow Orders Tracker Link */}
            <Link
              href="/orders"
              className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-medium border border-slate-200 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-slate-700" />
              <span className="hidden md:inline">Orders</span>
              {cartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* 5. Circular Profile Avatar Trigger & Dropdown Menu */}
            <div ref={profileRef} className="relative">
              
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all border ${
                  currentUser
                    ? 'bg-slate-900 text-amber-400 border-slate-700 hover:border-amber-400 shadow-sm'
                    : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 hover:border-slate-400'
                }`}
                title={currentUser ? currentUser.contactName || currentUser.email : 'Account & Profile'}
              >
                {currentUser ? (
                  <span className="font-bold text-xs sm:text-sm tracking-tight">
                    {getInitials(currentUser.contactName, currentUser.businessName)}
                  </span>
                ) : (
                  <User className="w-5 h-5 text-slate-700" />
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileMenuOpen && (
                <div className="absolute top-full mt-2 right-0 w-68 bg-white border border-slate-200 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 text-xs">
                  
                  {/* SELLER QUICK-SWITCH ACTION (IF DETECTED) */}
                  {activeSeller && activeSeller.verificationStatus === 'approved' ? (
                    <div className="mb-2 p-2 rounded-lg bg-amber-500/10 border border-amber-400/30">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-mono font-bold text-amber-900">{activeSeller.maskedCode}</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded">
                          ★ {activeSeller.trustScore || 100}% Trust
                        </span>
                      </div>
                      <Link
                        href="/seller/dashboard"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="w-full py-1.5 px-2.5 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        <span>Open Godown Dashboard →</span>
                      </Link>
                    </div>
                  ) : activeSeller && activeSeller.verificationStatus === 'pending_approval' ? (
                    <div className="mb-2 p-2 rounded-lg bg-amber-50 border border-amber-200">
                      <div className="text-[11px] font-semibold text-amber-900 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        <span>Seller Application Pending</span>
                      </div>
                      <Link
                        href="/seller/status/pending"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="text-[10.5px] font-bold text-amber-800 hover:underline block mt-0.5"
                      >
                        View Verification Status →
                      </Link>
                    </div>
                  ) : null}

                  {currentUser ? (
                    /* Authenticated State */
                    <div className="space-y-1">
                      
                      {/* User Info Header */}
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 mb-1">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 font-bold text-xs flex items-center justify-center shrink-0">
                            {getInitials(currentUser.contactName, currentUser.businessName)}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate">
                              {currentUser.contactName || 'Verified Buyer'}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {currentUser.businessName || currentUser.email}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Buyer Links */}
                      <Link
                        href="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="w-full px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2.5 text-slate-800 font-medium transition-colors"
                      >
                        <MapPinned className="w-4 h-4 text-slate-600" />
                        <span>My Profile & Addresses</span>
                      </Link>

                      <Link
                        href="/orders"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="w-full px-3 py-2 rounded-lg hover:bg-slate-100 flex items-center gap-2.5 text-slate-800 font-medium transition-colors"
                      >
                        <PackageCheck className="w-4 h-4 text-slate-600" />
                        <span>My Escrow Orders</span>
                      </Link>

                      {/* Seller Opportunities for Buyer */}
                      {(!activeSeller || activeSeller.verificationStatus !== 'approved') && (
                        <div className="pt-1 my-1 border-t border-slate-100 space-y-1">
                          <Link
                            href="/seller/register"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="w-full px-3 py-1.5 rounded-lg hover:bg-amber-50 text-amber-900 font-semibold flex items-center gap-2.5 transition-colors"
                          >
                            <Store className="w-4 h-4 text-amber-600" />
                            <span>Become a Godown Seller</span>
                          </Link>

                          <Link
                            href="/seller/login"
                            onClick={() => setIsProfileMenuOpen(false)}
                            className="w-full px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2.5 transition-colors text-[11px]"
                          >
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>Seller Portal Login</span>
                          </Link>
                        </div>
                      )}

                      <a
                        href="https://wa.me/919876543210"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full px-3 py-1.5 rounded-lg hover:bg-emerald-50 text-emerald-800 flex items-center gap-2.5 font-medium transition-colors text-[11px]"
                      >
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Trader Desk (+91 98765 43210)</span>
                      </a>

                      <div className="pt-1 mt-1 border-t border-slate-100">
                        <button
                          onClick={handleSignOut}
                          className="w-full px-3 py-1.5 rounded-lg hover:bg-rose-50 text-rose-700 flex items-center gap-2.5 font-medium transition-colors text-left"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>

                    </div>
                  ) : (
                    /* Unauthenticated State (Before Login) */
                    <div className="space-y-1">
                      
                      <div className="px-3 py-2 border-b border-slate-100">
                        <div className="font-bold text-slate-900">Welcome to SourcePanipat</div>
                        <div className="text-[10.5px] text-slate-500">Panipat Wholesale Godown Sourcing</div>
                      </div>

                      <button
                        onClick={() => handleOpenAuth('signup')}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-2.5 transition-colors text-left mt-1 shadow-xs"
                      >
                        <UserPlus className="w-4 h-4 text-amber-400" />
                        <span>Create Buyer Account</span>
                      </button>

                      <button
                        onClick={() => handleOpenAuth('signin')}
                        className="w-full px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-800 font-semibold flex items-center gap-2.5 transition-colors text-left"
                      >
                        <LogIn className="w-4 h-4 text-slate-600" />
                        <span>Buyer Sign In</span>
                      </button>

                      <Link
                        href="/orders"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="w-full px-3 py-2 rounded-lg hover:bg-slate-100 text-slate-700 font-medium flex items-center gap-2.5 transition-colors"
                      >
                        <PackageCheck className="w-4 h-4 text-slate-500" />
                        <span>Track My Orders</span>
                      </Link>

                      {/* Seller Direct Entry */}
                      <div className="pt-1 my-1 border-t border-slate-100 space-y-1">
                        <Link
                          href="/seller/register"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="w-full px-3 py-1.5 rounded-lg hover:bg-amber-50 text-amber-900 font-semibold flex items-center gap-2.5 transition-colors"
                        >
                          <Store className="w-4 h-4 text-amber-600" />
                          <span>Become a Godown Seller</span>
                        </Link>

                        <Link
                          href="/seller/login"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="w-full px-3 py-1.5 rounded-lg hover:bg-slate-100 text-slate-700 flex items-center gap-2.5 transition-colors text-[11px]"
                        >
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          <span>Seller Desk Login</span>
                        </Link>
                      </div>

                      <div className="pt-1 mt-1 border-t border-slate-100">
                        <a
                          href="https://wa.me/919876543210"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-3 py-1.5 rounded-lg hover:bg-emerald-50 text-emerald-800 flex items-center gap-2 text-[11px] font-semibold"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Trader Desk Support</span>
                        </a>
                      </div>

                    </div>
                  )}

                </div>
              )}

            </div>

          </div>

        </div>
      </div>

      {/* Lean Buyer Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authInitialMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => setCurrentUser(user)}
      />
    </header>
  );
}

