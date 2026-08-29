'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { getOrderById, MOCK_ORDERS } from '@/lib/mock-catalog';
import { formatINR } from '@/lib/utils';
import { 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Phone, 
  FileText, 
  ArrowLeft, 
  Lock, 
  Scale, 
  Truck, 
  ExternalLink,
  X,
  Play,
  Building,
  Check
} from 'lucide-react';

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default function OrderTrackingPage({ params }: OrderPageProps) {
  const initialOrder = getOrderById(params.id) || MOCK_ORDERS['ORD-782190'];

  if (!initialOrder && !MOCK_ORDERS[params.id]) {
    notFound();
  }

  const [order, setOrder] = useState(initialOrder);
  const [isBiltiModalOpen, setIsBiltiModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isApproved, setIsApproved] = useState(order.currentStageIndex >= 3);

  const stages = [
    {
      index: 0,
      title: 'Order Placed & Escrow Locked',
      desc: `Funds of ${formatINR(order.totalPayable)} secured in ICICI Nodal Escrow.`,
      timestamp: order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '28 Aug 2026, 02:20 PM',
      badge: 'Escrow Secured',
    },
    {
      index: 1,
      title: 'Panipat QC Inspector Assigned',
      desc: order.inspector ? `${order.inspector.name} (${order.inspector.code}) dispatched to ${order.godownZone}.` : 'Inspector assigned for on-ground tare scale audit.',
      timestamp: '28 Aug 2026, 03:00 PM',
      badge: 'On-Ground Active',
    },
    {
      index: 2,
      title: 'QC Tare Weight & Video Approval',
      desc: order.inspector?.verifiedTareWeightKg 
        ? `Tare Scale Verified: ${order.inspector.verifiedTareWeightKg} KG. Live 30s opening video ready for buyer approval.`
        : 'Awaiting digital scale tare measurement and opening inspection clip.',
      timestamp: isApproved ? '28 Aug 2026, 04:30 PM' : 'Pending Your Approval',
      badge: isApproved ? 'Approved by Buyer' : 'Action Required',
    },
    {
      index: 3,
      title: 'Dispatched & Bilti (LR) Scan Uploaded',
      desc: order.bilti 
        ? `Loaded via ${order.bilti.transporterName}. LR No: ${order.bilti.lrNumber}.`
        : 'Official transport goods receipt (Bilti LR) uploaded upon loading.',
      timestamp: order.bilti ? '28 Aug 2026, 06:00 PM' : 'Est. Today by 6:00 PM',
      badge: order.bilti ? 'Bilti Verified' : 'In Transit Queue',
    },
    {
      index: 4,
      title: 'Delivered & Escrow Settled',
      desc: 'Escrow payment released to seller only after buyer OTP confirmation upon destination delivery.',
      timestamp: order.currentStageIndex === 4 ? '26 Aug 2026, 04:00 PM' : 'Awaiting Delivery',
      badge: order.currentStageIndex === 4 ? 'Settled' : 'Pending',
    },
  ];

  const handleApproveDispatch = () => {
    setIsApproved(true);
    setOrder({
      ...order,
      currentStageIndex: 3,
      escrowStatus: 'DISPATCHED_BILTI_UPLOADED',
      bilti: {
        transporterName: 'V-Trans Panipat Godown Hub',
        lrNumber: 'VT-PNP-882190',
        dispatchDate: new Date().toISOString(),
        scanImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-slate-500">
            <Link href="/orders" className="hover:text-slate-900 flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Orders</span>
            </Link>
            <span>/</span>
            <span className="text-slate-800 font-semibold">{order.orderNumber}</span>
          </div>

          <div className="text-[11px] font-mono text-slate-500">
            Escrow ID: <strong className="text-slate-800">{order.id}</strong>
          </div>
        </div>
      </div>

      {/* Main Order Timeline Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 py-6 flex-1 w-full">
        
        {/* Order Header Summary Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            
            <div className="flex items-start gap-3">
              <div className="w-16 h-16 rounded-lg bg-slate-100 relative overflow-hidden shrink-0 border border-slate-200">
                <Image src={order.baleThumbnail} alt={order.baleTitle} fill className="object-cover" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {order.sellerMaskedCode}
                  </span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    100% Escrow Protected
                  </span>
                </div>

                <h1 className="text-sm sm:text-base font-bold text-slate-900 mt-1 line-clamp-1">
                  {order.baleTitle}
                </h1>

                <p className="text-xs text-slate-500 mt-0.5">
                  {order.buyMode === 'sealed_bale' 
                    ? `${order.quantityBales || 1} x ${order.baleWeightKg}kg Sealed Bale`
                    : `${order.curatedPieceCount || 25} Curated Pieces`} • Destination: {order.deliveryCity}, {order.deliveryState}
                </p>
              </div>
            </div>

            <div className="sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
              <div className="text-xs text-slate-500 font-medium">Total Escrow Hold:</div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {formatINR(order.totalPayable)}
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                (Incl. ₹1,000 Inspection Shield)
              </div>
            </div>

          </div>
        </div>

        {/* Grid: 5-Stage Live Timeline & Sidebar Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT: 5-Stage Step Timeline (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-4 sm:p-6 rounded-xl bg-white border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">
                    Live Escrow & Dispatch Lifecycle
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time verification from Panipat godown yard to your destination
                  </p>
                </div>

                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Stage {order.currentStageIndex + 1} of 5
                </span>
              </div>

              {/* 5-Step Timeline Component */}
              <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                {stages.map((stage) => {
                  const isCompleted = stage.index < order.currentStageIndex || (stage.index === 2 && isApproved);
                  const isCurrent = stage.index === order.currentStageIndex && !(stage.index === 2 && isApproved);
                  const isPending = stage.index > order.currentStageIndex && !(stage.index === 2 && isApproved);

                  return (
                    <div key={stage.index} className="relative group">
                      
                      {/* Step Indicator Dot */}
                      <div
                        className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : isCurrent
                            ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100'
                            : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : stage.index + 1}
                      </div>

                      {/* Step Content */}
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3
                            className={`text-xs sm:text-sm font-bold ${
                              isCurrent ? 'text-slate-900' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                            }`}
                          >
                            {stage.title}
                          </h3>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                isCompleted
                                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                  : isCurrent
                                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                  : 'bg-slate-100 text-slate-500'
                              }`}
                            >
                              {stage.badge}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">{stage.timestamp}</span>
                          </div>
                        </div>

                        <p className={`text-xs leading-relaxed ${isPending ? 'text-slate-400' : 'text-slate-600'}`}>
                          {stage.desc}
                        </p>

                        {/* Interactive Context for Stage 2 (Inspector) */}
                        {stage.index === 1 && order.inspector && (
                          <div className="mt-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                                QC
                              </div>
                              <div>
                                <div className="font-bold text-xs text-slate-900">
                                  {order.inspector.name} • <span className="font-mono text-slate-500">{order.inspector.code}</span>
                                </div>
                                <div className="text-[10.5px] text-slate-500">
                                  Panipat Field Coordinator ({order.godownZone.split(',')[0]})
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <a
                                href={`tel:${order.inspector.phone}`}
                                className="px-3 py-1 rounded bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-300 flex items-center gap-1"
                              >
                                <Phone className="w-3 h-3 text-slate-600" />
                                <span>Call QC</span>
                              </a>
                              <a
                                href={`https://wa.me/919876543210?text=Hi%20${encodeURIComponent(order.inspector.name)},%20inquiry%20on%20Order%20${order.orderNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                              >
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </div>
                        )}

                        {/* Interactive Action for Stage 3 (QC Approval) */}
                        {stage.index === 2 && (
                          <div className="mt-2.5 p-3 rounded-lg bg-amber-50/70 border border-amber-200 space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Scale className="w-4 h-4 text-amber-700" />
                                <span className="text-xs font-bold text-slate-900">
                                  Scale Weight: <strong className="text-amber-900 font-mono">{order.inspector?.verifiedTareWeightKg || 81.4} KG</strong>
                                </span>
                              </div>

                              <button
                                onClick={() => setIsVideoModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 transition-colors shadow-xs"
                              >
                                <Play className="w-3 h-3 fill-current" />
                                <span>Watch 30s Live Opening Clip</span>
                              </button>
                            </div>

                            {!isApproved ? (
                              <div className="pt-2 border-t border-amber-200/80 flex flex-wrap items-center gap-2">
                                <button
                                  onClick={handleApproveDispatch}
                                  className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Approve for Transport Loading</span>
                                </button>
                                <a
                                  href="https://wa.me/919876543210?text=I%20have%20a%20question%20on%20the%20QC%20video%20for%20order"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-300"
                                >
                                  Request Re-Audit
                                </a>
                              </div>
                            ) : (
                              <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span>Dispatch Approved by Buyer. Loading on transport truck in progress.</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Interactive Action for Stage 4 (Bilti Scan LR) */}
                        {stage.index === 3 && order.bilti && (
                          <div className="mt-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Truck className="w-4 h-4 text-slate-700" />
                              <div>
                                <div className="font-bold text-xs text-slate-900">
                                  {order.bilti.transporterName}
                                </div>
                                <div className="text-[10.5px] font-mono text-slate-500">
                                  LR Number: <strong>{order.bilti.lrNumber}</strong>
                                </div>
                              </div>
                            </div>

                            <button
                              onClick={() => setIsBiltiModalOpen(true)}
                              className="px-3 py-1.5 rounded bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300 flex items-center gap-1.5 shadow-xs"
                            >
                              <FileText className="w-3.5 h-3.5 text-blue-600" />
                              <span>View Bilti LR Scan</span>
                            </button>
                          </div>
                        )}

                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Consignee & Escrow Protection Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            {/* Consignee Address Card */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>Consignee Details</span>
              </div>

              <div className="text-xs space-y-1.5 text-slate-600 divide-y divide-slate-100">
                <div className="pb-1.5">
                  <div className="font-bold text-slate-900">{order.buyerBusinessName}</div>
                  <div className="text-[11px] text-slate-500">Contact: {order.buyerName}</div>
                  <div className="text-[11px] text-slate-500">{order.buyerPhone}</div>
                </div>

                <div className="pt-1.5">
                  <div className="font-medium text-slate-800">Destination Address:</div>
                  <div className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                    {order.deliveryAddress}
                  </div>
                </div>

                <div className="pt-1.5">
                  <div className="font-medium text-slate-800">Transport Hub Preference:</div>
                  <div className="text-[11px] text-slate-600">
                    {order.transportPreference}
                  </div>
                </div>
              </div>
            </div>

            {/* Escrow Financial Details Card */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>Escrow Settlement Ledger</span>
              </div>

              <div className="text-xs space-y-2 text-slate-600">
                <div className="flex justify-between">
                  <span>Wholesale Lot Subtotal:</span>
                  <span className="font-semibold text-slate-900">{formatINR(order.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Verified Inspection Shield:</span>
                  <span className="font-semibold text-emerald-800">+{formatINR(order.inspectionShieldFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Platform Escrow Fee:</span>
                  <span className="font-semibold text-emerald-800">₹0 (Waived)</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Total Held in Escrow:</span>
                  <span className="text-lg font-bold text-slate-900">{formatINR(order.totalPayable)}</span>
                </div>
              </div>

              <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[10.5px] text-slate-500 leading-relaxed">
                Escrow payouts are held in compliance with RBI Nodal guidelines and released only upon delivery verification.
              </div>
            </div>

            {/* Support Desk Action */}
            <a
              href="https://wa.me/919876543210?text=Hi%20SourcePanipat,%20I%20need%20help%20with%20my%20Order"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Contact Panipat Support Coordinator</span>
            </a>

          </div>

        </div>
      </main>

      {/* Bilti LR Scan Fullscreen Viewer Modal */}
      {isBiltiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-xs sm:text-sm">
                  Official Transport Bilti (LR Scan) • {order.bilti?.lrNumber}
                </span>
              </div>
              <button
                onClick={() => setIsBiltiModalOpen(false)}
                className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-[4/3] w-full bg-slate-100 overflow-hidden">
              <Image
                src={order.bilti?.scanImageUrl || 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80'}
                alt="Transport Bilti Scan"
                fill
                className="object-contain p-2"
              />
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="text-slate-600">
                Carrier: <strong>{order.bilti?.transporterName}</strong>
              </div>
              <button
                onClick={() => setIsBiltiModalOpen(false)}
                className="px-3.5 py-1.5 rounded bg-slate-900 text-white font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 30s Live QC Video Modal */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-xl bg-white rounded-xl overflow-hidden shadow-2xl flex flex-col">
            <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between">
              <span className="font-bold text-xs">
                30s Live Tare Weight & Opening Audit Clip
              </span>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative aspect-video w-full bg-black">
              <video
                src={order.inspector?.openingVideoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                autoPlay
                controls
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
