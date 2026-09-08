import React, { useState } from 'react';
import { Activity, User, Search, Filter, Shield, Link2, Clock, ChevronDown, X, Download } from 'lucide-react';

const allLogs = [
  { id: 1, action: 'DOWNLOAD', user: 'Adil Ahmed', badge: 'PD-1001', dept: 'Task Force · Case #8992', doc: 'Forensic Lab Report #FLR-2024-441', time: '10:42 AM', date: '2024-09-08', ip: '192.168.1.44', txId: '0x8f3d2a...44c9e1', risk: 'low' },
  { id: 2, action: 'UPLOAD', user: 'Ahtisham Ahmed', badge: 'PD-1002', dept: 'Task Force · Case #8992', doc: 'Crime Scene Photos — Case #8992', time: '09:15 AM', date: '2024-09-08', ip: '192.168.1.12', txId: '0xa7e81b...221f03', risk: 'low' },
  { id: 3, action: 'SHARE', user: 'Akash Chouchan', badge: 'PD-1003', dept: 'Task Force · Case #8992', doc: 'Suspect Interview Transcript', time: '08:30 AM', date: '2024-09-08', ip: '10.0.0.1', txId: '0xc4f923...8b71d2', risk: 'medium' },
  { id: 4, action: 'VIEW', user: 'Abdul Ahad', badge: 'PD-1004', dept: 'Task Force · Case #8992', doc: 'Chain of Custody Form #CC-88', time: '07:00 AM', date: '2024-09-08', ip: '192.168.3.22', txId: '0x1d5e7a...f9032b', risk: 'low' },
  { id: 5, action: 'MODIFY', user: 'Adil Ahmed', badge: 'PD-1001', dept: 'Task Force · Case #8992', doc: 'Case Summary Report — Case #8992', time: '06:12 AM', date: '2024-09-08', ip: '192.168.1.88', txId: '0xb29d4c...e30712', risk: 'high' },
  { id: 6, action: 'DELETE', user: 'Ahtisham Ahmed', badge: 'PD-1002', dept: 'Task Force · Case #8992', doc: 'Duplicate Evidence File #DUP-92', time: '11:45 PM', date: '2024-09-07', ip: '10.0.0.1', txId: '0xf192a3...7c8e01', risk: 'high' },
];

const actionStyles: Record<string, { bg: string; border: string; color: string }> = {
  DOWNLOAD: { bg: 'rgba(14,165,233,0.1)', border: 'rgba(14,165,233,0.3)', color: '#38bdf8' },
  UPLOAD:   { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', color: '#34d399' },
  SHARE:    { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.3)', color: '#c084fc' },
  VIEW:     { bg: 'rgba(100,116,139,0.1)', border: 'rgba(100,116,139,0.3)', color: '#94a3b8' },
  MODIFY:   { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  color: '#fbbf24' },
  DELETE:   { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   color: '#f87171' },
};

const riskDot: Record<string, string> = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };

export const AuditViewer = () => {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = allLogs.filter(l => {
    const matchSearch = !search || l.user.toLowerCase().includes(search.toLowerCase()) || l.doc.toLowerCase().includes(search.toLowerCase()) || l.badge.toLowerCase().includes(search.toLowerCase());
    const matchAction = !actionFilter || l.action === actionFilter;
    return matchSearch && matchAction;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: '#e2e8f0' }}>
            Immutable Audit Trail
          </h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>
            Blockchain-anchored system activity log · Every action is permanently recorded
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ background: 'rgba(13,27,42,0.8)', border: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8' }}>
          <Download className="w-3.5 h-3.5" /> Export Log
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
          <input
            type="text"
            placeholder="Search by officer name, badge number, or document..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{ background: 'rgba(13,27,42,0.8)', border: search ? '1px solid rgba(240,165,0,0.3)' : '1px solid rgba(255,255,255,0.06)', color: '#e2e8f0' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4" style={{ color: '#475569' }} />
            </button>
          )}
        </div>
        <div className="relative">
          <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}
            className="appearance-none pl-4 pr-10 py-3 rounded-xl text-sm outline-none cursor-pointer"
            style={{ background: 'rgba(13,27,42,0.8)', border: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8' }}>
            <option value="">All Actions</option>
            {Object.keys(actionStyles).map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }} />
        </div>
      </div>

      {/* Result count */}
      <div className="flex items-center gap-2">
        <Filter className="w-3 h-3" style={{ color: '#475569' }} />
        <span className="text-xs" style={{ color: '#475569' }}>
          Showing <span className="font-bold" style={{ color: '#f0a500' }}>{filtered.length}</span> audit entries
        </span>
      </div>

      {/* Timeline / Log list */}
      <div className="space-y-2">
        {filtered.map((log) => {
          const style = actionStyles[log.action] || actionStyles.VIEW;
          const isExpanded = expandedId === log.id;

          return (
            <div key={log.id}
              className="rounded-xl overflow-hidden transition-all cursor-pointer card-glass"
              onClick={() => setExpandedId(isExpanded ? null : log.id)}>

              <div className="px-5 py-4 flex items-center gap-4">
                {/* Action badge */}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xs font-black"
                  style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.color }}>
                  {log.action.slice(0, 3)}
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#cbd5e1' }}>{log.doc}</p>
                  <div className="flex items-center gap-3 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#475569' }}>
                      <User className="w-3 h-3" /> {log.user}
                    </span>
                    <span className="text-xs font-mono" style={{ color: '#334155' }}>
                      {log.badge}
                    </span>
                    <span className="text-xs" style={{ color: '#334155' }}>
                      {log.dept}
                    </span>
                  </div>
                </div>

                {/* Risk + time */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: riskDot[log.risk], boxShadow: `0 0 8px ${riskDot[log.risk]}` }} />
                  <div className="text-right">
                    <div className="text-xs font-mono" style={{ color: '#475569' }}>{log.time}</div>
                    <div className="text-[10px]" style={{ color: '#334155' }}>{log.date}</div>
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {isExpanded && (
                <div className="px-5 pb-4 pt-0 animate-fade-in-up">
                  <div className="rounded-xl p-4 space-y-3"
                    style={{ background: 'rgba(3,7,18,0.6)', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-xs">
                      <div>
                        <span className="block tracking-widest uppercase font-bold mb-0.5" style={{ color: '#334155' }}>IP Address</span>
                        <span className="font-mono" style={{ color: '#94a3b8' }}>{log.ip}</span>
                      </div>
                      <div>
                        <span className="block tracking-widest uppercase font-bold mb-0.5" style={{ color: '#334155' }}>Risk Level</span>
                        <span className="font-semibold capitalize" style={{ color: riskDot[log.risk] }}>{log.risk}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="block tracking-widest uppercase font-bold mb-0.5" style={{ color: '#334155' }}>Blockchain Transaction</span>
                        <div className="flex items-center gap-2">
                          <Link2 className="w-3 h-3 shrink-0" style={{ color: '#0ea5e9' }} />
                          <span className="font-mono" style={{ color: '#38bdf8' }}>{log.txId}</span>
                          <Shield className="w-3 h-3 shrink-0" style={{ color: '#10b981' }} />
                          <span className="text-[10px] font-bold" style={{ color: '#10b981' }}>Anchored</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <Clock className="w-3 h-3" style={{ color: '#334155' }} />
                      <span className="text-[10px]" style={{ color: '#334155' }}>Timestamp recorded in UTC · Cannot be modified or deleted</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
