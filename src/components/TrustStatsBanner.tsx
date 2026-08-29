'use client';

import React from 'react';
import { ShieldCheck, Lock, Building, Scale } from 'lucide-react';

export function TrustStatsBanner() {
  const trustPillars = [
    {
      icon: ShieldCheck,
      title: 'Verified Inspection Shield',
      desc: 'On-ground gig inspector in Panipat audits digital scale tare weight and records live opening video before dispatch.',
    },
    {
      icon: Building,
      title: 'Masked Godown IDs',
      desc: 'Suppliers are verified with fixed ID tags (#PNP-001) for direct wholesale rates without middleman markup.',
    },
    {
      icon: Lock,
      title: '100% Nodal Escrow',
      desc: 'Buyer funds remain in secure escrow until the official Transport Bilti (LR) is validated with verified weight.',
    },
    {
      icon: Scale,
      title: 'Flexible Purchasing',
      desc: 'Order 80-100kg factory-sealed bales or curated hand-picked pieces with a 25-piece minimum order quantity.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 border-t border-slate-200 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {trustPillars.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-lg bg-white border border-slate-200 shadow-xs flex items-start gap-3"
            >
              <div className="p-2 rounded bg-slate-100 text-slate-800 shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
