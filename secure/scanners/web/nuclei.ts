import { execCommand } from '../utils/execCommand';
import logger from '../../backend/utils/logger';

export const runNucleiScan = async (target: string): Promise<any[]> => {
  try {
    // Run nuclei against the target and output as JSON. 
    // Requires nuclei to be installed in the environment.
    const command = `nuclei -u ${target} -j -silent -t http/vulnerabilities,http/misconfiguration,http/cves`;
    const { stdout } = await execCommand(command);
    
    const vulnerabilities: any[] = [];
    const lines = stdout.split('\n');
    
    for (const line of lines) {
      if (!line.trim()) continue;
      try {
        const finding = JSON.parse(line);
        vulnerabilities.push({
          title: finding.info.name || 'Unknown Nuclei Finding',
          description: finding.info.description || 'No description provided by Nuclei.',
          severity: finding.info.severity || 'info', // low, medium, high, critical, info
          evidence: finding['extracted-results'] ? finding['extracted-results'].join(', ') : (finding.matched || ''),
          remediation: finding.info.remediation || 'Refer to security best practices.',
          cve: finding.info.classification && finding.info.classification['cve-id'] ? finding.info.classification['cve-id'][0] : undefined
        });
      } catch (e) {
        logger.warn(`Failed to parse Nuclei JSON line: ${line}`);
      }
    }
    
    return vulnerabilities;
  } catch (error: any) {
    logger.error(`Nuclei scan failed for ${target}: ${error.message}`);
    throw new Error('Nuclei scan execution failed');
  }
};
