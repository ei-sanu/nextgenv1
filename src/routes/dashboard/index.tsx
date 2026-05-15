import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getApiUrl } from "@/lib/api";
import {
  ShieldCheck,
  Activity,
  AlertTriangle,
  Terminal,
  ArrowRight,
  Plus,
  History,
  PieChart,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/")({
  component: Dashboard,
});

function Dashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentScans, setRecentScans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [anaRes, scansRes] = await Promise.all([
          fetch(getApiUrl("/analytics")),
          fetch(getApiUrl("/scans")),
        ]);
        const anaData = await anaRes.json();
        const scansData = await scansRes.json();
        setAnalytics(anaData.data || null);
        setRecentScans(scansData.data || []);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-white animate-pulse">
        Initializing Command Center...
      </div>
    );

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto text-white bg-background min-h-screen">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-white/40">
            SECURE OPS
          </h1>
          <p className="text-white/50 text-sm mt-1 uppercase tracking-widest font-mono">
            Operational Intelligence Dashboard
          </p>
        </div>
        <Link
          to="/dashboard/new-scan"
          className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-white/90 transition-all active:scale-95"
        >
          <Plus size={18} /> INITIATE SCAN
        </Link>
      </header>

      {/* Analytics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={<ShieldCheck className="text-emerald-400" />}
          label="Risk Exposure"
          value={analytics?.riskExposure?.overallRisk || "N/A"}
          subValue={`Score: ${analytics?.riskExposure?.averageSaveScore || 0}`}
        />
        <StatCard
          icon={<AlertTriangle className="text-rose-400" />}
          label="Critical Vulns"
          value={analytics?.vulnerabilities?.critical || 0}
          subValue="Requires Action"
        />
        <StatCard
          icon={<Activity className="text-sky-400" />}
          label="Active Intelligence"
          value={analytics?.scans?.total || 0}
          subValue="Total Scans Run"
        />
        <StatCard
          icon={<PieChart className="text-amber-400" />}
          label="Total Findings"
          value={analytics?.vulnerabilities?.total || 0}
          subValue="Aggregated Data"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <History size={20} className="text-white/50" />
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Recent Scans
            </h2>
          </div>
          <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-[10px] uppercase tracking-widest font-mono text-white/40">
                  <th className="px-6 py-3">Target</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {recentScans?.map((scan: any) => (
                  <tr
                    key={scan._id}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-6 py-4 font-mono truncate max-w-[200px]">
                      {scan.target}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded-full border border-white/20 text-[10px] uppercase font-bold">
                        {scan.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${scan.status === "completed" ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "bg-amber-400 animate-pulse"}`}
                        />
                        <span className="capitalize">{scan.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/dashboard/scan/$id`}
                        params={{ id: scan._id }}
                        className="text-white/40 hover:text-white"
                      >
                        <ArrowRight size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Logs / Agents */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Terminal size={20} className="text-white/50" />
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Live Intelligence
            </h2>
          </div>
          <div className="p-4 border border-white/10 rounded-2xl bg-black font-mono text-xs space-y-2 h-[400px] overflow-y-auto scrollbar-hide">
            <p className="text-emerald-400 opacity-50">
              [SYSTEM] Aegis Core v1.0.0 Online
            </p>
            <p className="text-sky-400">[READY] Awaiting scan directive...</p>
            {recentScans?.slice(0, 5).map((scan: any, i: number) => (
              <p key={i} className="text-white/40">
                &gt; {new Date(scan.startedAt).toLocaleTimeString()} -{" "}
                {scan.type.toUpperCase()} SCAN INITIALIZED FOR {scan.target}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue }: any) {
  return (
    <div className="p-5 border border-white/10 rounded-2xl bg-white/5 backdrop-blur-md hover:border-white/20 transition-all hover:translate-y-[-2px]">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-[10px] uppercase tracking-widest font-mono text-white/40">
          {label}
        </span>
      </div>
      <div className="text-3xl font-bold mb-1 tracking-tighter">{value}</div>
      <div className="text-[10px] text-white/30 uppercase tracking-tighter">
        {subValue}
      </div>
    </div>
  );
}
