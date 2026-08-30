'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { SellerProfile } from '@/types';
import { 
  Building2, 
  Upload, 
  ShieldCheck, 
  Save, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard,
  Camera
} from 'lucide-react';
import { SquareLoader } from '@/components/SquareLoader';


export default function SellerProfilePage() {
  const [seller, setSeller] = useState<SellerProfile | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [logoPreview, setLogoPreview] = useState<string>('/logo-icon.png');
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sp_active_seller');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setSeller(parsed);
          if (parsed.logoUrl) setLogoPreview(parsed.logoUrl);
        } catch (e) {}
      }
    }
  }, []);


  // 90% Canvas-Based JPEG Compression
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // 90% compression quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setLogoPreview(compressedDataUrl);
          setSeller(prev => (prev ? { ...prev, logoUrl: compressedDataUrl } : null));
        }
        setIsCompressing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!seller) return;
    setIsSaving(true);

    if (typeof window !== 'undefined') {
      localStorage.setItem('sp_active_seller', JSON.stringify(seller));
    }

    setTimeout(() => {
      setIsSaving(false);
      setSuccessMsg('Godown profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    }, 600);
  };

  if (!seller) {
    return <SquareLoader fullScreen={true} />;
  }



  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            Godown Profile & Yard Settings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your verified masked supplier credentials, logo branding, and escrow payout details.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
            {seller.maskedCode}
          </span>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {seller.trustScore || 100}% Trust
          </span>
        </div>
      </div>

      {successMsg && (
        <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
        
        {/* Section 1: Business Logo & Brand Identity */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center justify-between">
            <span>1. Godown Branding & Business Logo</span>
            <span className="text-[10.5px] text-slate-500 font-normal">Auto 90% Compression (Cloudflare R2)</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-20 h-20 rounded-2xl bg-slate-100 border-2 border-dashed border-slate-300 overflow-hidden flex items-center justify-center shrink-0">
              {logoPreview ? (
                <Image src={logoPreview} alt="Business Logo" fill className="object-cover" />
              ) : (
                <Building2 className="w-8 h-8 text-slate-400" />
              )}
            </div>

            <div className="space-y-1.5 text-center sm:text-left">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoFileChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isCompressing}
                className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 flex items-center gap-1.5 transition-colors mx-auto sm:mx-0"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isCompressing ? 'Compressing (90%)...' : 'Upload / Change Business Logo'}</span>
              </button>
              <p className="text-[10.5px] text-slate-400">
                Supports PNG, JPG. Automatically compressed to 90% quality before upload.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Godown & Owner Details */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="font-bold text-slate-900 uppercase tracking-wider text-xs">
            2. Business & Contact Information
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Registered Godown / Business Name *
              </label>
              <input
                type="text"
                required
                value={seller.businessName}
                onChange={(e) => setSeller({ ...seller, businessName: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Managing Partner / Owner Name *
              </label>
              <input
                type="text"
                required
                value={seller.fullName}
                onChange={(e) => setSeller({ ...seller, fullName: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                WhatsApp Phone (Direct Calling) *
              </label>
              <input
                type="tel"
                required
                value={seller.phone}
                onChange={(e) => setSeller({ ...seller, phone: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Official Email Address *
              </label>
              <input
                type="email"
                required
                value={seller.email}
                onChange={(e) => setSeller({ ...seller, email: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">
              Panipat Godown Hub *
            </label>
            <input
              type="text"
              readOnly
              value={seller.godownZone}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">
              Godown Physical Address *
            </label>
            <textarea
              rows={2}
              required
              value={seller.yardAddress}
              onChange={(e) => setSeller({ ...seller, yardAddress: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
            />
          </div>
        </div>

        {/* Section 3: Escrow Bank Details */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="font-bold text-slate-900 uppercase tracking-wider text-xs">
            3. Escrow Settlement Bank Details
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Bank Account Number *
              </label>
              <input
                type="text"
                required
                value={seller.bankAccountNumber}
                onChange={(e) => setSeller({ ...seller, bankAccountNumber: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Bank IFSC Code *
              </label>
              <input
                type="text"
                required
                value={seller.bankIfscCode}
                onChange={(e) => setSeller({ ...seller, bankIfscCode: e.target.value.toUpperCase() })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-900 focus:border-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Account Beneficiary Name *
              </label>
              <input
                type="text"
                required
                value={seller.accountHolderName}
                onChange={(e) => setSeller({ ...seller, accountHolderName: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Bank Name & Branch *
              </label>
              <input
                type="text"
                required
                value={seller.bankName}
                onChange={(e) => setSeller({ ...seller, bankName: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Godown Profile'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
