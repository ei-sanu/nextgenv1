"use client";

import { useEffect, ReactNode, createContext, useContext } from "react";
import Lenis from "lenis";

const MotionContext = createContext<{ lenis: Lenis | null }>({ lenis: null });

export const useMotion = () => useContext(MotionContext);

export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo.easeOut
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <MotionContext.Provider value={{ lenis: null }}>
      {children}
    </MotionContext.Provider>
  );
}
