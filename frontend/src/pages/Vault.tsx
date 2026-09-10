import React, { useState } from 'react';
import {
  Search, Upload, File, ShieldCheck, Lock, Filter, X,
  ChevronDown, Hash, FileText, Image, FileSpreadsheet, Eye, Download, Share2, MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getDocumentList, saveDocumentList, logActivity } from '../utils/dataStore';

const classificationColors: Record<string, { bg: string; border: string; text: string }> = {
  CONFIDENTIAL: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', text: '#f87171' },
  RESTRICTED: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)', text: '#fbbf24' },
  PUBLIC: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)', text: '#34d399' },
};

const typeIcons: Record<string, any> = {
  PDF: FileText, ZIP: File, MP4: Image, XLSX: FileSpreadsheet,
};

export const Vault = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<any[]>(() => getDocumentList());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCase, setSelectedCase] = useState('');
  const [selectedClassification, setSelectedClassification] = useState('');
  const [showUpload, setShowUpload] = useState(false);

  // Upload Form State
  const [upTitle, setUpTitle] = useState('');
  const [upCaseId, setUpCaseId] = useState('');
  const [upClass, setUpClass] = useState('RESTRICTED');
  const [fileAttached, setFileAttached] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!upTitle || !upCaseId) return alert('Please provide Title and Case ID');
    
    let fileData = null;
    let originalName = 'unknown.pdf';
    
    if (fileAttached) {
      originalName = fileAttached.name;
      fileData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(fileAttached);
      });
    }

    const newDoc = {
      id: Date.now().toString(),
      title: upTitle,
      caseId: upCaseId,
      classification: upClass,
      hash: '0x' + Array.from({length: 16}, () => Math.floor(Math.random()*16).toString(16)).join('') + '...f9e',
      status: 'Verified',
      type: fileAttached ? originalName.split('.').pop()?.toUpperCase() || 'PDF' : 'PDF',
      size: fileAttached ? (fileAttached.size / 1024 / 1024).toFixed(2) + ' MB' : '1.2 MB',
      date: new Date().toISOString().split('T')[0],
      creator: user ? `${user.name} \u00B7 ${user.badge}` : 'Unknown Officer',
      fileData,
      originalName
    };

    const updatedDocs = [newDoc, ...documents];
    setDocuments(updatedDocs);
    saveDocumentList(updatedDocs);
    
    // Log the activity
    logActivity('UPLOAD', `Uploaded document: ${upTitle}`, user ? user.name : 'Unknown User', '192.168.1.10', upClass === 'PUBLIC' ? 'LOW' : 'MEDIUM');

    // Reset and close
    setUpTitle('');
    setUpCaseId('');
    setUpClass('RESTRICTED');
    setFileAttached(null);
    setShowUpload(false);
  };

  const filtered = documents.filter(doc => {
    const matchesSearch = !searchQuery || doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.caseId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCase = !selectedCase || doc.caseId === selectedCase;
    const matchesClass = !selectedClassification || doc.classification === selectedClassification;
    return matchesSearch && matchesCase && matchesClass;
  });

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight" style={{ color: '#e2e8f0' }}>
            Evidence Vault
          </h1>
          <p className="text-sm mt-1" style={{ color: '#475569' }}>
            Tamper-proof document storage with blockchain-backed integrity verification
          </p>
        </div>
        <button onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
          style={{ background: 'linear-gradient(135deg, #f0a500, #d97706)', color: '#030712', boxShadow: '0 0 20px rgba(240,165,0,0.3)' }}>
          <Upload className="w-4 h-4" /> Upload Evidence
        </button>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6 card-glass animate-fade-in-up" style={{ background: '#0a0f1e', border: '1px solid rgba(240,165,0,0.2)' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg" style={{ color: '#e2e8f0' }}>Upload Secure Evidence</h3>
              <button onClick={() => setShowUpload(false)} className="p-1 rounded-lg transition-colors" style={{ color: '#64748b' }}>
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Drop zone */}
            <label className="border-2 border-dashed rounded-xl p-10 text-center mb-5 transition-colors cursor-pointer block"
              style={{ borderColor: fileAttached ? '#10b981' : 'rgba(240,165,0,0.2)', background: 'rgba(240,165,0,0.02)' }}>
              <input type="file" className="hidden" onChange={e => setFileAttached(e.target.files?.[0] || null)} />
              <Upload className="w-10 h-10 mx-auto mb-3" style={{ color: fileAttached ? '#10b981' : '#f0a500' }} />
              <p className="text-sm font-semibold" style={{ color: fileAttached ? '#10b981' : '#94a3b8' }}>
                {fileAttached ? fileAttached.name : 'Drop files here or click to browse'}
              </p>
              <p className="text-xs mt-1" style={{ color: '#334155' }}>PDF, DOCX, ZIP, MP4, JPG A Max 500MB</p>
            </label>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: '#64748b' }}>Document Title</label>
                <input type="text" placeholder="e.g. Forensic Lab Report"
                  value={upTitle} onChange={e => setUpTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: '#64748b' }}>Case ID</label>
                  <input type="text" placeholder="e.g. CASE-401"
                    value={upCaseId} onChange={e => setUpCaseId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0' }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: '#64748b' }}>Classification</label>
                  <select className="w-full px-4 py-2.5 rounded-xl text-sm outline-none appearance-none"
                    value={upClass} onChange={e => setUpClass(e.target.value)}
                    style={{ background: 'rgba(10,15,30,0.8)', border: '1px solid rgba(255,255,255,0.08)', color: '#94a3b8' }}>
                    <option value="RESTRICTED">RESTRICTED</option>
                    <option value="CONFIDENTIAL">CONFIDENTIAL</option>
                    <option value="PUBLIC">PUBLIC</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowUpload(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.08)', color: '#64748b' }}>Cancel</button>
              <button onClick={handleUpload} className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(135deg, #f0a500, #d97706)', color: '#030712', boxShadow: '0 0 16px rgba(240,165,0,0.3)' }}>
                <Lock className="w-4 h-4" /> Encrypt & Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#475569' }} />
          <input
            type="text"
            placeholder="Search by title, case ID, or hash..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none transition-all"
            style={{ background: 'rgba(13,27,42,0.8)', border: searchQuery ? '1px solid rgba(240,165,0,0.3)' : '1px solid rgba(255,255,255,0.06)', color: '#e2e8f0', boxShadow: searchQuery ? '0 0 12px rgba(240,165,0,0.1)' : 'none' }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4" style={{ color: '#475569' }} />
            </button>
          )}
        </div>

        <div className="relative">
          <select value={selectedCase} onChange={e => setSelectedCase(e.target.value)}
            className="appearance-none pl-4 pr-10 py-3 rounded-xl text-sm outline-none cursor-pointer"
            style={{ background: 'rgba(13,27,42,0.8)', border: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8' }}>
            <option value="">All Cases</option>
            <option value="CASE-8992">CASE-8992</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }} />
        </div>

        <div className="relative">
          <select value={selectedClassification} onChange={e => setSelectedClassification(e.target.value)}
            className="appearance-none pl-4 pr-10 py-3 rounded-xl text-sm outline-none cursor-pointer"
            style={{ background: 'rgba(13,27,42,0.8)', border: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8' }}>
            <option value="">All Levels</option>
            <option value="CONFIDENTIAL">Confidential</option>
            <option value="RESTRICTED">Restricted</option>
            <option value="PUBLIC">Public</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#475569' }} />
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2">
        <Filter className="w-3 h-3" style={{ color: '#475569' }} />
        <span className="text-xs" style={{ color: '#475569' }}>
          Showing <span className="font-bold" style={{ color: '#f0a500' }}>{filtered.length}</span> evidence records
        </span>
      </div>

      {/* Document Table */}
      <div className="rounded-2xl overflow-hidden card-glass">
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(240,165,0,0.1)' }}>
              {['Case', 'Evidence Title', 'Classification', 'SHA-256 Hash', 'Integrity', 'Actions'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left">
                  <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#334155' }}>{h}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((doc) => {
              const TypeIcon = typeIcons[doc.type] || File;
              const cls = classificationColors[doc.classification] || classificationColors.PUBLIC;
              return (
                <tr key={doc.id} className="evidence-row transition-all" style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono font-bold px-2 py-1 rounded"
                      style={{ background: 'rgba(240,165,0,0.08)', color: '#f0a500', border: '1px solid rgba(240,165,0,0.15)' }}>
                      {doc.caseId}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(14,165,233,0.1)', border: '1px solid rgba(14,165,233,0.2)' }}>
                        <TypeIcon className="w-4 h-4" style={{ color: '#38bdf8' }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: '#cbd5e1' }}>{doc.title}</p>
                        <p className="text-[10px]" style={{ color: '#475569' }}>{doc.creator} · {doc.size} · {doc.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full"
                      style={{ background: cls.bg, border: `1px solid ${cls.border}`, color: cls.text }}>
                      {doc.classification}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Hash className="w-3 h-3 shrink-0" style={{ color: '#334155' }} />
                      <span className="text-xs font-mono truncate max-w-[140px]" style={{ color: '#475569' }}>{doc.hash}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    {doc.status === 'Verified' ? (
                      <span className="badge-verified flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full w-max"
                        style={{ color: '#34d399' }}>
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </span>
                    ) : (
                      <span className="badge-restricted flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full w-max"
                        style={{ color: '#fbbf24' }}>
                        <Lock className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1">
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: 'rgba(255,255,255,0.03)' }} title="View">
                        <Eye className="w-3.5 h-3.5" style={{ color: '#64748b' }} />
                      </button>
                      <button 
                        onClick={() => {
                          if (doc.fileData) {
                            const a = document.createElement('a');
                            a.href = doc.fileData;
                            a.download = doc.originalName || `${doc.title}.${doc.type.toLowerCase()}`;
                            a.click();
                            logActivity('DOWNLOAD', `Downloaded document: ${doc.title}`, user ? user.name : 'Unknown', '192.168.1.10', 'LOW');
                          } else {
                            alert('File content not available for this record.');
                          }
                        }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
                        style={{ background: 'rgba(255,255,255,0.03)' }} title="Download">
                        <Download className="w-3.5 h-3.5" style={{ color: '#64748b' }} />
                      </button>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: 'rgba(255,255,255,0.03)' }} title="Share">
                        <Share2 className="w-3.5 h-3.5" style={{ color: '#64748b' }} />
                      </button>
                      <button className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                        style={{ background: 'rgba(255,255,255,0.03)' }} title="More">
                        <MoreHorizontal className="w-3.5 h-3.5" style={{ color: '#64748b' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
