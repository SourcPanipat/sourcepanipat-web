'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export function WhatsAppFloatingCTA() {
  return (
    <div className="fixed bottom-4 right-4 z-40">
      <a
        href="https://wa.me/918950202286?text=Hi%20SourcePanipat,%20I%20want%20to%20know%20today%27s%20fresh%20bale%20arrivals"
        target="_blank"

        rel="noopener noreferrer"
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all group"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
        </div>
        <span className="hidden sm:inline">Panipat WhatsApp Desk</span>
        <span className="sm:hidden font-bold">WhatsApp</span>
      </a>
    </div>
  );
}
