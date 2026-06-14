import React from 'react';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  MOCK_BOOKS, MOCK_TEACHER_TRANSACTIONS, MOCK_BOOK_REQUESTS, getBookById,
} from '../data/mockData';
import { BookOpen, Clock, PlusSquare, BookText, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';

const STATUS_STYLE = {
  approved: { bg:'rgba(134,239,172,0.12)', color:'#86efac', border:'rgba(134,239,172,0.30)' },
  pending:  { bg:'rgba(253,230,138,0.10)', color:'#fde68a', border:'rgba(253,230,138,0.28)' },
  rejected: { bg:'rgba(239,68,68,0.10)',   color:'#fca5a5', border:'rgba(239,68,68,0.25)'   },
};

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

export default function TeacherDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // My transactions
  const myTxns    = MOCK_TEACHER_TRANSACTIONS.filter(t => t.teacherId === user?.id);
  const active    = myTxns.filter(t => !t.returned);
  const overdue   = active.filter(t => new Date(t.dueDate) < new Date());
  const myReqs    = MOCK_BOOK_REQUESTS.filter(r => r.teacherId === user?.id);
  const available = MOCK_BOOKS.filter(b => b.availableCopies > 0).length;

  return (
    <Layout>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p className="section-eyebrow">Staff Portal</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', color:'#f1f5f9', marginBottom:'0.25rem' }}>
          Welcome, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color:'#64748b', fontSize:'0.875rem' }}>
          {user?.designation} · {user?.department} · Staff ID: {user?.staffId}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'1rem', marginBottom:'2.5rem' }}>
        <StatCard label="Books Borrowed"    value={active.length}    accentColor="#c084fc" icon={<BookOpen size={20}/>}/>
        <StatCard label="Overdue"           value={overdue.length}   accentColor="#fca5a5" icon={<AlertTriangle size={20}/>}/>
        <StatCard label="Available in Lib"  value={available}        accentColor="#86efac" icon={<CheckCircle size={20}/>}/>
        <StatCard label="My Requests"       value={myReqs.length}    accentColor="#7dd3fc" icon={<PlusSquare size={20}/>}/>
      </div>

      {/* Privilege banner */}
      <div style={{
        display:'flex', alignItems:'center', gap:'0.75rem',
        padding:'0.85rem 1.25rem', borderRadius:12, marginBottom:'2rem',
        background:'rgba(192,132,252,0.07)', border:'1px solid rgba(192,132,252,0.22)',
      }}>
        <BookOpen size={16} color="#c084fc"/>
        <p style={{ fontSize:'0.85rem', color:'#94a3b8' }}>
          <strong style={{ color:'#c084fc' }}>Staff Privileges Active:</strong>
          {' '}30-day loan period · Priority access · Book procurement requests · E-book access
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
        {/* Active loans */}
        <div style={{
          background:'rgba(15,23,42,0.60)', backdropFilter:'blur(12px)',
          border:'1px solid rgba(196,181,253,0.14)', borderRadius:14, padding:'1.25rem',
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", color:'#f1f5f9', fontSize:'1rem' }}>Active Loans</h3>
            <button onClick={() => navigate('/teacher/loans')}
              style={{ background:'none', border:'none', color:'#c084fc', cursor:'pointer',
                fontSize:'0.75rem', display:'flex', alignItems:'center', gap:'0.3rem' }}>
              View all <ArrowRight size={12}/>
            </button>
          </div>
          {active.length === 0 ? (
            <p style={{ color:'#475569', fontSize:'0.85rem', textAlign:'center', padding:'1.5rem 0' }}>No active loans</p>
          ) : active.slice(0, 4).map(t => {
            const book = getBookById(t.bookId);
            const isOverdue = new Date(t.dueDate) < new Date();
            return (
              <div key={t.id} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'0.6rem 0', borderBottom:'1px solid rgba(196,181,253,0.07)',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                  <div style={{
                    width:8, height:8, borderRadius:'50%', flexShrink:0,
                    background: isOverdue ? '#fca5a5' : '#86efac',
                  }}/>
                  <div>
                    <p style={{ fontSize:'0.82rem', color:'#e2e8f0', fontWeight:600 }}>{book?.title}</p>
                    <p style={{ fontSize:'0.68rem', color:'#475569' }}>Due: {fmtDate(t.dueDate)}</p>
                  </div>
                </div>
                {isOverdue && (
                  <span style={{ fontSize:'0.65rem', fontWeight:700, padding:'2px 7px', borderRadius:10,
                    background:'rgba(239,68,68,0.14)', color:'#fca5a5', border:'1px solid rgba(239,68,68,0.25)' }}>
                    OVERDUE
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Procurement requests */}
        <div style={{
          background:'rgba(15,23,42,0.60)', backdropFilter:'blur(12px)',
          border:'1px solid rgba(125,211,252,0.14)', borderRadius:14, padding:'1.25rem',
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", color:'#f1f5f9', fontSize:'1rem' }}>Book Requests</h3>
            <button onClick={() => navigate('/teacher/request')}
              style={{ background:'none', border:'none', color:'#7dd3fc', cursor:'pointer',
                fontSize:'0.75rem', display:'flex', alignItems:'center', gap:'0.3rem' }}>
              New request <PlusSquare size={12}/>
            </button>
          </div>
          {myReqs.length === 0 ? (
            <p style={{ color:'#475569', fontSize:'0.85rem', textAlign:'center', padding:'1.5rem 0' }}>No requests yet</p>
          ) : myReqs.map(r => {
            const s = STATUS_STYLE[r.status];
            return (
              <div key={r.id} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'0.6rem 0', borderBottom:'1px solid rgba(196,181,253,0.07)',
              }}>
                <div>
                  <p style={{ fontSize:'0.82rem', color:'#e2e8f0', fontWeight:600,
                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:180 }}>
                    {r.title}
                  </p>
                  <p style={{ fontSize:'0.68rem', color:'#475569' }}>{r.author}</p>
                </div>
                <span style={{ fontSize:'0.65rem', fontWeight:700, padding:'2px 8px', borderRadius:10,
                  background:s.bg, color:s.color, border:`1px solid ${s.border}`, flexShrink:0 }}>
                  {r.status.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ marginTop:'2rem' }}>
        <h3 style={{ fontFamily:"'Playfair Display',serif", color:'#94a3b8', fontSize:'0.9rem',
          marginBottom:'0.75rem', textTransform:'uppercase', letterSpacing:'0.08em' }}>Quick Actions</h3>
        <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
          {[
            { label:'Browse Books',    icon:<BookOpen size={15}/>,   path:'/teacher/books',   color:'#c084fc' },
            { label:'Read E-Books',    icon:<BookText size={15}/>,   path:'/teacher/ebooks',  color:'#7dd3fc' },
            { label:'Request a Book',  icon:<PlusSquare size={15}/>, path:'/teacher/request', color:'#86efac' },
            { label:'View My Loans',   icon:<Clock size={15}/>,      path:'/teacher/loans',   color:'#fde68a' },
          ].map(a => (
            <button key={a.label} onClick={() => navigate(a.path)}
              style={{
                display:'flex', alignItems:'center', gap:'0.5rem',
                padding:'0.65rem 1.1rem', borderRadius:10, cursor:'pointer', fontSize:'0.82rem', fontWeight:600,
                background:`${a.color}10`, border:`1px solid ${a.color}30`, color:a.color,
                transition:'all .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background=`${a.color}20`; }}
              onMouseLeave={e => { e.currentTarget.style.background=`${a.color}10`; }}>
              {a.icon} {a.label}
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
}
