"use client";

import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import React, { useRef, ReactNode } from "react";

export function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);
  const glowX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const backgroundGlow = useMotionTemplate`radial-gradient(circle at ${glowX} ${glowY}, rgba(255,255,255,0.1) 0%, transparent 60%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl overflow-hidden ${className}`}
      data-magnetic="true"
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 mix-blend-overlay"
        style={{ background: backgroundGlow }}
      />
      <div className="absolute inset-0 noise opacity-20 pointer-events-none z-0" />
      <div className="relative z-10 p-6 sm:p-8" style={{ transform: "translateZ(30px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
