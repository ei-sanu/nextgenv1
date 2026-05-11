import { createFileRoute, redirect } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Shield, Users, Server, Database, Activity, Terminal, AlertCircle } from "lucide-react";
import { Atmosphere } from "@/components/site/Atmosphere";
import { GlassCard } from "@/components/interactive/GlassCard";
import { useAuth } from "./__root";

export const Route = createFileRoute("/admin")({
  beforeLoad: ({ context }: any) => {
    if (typeof window !== 'undefined') {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        if (!user || user.email !== 'someshranjanbiswal13678@gmail.com') {
          throw redirect({ to: "/" });
        }
    }
  },
  component: AdminPage,
});

function AdminPage() {
  const stats = [
    { label: "Total Operators", value: "842", icon: Users },
    { label: "Active Nodes", value: "156", icon: Server },
    { label: "Database Health", value: "Optimum", icon: Database },
    { label: "System Load", value: "12%", icon: Activity },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black pt-32 pb-20">
      <Atmosphere />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/5 px-4 py-1.5 backdrop-blur-md mb-6">
            <Shield className="h-3 w-3 text-amber-500" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-amber-500/80">
              Admin Access Level: Alpha
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white mb-4">
            Sentinel Control<br />Panel.
          </h1>
          <p className="text-white/40 max-w-xl text-lg">
            Welcome back, Alpha-Operator. Global systems are currently running within expected parameters.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="!bg-white/5 border-white/10 hover:border-amber-500/30 transition-colors">
                <stat.icon className="h-5 w-5 text-amber-500/60 mb-4" />
                <div className="text-3xl font-black text-white tabular-nums">{stat.value}</div>
                <div className="text-[10px] font-mono text-white/30 uppercase tracking-widest mt-1">{stat.label}</div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <GlassCard className="!p-0">
                    <div className="p-6 border-b border-white/5 flex items-center justify-between">
                        <h2 className="font-display text-xl font-bold text-white uppercase tracking-tight">Active Deployments</h2>
                        <span className="px-3 py-1 rounded bg-green-500/10 text-green-500 text-[9px] font-black uppercase tracking-widest">Global Sync: Active</span>
                    </div>
                    <div className="p-8 font-mono text-[11px] text-white/40 space-y-4">
                        <div className="flex items-center gap-4">
                            <span className="text-cyber">READY</span>
                            <span className="text-white/20">|</span>
                            <span className="text-white/60">NODE-EU-W1</span>
                            <span className="ml-auto text-white/20">v2.4.1</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-cyber">READY</span>
                            <span className="text-white/20">|</span>
                            <span className="text-white/60">NODE-US-E2</span>
                            <span className="ml-auto text-white/20">v2.4.1</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1, repeat: Infinity }} className="text-amber-500 font-bold underline">SYNCING</motion.span>
                            <span className="text-white/20">|</span>
                            <span className="text-white/60">NODE-AP-S1</span>
                            <span className="ml-auto text-white/20">UPLOAD: 42%</span>
                        </div>
                    </div>
                </GlassCard>

                <div className="bg-amber-500/5 border border-amber-500/20 rounded-3xl p-8 flex items-start gap-6">
                    <AlertCircle className="h-6 w-6 text-amber-500 mt-1 flex-shrink-0" />
                    <div>
                        <h3 className="text-white font-bold mb-2 uppercase tracking-wide">Security Advisory</h3>
                        <p className="text-white/50 text-sm leading-relaxed">
                            A new vulnerability has been detected in the OpenSSH protocol (CVE-2026-X). AI Sentinels have already deployed patch v0.12.8 across all Tier 1 nodes. No action required.
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className="font-display text-xl font-bold text-white uppercase tracking-tight px-2">Console Operations</h3>
                <AdminAction label="Force Global Re-scan" color="cyber" />
                <AdminAction label="Rotate Alpha Keys" color="amber" />
                <AdminAction label="Purge Cache Vaults" color="red" />
                <AdminAction label="Initialize Deep-Check" color="white" />
            </div>
        </div>
      </div>
    </main>
  );
}

function AdminAction({ label, color }: { label: string, color: string }) {
    const colors: any = {
        cyber: 'bg-cyber/10 border-cyber/30 text-cyber hover:bg-cyber/20',
        amber: 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20',
        red: 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20',
        white: 'bg-white/5 border-white/20 text-white hover:bg-white/10'
    };
    return (
        <button className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between group ${colors[color]}`} data-magnetic="true">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.2em]">{label}</span>
            <Terminal className="h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity" />
        </button>
    );
}
