import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import EBookViewer from '../components/EBookViewer';
import { MOCK_BOOKS, BOOK_CATEGORIES } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { Search, BookOpen, X, BookText, ArrowDownCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}
function addDays(n) {
  const d = new Date(); d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

export default function TeacherBooksPage() {
  const { user }                    = useAuth();
  const [query,    setQuery]        = useState('');
  const [category, setCategory]     = useState('All');
  const [ebookBook, setEbookBook]   = useState(null);
  const [borrowed, setBorrowed]     = useState([]); // track session borrows

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return MOCK_BOOKS.filter(b => {
      const matchCat = category === 'All' || b.category === category;
      const matchQ   = !q || b.title.toLowerCase().includes(q)
                         || b.author.toLowerCase().includes(q)
                         || b.isbn.includes(q);
      return matchCat && matchQ;
    });
  }, [query, category]);

  const handleBorrow = (book) => {
    if (borrowed.includes(book.id)) {
      toast.error('Already borrowed this session.');
      return;
    }
    setBorrowed(p => [...p, book.id]);
    toast.success(
      `"${book.title}" borrowed — due ${fmtDate(addDays(30))} (30-day staff loan)`,
      { duration: 4000, icon: '📚' }
    );
  };

  return (
    <Layout>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p className="section-eyebrow">Staff Portal</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', color:'#f1f5f9' }}>
          Browse Books
        </h1>
        <div style={{
          display:'inline-flex', alignItems:'center', gap:'0.5rem', marginTop:'0.5rem',
          padding:'0.4rem 0.9rem', borderRadius:10,
          background:'rgba(192,132,252,0.10)', border:'1px solid rgba(192,132,252,0.25)',
        }}>
          <BookOpen size={13} color="#c084fc"/>
          <p style={{ fontSize:'0.78rem', color:'#c084fc', fontWeight:600 }}>
            Staff Privilege: 30-day loan period
          </p>
        </div>
      </div>

      {/* Search */}
      <div style={{ position:'relative', maxWidth:420, marginBottom:'1.25rem' }}>
        <Search size={15} style={{ position:'absolute', left:'0.9rem', top:'50%',
          transform:'translateY(-50%)', color:'#475569', pointerEvents:'none' }}/>
        <input className="input-field" style={{ paddingLeft:'2.4rem' }}
          placeholder="Search title, author, ISBN…"
          value={query} onChange={e => setQuery(e.target.value)}/>
        {query && (
          <button onClick={() => setQuery('')} style={{
            position:'absolute', right:'0.75rem', top:'50%', transform:'translateY(-50%)',
            background:'none', border:'none', cursor:'pointer', color:'#475569',
            display:'flex', alignItems:'center',
          }}><X size={14}/></button>
        )}
      </div>

      {/* Category filter */}
      <div style={{ display:'flex', gap:'0.45rem', marginBottom:'1.75rem', flexWrap:'wrap' }}>
        {BOOK_CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{
            padding:'0.3rem 0.75rem', borderRadius:20, cursor:'pointer', whiteSpace:'nowrap',
            border: category===c ? 'none' : '1px solid rgba(196,181,253,0.18)',
            background: category===c ? 'linear-gradient(135deg,#c084fc,#818cf8)' : 'rgba(15,23,42,.5)',
            color: category===c ? '#fff' : '#64748b',
            fontSize:'0.75rem', fontWeight: category===c ? 700 : 400,
            transition:'all .15s',
          }}>{c}</button>
        ))}
      </div>

      {/* Results count */}
      <p style={{ fontSize:'0.78rem', color:'#475569', marginBottom:'1rem' }}>
        {filtered.length} books found
        {borrowed.length > 0 && (
          <span style={{ marginLeft:'0.75rem', color:'#86efac', fontWeight:600 }}>
            · {borrowed.length} borrowed this session
          </span>
        )}
      </p>

      {/* Book grid */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1rem' }}>
        {filtered.map(book => {
          const avail   = book.availableCopies ?? 0;
          const hasBorrowed = borrowed.includes(book.id);
          const accent  = book.accentColor || '#c084fc';

          return (
            <div key={book.id} style={{
              background:'rgba(15,23,42,0.58)', backdropFilter:'blur(12px)',
              border:`1px solid ${accent}20`, borderRadius:14, padding:'1.25rem',
              display:'flex', flexDirection:'column', gap:'0.85rem',
              transition:'all 0.25s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor=`${accent}50`;
              e.currentTarget.style.transform='translateY(-3px)';
              e.currentTarget.style.boxShadow=`0 8px 28px ${accent}15`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor=`${accent}20`;
              e.currentTarget.style.transform='none';
              e.currentTarget.style.boxShadow='none';
            }}>
              {/* Book info */}
              <div style={{ display:'flex', gap:'0.75rem' }}>
                <div style={{
                  width:44, height:58, borderRadius:8, flexShrink:0,
                  background:`${accent}18`, border:`1px solid ${accent}30`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <BookOpen size={18} color={accent} style={{ opacity:0.85 }}/>
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontFamily:"'Playfair Display',serif", fontSize:'0.88rem',
                    fontWeight:700, color:'#f1f5f9', lineHeight:1.3, marginBottom:'0.2rem',
                    overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box',
                    WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                    {book.title}
                  </p>
                  <p style={{ fontSize:'0.72rem', color:'#64748b' }}>{book.author}</p>
                  <p style={{ fontSize:'0.68rem', color:'#334155', fontFamily:'monospace' }}>{book.isbn}</p>
                </div>
              </div>

              {/* Badges */}
              <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
                <span style={{
                  fontSize:'0.65rem', fontWeight:700, padding:'2px 8px', borderRadius:10,
                  background: avail>0 ? 'rgba(134,239,172,0.12)' : 'rgba(253,230,138,0.10)',
                  color: avail>0 ? '#86efac' : '#fde68a',
                  border: `1px solid ${avail>0 ? 'rgba(134,239,172,0.30)' : 'rgba(253,230,138,0.28)'}`,
                }}>
                  {avail>0 ? `✓ ${avail} available` : '✗ Unavailable'}
                </span>
                <span style={{ fontSize:'0.65rem', padding:'2px 7px', borderRadius:10,
                  background:`${accent}12`, color:accent, border:`1px solid ${accent}25` }}>
                  {book.category}
                </span>
                {hasBorrowed && (
                  <span style={{ fontSize:'0.65rem', fontWeight:700, padding:'2px 8px', borderRadius:10,
                    background:'rgba(192,132,252,0.15)', color:'#c4b5fd', border:'1px solid rgba(192,132,252,0.30)' }}>
                    ✓ Borrowed
                  </span>
                )}
              </div>

              {/* Action buttons */}
              <div style={{ display:'flex', gap:'0.5rem' }}>
                {avail > 0 ? (
                  <button onClick={() => handleBorrow(book)}
                    disabled={hasBorrowed}
                    className="btn-primary"
                    style={{
                      flex:1, justifyContent:'center', fontSize:'0.78rem', padding:'0.45rem 0.6rem',
                      opacity: hasBorrowed ? 0.5 : 1, cursor: hasBorrowed ? 'not-allowed' : 'pointer',
                    }}>
                    <ArrowDownCircle size={13}/>
                    {hasBorrowed ? 'Borrowed (30 days)' : 'Borrow (30 days)'}
                  </button>
                ) : book.ebookUrl ? (
                  <button onClick={() => setEbookBook(book)}
                    style={{
                      flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.3rem',
                      padding:'0.45rem 0.6rem', fontSize:'0.78rem', fontWeight:700, borderRadius:10,
                      background:'rgba(253,230,138,0.14)', border:'1px solid rgba(253,230,138,0.40)',
                      color:'#fde68a', cursor:'pointer',
                    }}>
                    <BookText size={13}/> Read E-Book
                  </button>
                ) : (
                  <div style={{ flex:1, textAlign:'center', fontSize:'0.75rem', color:'#475569', padding:'0.45rem' }}>
                    Out of stock
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* E-Book viewer */}
      {ebookBook && <EBookViewer book={ebookBook} onClose={() => setEbookBook(null)}/>}
    </Layout>
  );
}
