import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen, Users, AlertTriangle, ClipboardEdit,
  ArrowLeftRight, TrendingUp, Clock, IndianRupee,
  QrCode, MessageSquare, ScanLine, CheckCircle,
} from 'lucide-react';
import {
  MOCK_BOOKS, MOCK_TRANSACTIONS, MOCK_STUDENTS,
  getBookById, getStudentById,
} from '../data/mockData';

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day:'2-digit', month:'short' });
}

export default function LibrarianDashboard() {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

  // Stats
  const totalBooks       = MOCK_BOOKS.reduce((s,b) => s + b.totalCopies, 0);
  const availableBooks   = MOCK_BOOKS.reduce((s,b) => s + b.availableCopies, 0);
  const activeBorrows    = MOCK_TRANSACTIONS.filter(t => !t.returned).length;
  const overdue          = MOCK_TRANSACTIONS.filter(t => !t.returned && new Date(t.dueDate) < new Date());
  const totalFines       = MOCK_TRANSACTIONS.reduce((s,t) => s + (t.fine || 0), 0);
  const manualEntries    = MOCK_TRANSACTIONS.filter(t => t.method === 'manual').length;
  const manualLocal      = JSON.parse(localStorage.getItem('libriq_manual_entries') || '[]');

  const recentTx = [...MOCK_TRANSACTIONS].reverse().slice(0, 6);

  const QUICK = [
    { to:'/librarian/books',        icon: BookOpen,      label:'Books Catalog',  color:'#c084fc' },
    { to:'/librarian/transactions', icon: ArrowLeftRight, label:'Transactions',  color:'#818cf8' },
    { to:'/librarian/manual-entry', icon: ClipboardEdit, label:'Manual Entry',   color:'#7dd3fc', highlight:true },
    { to:'/librarian/demand',       icon: TrendingUp,    label:'Demand Predict', color:'#f9a8d4' },
    { to:'/librarian/camera',       icon: ScanLine,      label:'QR Scanner',     color:'#86efac' },
    { to:'/librarian/chatbot',      icon: MessageSquare, label:'AI Assistant',   color:'#a78bfa' },
  ];

  return (
    <Layout>
      {/* ── Header ── */}
      <div style={{ marginBottom:'2rem' }}>
        <p className="section-eyebrow">Librarian Panel</p>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', color:'#f1f5f9', marginBottom:'0.25rem' }}>
              Good {time.getHours() < 12 ? 'Morning' : time.getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color:'#475569', fontSize:'0.875rem' }}>
              {time.toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}
              {' · '}{time.toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })}
            </p>
          </div>
          {overdue.length > 0 && (
            <div style={{
              display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.6rem 1rem', borderRadius:10,
              background:'rgba(253,230,138,.10)', border:'1px solid rgba(253,230,138,.30)',
              color:'#fde68a', fontSize:'0.85rem',
            }}>
              <AlertTriangle size={16}/>
              {overdue.length} overdue book{overdue.length > 1 ? 's' : ''} need attention
            </div>
          )}
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        <StatCard label="Total Books"     value={totalBooks}       icon={BookOpen}      accentColor="#c084fc" trend={5}  trendLabel="vs last month"/>
        <StatCard label="Available Now"   value={availableBooks}   icon={CheckCircle}   accentColor="#86efac" sub={`${totalBooks - availableBooks} borrowed`}/>
        <StatCard label="Active Borrows"  value={activeBorrows}    icon={ArrowLeftRight} accentColor="#818cf8"/>
        <StatCard label="Overdue"         value={overdue.length}   icon={AlertTriangle} accentColor="#fde68a" sub="immediate action"/>
        <StatCard label="Total Fines (₹)" value={`₹${totalFines}`} icon={IndianRupee}   accentColor="#f9a8d4"/>
        <StatCard label="Manual Entries"  value={manualEntries + manualLocal.length} icon={ClipboardEdit} accentColor="#7dd3fc" sub="offline logs"/>
      </div>

      {/* ── Body grid ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'1.5rem' }}>

        {/* Recent Transactions */}
        <div className="card" style={{ padding:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', color:'#f1f5f9' }}>
              Recent Transactions
            </h2>
            <Link to="/librarian/transactions" style={{ fontSize:'0.8rem', color:'#c084fc', textDecoration:'none' }}>
              View all →
            </Link>
          </div>
          <div style={{ overflowX:'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Student</th>
                  <th>Due</th>
                  <th>Status</th>
                  <th>Method</th>
                </tr>
              </thead>
              <tbody>
                {recentTx.map(tx => {
                  const book = getBookById(tx.bookId);
                  const stu  = getStudentById(tx.studentId);
                  const over = !tx.returned && new Date(tx.dueDate) < new Date();
                  return (
                    <tr key={tx.id}>
                      <td style={{ maxWidth:180 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                          <div style={{ width:6, height:6, borderRadius:'50%', flexShrink:0, background: book?.accentColor || '#c084fc' }}/>
                          <span style={{ fontSize:'0.82rem', color:'#e2e8f0',
                                        overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {book?.title}
                          </span>
                        </div>
                      </td>
                      <td style={{ fontSize:'0.82rem' }}>{stu?.name}</td>
                      <td style={{ fontSize:'0.82rem', color: over ? '#fde68a' : '#64748b' }}>
                        {fmtDate(tx.dueDate)}
                      </td>
                      <td>
                        <span className={
                          tx.returned ? 'badge-returned'
                          : over       ? 'badge-overdue'
                                       : 'badge-available'
                        }>
                          {tx.returned ? 'Returned' : over ? 'Overdue' : 'Active'}
                        </span>
                      </td>
                      <td>
                        <span className={tx.method === 'manual' ? 'badge-manual' : 'badge-returned'}>
                          {tx.method === 'manual' ? '✍ Manual' : '⬡ Scan'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {/* Quick Actions */}
          <div className="card" style={{ padding:'1.5rem' }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', color:'#f1f5f9', marginBottom:'1rem' }}>
              Quick Actions
            </h2>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
              {QUICK.map(q => {
                const Icon = q.icon;
                return (
                  <Link key={q.to} to={q.to} style={{ textDecoration:'none' }}>
                    <div style={{
                      display:'flex', alignItems:'center', gap:'0.75rem',
                      padding:'0.7rem 0.9rem', borderRadius:10,
                      background: q.highlight ? 'rgba(125,211,252,.08)' : 'rgba(196,181,253,.05)',
                      border: q.highlight ? '1px dashed rgba(125,211,252,.35)' : '1px solid rgba(196,181,253,.12)',
                      cursor:'pointer', transition:'all .2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = q.highlight
                      ? 'rgba(125,211,252,.15)' : 'rgba(196,181,253,.12)'}
                    onMouseLeave={e => e.currentTarget.style.background = q.highlight
                      ? 'rgba(125,211,252,.08)' : 'rgba(196,181,253,.05)'}
                    >
                      <Icon size={16} color={q.color}/>
                      <span style={{
                        fontSize:'0.875rem', fontWeight:600,
                        color: q.highlight ? '#7dd3fc' : '#cbd5e1',
                      }}>
                        {q.label}
                      </span>
                      {q.highlight && (
                        <span style={{
                          marginLeft:'auto', fontSize:'0.62rem', fontWeight:700,
                          padding:'2px 7px', borderRadius:4,
                          background:'rgba(125,211,252,.20)', color:'#7dd3fc',
                        }}>KEY</span>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Overdue list */}
          {overdue.length > 0 && (
            <div className="card" style={{ padding:'1.25rem', border:'1px solid rgba(253,230,138,.25)' }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', color:'#fde68a', marginBottom:'0.9rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                <AlertTriangle size={15}/> Overdue Alerts
              </h2>
              {overdue.map(tx => {
                const book = getBookById(tx.bookId);
                const stu  = getStudentById(tx.studentId);
                const days = Math.floor((new Date() - new Date(tx.dueDate)) / 86400000);
                return (
                  <div key={tx.id} style={{
                    paddingBottom:'0.6rem', marginBottom:'0.6rem',
                    borderBottom:'1px solid rgba(253,230,138,.10)',
                  }}>
                    <p style={{ fontSize:'0.82rem', color:'#f1f5f9', fontWeight:600 }}>{book?.title}</p>
                    <p style={{ fontSize:'0.75rem', color:'#64748b' }}>{stu?.name} · {stu?.rollNo}</p>
                    <p style={{ fontSize:'0.75rem', color:'#fde68a', marginTop:'0.2rem' }}>
                      {days}d overdue · ₹{days * 5} fine
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}