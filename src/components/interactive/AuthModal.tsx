"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X, Lock, Mail, User, ArrowRight, Terminal } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMode("otp");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
          if (res.status === 403) setMode("otp");
          throw new Error(data.message);
      }
      localStorage.setItem("token", data.token);
      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.setItem("token", data.token);
      onSuccess(data.user);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="relative w-full max-w-[480px] bg-[#f8f7f2] border-[3px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 sm:p-10"
          >
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-6 right-6 p-2 border-2 border-black hover:bg-black hover:text-white transition-colors"
            >
                <X className="h-5 w-5" />
            </button>

            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 bg-[#22c55e] text-black px-4 py-1.5 border-[2px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                <div className="h-2 w-2 rounded-full bg-black animate-pulse" />
                <span className="font-mono text-[11px] font-black uppercase tracking-widest">Secure Access</span>
            </div>

            <div className="mb-10">
                <h2 className="font-display text-4xl font-black text-black tracking-tight uppercase mb-2">
                    {mode === 'otp' ? 'VERIFY CODE' : 'AUTHENTICATE'}
                </h2>
                <div className="flex items-center gap-2 text-black/40 font-mono text-xs">
                    <Terminal className="h-3 w-3" />
                    <span>$ sudo login --secure-mode</span>
                </div>
            </div>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-red-500 text-white p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 font-mono text-[10px] uppercase font-bold"
                >
                    ERROR: {error}
                </motion.div>
            )}

            <form onSubmit={mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handleVerifyOTP} className="space-y-6">
              {mode === 'signup' && (
                <div className="space-y-2">
                    <label className="block font-mono text-[10px] font-black uppercase text-black/60 tracking-widest">Username</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                        <input
                            required
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-white border-[2px] border-black p-4 pl-12 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                            placeholder="OPERATOR_NAME"
                        />
                    </div>
                </div>
              )}

              {mode !== 'otp' && (
                <div className="space-y-2">
                    <label className="block font-mono text-[10px] font-black uppercase text-black/60 tracking-widest">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                        <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white border-[2px] border-black p-4 pl-12 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                            placeholder="protocol@sentinel.sys"
                        />
                    </div>
                </div>
              )}

              {mode !== 'otp' && (
                <div className="space-y-2">
                    <label className="block font-mono text-[10px] font-black uppercase text-black/60 tracking-widest">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-black/30" />
                        <input
                            required
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white border-[2px] border-black p-4 pl-12 font-mono text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                            placeholder="••••••••"
                        />
                    </div>
                </div>
              )}

              {mode === 'otp' && (
                <div className="space-y-4">
                    <p className="text-black/60 font-mono text-[11px] leading-relaxed">
                        A 4-digit security code has been transmitted to <span className="text-black font-black underline">{email}</span>. Enter it below to complete verification.
                    </p>
                    <div className="flex justify-center">
                        <input
                            required
                            autoFocus
                            maxLength={4}
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-48 bg-white border-[3px] border-black p-6 font-display text-4xl font-black text-center tracking-[12px] focus:outline-none focus:shadow-[6px_6px_0px_0px_rgba(34,197,94,1)] transition-shadow"
                            placeholder="0000"
                        />
                    </div>
                </div>
              )}

              <button
                disabled={loading}
                className="w-full group flex items-center justify-center gap-3 bg-black text-white p-5 border-2 border-black hover:bg-white hover:text-black transition-all disabled:opacity-50"
              >
                <span className="font-mono text-sm font-black uppercase tracking-[0.2em]">
                  {loading ? 'Processing...' : mode === 'login' ? 'Confirm Identity' : mode === 'signup' ? 'Register Account' : 'Verify Protocol'}
                </span>
                {!loading && <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t-[2px] border-black/5 flex flex-col gap-4">
                <button 
                    onClick={() => {
                        setMode(mode === 'login' ? 'signup' : 'login');
                        setError("");
                    }}
                    className="font-mono text-[10px] font-black uppercase text-black/40 hover:text-black transition-colors tracking-widest text-center"
                >
                    {mode === 'login' ? "Don't have access? Register" : "Already authorized? Login"}
                </button>
            </div>

            {/* Footer Tech Stack */}
            <div className="mt-10 bg-black p-4 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <Lock className="h-3 w-3 text-[#22c55e]" />
                    <span className="font-mono text-[9px] text-[#22c55e] uppercase font-bold">Encryption: AES-256</span>
                </div>
                <div className="flex items-center gap-2">
                    <Shield className="h-3 w-3 text-[#22c55e]" />
                    <span className="font-mono text-[9px] text-[#22c55e] uppercase font-bold">Security: Maximum</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-1 w-1 bg-[#22c55e] rounded-full" />
                    <span className="font-mono text-[9px] text-[#22c55e] uppercase font-bold">Authentication: Sentinel Auth v2</span>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
