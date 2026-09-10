import React, { useState } from 'react';
import { Clock, Search, LogIn, LogOut, Shield, Filter } from 'lucide-react';
import { getAccessLogs } from '../utils/dataStore';

export const AccessLogs = () => {
  const [search, setSearch] = useState('');

  const filtered = getAccessLogs().filter((l: any) => {
    return !search || 
      (l.user && l.user.toLowerCase().includes(search.toLowerCase())) || 
      (l.badge && l.badge.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: '#e2e8f0' }}>
            Access Logs
          </h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>
            Complete record of user login and logout activities
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
          <input
            type="text"
            placeholder="Search by officer name or badge number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{ background: 'rgba(13,27,42,0.8)', border: search ? '1px solid rgba(240,165,0,0.3)' : '1px solid rgba(255,255,255,0.06)', color: '#e2e8f0' }}
          />
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center gap-2">
        <Filter className="w-3.5 h-3.5" style={{ color: '#475569' }} />
        <span className="text-xs font-semibold" style={{ color: '#64748b' }}>
          Showing <span style={{ color: '#f0a500' }}>{filtered.length}</span> access records
        </span>
      </div>

      {/* Logs List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-10 text-slate-500 text-sm">
            No access records found matching your search.
          </div>
        )}
        
        {filtered.map((log: any) => {
          const dateObj = new Date(log.timestamp);
          const logDate = dateObj.toLocaleDateString();
          const logTime = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const isLogin = log.action === 'LOGIN';

          return (
            <div key={log.id} className="rounded-xl overflow-hidden transition-all duration-300"
              style={{ background: 'rgba(13,27,42,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
              
              <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-white/5">
                
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ 
                    background: isLogin ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', 
                    border: \1px solid \\ 
                  }}>
                  {isLogin ? (
                    <LogIn className="w-5 h-5" style={{ color: '#34d399' }} />
                  ) : (
                    <LogOut className="w-5 h-5" style={{ color: '#f87171' }} />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold truncate" style={{ color: '#e2e8f0' }}>
                      {isLogin ? 'User Logged In' : 'User Logged Out'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5" style={{ color: '#64748b' }} />
                      <span style={{ color: '#94a3b8' }}>{log.user}</span>
                    </div>
                    {log.badge && (
                      <span className="text-xs font-mono" style={{ color: '#334155' }}>
                        {log.badge}
                      </span>
                    )}
                    <span className="text-xs font-mono" style={{ color: '#334155' }}>
                      IP: {log.ip}
                    </span>
                  </div>
                </div>

                {/* Time */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <div className="text-xs font-mono" style={{ color: '#475569' }}>{logTime}</div>
                    <div className="text-[10px]" style={{ color: '#334155' }}>{logDate}</div>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
