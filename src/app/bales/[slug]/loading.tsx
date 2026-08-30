import React from 'react';
import { SquareLoader } from '@/components/SquareLoader';

export default function BaleLoading() {
  return (
    <SquareLoader 
      message="Fetching Sealed Godown Lot Details..." 
      subMessage="Loading 30s Panipat Inspection Video & Verified QC Metrics"
      fullScreen={true}
    />
  );
}
