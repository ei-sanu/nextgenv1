"use client";

import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X, Activity, Globe, Lock, FileSearch, User as UserIcon, LogOut, Settings } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/routes/__root";

const links = [
  { label: "Privacy", href: "/privacy", icon: Lock },
  { label: "Network", href: "/network", icon: Globe },
  { label: "Status", href: "/status", icon: Activity },
  { label: "Audit", href: "/audit", icon: FileSearch },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, openAuth, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-[100] flex justify-center px-6 py-8 pointer-events-none"
    >
      <nav className={`
        pointer-events-auto w-full max-w-5xl rounded-[32px] px-6 py-3 transition-all duration-500
        ${scrolled 
          ? "bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]" 
          : "bg-black/25 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_-20px_rgba(0,0,0,0.7)]"}
      `}>
        <div className="flex items-center justify-between gap-10">
          <Link to="/" className="flex items-center gap-3 group" data-magnetic="true">
            <div className="relative">
              <div className="absolute inset-0 blur-lg bg-cyber/40 rounded-full group-hover:bg-cyber/60 transition-colors" />
              <Shield className="relative h-6 w-6 text-cyber transition-transform group-hover:scale-110" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[18px] font-bold tracking-[0.2em] text-white">
              SENTINEL
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-2">
            {links.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.href}
                  className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-white/75 transition-all hover:text-white hover:bg-white/10"
                  data-magnetic="true"
                  activeProps={{ className: "!text-cyber !bg-cyber/5 !border-cyber/20" }}
                >
                  <l.icon className="h-3.5 w-3.5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                  {l.label}
                </Link>
              </li>
            ))}
            {user?.role === 'admin' && (
              <li>
                <Link
                  to="/admin"
                  className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] text-amber-500 transition-all hover:text-amber-400 hover:bg-amber-500/5"
                  data-magnetic="true"
                  activeProps={{ className: "!text-amber-400 !bg-amber-500/10" }}
                >
                  <Settings className="h-3.5 w-3.5" />
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            {!user ? (
                <button 
                    onClick={openAuth}
                    className="relative group px-6 py-2.5 rounded-full bg-white text-black text-[11px] font-bold uppercase tracking-[0.2em] transition-transform hover:scale-105 active:scale-95 pointer-events-auto" 
                    data-magnetic="true"
                >
                    <span className="relative z-10">Access Protocol</span>
                    <div className="absolute inset-0 rounded-full bg-cyber/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            ) : (
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-1 pl-4 rounded-full">
                    <div className="flex flex-col items-start pr-2">
                        <span className="font-mono text-[9px] font-bold text-cyber uppercase tracking-tighter">Authorized User</span>
                        <span className="font-display text-[11px] font-bold text-white uppercase">{user.username}</span>
                    </div>
                    <button 
                        onClick={logout}
                        className="h-8 w-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                        title="Logout Protocol"
                    >
                        <LogOut className="h-4 w-4" />
                    </button>
                </div>
            )}
          </div>

          <button
            className="md:hidden p-2 text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-6 flex flex-col gap-2 pb-4 overflow-hidden"
            >
              {links.map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <l.icon className="h-4 w-4 text-cyber" />
                  {l.label}
                </Link>
              ))}
              {!user ? (
                <button 
                    onClick={() => { setOpen(false); openAuth(); }}
                    className="mt-4 w-full py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-[0.2em] text-sm"
                >
                    Launch Console
                </button>
              ) : (
                  <button 
                    onClick={() => { setOpen(false); logout(); }}
                    className="mt-4 w-full py-4 rounded-2xl bg-red-500 text-white font-bold uppercase tracking-[0.2em] text-sm"
                  >
                    Logout Protocol
                  </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
