import React, { useState } from 'react';
import Layout from '../components/Layout';
import ManualBorrowModule from '../components/ManualBorrowModule';
import { ClipboardEdit, Info, BookOpen, Wifi, WifiOff, AlertTriangle, CheckCircle, Clock, List } from 'lucide-react';

const HOW_TO = [
  { icon: WifiOff, color:'#fde68a', title:'When Scanner Fails', desc:'Go to Sidebar → Manual Entry (marked with KEY badge). This module is always available regardless of scanner status.' },
  { icon: List,    color:'#c084fc', title:'Select Reason',      desc:'Choose why you are using manual entry — power failure, barcode torn, new book, emergency lending, etc.' },
  { icon: BookOpen,color:'#818cf8', title:'Find the Book',      desc:'Type the book title, author name, or ISBN in the live search. Select the correct edition and shelf.' },
  { icon: CheckCircle, color:'#86efac', title:'Get Receipt',    desc:'After submission a printable receipt is generated. Print it or note the receipt number for your physical register.' },
];

export default function ManualEntryPage() {
  const [history, setHistory] = useState(
    () => JSON.parse(localStorage.getItem('libriq_manual_entries') || '[]')
  );
  const [activeTab, setActiveTab] = useState('form');   // 'form' | 'guide' | 'log'

  const handleSuccess = entry => {
    setHistory(prev => [entry, ...prev]);
  };

  return (
    <Layout>
      {/* Header */}
      <div style={{ marginBottom:'1.75rem' }}>
        <p className="section-eyebrow">Offline Module</p>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', color:'#f1f5f9' }}>
              Manual Book Entry
            </h1>
            <p style={{ color:'#64748b', fontSize:'0.875rem', marginTop:'0.25rem' }}>
              Use when the barcode / QR scanner is not available or not working
            </p>
          </div>
          {/* Scanner status indicator (demo) */}
          <div style={{
            display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.6rem 1.1rem', borderRadius:10,
            background:'rgba(239,68,68,.10)', border:'1px solid rgba(239,68,68,.25)',
            color:'#fca5a5', fontSize:'0.82rem',
          }}>
            <WifiOff size={15}/>
            Scanner Offline — Manual Mode Active
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display:'flex', gap:0, marginBottom:'1.75rem',
        background:'rgba(15,23,42,.7)', borderRadius:12, padding:'4px',
        width:'fit-content',
      }}>
        {[
          { id:'form',  label:'Entry Form', icon: ClipboardEdit },
          { id:'guide', label:'How to Use',  icon: Info         },
          { id:'log',   label:`Log (${history.length})`, icon: List },
        ].map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              style={{
                display:'flex', alignItems:'center', gap:'0.4rem',
                padding:'0.5rem 1.1rem', borderRadius:9, border:'none', cursor:'pointer',
                fontSize:'0.875rem', fontWeight: activeTab === t.id ? 700 : 500,
                background: activeTab === t.id
                  ? 'linear-gradient(135deg,rgba(192,132,252,.30),rgba(129,140,248,.20))'
                  : 'none',
                color: activeTab === t.id ? '#c4b5fd' : '#64748b',
                border: activeTab === t.id ? '1px solid rgba(192,132,252,.35)' : '1px solid transparent',
                transition:'all .2s',
              }}
            >
              <Icon size={15}/> {t.label}
            </button>
          );
        })}
      </div>

      {/* ── Entry Form ── */}
      {activeTab === 'form' && <ManualBorrowModule onSuccess={handleSuccess}/>}

      {/* ── How to Guide ── */}
      {activeTab === 'guide' && (
        <div className="fade-in">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem', marginBottom:'2rem' }}>
            {HOW_TO.map((h, i) => {
              const Icon = h.icon;
              return (
                <div key={h.title} className="card" style={{ padding:'1.5rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.9rem' }}>
                    <div style={{
                      width:36, height:36, borderRadius:10, flexShrink:0,
                      background:`${h.color}1a`, border:`1px solid ${h.color}40`,
                      display:'flex', alignItems:'center', justifyContent:'center',
                    }}>
                      <Icon size={18} color={h.color}/>
                    </div>
                    <div style={{
                      width:24, height:24, borderRadius:'50%', flexShrink:0,
                      background:'rgba(192,132,252,.15)', border:'1px solid rgba(192,132,252,.30)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontSize:'0.72rem', fontWeight:700, color:'#c084fc',
                    }}>
                      {i + 1}
                    </div>
                  </div>
                  <h3 style={{ fontFamily:"'Playfair Display',serif", color:'#f1f5f9', marginBottom:'0.4rem' }}>
                    {h.title}
                  </h3>
                  <p style={{ fontSize:'0.85rem', color:'#64748b', lineHeight:1.6 }}>{h.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Navigation path callout */}
          <div className="card" style={{
            padding:'1.5rem',
            background:'rgba(125,211,252,.07)',
            border:'1px solid rgba(125,211,252,.28)',
          }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", color:'#7dd3fc', marginBottom:'1rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
              <Info size={18}/> How to Find Manual Entry
            </h3>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap', fontSize:'0.85rem', color:'#94a3b8' }}>
              {['Sidebar (left)', '→', 'Manual Entry', '→', 'ClipboardEdit icon (marked KEY)', '→', 'Fill 5-step form', '→', 'Submit & Print'].map((s, i) => (
                <span key={i} style={{ color: s === '→' ? '#334155' : s.includes('KEY') ? '#7dd3fc' : '#94a3b8', fontWeight: s.includes('KEY') ? 700 : 400 }}>
                  {s}
                </span>
              ))}
            </div>
            <div style={{ marginTop:'1.25rem', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
              {[
                { label:'Shortcut', value:'Sidebar → Manual Entry (KEY)' },
                { label:'Requires login', value:'Librarian account only' },
                { label:'Receipt', value:'Printable PDF / on-screen' },
                { label:'Works offline', value:'Yes — local storage backup' },
              ].map(({label, value}) => (
                <div key={label} style={{ background:'rgba(15,23,42,.5)', borderRadius:8, padding:'0.6rem 0.9rem' }}>
                  <p style={{ fontSize:'0.7rem', color:'#475569', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em' }}>{label}</p>
                  <p style={{ fontSize:'0.82rem', color:'#cbd5e1', marginTop:'0.2rem' }}>{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Log ── */}
      {activeTab === 'log' && (
        <div className="fade-in">
          {history.length === 0 ? (
            <div className="card" style={{ padding:'3rem', textAlign:'center', color:'#475569' }}>
              <ClipboardEdit size={40} style={{ marginBottom:'1rem', opacity:0.3 }}/>
              <p>No manual entries yet in this session.</p>
            </div>
          ) : (
            <div className="card" style={{ padding:0, overflow:'hidden' }}>
              <div style={{ overflowX:'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Receipt</th>
                      <th>Book</th>
                      <th>Borrower</th>
                      <th>Roll No</th>
                      <th>Borrow Date</th>
                      <th>Due Date</th>
                      <th>Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map(e => (
                      <tr key={e.id}>
                        <td style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'0.75rem', color:'#7dd3fc' }}>
                          MAN-{e.id}
                        </td>
                        <td style={{ fontSize:'0.85rem', color:'#e2e8f0' }}>{e.book?.title}</td>
                        <td style={{ fontSize:'0.85rem' }}>{e.student?.name}</td>
                        <td style={{ fontFamily:'JetBrains Mono,monospace', fontSize:'0.75rem', color:'#64748b' }}>
                          {e.student?.rollNo}
                        </td>
                        <td style={{ fontSize:'0.82rem', color:'#64748b' }}>
                          {new Date(e.borrowDate).toLocaleDateString('en-IN')}
                        </td>
                        <td style={{ fontSize:'0.82rem', color:'#64748b' }}>
                          {new Date(e.dueDate).toLocaleDateString('en-IN')}
                        </td>
                        <td>
                          <span className="badge-manual">{e.reason}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </Layout>
  );
}