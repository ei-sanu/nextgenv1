import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { ScratchImage } from "./ScratchImage";

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
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 1.05]);
  const textY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);

  return (
    <section ref={ref} className="relative px-3 sm:px-5 py-6">
      <div className="relative mx-auto w-full max-w-[1480px] overflow-hidden rounded-[28px] sm:rounded-[36px] bg-black">
        <motion.div style={{ y, scale }} className="absolute inset-0 h-[115%] w-full">
            <ScratchImage 
                src={image} 
                className="h-full w-full"
                revealText="DECRYPTED"
            />
        </motion.div>
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_20%,rgba(0,0,0,0.6)_85%)] pointer-events-none" />
        <div className="absolute inset-0 noise pointer-events-none" />

        <div className="relative aspect-[16/10] min-h-[560px] sm:min-h-[640px] lg:aspect-[16/9] pointer-events-none">
          <motion.div
            style={{ y: textY }}
            className={`absolute z-10 flex max-w-xl flex-col gap-5 px-6 sm:px-12 pointer-events-auto ${
              align === "right"
                ? "right-0 top-1/2 -translate-y-1/2 text-right items-end"
                : "left-0 top-1/2 -translate-y-1/2 text-left items-start"
            }`}
          >
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-cyber">
              <span className="font-mono opacity-70">{index}</span>
              <span className="h-px w-8 bg-cyber/60" />
              <span>{eyebrow}</span>
            </div>
            <h2 className="font-display text-[clamp(2rem,5.2vw,4.5rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
              {title}
            </h2>
            <p className="max-w-md text-[14.5px] leading-relaxed text-white/75">
              {body}
            </p>
            {children}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
