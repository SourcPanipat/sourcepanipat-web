'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  Film
} from 'lucide-react';

interface VideoGradeModalProps {
  bale: BaleListing | null;
  onClose: () => void;
  onProceedToEscrow: (bale: BaleListing) => void;
}

export function VideoGradeModal({ bale, onClose, onProceedToEscrow }: VideoGradeModalProps) {
  const [activeClipIndex, setActiveClipIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setActiveClipIndex(0);
    setIsPlaying(true);
  }, [bale]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [activeClipIndex]);

  if (!bale) return null;

  const currentClip: VideoGradeClip = bale.videoClips[activeClipIndex] || bale.videoClips[0];

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="font-mono text-xs font-bold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
              {bale.seller.maskedCode}
            </span>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 truncate">
              {bale.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player (30s Inspection Clip) */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={currentClip.videoUrl}
            className="w-full h-full object-cover"
            autoPlay
            playsInline
            muted={isMuted}
            loop
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-slate-900/85 text-white text-[11px] font-semibold flex items-center gap-1">
              <Film className="w-3 h-3 text-amber-400" />
              <span>30s Godown Video ({currentClip.grade})</span>
            </span>
          </div>

          {/* Controls */}
          <div className="absolute bottom-2.5 inset-x-2.5 flex items-center justify-between pointer-events-auto">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded bg-black/70 hover:bg-black text-white transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-1.5 rounded bg-black/70 hover:bg-black text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 30s Multi-Clip Switcher & Notes */}
        <div className="p-3 bg-white border-t border-slate-200 space-y-3 overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {bale.videoClips.map((clip, idx) => {
              const isActive = activeClipIndex === idx;
              return (
                <button
                  key={clip.id || idx}
                  onClick={() => setActiveClipIndex(idx)}
                  className={`p-2 rounded border text-left transition-colors ${
                    isActive
                      ? 'bg-slate-900 border-slate-900 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">
                      {idx === 0 ? 'Clip 1: Opening Audit' : 'Clip 2: Godown Stack'}
                    </span>
                    <span className="text-[10px] font-semibold">30s</span>
                  </div>
                  <p className={`text-[10px] truncate mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                    {clip.label}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Condition Notes */}
          <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5">
            <div className="font-semibold text-slate-900">{currentClip.label}:</div>
            <p className="text-[11px] text-slate-600 leading-relaxed">{currentClip.description}</p>
            <div className="flex flex-wrap gap-1 pt-1">
              {currentClip.conditionNotes.map((note, nIdx) => (
                <span
                  key={nIdx}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white text-[10px] text-slate-600 border border-slate-200 font-medium"
                >
                  <Check className="w-3 h-3 text-emerald-600" />
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing & Footer Action */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            <div>
              <span className="text-sm sm:text-base font-bold text-slate-900">
                {bale.sourcingMode === 'pieces_only'
                  ? `${formatINR(bale.curatedPiecePrice)}/pc`
                  : formatINR(bale.sealedBalePrice)}
              </span>
              <span className="text-[11px] text-slate-500 ml-1">
                {bale.sourcingMode === 'pieces_only'
                  ? `(MOQ ${bale.curatedMoq} pcs)`
                  : `/ ${bale.weightKg}kg bale`}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Close
              </button>

              <button
                onClick={() => {
                  onClose();
                  onProceedToEscrow(bale);
                }}
                className="px-3.5 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
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
