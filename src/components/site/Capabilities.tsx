import { motion } from "framer-motion";
import { Globe, Network, Bug, ShieldCheck, Cpu, LineChart } from "lucide-react";

const items = [
  {
    icon: Globe,
    title: "Web vulnerability scanning",
    desc: "OWASP Top 10, XSS, SQLi, SSRF and full TLS posture in one continuous sweep.",
  },
  {
    icon: Network,
    title: "Network reconnaissance",
    desc: "Port enumeration, service fingerprints and CVE heatmaps across your perimeter.",
  },
  {
    icon: Bug,
    title: "Malware & threat analysis",
    desc: "Sandboxed detonation, redirect chains and DNS reputation timeline.",
  },
  {
    icon: ShieldCheck,
    title: "SAVE scoring engine",
    desc: "Proprietary security exposure index distilled from 400+ signal vectors.",
  },
  {
    icon: Cpu,
    title: "AI remediation copilot",
    desc: "Context-aware fixes, suggested patches and policy snippets generated live.",
  },
  {
    icon: LineChart,
    title: "Realtime analytics",
    desc: "Websocket-backed scan progress, live logs and exportable executive reports.",
  },
];

export function Capabilities() {
  return (
    <section className="relative px-6 py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="text-[11px] uppercase tracking-[0.25em] text-cyber mb-3">
              · The platform
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-[-0.03em] text-gradient max-w-2xl leading-[1]">
              One console.
              <br />
              Every attack surface.
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            Aegis unifies offensive scanning, defensive monitoring and AI
            remediation under one cinematic operations canvas — designed for
            teams who treat security as craft.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.06,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="group relative overflow-hidden rounded-2xl glass p-6 transition hover:border-cyber/30"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyber/0 blur-3xl transition group-hover:bg-cyber/15" />
              <div className="relative">
                <div className="mb-5 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10">
                  <it.icon className="h-4.5 w-4.5 text-cyber" />
                </div>
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {it.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {it.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
