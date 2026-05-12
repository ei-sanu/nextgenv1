"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorSystem() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [hoverType, setHoverType] = useState<"default" | "magnetic" | "text">(
    "default",
  );

  // Raw mouse coordinates
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth sprung coordinates for the main cursor
  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Outer glow delay coordinates
  const glowSpringConfig = { damping: 30, stiffness: 150, mass: 1 };
  const glowX = useSpring(mouseX, glowSpringConfig);
  const glowY = useSpring(mouseY, glowSpringConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      // Offset for centering the cursor
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const interactable = target.closest("a, button, [data-magnetic]");
      const isText = target.closest("p, h1, h2, h3, h4, h5, h6, span");

      if (interactable) {
        setIsHovering(true);
        setHoverType(
          target.closest("[data-magnetic]") ? "magnetic" : "default",
        );
      } else if (isText) {
        setIsHovering(true);
        setHoverType("text");
      } else {
        setIsHovering(false);
        setHoverType("default");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden mix-blend-difference">
      {/* Outer Glow / Flare */}
      <motion.div
        className="absolute left-0 top-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyber/20 blur-2xl will-change-transform"
        style={{
          x: glowX,
          y: glowY,
          scale: isHovering && hoverType !== "text" ? 1.5 : 1,
        }}
      />

      {/* Main Center Dot */}
      <motion.div
        className="absolute left-0 top-0 flex items-center justify-center -translate-x-1/2 -translate-y-1/2 will-change-transform"
        style={{
          x: cursorX,
          y: cursorY,
        }}
      >
        <motion.div
          animate={{
            width: isHovering && hoverType === "text" ? 2 : isHovering ? 48 : 8,
            height:
              isHovering && hoverType === "text" ? 24 : isHovering ? 48 : 8,
            backgroundColor:
              isHovering && hoverType === "text"
                ? "rgba(255, 255, 255, 0.8)"
                : "rgba(255, 255, 255, 1)",
            borderRadius: isHovering && hoverType === "text" ? "2px" : "9999px",
            border:
              isHovering && hoverType !== "text"
                ? "1px solid rgba(255, 255, 255, 0.2)"
                : "0px solid transparent",
          }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        />

        {/* Subtle crosshair lines on hover */}
        {isHovering && hoverType !== "text" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            className="absolute inset-0 border border-cyber/40 rounded-full"
          />
        )}
      </motion.div>
    </div>
  );
}
