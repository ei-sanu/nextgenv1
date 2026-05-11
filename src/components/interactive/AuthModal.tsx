"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X, Lock, Mail, User, ArrowRight, Fingerprint, Globe } from "lucide-react";
import neonArt from "@/assets/neon.jpg";
import api from "@/lib/api";

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
      await api.post("/auth/signup", { username, email, password });
      setMode("otp");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", res.data.accessToken);
      onSuccess(res.data.user);
      onClose();
    } catch (err: any) {
      if (err.response?.status === 403) setMode("otp");
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      localStorage.setItem("accessToken", res.data.accessToken);
      onSuccess(res.data.user);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-2xl"
          />
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-[960px] min-h-[600px] flex overflow-hidden rounded-[32px] bg-[#050505] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]"
          >
            {/* Left Panel: Visual Atmosphere */}
            <div className="relative hidden md:flex w-1/2 overflow-hidden border-r border-white/5">
                <img 
                    src={neonArt} 
                    alt="" 
                    className="absolute inset-0 h-full w-full object-cover opacity-60 mix-blend-screen"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-transparent" />
                <div className="absolute inset-0 noise opacity-20" />
                
                <div className="relative z-10 p-12 mt-auto">
                    <div className="flex items-center gap-3 mb-8">
                        <Shield className="h-6 w-6 text-cyber" />
                        <span className="font-display text-xl font-bold tracking-[0.2em] text-white">SENTINEL</span>
                    </div>
                    <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-white mb-6">
                        CONNECT<br />BEYOND<br />BOUNDARIES
                    </h2>
                    <p className="text-white/40 text-sm leading-relaxed max-w-[280px]">
                        Absolute security and real-time collaboration for teams who demand excellence.
                    </p>
                </div>
                
                {/* HUD Decor */}
                <div className="absolute top-8 left-8 h-px w-12 bg-cyber/40" />
                <div className="absolute top-8 left-8 w-px h-12 bg-cyber/40" />
            </div>

            {/* Right Panel: Auth Form */}
            <div className="relative w-full md:w-1/2 flex flex-col p-8 sm:p-12 md:p-16">
                <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-full transition-all"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-12">
                    <h3 className="font-display text-3xl font-bold text-white mb-2">
                        {mode === 'otp' ? 'Verification' : mode === 'login' ? 'Sign in to SENTINEL' : 'Join the Network'}
                    </h3>
                    <p className="text-white/40 text-sm">
                        {mode === 'login' ? 'Welcome back! Please enter your details.' : 'Initialise your security protocol today.'}
                    </p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest"
                    >
                        {error}
                    </motion.div>
                )}

                <form onSubmit={mode === 'login' ? handleLogin : mode === 'signup' ? handleSignup : handleVerifyOTP} className="space-y-6 flex-grow">
                    {mode === 'signup' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Username</label>
                            <div className="group relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyber transition-colors" />
                                <input
                                    required
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 pl-12 text-sm text-white focus:outline-none focus:border-cyber/50 focus:bg-white/[0.05] transition-all"
                                    placeholder="SENTINEL_OPERATOR"
                                />
                            </div>
                        </div>
                    )}

                    {mode !== 'otp' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Email Address</label>
                            <div className="group relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyber transition-colors" />
                                <input
                                    required
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 pl-12 text-sm text-white focus:outline-none focus:border-cyber/50 focus:bg-white/[0.05] transition-all"
                                    placeholder="protocol@sentinel.sys"
                                />
                            </div>
                        </div>
                    )}

                    {mode !== 'otp' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Password</label>
                            <div className="group relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyber transition-colors" />
                                <input
                                    required
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 pl-12 text-sm text-white focus:outline-none focus:border-cyber/50 focus:bg-white/[0.05] transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    )}

                    {mode === 'otp' && (
                        <div className="space-y-6">
                            <p className="text-white/40 text-sm leading-relaxed">
                                A 4-digit security code has been transmitted to <span className="text-cyber font-bold">{email}</span>.
                            </p>
                            <div className="flex justify-center">
                                <input
                                    required
                                    autoFocus
                                    maxLength={4}
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-48 bg-white/[0.03] border border-white/10 rounded-2xl p-6 font-display text-4xl font-bold text-center text-cyber tracking-[12px] focus:outline-none focus:border-cyber transition-all"
                                    placeholder="0000"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full relative group overflow-hidden rounded-2xl bg-white text-black py-4 font-bold uppercase tracking-[0.2em] text-xs transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        data-magnetic="true"
                    >
                        <span className="relative z-10">
                            {loading ? 'Processing...' : mode === 'login' ? 'Authorise Identity' : mode === 'signup' ? 'Request Access' : 'Confirm Protocol'}
                        </span>
                        <div className="absolute inset-0 bg-cyber/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </form>

                <div className="mt-8 flex flex-col items-center gap-4">
                    <button 
                        onClick={() => {
                            setMode(mode === 'login' ? 'signup' : 'login');
                            setError("");
                        }}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors"
                    >
                        {mode === 'login' ? "New here? Initialise Account" : "Already authorized? Sign In"}
                    </button>

                    {/* Meta Info */}
                    <div className="mt-8 flex gap-6">
                        <div className="flex items-center gap-2">
                            <Fingerprint className="h-3 w-3 text-cyber/40" />
                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">AES-256</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Globe className="h-3 w-3 text-cyber/40" />
                            <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest">Global Auth</span>
                        </div>
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
