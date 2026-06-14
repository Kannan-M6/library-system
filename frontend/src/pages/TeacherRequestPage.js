import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { MOCK_BOOK_REQUESTS } from '../data/mockData';
import { PlusSquare, Send, CheckCircle, Clock, X, AlertTriangle, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

const URGENCY_OPTS = ['Low', 'Medium', 'High'];
const DEPARTMENTS  = [
  'AI & Data Science', 'Computer Science', 'Electronics',
  'Mechanical', 'Civil', 'Electrical', 'Information Technology',
];

const STATUS_STYLE = {
  approved: { bg:'rgba(134,239,172,0.12)', color:'#86efac', border:'rgba(134,239,172,0.30)', icon:<CheckCircle size={12}/> },
  pending:  { bg:'rgba(253,230,138,0.10)', color:'#fde68a', border:'rgba(253,230,138,0.28)', icon:<Clock size={12}/> },
  rejected: { bg:'rgba(239,68,68,0.10)',   color:'#fca5a5', border:'rgba(239,68,68,0.25)',   icon:<X size={12}/> },
};
const URGENCY_COLORS = { Low:'#86efac', Medium:'#fde68a', High:'#fca5a5' };

const inputStyle = {
  width:'100%', background:'rgba(15,23,42,0.65)',
  border:'1px solid rgba(196,181,253,0.22)', color:'#f1f5f9',
  borderRadius:10, padding:'0.65rem 1rem',
  fontFamily:"'Poppins',sans-serif", fontSize:'0.875rem', outline:'none',
};
const labelStyle = {
  display:'block', fontSize:'0.72rem', fontWeight:700,
  textTransform:'uppercase', letterSpacing:'0.07em', color:'#64748b', marginBottom:'0.4rem',
};

export default function TeacherRequestPage() {
  const { user } = useAuth();

  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [requests, setRequests]   = useState(MOCK_BOOK_REQUESTS.filter(r => r.teacherId === user?.id));

  const [form, setForm] = useState({
    title:'', author:'', isbn:'', publisher:'', edition:'',
    reason:'', urgency:'Medium', department: user?.department || '',
    copies: 1, notes:'',
  });
  const set = f => e => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.reason) {
      toast.error('Please fill Title, Author, and Reason fields.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const newReq = {
        id: `REQ${Date.now()}`, teacherId: user?.id,
        title: form.title, author: form.author, isbn: form.isbn,
        reason: form.reason, urgency: form.urgency,
        status: 'pending', requestDate: new Date().toISOString().split('T')[0],
        department: form.department, copies: form.copies, notes: form.notes,
      };
      setRequests(p => [newReq, ...p]);
      setSubmitted(true);
      setSubmitting(false);
      toast.success('Book request submitted to librarian!', { icon:'📚' });
    }, 700);
  };

  const reset = () => {
    setForm({ title:'', author:'', isbn:'', publisher:'', edition:'',
      reason:'', urgency:'Medium', department: user?.department||'', copies:1, notes:'' });
    setShowForm(false);
    setSubmitted(false);
  };

  return (
    <Layout>
      {/* Header */}
      <div style={{ marginBottom:'2rem', display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <p className="section-eyebrow">Staff Portal</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', color:'#f1f5f9' }}>
            Book Procurement Requests
          </h1>
          <p style={{ color:'#64748b', fontSize:'0.875rem', marginTop:'0.25rem' }}>
            Request new books for the library — the librarian will review and approve
          </p>
        </div>
        <button onClick={() => { setShowForm(true); setSubmitted(false); }} className="btn-primary">
          <PlusSquare size={15}/> New Request
        </button>
      </div>

      {/* Request Form Modal */}
      {showForm && (
        <div style={{
          position:'fixed', inset:0, zIndex:100,
          background:'rgba(4,8,20,0.88)', backdropFilter:'blur(12px)',
          display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem',
        }}>
          <div style={{
            width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto',
            background:'rgba(10,16,35,0.98)',
            border:'1px solid rgba(196,181,253,0.20)', borderRadius:18,
          }}>
            {/* Modal header */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
              padding:'1.25rem 1.5rem', borderBottom:'1px solid rgba(196,181,253,0.10)' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.65rem' }}>
                <div style={{ width:36, height:36, borderRadius:10, background:'rgba(192,132,252,0.12)',
                  border:'1px solid rgba(192,132,252,0.25)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <PlusSquare size={17} color="#c084fc"/>
                </div>
                <h2 style={{ fontFamily:"'Playfair Display',serif", color:'#f1f5f9', fontSize:'1.1rem' }}>
                  {submitted ? 'Request Submitted!' : 'Request a Book'}
                </h2>
              </div>
              <button onClick={reset} style={{ background:'none', border:'none', cursor:'pointer',
                color:'#475569', display:'flex', alignItems:'center' }}>
                <X size={18}/>
              </button>
            </div>

            {/* Submitted success view */}
            {submitted ? (
              <div style={{ padding:'2.5rem', textAlign:'center' }}>
                <div style={{
                  width:60, height:60, borderRadius:'50%', margin:'0 auto 1.25rem',
                  background:'rgba(134,239,172,0.12)', border:'1px solid rgba(134,239,172,0.30)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <CheckCircle size={28} color="#86efac"/>
                </div>
                <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', color:'#86efac', marginBottom:'0.5rem' }}>
                  Request Submitted!
                </p>
                <p style={{ color:'#64748b', fontSize:'0.85rem', marginBottom:'1.5rem' }}>
                  <strong style={{ color:'#f1f5f9' }}>{form.title}</strong> has been forwarded to the librarian for approval.
                </p>
                <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center' }}>
                  <button className="btn-primary" onClick={() => { setSubmitted(false); setForm(p=>({...p,title:'',author:'',isbn:'',reason:''})); }}>
                    <PlusSquare size={14}/> Another Request
                  </button>
                  <button className="btn-secondary" onClick={reset}>Close</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
                {/* Title & Author */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                  <div>
                    <label style={labelStyle}>Book Title *</label>
                    <input style={inputStyle} placeholder="Full title" value={form.title} onChange={set('title')} required/>
                  </div>
                  <div>
                    <label style={labelStyle}>Author *</label>
                    <input style={inputStyle} placeholder="Author name" value={form.author} onChange={set('author')} required/>
                  </div>
                </div>

                {/* ISBN & Publisher */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                  <div>
                    <label style={labelStyle}>ISBN (optional)</label>
                    <input style={{ ...inputStyle, fontFamily:'monospace' }} placeholder="978-..." value={form.isbn} onChange={set('isbn')}/>
                  </div>
                  <div>
                    <label style={labelStyle}>Edition / Year</label>
                    <input style={inputStyle} placeholder="e.g. 3rd Ed, 2023" value={form.edition} onChange={set('edition')}/>
                  </div>
                </div>

                {/* Department & Copies */}
                <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'0.75rem' }}>
                  <div>
                    <label style={labelStyle}>Department</label>
                    <select style={inputStyle} value={form.department} onChange={set('department')}>
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Copies Needed</label>
                    <input type="number" min="1" max="20" style={{ ...inputStyle, width:90 }}
                      value={form.copies} onChange={set('copies')}/>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label style={labelStyle}>Reason for Request *</label>
                  <textarea style={{ ...inputStyle, height:80, resize:'vertical' }}
                    placeholder="e.g. Required for syllabus, lab reference, seminar…"
                    value={form.reason} onChange={set('reason')} required/>
                </div>

                {/* Urgency */}
                <div>
                  <label style={labelStyle}>Urgency Level</label>
                  <div style={{ display:'flex', gap:'0.5rem' }}>
                    {URGENCY_OPTS.map(u => {
                      const c = URGENCY_COLORS[u];
                      return (
                        <button key={u} type="button" onClick={() => setForm(p=>({...p,urgency:u}))}
                          style={{
                            flex:1, padding:'0.5rem', borderRadius:9, cursor:'pointer',
                            border: form.urgency===u ? `1px solid ${c}55` : '1px solid rgba(196,181,253,0.12)',
                            background: form.urgency===u ? `${c}15` : 'rgba(15,23,42,0.5)',
                            color: form.urgency===u ? c : '#475569',
                            fontSize:'0.8rem', fontWeight: form.urgency===u ? 700 : 400,
                            transition:'all .15s',
                          }}>
                          {u === 'High' ? '🔴' : u === 'Medium' ? '🟡' : '🟢'} {u}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Additional notes */}
                <div>
                  <label style={labelStyle}>Additional Notes</label>
                  <input style={inputStyle} placeholder="Any extra details for the librarian…"
                    value={form.notes} onChange={set('notes')}/>
                </div>

                <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'0.25rem' }}>
                  <button type="button" className="btn-secondary" onClick={reset}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={submitting}
                    style={{ opacity: submitting ? 0.6 : 1 }}>
                    <Send size={14}/>
                    {submitting ? 'Submitting…' : 'Submit Request'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Existing requests list */}
      <div>
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.25rem' }}>
          <div style={{ width:3, height:18, borderRadius:2, background:'#c084fc' }}/>
          <h2 style={{ fontFamily:"'Playfair Display',serif", color:'#f1f5f9', fontSize:'1.1rem' }}>
            My Requests
          </h2>
          <span style={{ fontSize:'0.68rem', fontWeight:700, padding:'2px 8px', borderRadius:10,
            background:'rgba(192,132,252,0.14)', color:'#c084fc', border:'1px solid rgba(192,132,252,0.25)' }}>
            {requests.length}
          </span>
        </div>

        {requests.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem', color:'#475569' }}>
            <BookOpen size={44} style={{ opacity:0.2, marginBottom:'1rem' }}/>
            <p>No requests yet. Click "New Request" to get started.</p>
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
            {requests.map(r => {
              const s = STATUS_STYLE[r.status];
              const urgColor = URGENCY_COLORS[r.urgency] || '#c084fc';
              return (
                <div key={r.id} style={{
                  background:'rgba(15,23,42,0.58)', backdropFilter:'blur(12px)',
                  border:`1px solid ${r.status==='approved'?'rgba(134,239,172,0.18)':r.status==='rejected'?'rgba(239,68,68,0.18)':'rgba(196,181,253,0.14)'}`,
                  borderRadius:14, padding:'1.1rem 1.25rem',
                  display:'grid', gridTemplateColumns:'1fr auto',
                  alignItems:'center', gap:'1rem',
                }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.3rem' }}>
                      <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'0.92rem',
                        fontWeight:700, color:'#f1f5f9' }}>{r.title}</p>
                      {r.urgency === 'High' && (
                        <AlertTriangle size={13} color="#fca5a5"/>
                      )}
                    </div>
                    <p style={{ fontSize:'0.75rem', color:'#64748b', marginBottom:'0.25rem' }}>
                      {r.author} {r.isbn && `· ISBN: ${r.isbn}`}
                    </p>
                    <p style={{ fontSize:'0.75rem', color:'#94a3b8', lineHeight:1.5 }}>
                      <em>{r.reason}</em>
                    </p>
                    <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.5rem', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'0.65rem', fontWeight:700, padding:'2px 8px', borderRadius:10,
                        background:`${urgColor}12`, color:urgColor, border:`1px solid ${urgColor}28` }}>
                        {r.urgency} Priority
                      </span>
                      <span style={{ fontSize:'0.65rem', color:'#475569', padding:'2px 8px', borderRadius:10,
                        background:'rgba(196,181,253,0.06)', border:'1px solid rgba(196,181,253,0.10)' }}>
                        Requested: {r.requestDate}
                      </span>
                      {r.copies && (
                        <span style={{ fontSize:'0.65rem', color:'#7dd3fc', padding:'2px 8px', borderRadius:10,
                          background:'rgba(125,211,252,0.08)', border:'1px solid rgba(125,211,252,0.18)' }}>
                          {r.copies} {r.copies>1?'copies':'copy'}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <span style={{
                      display:'inline-flex', alignItems:'center', gap:'4px',
                      fontSize:'0.7rem', fontWeight:700, padding:'4px 10px', borderRadius:20,
                      background:s.bg, color:s.color, border:`1px solid ${s.border}`,
                    }}>
                      {s.icon} {r.status.toUpperCase()}
                    </span>
                    <p style={{ fontSize:'0.65rem', color:'#334155', marginTop:'0.4rem' }}>ID: {r.id}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
