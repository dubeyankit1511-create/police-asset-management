export const defaultUsers: Record<string, any> = {
  'SA-0001': { id: 'SA-0001', password: 'SuperAdmin@2024', firstName: 'Super', lastName: 'Administrator', email: 'admin@securesync.gov', role: 'ADMIN', department: 'Central Command', createdAt: '2024-09-08' },
  'PD-1001': { id: 'PD-1001', password: 'Adil@2024', firstName: 'Adil', lastName: 'Ahmed', email: 'adil.ahmed@police.gov', role: 'INVESTIGATOR', department: 'Task Force A - Case #8992', createdAt: '2024-09-08' },
  'PD-1002': { id: 'PD-1002', password: 'Ahtisham@2024', firstName: 'Ahtisham', lastName: 'Ahmed', email: 'ahtisham.ahmed@police.gov', role: 'OFFICER', department: 'Task Force A - Case #8992', createdAt: '2024-09-08' },
  'PD-1003': { id: 'PD-1003', password: 'Akash@2024', firstName: 'Akash', lastName: 'Chouchan', email: 'akash.chouchan@police.gov', role: 'OFFICER', department: 'Task Force A - Case #8992', createdAt: '2024-09-08' },
  'PD-1004': { id: 'PD-1004', password: 'Abdul@2024', firstName: 'Abdul', lastName: 'Ahad', email: 'abdul.ahad@police.gov', role: 'AUDITOR', department: 'Task Force A - Case #8992', createdAt: '2024-09-08' },
};

export const getUserDirectory = () => {
  const saved = localStorage.getItem('SECURE_SYNC_USERS');
  if (saved) {
    return JSON.parse(saved);
  }
  localStorage.setItem('SECURE_SYNC_USERS', JSON.stringify(defaultUsers));
  return defaultUsers;
};

export const saveUserDirectory = (directory: Record<string, any>) => {
  localStorage.setItem('SECURE_SYNC_USERS', JSON.stringify(directory));
};
