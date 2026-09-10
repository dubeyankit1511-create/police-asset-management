import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useUISettings } from '../context/UIContext';
import {
  Shield, LayoutDashboard, FileLock2, History, LogOut,
  ZoomIn, ZoomOut, Sun, Moon, Type, ChevronRight, Bell, Crown
} from 'lucide-react';

export const MainLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { fontSize, zoom, darkMode, setFontSize, setZoom, toggleDarkMode } = useUISettings();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Command Center', path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { name: 'Evidence Vault', path: '/vault', icon: FileLock2, label: 'Documents' },
    // Admin-only nav items
    ...(user?.role === 'ADMIN' ? [
      { name: 'Audit Trail', path: '/audit', icon: History, label: 'Logs' },
      { name: 'Admin Panel', path: '/admin', icon: Crown, label: 'User Management' }
    ] : []),
  ];

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#030712' }}>

      {/* Sidebar */}
      <div className="w-64 flex flex-col shrink-0"
        style={{ background: 'linear-gradient(180deg, #0a0f1e 0%, #030712 100%)', borderRight: '1px solid rgba(240,165,0,0.1)' }}>

        {/* Logo */}
        <div className="p-5 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(240,165,0,0.1)' }}>
          <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #1e3a5f, #0d1b2a)', border: '1px solid rgba(240,165,0,0.4)', boxShadow: '0 0 16px rgba(240,165,0,0.2)' }}>
            <Shield className="w-5 h-5" style={{ color: '#f0a500' }} />
          </div>
          <div>
            <h2 className="font-black text-sm tracking-widest uppercase" style={{ color: '#f0a500' }}>SECURE SYNC</h2>
            <p className="text-[9px] tracking-widest uppercase" style={{ color: '#334155' }}>Police Asset System</p>
          </div>
        </div>

        {/* Nav label */}
        <div className="px-5 pt-5 pb-2">
          <p className="text-[10px] tracking-widest uppercase font-semibold" style={{ color: '#334155' }}>Navigation</p>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}
                className={`sidebar-link flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? 'active' : ''}`}
                style={{
                  background: isActive ? 'rgba(240,165,0,0.1)' : 'transparent',
                  border: isActive ? '1px solid rgba(240,165,0,0.2)' : '1px solid transparent',
                  color: isActive ? '#f0a500' : '#475569',
                }}>
                <item.icon className="w-4 h-4 shrink-0" />
                <div className="flex-1">
                  <div className="text-xs font-semibold">{item.name}</div>
                  <div className="text-[10px] opacity-60">{item.label}</div>
                </div>
                {isActive && <ChevronRight className="w-3 h-3 opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* UI Controls */}
        <div className="px-3 pb-2" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[10px] tracking-widest uppercase font-semibold px-2 py-3" style={{ color: '#334155' }}>Display</p>

          {/* Font size */}
          <div className="flex items-center gap-2 px-2 mb-3">
            <Type className="w-3 h-3 shrink-0" style={{ color: '#475569' }} />
            <span className="text-[10px] flex-1" style={{ color: '#475569' }}>Font Size: {fontSize}px</span>
            <button onClick={() => setFontSize(Math.max(12, fontSize - 1))}
              className="w-6 h-6 rounded flex items-center justify-center text-xs transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>−</button>
            <button onClick={() => setFontSize(Math.min(20, fontSize + 1))}
              className="w-6 h-6 rounded flex items-center justify-center text-xs transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>+</button>
          </div>

          {/* Zoom */}
          <div className="flex items-center gap-2 px-2 mb-3">
            <ZoomIn className="w-3 h-3 shrink-0" style={{ color: '#475569' }} />
            <span className="text-[10px] flex-1" style={{ color: '#475569' }}>Zoom: {Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom(Math.max(0.7, parseFloat((zoom - 0.1).toFixed(1))))}
              className="w-6 h-6 rounded flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
              <ZoomOut className="w-3 h-3" />
            </button>
            <button onClick={() => setZoom(Math.min(1.5, parseFloat((zoom + 0.1).toFixed(1))))}
              className="w-6 h-6 rounded flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          {/* Dark mode toggle */}
          <div className="flex items-center gap-2 px-2 mb-4">
            {darkMode ? <Moon className="w-3 h-3 shrink-0" style={{ color: '#475569' }} /> : <Sun className="w-3 h-3 shrink-0" style={{ color: '#f0a500' }} />}
            <span className="text-[10px] flex-1" style={{ color: '#475569' }}>{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            <button onClick={toggleDarkMode}
              className="w-10 h-5 rounded-full transition-all relative"
              style={{ background: darkMode ? '#1e3a5f' : '#f0a500' }}>
              <div className="w-4 h-4 rounded-full absolute top-0.5 transition-all"
                style={{ left: darkMode ? '2px' : '22px', background: darkMode ? '#64748b' : '#030712' }} />
            </button>
          </div>
        </div>

        {/* User profile */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(240,165,0,0.1)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm"
              style={{ background: 'linear-gradient(135deg, #f0a500, #d97706)', color: '#030712' }}>
              {(user?.name as string)?.charAt(0) || 'O'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold truncate" style={{ color: '#e2e8f0' }}>{(user?.name as string) || 'Officer'}</p>
              <p className="text-[10px]" style={{ color: '#64748b' }}>{(user?.role as string) || 'OFFICER'}</p>
            </div>
            <Bell className="w-4 h-4 shrink-0" style={{ color: '#475569' }} />
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#ef4444' }}>
            <LogOut className="w-3 h-3" /> Sign Out Securely
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-14 flex items-center px-6 shrink-0"
          style={{ background: 'rgba(10,15,30,0.9)', borderBottom: '1px solid rgba(240,165,0,0.1)', backdropFilter: 'blur(10px)' }}>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs" style={{ color: '#475569' }}>
                All systems operational · Evidence integrity: <span style={{ color: '#10b981' }}>100%</span>
              </span>
            </div>
          </div>
          <div className="text-xs font-mono" style={{ color: '#334155' }}>
            {new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </div>
        </div>

        {/* Page */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
