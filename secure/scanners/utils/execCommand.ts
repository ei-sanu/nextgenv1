import { exec } from "child_process";
import logger from "../../backend/utils/logger";

export const execCommand = (
  command: string,
): Promise<{ stdout: string; stderr: string }> => {
  return new Promise((resolve, reject) => {
    logger.info(`Executing command: ${command}`);
    exec(command, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      // Even if there's an error (e.g., nmap returns exit code 1 or nuclei finds vulns),
      // we often still want the output to parse it.
      if (error && !stdout) {
        logger.error(`Command execution failed: ${error.message}`);
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
};
