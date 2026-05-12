import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileText, Fingerprint } from "lucide-react";
import { Atmosphere } from "@/components/site/Atmosphere";
import { GlassCard } from "@/components/interactive/GlassCard";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  const sections = [
    {
      title: "Data Encryption",
      icon: Lock,
      content:
        "All data ingested by Sentinel is encrypted at rest using AES-256 and in transit via TLS 1.3. Your digital vaults are accessible only by authorized AI agents and verified human operators.",
    },
    {
      title: "Anonymized Intelligence",
      icon: Eye,
      content:
        "Threat signatures are shared across the grid anonymously. We prioritize the collective security of the NextGen without compromising individual identity or proprietary source code.",
    },
    {
      title: "Zero-Trust Architecture",
      icon: Fingerprint,
      content:
        "We operate on a zero-trust basis. Every request, every scan, and every agent activity is cryptographically verified before execution.",
    },
    {
      title: "Audit Transparency",
      icon: FileText,
      content:
        "Our privacy protocols are audited quarterly by third-party security firms. Detailed logs of all data access are available in your Audit console.",
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
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-cyber/30 bg-cyber/5 px-4 py-1.5 backdrop-blur-md mb-6">
            <Shield className="h-3 w-3 text-cyber" />
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cyber/80">
              Privacy Protocol v4.2
            </span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            Privacy as a<br />
            Foundation.
          </h1>
          <p className="text-white/50 max-w-2xl mx-auto text-lg">
            Sentinel is built on the principle that absolute security shouldn't
            cost you your privacy. We protect your systems while keeping your
            data under your control.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <GlassCard className="h-full">
                <div className="flex flex-col gap-6">
                  <div className="h-12 w-12 rounded-lg bg-cyber/10 border border-cyber/20 flex items-center justify-center">
                    <section.icon className="h-6 w-6 text-cyber" />
                  </div>
                  <h3 className="font-display text-2xl font-bold text-white tracking-wide">
                    {section.title}
                  </h3>
                  <p className="text-white/40 leading-relaxed text-sm">
                    {section.content}
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm text-center"
        >
          <p className="text-white/30 text-xs uppercase tracking-[0.3em] mb-4">
            Last Updated: May 12, 2026
          </p>
          <button
            className="text-cyber font-bold tracking-widest text-[11px] uppercase hover:underline"
            data-magnetic="true"
          >
            Download Full Privacy Framework (PDF)
          </button>
        </motion.div>
      </div>
    </main>
  );
}
