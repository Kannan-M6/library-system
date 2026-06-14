import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import EBookViewer from '../components/EBookViewer';
import { MOCK_BOOKS, BOOK_CATEGORIES } from '../data/mockData';
import { BookOpen, Search, Globe, ExternalLink, X, Wifi } from 'lucide-react';

const EBOOKS = MOCK_BOOKS.filter(b => b.ebookUrl);
const SOURCE_COLORS = {
  'Internet Archive': '#7dd3fc',
  'Open Library':     '#c084fc',
  'deeplearningbook.org': '#818cf8',
  'themlbook.com':    '#a78bfa',
  'wesmckinney.com':  '#38bdf8',
  'db-book.com':      '#fb923c',
};

export default function EBooksPage() {
  const [query,     setQuery]     = useState('');
  const [category,  setCategory]  = useState('All');
  const [viewBook,  setViewBook]  = useState(null);
  const [source,    setSource]    = useState('All');

  const sources = ['All', ...new Set(EBOOKS.map(b => b.ebookSource))];

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return EBOOKS.filter(b => {
      const matchCat = category === 'All' || b.category === category;
      const matchSrc = source   === 'All' || b.ebookSource === source;
      const matchQ   = !q ||
        b.title.toLowerCase().includes(q)  ||
        b.author.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q);
      return matchCat && matchSrc && matchQ;
    });
  }, [query, category, source]);

  const unavailable = filtered.filter(b => b.availableCopies === 0);
  const available   = filtered.filter(b => b.availableCopies >  0);

  return (
    <Layout>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <p className="section-eyebrow">Digital Library</p>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize: '2rem', color: '#f1f5f9' }}>
              E-Books Collection
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
              {EBOOKS.length} e-books available — free access from Open Library, Internet Archive & more
            </p>
          </div>
          {/* Stats pills */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Total E-Books', value: EBOOKS.length, color: '#c084fc' },
              { label: 'Phys. Unavailable', value: EBOOKS.filter(b=>b.availableCopies===0).length, color: '#fde68a' },
              { label: 'Free Access', value: EBOOKS.filter(b=>b.ebookFree).length, color: '#86efac' },
            ].map(s => (
              <div key={s.label} style={{
                padding: '0.45rem 0.9rem', borderRadius: 10,
                background: `${s.color}0f`, border: `1px solid ${s.color}25`,
                textAlign: 'center',
              }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '0.62rem', color: '#475569', marginTop: 2 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unavailable-book banner */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.85rem 1.25rem', borderRadius: 12, marginBottom: '1.75rem',
        background: 'rgba(125,211,252,0.07)', border: '1px solid rgba(125,211,252,0.22)',
      }}>
        <Wifi size={16} color="#7dd3fc"/>
        <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          <strong style={{ color: '#7dd3fc' }}>Can't find a physical copy?</strong>
          {' '}Click <strong style={{ color: '#c084fc' }}>Read E-Book</strong> on any unavailable book to access it instantly — no waiting, no queues.
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 440, marginBottom: '1.25rem' }}>
        <Search size={15} style={{ position:'absolute', left:'0.9rem', top:'50%', transform:'translateY(-50%)', color:'#475569', pointerEvents:'none' }}/>
        <input className="input-field" style={{ paddingLeft: '2.4rem' }}
          placeholder="Search e-books by title, author, category…"
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
      <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        {['All', ...BOOK_CATEGORIES.filter(c => c !== 'All')].map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{
            padding: '0.3rem 0.75rem', borderRadius: 20, cursor: 'pointer',
            border: category === c ? 'none' : '1px solid rgba(196,181,253,0.18)',
            background: category === c ? 'linear-gradient(135deg,#c084fc,#818cf8)' : 'rgba(15,23,42,.5)',
            color: category === c ? '#fff' : '#64748b',
            fontSize: '0.75rem', fontWeight: category === c ? 700 : 400, whiteSpace: 'nowrap',
            transition: 'all .15s',
          }}>{c}</button>
        ))}
      </div>

      {/* Source filter */}
      <div style={{ display: 'flex', gap: '0.45rem', marginBottom: '1.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <Globe size={13} color="#475569"/>
        {sources.map(s => {
          const col = SOURCE_COLORS[s] || '#c084fc';
          return (
            <button key={s} onClick={() => setSource(s)} style={{
              padding: '0.25rem 0.7rem', borderRadius: 20, cursor: 'pointer',
              border: source === s ? `1px solid ${col}60` : '1px solid rgba(196,181,253,0.12)',
              background: source === s ? `${col}18` : 'rgba(15,23,42,.4)',
              color: source === s ? col : '#475569',
              fontSize: '0.72rem', fontWeight: source === s ? 700 : 400, whiteSpace: 'nowrap',
              transition: 'all .15s',
            }}>{s}</button>
          );
        })}
      </div>

      {/* ── Unavailable → E-Book section ── */}
      {unavailable.length > 0 && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ width: 3, height: 18, borderRadius: 2, background: '#fde68a' }}/>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize: '1.1rem', color: '#fde68a' }}>
              Physical Copies Unavailable — Read Online
            </h2>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10,
              background: 'rgba(253,230,138,0.14)', color: '#fde68a', border: '1px solid rgba(253,230,138,0.30)' }}>
              {unavailable.length}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
            {unavailable.map(b => <EBookCard key={b.id} book={b} onRead={() => setViewBook(b)} urgent/>)}
          </div>
        </div>
      )}

      {/* ── All available e-books ── */}
      {available.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <div style={{ width: 3, height: 18, borderRadius: 2, background: '#c084fc' }}/>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize: '1.1rem', color: '#f1f5f9' }}>
              All E-Books
            </h2>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10,
              background: 'rgba(192,132,252,0.14)', color: '#c084fc', border: '1px solid rgba(192,132,252,0.25)' }}>
              {available.length}
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '1rem' }}>
            {available.map(b => <EBookCard key={b.id} book={b} onRead={() => setViewBook(b)}/>)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#475569' }}>
          <BookOpen size={44} style={{ opacity: 0.25, marginBottom: '1rem' }}/>
          <p>No e-books match your search.</p>
        </div>
      )}

      {/* Viewer modal */}
      {viewBook && <EBookViewer book={viewBook} onClose={() => setViewBook(null)}/>}
    </Layout>
  );
}

/* ── E-Book card sub-component ── */
function EBookCard({ book, onRead, urgent }) {
  const accent = book.accentColor || '#c084fc';
  const srcColor = SOURCE_COLORS[book.ebookSource] || '#c084fc';

  return (
    <div style={{
      background: 'rgba(15,23,42,0.58)', backdropFilter: 'blur(12px)',
      border: urgent ? '1px solid rgba(253,230,138,0.25)' : `1px solid ${accent}20`,
      borderRadius: 14, padding: '1.25rem',
      display: 'flex', flexDirection: 'column', gap: '0.85rem',
      transition: 'all 0.25s ease',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = urgent ? 'rgba(253,230,138,0.50)' : `${accent}50`;
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = urgent ? '0 8px 28px rgba(253,230,138,0.10)' : `0 8px 28px ${accent}15`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = urgent ? 'rgba(253,230,138,0.25)' : `${accent}20`;
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = 'none';
    }}>
      {/* Title row */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <div style={{
          width: 44, height: 56, borderRadius: 8, flexShrink: 0,
          background: `linear-gradient(160deg, ${accent}22, ${accent}08)`,
          border: `1px solid ${accent}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <BookOpen size={18} color={accent} style={{ opacity: 0.8 }}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily:"'Playfair Display',serif", fontSize: '0.9rem', fontWeight: 700,
            color: '#f1f5f9', lineHeight: 1.3, marginBottom: '0.2rem',
            overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
            {book.title}
          </p>
          <p style={{ fontSize: '0.72rem', color: '#64748b' }}>{book.author}</p>
        </div>
      </div>

      {/* Badges row */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
        {urgent && (
          <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10,
            background: 'rgba(253,230,138,0.14)', color: '#fde68a', border: '1px solid rgba(253,230,138,0.30)' }}>
            ✗ Phys. Unavailable
          </span>
        )}
        {book.ebookFree && (
          <span style={{ fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 10,
            background: 'rgba(134,239,172,0.12)', color: '#86efac', border: '1px solid rgba(134,239,172,0.25)' }}>
            FREE
          </span>
        )}
        <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 10, fontWeight: 600,
          background: `${srcColor}12`, color: srcColor, border: `1px solid ${srcColor}25` }}>
          {book.ebookSource}
        </span>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button onClick={onRead} className="btn-primary"
          style={{ flex: 1, justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem 0.6rem' }}>
          <BookOpen size={13}/> Read E-Book
        </button>
        <button onClick={() => window.open(book.ebookUrl, '_blank', 'noopener')}
          className="btn-secondary"
          style={{ padding: '0.5rem 0.65rem', fontSize: '0.78rem' }}>
          <ExternalLink size={13}/>
        </button>
      </div>
    </div>
  );
}
