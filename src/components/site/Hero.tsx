import { motion } from "framer-motion";
import { Shield, ArrowRight, Zap, Lock } from "lucide-react";
import neonArt from "@/assets/neon.jpg";
import chipArt from "@/assets/hero-garden.jpg";
import { GlassCard } from "../interactive/GlassCard";

const nav = ["Security", "Intelligence", "Network"];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden min-h-screen flex flex-col justify-center">
      {/* Deep ambient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_60%_at_50%_-10%,oklch(0.32_0.05_255)_0%,oklch(0.12_0.02_255)_55%,oklch(0.06_0.015_260)_100%)]" />

      {/* Spotlight cone from top */}
      <div
        className="absolute left-1/2 top-0 -z-0 h-[140%] w-[70%] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(ellipse 60% 70% at 50% 0%, oklch(0.78 0.14 200 / 0.18) 0%, oklch(0.78 0.14 200 / 0.06) 35%, transparent 65%)",
          filter: "blur(8px)",
        }}
      />
      
      {/* Floating particles background effect (CSS only) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
              <div 
                key={i}
                className="absolute h-px w-px bg-cyber shadow-[0_0_15px_oklch(0.78_0.14_200)] animate-pulse"
                style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                    opacity: 0.3
                }}
              />
          ))}
      </div>

      <div className="absolute inset-0 noise opacity-20" />

      {/* Top nav */}
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 mx-auto flex max-w-7xl items-center justify-between px-6 pt-7 sm:px-10"
      >
        <a className="flex items-center gap-2 text-white group" data-magnetic="true">
          <div className="relative">
            <Shield className="h-5 w-5 text-cyber transition-transform group-hover:scale-110" />
            <div className="absolute inset-0 bg-cyber/20 blur-lg rounded-full" />
          </div>
          <span className="font-display text-[16px] font-bold tracking-[0.25em] bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            SENTINEL
          </span>
        </a>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
          {nav.map((l) => (
            <a
              key={l}
              href="#"
              className="group relative text-[12px] uppercase tracking-[0.2em] text-white/50 hover:text-white transition"
              data-magnetic="true"
            >
              {l}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-cyber transition-all group-hover:w-full" />
            </a>
          ))}
        </nav>

        <button className="relative overflow-hidden rounded-full px-6 py-2 text-[12px] font-bold uppercase tracking-widest text-neutral-900 transition-all hover:scale-105 active:scale-95" data-magnetic="true">
          <div className="absolute inset-0 bg-white" />
          <span className="relative z-10">Access Console</span>
        </button>
      </motion.header>

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pb-20 pt-32 text-center">
        
        {/* Status Badge */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 flex items-center gap-2 rounded-full border border-cyber/30 bg-cyber/5 px-4 py-1.5 backdrop-blur-md"
        >
            <div className="h-1.5 w-1.5 rounded-full bg-cyber animate-pulse shadow-[0_0_8px_oklch(0.78_0.14_200)]" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyber/80">
                Core Network Secured
            </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="font-display max-w-5xl text-white text-[clamp(2.5rem,8vw,7.5rem)] font-bold leading-[0.95] tracking-[-0.04em]"
        >
          Absolute security,
          <br />
          for the{" "}
          <span className="relative inline-flex h-[0.82em] w-[1.6em] -mb-[0.05em] overflow-hidden rounded-xl ring-1 ring-white/10 align-baseline shadow-[0_20px_40px_-10px_rgba(0,0,0,0.8)]">
            <img
              src={chipArt}
              alt=""
              className="h-full w-full object-cover scale-110"
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-cyber/20 via-transparent to-white/10" />
          </span>{" "}
          NextGen.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 max-w-xl text-[16px] leading-relaxed text-white/50"
        >
          Deploying autonomous AI sentinels to guard your digital vaults. 
          Real-time malware suppression and predictive network shielding across the global grid.
        </motion.p>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.75 }}
            className="mt-10 flex flex-wrap justify-center gap-5"
        >
            <button
                className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-[13px] font-bold uppercase tracking-widest text-neutral-900 shadow-[0_20px_40px_-12px_rgba(120,220,220,0.4)] transition hover:bg-neutral-100 hover:scale-105"
                data-magnetic="true"
            >
                Initialize Scan
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </button>
            <button
                className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-[13px] font-bold uppercase tracking-widest text-white backdrop-blur-md transition hover:bg-white/10"
                data-magnetic="true"
            >
                View Vaults
                <Lock className="h-4 w-4 text-cyber/60" />
            </button>
        </motion.div>

        {/* Framed centerpiece */}
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.4, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-24 w-full max-w-5xl"
        >
          {/* Spotlight halo behind frame */}
          <div className="absolute -inset-x-40 -top-20 -bottom-20 -z-10 rounded-[100px] bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.14_200/0.15),transparent_70%)] blur-3xl" />

          <div className="perspective-2000">
            <GlassCard className="p-3 sm:p-4 bg-black/60">
              <div className="relative overflow-hidden rounded-2xl aspect-[16/9] w-full bg-neutral-900 shadow-inner">
                <img
                  src={neonArt}
                  alt="Sentinel Command Center"
                  className="block h-full w-full object-cover opacity-90 transition-transform duration-[3s] hover:scale-105"
                />
                
                {/* HUD Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40" />
                
                <div className="absolute top-8 right-8">
                    <div className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-1.5 backdrop-blur-md">
                        <Zap className="h-3 w-3 text-red-500" />
                        <span className="font-mono text-[9px] font-bold text-red-500 uppercase tracking-tighter">
                            Active Threats: 0
                        </span>
                    </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between">
                  <div className="flex flex-col gap-3">
                    <div className="font-mono text-[10px] text-cyber tracking-[0.3em] uppercase">Security Level: Maximum</div>
                    <div className="flex gap-1">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className={`h-1.5 w-6 rounded-full ${i < 8 ? 'bg-cyber shadow-[0_0_8px_oklch(0.78_0.14_200)]' : 'bg-white/10'}`} />
                        ))}
                    </div>
                  </div>
                  <div className="font-mono text-[10px] text-white/30 text-right">
                    LATENCY: 4MS<br />
                    UPTIME: 142D 06H
                  </div>
                </div>

                {/* Scanline Effect */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] opacity-20" />
              </div>
            </GlassCard>
          </div>

          {/* Floor reflection */}
          <div
            className="absolute left-1/2 top-full h-40 w-[90%] -translate-x-1/2 opacity-20"
            style={{
              background:
                "radial-gradient(ellipse at top, oklch(0.78 0.14 200 / 0.3), transparent 75%)",
              filter: "blur(30px)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
