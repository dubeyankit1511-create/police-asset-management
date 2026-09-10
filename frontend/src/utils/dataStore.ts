export const defaultDocuments = [];
export const defaultLogs = [];

// --- Pending Verification Queue ---
export const getPendingDocuments = () => {
  const saved = localStorage.getItem('SECURE_SYNC_PENDING_DOCS');
  if (saved) return JSON.parse(saved);
  return [];
};

export const savePendingDocuments = (docs: any[]) => {
  localStorage.setItem('SECURE_SYNC_PENDING_DOCS', JSON.stringify(docs));
};

export const addPendingDocument = (doc: any) => {
  const pending = getPendingDocuments();
  savePendingDocuments([doc, ...pending]);
};

// --- Notifications ---
export const getNotifications = (role: string) => {
  const key = role === 'ADMIN' ? 'SECURE_SYNC_NOTIF_ADMIN' : 'SECURE_SYNC_NOTIF_USER';
  const saved = localStorage.getItem(key);
  if (saved) return JSON.parse(saved);
  return [];
};

export const saveNotifications = (role: string, notifs: any[]) => {
  const key = role === 'ADMIN' ? 'SECURE_SYNC_NOTIF_ADMIN' : 'SECURE_SYNC_NOTIF_USER';
  localStorage.setItem(key, JSON.stringify(notifs));
};

export const addNotification = (role: 'ADMIN' | 'USER', message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
  const notifs = getNotifications(role);
  const newNotif = {
    id: Date.now().toString(),
    message,
    type,
    read: false,
    timestamp: new Date().toISOString(),
  };
  saveNotifications(role, [newNotif, ...notifs]);
};

export const markAllNotificationsRead = (role: string) => {
  const notifs = getNotifications(role);
  const updated = notifs.map((n: any) => ({ ...n, read: true }));
  saveNotifications(role, updated);
};

export const clearNotifications = (role: string) => {
  saveNotifications(role, []);
};

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

export const logActivity = (action: string, details: string, userObj: any, ip: string = '192.168.1.100', risk: string = 'LOW', docId?: string) => {
  const logs = getAuditLogs();
  
  // Try to safely parse the user object or default to empty strings
  const name = userObj?.name || (typeof userObj === 'string' ? userObj : 'System');
  const badge = userObj?.badge || '';
  const dept = userObj?.department || userObj?.dept || (badge === 'SA-0001' ? 'Central Command' : 'Task Force A - Case #8992');

  const newLog = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    user: name,
    badge,
    dept,
    action,
    details,
    ip,
    risk,
    docId,
    hash: '0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('') + '...d2e'
  };
  saveAuditLogs([newLog, ...logs]);
};
export const getAccessLogs = () => {
  const saved = localStorage.getItem('SECURE_SYNC_ACCESS_LOGS');
  if (saved) return JSON.parse(saved);
  return [];
};

export const saveAccessLogs = (logs: any[]) => {
  localStorage.setItem('SECURE_SYNC_ACCESS_LOGS', JSON.stringify(logs));
};

export const logAccess = (action: 'LOGIN' | 'LOGOUT', userObj: any, ip: string = '192.168.1.10') => {
  const logs = getAccessLogs();
  
  const name = userObj?.name || (typeof userObj === 'string' ? userObj : 'Unknown');
  const badge = userObj?.badge || '';
  const dept = userObj?.department || userObj?.dept || '';

  const newLog = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    user: name,
    badge,
    dept,
    action,
    ip
  };
  saveAccessLogs([newLog, ...logs]);
};
