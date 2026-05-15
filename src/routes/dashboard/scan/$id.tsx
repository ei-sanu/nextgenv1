import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  ShieldAlert,
  ChevronLeft,
  Download,
  AlertCircle,
  Clock,
  ExternalLink,
  Target,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { getApiUrl } from "@/lib/api";

export const Route = createFileRoute("/dashboard/scan/$id")({
  component: ScanDetail,
});

function ScanDetail() {
  const { id } = Route.useParams();
  const [scan, setScan] = useState<any>(null);
  const [vulnerabilities, setVulnerabilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [scanRes, vulnsRes] = await Promise.all([
          fetch(getApiUrl(`/scans/${id}`)),
          fetch(getApiUrl(`/scans/${id}/vulnerabilities`)),
        ]);
        const scanData = await scanRes.json();
        const vulnsData = await vulnsRes.json();
        setScan(scanData.data);
        setVulnerabilities(vulnsData.data);
      } catch (err) {
        console.error("Failed to fetch scan details:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleExport = (format: "pdf" | "json") => {
    window.open(
      getApiUrl(`/reports/${id}/export?format=${format}`),
      "_blank",
    );
  };

  if (loading)
    return (
      <div className="p-10 text-white animate-pulse">
        Decrypting Intelligence...
      </div>
    );

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto text-white pb-20">
      <Link
        to="/dashboard"
        className="flex items-center gap-2 text-white/40 hover:text-white transition-colors uppercase text-[10px] font-mono tracking-widest mb-6"
      >
        <ChevronLeft size={14} /> Back to Command Center
      </Link>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold tracking-tighter truncate max-w-[500px]">
              {scan?.target}
            </h1>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-mono uppercase tracking-widest text-white/50">
              {scan?.type} Intelligence
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40 uppercase font-mono tracking-tighter">
            <div className="flex items-center gap-1.5">
              <Clock size={14} /> {new Date(scan?.startedAt).toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5">
              <Target size={14} /> ID: {scan?._id.slice(-8)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport("pdf")}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-xs font-bold hover:bg-white/5 transition-all"
          >
            <Download size={16} /> PDF REPORT
          </button>
          <button
            onClick={() => handleExport("json")}
            className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-xs font-bold hover:bg-white/5 transition-all"
          >
            <Download size={16} /> JSON DATA
          </button>
        </div>
      </header>

      {/* Findings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vulnerabilities.map((vuln) => (
          <div
            key={vuln._id}
            className="p-6 border border-white/10 rounded-3xl bg-white/[0.02] backdrop-blur-sm space-y-4 relative overflow-hidden group"
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 blur-[60px] opacity-10 transition-opacity group-hover:opacity-20 ${getSeverityColor(vuln.severity)}`}
            />

            <div className="flex justify-between items-start">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${getSeverityBadge(vuln.severity)}`}
              >
                {vuln.severity}
              </span>
              <div className="text-[10px] font-mono text-white/20">
                CVSS: {vuln.cvssScore}
              </div>
            </div>

            <h3 className="text-xl font-bold leading-tight">{vuln.title}</h3>
            <p className="text-white/50 text-xs line-clamp-3 leading-relaxed">
              {vuln.description}
            </p>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="space-y-1">
                <span className="text-[8px] uppercase tracking-widest font-mono text-white/20">
                  Remediation Protocol
                </span>
                <p className="text-[10px] text-emerald-400 leading-normal">
                  {vuln.remediation}
                </p>
              </div>
              {vuln.cve && (
                <div className="flex items-center justify-between text-[10px] font-mono p-2 bg-white/5 rounded-lg border border-white/5">
                  <span className="text-white/30 uppercase">Reference</span>
                  <span className="text-white/80">{vuln.cve}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {vulnerabilities.length === 0 && (
          <div className="lg:col-span-3 flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl opacity-30">
            <ShieldAlert size={48} className="mb-4" />
            <p className="font-mono uppercase tracking-[0.2em] text-sm">
              No Vulnerabilities Detected
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function getSeverityColor(sev: string) {
  switch (sev.toLowerCase()) {
    case "critical":
      return "bg-rose-500";
    case "high":
      return "bg-orange-500";
    case "medium":
      return "bg-amber-500";
    case "low":
      return "bg-sky-500";
    default:
      return "bg-white";
  }
}

function getSeverityBadge(sev: string) {
  switch (sev.toLowerCase()) {
    case "critical":
      return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
    case "high":
      return "bg-orange-500/10 text-orange-500 border border-orange-500/20";
    case "medium":
      return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
    case "low":
      return "bg-sky-500/10 text-sky-500 border border-sky-500/20";
    default:
      return "bg-white/10 text-white border border-white/20";
  }
}
