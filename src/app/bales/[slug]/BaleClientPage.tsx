'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { VideoGradeModal } from '@/components/VideoGradeModal';
import { EscrowCheckoutDrawer } from '@/components/EscrowCheckoutDrawer';
import { Footer } from '@/components/Footer';
import { MOCK_BALES, getBaleBySlug } from '@/lib/mock-catalog';
import { BuyMode, BaleListing, BuyerUser } from '@/types';
import { formatINR } from '@/lib/utils';
import { 
  ShieldCheck, 
  Play, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  Lock, 
  Check, 
  Phone,
  Building,
  Film,
  Layers
} from 'lucide-react';

interface BaleClientPageProps {
  slug: string;
}

export function BaleClientPage({ slug }: BaleClientPageProps) {
  const bale = getBaleBySlug(slug) || MOCK_BALES[0];

  if (!bale) {
    notFound();
  }

  const initialBuyMode: BuyMode = 
    bale.sourcingMode === 'pieces_only' ? 'curated_lot' : 'sealed_bale';

  const [selectedBuyMode, setSelectedBuyMode] = useState<BuyMode>(initialBuyMode);
  const [baleQuantity, setBaleQuantity] = useState<number>(1);
  const [curatedPieces, setCuratedPieces] = useState<number>(bale.curatedMoq || 25);
  const [includeShield, setIncludeShield] = useState<boolean>(true);
  
  // Modals & Auth Gate State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [selectedPreviewBale, setSelectedPreviewBale] = useState<BaleListing | null>(null);

  // Video Player Control State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'images'>('video');
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const images = bale.galleryImages && bale.galleryImages.length > 0 ? bale.galleryImages : [bale.thumbnailUrl];
  const videoUrl = bale.videoClips && bale.videoClips[0] ? bale.videoClips[0].videoUrl : 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  // Pricing calculations
  const totalBalesWeight = bale.weightKg * baleQuantity;
  const sealedBaleTotal = bale.sealedBalePrice * baleQuantity;
  const curatedLotTotal = curatedPieces * bale.curatedPiecePrice;
  
  const currentSubtotal = selectedBuyMode === 'sealed_bale' ? sealedBaleTotal : curatedLotTotal;
  const shieldFee = includeShield ? 1000 : 0;
  const currentGst = Math.round(currentSubtotal * 0.05);
  const finalTotalAmount = currentSubtotal + shieldFee + currentGst;

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleInitiateOrder = () => {
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header
        onOpenCart={() => setIsCheckoutOpen(true)}
        cartCount={isCheckoutOpen ? 1 : 0}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
        
        {/* Back Link & Breadcrumb */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Panipat Lots</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="bg-slate-200 px-2 py-0.5 rounded font-mono text-[11px] font-bold text-slate-700">
              Lot #{bale.id}
            </span>
            <span>•</span>
            <span className="capitalize">{bale.categoryLabel || bale.category}</span>
          </div>
        </div>

        {/* 2-Column Split: Media Gallery Left & Pricing Box Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Media Gallery */}
          <div className="lg:col-span-7 space-y-4">
            
            <div className="bg-black rounded-2xl overflow-hidden shadow-md relative aspect-4/3 sm:aspect-16/10 flex items-center justify-center border border-slate-800">
              {activeMediaTab === 'video' ? (
                <div className="relative w-full h-full group">
                  <video
                    ref={videoRef}
                    src={videoUrl}
                    poster={bale.thumbnailUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={handleVideoToggle}
                  />

                  <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                    <span className="bg-rose-800/90 text-white font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-xs uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Yard QC Video
                    </span>
                    <span className="bg-slate-900/80 backdrop-blur-xs text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-700">
                      Uncut 30s Inspection
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={handleMuteToggle}
                      className="p-2 rounded-full bg-slate-900/80 backdrop-blur-xs text-white hover:bg-slate-800 transition-colors border border-slate-700 shadow-xs"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                  </div>

                  {!isPlaying && (
                    <button
                      onClick={handleVideoToggle}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-slate-900/80 text-white flex items-center justify-center backdrop-blur-xs hover:scale-105 transition-transform"
                    >
                      <Play className="w-6 h-6 ml-0.5 text-amber-400 fill-amber-400" />
                    </button>
                  )}

                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 pt-8 flex items-center justify-between text-white text-xs">
                    <div className="flex items-center gap-2">
                      <Film className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-semibold text-xs">{bale.title}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">
                      Gross: {bale.weightKg}kg | {bale.estimatedPieceCount} Pcs
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full bg-slate-900">
                  <Image
                    src={images[activeImageIndex] || bale.thumbnailUrl}
                    alt={bale.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-contain"
                  />
                </div>
              )}
            </div>

            {/* Media Selector Tabs & Thumbnails */}
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              <button
                onClick={() => setActiveMediaTab('video')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                  activeMediaTab === 'video'
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Play className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Godown Video (30s)</span>
              </button>

              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveMediaTab('images');
                    setActiveImageIndex(idx);
                  }}
                  className={`relative w-14 h-11 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    activeMediaTab === 'images' && activeImageIndex === idx
                      ? 'border-amber-500 scale-105 shadow-xs'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumb ${idx + 1}`}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Yard Quality Specification Grid */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
              <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-700" />
                <span>Panipat Yard Quality Specification & Inspection Metrics</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-semibold">Total Gross Weight</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{bale.weightKg} KG</div>
                  <div className="text-[10px] text-slate-600 font-medium mt-0.5">Sealed Iron Hoop Bale</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-semibold">Est. Pieces</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{bale.estimatedPieceCount} Pcs</div>
                  <div className="text-[10px] text-slate-600 font-medium mt-0.5">Wholesale Assorted</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-semibold">Quality Grade</div>
                  <div className="text-sm font-bold text-emerald-800 mt-0.5">{bale.gradeBreakdown?.gradeA || 75}% Grade A</div>
                  <div className="text-[10px] text-slate-600 font-medium mt-0.5">Zero Tears / Vetted</div>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-semibold">Origin Country</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">{bale.originFlag} {bale.originCountry}</div>
                  <div className="text-[10px] text-slate-600 font-medium mt-0.5">Customs Cleared</div>
                </div>
              </div>

              {/* Description */}
              <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 leading-relaxed space-y-2">
                <p className="font-semibold text-slate-900">Lot Description & Packing Breakdown:</p>
                <p>{bale.shortDescription}</p>
                <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-[11px] text-amber-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-amber-950">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>SourcePanipat Quality & Tare Weight Guarantee</span>
                  </div>
                  <p className="leading-snug">
                    Bale tare weight is audited by independent Panipat field coordinators before transport dispatch. If delivered weight deviates by &gt;1.5%, differential amount is auto-refunded to buyer escrow wallet.
                  </p>
                </div>
              </div>
            </div>

            {/* Verified Seller Godown Info */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-sm shrink-0 border border-slate-800">
                  {bale.seller?.maskedCode || '#PNP-001'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">Godown {bale.seller?.maskedCode || '#PNP-001'}</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Verified Yard
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {bale.seller?.godownZone || 'Sanoli Road Godown Hub'}
                    </span>
                    <span>•</span>
                    <span className="text-amber-800 font-semibold">{bale.seller?.rating || 4.9} ★ ({bale.seller?.totalDispatchedBales || 140}+ Bales)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                  Direct Godown Gate Dispatch
                </span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Sourcing Box */}
          <div className="lg:col-span-5 space-y-4">
            
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md space-y-5 sticky top-20">
              
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                    {bale.categoryLabel || bale.category}
                  </span>
                  <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    In Godown Stock
                  </span>
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 leading-tight">
                  {bale.title}
                </h1>
                <div className="text-xs text-slate-500 mt-1 flex items-center gap-3">
                  <span>{bale.seller?.godownZone || 'Panipat Hub'}</span>
                  <span>•</span>
                  <span>Est. {bale.estimatedPieceCount} Total Pcs</span>
                </div>
              </div>

              {/* Sourcing Mode Switcher */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-800 block">
                  Select Sourcing Format:
                </label>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={bale.sourcingMode === 'pieces_only'}
                    onClick={() => setSelectedBuyMode('sealed_bale')}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      selectedBuyMode === 'sealed_bale'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : bale.sourcingMode === 'pieces_only'
                        ? 'opacity-40 bg-slate-50 border-slate-200 cursor-not-allowed text-slate-400'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>Sealed Bale</span>
                      {selectedBuyMode === 'sealed_bale' && (
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </div>
                    <div className="text-sm font-black mt-1">
                      {formatINR(bale.sealedBalePrice)}
                    </div>
                    <div className={`text-[10px] mt-0.5 ${selectedBuyMode === 'sealed_bale' ? 'text-slate-300' : 'text-slate-500'}`}>
                      Full {bale.weightKg}kg Lot
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={bale.sourcingMode === 'bale_only'}
                    onClick={() => setSelectedBuyMode('curated_lot')}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      selectedBuyMode === 'curated_lot'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                        : bale.sourcingMode === 'bale_only'
                        ? 'opacity-40 bg-slate-50 border-slate-200 cursor-not-allowed text-slate-400'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
                    }`}
                  >
                    <div className="text-xs font-bold flex items-center justify-between">
                      <span>Curated Pieces</span>
                      {selectedBuyMode === 'curated_lot' && (
                        <Check className="w-3.5 h-3.5 text-amber-400" />
                      )}
                    </div>
                    <div className="text-sm font-black mt-1">
                      ₹{bale.curatedPiecePrice}<span className="text-[10px] font-normal">/pc</span>
                    </div>
                    <div className={`text-[10px] mt-0.5 ${selectedBuyMode === 'curated_lot' ? 'text-slate-300' : 'text-slate-500'}`}>
                      MOQ: {bale.curatedMoq || 25} Pcs
                    </div>
                  </button>
                </div>
              </div>

              {/* Quantity Configuration Area */}
              {selectedBuyMode === 'sealed_bale' ? (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Number of Sealed Bales:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setBaleQuantity(Math.max(1, baleQuantity - 1))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-slate-900">{baleQuantity}</span>
                      <button
                        onClick={() => setBaleQuantity(baleQuantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span>Total Weight: {totalBalesWeight} KG</span>
                    <span className="font-mono font-bold text-slate-900">{formatINR(sealedBaleTotal)}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">Quantity (Pieces):</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCuratedPieces(Math.max(bale.curatedMoq || 25, curatedPieces - 5))}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-bold text-slate-900">{curatedPieces}</span>
                      <button
                        onClick={() => setCuratedPieces(curatedPieces + 5)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-300 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span>Rate: ₹{bale.curatedPiecePrice}/pc (Grade A)</span>
                    <span className="font-mono font-bold text-slate-900">{formatINR(curatedLotTotal)}</span>
                  </div>
                </div>
              )}

              {/* ₹1,000 Inspection Shield Opt-In */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="shieldCheck"
                      checked={includeShield}
                      onChange={(e) => setIncludeShield(e.target.checked)}
                      className="mt-0.5 rounded border-emerald-400 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <label htmlFor="shieldCheck" className="text-xs font-bold text-emerald-950 cursor-pointer">
                      ₹1,000 Verified QC & Tare Shield
                    </label>
                  </div>
                  <span className="text-xs font-bold text-emerald-800 shrink-0">
                    +₹1,000
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-snug pl-5">
                  Includes physical scale tare weighment photo, Bilti transport receipt scan, and 100% money-back escrow protection before dispatch.
                </p>
              </div>

              {/* Pricing Breakdown Summary */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 text-xs">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Inventory Subtotal:</span>
                  <span className="font-semibold text-slate-900">{formatINR(currentSubtotal)}</span>
                </div>

                {includeShield && (
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Inspection Shield Fee:</span>
                    <span className="font-semibold text-emerald-800">₹1,000</span>
                  </div>
                )}

                <div className="flex items-center justify-between text-slate-600">
                  <span>GST (5% Textile Wholesale):</span>
                  <span className="font-semibold text-slate-900">{formatINR(currentGst)}</span>
                </div>

                <div className="flex items-center justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Escrow Lock Amount:</span>
                  <span className="text-base font-black text-slate-950 font-mono">
                    {formatINR(finalTotalAmount)}
                  </span>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleInitiateOrder}
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  <Lock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Lock & Buy via Escrow ({formatINR(finalTotalAmount)})</span>
                </button>

                <div className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Funds held in ICICI Nodal Escrow until transport Bilti verification</span>
                </div>
              </div>

              {/* Direct Trader WhatsApp Desk */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-500">
                  Have questions about this lot?
                </div>
                <a
                  href={`https://wa.me/919876543210?text=Hi%20SourcePanipat,%20I%20am%20interested%20in%20Lot%20${bale.id}:%20${encodeURIComponent(bale.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Panipat Trader Desk</span>
                </a>
              </div>

            </div>

          </div>

        </div>

      </main>

      {/* Global Modals */}
      {selectedPreviewBale && (
        <VideoGradeModal
          bale={selectedPreviewBale}
          onClose={() => setSelectedPreviewBale(null)}
          onProceedToEscrow={() => {
            setSelectedPreviewBale(null);
            setIsCheckoutOpen(true);
          }}
        />
      )}

      {isCheckoutOpen && (
        <EscrowCheckoutDrawer
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          bale={bale}
          initialMode={selectedBuyMode}
          initialBaleQty={baleQuantity}
          initialCuratedPieces={curatedPieces}
          initialInspectionShield={includeShield}
        />
      )}

      <Footer />
    </div>
  );
}
