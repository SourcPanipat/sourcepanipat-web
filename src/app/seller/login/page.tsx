'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SellerPublicNav } from '@/components/seller/SellerPublicNav';
import { SellerFooter } from '@/components/seller/SellerFooter';
import { SellerProfile } from '@/types';
import { supabase } from '@/lib/supabase-client';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';

export default function SellerLoginPage() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const inputClean = emailOrPhone.trim().toLowerCase();
    const passClean = password.trim();

    if (!inputClean || !passClean) {
      setErrorMsg('Please enter both your registered email/phone and password.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Check local registered sellers store
      let matchedSeller: (SellerProfile & { password?: string }) | null = null;
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('sp_registered_sellers');
        if (stored) {
          try {
            const sellers: any[] = JSON.parse(stored);
            matchedSeller = sellers.find(
              (s) =>
                s.email?.toLowerCase() === inputClean ||
                s.phone?.replace(/[^0-9]/g, '') === inputClean.replace(/[^0-9]/g, '')
            );
          } catch (err) {}
        }

        // Also check if active seller matches
        if (!matchedSeller) {
          const active = localStorage.getItem('sp_active_seller');
          if (active) {
            try {
              const activeParsed = JSON.parse(active);
              if (
                activeParsed.email?.toLowerCase() === inputClean ||
                activeParsed.phone?.replace(/[^0-9]/g, '') === inputClean.replace(/[^0-9]/g, '')
              ) {
                matchedSeller = activeParsed;
              }
            } catch (err) {}
          }
        }
      }

      // 2. Try Supabase Auth Sign In as well
      if (supabase && inputClean.includes('@')) {
        try {
          const { data: supaData, error: supaError } = await supabase.auth.signInWithPassword({
            email: inputClean,
            password: passClean,
          });

          if (supaData?.user && !matchedSeller) {
            matchedSeller = {
              id: supaData.user.id,
              maskedCode: '#PNP-001',
              fullName: supaData.user.user_metadata?.full_name || 'Panipat Trader',
              phone: supaData.user.user_metadata?.phone || '+91 89502 02286',
              email: supaData.user.email || inputClean,
              businessName: supaData.user.user_metadata?.business_name || 'Panipat Godown Syndicate',
              godownZone: 'Sanoli Road Godown Hub',
              yardAddress: 'Sanoli Road Godown Hub, Panipat',
              primaryInventoryTypes: ['Winter Outerwear', 'Fleece Hoodies'],
              isGstinRegistered: false,
              bankAccountNumber: '',

              bankIfscCode: '',
              accountHolderName: '',
              bankName: '',
              verificationStatus: 'approved',
              rating: 5.0,
              trustScore: 100,
              totalOrders: 0,
              fulfilledOrders: 0,
              cancelledOrders: 0,
              totalDispatchedBales: 0,
              repeatBuyerRate: 100,
              createdAt: new Date().toISOString(),
            };
          }
        } catch (supaErr) {
          console.warn('Supabase auth check:', supaErr);
        }
      }

      // 3. Password Verification
      if (!matchedSeller) {
        setErrorMsg('No seller account found with this email/phone. Please check your credentials or register your godown.');
        setIsLoading(false);
        return;
      }

      if (matchedSeller.password && matchedSeller.password !== passClean) {
        setErrorMsg('Incorrect password. Please verify your password and try again.');
        setIsLoading(false);
        return;
      }

      // 4. Save active session
      if (typeof window !== 'undefined') {
        localStorage.setItem('sp_active_seller', JSON.stringify(matchedSeller));
      }

      // 5. Route based on approval status
      if (matchedSeller.verificationStatus === 'pending_approval') {
        router.push('/seller/status/pending');
      } else {
        router.push('/seller/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <SellerPublicNav />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-800 mx-auto border border-amber-200/80">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Seller Godown Desk Login
            </h1>
            <p className="text-xs text-slate-500">
              Enter your verified Panipat trader credentials to access your godown inventory and dispatches
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Registered Email or WhatsApp Number
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. trader@gmail.com or 98120XXXXX"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Password</label>
                <a
                  href="https://wa.me/918950202286?text=Hi%20Panipat%20Desk,%20I%20forgot%20my%20seller%20password"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-amber-800 hover:underline font-medium"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-slate-800 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Godown Desk</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 text-center space-y-3">
            <div className="text-xs text-slate-500">
              Don&apos;t have a verified godown account yet?
            </div>
            <Link
              href="/seller/register"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs transition-colors"
            >
              <span>Apply for Godown Verification</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5 text-[11px] text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% ICICI Nodal Protected & Tare Weight Audited Platform</span>
          </div>

        </div>
      </main>

      <SellerFooter />
    </div>
  );
}
