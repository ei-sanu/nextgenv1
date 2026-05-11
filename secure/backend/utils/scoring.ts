export const calculateCVSS = (severity: string): number => {
  switch (severity.toLowerCase()) {
    case 'critical': return 9.5;
    case 'high': return 8.0;
    case 'medium': return 5.5;
    case 'low': return 2.5;
    default: return 0.0;
  }
};

export const calculateSAVE = (severity: string): number => {
  // SAVE (Security Architecture Vulnerability Evaluation) score
  switch (severity.toLowerCase()) {
    case 'critical': return 95;
    case 'high': return 80;
    case 'medium': return 50;
    case 'low': return 25;
    default: return 0;
  }
};
