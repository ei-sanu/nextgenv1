import { execCommand } from '../utils/execCommand';
import logger from '../../backend/utils/logger';
import { parseStringPromise } from 'xml2js';
import { exec } from 'child_process';
import net from 'net';

const isCommandAvailable = (cmd: string): Promise<boolean> => {
  return new Promise((resolve) => {
    exec(`command -v ${cmd}`, (err, stdout) => {
      if (err) return resolve(false);
      return resolve(Boolean(stdout && stdout.trim()));
    });
  });
};

const basicPortScan = async (target: string) => {
  const commonPorts = [21, 22, 23, 80, 443, 3389];
  const vulnerabilities: any[] = [];
  const host = target.replace(/^https?:\/\//i, '').split(/[\/\:]/)[0];

  const checkPort = (port: number) => {
    return new Promise<boolean>((resolve) => {
      const socket = new net.Socket();
      let done = false;
      socket.setTimeout(1000);
      socket.once('connect', () => {
        done = true;
        socket.destroy();
        resolve(true);
      });
      socket.once('timeout', () => {
        if (!done) { done = true; socket.destroy(); resolve(false); }
      });
      socket.once('error', () => { if (!done) { done = true; socket.destroy(); resolve(false); } });
      socket.connect(port, host);
    });
  };

  for (const port of commonPorts) {
    try {
      const open = await checkPort(port);
      if (open) {
        let severity: string = 'low';
        let title = `Open port ${port}`;
        if (port === 23) { severity = 'high'; title = 'Insecure Telnet Service Exposed'; }
        if (port === 3389) { severity = 'medium'; title = 'RDP Port Exposed'; }
        if (port === 21) { severity = 'medium'; title = 'Insecure FTP Service Exposed'; }

        vulnerabilities.push({
          title,
          description: `Port ${port} is open on target ${host}.`,
          severity,
          evidence: `Port ${port}/tcp open`,
          remediation: 'Restrict access or disable unnecessary services.'
        });
      }
    } catch (e) {
      logger.warn(`Port check failed for ${host}:${port} - ${e?.message || e}`);
    }
  }

  return vulnerabilities;
};

export const runNmapScan = async (target: string): Promise<any[]> => {
  const available = await isCommandAvailable('nmap');
  if (!available) {
    logger.warn(`Nmap binary not found in PATH; falling back to basic TCP port checks for ${target}`);
    return await basicPortScan(target);
  }

  try {
    const command = `nmap -sV -sC -oX - ${target}`;
    const { stdout } = await execCommand(command);

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
            }
          }
        }
      }
    }
    return vulnerabilities;
  } catch (error: any) {
    logger.error(`Nmap scan failed for ${target}: ${error.message}`);
    // fallback to basic scan
    const fallback = await basicPortScan(target);
    if (fallback.length) return fallback;
    throw new Error('Nmap scan execution failed');
  }
};
