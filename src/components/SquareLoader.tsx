'use client';

import React from 'react';

interface SquareLoaderProps {
  message?: string;
  subMessage?: string;
  fullScreen?: boolean;
}

export function SquareLoader({ 
  message = 'Loading Godown Bale & 30s Inspection Video...', 
  subMessage = 'Connecting to Panipat Yard Desk & Live Tare Audits',
  fullScreen = true 
}: SquareLoaderProps) {
  return (
    <div 
      className={`${
        fullScreen 
          ? 'fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4' 
          : 'w-full py-12 flex flex-col items-center justify-center'
      } animate-in fade-in duration-200 select-none`}
    >
      <style jsx>{`
        .loadingspinner {
          --square: 24px;
          --offset: 28px;
          --duration: 2.4s;
          --delay: 0.2s;
          --timing-function: ease-in-out;
          --in-duration: 0.4s;
          --in-delay: 0.1s;
          --in-timing-function: ease-out;
          width: calc(3 * var(--offset) + var(--square));
          height: calc(2 * var(--offset) + var(--square));
          padding: 0px;
          margin-left: auto;
          margin-right: auto;
          margin-top: 10px;
          margin-bottom: 24px;
          position: relative;
        }

        .loadingspinner div {
          display: inline-block;
          background: #f59e0b; /* Amber / Darkorange */
          border: none;
          border-radius: 3px;
          width: var(--square);
          height: var(--square);
          position: absolute;
          padding: 0px;
          margin: 0px;
          box-shadow: 0 0 12px rgba(245, 158, 11, 0.45);
        }

        .loadingspinner #square1 {
          left: calc(0 * var(--offset));
          top: calc(0 * var(--offset));
          animation: square1 var(--duration) var(--delay) var(--timing-function) infinite,
            squarefadein var(--in-duration) calc(1 * var(--in-delay)) var(--in-timing-function) both;
        }

        .loadingspinner #square2 {
          left: calc(0 * var(--offset));
          top: calc(1 * var(--offset));
          animation: square2 var(--duration) var(--delay) var(--timing-function) infinite,
            squarefadein var(--in-duration) calc(1 * var(--in-delay)) var(--in-timing-function) both;
        }

        .loadingspinner #square3 {
          left: calc(1 * var(--offset));
          top: calc(1 * var(--offset));
          animation: square3 var(--duration) var(--delay) var(--timing-function) infinite,
            squarefadein var(--in-duration) calc(2 * var(--in-delay)) var(--in-timing-function) both;
        }

        .loadingspinner #square4 {
          left: calc(2 * var(--offset));
          top: calc(1 * var(--offset));
          animation: square4 var(--duration) var(--delay) var(--timing-function) infinite,
            squarefadein var(--in-duration) calc(3 * var(--in-delay)) var(--in-timing-function) both;
        }

        .loadingspinner #square5 {
          left: calc(3 * var(--offset));
          top: calc(1 * var(--offset));
          animation: square5 var(--duration) var(--delay) var(--timing-function) infinite,
            squarefadein var(--in-duration) calc(4 * var(--in-delay)) var(--in-timing-function) both;
        }

        @keyframes square1 {
          0% {
            left: calc(0 * var(--offset));
            top: calc(0 * var(--offset));
          }
          8.333% {
            left: calc(0 * var(--offset));
            top: calc(1 * var(--offset));
          }
          100% {
            left: calc(0 * var(--offset));
            top: calc(1 * var(--offset));
          }
        }

        @keyframes square2 {
          0% {
            left: calc(0 * var(--offset));
            top: calc(1 * var(--offset));
          }
          8.333% {
            left: calc(0 * var(--offset));
            top: calc(2 * var(--offset));
          }
          16.67% {
            left: calc(1 * var(--offset));
            top: calc(2 * var(--offset));
          }
          25.00% {
            left: calc(1 * var(--offset));
            top: calc(1 * var(--offset));
          }
          83.33% {
            left: calc(1 * var(--offset));
            top: calc(1 * var(--offset));
          }
          91.67% {
            left: calc(0 * var(--offset));
            top: calc(0 * var(--offset));
          }
          100% {
            left: calc(0 * var(--offset));
            top: calc(0 * var(--offset));
          }
        }

        @keyframes square3 {
          0%, 100% {
            left: calc(1 * var(--offset));
            top: calc(1 * var(--offset));
          }
          16.67% {
            left: calc(1 * var(--offset));
            top: calc(1 * var(--offset));
          }
          25.00% {
            left: calc(1 * var(--offset));
            top: calc(0 * var(--offset));
          }
          33.33% {
            left: calc(2 * var(--offset));
            top: calc(0 * var(--offset));
          }
          41.67% {
            left: calc(2 * var(--offset));
            top: calc(1 * var(--offset));
          }
          66.67% {
            left: calc(2 * var(--offset));
            top: calc(1 * var(--offset));
          }
          75.00% {
            left: calc(2 * var(--offset));
            top: calc(2 * var(--offset));
          }
          83.33% {
            left: calc(1 * var(--offset));
            top: calc(2 * var(--offset));
          }
          91.67% {
            left: calc(1 * var(--offset));
            top: calc(1 * var(--offset));
          }
        }

        @keyframes square4 {
          0% {
            left: calc(2 * var(--offset));
            top: calc(1 * var(--offset));
          }
          33.33% {
            left: calc(2 * var(--offset));
            top: calc(1 * var(--offset));
          }
          41.67% {
            left: calc(2 * var(--offset));
            top: calc(2 * var(--offset));
          }
          50.00% {
            left: calc(3 * var(--offset));
            top: calc(2 * var(--offset));
          }
          58.33% {
            left: calc(3 * var(--offset));
            top: calc(1 * var(--offset));
          }
          100% {
            left: calc(3 * var(--offset));
            top: calc(1 * var(--offset));
          }
        }

        @keyframes square5 {
          0% {
            left: calc(3 * var(--offset));
            top: calc(1 * var(--offset));
          }
          50.00% {
            left: calc(3 * var(--offset));
            top: calc(1 * var(--offset));
          }
          58.33% {
            left: calc(3 * var(--offset));
            top: calc(0 * var(--offset));
          }
          66.67% {
            left: calc(2 * var(--offset));
            top: calc(0 * var(--offset));
          }
          75.00% {
            left: calc(2 * var(--offset));
            top: calc(1 * var(--offset));
          }
          100% {
            left: calc(2 * var(--offset));
            top: calc(1 * var(--offset));
          }
        }

        @keyframes squarefadein {
          0% {
            transform: scale(0.75);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>

      {/* Dancing Squares Spinner */}
      <div className="loadingspinner">
        <div id="square1" />
        <div id="square2" />
        <div id="square3" />
        <div id="square4" />
        <div id="square5" />
      </div>

      {/* Brand Label & Progress Text */}
      <div className="text-center space-y-1.5 max-w-sm px-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10.5px] tracking-wider uppercase font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          SourcePanipat Godown Network
        </div>
        <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
          {message}
        </h3>
        {subMessage && (
          <p className="text-xs text-slate-400">
            {subMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default SquareLoader;
