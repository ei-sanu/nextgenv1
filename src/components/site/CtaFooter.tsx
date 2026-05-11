import { motion } from "framer-motion";
import { ArrowUpRight, Shield, Globe, Lock } from "lucide-react";

export function CtaFooter() {
  return (
    <section className="relative px-6 py-40 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,oklch(0.32_0.05_255/0.1)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="mx-auto max-w-6xl text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyber/30 bg-cyber/5 px-4 py-1.5 backdrop-blur-md mb-8">
            <Globe className="h-3 w-3 text-cyber animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyber/80">
                Network Grid Active
            </span>
          </div>

          <h2 className="font-display text-6xl md:text-9xl font-bold leading-[0.9] tracking-[-0.05em] text-white">
            Secure the<br />NextGen.
          </h2>
          
          <p className="mx-auto mt-10 max-w-xl text-[17px] leading-relaxed text-white/50">
            Provision your first AI sentinel in under sixty seconds. 
            No friction, no lag — just absolute, autonomous protection for your entire digital stack.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-5">
            <button className="group relative overflow-hidden rounded-full bg-white px-10 py-4 text-sm font-bold uppercase tracking-widest text-neutral-900 transition hover:scale-105 active:scale-95" data-magnetic="true">
              Initialize Sentinel
              <ArrowUpRight className="inline-block ml-2 h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
            <button className="group flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-10 py-4 text-sm font-bold uppercase tracking-widest text-white backdrop-blur-md transition hover:bg-white/10" data-magnetic="true">
              Security Docs
              <Lock className="h-4 w-4 text-cyber/60" />
            </button>
          </div>
        </motion.div>

        {/* Floating Glass Accent */}
        <div className="absolute -top-20 -right-20 w-64 h-64 opacity-20 blur-3xl bg-cyber rounded-full pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 opacity-10 blur-3xl bg-blue-500 rounded-full pointer-events-none" />

        <footer className="mt-48 flex flex-col items-center justify-between gap-8 border-t border-white/5 pt-12 text-[11px] font-bold uppercase tracking-[0.2em] text-white/30 md:flex-row">
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-cyber" />
            <span className="font-display tracking-[0.3em] text-white">
              SENTINEL
            </span>
            <span className="ml-4 border-l border-white/10 pl-4 lowercase font-normal italic tracking-normal text-white/20">© 2026 — absolute security for the global grid.</span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-cyber transition-colors" data-magnetic="true">Privacy</a>
            <a href="#" className="hover:text-cyber transition-colors" data-magnetic="true">Network</a>
            <a href="#" className="hover:text-cyber transition-colors" data-magnetic="true">Status</a>
            <a href="#" className="hover:text-cyber transition-colors" data-magnetic="true">Audit</a>
          </div>
        </footer>
      </div>
    </section>
  );
}
