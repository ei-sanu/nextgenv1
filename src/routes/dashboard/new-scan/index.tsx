import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { 
  Globe, 
  Network, 
  Bug, 
  ShieldAlert, 
  ChevronRight,
  Loader2
} from "lucide-react";

export const Route = createFileRoute("/dashboard/new-scan/")({
  component: NewScan,
});

function NewScan() {
  const navigate = useNavigate();
  const [target, setTarget] = useState("");
  const [type, setType] = useState<"web" | "network" | "malware">("web");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("http://localhost:5001/api/scans/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target,
          type,
          userId: "anonymous_user" // Mock user
        })
      });
      const data = await res.json();
      if (data.success) {
        navigate({ to: "/dashboard" });
      } else {
        setErrorMessage(data.message || 'Failed to start scan');
      }
    } catch (err) {
      console.error("Failed to start scan:", err);
      setErrorMessage((err as any)?.message || 'Network error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto text-white">
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tighter">NEW SCAN DIRECTIVE</h1>
        <p className="text-white/50 text-sm mt-1 uppercase tracking-widest font-mono">
          Configure Autonomous Security Agent
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {errorMessage && (
          <div className="p-3 bg-red-600 text-white rounded">{errorMessage}</div>
        )}
        <div className="space-y-4">
          <label className="text-[10px] uppercase tracking-widest font-mono text-white/40 block">
            Scan Type Selection
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TypeCard 
              active={type === 'web'} 
              onClick={() => setType('web')}
              icon={<Globe />}
              label="Web App"
              description="OWASP Top 10, XSS, SQLi"
            />
            <TypeCard 
              active={type === 'network'} 
              onClick={() => setType('network')}
              icon={<Network />}
              label="Network"
              description="Ports, Services, CVEs"
            />
            <TypeCard 
              active={type === 'malware'} 
              onClick={() => setType('malware')}
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
    </div>
  );
}

function TypeCard({ active, onClick, icon, label, description }: any) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`p-6 rounded-2xl border transition-all text-left space-y-3 ${
        active 
          ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]' 
          : 'bg-white/5 text-white border-white/10 hover:border-white/30'
      }`}
    >
      <div className={`${active ? 'text-black' : 'text-white/60'}`}>{icon}</div>
      <div>
        <div className="font-bold uppercase tracking-tight">{label}</div>
        <div className={`text-[10px] uppercase tracking-tighter ${active ? 'text-black/60' : 'text-white/40'}`}>
          {description}
        </div>
      </div>
    </button>
  );
}
