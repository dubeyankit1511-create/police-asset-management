export const defaultDocuments = [];
export const defaultLogs = [];

export const getDocumentList = () => {
  const saved = localStorage.getItem('SECURE_SYNC_DOCS');
  if (saved) return JSON.parse(saved);
  return defaultDocuments;
};

export const saveDocumentList = (docs: any[]) => {
  localStorage.setItem('SECURE_SYNC_DOCS', JSON.stringify(docs));
};

export const getAuditLogs = () => {
  const saved = localStorage.getItem('SECURE_SYNC_LOGS');
  if (saved) return JSON.parse(saved);
  return defaultLogs;
};

export const saveAuditLogs = (logs: any[]) => {
  localStorage.setItem('SECURE_SYNC_LOGS', JSON.stringify(logs));
};

export const logActivity = (action: string, details: string, user: string, ip: string = '192.168.1.100', risk: string = 'LOW') => {
  const logs = getAuditLogs();
  const newLog = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    user,
    action,
    details,
    ip,
    risk,
    hash: '0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('') + '...d2e'
  };
  saveAuditLogs([newLog, ...logs]);
};
