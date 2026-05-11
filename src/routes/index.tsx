import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { Story } from "@/components/site/Story";
import { Metrics } from "@/components/site/Metrics";
import { CtaFooter } from "@/components/site/CtaFooter";
import { Atmosphere } from "@/components/site/Atmosphere";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SENTINEL — Absolute Security for the NextGen" },
      {
        name: "description",
        content:
          "A cinematic AI cybersecurity command center. Continuous web, network and malware intelligence orchestrated by autonomous agents.",
      },
      { property: "og:title", content: "SENTINEL — Absolute Security" },
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
      <Atmosphere />
      <Hero />
      <Story />
      <Metrics />
      <CtaFooter />
    </main>
  );
}
