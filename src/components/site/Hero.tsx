import { motion } from "framer-motion";
import { Shield, ArrowRight, Zap, Lock } from "lucide-react";
import neonArt from "@/assets/neon.jpg";
import chipArt from "@/assets/hero-garden.jpg";

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

        {/* Heading with Neon Background */}
        <div className="relative group">
            {/* The Neon Background Image for the Text */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 0.4, scale: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 -z-10 h-[150%] w-full pointer-events-none blur-3xl"
            >
                <img 
                    src={neonArt} 
                    alt="" 
                    className="h-full w-full object-cover rounded-[100%] opacity-60"
                />
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
            className="mt-8 max-w-xl mx-auto text-[16px] leading-relaxed text-white/50"
            >
            Deploying autonomous AI sentinels to guard your digital vaults. 
            Real-time malware suppression and predictive network shielding across the global grid.
            </motion.p>
        </div>

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
      </div>
    </section>
  );
}
