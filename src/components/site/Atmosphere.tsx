import { motion } from "framer-motion";

/**
 * Cinematic background system.
 * Unifies all ambient gradients, grids, fog, and floating elements
 * into a single seamless atmospheric layer.
 */
export function Atmosphere() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0">
      {/* 1. Deep Base Foundation - Prevents any transparent gaps */}
      <div className="absolute inset-0 bg-[#020202]" />

      {/* 2. Primary Ambient Light Leak (From top) */}
      <div 
        className="absolute inset-x-0 -top-[10%] h-[70%] opacity-50 mix-blend-screen"
        style={{
          background: "radial-gradient(ellipse 100% 80% at 50% 0%, oklch(0.32 0.05 255) 0%, transparent 100%)",
          filter: "blur(60px)"
        }}
      />

      {/* 3. Secondary Aurora Drift */}
      <div className="absolute inset-0 bg-aurora animate-drift opacity-30" />

      {/* 4. The Grid Grid System - Seamlessly masked */}
      <div 
        className="absolute inset-0 grid-bg"
        style={{
          opacity: 0.45,
          maskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black 10%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black 10%, transparent 90%)",
        }}
      />

      {/* 5. Atmospheric Fog - Deep bottom layer */}
      <div 
        className="absolute inset-x-0 bottom-0 h-[80%] opacity-80 mix-blend-multiply"
        style={{
            background: "linear-gradient(to top, oklch(0.12 0.02 255) 0%, transparent 100%)"
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-[40%] bg-fog opacity-60" />

      {/* 6. Horizon Glow Line - Blended into fog */}
      <div className="absolute left-1/2 top-[58%] -translate-x-1/2 h-px w-[80%] bg-gradient-to-r from-transparent via-cyber/30 to-transparent blur-[2px] opacity-40" />
      <div className="absolute left-1/2 top-[58%] -translate-x-1/2 h-[1.5px] w-[30%] bg-gradient-to-r from-transparent via-cyber/60 to-transparent opacity-30" />

      {/* 7. Floating Volumetric Orbs */}
      <motion.div
        className="absolute left-[10%] top-[20%] h-[500px] w-[500px] rounded-full bg-cyber/10 blur-[120px]"
        animate={{ y: [0, -40, 0], x: [0, 20, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[5%] top-[15%] h-[600px] w-[600px] rounded-full bg-accent/15 blur-[140px]"
        animate={{ y: [0, 30, 0], x: [0, -25, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-1/2 bottom-[10%] -translate-x-1/2 h-[400px] w-[80%] rounded-[100%] bg-cyber-glow/10 blur-[100px]"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* 8. Cinematic Particles */}
      <Particles />

      {/* 9. Final Unification Layers: Noise & Vignette */}
      <div className="absolute inset-0 noise opacity-[0.04] mix-blend-overlay" />
      <div 
        className="absolute inset-0"
        style={{
            background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.6) 100%)"
        }}
      />
    </div>
  );
}

function Particles() {
  const dots = Array.from({ length: 28 }, (_, i) => {
    const x = (i * 137.5) % 100;
    const y = (i * 61.7) % 100;
    const size = 1 + ((i * 7) % 2);
    const delay = (i % 6) * 0.8;
    const dur = 8 + (i % 6);
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
            boxShadow: "0 0 10px currentColor",
            color: "var(--cyber)",
            opacity: 0.2
          }}
          animate={{ opacity: [0.1, 0.5, 0.1], y: [0, -20, 0] }}
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
