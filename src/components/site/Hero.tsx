import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import frameArt from "@/assets/scene-temple.jpg";
import chipArt from "@/assets/hero-garden.jpg";
import { GlassCard } from "../interactive/GlassCard";

const nav = ["Platform", "Customers", "FAQ"];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
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
      <div
        className="absolute left-1/2 top-[8%] -z-0 h-[600px] w-[880px] -translate-x-1/2 rounded-[100%]"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.85 0.05 230 / 0.18), transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="absolute inset-0 noise" />

      {/* Top nav */}
      <motion.header
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-6 pt-7 sm:px-10"
      >
        <a className="flex items-center gap-2 text-white" data-magnetic="true">
          <Shield className="h-4 w-4 text-cyber" />
          <span className="font-display text-[15px] font-semibold tracking-[0.18em]">
            AEGIS
          </span>
        </a>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-9 md:flex">
          {nav.map((l) => (
            <a
              key={l}
              href="#"
              className="text-[13px] text-white/70 hover:text-white transition"
              data-magnetic="true"
            >
              {l}
            </a>
          ))}
        </nav>

        <button className="rounded-full bg-white/95 px-5 py-2 text-[13px] font-medium text-neutral-900 hover:bg-white transition" data-magnetic="true">
          Login
        </button>
      </motion.header>

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 pb-32 pt-20 text-center sm:pt-28">
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-display max-w-5xl text-white text-[clamp(2.5rem,7vw,6rem)] font-semibold leading-[1.02] tracking-[-0.035em]"
        >
          Detect, defend
          <br />
          and outpace{" "}
          <span className="relative inline-flex h-[0.85em] w-[1.5em] -mb-[0.08em] overflow-hidden rounded-md ring-1 ring-white/20 align-baseline shadow-[0_8px_24px_-6px_rgba(0,0,0,0.6)]">
            <img
              src={chipArt}
              alt=""
              className="h-full w-full object-cover"
              aria-hidden
            />
            <span className="absolute inset-0 bg-cyber/15 mix-blend-overlay" />
          </span>{" "}
          threats
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-7 max-w-md text-[14.5px] leading-relaxed text-white/65"
        >
          Continuous web, network and malware intelligence — orchestrated by
          autonomous AI agents inside one luminous command center.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55 }}
          className="group mt-9 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[13.5px] font-medium text-neutral-900 shadow-[0_18px_50px_-12px_rgba(120,220,220,0.35)] hover:bg-neutral-100 transition"
          data-magnetic="true"
        >
          Start scanning
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </motion.button>

        {/* Framed centerpiece */}
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16 w-full max-w-4xl"
        >
          {/* Spotlight halo behind frame */}
          <div className="absolute -inset-x-20 -top-10 -bottom-10 -z-10 rounded-[40px] bg-[radial-gradient(ellipse_at_center,oklch(0.78_0.14_200/0.25),transparent_65%)] blur-2xl" />

          <div className="perspective-1000">
            <GlassCard className="p-2 sm:p-2">
              <div className="relative overflow-hidden rounded-xl aspect-[16/9] w-full bg-black">
                <img
                  src={frameArt}
                  alt="Aegis security console"
                  className="block h-full w-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent mix-blend-multiply" />
                <div className="absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)] rounded-xl" />
                {/* HUD Elements */}
                <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                  <div className="font-mono text-xs text-cyber tracking-widest">SYSTEM.ONLINE</div>
                  <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-cyber w-2/3 shadow-[0_0_10px_oklch(0.78_0.14_200)]" />
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Floor reflection */}
          <div
            className="absolute left-1/2 top-full h-32 w-[80%] -translate-x-1/2 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse at top, oklch(0.78 0.14 200 / 0.4), transparent 70%)",
              filter: "blur(20px)",
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
