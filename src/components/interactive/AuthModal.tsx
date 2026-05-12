"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, X, Lock, Mail, User, ArrowRight, Fingerprint, Globe, RefreshCcw, KeyRound, ChevronLeft } from "lucide-react";
import neonArt from "@/assets/neon.jpg";
import api from "@/lib/api";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
}

type Mode = "login" | "signup" | "otp" | "forgot" | "reset";

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
      const res = await api.post("/auth/signup", { username, email, password });
      if (res.data.offline) {
          setError("VERIFICATION_OFFLINE: Use emergency code '7777'.");
      }
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
    setInfo("");
    try {
      const res = await api.post("/auth/login", { email, password });
      if (res.data.message === '2FA_REQUIRED') {
          setMode("otp");
          if (res.data.offline) setError("TRANSMISSION_OFFLINE: Use code '7777'.");
          return;
      }
      // Direct success (shouldn't happen with mandatory 2FA but good for safety)
      localStorage.setItem("accessToken", res.data.accessToken);
      onSuccess(res.data.user);
      onClose();
    } catch (err: any) {
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setInfo("");
    try {
        const res = await api.post("/auth/forgot-password", { email });
        if (res.data.offline) setError("TRANSMISSION_OFFLINE: Use code '7777'.");
        setMode("reset");
    } catch (err: any) {
        setError(err.response?.data?.message || err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
        await api.post("/auth/reset-password", { email, otp, newPassword });
        setInfo("CREDENTIALS_RECOVERED: You may now sign in.");
        setMode("login");
        setOtp("");
        setPassword("");
    } catch (err: any) {
        setError(err.response?.data?.message || err.message);
    } finally {
        setLoading(false);
    }
  };

  const handleResendOTP = async () => {
      setResending(true);
      setError("");
      setInfo("");
      try {
          const type = mode === 'reset' ? 'RESET' : mode === 'otp' ? '2FA' : 'VERIFICATION';
          await api.post("/auth/resend-otp", { email, type });
          setInfo("New security code transmitted.");
      } catch (err: any) {
          setError(err.response?.data?.message || "Failed to resend code.");
      } finally {
          setResending(false);
      }
  };

  const resetState = (newMode: Mode) => {
      setMode(newMode);
      setError("");
      setInfo("");
      setOtp("");
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
            className="relative w-full max-w-[960px] min-h-[640px] flex overflow-hidden rounded-[32px] bg-[#050505] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]"
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
                    <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-tight text-white mb-6 uppercase">
                        Absolute<br />Access<br />Control
                    </h2>
                    <p className="text-white/40 text-sm leading-relaxed max-w-[280px]">
                        Cryptographically secure multi-factor authentication for every mission.
                    </p>
                </div>
            </div>

            {/* Right Panel: Auth Form */}
            <div className="relative w-full md:w-1/2 flex flex-col p-8 sm:p-12 md:p-16">
                <button 
                    onClick={onClose}
                    className="absolute top-8 right-8 p-2 text-white/20 hover:text-white hover:bg-white/5 rounded-full transition-all"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-2">
                        {(mode !== 'login' && mode !== 'signup') && (
                            <button onClick={() => resetState(mode === 'reset' ? 'forgot' : 'login')} className="p-1 -ml-1 text-white/40 hover:text-cyber transition-colors">
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                        )}
                        <h3 className="font-display text-3xl font-bold text-white uppercase">
                            {mode === 'otp' ? 'VERIFY' : mode === 'login' ? 'Authorise' : mode === 'signup' ? 'REGISTER' : mode === 'forgot' ? 'RECOVER' : 'RESET'}
                        </h3>
                    </div>
                    <p className="text-white/40 text-sm">
                        {mode === 'otp' ? 'MFA Protocol Initiated.' : mode === 'login' ? 'Please enter your operator credentials.' : mode === 'signup' ? 'Initialise your security profile.' : 'Initialise credential recovery.'}
                    </p>
                </div>

                {error && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed"
                    >
                        {error}
                    </motion.div>
                )}

                {info && (
                    <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-6 p-4 rounded-xl bg-cyber/10 border border-cyber/20 text-cyber text-[10px] font-bold uppercase tracking-widest"
                    >
                        {info}
                    </motion.div>
                )}

                <form 
                    onSubmit={(e) => {
                        if (mode === 'login') handleLogin(e);
                        else if (mode === 'signup') handleSignup(e);
                        else if (mode === 'otp') handleVerifyOTP(e);
                        else if (mode === 'forgot') handleForgotPassword(e);
                        else handleResetPassword(e);
                    }} 
                    className="space-y-6 flex-grow"
                >
                    {mode === 'signup' && (
                        <FormInput label="Username" icon={User} value={username} onChange={setUsername} placeholder="OPERATOR_ID" />
                    )}

                    {(mode !== 'otp' && mode !== 'reset') && (
                        <FormInput label="Email Address" icon={Mail} value={email} onChange={setEmail} type="email" placeholder="protocol@sentinel.sys" />
                    )}

                    {(mode === 'login' || mode === 'signup') && (
                        <FormInput label="Password" icon={Lock} value={password} onChange={setPassword} type="password" placeholder="••••••••" />
                    )}

                    {mode === 'login' && (
                        <div className="flex justify-end -mt-4">
                            <button 
                                type="button" 
                                onClick={() => resetState("forgot")}
                                className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 hover:text-cyber transition-colors"
                            >
                                Forgot Password?
                            </button>
                        </div>
                    )}

                    {mode === 'forgot' && (
                        <div className="space-y-4">
                            <p className="text-white/40 text-[11px] leading-relaxed italic">
                                Note: Recovery requires access to your registered mission-critical terminal (email).
                            </p>
                            <button 
                                type="button" 
                                onClick={() => resetState("login")}
                                className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border border-white/5 bg-white/[0.02] text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-all"
                            >
                                <KeyRound className="h-3 w-3" />
                                I remember my password
                            </button>
                        </div>
                    )}

                    {mode === 'reset' && (
                        <div className="space-y-6">
                            <FormInput label="New Password" icon={Lock} value={newPassword} onChange={setNewPassword} type="password" placeholder="••••••••" />
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1 text-center block">Recovery Code</label>
                                <div className="flex justify-center">
                                    <OTPInput value={otp} onChange={setOtp} />
                                </div>
                            </div>
                        </div>
                    )}

                    {mode === 'otp' && (
                        <div className="space-y-6 text-center">
                            <p className="text-white/40 text-sm leading-relaxed">
                                Transmission sent to <span className="text-cyber font-bold">{email}</span>.
                            </p>
                            <div className="flex justify-center">
                                <OTPInput value={otp} onChange={setOtp} />
                            </div>
                            <button
                                type="button"
                                disabled={resending}
                                onClick={handleResendOTP}
                                className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20 hover:text-white transition-colors disabled:opacity-50"
                            >
                                <RefreshCcw className={`h-3 w-3 ${resending ? 'animate-spin' : ''}`} />
                                {resending ? 'Transmitting...' : 'Resend Protocol'}
                            </button>
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full relative group overflow-hidden rounded-2xl bg-white text-black py-4 font-bold uppercase tracking-[0.2em] text-xs transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-[0_20px_40px_-15px_rgba(255,255,255,0.2)]"
                        data-magnetic="true"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? 'Processing...' : mode === 'login' ? 'Confirm Identity' : mode === 'signup' ? 'Request Access' : mode === 'forgot' ? 'Initialise Recovery' : mode === 'reset' ? 'Finalise Reset' : 'Verify Protocol'}
                            {!loading && <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />}
                        </span>
                        <div className="absolute inset-0 bg-cyber/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </form>

                <div className="mt-8 flex flex-col items-center gap-4">
                    {(mode === 'login' || mode === 'signup') && (
                        <button 
                            onClick={() => resetState(mode === 'login' ? 'signup' : 'login')}
                            className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors"
                        >
                            {mode === 'login' ? "New here? Initialise Account" : "Already authorized? Sign In"}
                        </button>
                    )}

                    {/* Meta Info */}
                    <div className="mt-6 flex gap-6">
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

function FormInput({ label, icon: Icon, ...props }: any) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">{label}</label>
            <div className="group relative">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/20 group-focus-within:text-cyber transition-colors" />
                <input
                    {...props}
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 pl-12 text-sm text-white focus:outline-none focus:border-cyber/50 focus:bg-white/[0.05] transition-all placeholder:text-white/10"
                    onChange={(e) => props.onChange(e.target.value)}
                />
            </div>
        </div>
    )
}

function OTPInput({ value, onChange }: { value: string, onChange: (v: string) => void }) {
    return (
        <input
            required
            autoFocus
            maxLength={4}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-48 bg-white/[0.03] border border-white/10 rounded-2xl p-6 font-display text-4xl font-bold text-center text-cyber tracking-[12px] focus:outline-none focus:border-cyber transition-all shadow-[0_0_30px_-10px_rgba(120,220,220,0.2)]"
            placeholder="0000"
        />
    )
}
