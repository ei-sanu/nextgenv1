import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Globe, Activity, Zap, Server, ShieldCheck } from "lucide-react";
import { Atmosphere } from "@/components/site/Atmosphere";
import { GlassCard } from "@/components/interactive/GlassCard";

export const Route = createFileRoute("/network")({
  component: NetworkPage,
});

function NetworkPage() {
  const stats = [
    { label: "Active Nodes", value: "1,284", icon: Server },
    { label: "Throughput", value: "48 TB/s", icon: Zap },
    { label: "Latency", value: "1.2ms", icon: Activity },
    { label: "Uptime", value: "99.999%", icon: ShieldCheck },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black pt-32 pb-20">
      <Atmosphere />
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.01),rgba(0,255,0,0.005),rgba(0,0,255,0.01))] bg-[length:100%_4px,4px_100%] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyber/30 bg-cyber/5 px-4 py-1.5 backdrop-blur-md mb-8">
            <Globe className="h-3 w-3 text-cyber animate-pulse" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyber/80">
              Global Grid Status: Active
            </span>
          </div>
          <h1 className="font-display text-6xl md:text-9xl font-bold tracking-tighter text-white mb-8">
            The Sentinel<br />Network.
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto text-xl leading-relaxed">
            A distributed mesh of AI-powered sentinels spanning 24 regions globally. 
            Instant threat suppression at the edge, before it even reaches your core.
          </p>
        </motion.div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard className="group">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <stat.icon className="h-5 w-5 text-cyber/60 group-hover:text-cyber transition-colors" />
                    <div className="h-1.5 w-1.5 rounded-full bg-cyber animate-ping" />
                  </div>
                  <div className="font-display text-4xl font-bold text-white tabular-nums">
                    {stat.value}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                    {stat.label}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Visual Map Placeholder */}
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="relative aspect-[21/9] w-full rounded-[40px] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-xl"
        >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,220,220,0.05)_0%,transparent_70%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <div className="font-mono text-[11px] text-cyber/40 uppercase tracking-[0.4em] mb-4">Initialising Real-time Topology</div>
                    <div className="flex gap-1 justify-center">
                        {[...Array(3)].map((_, i) => (
                            <motion.div 
                                key={i}
                                animate={{ opacity: [0.2, 1, 0.2] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                                className="h-1 w-8 bg-cyber/30 rounded-full" 
                            />
                        ))}
                    </div>
                </div>
            </div>
            {/* Random glowing nodes */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                    className="absolute h-1 w-1 bg-cyber rounded-full shadow-[0_0_10px_oklch(0.78_0.14_200)]"
                    style={{
                        top: `${20 + Math.random() * 60}%`,
                        left: `${10 + Math.random() * 80}%`,
                    }}
                />
            ))}
        </motion.div>
      </div>
    </main>
  );
}
