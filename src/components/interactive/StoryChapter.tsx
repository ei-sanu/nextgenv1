import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { Shield, Target, Activity } from "lucide-react";

type Props = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  body: string;
  image: string;
  align?: "left" | "right";
  children?: ReactNode;
};

export function StoryChapter({
  index,
  eyebrow,
  title,
  body,
  image,
  align = "left",
  children,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const textY = useTransform(scrollYProgress, [0, 1], ["25%", "-25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section ref={ref} className="relative px-4 sm:px-10 py-12 sm:py-24">
      <div className="relative mx-auto w-full max-w-[1400px] overflow-hidden rounded-[40px] bg-black shadow-[0_50px_100px_-20px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
        {/* Background Image with Parallax */}
        <motion.div
          style={{ y, scale }}
          className="absolute inset-0 h-[125%] w-full"
        >
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover opacity-60 transition-opacity duration-1000"
          />
        </motion.div>

        {/* Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />
        <div className="absolute inset-0 noise opacity-30 pointer-events-none" />

        {/* HUD Elements */}
        <div className="absolute inset-0 pointer-events-none z-10 p-8 sm:p-12 overflow-hidden">
          {/* Corner Accents */}
          <div className="absolute top-8 left-8 h-8 w-8 border-l border-t border-cyber/40" />
          <div className="absolute top-8 right-8 h-8 w-8 border-r border-t border-white/20" />
          <div className="absolute bottom-8 left-8 h-8 w-8 border-l border-b border-white/20" />
          <div className="absolute bottom-8 right-8 h-8 w-8 border-r border-b border-cyber/40" />

          {/* Moving Data Line */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-0 h-px w-64 bg-gradient-to-r from-transparent via-cyber/30 to-transparent"
          />

          {/* Floating Icons based on alignment */}
          <motion.div
            style={{ y: useTransform(scrollYProgress, [0, 1], [40, -40]) }}
            className={`absolute hidden lg:flex flex-col gap-6 ${align === "right" ? "left-12" : "right-12"} top-1/3`}
          >
            <HUDIcon Icon={Shield} delay={0} />
            <HUDIcon Icon={Target} delay={0.2} />
            <HUDIcon Icon={Activity} delay={0.4} />
          </motion.div>
        </div>

        <div className="relative aspect-[16/10] min-h-[600px] lg:aspect-[21/9] pointer-events-none">
          <motion.div
            style={{ y: textY, opacity }}
            className={`absolute z-20 flex max-w-2xl flex-col gap-8 px-8 sm:px-16 pointer-events-auto ${
              align === "right"
                ? "right-0 top-1/2 -translate-y-1/2 text-right items-end"
                : "left-0 top-1/2 -translate-y-1/2 text-left items-start"
            }`}
          >
            <div
              className={`flex items-center gap-4 text-[12px] uppercase tracking-[0.3em] text-cyber font-bold`}
            >
              <span className="font-mono bg-cyber/10 px-2 py-0.5 rounded backdrop-blur-md">
                {index}
              </span>
              <span className="h-px w-12 bg-cyber/40" />
              <span className="text-white/60">{eyebrow}</span>
            </div>

            <h2
              className="font-display text-[clamp(2.5rem,6vw,5.5rem)] font-bold leading-[0.9] tracking-[-0.04em] text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
              data-magnetic="true"
            >
              {title}
            </h2>

            <p
              className="max-w-md text-[17px] leading-relaxed text-white/50"
              data-magnetic="true"
            >
              {body}
            </p>

            <div className="mt-2">{children}</div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function HUDIcon({ Icon, delay }: { Icon: any; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 bg-black/40 backdrop-blur-2xl ring-1 ring-white/5"
    >
      <Icon className="h-6 w-6 text-cyber" />
    </motion.div>
  );
}
