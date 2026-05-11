import { execCommand } from '../utils/execCommand';
import logger from '../../backend/utils/logger';
import { parseStringPromise } from 'xml2js';

export const runNmapScan = async (target: string): Promise<any[]> => {
  try {
    // Run nmap with XML output and version detection (-sV), basic script scan (-sC)
    const command = `nmap -sV -sC -oX - ${target}`;
    const { stdout } = await execCommand(command);
    
    // Parse the XML output
    const result = await parseStringPromise(stdout);
    const vulnerabilities: any[] = [];

    if (result.nmaprun && result.nmaprun.host) {
      for (const host of result.nmaprun.host) {
        if (host.ports && host.ports[0] && host.ports[0].port) {
          for (const port of host.ports[0].port) {
            const state = port.state[0].$.state;
            if (state === 'open') {
              const portId = port.$.portid;
              const service = port.service ? port.service[0].$.name : 'unknown';
              const product = port.service && port.service[0].$.product ? port.service[0].$.product : '';
              const version = port.service && port.service[0].$.version ? port.service[0].$.version : '';

              // Basic heuristics based on open ports / deprecated services
              if (portId === '21') {
                vulnerabilities.push({
                  title: 'Insecure FTP Service Expsed',
                  description: `FTP service is open on port 21. Service: ${product} ${version}. FTP transmits data in plaintext.`,
                  severity: 'medium',
                  evidence: `Port ${portId}/tcp open. Service: ${service}`,
                  remediation: 'Disable FTP and use SFTP instead.'
                });
              }
              if (portId === '23') {
                vulnerabilities.push({
                  title: 'Insecure Telnet Service Exposed',
                  description: `Telnet service is open on port 23. Service: ${product} ${version}. Telnet transmits data in plaintext.`,
                  severity: 'high',
                  evidence: `Port ${portId}/tcp open. Service: ${service}`,
                  remediation: 'Disable Telnet and use SSH instead.'
                });
              }
              if (portId === '3389') {
                vulnerabilities.push({
                  title: 'RDP Port Exposed',
                  description: `Remote Desktop Protocol (RDP) is exposed to the internet.`,
                  severity: 'medium',
                  evidence: `Port ${portId}/tcp open.`,
                  remediation: 'Restrict RDP access using a VPN or strict firewall rules.'
                });
              }
              
              // We could map specific product versions to CVEs here using an external DB.
            }
          }
        }
      }
    }
    return vulnerabilities;
  } catch (error: any) {
    logger.error(`Nmap scan failed for ${target}: ${error.message}`);
    throw new Error('Nmap scan execution failed');
  }
};
