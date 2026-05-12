"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouterState } from "@tanstack/react-router";

const LoaderContext = createContext<{
  setLoading: (isLoading: boolean) => void;
}>({ setLoading: () => {} });

export const useLoader = () => useContext(LoaderContext);

export function GlobalLoaderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isManualLoading, setIsManualLoading] = useState(false);
  const routerState = useRouterState();
  const isRouteLoading = routerState.isLoading;

  const isLoading = isRouteLoading || isManualLoading;

  return (
    <LoaderContext.Provider value={{ setLoading: setIsManualLoading }}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] pointer-events-none"
          >
            {/* Top Glowing Progress Bar */}
            <motion.div
              className="absolute top-0 left-0 h-[2px] bg-cyber shadow-[0_0_15px_oklch(0.78_0.14_200)] z-[201]"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
            />

            {/* Subtle Screen Overlay */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />

            {/* Center Loading Badge */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="flex flex-col items-center gap-4"
              >
                <div className="relative h-12 w-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full border-2 border-white/5 border-t-cyber shadow-[0_0_10px_oklch(0.78_0.14_200/0.3)]"
                  />
                </div>
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.4em] text-cyber/80">
                  Initialising_Protocol...
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </LoaderContext.Provider>
  );
}
