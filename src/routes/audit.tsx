import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  FileSearch,
  ShieldCheck,
  History,
  Download,
  Filter,
} from "lucide-react";
import { Atmosphere } from "@/components/site/Atmosphere";
import { GlassCard } from "@/components/interactive/GlassCard";

export const Route = createFileRoute("/audit")({
  component: AuditPage,
});

function AuditPage() {
  const logs = [
    {
      id: "TX-9021",
      action: "AI Scan Initiated",
      actor: "Sentinel-Core",
      time: "04:12:08",
      status: "success",
    },
    {
      id: "TX-9020",
      action: "Vault Access",
      actor: "Admin-Somesh",
      time: "03:55:21",
      status: "success",
    },
    {
      id: "TX-9019",
      action: "Threat Suppression",
      actor: "Sentinel-Edge",
      time: "02:14:10",
      status: "critical",
    },
    {
      id: "TX-9018",
      action: "API Key Rotation",
      actor: "System-Auth",
      time: "01:30:00",
      status: "success",
    },
    {
      id: "TX-9017",
      action: "Network Re-topology",
      actor: "Sentinel-Global",
      time: "00:45:12",
      status: "success",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black pt-32 pb-20">
      <Atmosphere />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyber/30 bg-cyber/5 px-4 py-1.5 backdrop-blur-md mb-6">
              <FileSearch className="h-3 w-3 text-cyber" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyber/80">
                Audit Trail: Online
              </span>
            </div>
            <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white mb-2">
              Absolute Audit.
            </h1>
            <p className="text-white/40 max-w-xl text-lg">
              Every movement, every decision, and every byte is tracked with
              cryptographic precision. Full transparency for mission-critical
              operations.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition"
              data-magnetic="true"
            >
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <button
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-cyber text-black text-xs font-bold uppercase tracking-widest hover:brightness-110 transition"
              data-magnetic="true"
            >
              <Download className="h-4 w-4" />
              Export Logs
            </button>
          </div>
        </motion.div>

        {/* Audit Log Table-like UI */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <GlassCard className="!p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-8 py-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                      ID
                    </th>
                    <th className="px-8 py-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                      Action
                    </th>
                    <th className="px-8 py-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                      Actor
                    </th>
                    <th className="px-8 py-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
                      Time (UTC)
                    </th>
                    <th className="px-8 py-5 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40 text-right">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {logs.map((log, i) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className="hover:bg-white/[0.03] transition-colors group"
                    >
                      <td className="px-8 py-6 font-mono text-xs text-white/40 group-hover:text-cyber transition-colors">
                        {log.id}
                      </td>
                      <td className="px-8 py-6 font-bold text-white tracking-wide">
                        {log.action}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-br from-white/10 to-transparent border border-white/10" />
                          <span className="text-sm text-white/60">
                            {log.actor}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-mono text-xs text-white/40 tabular-nums">
                        {log.time}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${
                            log.status === "success"
                              ? "bg-cyber/10 text-cyber border border-cyber/20"
                              : "bg-red-500/10 text-red-500 border border-red-500/20"
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </motion.div>

        {/* Audit Certifications */}
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
          <CertCard
            title="SOC 2 Type II"
            date="Compliant 2026"
            icon={ShieldCheck}
          />
          <CertCard title="ISO 27001" date="Certified 2025" icon={History} />
          <CertCard title="GDPR" date="Audited 2026" icon={ShieldCheck} />
        </div>
      </div>
    </main>
  );
}

function CertCard({
  title,
  date,
  icon: Icon,
}: {
  title: string;
  date: string;
  icon: any;
}) {
  return (
    <div className="flex items-center gap-4 p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
      <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10">
        <Icon className="h-5 w-5 text-cyber/40" />
      </div>
      <div>
        <div className="text-white font-bold text-sm uppercase tracking-widest">
          {title}
        </div>
        <div className="text-white/30 font-mono text-[10px] uppercase mt-1">
          {date}
        </div>
      </div>
    </div>
  );
}
