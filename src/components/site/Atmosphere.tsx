import { motion } from "framer-motion";

/**
 * Cinematic background layers: aurora, fog, grid, floating particles.
 * Pure CSS/SVG — no WebGL needed for the atmospheric mood.
 */
export function Atmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden noise">
      {/* Aurora glow */}
      <div className="absolute inset-0 bg-aurora animate-drift" />

      {/* Animated grid floor */}
      <div className="absolute inset-0 grid-bg opacity-70" />

      {/* Bottom fog */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-fog" />

      {/* Horizon glow line */}
      <div className="absolute left-1/2 top-[58%] -translate-x-1/2 h-px w-[80%] bg-gradient-to-r from-transparent via-cyber/60 to-transparent blur-[1px]" />
      <div className="absolute left-1/2 top-[58%] -translate-x-1/2 h-[2px] w-[40%] bg-gradient-to-r from-transparent via-cyber to-transparent" />

      {/* Floating orbs */}
      <motion.div
        className="absolute left-[10%] top-[28%] h-72 w-72 rounded-full bg-cyber/20 blur-3xl"
        animate={{ y: [0, -30, 0], x: [0, 12, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[8%] top-[18%] h-96 w-96 rounded-full bg-accent/25 blur-3xl"
        animate={{ y: [0, 25, 0], x: [0, -18, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 top-[72%] -translate-x-1/2 h-[420px] w-[640px] rounded-full bg-cyber-glow/15 blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Particles */}
      <Particles />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.08_0.02_250)_100%)]" />
    </div>
  );
}

function Particles() {
  // Deterministic positions so SSR/client match
  const dots = Array.from({ length: 36 }, (_, i) => {
    const x = (i * 137.5) % 100;
    const y = (i * 61.7) % 100;
    const size = 1 + ((i * 13) % 3);
    const delay = (i % 7) * 0.6;
    const dur = 6 + (i % 5);
    return { x, y, size, delay, dur, key: i };
  });
  return (
    <>
      {dots.map((d) => (
        <motion.span
          key={d.key}
          className="absolute rounded-full bg-cyber"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            boxShadow: "0 0 8px currentColor",
            color: "var(--cyber)",
          }}
          animate={{ opacity: [0.15, 0.9, 0.15], y: [0, -14, 0] }}
          transition={{
            duration: d.dur,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
}
