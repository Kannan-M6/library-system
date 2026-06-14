import React, { useState, useMemo } from 'react';
import { MOCK_BOOKS, MOCK_STUDENTS } from '../data/mockData';
import toast from 'react-hot-toast';
import {
  Search, ClipboardEdit, CheckCircle, User,
  BookOpen, Calendar, FileText, Printer, X,
  WifiOff, AlertTriangle,
} from 'lucide-react';

const REASONS = [
  'Scanner barcode torn / damaged',
  'Scanner device offline / power failure',
  'New book — no barcode printed yet',
  'Emergency lending after hours',
  'QR reader error / camera malfunction',
  'Batch entry from paper register',
  'Other',
];

function today() { return new Date().toISOString().split('T')[0]; }
function addDays(d, n) {
  const dt = new Date(d); dt.setDate(dt.getDate() + n);
  return dt.toISOString().split('T')[0];
}
function fmtDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

const S = {
  card: {
    background:'rgba(15,23,42,0.60)', backdropFilter:'blur(14px)',
    border:'1px solid rgba(196,181,253,0.18)', borderRadius:16, padding:'1.5rem',
  },
  label: {
    display:'block', fontSize:'0.72rem', fontWeight:700,
    textTransform:'uppercase', letterSpacing:'0.07em',
    color:'#64748b', marginBottom:'0.4rem',
  },
  input: {
    width:'100%', background:'rgba(15,23,42,0.65)',
    border:'1px solid rgba(196,181,253,0.22)', color:'#f1f5f9',
    borderRadius:10, padding:'0.65rem 1rem',
    fontFamily:"'Poppins',sans-serif", fontSize:'0.875rem',
    outline:'none',
  },
  row: { marginBottom:'1rem' },
};

export default function ManualBorrowModule({ onSuccess }) {
  /* ── form state ── */
  const [step, setStep]           = useState(1);   // 1-3
  const [reason, setReason]       = useState('');
  const [bookQuery, setBookQuery]  = useState('');
  const [selectedBook, setSelBook] = useState(null);
  const [stuQuery, setStuQuery]    = useState('');
  const [selectedStu, setSelStu]   = useState(null);
  const [borrowDate, setBorDate]   = useState(today());
  const [dueDate, setDueDate]      = useState(addDays(today(), 14));
  const [notes, setNotes]          = useState('');
  const [receipt, setReceipt]      = useState(null);
  const [submitting, setSubmitting]= useState(false);

  /* ── live search results ── */
  const bookResults = useMemo(() => {
    const q = bookQuery.toLowerCase().trim();
    if (!q) return MOCK_BOOKS.slice(0, 6);
    return MOCK_BOOKS.filter(b =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.isbn.includes(q) ||
      b.shelf.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [bookQuery]);

  const stuResults = useMemo(() => {
    const q = stuQuery.toLowerCase().trim();
    if (!q) return MOCK_STUDENTS.slice(0, 6);
    return MOCK_STUDENTS.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.rollNo.toLowerCase().includes(q) ||
      s.department.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [stuQuery]);

  /* ── submit ── */
  const handleSubmit = () => {
    if (!reason || !selectedBook || !selectedStu) {
      toast.error('Please complete all required fields.');
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const entry = {
        id: Date.now(),
        reason, notes,
        book: selectedBook,
        student: selectedStu,
        borrowDate, dueDate,
        method: 'manual',
        createdAt: new Date().toISOString(),
      };
      // persist to localStorage
      const prev = JSON.parse(localStorage.getItem('libriq_manual_entries') || '[]');
      localStorage.setItem('libriq_manual_entries', JSON.stringify([entry, ...prev]));
      setReceipt(entry);
      if (onSuccess) onSuccess(entry);
      toast.success('Manual entry recorded successfully!');
      setSubmitting(false);
    }, 700);
  };

  const reset = () => {
    setStep(1); setReason(''); setBookQuery(''); setSelBook(null);
    setStuQuery(''); setSelStu(null);
    setBorDate(today()); setDueDate(addDays(today(), 14));
    setNotes(''); setReceipt(null);
  };

  /* ── Receipt view ── */
  if (receipt) {
    return (
      <div className="fade-in" style={{ maxWidth:600, margin:'0 auto' }}>
        <div style={{ ...S.card, border:'1px solid rgba(134,239,172,0.35)', textAlign:'center', padding:'2.5rem' }}>
          <div style={{
            width:56, height:56, borderRadius:'50%', margin:'0 auto 1.25rem',
            background:'rgba(134,239,172,0.15)', border:'1px solid rgba(134,239,172,0.40)',
            display:'flex', alignItems:'center', justifyContent:'center',
          }}>
            <CheckCircle size={28} color="#86efac"/>
          </div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", color:'#86efac', marginBottom:'0.4rem' }}>
            Entry Recorded
          </h2>
          <p style={{ color:'#64748b', fontSize:'0.85rem', marginBottom:'2rem' }}>
            Receipt No: <span style={{ fontFamily:'monospace', color:'#7dd3fc' }}>MAN-{receipt.id}</span>
          </p>

          <div style={{
            background:'rgba(15,23,42,0.80)', borderRadius:12,
            padding:'1.25rem', textAlign:'left', marginBottom:'1.5rem',
            border:'1px solid rgba(196,181,253,0.12)',
          }}>
            {[
              ['Book',        receipt.book?.title],
              ['Author',      receipt.book?.author],
              ['Shelf',       receipt.book?.shelf],
              ['Borrower',    receipt.student?.name],
              ['Roll No',     receipt.student?.rollNo],
              ['Borrow Date', fmtDate(receipt.borrowDate)],
              ['Due Date',    fmtDate(receipt.dueDate)],
              ['Reason',      receipt.reason],
              ...(receipt.notes ? [['Notes', receipt.notes]] : []),
            ].map(([k, v]) => (
              <div key={k} style={{ display:'flex', gap:'1rem', padding:'0.4rem 0',
                borderBottom:'1px solid rgba(196,181,253,0.07)' }}>
                <span style={{ fontSize:'0.75rem', color:'#475569', width:100, flexShrink:0 }}>{k}</span>
                <span style={{ fontSize:'0.82rem', color:'#e2e8f0' }}>{v}</span>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap' }}>
            <button className="btn-success" onClick={() => window.print()}>
              <Printer size={14}/> Print Receipt
            </button>
            <button className="btn-primary" onClick={reset}>
              <ClipboardEdit size={14}/> New Entry
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Step indicator ── */
  const STEPS = ['Reason', 'Book', 'Student & Dates'];

  return (
    <div className="fade-in">
      {/* Scanner offline banner */}
      <div style={{
        display:'flex', alignItems:'center', gap:'0.75rem',
        padding:'0.85rem 1.25rem', borderRadius:12, marginBottom:'1.75rem',
        background:'rgba(253,230,138,0.07)', border:'1px solid rgba(253,230,138,0.25)',
        color:'#fde68a', fontSize:'0.85rem',
      }}>
        <WifiOff size={16}/>
        <span>
          <strong>Scanner Offline — Manual Mode Active.</strong>&nbsp;
          Fill the 3-step form below to record a borrow transaction.
        </span>
      </div>

      {/* Step progress */}
      <div style={{ display:'flex', alignItems:'center', gap:0, marginBottom:'2rem' }}>
        {STEPS.map((s, i) => {
          const num = i + 1;
          const done = step > num;
          const active = step === num;
          return (
            <React.Fragment key={s}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <div style={{
                  width:30, height:30, borderRadius:'50%',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'0.8rem', fontWeight:700, flexShrink:0,
                  background: done ? '#86efac' : active
                    ? 'linear-gradient(135deg,#c084fc,#818cf8)' : 'rgba(15,23,42,0.7)',
                  color: done ? '#042f2e' : '#fff',
                  border: done ? 'none' : active
                    ? 'none' : '1px solid rgba(196,181,253,0.25)',
                }}>
                  {done ? <CheckCircle size={14}/> : num}
                </div>
                <span style={{
                  fontSize:'0.8rem', fontWeight: active ? 700 : 400,
                  color: active ? '#c4b5fd' : done ? '#86efac' : '#475569',
                }}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div style={{
                  flex:1, height:2, margin:'0 0.75rem',
                  background: done ? '#86efac' : 'rgba(196,181,253,0.12)',
                  borderRadius:2,
                }}/>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── STEP 1: Reason ── */}
      {step === 1 && (
        <div style={{ ...S.card, maxWidth:600 }} className="fade-in">
          <h3 style={{ fontFamily:"'Playfair Display',serif", color:'#f1f5f9', marginBottom:'0.25rem' }}>
            Why is manual entry needed?
          </h3>
          <p style={{ color:'#64748b', fontSize:'0.82rem', marginBottom:'1.5rem' }}>
            Select the reason — this is logged for audit purposes.
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
            {REASONS.map(r => (
              <button key={r} onClick={() => setReason(r)}
                style={{
                  padding:'0.75rem 1rem', borderRadius:10, textAlign:'left',
                  cursor:'pointer', fontSize:'0.875rem', fontWeight: reason===r ? 700 : 400,
                  background: reason===r ? 'rgba(192,132,252,0.15)' : 'rgba(15,23,42,0.5)',
                  border: reason===r ? '1px solid rgba(192,132,252,0.45)' : '1px solid rgba(196,181,253,0.12)',
                  color: reason===r ? '#c4b5fd' : '#94a3b8',
                  transition:'all .15s',
                  display:'flex', alignItems:'center', gap:'0.5rem',
                }}>
                {reason===r && <CheckCircle size={14} color="#c084fc"/>}
                {r}
              </button>
            ))}
          </div>
          {reason && (
            <button className="btn-primary" style={{ marginTop:'1.5rem' }}
              onClick={() => setStep(2)}>
              Next: Select Book →
            </button>
          )}
        </div>
      )}

      {/* ── STEP 2: Book ── */}
      {step === 2 && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }} className="fade-in">
          {/* Search */}
          <div style={S.card}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", color:'#f1f5f9', marginBottom:'1rem' }}>
              Find Book
            </h3>
            <div style={{ position:'relative', marginBottom:'1rem' }}>
              <Search size={14} style={{ position:'absolute', left:'0.9rem', top:'50%', transform:'translateY(-50%)', color:'#475569', pointerEvents:'none' }}/>
              <input
                style={{ ...S.input, paddingLeft:'2.4rem' }}
                placeholder="Title, author, ISBN, shelf…"
                value={bookQuery}
                onChange={e => setBookQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', maxHeight:320, overflowY:'auto' }}>
              {bookResults.map(b => (
                <button key={b.id} onClick={() => setSelBook(b)}
                  style={{
                    padding:'0.7rem 0.9rem', borderRadius:10, textAlign:'left',
                    cursor:'pointer',
                    background: selectedBook?.id===b.id ? 'rgba(192,132,252,0.15)' : 'rgba(15,23,42,0.5)',
                    border: selectedBook?.id===b.id ? '1px solid rgba(192,132,252,0.40)' : '1px solid rgba(196,181,253,0.10)',
                    transition:'all .15s',
                  }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.2rem' }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:b.accentColor, flexShrink:0 }}/>
                    <span style={{ fontSize:'0.82rem', fontWeight:600, color:'#e2e8f0' }}>{b.title}</span>
                  </div>
                  <div style={{ paddingLeft:'1rem', display:'flex', gap:'1rem' }}>
                    <span style={{ fontSize:'0.72rem', color:'#64748b' }}>{b.author}</span>
                    <span style={{ fontSize:'0.72rem', color:'#64748b' }}>Shelf: {b.shelf}</span>
                    <span style={{
                      fontSize:'0.68rem', fontWeight:700,
                      color: b.availableCopies > 0 ? '#86efac' : '#fca5a5',
                    }}>
                      {b.availableCopies > 0 ? `✓ ${b.availableCopies} avail.` : '✗ Out'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected preview */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {selectedBook ? (
              <div style={{ ...S.card, border:`1px solid ${selectedBook.accentColor}44` }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
                  <div style={{
                    width:44, height:44, borderRadius:12,
                    background:`${selectedBook.accentColor}1a`, border:`1px solid ${selectedBook.accentColor}33`,
                    display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
                  }}>
                    <BookOpen size={20} color={selectedBook.accentColor}/>
                  </div>
                  <div>
                    <p style={{ fontSize:'0.9rem', fontWeight:700, color:'#f1f5f9' }}>{selectedBook.title}</p>
                    <p style={{ fontSize:'0.75rem', color:'#64748b' }}>{selectedBook.author}</p>
                  </div>
                </div>
                {[
                  ['ISBN',      selectedBook.isbn],
                  ['Category',  selectedBook.category],
                  ['Shelf',     selectedBook.shelf],
                  ['Available', `${selectedBook.availableCopies} / ${selectedBook.totalCopies}`],
                ].map(([k,v]) => (
                  <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'0.3rem 0',
                    borderBottom:'1px solid rgba(196,181,253,0.07)' }}>
                    <span style={{ fontSize:'0.73rem', color:'#475569' }}>{k}</span>
                    <span style={{ fontSize:'0.78rem', color:'#e2e8f0' }}>{v}</span>
                  </div>
                ))}
                {selectedBook.availableCopies === 0 && (
                  <div style={{ marginTop:'0.75rem', display:'flex', alignItems:'center', gap:'0.5rem',
                    padding:'0.5rem 0.75rem', borderRadius:8,
                    background:'rgba(253,230,138,0.08)', border:'1px solid rgba(253,230,138,0.25)',
                    color:'#fde68a', fontSize:'0.75rem' }}>
                    <AlertTriangle size={12}/>
                    No copies available — manual override allowed.
                  </div>
                )}
              </div>
            ) : (
              <div style={{ ...S.card, textAlign:'center', color:'#475569', padding:'3rem 1rem' }}>
                <BookOpen size={36} style={{ opacity:0.3, marginBottom:'0.75rem' }}/>
                <p style={{ fontSize:'0.85rem' }}>Select a book from the list</p>
              </div>
            )}

            <div style={{ display:'flex', gap:'0.75rem' }}>
              <button className="btn-secondary" onClick={() => setStep(1)}>← Back</button>
              {selectedBook && (
                <button className="btn-primary" onClick={() => setStep(3)}>
                  Next: Student & Dates →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: Student + Dates ── */}
      {step === 3 && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }} className="fade-in">
          {/* Student search */}
          <div style={S.card}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", color:'#f1f5f9', marginBottom:'1rem' }}>
              Find Borrower
            </h3>
            <div style={{ position:'relative', marginBottom:'1rem' }}>
              <Search size={14} style={{ position:'absolute', left:'0.9rem', top:'50%', transform:'translateY(-50%)', color:'#475569', pointerEvents:'none' }}/>
              <input
                style={{ ...S.input, paddingLeft:'2.4rem' }}
                placeholder="Name, roll no, department…"
                value={stuQuery}
                onChange={e => setStuQuery(e.target.value)}
                autoFocus
              />
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem', maxHeight:260, overflowY:'auto', marginBottom:'1.25rem' }}>
              {stuResults.map(s => (
                <button key={s.id} onClick={() => setSelStu(s)}
                  style={{
                    padding:'0.65rem 0.9rem', borderRadius:10, textAlign:'left', cursor:'pointer',
                    background: selectedStu?.id===s.id ? 'rgba(134,239,172,0.12)' : 'rgba(15,23,42,0.5)',
                    border: selectedStu?.id===s.id ? '1px solid rgba(134,239,172,0.35)' : '1px solid rgba(196,181,253,0.10)',
                    transition:'all .15s',
                  }}>
                  <p style={{ fontSize:'0.82rem', fontWeight:600, color:'#e2e8f0', marginBottom:2 }}>{s.name}</p>
                  <div style={{ display:'flex', gap:'0.75rem' }}>
                    <span style={{ fontSize:'0.7rem', color:'#64748b', fontFamily:'monospace' }}>{s.rollNo}</span>
                    <span style={{ fontSize:'0.7rem', color:'#64748b' }}>{s.department}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Dates */}
            <div style={S.row}>
              <label style={S.label}><Calendar size={11} style={{display:'inline',marginRight:4}}/>Borrow Date</label>
              <input type="date" style={S.input} value={borrowDate}
                onChange={e => { setBorDate(e.target.value); setDueDate(addDays(e.target.value, 14)); }}/>
            </div>
            <div style={S.row}>
              <label style={S.label}><Calendar size={11} style={{display:'inline',marginRight:4}}/>Due Date (14-day default)</label>
              <input type="date" style={S.input} value={dueDate}
                onChange={e => setDueDate(e.target.value)}/>
            </div>
            <div style={S.row}>
              <label style={S.label}><FileText size={11} style={{display:'inline',marginRight:4}}/>Additional Notes (optional)</label>
              <textarea
                style={{ ...S.input, height:72, resize:'vertical' }}
                placeholder="E.g. counter register page #12, approved by HoD…"
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>
          </div>

          {/* Summary + submit */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div style={{ ...S.card, border:'1px solid rgba(196,181,253,0.25)' }}>
              <h3 style={{ fontFamily:"'Playfair Display',serif", color:'#f1f5f9', marginBottom:'1rem', fontSize:'1rem' }}>
                Summary
              </h3>
              {[
                ['Reason',      reason],
                ['Book',        selectedBook?.title || '—'],
                ['Shelf',       selectedBook?.shelf || '—'],
                ['Borrower',    selectedStu?.name || '—'],
                ['Roll No',     selectedStu?.rollNo || '—'],
                ['Department',  selectedStu?.department || '—'],
                ['Borrow Date', fmtDate(borrowDate)],
                ['Due Date',    fmtDate(dueDate)],
              ].map(([k,v]) => (
                <div key={k} style={{ display:'flex', gap:'1rem', padding:'0.4rem 0',
                  borderBottom:'1px solid rgba(196,181,253,0.07)' }}>
                  <span style={{ fontSize:'0.72rem', color:'#475569', width:90, flexShrink:0 }}>{k}</span>
                  <span style={{ fontSize:'0.8rem', color:'#e2e8f0' }}>{v}</span>
                </div>
              ))}
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'0.65rem' }}>
              <div style={{ display:'flex', gap:'0.75rem' }}>
                <button className="btn-secondary" onClick={() => setStep(2)}>← Back</button>
              </div>
              <button
                className="btn-primary"
                style={{ justifyContent:'center', opacity: (!selectedStu||submitting) ? 0.5 : 1 }}
                disabled={!selectedStu || submitting}
                onClick={handleSubmit}
              >
                <ClipboardEdit size={15}/>
                {submitting ? 'Recording…' : 'Record & Generate Receipt'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
