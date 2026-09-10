import React, { useState, useEffect } from 'react';
import {
  Users, Plus, Pencil, Trash2, X, Shield, ShieldAlert,
  Search, Eye, EyeOff, Save, AlertTriangle, Check, Crown, BadgeCheck
} from 'lucide-react';
import { getUserDirectory, saveUserDirectory } from '../utils/userStore';

const roleColors: Record<string, { bg: string; border: string; color: string }> = {
  ADMIN:        { bg: 'rgba(240,165,0,0.12)', border: 'rgba(240,165,0,0.4)', color: '#f0a500' },
  OFFICER:      { bg: 'rgba(14,165,233,0.12)', border: 'rgba(14,165,233,0.3)', color: '#38bdf8' },
  INVESTIGATOR: { bg: 'rgba(168,85,247,0.12)', border: 'rgba(168,85,247,0.3)', color: '#c084fc' },
  AUDITOR:      { bg: 'rgba(16,185,129,0.12)', border: 'rgba(16,185,129,0.3)', color: '#34d399' },
};

const InputField = ({ label, value, onChange, type = 'text', placeholder = '', icon: Icon }: any) => (
  <div>
    <label className="block text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: '#475569' }}>{label}</label>
    <div className="relative">
      {Icon && <Icon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#334155' }} />}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        className="w-full py-2.5 rounded-xl text-sm outline-none transition-all"
        style={{
          paddingLeft: Icon ? '36px' : '14px', paddingRight: '14px',
          background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0'
        }} />
    </div>
  </div>
);

export const AdminPanel = () => {
  const [users, setUsers] = useState<any[]>(() => Object.values(getUserDirectory()));
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);

  // Form state
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', badgeNumber: '', role: 'OFFICER', department: '', password: '' });

  const resetForm = () => {
    setForm({ firstName: '', lastName: '', email: '', badgeNumber: '', role: 'OFFICER', department: '', password: '' });
    setEditingUser(null);
    setShowPass(false);
  };

  const openCreate = () => { resetForm(); setShowModal(true); };
  const openEdit = (u: any) => {
    setEditingUser(u);
    setForm({ firstName: u.firstName, lastName: u.lastName, email: u.email, badgeNumber: u.id || u.badgeNumber || '', role: u.role, department: u.department, password: '' });
    setShowModal(true);
  };

  const handleSave = () => {
    // Validation
    if (!form.firstName.trim() || !form.lastName.trim()) { alert('First and Last name are required.'); return; }
    if (!form.badgeNumber.trim()) { alert('Badge Number is required (this is the login ID).'); return; }
    if (!editingUser && !form.password.trim()) { alert('Password is required for new users.'); return; }
    if (!form.email.trim()) { alert('Email is required.'); return; }

    const directory = getUserDirectory();
    const badgeKey = form.badgeNumber.trim().toUpperCase();

    if (!editingUser) {
      // CHECK: badge must be unique
      if (directory[badgeKey]) { alert(`Badge number "${badgeKey}" is already in use. Choose a different badge.`); return; }
    }

    if (editingUser) {
      // EDIT — update in place
      const updatedUser = {
        ...editingUser,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        badgeNumber: badgeKey,
        id: badgeKey,
        role: form.role,
        department: form.department.trim(),
        password: form.password.trim() || editingUser.password,
        name: form.firstName.trim() + ' ' + form.lastName.trim(),
      };

      // If badge changed, remove old key
      if (editingUser.id !== badgeKey) {
        delete directory[editingUser.id];
      }
      directory[badgeKey] = updatedUser;
      saveUserDirectory(directory);
      setUsers(Object.values(getUserDirectory()));
    } else {
      // CREATE — new user entry
      const newUser = {
        id: badgeKey,
        badgeNumber: badgeKey,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        name: form.firstName.trim() + ' ' + form.lastName.trim(),
        email: form.email.trim(),
        role: form.role,
        department: form.department.trim(),
        password: form.password.trim(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      directory[badgeKey] = newUser;
      saveUserDirectory(directory);
      setUsers(Object.values(getUserDirectory()));
      alert(`✅ User "${newUser.name}" created! They can now login with:\n  Badge: ${badgeKey}\n  Password: ${form.password.trim()}`);
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    // Prevent deleting the Super Admin
    if (id === 'SA-0001') { alert('The Super Administrator account cannot be deleted.'); setDeleteConfirm(null); return; }
    const directory = getUserDirectory();
    // id is always the badge number (directory key)
    delete directory[id];
    saveUserDirectory(directory);
    setUsers(Object.values(getUserDirectory()));
    setDeleteConfirm(null);
  };

  const filtered = users.filter(u =>
    !search || u.firstName.toLowerCase().includes(search.toLowerCase()) ||
    u.lastName.toLowerCase().includes(search.toLowerCase()) ||
    u.badgeNumber.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f0a500, #d97706)', boxShadow: '0 0 20px rgba(240,165,0,0.3)' }}>
            <Crown className="w-5 h-5" style={{ color: '#030712' }} />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight" style={{ color: '#e2e8f0' }}>
              Admin Control Panel
            </h1>
            <p className="text-sm mt-0.5" style={{ color: '#475569' }}>
              Super Administrator Access · Full user management privileges
            </p>
          </div>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
          style={{ background: 'linear-gradient(135deg, #f0a500, #d97706)', color: '#030712', boxShadow: '0 0 20px rgba(240,165,0,0.3)' }}>
          <Plus className="w-4 h-4" /> Create User
        </button>
      </div>

      {/* Warning banner */}
      <div className="flex items-center gap-3 px-5 py-3 rounded-xl"
        style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)' }}>
        <AlertTriangle className="w-4 h-4 shrink-0" style={{ color: '#ef4444' }} />
        <p className="text-xs" style={{ color: '#f87171' }}>
          <span className="font-bold">RESTRICTED ACCESS</span> — All actions on this panel are logged in the immutable audit trail. Misuse is a criminal offense.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Users', value: users.length, color: '#0ea5e9', icon: Users },
          { label: 'Officers', value: users.filter(u => u.role === 'OFFICER').length, color: '#38bdf8', icon: Shield },
          { label: 'Investigators', value: users.filter(u => u.role === 'INVESTIGATOR').length, color: '#c084fc', icon: ShieldAlert },
          { label: 'Auditors', value: users.filter(u => u.role === 'AUDITOR').length, color: '#34d399', icon: BadgeCheck },
        ].map(s => (
          <div key={s.label} className="rounded-xl p-4 card-glass">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#475569' }}>{s.label}</span>
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <div className="text-xl font-black" style={{ color: '#e2e8f0' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
        <input type="text" placeholder="Search users by name, badge, or email..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
          style={{ background: 'rgba(13,27,42,0.8)', border: search ? '1px solid rgba(240,165,0,0.3)' : '1px solid rgba(255,255,255,0.06)', color: '#e2e8f0' }} />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4" style={{ color: '#475569' }} />
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="rounded-2xl overflow-hidden card-glass">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(240,165,0,0.1)' }}>
              {['Personnel', 'Badge', 'Role', 'Department', 'Created', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left">
                  <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#334155' }}>{h}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => {
              const rc = roleColors[u.role] || roleColors.OFFICER;
              return (
                <tr key={u.id} className="evidence-row transition-all" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
                        style={{ background: 'linear-gradient(135deg, #1e3a5f, #0d1b2a)', border: '1px solid rgba(240,165,0,0.15)', color: '#f0a500' }}>
                        {u.firstName[0]}{u.lastName[0]}
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#cbd5e1' }}>{u.firstName} {u.lastName}</p>
                        <p className="text-[10px]" style={{ color: '#475569' }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded"
                      style={{ background: 'rgba(240,165,0,0.08)', color: '#f0a500', border: '1px solid rgba(240,165,0,0.15)' }}>
                      {u.badgeNumber}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full"
                      style={{ background: rc.bg, border: `1px solid ${rc.border}`, color: rc.color }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs" style={{ color: '#94a3b8' }}>{u.department}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono" style={{ color: '#475569' }}>{u.createdAt}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button onClick={() => openEdit(u)} title="Edit"
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.15)' }}>
                        <Pencil className="w-3.5 h-3.5" style={{ color: '#38bdf8' }} />
                      </button>
                      {deleteConfirm === u.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(u.id)} title="Confirm Delete"
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                            <Check className="w-3.5 h-3.5" style={{ color: '#ef4444' }} />
                          </button>
                          <button onClick={() => setDeleteConfirm(null)} title="Cancel"
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ background: 'rgba(255,255,255,0.03)' }}>
                            <X className="w-3.5 h-3.5" style={{ color: '#64748b' }} />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setDeleteConfirm(u.id)} title="Delete"
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)' }}>
                          <Trash2 className="w-3.5 h-3.5" style={{ color: '#f87171' }} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6 animate-fade-in-up" style={{ background: '#0a0f1e', border: '1px solid rgba(240,165,0,0.2)', boxShadow: '0 0 40px rgba(240,165,0,0.1)' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: '#e2e8f0' }}>
                <Shield className="w-5 h-5" style={{ color: '#f0a500' }} />
                {editingUser ? 'Edit User' : 'Create New User'}
              </h3>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="p-1 rounded-lg" style={{ color: '#64748b' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InputField label="First Name" value={form.firstName} onChange={(e: any) => setForm({ ...form, firstName: e.target.value })} placeholder="John" />
                <InputField label="Last Name" value={form.lastName} onChange={(e: any) => setForm({ ...form, lastName: e.target.value })} placeholder="Doe" />
              </div>
              <InputField label="Email" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} placeholder="john@police.gov" type="email" />
              <div className="grid grid-cols-2 gap-3">
                <InputField label="Badge Number" value={form.badgeNumber} onChange={(e: any) => setForm({ ...form, badgeNumber: e.target.value })} placeholder="PD-XXXX" />
                <div>
                  <label className="block text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: '#475569' }}>Role</label>
                  <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                    className="w-full py-2.5 px-3 rounded-xl text-sm outline-none appearance-none"
                    style={{ background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                    <option value="OFFICER">Officer</option>
                    <option value="INVESTIGATOR">Investigator</option>
                    <option value="AUDITOR">Auditor</option>
                  </select>
                </div>
              </div>
              <InputField label="Department" value={form.department} onChange={(e: any) => setForm({ ...form, department: e.target.value })} placeholder="Homicide" />
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase mb-1.5" style={{ color: '#475569' }}>
                  {editingUser ? 'New Password (leave empty to keep)' : 'Password'}
                </label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••••••"
                    className="w-full py-2.5 px-3.5 pr-10 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }} />
                  <button onClick={() => setShowPass(!showPass)} type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: '#475569' }}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => { setShowModal(false); resetForm(); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>Cancel</button>
              <button onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #f0a500, #d97706)', color: '#030712', boxShadow: '0 0 16px rgba(240,165,0,0.3)' }}>
                <Save className="w-4 h-4" /> {editingUser ? 'Update User' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
