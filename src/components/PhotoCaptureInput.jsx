import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, X, Check } from 'lucide-react';
import { generateIllustratedAvatar } from '../utils/helpers';

export default function PhotoCaptureInput({
  value,
  onChange,
  name = 'Student',
  gender = 'Male',
  role = 'student',
}) {
  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [paletteIdx, setPaletteIdx] = useState(0);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraOpen(false);
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 480, height: 560, facingMode: 'user' },
      });
      streamRef.current = stream;
      setCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      setCameraError('Camera access unavailable or denied. Please use Upload Photo or Auto Avatar.');
    }
  };

  const captureFrame = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 240;
    canvas.height = 280;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    onChange(dataUrl);
    stopCamera();
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateAvatar = () => {
    const nextIdx = paletteIdx + 1;
    setPaletteIdx(nextIdx);
    onChange(generateIllustratedAvatar(name || 'Student', gender, role, nextIdx));
  };

  const previewSrc =
    value || generateIllustratedAvatar(name || 'Student', gender, role, paletteIdx);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
      <div className="relative w-24 h-28 rounded-xl overflow-hidden border-2 border-indigo-600 shadow-sm bg-white shrink-0">
        <img
          src={previewSrc}
          alt="ID Portrait"
          className="w-full h-full object-cover"
        />
        <span className="absolute bottom-0 inset-x-0 bg-slate-900/75 text-white text-[10px] font-semibold text-center py-0.5">
          PASSPORT SIZE
        </span>
      </div>

      <div className="flex-1 space-y-2 w-full">
        <div className="text-xs font-semibold text-slate-700">
          Identity Card Portrait Photo
        </div>
        <p className="text-xs text-slate-500">
          Upload a passport-size photo, capture live from webcam, or generate a uniform portrait.
        </p>

        {!cameraOpen ? (
          <div className="flex flex-wrap gap-2 pt-1">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer transition shadow-sm">
              <Upload className="w-3.5 h-3.5" />
              Upload Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <button
              type="button"
              onClick={startCamera}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-sm"
            >
              <Camera className="w-3.5 h-3.5" />
              Webcam Capture
            </button>

            <button
              type="button"
              onClick={handleGenerateAvatar}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold transition"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Auto Uniform Avatar
            </button>
          </div>
        ) : (
          <div className="p-2.5 bg-slate-900 rounded-xl space-y-2">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-40 h-44 object-cover rounded-lg mx-auto border border-slate-700"
            />
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={captureFrame}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold"
              >
                <Check className="w-3.5 h-3.5" /> Snap Photo
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            </div>
          </div>
        )}

        {cameraError && (
          <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
            {cameraError}
          </p>
        )}
      </div>
    </div>
  );
}
