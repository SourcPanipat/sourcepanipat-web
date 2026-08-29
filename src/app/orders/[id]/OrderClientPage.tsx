'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getOrderById, MOCK_ORDERS } from '@/lib/mock-catalog';
import { EscrowOrderRecord } from '@/types';
import { formatINR } from '@/lib/utils';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  FileText, 
  ArrowLeft, 
  Lock, 
  Scale, 
  Truck, 
  X, 
  Check 
} from 'lucide-react';

interface OrderClientPageProps {
  id: string;
}

export function OrderClientPage({ id }: OrderClientPageProps) {
  const initialOrder = getOrderById(id) || MOCK_ORDERS['ORD-782190'];

  if (!initialOrder) {
    notFound();
  }

  const [order, setOrder] = useState<EscrowOrderRecord>(initialOrder);
  const [isBiltiModalOpen, setIsBiltiModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(order.currentStageIndex >= 3);

  const handleApproveEscrowRelease = () => {
    setIsApproved(true);
    setOrder((prev) => ({
      ...prev,
      escrowStatus: 'DISPATCHED_BILTI_UPLOADED',
      currentStageIndex: Math.max(prev.currentStageIndex, 3),
    }));
  };

  const biltiImage = order.bilti?.scanImageUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80';
  const transporter = order.bilti?.transporterName || 'VRL Logistics Panipat Hub';
  const gstAmount = Math.round(order.subtotal * 0.05);

  const stages = [
    {
      title: '1. Upfront 100% Escrow Locked',
      description: 'Buyer funds held safely in ICICI Nodal Escrow. Seller notified to pull lot from godown.',
      status: order.currentStageIndex > 0 ? 'COMPLETED' : order.currentStageIndex === 0 ? 'IN_PROGRESS' : 'PENDING',
    },
    {
      title: '2. Field QC Inspector Assigned',
      description: order.inspector ? `Inspector ${order.inspector.name} (${order.inspector.code}) assigned to Panipat yard.` : 'Coordinator assigned for yard opening weighment.',
      status: order.currentStageIndex > 1 ? 'COMPLETED' : order.currentStageIndex === 1 ? 'IN_PROGRESS' : 'PENDING',
    },
    {
      title: '3. Physical Tare Weighment & QC Check',
      description: `Verified Tare: ${order.inspector?.verifiedTareWeightKg || order.baleWeightKg} KG. Physical bale hoop inspection complete.`,
      status: order.currentStageIndex > 2 ? 'COMPLETED' : order.currentStageIndex === 2 ? 'IN_PROGRESS' : 'PENDING',
    },
    {
      title: '4. Transport Dispatch & Bilti (LR) Uploaded',
      description: `Transporter: ${transporter}. LR: ${order.bilti?.lrNumber || 'PNP-782190'}.`,
      status: order.currentStageIndex > 3 ? 'COMPLETED' : order.currentStageIndex === 3 ? 'IN_PROGRESS' : 'PENDING',
    },
    {
      title: '5. Delivery Confirmation & Seller Escrow Release',
      description: 'Bale delivered at destination hub. Escrow released to seller godown.',
      status: order.currentStageIndex >= 4 ? 'COMPLETED' : 'PENDING',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-6">
        
        {/* Top Breadcrumb & Status Pill */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <Link
              href="/orders"
              className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 font-mono">
                  Order #{order.orderNumber}
                </h1>
                <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {order.escrowStatus.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Placed on {order.createdAt.slice(0, 10)} • Godown {order.sellerMaskedCode} ({order.godownZone})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/919876543210?text=Hi%20SourcePanipat,%20query%20for%20Order%20${order.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Panipat Desk</span>
            </a>
          </div>
        </div>

        {/* 2-Column Split: Progress Tracker Left & Order Summary Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT: 5-Stage Visual Stepper */}
          <div className="lg:col-span-8 space-y-4">
            
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-6">
              <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Panipat Escrow & Quality Verification Timeline</span>
              </h2>

              {/* Steps List */}
              <div className="space-y-6 relative pl-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {stages.map((stage, idx) => {
                  const isDone = stage.status === 'COMPLETED';
                  const isCurrent = stage.status === 'IN_PROGRESS';

                  return (
                    <div key={idx} className="relative">
                      <div
                        className={`absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                      </div>

                      <div className="pl-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-bold text-xs text-slate-900">{stage.title}</h3>
                          <span className="text-[10.5px] text-slate-400 font-mono">
                            {isDone ? 'Completed' : isCurrent ? 'In Progress' : 'Pending'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          {stage.description}
                        </p>

                        {/* Inspector Proof Card */}
                        {stage.title.includes('Weighment') && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <Scale className="w-4 h-4 text-slate-600" />
                              <div className="text-xs">
                                <span className="font-semibold text-slate-800">Verified Tare: </span>
                                <span className="font-bold text-slate-900 font-mono">
                                  {order.inspector?.verifiedTareWeightKg || order.baleWeightKg} KG
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => setIsVideoModalOpen(true)}
                              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-colors"
                            >
                              View Scale Photo
                            </button>
                          </div>
                        )}

                        {/* Transport Bilti Card */}
                        {stage.title.includes('Bilti') && (
                          <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <Truck className="w-4 h-4 text-slate-600" />
                              <div className="text-xs">
                                <span className="font-semibold text-slate-800">Transporter: </span>
                                <span className="font-bold text-slate-900">{transporter}</span>
                              </div>
                            </div>

                            <button
                              onClick={() => setIsBiltiModalOpen(true)}
                              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-colors flex items-center gap-1"
                            >
                              <FileText className="w-3 h-3" />
                              <span>View Bilti</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Escrow Release Action */}
              <div className="pt-4 border-t border-slate-200 bg-amber-50/60 rounded-xl p-4 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-bold text-xs text-amber-950 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-800" />
                    <span>Buyer Escrow Authorization</span>
                  </div>
                  <p className="text-[11px] text-amber-900 leading-snug">
                    Inspect physical tare weights & Transport Bilti. Click to release payout to Godown #{order.sellerMaskedCode}.
                  </p>
                </div>

                <button
                  disabled={isApproved}
                  onClick={handleApproveEscrowRelease}
                  className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    isApproved
                      ? 'bg-emerald-600 text-white cursor-default'
                      : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                  }`}
                >
                  {isApproved ? '✓ Dispatched & Approved' : 'Approve & Release Escrow'}
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT: Order Summary Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
              <h2 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-3">
                Order & Lot Details
              </h2>

              <div className="flex items-center gap-3">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                  <Image
                    src={order.baleThumbnail}
                    alt={order.baleTitle}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-xs text-slate-900 truncate">
                    {order.baleTitle}
                  </h3>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Mode: {order.buyMode === 'sealed_bale' ? `Sealed Bale (${order.baleWeightKg}kg)` : `Curated Lot (${order.curatedPieceCount || 25} Pcs)`}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    Subtotal: {formatINR(order.subtotal)}
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="space-y-2 text-xs pt-3 border-t border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Inventory Amount:</span>
                  <span className="font-semibold text-slate-900">{formatINR(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Inspection Shield:</span>
                  <span className="font-semibold text-emerald-800">₹{order.inspectionShieldFee}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>GST (5%):</span>
                  <span className="font-semibold text-slate-900">{formatINR(gstAmount)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Escrow:</span>
                  <span className="font-mono text-base font-black">{formatINR(order.totalPayable || order.subtotal)}</span>
                </div>
              </div>

              {/* Delivery Consignee Info */}
              <div className="pt-3 border-t border-slate-100 text-xs space-y-1 text-slate-600">
                <div className="font-bold text-slate-900">Consignee Delivery Address:</div>
                <div className="font-medium text-slate-800">{order.buyerName}</div>
                <div>{order.deliveryAddress}</div>
                <div className="font-mono text-slate-500 text-[11px]">Phone: {order.buyerPhone}</div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Bilti Preview Modal */}
      {isBiltiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <span>Panipat Transport Bilti Scan</span>
              </h3>
              <button onClick={() => setIsBiltiModalOpen(false)}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="relative aspect-4/3 bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
              <Image
                src={biltiImage}
                alt="Transport Bilti"
                fill
                className="object-contain"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsBiltiModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scale Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Scale className="w-4 h-4 text-slate-700" />
                <span>Inspector Live Tare Weighment Photo</span>
              </h3>
              <button onClick={() => setIsVideoModalOpen(false)}>
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="relative aspect-4/3 bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
              <Image
                src={order.baleThumbnail}
                alt="Scale Weighment"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
