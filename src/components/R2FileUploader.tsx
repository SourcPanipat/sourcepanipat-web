'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, CheckCircle2, Film, Image as ImageIcon, FileText, AlertCircle } from 'lucide-react';

import { uploadMediaDirectly } from '@/lib/client-upload';

interface R2FileUploaderProps {
  folder: string;
  accept: string;
  maxSizeMB?: number;
  maxDurationSec?: number; // For videos: auto-trim to this duration
  label: string;
  sublabel?: string;
  onUploadComplete: (url: string, fileName: string) => void;
  onRemove?: () => void;
  currentUrl?: string;
  currentFileName?: string;
  disabled?: boolean;
  compact?: boolean; // Smaller variant for photo grid
}

type UploadState = 'idle' | 'trimming' | 'uploading' | 'done' | 'error';

export function R2FileUploader({
  folder,
  accept,
  maxSizeMB = 10,
  maxDurationSec,
  label,
  sublabel,
  onUploadComplete,
  onRemove,
  currentUrl,
  currentFileName,
  disabled = false,
  compact = false,
}: R2FileUploaderProps) {
  const [state, setState] = useState<UploadState>(currentUrl ? 'done' : 'idle');
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState(currentFileName || '');
  const [previewUrl, setPreviewUrl] = useState(currentUrl || '');
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const videoTrimRef = useRef<HTMLVideoElement>(null);

  const isVideo = accept.includes('video');
  const isImage = accept.includes('image');

  const uploadToStorage = useCallback(async (file: File | Blob, name: string) => {
    setState('uploading');
    setProgress(10);

    try {
      const result = await uploadMediaDirectly(file, folder, (p) => setProgress(p));

      if (result.success && result.url) {
        setState('done');
        setPreviewUrl(result.url);
        setFileName(name);
        onUploadComplete(result.url, name);
      } else {
        throw new Error('Upload returned no URL');
      }
    } catch (err: any) {
      setState('error');
      setErrorMsg(err.message || 'Upload failed');
    }
  }, [folder, onUploadComplete]);


  const trimVideoTo30s = useCallback((file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      setState('trimming');
      setProgress(0);

      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.preload = 'auto';

      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;

      video.onloadedmetadata = () => {
        const trimDuration = Math.min(video.duration, maxDurationSec || 30);

        // If already under limit, just return original
        if (video.duration <= (maxDurationSec || 30) + 0.5) {
          URL.revokeObjectURL(objectUrl);
          resolve(file);
          return;
        }

        // Use MediaRecorder to capture the first 30s
        video.currentTime = 0;

        video.oncanplay = () => {
          try {
            const stream = (video as any).captureStream();
            const chunks: BlobPart[] = [];
            const recorder = new MediaRecorder(stream, {
              mimeType: MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
                ? 'video/webm;codecs=vp9'
                : 'video/webm',
            });

            recorder.ondataavailable = (e) => {
              if (e.data.size > 0) chunks.push(e.data);
            };

            recorder.onstop = () => {
              URL.revokeObjectURL(objectUrl);
              video.pause();
              const blob = new Blob(chunks, { type: 'video/webm' });
              resolve(blob);
            };

            recorder.onerror = (err) => {
              URL.revokeObjectURL(objectUrl);
              reject(new Error('Recording error'));
            };

            recorder.start();
            video.play();

            // Track trimming progress
            const progressInterval = setInterval(() => {
              if (video.currentTime > 0) {
                setProgress(Math.round((video.currentTime / trimDuration) * 100));
              }
            }, 200);

            setTimeout(() => {
              clearInterval(progressInterval);
              setProgress(100);
              recorder.stop();
              video.pause();
            }, trimDuration * 1000);
          } catch (err) {
            URL.revokeObjectURL(objectUrl);
            // Fallback: just upload original if captureStream not supported
            resolve(file);
          }
        };
      };

      video.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to load video'));
      };
    });
  }, [maxDurationSec]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg('');

    // Size check
    if (file.size > maxSizeMB * 1024 * 1024) {
      setState('error');
      setErrorMsg(`File too large. Max ${maxSizeMB}MB allowed.`);
      return;
    }

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    }

    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');

    // For videos with duration limit, trim first
    if (isVideo && maxDurationSec && file.type.startsWith('video/')) {
      try {
        const trimmedBlob = await trimVideoTo30s(file);
        const trimmedName = cleanName.replace(/\.[^.]+$/, '') + '.webm';
        await uploadToStorage(trimmedBlob, trimmedName);
      } catch (err: any) {
        // Fallback: upload original
        await uploadToStorage(file, cleanName);
      }
    } else {
      await uploadToStorage(file, cleanName);
    }

    // Reset input so same file can be re-selected
    if (inputRef.current) inputRef.current.value = '';
  }, [maxSizeMB, isVideo, maxDurationSec, trimVideoTo30s, uploadToStorage]);


  const handleRemove = () => {
    setState('idle');
    setPreviewUrl('');
    setFileName('');
    setProgress(0);
    setErrorMsg('');
    onRemove?.();
  };

  // --- Compact variant (for photo grid) ---
  if (compact) {
    return (
      <div className="relative group">
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled || state === 'uploading' || state === 'trimming'}
        />

        {state === 'done' && previewUrl ? (
          <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-slate-300">
            {previewUrl.startsWith('data:') || previewUrl.includes('.') ? (
              <img src={previewUrl} alt={fileName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                <ImageIcon className="w-5 h-5 text-slate-500" />
              </div>
            )}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : state === 'uploading' || state === 'trimming' ? (
          <div className="w-full aspect-square rounded-lg border-2 border-dashed border-amber-400 bg-amber-50 flex flex-col items-center justify-center gap-1">
            <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
            <span className="text-[9px] font-bold text-amber-700">{progress}%</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="w-full aspect-square rounded-lg border-2 border-dashed border-slate-300 bg-white hover:bg-slate-50 flex flex-col items-center justify-center gap-0.5 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-slate-400" />
            <span className="text-[9px] font-bold text-slate-500">Add</span>
          </button>
        )}
      </div>
    );
  }

  // --- Full variant ---
  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || state === 'uploading' || state === 'trimming'}
      />

      <div
        className={`p-3.5 rounded-lg border-2 border-dashed transition-colors ${
          state === 'done'
            ? 'border-emerald-300 bg-emerald-50/50'
            : state === 'error'
            ? 'border-red-300 bg-red-50/50'
            : state === 'uploading' || state === 'trimming'
            ? 'border-amber-400 bg-amber-50/50'
            : 'border-slate-300 bg-slate-50'
        }`}
      >
        {/* Preview + info row */}
        <div className="flex items-start gap-3">
          {/* Icon / Preview */}
          <div className="w-12 h-12 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
            {state === 'done' && previewUrl && isImage ? (
              <img src={previewUrl} alt={fileName} className="w-full h-full object-cover" />
            ) : state === 'done' && previewUrl && isVideo ? (
              <video src={previewUrl} className="w-full h-full object-cover" muted />
            ) : isVideo ? (
              <Film className="w-5 h-5 text-slate-500" />
            ) : isImage ? (
              <ImageIcon className="w-5 h-5 text-slate-500" />
            ) : (
              <FileText className="w-5 h-5 text-slate-500" />
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="font-bold text-slate-800 text-xs truncate">
              {state === 'done' && fileName ? fileName : label}
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              {state === 'trimming'
                ? `Auto-trimming to ${maxDurationSec}s preview...`
                : state === 'uploading'
                ? 'Uploading to Storage Vault...'
                : state === 'done'
                ? '✓ Securely Uploaded & Presigned'
                : state === 'error'
                ? errorMsg
                : sublabel || `Max ${maxSizeMB}MB${maxDurationSec ? ` • Auto-trimmed to ${maxDurationSec}s` : ''}`}
            </p>


            {/* Progress bar */}
            {(state === 'uploading' || state === 'trimming') && (
              <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>

          {/* Action */}
          <div className="shrink-0">
            {state === 'done' ? (
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-[10px] font-bold text-slate-500 hover:text-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ) : state === 'uploading' || state === 'trimming' ? (
              <Loader2 className="w-4 h-4 text-amber-600 animate-spin" />
            ) : state === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-500" />
            ) : null}
          </div>
        </div>

        {/* Click to upload button */}
        {(state === 'idle' || state === 'error' || state === 'done') && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
            className="mt-2 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-[10.5px] font-semibold border border-slate-300 transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
          >
            <Upload className="w-3 h-3" />
            <span>{state === 'done' ? 'Replace File' : state === 'error' ? 'Retry Upload' : 'Select File'}</span>
          </button>
        )}
      </div>

      {/* Hidden video element for trimming */}
      {isVideo && <video ref={videoTrimRef} className="hidden" muted playsInline />}
    </div>
  );
}
