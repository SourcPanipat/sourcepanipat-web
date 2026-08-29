'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { BaleListing, VideoGradeClip } from '@/types';
import { formatINR } from '@/lib/utils';
import { 
  X, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Check, 
  Lock,
  Film,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface VideoGradeModalProps {
  bale: BaleListing | null;
  onClose: () => void;
  onProceedToEscrow: (bale: BaleListing) => void;
  initialTab?: 'video' | 'gallery';
  initialImageIndex?: number;
}

export function VideoGradeModal({ 
  bale, 
  onClose, 
  onProceedToEscrow,
  initialTab = 'video',
  initialImageIndex = 0
}: VideoGradeModalProps) {
  const [activeMediaMode, setActiveMediaMode] = useState<'video' | 'gallery'>(initialTab);
  const [activeClipIndex, setActiveClipIndex] = useState<number>(0);
  const [activeImageIndex, setActiveImageIndex] = useState<number>(initialImageIndex);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setActiveMediaMode(initialTab);
    setActiveClipIndex(0);
    setActiveImageIndex(initialImageIndex);
    setIsPlaying(true);
  }, [bale, initialTab, initialImageIndex]);

  useEffect(() => {
    if (activeMediaMode === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [activeClipIndex, activeMediaMode]);

  if (!bale) return null;

  const currentClip: VideoGradeClip = bale.videoClips[activeClipIndex] || bale.videoClips[0];
  const galleryImages = bale.galleryImages && bale.galleryImages.length > 0 
    ? bale.galleryImages 
    : [bale.thumbnailUrl];

  const currentImage = galleryImages[activeImageIndex] || bale.thumbnailUrl;

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

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]">
        
        {/* Header */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="font-mono text-xs font-bold text-slate-900 bg-amber-400 px-2 py-0.5 rounded">
              {bale.seller.maskedCode}
            </span>
            <h3 className="text-xs sm:text-sm font-semibold text-white truncate">
              {bale.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 16:9 FIXED RATIO UNIFIED MEDIA PLAYER (OLX Standard Solid Black Letterbox) */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden select-none">
          
          {activeMediaMode === 'video' ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black group">
              <video
                ref={videoRef}
                src={currentClip.videoUrl}
                poster={bale.thumbnailUrl}
                className="max-w-full max-h-full object-contain mx-auto cursor-pointer"
                autoPlay
                playsInline
                muted={isMuted}
                loop
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                <span className="px-2 py-0.5 rounded bg-rose-800 text-white text-[10.5px] font-bold flex items-center gap-1 shadow-xs uppercase tracking-wide">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Yard QC Video
                </span>
                <span className="bg-black/80 text-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-700">
                  {currentClip.label} (30s)
                </span>
              </div>

              {/* Play / Pause overlay */}
              {!isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/80 text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg border border-white/20"
                >
                  <Play className="w-6 h-6 ml-0.5 text-amber-400 fill-amber-400" />
                </button>
              )}

              {/* Controls */}
              <div className="absolute bottom-3 inset-x-3 flex items-center justify-between pointer-events-auto">
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-full bg-black/75 hover:bg-black text-white transition-colors border border-white/20 shadow-xs"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full bg-black/75 hover:bg-black text-white transition-colors border border-white/20 shadow-xs"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              <img
                src={currentImage}
                alt={bale.title}
                className="max-w-full max-h-full object-contain mx-auto select-none"
              />

              {/* Image Navigation Arrows */}
              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all border border-white/20 shadow-lg"
                    title="Previous Image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/70 hover:bg-black text-white flex items-center justify-center transition-all border border-white/20 shadow-lg"
                    title="Next Image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Photo Index Badge */}
              <div className="absolute bottom-3 right-3 bg-black/80 text-white text-[11px] font-mono px-2.5 py-1 rounded-full border border-white/20 shadow-xs">
                {activeImageIndex + 1} / {galleryImages.length}
              </div>
            </div>
          )}
        </div>

        {/* Media Selector Strip (Video Clips & High-Res Photos) */}
        <div className="p-3.5 bg-slate-900 border-t border-slate-800 space-y-3 overflow-y-auto">
          
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            
            {/* 30s Video Clips */}
            {bale.videoClips.map((clip, idx) => {
              const isSelected = activeMediaMode === 'video' && activeClipIndex === idx;
              return (
                <button
                  key={clip.id || idx}
                  onClick={() => {
                    setActiveMediaMode('video');
                    setActiveClipIndex(idx);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-amber-400 shadow-xs'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  <Film className="w-3.5 h-3.5" />
                  <span>30s Video {idx === 0 ? '(Audit)' : `(Clip ${idx + 1})`}</span>
                </button>
              );
            })}

            {/* Gallery Images */}
            {galleryImages.map((img, idx) => {
              const isSelected = activeMediaMode === 'gallery' && activeImageIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveMediaMode('gallery');
                    setActiveImageIndex(idx);
                  }}
                  className={`relative w-12 h-9 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                    isSelected
                      ? 'border-amber-400 scale-105 shadow-md'
                      : 'border-slate-700 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              );
            })}
          </div>

          {/* Condition Notes */}
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1.5">
            <div className="font-semibold text-white flex items-center justify-between">
              <span>{currentClip.label} Specification:</span>
              <span className="text-[10.5px] font-mono text-amber-400">92% Grade A Inspected</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">{currentClip.description}</p>
            {currentClip.conditionNotes && currentClip.conditionNotes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-0.5">
                {currentClip.conditionNotes.map((note, nIdx) => (
                  <span
                    key={nIdx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 border border-slate-700 font-medium"
                  >
                    <Check className="w-3 h-3 text-emerald-400" />
                    {note}
                  </span>
                ))}
              </div>
            )}
          </div>


          {/* Pricing & Escrow Action */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div>
              <span className="text-sm sm:text-base font-bold text-white">
                {bale.sourcingMode === 'pieces_only'
                  ? `${formatINR(bale.curatedPiecePrice)}/pc`
                  : formatINR(bale.sealedBalePrice)}
              </span>
              <span className="text-[11px] text-slate-400 ml-1">
                {bale.sourcingMode === 'pieces_only'
                  ? `(MOQ ${bale.curatedMoq} pcs)`
                  : `/ ${bale.weightKg}kg bale`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>

              <button
                onClick={() => {
                  onClose();
                  onProceedToEscrow(bale);
                }}
                className="px-4 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Order via Escrow</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
