'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { VideoGradeModal } from '@/components/VideoGradeModal';
import { EscrowCheckoutDrawer } from '@/components/EscrowCheckoutDrawer';
import { Footer } from '@/components/Footer';
import { SquareLoader } from '@/components/SquareLoader';
import { MOCK_BALES, getBaleBySlug } from '@/lib/mock-catalog';
import { BuyMode, BaleListing, BuyerUser } from '@/types';
import { formatINR } from '@/lib/utils';
import { getFormattedSellerName } from '@/lib/format-seller';
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
  Layers,
  MessageCircle,
  Tag,
  Users,
  Sparkles
} from 'lucide-react';


interface BaleClientPageProps {
  slug: string;
}

export function BaleClientPage({ slug }: BaleClientPageProps) {
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const bale = getBaleBySlug(slug) || MOCK_BALES[0];

  useEffect(() => {
    // Dynamic smooth transition loader (650ms)
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 650);
    return () => clearTimeout(timer);
  }, [slug]);

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

  const videoClips = (bale.videoClips && bale.videoClips.length > 0) ? bale.videoClips : [];
  const hasVideos = videoClips.length > 0;
  const images = (bale.galleryImages && bale.galleryImages.length > 0) ? bale.galleryImages : [bale.thumbnailUrl];

  // Video Player & Media Tab Control State
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'images'>(hasVideos ? 'video' : 'images');
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  const currentVideoUrl = hasVideos && videoClips[activeVideoIndex] ? videoClips[activeVideoIndex].videoUrl : '';

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

  if (isPageLoading) {
    return <SquareLoader fullScreen={true} />;
  }


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

          {/* LEFT COLUMN: OLX Standard 16:9 Fixed Media Viewer */}
          <div className="lg:col-span-7 space-y-3">

            {/* Main 16:9 Fixed Viewer with Solid Black Letterbox Space (OLX Standard) */}
            <div className="bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-md relative aspect-video w-full flex items-center justify-center border border-slate-800 group select-none">

              {activeMediaTab === 'video' && hasVideos ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  <video
                    ref={videoRef}
                    key={currentVideoUrl}
                    src={currentVideoUrl}
                    poster={bale.thumbnailUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="max-w-full max-h-full object-contain mx-auto cursor-pointer"
                    onClick={handleVideoToggle}
                  />

                  {/* Top Left Minimal Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
                    <span className="bg-rose-600 text-white font-bold text-[10px] px-2 py-0.5 rounded flex items-center gap-1 shadow-xs uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {videoClips.length > 1 ? `Video ${activeVideoIndex + 1}` : 'Godown Video'}
                    </span>
                    <span className="bg-black/75 text-slate-200 text-[10px] font-medium px-2 py-0.5 rounded border border-slate-700">
                      30s Uncut
                    </span>
                  </div>

                  {/* Top Right Controls */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={handleMuteToggle}
                      className="p-2 rounded-full bg-black/70 hover:bg-black text-white transition-colors border border-white/20 shadow-xs"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
                    </button>

                    <button
                      onClick={() => setSelectedPreviewBale(bale)}
                      className="px-2.5 py-1.5 rounded-full bg-black/70 hover:bg-black text-white text-[11px] font-bold transition-colors border border-white/20 shadow-xs flex items-center gap-1"
                      title="Enlarge 16:9 Viewer"
                    >
                      <Film className="w-3.5 h-3.5 text-amber-400" />
                      <span>Full View</span>
                    </button>
                  </div>

                  {/* Play / Pause overlay */}
                  {!isPlaying && (
                    <button
                      onClick={handleVideoToggle}
                      className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/80 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg border border-white/20"
                    >
                      <Play className="w-6 h-6 ml-0.5 text-amber-400 fill-amber-400" />
                    </button>
                  )}
                </div>
              ) : (
                <div
                  className="relative w-full h-full flex items-center justify-center bg-black cursor-pointer"
                  onClick={() => setSelectedPreviewBale(bale)}
                >
                  <img
                    src={images[activeImageIndex] || bale.thumbnailUrl}
                    alt={bale.title}
                    className="max-w-full max-h-full object-contain mx-auto select-none"
                  />

                  {/* OLX Style Left / Right Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all border border-white/20 shadow-lg"
                        title="Previous Photo"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveImageIndex((prev) => (prev + 1) % images.length);
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all border border-white/20 shadow-lg"
                        title="Next Photo"
                      >
                        <ArrowLeft className="w-5 h-5 rotate-180" />
                      </button>
                    </>
                  )}

                  {/* Photo Counter */}
                  <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[11px] font-mono px-2.5 py-1 rounded-full border border-white/20 shadow-xs">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </div>
              )}
            </div>

            {/* Amazon-Style Visual Thumbnail Grid (No Long Text Titles) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">

              {/* Video Visual Thumbnails */}
              {videoClips.map((clip, vIdx) => {
                const isSelected = activeMediaTab === 'video' && activeVideoIndex === vIdx;
                return (
                  <button
                    key={`clip-${clip.id || vIdx}`}
                    onClick={() => {
                      setActiveMediaTab('video');
                      setActiveVideoIndex(vIdx);
                      setIsPlaying(true);
                    }}
                    className={`relative w-14 sm:w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all bg-black flex flex-col items-center justify-center group ${isSelected
                        ? 'border-amber-500 scale-105 shadow-md ring-2 ring-amber-400 ring-offset-1'
                        : 'border-slate-300 opacity-80 hover:opacity-100'
                      }`}
                    title={`Video ${vIdx + 1}`}
                  >
                    <img
                      src={bale.thumbnailUrl}
                      alt={`Video ${vIdx + 1}`}
                      className="w-full h-full object-cover opacity-60"
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 group-hover:bg-black/10">
                      <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs">
                        <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                      </div>
                      <span className="text-[8px] font-black text-white uppercase tracking-wider mt-0.5 drop-shadow">
                        VIDEO {videoClips.length > 1 ? vIdx + 1 : ''}
                      </span>
                    </div>
                  </button>
                );
              })}

              {/* Photo Visual Thumbnails */}
              {images.map((img, idx) => {
                const isSelected = activeMediaTab === 'images' && activeImageIndex === idx;
                return (
                  <button
                    key={`photo-${idx}`}
                    onClick={() => {
                      setActiveMediaTab('images');
                      setActiveImageIndex(idx);
                    }}
                    className={`relative w-14 sm:w-16 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all bg-black ${isSelected
                        ? 'border-amber-500 scale-105 shadow-md ring-2 ring-amber-400 ring-offset-1'
                        : 'border-slate-300 opacity-70 hover:opacity-100'
                      }`}
                    title={`Photo ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
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
                  <p className="leading-snug">
                    Bale tare weight is audited by independent Panipat field coordinators before transport dispatch. If delivered weight deviates by &gt;1.5%, differential amount is auto-refunded to buyer escrow wallet.
                  </p>

                </div>
              </div>
            </div>

            {/* Key Lot Attributes & Composition */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-3">
              <h2 className="font-bold text-sm text-slate-900">
                Key Lot Attributes & Composition
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                  <div className="text-[11px] text-slate-500 font-medium">Garment Type</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                    {bale.garmentType || 'Jackets & Outerwear'}
                  </div>
                </div>

                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                  <div className="text-[11px] text-slate-500 font-medium">Target Gender</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5">
                    {bale.targetGender || 'Unisex / Adult'}
                  </div>
                </div>

                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/60">
                  <div className="text-[11px] text-slate-500 font-medium">Primary Fabric / Material</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 truncate">
                    {bale.primaryFabric || bale.fabricComposition || '100% Export Mix'}
                  </div>
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
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-slate-900">
                      {getFormattedSellerName(bale.seller?.fullName, bale.seller?.maskedCode)}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      100% Escrow & Tare Weight Protected
                    </span>
                    <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded flex items-center gap-1">
                      <span>★</span>
                      <span>{bale.seller?.trustScore || 100}% Trust</span>
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {bale.seller?.godownZone ? `${bale.seller.godownZone}, Panipat` : 'Sanoli Road Godown Hub, Panipat'}
                    </span>
                    <span>•</span>
                    <span className="text-amber-800 font-semibold">{bale.seller?.rating || 4.9} ★ ({bale.seller?.totalDispatchedBales || 140}+ Bales)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
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
                    className={`p-3 rounded-xl border text-left transition-all relative ${selectedBuyMode === 'sealed_bale'
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
                    className={`p-3 rounded-xl border text-left transition-all relative ${selectedBuyMode === 'curated_lot'
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

              {/* Primary & Secondary Action Buttons */}
              <div className="space-y-2.5 pt-1">
                <button
                  onClick={handleInitiateOrder}
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  <Lock className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span>Lock & Buy via Escrow ({formatINR(finalTotalAmount)})</span>
                </button>

                <a
                  href={`https://wa.me/918950202286?text=${encodeURIComponent(
                    `Hi SourcePanipat Desk, I have a question regarding Lot #${bale.id} (${bale.title}) from ${getFormattedSellerName(bale.seller?.fullName, bale.seller?.maskedCode)}: `
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-medium transition text-sm shadow-xs"
                >

                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Inquire About This Lot (Ground Desk)</span>
                </a>

                <div className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5 pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Funds held in ICICI Nodal Escrow until transport Bilti verification</span>
                </div>
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
