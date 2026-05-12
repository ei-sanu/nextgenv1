import { execCommand } from "../utils/execCommand";
import logger from "../../backend/utils/logger";
import axios from "axios";
import { exec } from "child_process";

const isCommandAvailable = (cmd: string): Promise<boolean> => {
  return new Promise((resolve) => {
    exec(`command -v ${cmd}`, (err, stdout) => {
      if (err) return resolve(false);
      return resolve(Boolean(stdout && stdout.trim()));
    });
  });
};

const basicHttpChecks = async (target: string) => {
  const vulns: any[] = [];
  try {
    const res = await axios.get(target, { timeout: 8000, maxRedirects: 5 });
    const headers = res.headers || {};

    // Check for missing security headers
    if (!headers["strict-transport-security"]) {
      vulns.push({
        title: "Missing HSTS header",
        description: "Strict-Transport-Security header is not present.",
        severity: "low",
        evidence: JSON.stringify(headers),
        remediation: "Enable HSTS to enforce HTTPS.",
      });
    }
    if (!headers["content-security-policy"]) {
      vulns.push({
        title: "Missing Content-Security-Policy",
        description: "Content-Security-Policy header is not present.",
        severity: "low",
        evidence: JSON.stringify(headers),
        remediation: "Add a Content-Security-Policy to mitigate XSS.",
      });
    }
    if (!headers["x-content-type-options"]) {
      vulns.push({
        title: "Missing X-Content-Type-Options",
        description: "X-Content-Type-Options header is not present.",
        severity: "low",
        evidence: JSON.stringify(headers),
        remediation: "Set X-Content-Type-Options: nosniff.",
      });
    }
    if (!headers["x-frame-options"] && !headers["content-security-policy"]) {
      vulns.push({
        title: "Missing clickjacking protection",
        description: "No X-Frame-Options or CSP frame-ancestors detected.",
        severity: "low",
        evidence: JSON.stringify(headers),
        remediation: "Add X-Frame-Options or CSP frame-ancestors policy.",
      });
    }

    // Look for obvious inline scripts or suspicious patterns
    const body = (res.data || "").toString();
    if (/<script[\s>]/i.test(body)) {
      vulns.push({
        title: "Inline script detected",
        description:
          "Page contains inline <script> tags which may increase XSS risk.",
        severity: "low",
        evidence: body.slice(0, 500),
        remediation:
          "Avoid inline scripts; use CSP and external scripts with integrity.",
      });
    }
  } catch (err: any) {
    logger.warn(`Basic HTTP checks failed for ${target}: ${err.message}`);
  }
  return vulns;
};

export const runNucleiScan = async (target: string): Promise<any[]> => {
  // If nuclei is available, run full scan. Otherwise, fallback to lightweight checks.
  const available = await isCommandAvailable("nuclei");
  if (!available) {
    logger.warn(
      `Nuclei binary not found in PATH; falling back to basic HTTP checks for ${target}`,
    );
    const results = await basicHttpChecks(target);
    return results;
  }

  try {
    const command = `nuclei -u ${target} -j -silent -t http/vulnerabilities,http/misconfiguration,http/cves`;
    const { stdout } = await execCommand(command);

    const vulnerabilities: any[] = [];
    const lines = stdout.split("\n");

    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const finding = JSON.parse(line);
        vulnerabilities.push({
          title: finding.info.name || "Unknown Nuclei Finding",
          description:
            finding.info.description || "No description provided by Nuclei.",
          severity: finding.info.severity || "info",
          evidence: finding["extracted-results"]
            ? finding["extracted-results"].join(", ")
            : finding.matched || "",
          remediation:
            finding.info.remediation || "Refer to security best practices.",
          cve:
            finding.info.classification && finding.info.classification["cve-id"]
              ? finding.info.classification["cve-id"][0]
              : undefined,
        });
      } catch (e) {
        logger.warn(`Failed to parse Nuclei JSON line: ${line}`);
      }
    }

    return vulnerabilities;
  } catch (error: any) {
    logger.error(`Nuclei scan failed for ${target}: ${error.message}`);
    // If something unexpected happens, attempt basic checks before failing
    const fallback = await basicHttpChecks(target);
    if (fallback.length) return fallback;
    throw new Error("Nuclei scan execution failed");
  }
};
