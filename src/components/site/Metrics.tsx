import { motion } from "framer-motion";

const metrics = [
  { v: "2.4B", l: "Threat signals analysed daily" },
  { v: "98.7%", l: "Critical detection precision" },
  { v: "<40ms", l: "Median scan event latency" },
  { v: "190+", l: "Countries under continuous watch" },
];

export function Metrics() {
  return (
    <section className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl glass-strong rounded-3xl p-10 md:p-14 relative overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[120%] bg-cyber/10 blur-3xl" />
        <div className="relative grid grid-cols-2 gap-8 md:grid-cols-4">
          {metrics.map((m, i) => (
            <motion.div
              key={m.l}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
              className="text-center md:text-left"
            >
              <div className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-cyber-gradient">
                {m.v}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {m.l}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
