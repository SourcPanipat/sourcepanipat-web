'use client';

import { useState, useEffect, useCallback } from 'react';
import { getBrowserSupabase } from '@/lib/supabase-client';

const STORAGE_KEY = 'sp_viewed_listing_ids';
const GUEST_LIMIT = 20;

export function useListingGate(currentBaleId?: string) {
  const [viewedCount, setViewedCount] = useState<number>(0);
  const [isGated, setIsGated] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Check auth session
  const checkAuth = useCallback(async () => {
    if (typeof window === 'undefined') return false;

    // Check local buyer profile session
    const localBuyer = localStorage.getItem('sp_buyer_user');
    if (localBuyer) {
      try {
        const parsed = JSON.parse(localBuyer);
        if (parsed?.id || parsed?.email) {
          setIsAuthenticated(true);
          return true;
        }
      } catch (e) {
        // Continue to check Supabase
      }
    }

    // Check Supabase session
    try {
      const supabase = getBrowserSupabase();
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsAuthenticated(true);
          return true;
        }
      }
    } catch (e) {
      // Supabase session check fallback
    }

    setIsAuthenticated(false);
    return false;
  }, []);

  useEffect(() => {
    checkAuth().then((authed) => {
      if (authed) {
        setIsGated(false);
        return;
      }

      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY);
        let viewed: string[] = [];
        if (raw) {
          try {
            viewed = JSON.parse(raw);
          } catch (e) {
            viewed = [];
          }
        }

        setViewedCount(viewed.length);

        if (currentBaleId) {
          const isAlreadyViewed = viewed.includes(currentBaleId);

          if (!isAlreadyViewed) {
            if (viewed.length >= GUEST_LIMIT) {
              // Reached 20 limit and trying to open a new listing
              setIsGated(true);
              setIsAuthModalOpen(true);
            } else {
              // Add to viewed list
              const updated = [...viewed, currentBaleId];
              localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
              setViewedCount(updated.length);
              setIsGated(false);
            }
          } else {
            setIsGated(false);
          }
        }
      }
    });
  }, [currentBaleId, checkAuth]);

  const unlockGate = () => {
    setIsGated(false);
    setIsAuthModalOpen(false);
    setIsAuthenticated(true);
  };

  return {
    isGated,
    viewedCount,
    totalLimit: GUEST_LIMIT,
    isAuthenticated,
    isAuthModalOpen,
    setIsAuthModalOpen,
    unlockGate,
  };
}

export default useListingGate;
