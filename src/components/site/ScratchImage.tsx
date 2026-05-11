"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";

interface ScratchImageProps {
  src: string;
  alt?: string;
  className?: string;
  brushSize?: number;
  revealText?: string;
}

export function ScratchImage({
  src,
  alt,
  className,
  brushSize = 60,
  revealText = "SECURE",
}: ScratchImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || !imageRef.current) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const { width, height } = container.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;

    // Draw the image on the canvas
    ctx.drawImage(imageRef.current, 0, 0, width, height);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imageRef.current = img;
      setIsLoaded(true);
      initCanvas();
    };

    const handleResize = () => {
      initCanvas();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [src, initCanvas]);

  const scratch = useCallback((x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = "destination-out";
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, brushSize);
    gradient.addColorStop(0, "rgba(0,0,0,1)");
    gradient.addColorStop(0.5, "rgba(0,0,0,0.5)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    ctx.fill();
  }, [brushSize]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const container = containerRef.current;
    if (!container || !isLoaded) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    container.style.setProperty("--mouse-x", `${x}px`);
    container.style.setProperty("--mouse-y", `${y}px`);

    scratch(x, y);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isLoaded) return;
    const rect = e.currentTarget.getBoundingClientRect();
    scratch(e.clientX - rect.left, e.clientY - rect.top);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const container = containerRef.current;
    if (!container || !isLoaded || !e.touches[0]) return;

    const rect = container.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const y = e.touches[0].clientY - rect.top;

    container.style.setProperty("--mouse-x", `${x}px`);
    container.style.setProperty("--mouse-y", `${y}px`);

    scratch(x, y);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isLoaded || !e.touches[0]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    scratch(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      className={`group relative overflow-hidden bg-neutral-950 ${className}`}
    >
      {/* Revealed content (background) */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_center,oklch(0.2_0.02_260)_0%,black_100%)]">
        <div className="font-mono text-[10px] tracking-[0.2em] text-cyber/40 mb-2">SYSTEM_CHECK</div>
        <div className="font-display text-2xl font-bold tracking-widest text-white/10 uppercase italic">
          {revealText}
        </div>
        <div className="mt-4 flex gap-1">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-1 w-8 bg-cyber/10 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
        </div>
      </div>

      {/* The image canvas that gets wiped */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onTouchMove={handleTouchMove}
        onTouchStart={handleTouchStart}
        className="relative z-10 block h-full w-full cursor-none opacity-0 transition-opacity duration-700"
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
      
      {/* Custom cursor hint */}
      <div className="pointer-events-none absolute z-20 hidden group-hover:block transition-transform duration-75"
           style={{ 
             left: 'var(--mouse-x, -100px)', 
             top: 'var(--mouse-y, -100px)',
             transform: 'translate(-50%, -50%)'
           }}
      >
          <div className="h-8 w-8 rounded-full border border-cyber/50 bg-cyber/10 backdrop-blur-sm" />
      </div>
    </div>
  );
}
