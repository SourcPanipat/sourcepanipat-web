'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SourcingMode, BaleListingItem } from '@/types';
import { 
  PlusCircle, 
  Upload, 
  Video, 
  Camera, 
  ArrowLeft, 
  Layers, 
  Film,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function NewListingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [masterCategory, setMasterCategory] = useState('winter-jackets-outerwear');
  const [subCategory, setSubCategory] = useState('heavy-puffers');
  const [sourcingMode, setSourcingMode] = useState<SourcingMode>('both');
  const [originCountry, setOriginCountry] = useState('South Korea');
  const [weightKg, setWeightKg] = useState<number>(80);
  const [estimatedPieces, setEstimatedPieces] = useState<number>(75);
  const [sealedPrice, setSealedPrice] = useState<number>(32000);
  const [curatedPiecePrice, setCuratedPiecePrice] = useState<number>(480);
  const [curatedMoq, setCuratedMoq] = useState<number>(25);
  const [inStockCount, setInStockCount] = useState<number>(5);

  // Quality Grades
  const [gradeA, setGradeA] = useState<number>(85);
  const [gradeB, setGradeB] = useState<number>(12);
  const [gradeC, setGradeC] = useState<number>(3);

  // Media
  const [video1Uploaded, setVideo1Uploaded] = useState(true);
  const [video2Uploaded, setVideo2Uploaded] = useState(true);
  const [photosUploaded, setPhotosUploaded] = useState(2);

  const categories = [
    {
      id: 'winter-jackets-outerwear',
      name: 'Winter Jackets & Outerwear',
      subs: [
        { id: 'heavy-puffers', name: 'Korean Heavy Puffers (Grade A)' },
        { id: 'leather-bombers', name: 'Leather Flight Bombers & Aviators' },
        { id: 'sherpa-truckers', name: 'Sherpa Lined Trucker Jackets' },
      ]
    },
    {
      id: 'fleece-sweatshirts',
      name: 'Fleece & Sweatshirts',
      subs: [
        { id: '450gsm-hoodies', name: '450 GSM Heavyweight Hoodies' },
        { id: 'graphic-crewnecks', name: 'Embroidered Graphic Crewnecks' },
      ]
    },
    {
      id: 'jeans-denim-workwear',
      name: 'Jeans & Denim Workwear',
      subs: [
        { id: 'heavy-duck-canvas', name: 'USA Heavy Duck Canvas & Chore Coats' },
        { id: '90s-baggy-denim', name: 'Vintage 90s Baggy Selvedge Denim' },
      ]
    },
    {
      id: 'overcoats-trench',
      name: 'Overcoats & Trench',
      subs: [
        { id: 'cashmere-overcoats', name: 'Cashmere & Merino Wool Overcoats' },
      ]
    },
    {
      id: 'home-furnishings-mink',
      name: 'Home Furnishings & Mink',
      subs: [
        { id: 'mink-blankets', name: 'Double-Ply Embossed Heavy Mink Blankets' },
      ]
    },
  ];

  const currentCategoryObj = categories.find((c) => c.id === masterCategory) || categories[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newLot: BaleListingItem = {
      id: `bale-${Date.now().toString().slice(-4)}`,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      sellerId: 'pnp-001',
      categoryId: masterCategory,
      subCategoryId: subCategory,
      categoryLabel: currentCategoryObj.name,
      title,
      shortDescription: shortDesc,
      sourcingMode,
      originCountry,
      originFlag: 'KR',
      thumbnailUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80',
      ],
      weightKg,
      estimatedPieceCount: estimatedPieces,
      sealedBalePrice: sealedPrice,
      curatedPiecePrice,
      curatedMoq,
      gradeA,
      gradeB,
      gradeC,
      videos: [
        {
          id: 'v1',
          type: 'opening_inspection',
          grade: 'Grade A',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          durationSeconds: 30,
          label: '30s Raw Opening Inspection',
          description: 'Live unboxing sample inspection.',
        }
      ],
      photos: [
        'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=800&q=80',
      ],
      godownBatchId: 'BATCH-SANOLI-2026-W09',
      qcVerified: true,
      inStockCount,
      fabricComposition: 'Heavyweight Winter Outerwear',
      expectedGrossMargin: '3.5x - 5.0x Margin',
      status: 'pending_approval', // Staging approval required!
      createdAt: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sp_seller_lots');
      const existing = stored ? JSON.parse(stored) : [];
      localStorage.setItem('sp_seller_lots', JSON.stringify([newLot, ...existing]));
    }

    setSubmittedSuccess(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push('/seller/listings');
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/seller/listings"
            className="p-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900">
              Create New Wholesale Godown Lot
            </h1>
            <p className="text-xs text-slate-500">
              List bulk sealed bales or curated handpicked lots for Pan-India boutique buyers
            </p>
          </div>
        </div>

        <span className="font-mono text-xs font-bold text-slate-800 bg-amber-100 border border-amber-300 px-2.5 py-1 rounded">
          Seller #PNP-001
        </span>
      </div>

      {/* Info Alert */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong className="block font-bold">Admin Verification Pipeline:</strong>
          Upon submitting, your lot enters <strong>Pending Approval</strong> state. Our Panipat team audits video clips and specs before publishing to the live marketplace feed.
        </div>
      </div>

      {/* Lot Form */}
      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        
        {/* Section 1: Classification & Sourcing Mode */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-slate-700" />
            <span>1. Category & Sourcing Mode Selection</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Master Category *
              </label>
              <select
                value={masterCategory}
                onChange={(e) => {
                  setMasterCategory(e.target.value);
                  const c = categories.find(cat => cat.id === e.target.value);
                  if (c && c.subs[0]) setSubCategory(c.subs[0].id);
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Wholesale Sub-Category *
              </label>
              <select
                value={subCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none cursor-pointer"
              >
                {currentCategoryObj.subs.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Sourcing Mode Selector */}
          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1.5">
              Lot Purchasing Mode (How can buyers purchase?) *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              
              <div
                onClick={() => setSourcingMode('bale_only')}
                className={`cursor-pointer p-3 rounded-lg border transition-colors ${
                  sourcingMode === 'bale_only'
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs">Bulk Bale Only</div>
                <div className={`text-[10px] mt-0.5 ${sourcingMode === 'bale_only' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Fixed 80kg/100kg whole strapped bale
                </div>
              </div>

              <div
                onClick={() => setSourcingMode('pieces_only')}
                className={`cursor-pointer p-3 rounded-lg border transition-colors ${
                  sourcingMode === 'pieces_only'
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs">Curated Pieces Only</div>
                <div className={`text-[10px] mt-0.5 ${sourcingMode === 'pieces_only' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Per-piece pricing with MOQ stepper
                </div>
              </div>

              <div
                onClick={() => setSourcingMode('both')}
                className={`cursor-pointer p-3 rounded-lg border transition-colors ${
                  sourcingMode === 'both'
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold text-xs">Both (Dual Mode)</div>
                <div className={`text-[10px] mt-0.5 ${sourcingMode === 'both' ? 'text-slate-300' : 'text-slate-500'}`}>
                  Allows whole bale OR curated lot orders
                </div>
              </div>

            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">
              Lot Title / Headline *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Korean Heavy Puffer Jackets (Grade A Cream Lot)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-700 block mb-1">
              Short Description & Quality Condition *
            </label>
            <textarea
              rows={2}
              required
              placeholder="High-density duck down and poly-fill puffers. Top Korean branded winter outerwear."
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
            />
          </div>

        </div>

        {/* Section 2: Weight, Pricing & MOQ */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
            <span>2. Lot Metrics & Wholesale Pricing</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Gross Weight (KG) *
              </label>
              <input
                type="number"
                required
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Estimated Pieces *
              </label>
              <input
                type="number"
                required
                value={estimatedPieces}
                onChange={(e) => setEstimatedPieces(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Origin Country *
              </label>
              <input
                type="text"
                required
                value={originCountry}
                onChange={(e) => setOriginCountry(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-slate-700 block mb-1">
                Bales in Stock *
              </label>
              <input
                type="number"
                required
                value={inStockCount}
                onChange={(e) => setInStockCount(Number(e.target.value))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            {(sourcingMode === 'bale_only' || sourcingMode === 'both') && (
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Whole Bale Price (₹ INR) *
                </label>
                <input
                  type="number"
                  required
                  value={sealedPrice}
                  onChange={(e) => setSealedPrice(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                />
              </div>
            )}

            {(sourcingMode === 'pieces_only' || sourcingMode === 'both') && (
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Curated Price (₹ / Piece) *
                </label>
                <input
                  type="number"
                  required
                  value={curatedPiecePrice}
                  onChange={(e) => setCuratedPiecePrice(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                />
              </div>
            )}

            {(sourcingMode === 'pieces_only' || sourcingMode === 'both') && (
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Curated MOQ (Min. Pieces) *
                </label>
                <input
                  type="number"
                  required
                  value={curatedMoq}
                  onChange={(e) => setCuratedMoq(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Quality Grade Distribution */}
          <div className="pt-2 border-t border-slate-100">
            <label className="text-[11px] font-medium text-slate-700 block mb-1.5">
              Grade Distribution (%)
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] text-slate-500 block">Grade A (Pristine):</span>
                <input
                  type="number"
                  value={gradeA}
                  onChange={(e) => setGradeA(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Grade B (Minor Wear):</span>
                <input
                  type="number"
                  value={gradeB}
                  onChange={(e) => setGradeB(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900"
                />
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Grade C (Wash / Salvage):</span>
                <input
                  type="number"
                  value={gradeC}
                  onChange={(e) => setGradeC(Number(e.target.value))}
                  className="w-full bg-white border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-900"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Section 3: 30s Inspection Videos & HD Photos */}
        <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <div className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Video className="w-4 h-4 text-slate-700" />
              <span>3. 30s Godown Videos (Up to 2) & High-Res Photos</span>
            </div>
            <span className="text-[10.5px] text-slate-500 font-normal">Cloudflare R2 Direct Upload</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Video 1 */}
            <div className="p-3.5 rounded-lg border border-slate-300 bg-slate-50 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <Film className="w-3.5 h-3.5 text-amber-600" />
                  <span>Video 1: 30s Opening Audit</span>
                </div>
                {video1Uploaded && <span className="text-[10px] font-bold text-emerald-700">✓ Attached</span>}
              </div>
              <p className="text-[10.5px] text-slate-500">Live unboxing sample inspection clip showing zipper & lining.</p>
              <button
                type="button"
                onClick={() => setVideo1Uploaded(true)}
                className="px-2.5 py-1 rounded bg-white text-slate-800 text-xs font-semibold border border-slate-300 hover:bg-slate-100"
              >
                {video1Uploaded ? 'Replace 30s Video' : '+ Select 30s Video'}
              </button>
            </div>

            {/* Video 2 */}
            <div className="p-3.5 rounded-lg border border-slate-300 bg-slate-50 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="font-bold text-slate-900 flex items-center gap-1">
                  <Film className="w-3.5 h-3.5 text-amber-600" />
                  <span>Video 2: 30s Godown Stack</span>
                </div>
                {video2Uploaded && <span className="text-[10px] font-bold text-emerald-700">✓ Attached</span>}
              </div>
              <p className="text-[10.5px] text-slate-500">Walk-through of storage pallet and steel strapping.</p>
              <button
                type="button"
                onClick={() => setVideo2Uploaded(true)}
                className="px-2.5 py-1 rounded bg-white text-slate-800 text-xs font-semibold border border-slate-300 hover:bg-slate-100"
              >
                {video2Uploaded ? 'Replace 30s Video' : '+ Select 30s Video'}
              </button>
            </div>

          </div>

          {/* Photos */}
          <div className="p-3.5 rounded-lg border border-slate-300 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold text-slate-900 flex items-center gap-1">
                <Camera className="w-3.5 h-3.5 text-slate-600" />
                <span>High-Res Lot Photos ({photosUploaded}/4 Attached)</span>
              </div>
              <span className="text-[10px] text-slate-500">Max 4 Photos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-[10px] text-slate-600">
                Photo 1
              </div>
              <div className="w-12 h-12 rounded bg-slate-200 border border-slate-300 flex items-center justify-center font-bold text-[10px] text-slate-600">
                Photo 2
              </div>
              <button
                type="button"
                onClick={() => setPhotosUploaded(Math.min(4, photosUploaded + 1))}
                className="w-12 h-12 rounded border-2 border-dashed border-slate-300 bg-white hover:bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs"
              >
                +
              </button>
            </div>
          </div>

        </div>

        {submittedSuccess && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Lot successfully created and submitted for Admin Approval!</span>
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href="/seller/listings"
            className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Submitting for Approval...</span>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                <span>Submit Lot for Admin Approval</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
