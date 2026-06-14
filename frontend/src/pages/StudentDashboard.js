import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Clock, IndianRupee, Star, MessageSquare, ArrowRight } from 'lucide-react';
import {
  MOCK_TRANSACTIONS, MOCK_BOOKS, getBookById, calcFine,
} from '../data/mockData';

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

// Recommend books not yet borrowed by this student
function recommend(studentId, limit = 4) {
  const borrowed = MOCK_TRANSACTIONS.filter(t => t.studentId === studentId).map(t => t.bookId);
  return MOCK_BOOKS.filter(b => !borrowed.includes(b.id) && b.availableCopies > 0).slice(0, limit);
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const studentId = user?.id === 2 ? 2 : 1;   // map demo user

  const myTx     = MOCK_TRANSACTIONS.filter(t => t.studentId === studentId);
  const active   = myTx.filter(t => !t.returned);
  const history  = myTx.filter(t =>  t.returned);
  const overdue  = active.filter(t => new Date(t.dueDate) < new Date());
  const totalFine= myTx.reduce((s,t) => s + (t.fine || 0) + (!t.returned ? calcFine(t.dueDate) : 0), 0);
  const recs     = recommend(studentId);

  return (
    <Layout>
      {/* Header */}
      <div style={{ marginBottom:'2rem' }}>
        <p className="section-eyebrow">Student Portal</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', color:'#f1f5f9' }}>
          Hello, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p style={{ color:'#475569', fontSize:'0.875rem', marginTop:'0.25rem' }}>
          {user?.rollNo} · {user?.department} · Year {user?.year}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:'1rem', marginBottom:'2rem' }}>
        <StatCard label="Currently Borrowed" value={active.length}   icon={BookOpen}     accentColor="#c084fc"/>
        <StatCard label="Overdue"            value={overdue.length}  icon={Clock}        accentColor="#fde68a" sub={overdue.length > 0 ? 'Please return soon' : 'All good!'}/>
        <StatCard label="Total Fine Due"     value={`₹${totalFine}`} icon={IndianRupee}  accentColor="#f9a8d4"/>
        <StatCard label="Books Read"         value={history.length}  icon={Star}         accentColor="#86efac"/>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:'1.5rem' }}>

        {/* Active borrows */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div className="card" style={{ padding:'1.5rem' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.1rem' }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', color:'#f1f5f9' }}>
                Currently Borrowed
              </h2>
              <Link to="/student/books" style={{ fontSize:'0.8rem', color:'#c084fc', textDecoration:'none' }}>
                Browse books →
              </Link>
            </div>
            {active.length === 0 ? (
              <p style={{ color:'#475569', fontSize:'0.875rem', textAlign:'center', padding:'2rem' }}>
                No active borrows. <Link to="/student/books" style={{ color:'#c084fc' }}>Browse books</Link>
              </p>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:'0.65rem' }}>
                {active.map(tx => {
                  const book = getBookById(tx.bookId);
                  const over = new Date(tx.dueDate) < new Date();
                  const days = over ? Math.floor((new Date() - new Date(tx.dueDate)) / 86400000) : 0;
                  return (
                    <div key={tx.id} style={{
                      display:'flex', alignItems:'center', gap:'1rem',
                      padding:'0.9rem 1rem', borderRadius:12,
                      background: over ? 'rgba(253,230,138,.07)' : 'rgba(196,181,253,.06)',
                      border: `1px solid ${over ? 'rgba(253,230,138,.25)' : 'rgba(196,181,253,.15)'}`,
                    }}>
                      <div style={{
                        width:44, height:44, borderRadius:10, flexShrink:0,
                        background:`${book?.accentColor || '#c084fc'}18`,
                        border:`1px solid ${book?.accentColor || '#c084fc'}33`,
                        display:'flex', alignItems:'center', justifyContent:'center',
                      }}>
                        <BookOpen size={18} color={book?.accentColor || '#c084fc'}/>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontSize:'0.9rem', fontWeight:600, color:'#f1f5f9',
                                    overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {book?.title}
                        </p>
                        <p style={{ fontSize:'0.78rem', color:'#64748b' }}>{book?.author}</p>
                      </div>
                      <div style={{ textAlign:'right', flexShrink:0 }}>
                        <p style={{ fontSize:'0.75rem', color: over ? '#fde68a' : '#64748b' }}>
                          Due: {fmtDate(tx.dueDate)}
                        </p>
                        {over && (
                          <p style={{ fontSize:'0.72rem', color:'#fde68a', marginTop:'0.2rem' }}>
                            {days}d · ₹{days * 5} fine
                          </p>
                        )}
                        {!over && (
                          <span className="badge-available" style={{ marginTop:'0.2rem' }}>On time</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Borrow history */}
          {history.length > 0 && (
            <div className="card" style={{ padding:'1.5rem' }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', color:'#f1f5f9', marginBottom:'1rem' }}>
                Reading History
              </h2>
              <table className="data-table">
                <thead><tr><th>Book</th><th>Returned</th><th>Fine</th></tr></thead>
                <tbody>
                  {history.map(tx => {
                    const book = getBookById(tx.bookId);
                    return (
                      <tr key={tx.id}>
                        <td style={{ fontSize:'0.82rem' }}>{book?.title}</td>
                        <td style={{ fontSize:'0.82rem', color:'#64748b' }}>{fmtDate(tx.returnDate)}</td>
                        <td style={{ fontSize:'0.82rem', color: tx.fine > 0 ? '#f9a8d4' : '#86efac' }}>
                          {tx.fine > 0 ? `₹${tx.fine}` : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Recommendations + chatbot */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div className="card" style={{ padding:'1.25rem' }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', color:'#f1f5f9', marginBottom:'0.9rem' }}>
              ✨ Recommended for You
            </h2>
            {recs.map(b => (
              <div key={b.id} style={{
                paddingBottom:'0.7rem', marginBottom:'0.7rem',
                borderBottom:'1px solid rgba(196,181,253,.09)',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.2rem' }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', background:b.accentColor }}/>
                  <p style={{ fontSize:'0.85rem', fontWeight:600, color:'#e2e8f0',
                              overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                    {b.title}
                  </p>
                </div>
                <p style={{ fontSize:'0.75rem', color:'#64748b', paddingLeft:'0.9rem' }}>
                  {b.author} · {b.shelf}
                </p>
              </div>
            ))}
          </div>

          <div className="card" style={{
            padding:'1.25rem',
            background:'linear-gradient(135deg,rgba(192,132,252,.12),rgba(129,140,248,.08))',
            border:'1px solid rgba(192,132,252,.25)',
          }}>
            <MessageSquare size={22} color="#c084fc" style={{ marginBottom:'0.7rem' }}/>
            <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1rem', color:'#f1f5f9', marginBottom:'0.4rem' }}>
              Ask the AI Assistant
            </h3>
            <p style={{ fontSize:'0.82rem', color:'#64748b', marginBottom:'1rem', lineHeight:1.5 }}>
              Check book availability, get recommendations, or ask about fines.
            </p>
            <Link to="/student/chatbot">
              <button className="btn-primary" style={{ width:'100%', justifyContent:'center' }}>
                Open Chatbot <ArrowRight size={14}/>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}