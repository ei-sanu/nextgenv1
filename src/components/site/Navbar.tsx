import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { label: "Platform", href: "/" },
  { label: "Web Scan", href: "/" },
  { label: "Network", href: "/" },
  { label: "Threat Intel", href: "/" },
  { label: "Pricing", href: "/" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav className="glass-strong w-full max-w-6xl rounded-full px-4 py-2.5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-2.5 pl-2">
            <div className="relative">
              <div className="absolute inset-0 blur-md bg-cyber/60 rounded-full" />
              <Shield className="relative h-5 w-5 text-cyber" strokeWidth={2.2} />
            </div>
            <span className="font-display text-[15px] font-semibold tracking-tight">
              AEGIS<span className="text-cyber">.</span>
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1 text-[13px] text-muted-foreground">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className="px-3 py-2 rounded-full transition-colors hover:text-foreground hover:bg-white/5"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-2">
            <button className="text-[13px] text-muted-foreground hover:text-foreground px-3 py-2 transition">
              Sign in
            </button>
            <button className="relative text-[13px] font-medium px-4 py-2 rounded-full bg-foreground text-background hover:opacity-90 transition">
              Launch console
            </button>
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setOpen((v) => !v)}
            aria-label="menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-3 flex flex-col gap-1 pb-2"
          >
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                {l.label}
              </a>
            ))}
            <button className="mt-2 text-sm font-medium px-4 py-2.5 rounded-xl bg-foreground text-background">
              Launch console
            </button>
          </motion.div>
        )}
      </nav>
    </motion.header>
  );
}
