import { StoryChapter } from "../interactive/StoryChapter";
import ap from "@/assets/ap.jpg";
import hackguy from "@/assets/hackguy.jpg";
import traffic from "@/assets/traffic.jpg";

export function Story() {
  return (
    <div className="relative">
      <StoryChapter
        index="01"
        eyebrow="The watchtower"
        align="left"
        image={ap}
        title={
          <>
            Stand above
            <br />
            the storm.
          </>
        }
        body="Aegis operates from a serene vantage point — continuously scanning your web, network and DNS surface so threats are seen long before they land."
      >
        <div className="flex gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-white ring-1 ring-white/15 backdrop-blur">
            Web · OWASP
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-white ring-1 ring-white/15 backdrop-blur">
            Network · CVE
          </span>
        </div>
      </StoryChapter>

      <StoryChapter
        index="02"
        eyebrow="The sentinel"
        align="right"
        image={hackguy}
        title={
          <>
            An AI guardian
            <br />
            that never blinks.
          </>
        }
        body="Autonomous agents triage findings, score CVSS impact and draft remediation pull-requests — your team approves, Aegis ships."
      >
        <div className="flex justify-end gap-3 text-right">
          <Stat label="MTTR" value="−86%" />
          <Stat label="False positives" value="0.4%" />
        </div>
      </StoryChapter>

      <StoryChapter
        index="03"
        eyebrow="The vault"
        align="left"
        image={traffic}
        title={
          <>
            Intelligence,
            <br />
            crystallised.
          </>
        }
        body="Every scan, signal and signature lives in a luminous archive — instantly searchable, fully replayable, ready for audit."
      >
        <div className="flex gap-2">
          <span className="rounded-full bg-cyber/15 px-3 py-1 text-[11px] text-cyber ring-1 ring-cyber/30 backdrop-blur">
            Live SAVE score
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-white ring-1 ring-white/15 backdrop-blur">
            SOC 2 ready
          </span>
        </div>
      </StoryChapter>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-black/55 px-4 py-3 ring-1 ring-white/10 backdrop-blur-xl text-left">
      <div className="font-display text-2xl font-semibold text-white tabular-nums">
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-[0.18em] text-white/55">
        {label}
      </div>
    </div>
  );
}
