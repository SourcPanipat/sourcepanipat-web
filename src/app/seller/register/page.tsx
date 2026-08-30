'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SellerPublicNav } from '@/components/seller/SellerPublicNav';
import { SellerFooter } from '@/components/seller/SellerFooter';
import { GodownZone, SellerProfile } from '@/types';
import { supabase } from '@/lib/supabase-client';
import { registerSellerInDb } from '@/lib/supabase-db';

import { 
  Building2, 
  Upload, 
  ShieldCheck, 
  Check, 
  ArrowRight, 
  ArrowLeft,
  Lock,
  AlertCircle
} from 'lucide-react';

export default function SellerRegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState('');

  // Step 1: Godown Profile & Location
  const [businessName, setBusinessName] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [godownZone, setGodownZone] = useState<GodownZone>('Sanoli Road Godown Hub');
  const [yardAddress, setYardAddress] = useState('');

  // Step 2: Product Specialization
  const [inventoryTypes, setInventoryTypes] = useState<string[]>([
    'Korean Heavy Puffers',
    'Heavy 450 GSM Fleece Hoodies',
  ]);

  // Step 3: GST & Bank Verification
  const [hasGstin, setHasGstin] = useState(true);
  const [gstin, setGstin] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [bankIfscCode, setBankIfscCode] = useState('');
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [gstDocName, setGstDocName] = useState('');
  const [yardPhotoName, setYardPhotoName] = useState('');

  const toggleInventoryType = (type: string) => {
    if (inventoryTypes.includes(type)) {
      setInventoryTypes(inventoryTypes.filter((t) => t !== type));
    } else {
      setInventoryTypes([...inventoryTypes, type]);
    }
  };
  const toggleInventory = toggleInventoryType;


  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setRegisterError('');

    const sellerId = `pnp-seller-${Date.now().toString().slice(-6)}`;

    const newProfile: SellerProfile & { password?: string } = {
      id: sellerId,
      maskedCode: '#PNP-PENDING',
      fullName,
      phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
      email: email.trim().toLowerCase(),
      password,
      businessName,
      godownZone,
      yardAddress,
      primaryInventoryTypes: inventoryTypes,
      gstin: hasGstin ? gstin : undefined,
      isGstinRegistered: hasGstin,
      bankAccountNumber,
      bankIfscCode,
      accountHolderName: accountHolderName || fullName,
      bankName,
      gstDocUrl: gstDocName ? `https://pub-sourcepanipat.r2.dev/kyc/${gstDocName}` : undefined,
      yardPhotoUrl: yardPhotoName ? `https://pub-sourcepanipat.r2.dev/kyc/${yardPhotoName}` : undefined,
      verificationStatus: 'pending_approval',
      accountStatus: 'active',
      rating: 5.0,
      trustScore: 100.0,
      totalOrders: 0,
      fulfilledOrders: 0,
      cancelledOrders: 0,
      totalDispatchedBales: 0,
      repeatBuyerRate: 100,
      createdAt: new Date().toISOString(),
    };

    try {
      // 1. Try Supabase Auth Sign Up
      if (supabase && email.includes('@') && password) {
        try {
          await supabase.auth.signUp({
            email: email.trim().toLowerCase(),
            password,
            options: {
              data: {
                full_name: fullName,
                business_name: businessName,
                phone: phone,
                godown_zone: godownZone,
                role: 'seller',
              },
            },
          });
        } catch (err) {
          console.warn('Supabase seller auth signup notice:', err);
        }
      }

      // 2. Insert into Supabase sellers table
      const savedProfile = await registerSellerInDb(newProfile);

      // 3. Cache in localStorage for session handling
      if (typeof window !== 'undefined') {
        localStorage.setItem('sp_active_seller', JSON.stringify(savedProfile));
      }

      router.push('/seller/status/pending');
    } catch (err: any) {
      console.error('Registration failed:', err);
      setRegisterError(err.message || 'Registration failed. Please check your internet or retry.');
    } finally {
      setIsSubmitting(false);
    }
  };


  const hubs: GodownZone[] = [
    'Sanoli Road Godown Hub',
    'Noorwala Industrial Area',
    'Barsat Road Sorting Yard',
    'G.T. Road Wholesale Cluster',
  ];

  const availableInventory = [
    'Korean Heavy Puffers',
    'USA Vintage Denim & Workwear',
    'Heavy 450 GSM Fleece Hoodies',
    'Cashmere & Woolen Overcoats',
    'Double-Ply Heavy Mink Blankets',
    'Korean Chunky Knit Sweaters',
    'Vintage 90s Windbreakers',
  ];

  const handleNext = handleNextStep;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <SellerPublicNav />

      <main className="max-w-3xl mx-auto px-4 py-8 flex-1 w-full">
        
        {/* Wizard Progress Bar */}
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className={currentStep >= 1 ? 'text-slate-900' : 'text-slate-400'}>
              1. Contact & Credentials
            </span>
            <span className={currentStep >= 2 ? 'text-slate-900' : 'text-slate-400'}>
              2. Godown Location & Hub
            </span>
            <span className={currentStep >= 3 ? 'text-slate-900' : 'text-slate-400'}>
              3. Financials & KYC Upload
            </span>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full bg-slate-900 transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            />
          </div>
        </div>

        {registerError && (
          <div className="mb-4 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{registerError}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="p-6 sm:p-8 rounded-xl bg-white border border-slate-200 shadow-sm">
          
          {/* Step 1: Contact Details */}
          {currentStep === 1 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Step 1: Panipat Godown Owner Contact
                </h2>

                <p className="text-xs text-slate-500 mt-0.5">
                  Enter your official direct contact details for OTP and Panipat field coordination.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Full Name of Godown Owner / Managing Partner *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra Gupta"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block mb-1">
                      WhatsApp Mobile Number (Direct Calling) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9812034567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
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
                      placeholder="seller@guptatextiles.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Create Portal Password *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="Minimum 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                  />
                </div>

                {/* Privacy & Buyer Identity Note */}
                <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed">
                  <span className="font-semibold">Buyer Visibility Note:</span> Your full business and legal details remain strictly private for escrow verification. Buyers will see you as: <span className="font-bold text-slate-900">{fullName ? fullName.trim().split(/\s+/)[0] : '[Your First Name]'} · Verified Panipat Trader (#PNP-XXX)</span>.
                </div>
              </div>


              <div className="pt-4 flex items-center justify-between border-t border-slate-100">

                <Link href="/seller/login" className="text-xs text-slate-500 hover:text-slate-900">
                  Already registered? Sign In
                </Link>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <span>Continue to Godown Location</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Godown Location & Hub */}
          {currentStep === 2 && (
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Step 2: Godown Hub & Inventory Scope
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your primary sorting yard in Panipat for field inspector assignment.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Registered Business / Godown Firm Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Gupta Woollen & Import Syndicate"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Select Panipat Sourcing Hub *
                  </label>
                  <select
                    value={godownZone}
                    onChange={(e) => setGodownZone(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none cursor-pointer"
                  >
                    {hubs.map((hub) => (
                      <option key={hub} value={hub}>
                        {hub}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Complete Godown / Yard Physical Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Plot No., Street / Khasra No., Near Landmark, Panipat, Haryana"
                    value={yardAddress}
                    onChange={(e) => setYardAddress(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1.5">
                    Primary Inventory Types Handled:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {availableInventory.map((type) => {
                      const isChecked = inventoryTypes.includes(type);
                      return (
                        <div
                          key={type}
                          onClick={() => toggleInventory(type)}
                          className={`cursor-pointer p-2 rounded-lg border text-xs flex items-center justify-between transition-colors ${
                            isChecked ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          <span className="font-medium">{type}</span>
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <span>Continue to Bank & KYC</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Financials & KYC Upload */}
          {currentStep === 3 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Step 3: Escrow Bank Details & KYC Verification
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Escrow payouts will be settled directly to this bank account upon transport delivery confirmation.
                </p>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                
                {/* GST Toggle */}
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-slate-900">GST Registration Status</div>
                    <div className="text-[11px] text-slate-500">Do you hold an active GSTIN for your wholesale firm?</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setHasGstin(!hasGstin)}
                    className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                      hasGstin ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {hasGstin ? 'GST Registered' : 'Unregistered / Mill Direct'}
                  </button>
                </div>

                {hasGstin && (
                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block mb-1">
                      GSTIN (Goods and Services Tax Identification Number) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="06AAAAA0000A1Z5"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:border-slate-800 focus:outline-none uppercase"
                    />
                  </div>
                )}

                {/* Bank Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block mb-1">
                      Bank Account Number (Current / Savings) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="50200012345678"
                      value={bankAccountNumber}
                      onChange={(e) => setBankAccountNumber(e.target.value)}
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
                      placeholder="HDFC0001234"
                      value={bankIfscCode}
                      onChange={(e) => setBankIfscCode(e.target.value.toUpperCase())}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono text-slate-900 focus:border-slate-800 focus:outline-none uppercase"
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
                      placeholder="Gupta Woollen Syndicate"
                      value={accountHolderName}
                      onChange={(e) => setAccountHolderName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-700 block mb-1">
                      Bank Name & Panipat Branch *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="HDFC Bank, G.T. Road Branch"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                {/* KYC Document Uploads */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Doc 1 */}
                  <div className="p-3.5 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-center space-y-1.5">
                    <Upload className="w-5 h-5 text-slate-500 mx-auto" />
                    <div className="font-bold text-slate-800 text-xs">
                      {gstDocName || 'Upload GST / Trade License'}
                    </div>
                    <p className="text-[10px] text-slate-500">PDF, JPG up to 5MB (R2 Secured)</p>
                    <button
                      type="button"
                      onClick={() => setGstDocName('gst-certificate-panipat.pdf')}
                      className="px-2.5 py-1 rounded bg-white text-slate-800 text-[10.5px] font-semibold border border-slate-300"
                    >
                      {gstDocName ? '✓ Attached' : 'Select Document'}
                    </button>
                  </div>

                  {/* Doc 2 */}
                  <div className="p-3.5 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-center space-y-1.5">
                    <Upload className="w-5 h-5 text-slate-500 mx-auto" />
                    <div className="font-bold text-slate-800 text-xs">
                      {yardPhotoName || 'Upload Yard / Godown Photo'}
                    </div>
                    <p className="text-[10px] text-slate-500">Front signboard or storage bay</p>
                    <button
                      type="button"
                      onClick={() => setYardPhotoName('sanoli-godown-front.jpg')}
                      className="px-2.5 py-1 rounded bg-white text-slate-800 text-[10.5px] font-semibold border border-slate-300"
                    >
                      {yardPhotoName ? '✓ Attached' : 'Select Photo'}
                    </button>
                  </div>

                </div>

              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Submitting Application...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Submit Godown Application for Approval</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

        </div>

      </main>

      <SellerFooter />
    </div>
  );
}
