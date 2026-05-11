import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { Story } from "@/components/site/Story";
import { Metrics } from "@/components/site/Metrics";
import { CtaFooter } from "@/components/site/CtaFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aegis — Defend systems while you sleep" },
      {
        name: "description",
        content:
          "A cinematic AI cybersecurity command center. Continuous web, network and malware intelligence orchestrated by autonomous agents.",
      },
      { property: "og:title", content: "Aegis — Defend systems while you sleep" },
      {
        property: "og:description",
        content:
          "A cinematic AI cybersecurity command center for modern security teams.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="relative min-h-screen overflow-x-clip bg-background pb-6">
      <Hero />
      <Story />
      <Metrics />
      <CtaFooter />
    </main>
  );
}
