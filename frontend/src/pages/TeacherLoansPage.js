import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { MOCK_TEACHER_TRANSACTIONS, getBookById } from '../data/mockData';
import { BookOpen, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}
function daysLeft(dueDate) {
  const diff = Math.ceil((new Date(dueDate) - new Date()) / 86_400_000);
  return diff;
}

export default function TeacherLoansPage() {
  const { user } = useAuth();
  const myTxns   = MOCK_TEACHER_TRANSACTIONS.filter(t => t.teacherId === user?.id);
  const active   = myTxns.filter(t => !t.returned);
  const history  = myTxns.filter(t =>  t.returned);

  const Row = ({ t, returned }) => {
    const book    = getBookById(t.bookId);
    const accent  = book?.accentColor || '#c084fc';
    const days    = returned ? null : daysLeft(t.dueDate);
    const overdue = !returned && days < 0;

    return (
      <div style={{
        display:'grid', gridTemplateColumns:'3fr 1fr 1fr 1fr 1fr',
        alignItems:'center', gap:'1rem',
        padding:'0.85rem 1rem', borderRadius:10,
        background:'rgba(15,23,42,0.55)', marginBottom:'0.5rem',
        border:`1px solid ${overdue ? 'rgba(239,68,68,0.25)' : accent+'18'}`,
        transition:'border-color .2s',
      }}>
        {/* Book */}
        <div style={{ display:'flex', alignItems:'center', gap:'0.65rem' }}>
          <div style={{
            width:34, height:44, borderRadius:7, flexShrink:0,
            background:`${accent}18`, border:`1px solid ${accent}30`,
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <BookOpen size={14} color={accent}/>
          </div>
          <div>
            <p style={{ fontSize:'0.85rem', fontWeight:600, color:'#f1f5f9',
              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:200 }}>
              {book?.title}
            </p>
            <p style={{ fontSize:'0.7rem', color:'#64748b' }}>{book?.author}</p>
            {t.notes && <p style={{ fontSize:'0.68rem', color:'#475569', fontStyle:'italic' }}>{t.notes}</p>}
          </div>
        </div>

        {/* Borrow date */}
        <p style={{ fontSize:'0.75rem', color:'#64748b' }}>{fmtDate(t.borrowDate)}</p>

        {/* Due date */}
        <p style={{ fontSize:'0.75rem', color: overdue ? '#fca5a5' : '#e2e8f0' }}>{fmtDate(t.dueDate)}</p>

        {/* Days left / returned */}
        {returned ? (
          <p style={{ fontSize:'0.72rem', color:'#86efac' }}>Returned {fmtDate(t.returnDate)}</p>
        ) : (
          <p style={{ fontSize:'0.75rem', fontWeight:700,
            color: overdue ? '#fca5a5' : days <= 5 ? '#fde68a' : '#86efac' }}>
            {overdue ? `${Math.abs(days)}d overdue` : `${days}d left`}
          </p>
        )}

        {/* Status badge */}
        <span style={{
          fontSize:'0.65rem', fontWeight:700, padding:'3px 9px', borderRadius:10, textAlign:'center',
          background: returned ? 'rgba(134,239,172,0.12)' : overdue ? 'rgba(239,68,68,0.12)' : 'rgba(192,132,252,0.12)',
          color:       returned ? '#86efac'                : overdue ? '#fca5a5'               : '#c4b5fd',
          border:      `1px solid ${returned ? 'rgba(134,239,172,0.30)' : overdue ? 'rgba(239,68,68,0.25)' : 'rgba(192,132,252,0.25)'}`,
        }}>
          {returned ? 'RETURNED' : overdue ? 'OVERDUE' : 'ACTIVE'}
        </span>
      </div>
    );
  };

  return (
    <Layout>
      <div style={{ marginBottom:'2rem' }}>
        <p className="section-eyebrow">Staff Portal</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', color:'#f1f5f9' }}>
          My Loan History
        </h1>
        <p style={{ color:'#64748b', fontSize:'0.875rem', marginTop:'0.25rem' }}>
          Staff loans have a <strong style={{ color:'#c084fc' }}>30-day return period</strong>
        </p>
      </div>

      {/* Summary pills */}
      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'2rem', flexWrap:'wrap' }}>
        {[
          { icon:<Clock size={14}/>,        label:'Active',   value:active.length,         color:'#c084fc' },
          { icon:<AlertTriangle size={14}/>, label:'Overdue',  value:active.filter(t=>daysLeft(t.dueDate)<0).length, color:'#fca5a5' },
          { icon:<CheckCircle size={14}/>,   label:'Returned', value:history.length,         color:'#86efac' },
        ].map(s => (
          <div key={s.label} style={{
            display:'flex', alignItems:'center', gap:'0.5rem',
            padding:'0.5rem 1rem', borderRadius:10,
            background:`${s.color}0f`, border:`1px solid ${s.color}25`,
          }}>
            <span style={{ color:s.color }}>{s.icon}</span>
            <span style={{ fontSize:'1rem', fontWeight:800, color:s.color }}>{s.value}</span>
            <span style={{ fontSize:'0.75rem', color:'#475569' }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Column headers */}
      {myTxns.length > 0 && (
        <div style={{
          display:'grid', gridTemplateColumns:'3fr 1fr 1fr 1fr 1fr',
          gap:'1rem', padding:'0.4rem 1rem', marginBottom:'0.5rem',
        }}>
          {['Book', 'Borrowed', 'Due Date', 'Status', 'Badge'].map(h => (
            <p key={h} style={{ fontSize:'0.68rem', fontWeight:700, textTransform:'uppercase',
              letterSpacing:'0.08em', color:'#334155' }}>{h}</p>
          ))}
        </div>
      )}

      {/* Active loans */}
      {active.length > 0 && (
        <div style={{ marginBottom:'2rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.75rem' }}>
            <div style={{ width:3, height:16, borderRadius:2, background:'#c084fc' }}/>
            <h3 style={{ fontFamily:"'Playfair Display',serif", color:'#f1f5f9', fontSize:'0.95rem' }}>
              Active Loans
            </h3>
          </div>
          {active.map(t => <Row key={t.id} t={t} returned={false}/>)}
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.75rem' }}>
            <div style={{ width:3, height:16, borderRadius:2, background:'#86efac' }}/>
            <h3 style={{ fontFamily:"'Playfair Display',serif", color:'#94a3b8', fontSize:'0.95rem' }}>
              Return History
            </h3>
          </div>
          {history.map(t => <Row key={t.id} t={t} returned={true}/>)}
        </div>
      )}

      {myTxns.length === 0 && (
        <div style={{ textAlign:'center', padding:'4rem', color:'#475569' }}>
          <BookOpen size={44} style={{ opacity:0.2, marginBottom:'1rem' }}/>
          <p>No loan history yet. Go borrow a book!</p>
        </div>
      )}
    </Layout>
  );
}
