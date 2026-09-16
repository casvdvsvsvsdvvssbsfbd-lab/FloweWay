import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, ZoomIn, ZoomOut, Check, Sliders, Eye, Sparkles } from 'lucide-react';
import { Product } from '../../types';

interface IOSCameraRoomModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

export const IOSCameraRoomModal: React.FC<IOSCameraRoomModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [plantPos, setPlantPos] = useState<{ x: number; y: number }>({ x: 0, y: 40 });
  const [plantScale, setPlantScale] = useState<number>(1);
  const [isDragging, setIsDragging] = useState(false);
  const [focusPoint, setFocusPoint] = useState<{ x: number; y: number } | null>(null);
  const [captured, setCaptured] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const targetPosRef = useRef({ x: 0, y: 40 });
  const currentPosRef = useRef({ x: 0, y: 40 });
  const animFrameRef = useRef<number | null>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Start / Stop Video stream
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      return;
    }

    // Initialize smooth physics loop (iOS-grade lerp inertia)
    const smoothLoop = () => {
      // Gentle Apple-style lerp (0.12 damping factor)
      currentPosRef.current.x += (targetPosRef.current.x - currentPosRef.current.x) * 0.12;
      currentPosRef.current.y += (targetPosRef.current.y - currentPosRef.current.y) * 0.12;

      setPlantPos({
        x: Math.round(currentPosRef.current.x * 100) / 100,
        y: Math.round(currentPosRef.current.y * 100) / 100,
      });

      animFrameRef.current = requestAnimationFrame(smoothLoop);
    };
    animFrameRef.current = requestAnimationFrame(smoothLoop);

    return () => {
      stopCamera();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setCameraActive(true);
        setHasCameraPermission(true);
      } else {
        setHasCameraPermission(false);
      }
    } catch {
      setHasCameraPermission(false);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  if (!isOpen) return null;

  // Handle touch / mouse drag with iOS inertia
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - targetPosRef.current.x,
      y: e.clientY - targetPosRef.current.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    targetPosRef.current = {
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    };
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handleTapViewfinder = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setFocusPoint({ x, y });
    setTimeout(() => setFocusPoint(null), 1200);
  };

  const takeSnapshot = () => {
    setCaptured(true);
    setTimeout(() => setCaptured(false), 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      {/* 46px Standard Rounded Corner Container as requested */}
      <div
        className="relative w-full max-w-3xl h-[85vh] max-h-[760px] bg-black rounded-[46px] overflow-hidden border border-white/10 shadow-2xl flex flex-col justify-between select-none"
        style={{
          WebkitBackfaceVisibility: 'hidden',
          backfaceVisibility: 'hidden',
          transform: 'translate3d(0,0,0)',
        }}
      >
        {/* Top iOS Camera Bar */}
        <div className="relative z-20 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold tracking-tight">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>iOS AR Studio</span>
            </span>
            <span className="text-white/70 text-xs font-medium hidden sm:inline">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={cameraActive ? stopCamera : startCamera}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 ${
                cameraActive
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-md'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{cameraActive ? 'Kamerani o\'chirish' : 'Jonli kamera'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md text-white flex items-center justify-center transition-all active:scale-90"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder Main Stage */}
        <div
          onClick={handleTapViewfinder}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
          style={{
            touchAction: 'none',
          }}
        >
          {/* Real Camera Stream OR High-end Scandinavian Room backdrop */}
          {cameraActive ? (
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              style={{
                transform: `scale(${zoomLevel}) translateZ(0)`,
                transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
              }}
            />
          ) : (
            <div
              className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] pointer-events-none"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80')`,
                transform: `scale(${zoomLevel}) translateZ(0)`,
                willChange: 'transform',
              }}
            >
              <div className="absolute inset-0 bg-black/25" />
            </div>
          )}

          {/* Flash Feedback on Snapshot */}
          {captured && (
            <div className="absolute inset-0 bg-white z-40 pointer-events-none transition-opacity duration-300" />
          )}

          {/* iOS Focus Reticle */}
          {focusPoint && (
            <div
              className="absolute w-16 h-16 border border-amber-400/90 rounded-md pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-ping"
              style={{
                left: `${focusPoint.x}px`,
                top: `${focusPoint.y}px`,
              }}
            />
          )}

          {/* iOS Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-25">
            <div className="border-r border-b border-white/40" />
            <div className="border-r border-b border-white/40" />
            <div className="border-b border-white/40" />
            <div className="border-r border-b border-white/40" />
            <div className="border-r border-b border-white/40" />
            <div className="border-b border-white/40" />
            <div className="border-r border-white/40" />
            <div className="border-r border-white/40" />
            <div />
          </div>

          {/* Draggable Plant with iOS Inertia Physics & Ground Contact Shadow */}
          <div
            className="absolute flex flex-col items-center pointer-events-auto select-none"
            style={{
              transform: `translate3d(${plantPos.x}px, ${plantPos.y}px, 0) scale(${plantScale})`,
              willChange: 'transform',
              transition: isDragging ? 'none' : 'transform 0.05s linear',
            }}
          >
            {/* Plant Cutout */}
            <div className="relative w-48 sm:w-64 aspect-square flex items-center justify-center">
              <img
                src={product.images[0]}
                alt={product.name}
                draggable={false}
                className="w-full h-full object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.5)]"
                style={{
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden',
                }}
              />
            </div>

            {/* Plant Depth Contact Ground Shadow */}
            <div className="w-36 sm:w-48 h-6 bg-black/45 rounded-full blur-md -mt-3 pointer-events-none" />

            {/* Drag Handle Label */}
            <div className="mt-2 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-medium border border-white/20 tracking-tight">
              Surish uchun bosing va torting
            </div>
          </div>
        </div>

        {/* Bottom iOS Camera Controls Bar */}
        <div className="relative z-20 flex flex-col gap-3 px-6 py-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
          {/* Zoom Dial (0.5x, 1x, 2x, 3x) with iOS Spring transition */}
          <div className="flex items-center justify-center gap-2">
            {[0.5, 1, 2, 3].map(z => (
              <button
                key={z}
                onClick={() => setZoomLevel(z)}
                className={`w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 active:scale-90 flex items-center justify-center ${
                  zoomLevel === z
                    ? 'bg-amber-400 text-black shadow-md scale-105'
                    : 'bg-white/15 text-white/90 hover:bg-white/25 backdrop-blur-md'
                }`}
                style={{
                  transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
                }}
              >
                {z}x
              </button>
            ))}
          </div>

          {/* Plant Scale Slider & Shutter Row */}
          <div className="flex items-center justify-between pt-1">
            {/* Plant Scale Control */}
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-md px-3 py-2 rounded-full text-white text-xs font-medium">
              <ZoomOut
                className="w-3.5 h-3.5 cursor-pointer hover:text-amber-300"
                onClick={() => setPlantScale(prev => Math.max(0.6, prev - 0.1))}
              />
              <span className="w-10 text-center font-bold">{Math.round(plantScale * 100)}%</span>
              <ZoomIn
                className="w-3.5 h-3.5 cursor-pointer hover:text-amber-300"
                onClick={() => setPlantScale(prev => Math.min(1.8, prev + 0.1))}
              />
            </div>

            {/* iOS Shutter Button */}
            <button
              onClick={takeSnapshot}
              className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center p-1 cursor-pointer active:scale-90 transition-transform duration-150"
              title="Suratga olish"
            >
              <div className="w-full h-full bg-white rounded-full transition-all active:bg-neutral-300" />
            </button>

            {/* Reset Position Button */}
            <button
              onClick={() => {
                targetPosRef.current = { x: 0, y: 40 };
                setPlantScale(1);
                setZoomLevel(1);
              }}
              className="px-3 py-2 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-semibold flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Qayta tiklash</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
