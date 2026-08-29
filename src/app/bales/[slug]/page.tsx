'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { VideoGradeModal } from '@/components/VideoGradeModal';
import { EscrowCheckoutDrawer } from '@/components/EscrowCheckoutDrawer';
import { AuthModal } from '@/components/AuthModal';
import { Footer } from '@/components/Footer';
import { MOCK_BALES, getBaleBySlug } from '@/lib/mock-catalog';
import { BuyMode, BaleListing, BuyerUser } from '@/types';
import { formatINR } from '@/lib/utils';
import { 
  ShieldCheck, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ArrowLeft, 
  Lock, 
  Check, 
  Phone,
  Building,
  Film,
  Camera,
  Layers,
  Sparkles
} from 'lucide-react';

interface BalePageProps {
  params: {
    slug: string;
  };
}

export default function BaleDetailPage({ params }: BalePageProps) {
  const bale = getBaleBySlug(params.slug);

  if (!bale) {
    notFound();
  }

  // Interactive Sourcing State (Set initial mode according to listing's sourcingMode)
  const initialBuyMode: BuyMode = 
    bale.sourcingMode === 'pieces_only' ? 'curated_lot' : 'sealed_bale';

  const [selectedBuyMode, setSelectedBuyMode] = useState<BuyMode>(initialBuyMode);
  const [baleQuantity, setBaleQuantity] = useState<number>(1);
  const [curatedPieces, setCuratedPieces] = useState<number>(bale.curatedMoq);
  const [includeShield, setIncludeShield] = useState<boolean>(true);
  
  // Modals & Auth Gate State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<BuyerUser | null>(null);
  const [selectedPreviewBale, setSelectedPreviewBale] = useState<BaleListing | null>(null);

  // Check user session
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sp_buyer_user');
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  // Multi-Media Gallery State: (2 Videos + 2 Photos)
  const mediaItems = useMemo(() => {
    const items = [];
    if (bale.videoClips[0]) {
      items.push({
        id: 'vid-1',
        type: 'video' as const,
        title: '30s Raw Opening Inspection',
        sub: 'Grade A Sample Check',
        url: bale.videoClips[0].videoUrl,
        clip: bale.videoClips[0],
      });
    }
    if (bale.videoClips[1]) {
      items.push({
        id: 'vid-2',
        type: 'video' as const,
        title: '30s Godown Lot Walk-Through',
        sub: 'Stock & Strapping Bay',
        url: bale.videoClips[1].videoUrl,
        clip: bale.videoClips[1],
      });
    }
    if (bale.galleryImages[0]) {
      items.push({
        id: 'img-1',
        type: 'image' as const,
        title: 'High-Res Bale Photo',
        sub: 'Front Facing Stack',
        url: bale.galleryImages[0],
      });
    }
    if (bale.galleryImages[1]) {
      items.push({
        id: 'img-2',
        type: 'image' as const,
        title: 'Lot Tag & Texture Detail',
        sub: 'Close-Up Material',
        url: bale.galleryImages[1],
      });
    }
    return items;
  }, [bale]);

  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentMedia = mediaItems[activeMediaIndex] || mediaItems[0];

  useEffect(() => {
    if (currentMedia.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [activeMediaIndex, currentMedia]);

  // Pricing calculations
  const isSealed = selectedBuyMode === 'sealed_bale';
  const subtotal = isSealed
    ? bale.sealedBalePrice * baleQuantity
    : bale.curatedPiecePrice * curatedPieces;
  const shieldFee = includeShield ? 1000 : 0;
  const platformFee = 0;
  const totalPayable = subtotal + shieldFee + platformFee;
  const avgPiecePrice = Math.round(bale.sealedBalePrice / bale.estimatedPieceCount);

  // Relevant keyword & category matching lots
  const relatedLots = useMemo(() => {
    const others = MOCK_BALES.filter((b) => b.id !== bale.id);
    return others
      .map((item) => {
        let score = 0;
        if (item.category === bale.category) score += 10;
        if (item.originCountry === bale.originCountry) score += 5;
        if (item.seller.id === bale.seller.id) score += 3;
        const commonTags = item.tags.filter((t) => bale.tags.includes(t));
        score += commonTags.length * 2;
        return { item, score };
      })
      .sort((a, b) => b.score - a.score)
      .map((r) => r.item)
      .slice(0, 4);
  }, [bale]);

  const handleProceedToCheckout = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sp_buyer_user');
      if (!stored) {
        setIsAuthOpen(true);
        return;
      }
    }
    setIsCheckoutOpen(true);
  };

  const handleAuthSuccess = (user: BuyerUser) => {
    setCurrentUser(user);
    setIsCheckoutOpen(true);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Global Header */}
      <Header cartCount={isCheckoutOpen ? 1 : 0} onOpenCart={() => setIsCheckoutOpen(true)} />

      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-500">
            <Link href="/" className="hover:text-slate-900 flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Marketplace</span>
            </Link>
            <span>/</span>
            <span className="text-slate-800">{bale.categoryLabel}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <span>Godown: <strong>{bale.seller.maskedCode}</strong> ({bale.seller.godownZone})</span>
          </div>
        </div>
      </div>

      {/* Main Content (Clean 2-Column Layout) */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: Media Gallery & Technical Specifications (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* 1. Multi-Media Gallery Player (2 Videos + 2 Photos) */}
            <div className="rounded-lg bg-white border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                  {currentMedia.type === 'video' ? (
                    <Film className="w-3.5 h-3.5 text-amber-600" />
                  ) : (
                    <Camera className="w-3.5 h-3.5 text-slate-600" />
                  )}
                  <span>{currentMedia.title}</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  Batch: {bale.godownBatchId}
                </span>
              </div>

              {/* Main Media Viewer Frame */}
              <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
                {currentMedia.type === 'video' ? (
                  <>
                    <video
                      ref={videoRef}
                      src={currentMedia.url}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                      muted={isMuted}
                      loop
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                    />

                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900/85 text-white text-[11px] font-semibold flex items-center gap-1">
                      <Film className="w-3 h-3 text-amber-400" />
                      <span>30s Godown Video</span>
                    </div>

                    {/* Audio & Playback Controls */}
                    <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-auto">
                      <button
                        onClick={togglePlay}
                        className="p-1.5 rounded bg-black/70 hover:bg-black text-white backdrop-blur-xs transition-colors"
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                      </button>

                      <button
                        onClick={toggleMute}
                        className="p-1.5 rounded bg-black/70 hover:bg-black text-white backdrop-blur-xs transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={currentMedia.url}
                      alt={currentMedia.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900/85 text-white text-[11px] font-semibold flex items-center gap-1">
                      <Camera className="w-3 h-3 text-emerald-400" />
                      <span>High-Res Godown Photo</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 4 Media Gallery Switcher Tabs (2 Videos + 2 Photos) */}
              <div className="p-3 bg-white border-t border-slate-200">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {mediaItems.map((item, idx) => {
                    const isActive = activeMediaIndex === idx;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveMediaIndex(idx)}
                        className={`p-2 rounded border text-left transition-colors flex flex-col justify-between ${
                          isActive
                            ? 'bg-slate-900 border-slate-900 text-white'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="truncate">
                            {item.type === 'video' ? `Video ${idx + 1}` : `Photo ${idx - 1}`}
                          </span>
                          <span className={`text-[10px] ${isActive ? 'text-amber-400' : 'text-slate-500'}`}>
                            {item.type === 'video' ? '30s' : 'HD'}
                          </span>
                        </div>
                        <p className={`text-[10px] truncate mt-1 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                          {item.title}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Inspector Notes */}
                <div className="mt-3 p-3 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700">
                  <div className="font-semibold text-slate-900 mb-1">
                    Quality Grading Overview ({bale.originCountry}):
                  </div>
                  <p className="leading-relaxed text-slate-600">
                    {bale.videoClips[0]?.description || bale.shortDescription}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {bale.videoClips[0]?.conditionNotes.map((note, nIdx) => (
                      <span
                        key={nIdx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white text-[10.5px] text-slate-600 border border-slate-200 font-medium"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        {note}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Technical Specifications Table (IndiaMART Standard) */}
            <div className="rounded-lg bg-white border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Product & Lot Specifications
                </h3>
              </div>

              <div className="divide-y divide-slate-200 text-xs">
                <div className="grid grid-cols-3 px-4 py-2.5 bg-white">
                  <span className="text-slate-500 font-medium">Bale Category</span>
                  <span className="col-span-2 text-slate-900 font-semibold">{bale.categoryLabel}</span>
                </div>
                <div className="grid grid-cols-3 px-4 py-2.5 bg-slate-50/50">
                  <span className="text-slate-500 font-medium">Sourcing Mode</span>
                  <span className="col-span-2 text-slate-900 font-semibold uppercase">
                    {bale.sourcingMode === 'both' ? 'Bulk Bale + Curated Lots' : bale.sourcingMode.replace('_', ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-3 px-4 py-2.5 bg-white">
                  <span className="text-slate-500 font-medium">Country of Origin</span>
                  <span className="col-span-2 text-slate-900 font-semibold">{bale.originCountry}</span>
                </div>
                <div className="grid grid-cols-3 px-4 py-2.5 bg-slate-50/50">
                  <span className="text-slate-500 font-medium">Gross Weight</span>
                  <span className="col-span-2 text-slate-900 font-semibold">{bale.weightKg} KG Steel-Strapped</span>
                </div>
                <div className="grid grid-cols-3 px-4 py-2.5 bg-white">
                  <span className="text-slate-500 font-medium">Estimated Pieces</span>
                  <span className="col-span-2 text-slate-900 font-semibold">~{bale.estimatedPieceCount} Pieces</span>
                </div>
                <div className="grid grid-cols-3 px-4 py-2.5 bg-slate-50/50">
                  <span className="text-slate-500 font-medium">Fabric Composition</span>
                  <span className="col-span-2 text-slate-900">{bale.fabricComposition}</span>
                </div>
                <div className="grid grid-cols-3 px-4 py-2.5 bg-white">
                  <span className="text-slate-500 font-medium">Quality Breakdown</span>
                  <span className="col-span-2 text-slate-900 font-medium">
                    Grade A: {bale.gradeBreakdown.gradeA}% • Grade B: {bale.gradeBreakdown.gradeB}% • Grade C: {bale.gradeBreakdown.gradeC}%
                  </span>
                </div>
                <div className="grid grid-cols-3 px-4 py-2.5 bg-slate-50/50">
                  <span className="text-slate-500 font-medium">Expected Resale Margin</span>
                  <span className="col-span-2 text-emerald-700 font-semibold">{bale.expectedGrossMargin}</span>
                </div>
                <div className="grid grid-cols-3 px-4 py-2.5 bg-white">
                  <span className="text-slate-500 font-medium">Godown Hub Location</span>
                  <span className="col-span-2 text-slate-900">{bale.seller.godownZone}, Panipat</span>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Pricing, Sourcing Mode Selector & Escrow Checkout (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Title & Price Header Card */}
            <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {bale.seller.maskedCode}
                </span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified QC Inspection
                </span>
              </div>

              <h1 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {bale.title}
              </h1>

              {/* Dynamic Price Display */}
              <div className="pt-1 flex items-baseline gap-2">
                {bale.sourcingMode === 'pieces_only' ? (
                  <>
                    <span className="text-2xl font-black text-slate-900">
                      {formatINR(bale.curatedPiecePrice)}
                    </span>
                    <span className="text-xs text-slate-500">
                      / piece (MOQ {bale.curatedMoq} pcs)
                    </span>
                  </>
                ) : bale.sourcingMode === 'bale_only' ? (
                  <>
                    <span className="text-2xl font-black text-slate-900">
                      {formatINR(bale.sealedBalePrice)}
                    </span>
                    <span className="text-xs text-slate-500">
                      per {bale.weightKg}kg bale (~{formatINR(avgPiecePrice)}/pc)
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl font-black text-slate-900">
                      {formatINR(isSealed ? bale.sealedBalePrice : bale.curatedPiecePrice)}
                    </span>
                    <span className="text-xs text-slate-500">
                      {isSealed 
                        ? `per ${bale.weightKg}kg bale (~${formatINR(avgPiecePrice)}/pc)` 
                        : `/ piece (MOQ ${bale.curatedMoq} pcs)`}
                    </span>
                  </>
                )}
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {bale.shortDescription}
              </p>
            </div>

            {/* Dynamic Sourcing Mode Selector */}
            <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {bale.sourcingMode === 'both'
                  ? 'Select Sourcing Mode'
                  : bale.sourcingMode === 'bale_only'
                  ? 'Bulk Sealed Bale Pricing'
                  : 'Curated Hand-Picked Pieces'}
              </div>

              {bale.sourcingMode === 'both' && (
                <div className="space-y-2">
                  {/* Mode 1: Sealed Bale */}
                  <div
                    onClick={() => setSelectedBuyMode('sealed_bale')}
                    className={`cursor-pointer p-3 rounded-lg border flex items-center justify-between transition-colors ${
                      isSealed ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSealed ? 'border-slate-900 bg-slate-900' : 'border-slate-300'}`}>
                        {isSealed && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Sealed Bulk Bale ({bale.weightKg} KG)</div>
                        <div className="text-[11px] text-slate-500">Standard wholesale bale • ~{bale.estimatedPieceCount} pcs</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">{formatINR(bale.sealedBalePrice)}</span>
                  </div>

                  {/* Mode 2: Curated Lot */}
                  <div
                    onClick={() => setSelectedBuyMode('curated_lot')}
                    className={`cursor-pointer p-3 rounded-lg border flex items-center justify-between transition-colors ${
                      !isSealed ? 'border-slate-900 bg-slate-50' : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${!isSealed ? 'border-slate-900 bg-slate-900' : 'border-slate-300'}`}>
                        {!isSealed && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">Hand-Picked Curated Lot</div>
                        <div className="text-[11px] text-slate-500">Selected pieces • MOQ {bale.curatedMoq} pcs</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">{formatINR(bale.curatedPiecePrice)}/pc</span>
                  </div>
                </div>
              )}

              {/* Quantity Controls */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  {isSealed ? 'Bale Quantity:' : 'Number of Pieces:'}
                </span>

                <div className="flex items-center gap-2">
                  {isSealed ? (
                    <div className="flex items-center border border-slate-300 rounded overflow-hidden">
                      <button
                        onClick={() => setBaleQuantity(Math.max(1, baleQuantity - 1))}
                        className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 font-bold text-slate-900">{baleQuantity}</span>
                      <button
                        onClick={() => setBaleQuantity(baleQuantity + 1)}
                        className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold"
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center border border-slate-300 rounded overflow-hidden">
                      <button
                        onClick={() => setCuratedPieces(Math.max(bale.curatedMoq, curatedPieces - 5))}
                        className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold"
                      >
                        -5
                      </button>
                      <span className="px-3 py-1 font-bold text-slate-900">{curatedPieces}</span>
                      <button
                        onClick={() => setCuratedPieces(curatedPieces + 5)}
                        className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold"
                      >
                        +5
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Inspection Shield Checkbox Box */}
            <div
              onClick={() => setIncludeShield(!includeShield)}
              className={`cursor-pointer p-3.5 rounded-lg border transition-colors ${
                includeShield ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 bg-white'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={includeShield}
                    onChange={() => {}}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      Add ₹1,000 Verified Inspection Shield
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      On-ground tare scale audit + 5-min live video coordinator before transport loading.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 shrink-0">+₹1,000</span>
              </div>
            </div>

            {/* Escrow Fee Summary & Checkout Action */}
            <div className="p-4 rounded-lg bg-white border border-slate-200 shadow-sm space-y-3">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Lot Subtotal:</span>
                  <span className="font-semibold text-slate-900">{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Inspection Shield Fee:</span>
                  <span className={includeShield ? 'font-semibold text-emerald-700' : 'text-slate-400'}>
                    {includeShield ? '+₹1,000' : '₹0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Fee:</span>
                  <span className="font-semibold text-emerald-700">₹0 (Waived)</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Total Payable in Escrow:</span>
                  <span className="text-xl font-bold text-slate-900">{formatINR(totalPayable)}</span>
                </div>
              </div>

              {/* Action Buttons with Auth Gate */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full py-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Lock className="w-4 h-4" />
                  <span>Proceed to Escrow Checkout</span>
                </button>

                <a
                  href={`https://wa.me/919876543210?text=Hi%20SourcePanipat,%20I%20want%20to%20inquire%20about%20${encodeURIComponent(bale.title)}%20(Lot%20${bale.id})`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center justify-center gap-1.5 border border-slate-300 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Inquire via WhatsApp Desk</span>
                </a>
              </div>

              <p className="text-[10px] text-slate-500 text-center leading-tight">
                Funds are held in ICICI Nodal Escrow and released only upon transport Bilti validation.
              </p>
            </div>

          </div>

        </div>

        {/* Relevant Matching Lots (Same 1:1 Square Card as Home Page in 4-Column Grid) */}
        <section className="mt-12 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Similar Panipat Lots in {bale.categoryLabel}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Related wholesale bales & lots with matching origin ({bale.originCountry}) and quality grading
              </p>
            </div>
            <Link href="/" className="text-xs font-semibold text-slate-700 hover:text-slate-900">
              View All Bales →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {relatedLots.map((relBale) => (
              <ProductCard
                key={relBale.id}
                bale={relBale}
                onPreviewVideo={(previewBale) => setSelectedPreviewBale(previewBale)}
              />
            ))}
          </div>
        </section>
      </main>

      {/* Video Preview Modal for Related Cards */}
      <VideoGradeModal
        bale={selectedPreviewBale}
        onClose={() => setSelectedPreviewBale(null)}
        onProceedToEscrow={(previewBale) => {
          setSelectedPreviewBale(null);
          handleProceedToCheckout();
        }}
      />

      {/* Lean Auth Gate Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Escrow Checkout Drawer Modal */}
      <EscrowCheckoutDrawer
        bale={bale}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        initialMode={selectedBuyMode}
        initialBaleQty={baleQuantity}
        initialCuratedPieces={curatedPieces}
        initialInspectionShield={includeShield}
      />

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
