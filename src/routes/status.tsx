import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Clock, Zap } from "lucide-react";
import { Atmosphere } from "@/components/site/Atmosphere";
import { GlassCard } from "@/components/interactive/GlassCard";

export const Route = createFileRoute("/status")({
  component: StatusPage,
});

function StatusPage() {
  const components = [
    { name: "API Core", status: "operational", uptime: "100%" },
    { name: "Global Edge Network", status: "operational", uptime: "99.99%" },
    { name: "AI Scanning Engine", status: "operational", uptime: "100%" },
    { name: "Database Vaults", status: "operational", uptime: "100%" },
    { name: "Reporting Service", status: "degraded", uptime: "98.5%" },
    { name: "Auth Service", status: "operational", uptime: "100%" },
  ];

  const incidents = [
    {
      title: "Reporting Service Degradation",
      date: "May 11, 2026",
      status: "Investigating",
      body: "We are observing increased latency in report generation. Our engineers are investigating the root cause in the EU-West-1 region.",
    },
    {
      title: "Planned Maintenance",
      date: "May 08, 2026",
      status: "Completed",
      body: "Database migration completed successfully. No downtime was observed during the operation.",
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black pt-32 pb-20">
      <Atmosphere />
      
      <div className="relative z-10 mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white mb-8">
            System Status.
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 p-6 rounded-[32px] bg-cyber/10 border border-cyber/30 backdrop-blur-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyber/20">
                <CheckCircle2 className="h-6 w-6 text-cyber animate-pulse" />
            </div>
            <div>
                <div className="text-white font-bold text-lg tracking-tight uppercase">Most Systems Operational</div>
                <div className="text-cyber/60 font-mono text-[11px] uppercase tracking-widest">Global Uptime: 99.98%</div>
            </div>
            <div className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                <Clock className="h-4 w-4 text-white/40" />
                <span className="font-mono text-xs text-white/60">Live Updates Enabled</span>
            </div>
          </div>
        </motion.div>

        {/* Component Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
          {components.map((c, i) => (
            <motion.div
              key={c.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors"
            >
              <div className="flex items-center gap-4">
                {c.status === 'operational' ? (
                    <CheckCircle2 className="h-5 w-5 text-cyber/80" />
                ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-500" />
                )}
                <span className="text-white font-medium">{c.name}</span>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-mono text-[10px] text-white/30 uppercase">{c.uptime}</span>
                <span className={`text-[11px] font-bold uppercase tracking-widest ${c.status === 'operational' ? 'text-cyber' : 'text-amber-500'}`}>
                    {c.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Incidents */}
        <div className="space-y-8">
            <h2 className="font-display text-3xl font-bold text-white tracking-tight px-2">Incident History</h2>
            {incidents.map((incident, i) => (
                <motion.div
                    key={incident.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                >
                    <GlassCard>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">{incident.title}</h3>
                                <span className="text-[10px] font-mono text-white/40 uppercase">{incident.date}</span>
                            </div>
                            <div className="inline-flex w-fit px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-bold uppercase text-cyber tracking-widest">
                                Status: {incident.status}
                            </div>
                            <p className="text-white/50 text-sm leading-relaxed max-w-2xl">
                                {incident.body}
                            </p>
                        </div>
                    </GlassCard>
                </motion.div>
            ))}
        </div>
      </div>
    </main>
  );
}
