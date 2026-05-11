"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

interface WaterWipeImageProps {
  src: string;
  alt?: string;
  className?: string;
  brushSize?: number;
}

export function ScratchImage({
  src,
  alt,
  className,
  brushSize = 80,
}: WaterWipeImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  // Force a re-render when the canvas changes to update the CSS mask
  const [maskUrl, setMaskUrl] = useState<string>("");

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill with solid black (fully opaque mask)
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    setMaskUrl(canvas.toDataURL());
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setIsLoaded(true);
      // Wait a frame for the container to have its size
      requestAnimationFrame(initCanvas);
    };

    const handleResize = () => initCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [src, initCanvas]);

  const wipe = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Use destination-out to "cut holes" in the black mask
    ctx.globalCompositeOperation = "destination-out";
    
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize);
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(0.7, "rgba(0,0,0,0.5)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    
    // Create a "splatter" or "water droplet" shape
    for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const randomness = 0.7 + Math.random() * 0.6;
        const rx = x + Math.cos(angle) * brushSize * randomness;
        const ry = y + Math.sin(angle) * brushSize * randomness;
        if (i === 0) ctx.moveTo(rx, ry);
        else ctx.lineTo(rx, ry);
    }
    
    ctx.closePath();
    ctx.fill();

    // Update the mask URL to trigger the CSS transition
    setMaskUrl(canvas.toDataURL());
  }, [brushSize]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const container = containerRef.current;
    if (!container || !isLoaded) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    container.style.setProperty("--mouse-x", `${x}px`);
    container.style.setProperty("--mouse-y", `${y}px`);

    wipe(x, y);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const container = containerRef.current;
    if (!container || !isLoaded || !e.touches[0]) return;

    const rect = container.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    container.style.setProperty("--mouse-x", `${x}px`);
    container.style.setProperty("--mouse-y", `${y}px`);

    wipe(x, y);
  };

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden bg-black ${className}`}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Background: Sharp Image */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: isLoaded ? 1 : 0 }}
      />

      {/* Foreground: "Foggy/Blurred" Layer that gets wiped away */}
      <div 
        className="absolute inset-0 z-10 overflow-hidden"
        style={{ 
            opacity: isLoaded ? 1 : 0,
            WebkitMaskImage: `url(${maskUrl})`,
            maskImage: `url(${maskUrl})`,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskSize: '100% 100%',
            WebkitMaskSize: '100% 100%',
        }}
      >
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover blur-2xl brightness-75 grayscale-[0.2] scale-105"
          />
          {/* Surface texture (frosted glass) */}
          <div className="absolute inset-0 opacity-30 mix-blend-overlay pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/glass-shattering.png')]" />
      </div>

      {/* Off-screen canvas for the mask */}
      <canvas
        ref={canvasRef}
        style={{ display: 'none' }}
      />

      {/* Magnetic "Wipe" Cursor */}
      <div 
        className="pointer-events-none absolute z-20 hidden group-hover:block transition-transform duration-100 ease-out"
        style={{ 
            left: 'var(--mouse-x, -100px)', 
            top: 'var(--mouse-y, -100px)',
            transform: 'translate(-50%, -50%)'
        }}
      >
          <div className="h-12 w-12 rounded-full border border-white/40 bg-white/10 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
      </div>
    </div>
  );
}
