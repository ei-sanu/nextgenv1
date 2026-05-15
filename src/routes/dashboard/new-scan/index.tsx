import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Globe,
  Network,
  Bug,
  ChevronRight,
  Loader2,
  ShieldAlert,
} from "lucide-react";
import { getApiUrl } from "@/lib/api";

export const Route = createFileRoute("/dashboard/new-scan/")({
  component: NewScan,
});

function NewScan() {
  const [target, setTarget] = useState("");
  const [type, setType] = useState<"web" | "network" | "malware">("web");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeScanId, setActiveScanId] = useState<string | null>(null);
  const [scanStatus, setScanStatus] = useState<
    "idle" | "pending" | "running" | "completed" | "failed"
  >("idle");
  const [scanProgress, setScanProgress] = useState(0);
  const [summary, setSummary] = useState<any>(null);
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);
  const [scanLogs, setScanLogs] = useState<
    Array<{ timestamp: string; level: string; message: string }>
  >([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setSummary(null);
    setVulnerabilities([]);
    setScanLogs([
      {
        timestamp: new Date().toISOString(),
        level: "info",
        message: `Directive received for ${target}. Bootstrapping scan agent...`,
      },
    ]);
    setScanStatus("pending");
    setScanProgress(5);

    try {
      const res = await fetch(getApiUrl("/scans/start"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target,
          type,
          userId: "anonymous_user", // Mock user
        }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveScanId(data.data?._id || null);
      } else {
        setScanStatus("failed");
        setErrorMessage(data.message || "Failed to start scan");
      }
    } catch (err) {
      console.error("Failed to start scan:", err);
      setScanStatus("failed");
      const message = (err as any)?.message || "Network error";
      if (message.includes("Failed to fetch")) {
        setErrorMessage(
          "Backend is unreachable. Verify your VITE_API_BASE_URL and backend server status.",
        );
      } else {
        setErrorMessage(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!activeScanId) return;

    let cancelled = false;
    const poll = async () => {
      try {
        const [scanRes, vulnRes, logsRes] = await Promise.all([
          fetch(getApiUrl(`/scans/${activeScanId}`)),
          fetch(getApiUrl(`/scans/${activeScanId}/vulnerabilities`)),
          fetch(getApiUrl(`/scans/${activeScanId}/logs`)),
        ]);

        const scanData = await scanRes.json();
        const vulnData = await vulnRes.json();
        const logsData = await logsRes.json();
        if (cancelled) return;

        const scan = scanData?.data;
        if (scan) {
          setScanStatus(scan.status);
          setScanProgress(scan.progress || 0);
          setSummary(scan.resultsSummary || null);
        }

        setVulnerabilities(vulnData?.data || []);
        setScanLogs(
          (logsData?.data || []).map((log: any) => ({
            timestamp: log.timestamp || new Date().toISOString(),
            level: log.level || "info",
            message: log.message || "...",
          })),
        );
      } catch (err) {
        if (!cancelled) {
          setErrorMessage(
            (err as any)?.message || "Failed to refresh scan stream",
          );
        }
      }
    };

    const tick = setInterval(() => {
      void poll();
    }, 900);
    void poll();

    return () => {
      cancelled = true;
      clearInterval(tick);
    };
  }, [activeScanId]);

  useEffect(() => {
    if (scanStatus !== "pending" && scanStatus !== "running") return;
    const binaryInterval = setInterval(() => {
      setScanLogs((prev) => {
        const binary = `${randomBits()} ${randomBits()} ${randomBits()} ${randomBits()}`;
        const line = {
          timestamp: new Date().toISOString(),
          level: "debug",
          message: `signal ${binary}`,
        };
        return [...prev.slice(-40), line];
      });
    }, 1200);

    return () => clearInterval(binaryInterval);
  }, [scanStatus]);

  const statusClass = useMemo(() => {
    if (scanStatus === "completed")
      return "text-emerald-300 border-emerald-300/40 bg-emerald-500/10";
    if (scanStatus === "failed")
      return "text-red-300 border-red-300/40 bg-red-500/10";
    return "text-cyan-200 border-cyan-300/40 bg-cyan-500/10";
  }, [scanStatus]);

  return (
    <div className="min-h-screen w-full bg-[oklch(0.14_0.02_250)] text-white">
      <div className="p-6 pb-12 max-w-2xl mx-auto">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tighter">
            NEW SCAN DIRECTIVE
          </h1>
          <p className="text-white/50 text-sm mt-1 uppercase tracking-widest font-mono">
            Configure Autonomous Security Agent
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {errorMessage && (
            <div className="p-3 bg-red-600 text-white rounded">
              {errorMessage}
            </div>
          )}
          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-mono text-white/40 block">
              Scan Type Selection
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <TypeCard
                active={type === "web"}
                onClick={() => setType("web")}
                icon={<Globe />}
                label="Web App"
                description="OWASP Top 10, XSS, SQLi"
              />
              <TypeCard
                active={type === "network"}
                onClick={() => setType("network")}
                icon={<Network />}
                label="Network"
                description="Ports, Services, CVEs"
              />
              <TypeCard
                active={type === "malware"}
                onClick={() => setType("malware")}
                icon={<Bug />}
                label="Threats"
                description="Malware, Reputation"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] uppercase tracking-widest font-mono text-white/40 block">
              Target Identification (URL or IP)
            </label>
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 to-white/5 rounded-xl blur opacity-30 group-focus-within:opacity-100 transition duration-1000"></div>
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="e.g. https://target-system.com"
                className="relative w-full bg-black border border-white/10 rounded-xl px-6 py-4 text-lg font-mono focus:outline-none focus:border-white/40 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !target}
            className="w-full bg-white text-black py-4 rounded-xl font-black text-xl flex items-center justify-center gap-3 hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                ENGAGE SYSTEMS <ChevronRight size={24} />
              </>
            )}
          </button>
        </form>

        {activeScanId && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="text-cyan-300" size={18} />
                <p className="font-mono text-xs uppercase tracking-widest text-white/70">
                  Live Analysis Stream
                </p>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full border text-[10px] uppercase tracking-widest font-mono ${statusClass}`}
              >
                {scanStatus}
              </span>
            </div>

            <div className="px-5 py-4">
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-300 transition-all duration-500"
                  style={{ width: `${Math.max(6, scanProgress)}%` }}
                />
              </div>
              <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-white/45">
                Progress {scanProgress}%
              </p>
            </div>

            <div className="max-h-72 overflow-y-auto border-y border-white/10 bg-gradient-to-b from-slate-950/80 to-black">
              {scanLogs.slice(-120).map((log, index) => (
                <div
                  key={`${log.timestamp}-${index}`}
                  className="px-5 py-1.5 text-[12px] font-mono border-b border-white/[0.03] text-white/80 animate-in fade-in duration-300"
                >
                  <span className="text-white/35 mr-2">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={
                      log.level === "error"
                        ? "text-red-300"
                        : log.level === "warn"
                          ? "text-amber-300"
                          : "text-cyan-200"
                    }
                  >
                    [{log.level.toUpperCase()}]
                  </span>{" "}
                  {log.message}
                </div>
              ))}
            </div>

            <div className="p-5 space-y-3">
              <h3 className="font-semibold tracking-tight">Findings</h3>
              {vulnerabilities.length === 0 &&
                scanStatus !== "completed" &&
                scanStatus !== "failed" && (
                  <p className="text-sm text-white/50">
                    Scanning in progress. Findings will stream here.
                  </p>
                )}
              {vulnerabilities.length === 0 &&
                (scanStatus === "completed" || scanStatus === "failed") && (
                  <p className="text-sm text-white/50">
                    No vulnerabilities detected for this run.
                  </p>
                )}
              {vulnerabilities.map((vuln) => (
                <div
                  key={vuln._id}
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium">{vuln.title}</p>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/55">
                      {vuln.severity}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-white/65">
                    {vuln.description}
                  </p>
                </div>
              ))}

              {summary && (
                <div className="rounded-xl border border-cyan-300/20 bg-cyan-500/5 p-3 text-sm">
                  <p className="font-mono text-xs uppercase tracking-widest text-cyan-200/90">
                    Result Summary
                  </p>
                  <p className="mt-1 text-white/80">
                    {summary.message || "Scan completed."}
                  </p>
                  <p className="mt-1 text-white/60">
                    Total Vulnerabilities:{" "}
                    {summary.totalVulnerabilities ?? vulnerabilities.length}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function randomBits(length = 8) {
  let bits = "";
  for (let i = 0; i < length; i++) bits += Math.random() > 0.5 ? "1" : "0";
  return bits;
}

function TypeCard({ active, onClick, icon, label, description }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-6 rounded-2xl border transition-all text-left space-y-3 ${
        active
          ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          : "bg-white/5 text-white border-white/10 hover:border-white/30"
      }`}
    >
      <div className={`${active ? "text-black" : "text-white/60"}`}>{icon}</div>
      <div>
        <div className="font-bold uppercase tracking-tight">{label}</div>
        <div
          className={`text-[10px] uppercase tracking-tighter ${active ? "text-black/60" : "text-white/40"}`}
        >
          {description}
        </div>
      </div>
    </button>
  );
}
