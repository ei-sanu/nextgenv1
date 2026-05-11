import { motion } from "framer-motion";
import { ArrowUpRight, Shield } from "lucide-react";

export function CtaFooter() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
        >
          <div className="text-[11px] uppercase tracking-[0.3em] text-cyber mb-6">
            · Step into the console
          </div>
          <h2 className="font-display text-5xl md:text-8xl font-semibold leading-[0.95] tracking-[-0.04em] text-gradient">
            Defend at the<br />speed of light.
          </h2>
          <p className="mx-auto mt-8 max-w-lg text-muted-foreground">
            Provision your first scan in under sixty seconds. No agents, no
            friction — just luminous, continuous protection.
          </p>
          <div className="mt-10 flex justify-center gap-3">
            <button className="group inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background hover:opacity-90 transition">
              Launch console
              <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>
            <button className="glass rounded-full px-7 py-3.5 text-sm font-medium hover:bg-white/10 transition">
              Talk to security team
            </button>
          </div>
        </motion.div>

        <footer className="mt-32 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-10 text-xs text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyber" />
            <span className="font-display tracking-tight text-foreground">
              AEGIS<span className="text-cyber">.</span>
            </span>
            <span className="ml-3">© 2026 — Cinematic security, made luminous.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Security</a>
            <a href="#" className="hover:text-foreground">Status</a>
            <a href="#" className="hover:text-foreground">Docs</a>
          </div>
        </footer>
      </div>
    </section>
  );
}
