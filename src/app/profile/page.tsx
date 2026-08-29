'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BuyerUser, BuyerAddress } from '@/types';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Building, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Truck, 
  ShieldCheck, 
  ArrowLeft, 
  X, 
  Save,
  MapPinned
} from 'lucide-react';

export default function BuyerProfilePage() {
  const [user, setUser] = useState<BuyerUser>({
    id: 'usr-default',
    contactName: 'Rahul Sharma',
    businessName: 'Urban Vintage Thrift Studio',
    phone: '+91 98112 34567',
    email: 'rahul@urbanthrift.in',
    gstin: '07AAAAA0000A1Z5',
    city: 'New Delhi',
    state: 'Delhi NCR',
  });

  const [addresses, setAddresses] = useState<BuyerAddress[]>([]);
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('addresses');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<BuyerAddress | null>(null);

  // Address Form State
  const [label, setLabel] = useState('Address 1');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [transportPreference, setTransportPreference] = useState('V-Trans Panipat Hub (Daily Delhi Transit)');

  // Load Profile and Addresses
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('sp_buyer_user');
      let currentUserId = 'usr-default';
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setUser((prev) => ({ ...prev, ...parsed }));
          if (parsed.id) currentUserId = parsed.id;
        } catch (e) {}
      }

      // Fetch from API
      fetch(`/api/profile?userId=${currentUserId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.user) {
            setUser((prev) => ({ ...prev, ...data.user }));
            if (data.user.addresses && data.user.addresses.length > 0) {
              setAddresses(data.user.addresses);
            }
          }
        })
        .catch(() => {
          // Fallback initial addresses
          setAddresses([
            {
              id: 'addr-001',
              userId: currentUserId,
              label: 'Address 1 (Main Storefront)',
              contactName: user.contactName || 'Rahul Sharma',
              phone: user.phone || '+91 98112 34567',
              addressLine: 'Shop 14, Hauz Khas Village Market',
              landmark: 'Near Deer Park Gate',
              city: 'New Delhi',
              state: 'Delhi NCR',
              pincode: '110016',
              isDefault: true,
              transportPreference: 'V-Trans Panipat Hub (Daily Delhi Transit)',
              createdAt: new Date().toISOString(),
            },
            {
              id: 'addr-002',
              userId: currentUserId,
              label: 'Address 2 (Sorting Warehouse)',
              contactName: user.contactName || 'Rahul Sharma',
              phone: user.phone || '+91 98112 34567',
              addressLine: 'Shed B-42, Okhla Industrial Area Phase-III',
              landmark: 'Opposite Container Yard',
              city: 'New Delhi',
              state: 'Delhi NCR',
              pincode: '110020',
              isDefault: false,
              transportPreference: 'TCI Freight Panipat Godown Hub',
              createdAt: new Date().toISOString(),
            },
          ]);
        });
    }
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg('');

    try {
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('sp_buyer_user', JSON.stringify(user));
      }

      setProfileSuccessMsg('Profile details saved successfully!');
      setTimeout(() => setProfileSuccessMsg(''), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddress(null);
    setLabel(`Address ${addresses.length + 1}`);
    setContactName(user.contactName || '');
    setPhone(user.phone || '');
    setAddressLine('');
    setLandmark('');
    setCity(user.city || 'New Delhi');
    setState(user.state || 'Delhi NCR');
    setPincode('110016');
    setIsDefault(addresses.length === 0);
    setTransportPreference('V-Trans Panipat Hub (Daily Delhi Transit)');
    setIsAddressModalOpen(true);
  };

  const handleOpenEditAddress = (addr: BuyerAddress) => {
    setEditingAddress(addr);
    setLabel(addr.label);
    setContactName(addr.contactName);
    setPhone(addr.phone);
    setAddressLine(addr.addressLine);
    setLandmark(addr.landmark || '');
    setCity(addr.city);
    setState(addr.state);
    setPincode(addr.pincode);
    setIsDefault(addr.isDefault);
    setTransportPreference(addr.transportPreference);
    setIsAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingAddress) {
      // Edit
      const updatedList = addresses.map((a) => {
        if (a.id === editingAddress.id) {
          return {
            ...a,
            label,
            contactName,
            phone,
            addressLine,
            landmark,
            city,
            state,
            pincode,
            isDefault,
            transportPreference,
          };
        }
        if (isDefault) return { ...a, isDefault: false };
        return a;
      });

      setAddresses(updatedList);

      fetch('/api/profile/addresses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingAddress.id,
          userId: user.id,
          label,
          contactName,
          phone,
          addressLine,
          landmark,
          city,
          state,
          pincode,
          isDefault,
          transportPreference,
        }),
      }).catch(console.error);

    } else {
      // Add New
      const newAddr: BuyerAddress = {
        id: `addr-${Date.now().toString().slice(-6)}`,
        userId: user.id,
        label,
        contactName,
        phone,
        addressLine,
        landmark,
        city,
        state,
        pincode,
        isDefault,
        transportPreference,
        createdAt: new Date().toISOString(),
      };

      const updatedList = isDefault
        ? [newAddr, ...addresses.map((a) => ({ ...a, isDefault: false }))]
        : [...addresses, newAddr];

      setAddresses(updatedList);

      fetch('/api/profile/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAddr),
      }).catch(console.error);
    }

    setIsAddressModalOpen(false);
  };

  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    fetch(`/api/profile/addresses?id=${id}`, { method: 'DELETE' }).catch(console.error);
  };

  const handleSetDefault = (id: string) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updated);

    fetch('/api/profile/addresses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, userId: user.id, isDefault: true }),
    }).catch(console.error);
  };

  const getInitials = (name?: string, business?: string) => {
    const source = name || business || 'User';
    const parts = source.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return source.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8 flex-1 w-full space-y-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-slate-900 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">My Account & Addresses</span>
        </div>

        {/* Profile Card Header */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-slate-900 text-amber-400 font-black text-xl flex items-center justify-center shrink-0 border-2 border-amber-400/50 shadow-sm">
              {getInitials(user.contactName, user.businessName)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                  {user.contactName || 'Verified Buyer'}
                </h1>
                <span className="text-[10.5px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Verified Buyer
                </span>
              </div>

              <p className="text-xs text-slate-500 mt-0.5">
                {user.businessName && <span>{user.businessName} • </span>}
                {user.phone} • {user.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/orders"
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 transition-colors"
            >
              View Escrow Orders
            </Link>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('addresses')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'addresses'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MapPinned className="w-3.5 h-3.5" />
            <span>Delivery Addresses ({addresses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Business & Personal Details</span>
          </button>
        </div>

        {/* TAB 1: SAVED DELIVERY ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Manage Delivery Addresses
                </h2>
                <p className="text-xs text-slate-500">
                  Add multiple godown delivery locations (Address 1, Address 2) and logistics transporter preferences
                </p>
              </div>

              <button
                onClick={handleOpenAddAddress}
                className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add New Address</span>
              </button>
            </div>

            {/* Address Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className={`p-5 rounded-xl bg-white border transition-all shadow-xs flex flex-col justify-between gap-3 ${
                    addr.isDefault ? 'border-slate-800 ring-1 ring-slate-800' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    
                    {/* Address Label & Default Pill */}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-slate-700" />
                        <span>{addr.label}</span>
                      </span>

                      {addr.isDefault ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ● Default Consignee Address
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSetDefault(addr.id)}
                          className="text-[11px] text-slate-500 hover:text-slate-900 font-semibold"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>

                    {/* Consignee Name & Phone */}
                    <div className="text-xs font-semibold text-slate-800">
                      {addr.contactName} • <span className="text-slate-600 font-normal">{addr.phone}</span>
                    </div>

                    {/* Address Body */}
                    <div className="text-xs text-slate-600 leading-relaxed">
                      {addr.addressLine}
                      {addr.landmark && <span className="block text-slate-500 text-[11px]">Landmark: {addr.landmark}</span>}
                      <span className="block font-medium text-slate-900 mt-0.5">
                        {addr.city}, {addr.state} - {addr.pincode}
                      </span>
                    </div>

                    {/* Transport Preference */}
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-slate-600">
                      <Truck className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>Transporter: <strong className="text-slate-800">{addr.transportPreference}</strong></span>
                    </div>

                  </div>

                  {/* Card Actions */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleOpenEditAddress(addr)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    {addresses.length > 1 && (
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        className="px-2.5 py-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: PROFILE & BUSINESS DETAILS */}
        {activeTab === 'profile' && (
          <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs max-w-2xl space-y-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Personal & Business Information
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Update your registered contact and firm details for B2B escrow invoices
              </p>
            </div>

            {profileSuccessMsg && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{profileSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Full Name / Contact Person *
                </label>
                <input
                  type="text"
                  required
                  value={user.contactName || ''}
                  onChange={(e) => setUser({ ...user, contactName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Business / Store / Firm Name
                </label>
                <input
                  type="text"
                  value={user.businessName || ''}
                  onChange={(e) => setUser({ ...user, businessName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    WhatsApp Calling Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Registered Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    GSTIN Number (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="07AAAAA0000A1Z5"
                    value={user.gstin || ''}
                    onChange={(e) => setUser({ ...user, gstin: e.target.value.toUpperCase() })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-mono uppercase text-slate-900 focus:border-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={user.city || ''}
                    onChange={(e) => setUser({ ...user, city: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={user.state || ''}
                    onChange={(e) => setUser({ ...user, state: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </main>

      {/* ADD / EDIT ADDRESS MODAL */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                  {editingAddress ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddressModalOpen(false)}
                className="w-7 h-7 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSaveAddress} className="p-4 sm:p-5 space-y-3.5 text-xs overflow-y-auto">
              
              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Address Label (e.g. Address 1, Address 2, Main Store, Warehouse) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Address 1 (Storefront)"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Consignee Contact Person *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98112 34567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Complete Street Address / Plot / Shop No. *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Shop No. 14, Hauz Khas Village Market"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Near Deer Park"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="New Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-700 block mb-1">
                    State & Pin Code *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Delhi"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-2/3 bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none"
                    />
                    <input
                      type="text"
                      required
                      placeholder="110016"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-1/3 bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs font-mono text-slate-900 focus:border-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-medium text-slate-700 block mb-1">
                  Preferred Transport / Logistics Hub in Panipat *
                </label>
                <select
                  value={transportPreference}
                  onChange={(e) => setTransportPreference(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:border-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="V-Trans Panipat Hub (Daily Delhi Transit)">V-Trans Panipat Hub (Daily Delhi Transit)</option>
                  <option value="TCI Freight Panipat Godown Hub">TCI Freight Panipat Godown Hub</option>
                  <option value="Gati KWE Panipat Logistics Hub">Gati KWE Panipat Logistics Hub</option>
                  <option value="SafeXpress Panipat Industrial Hub">SafeXpress Panipat Industrial Hub</option>
                  <option value="Direct Godown Self Pickup (Panipat)">Direct Godown Self Pickup (Panipat)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefaultCheckbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <label htmlFor="isDefaultCheckbox" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Set this as my default delivery address for 1-click escrow checkout
                </label>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm"
                >
                  {editingAddress ? 'Save Address Changes' : 'Add Delivery Address'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
