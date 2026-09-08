import React from 'react';
import { ShieldAlert, FileText, Users, Activity, TrendingUp, Lock, AlertTriangle, CheckCircle } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, delta }: {
  icon: any; label: string; value: string; color: string; delta?: string;
}) => (
  <div className="relative rounded-2xl p-5 overflow-hidden cursor-default card-glass card-3d"
    style={{ borderColor: `${color}30` }}>
    <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5"
      style={{ background: color, transform: 'translate(30%, -30%)' }} />
    <div className="flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center icon-bounce"
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      {delta && (
        <span className="text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1"
          style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>
          <TrendingUp className="w-3 h-3" />{delta}
        </span>
      )}
    </div>
    <div className="text-2xl font-black mb-1 stat-value transition-all" style={{ color: '#e2e8f0' }}>{value}</div>
    <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#475569' }}>{label}</div>
    <div className="absolute bottom-0 left-0 right-0 h-0.5 opacity-30" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
  </div>
);

const recentActivities = [
  { action: 'DOWNLOAD', user: 'Adil Ahmed · PD-1001', doc: 'Forensic Lab Report #FLR-2024-441 — Case #8992', time: '2 min ago', risk: 'low' },
  { action: 'UPLOAD', user: 'Ahtisham Ahmed · PD-1002', doc: 'Crime Scene Photography Set — Case #8992', time: '18 min ago', risk: 'low' },
  { action: 'SHARE', user: 'Akash Chouchan · PD-1003', doc: 'Suspect Interview Transcript — Case #8992', time: '1h ago', risk: 'medium' },
  { action: 'VIEW', user: 'Abdul Ahad · PD-1004', doc: 'Chain of Custody Form #CC-2024-88 — Case #8992', time: '2h ago', risk: 'low' },
  { action: 'MODIFY', user: 'Adil Ahmed · PD-1001', doc: 'Case Summary Report — Case #8992', time: '3h ago', risk: 'high' },
];

const riskColors: Record<string, string> = { low: '#10b981', medium: '#f59e0b', high: '#ef4444' };
const actionColors: Record<string, string> = {
  DOWNLOAD: '#0ea5e9', UPLOAD: '#10b981', SHARE: '#a855f7', VIEW: '#64748b', MODIFY: '#f59e0b'
};

export const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: '#e2e8f0' }}>
            Command Center
          </h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>
            Real-time overview of all evidence assets and department activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold"
            style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }}>
            <CheckCircle className="w-4 h-4" /> All Systems Operational
          </div>
          <div className="px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-semibold"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
            <AlertTriangle className="w-4 h-4" /> 2 Alerts
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShieldAlert} label="Active Cases" value="1,204" color="#f0a500" delta="+12%" />
        <StatCard icon={FileText} label="Secured Documents" value="45,912" color="#0ea5e9" delta="+8%" />
        <StatCard icon={Activity} label="Audit Events Today" value="342" color="#10b981" />
        <StatCard icon={Users} label="Active Personnel" value="89" color="#a855f7" delta="+3" />
      </div>

      {/* Content row */}
      <div className="grid grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="col-span-2 rounded-2xl overflow-hidden card-glass">
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(240,165,0,0.1)' }}>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" style={{ color: '#f0a500' }} />
              <span className="text-sm font-bold" style={{ color: '#e2e8f0' }}>Recent Audit Activity</span>
            </div>
            <span className="text-xs px-2 py-1 rounded-full"
              style={{ background: 'rgba(240,165,0,0.1)', color: '#f0a500', border: '1px solid rgba(240,165,0,0.2)' }}>
              Live
            </span>
          </div>

          <div className="divide-y" style={{ borderColor: 'rgba(255,255,255,0.03)' }}>
            {recentActivities.map((log, i) => (
              <div key={i} className="px-5 py-3 flex items-center gap-4 evidence-row transition-all">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-black"
                  style={{ background: `${actionColors[log.action]}15`, color: actionColors[log.action], border: `1px solid ${actionColors[log.action]}30` }}>
                  {log.action.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate" style={{ color: '#cbd5e1' }}>{log.doc}</p>
                  <p className="text-xs truncate" style={{ color: '#475569' }}>{log.user}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-2 h-2 rounded-full" style={{ background: riskColors[log.risk] }} />
                  <span className="text-xs font-mono" style={{ color: '#334155' }}>{log.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Integrity Status */}
        <div className="rounded-2xl card-glass overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(240,165,0,0.1)' }}>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4" style={{ color: '#f0a500' }} />
              <span className="text-sm font-bold" style={{ color: '#e2e8f0' }}>Integrity Status</span>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: 'Verified (SHA-256)', val: 45818, pct: 99.8, color: '#10b981' },
              { label: 'Blockchain Anchored', val: 45241, pct: 98.5, color: '#0ea5e9' },
              { label: 'Pending Review', val: 89, pct: 0.2, color: '#f59e0b' },
              { label: 'Flagged', val: 5, pct: 0.01, color: '#ef4444' },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span style={{ color: '#64748b' }}>{item.label}</span>
                  <span className="font-mono font-semibold" style={{ color: item.color }}>{item.pct}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <div className="h-full rounded-full transition-all"
                    style={{ width: `${item.pct}%`, background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
                </div>
              </div>
            ))}

            {/* Chain indicator */}
            <div className="mt-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-semibold" style={{ color: '#10b981' }}>Blockchain Node Active</span>
              </div>
              <div className="text-xs font-mono p-2 rounded-lg" style={{ background: 'rgba(10,15,30,0.8)', color: '#334155', wordBreak: 'break-all' }}>
                Latest Tx: 0x8f3d2a...44c9e1
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
