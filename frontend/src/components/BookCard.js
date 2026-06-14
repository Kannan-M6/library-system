/**
 * components/BookCard.js
 * Props (from BooksPage): book, isStudent, onView, onBorrow
 * Props (legacy):         book, userRole, onBorrow, onEdit, onDelete
 */
import React from 'react';
import { BookOpen, User, Hash, Eye, ArrowDownCircle } from 'lucide-react';

export default function BookCard({ book, isStudent, onView, onBorrow, onReadEbook, userRole, onEdit, onDelete }) {
  // Normalise field names: mockData uses availableCopies, backend may use available_count
  const availCount = book.availableCopies ?? book.available_count ?? 0;
  const totalCount = book.totalCopies    ?? book.total_count    ?? 0;
  const available  = availCount > 0;
  const accent     = book.accentColor || '#c084fc';

  // Support both prop-naming conventions
  const showLibrarianActions = userRole === 'librarian' || (!isStudent && isStudent !== undefined ? false : false);
  const showStudentBorrow    = isStudent !== undefined ? isStudent : userRole !== 'librarian';

  return (
    <div style={{
      background: 'rgba(15,23,42,0.58)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${accent}20`,
      borderRadius: 14,
      padding: '1.25rem',
      transition: 'all 0.25s ease',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem',
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = `${accent}55`;
      e.currentTarget.style.transform = 'translateY(-3px)';
      e.currentTarget.style.boxShadow = `0 8px 28px ${accent}18`;
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = `${accent}20`;
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = 'none';
    }}
    >
      {/* Cover + info */}
      <div style={{ display:'flex', gap:'0.85rem' }}>
        {/* Book spine */}
        <div style={{
          width: 48, height: 64, borderRadius: 8, flexShrink: 0,
          background: `linear-gradient(160deg, ${accent}22, ${accent}08)`,
          border: `1px solid ${accent}33`,
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <BookOpen size={20} color={accent} style={{ opacity:0.8 }}/>
        </div>

        <div style={{ flex:1, minWidth:0 }}>
          <h3 style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:'0.9rem', fontWeight:700,
            color:'#f1f5f9', lineHeight:1.3,
            overflow:'hidden', textOverflow:'ellipsis',
            display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical',
            marginBottom:'0.3rem',
          }}>
            {book.title}
          </h3>
          <p style={{ fontSize:'0.75rem', color:'#64748b', display:'flex', alignItems:'center', gap:'0.25rem', marginBottom:'0.3rem' }}>
            <User size={11}/> {book.author}
          </p>
          {book.isbn && (
            <p style={{ fontSize:'0.68rem', color:'#334155', fontFamily:'JetBrains Mono,monospace', display:'flex', alignItems:'center', gap:'0.25rem' }}>
              <Hash size={10}/> {book.isbn}
            </p>
          )}
        </div>
      </div>

      {/* Availability + shelf */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.4rem' }}>
        <span style={{
          display:'inline-flex', alignItems:'center', gap:'4px',
          padding:'2px 8px', borderRadius:20, fontSize:'0.68rem', fontWeight:700,
          background: available ? 'rgba(134,239,172,0.14)' : 'rgba(239,68,68,0.14)',
          color: available ? '#86efac' : '#fca5a5',
          border: `1px solid ${available ? 'rgba(134,239,172,0.35)' : 'rgba(239,68,68,0.30)'}`,
        }}>
          {available ? `✓ ${availCount}/${totalCount} avail.` : '✗ Unavailable'}
        </span>
        {book.shelf && (
          <span style={{ fontSize:'0.68rem', color:'#475569', fontFamily:'JetBrains Mono,monospace' }}>
            Shelf {book.shelf}
          </span>
        )}
        {book.category && (
          <span style={{
            fontSize:'0.65rem', padding:'1px 7px', borderRadius:10,
            background:`${accent}12`, color:accent, border:`1px solid ${accent}25`,
          }}>
            {book.category}
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.1rem' }}>
        {onView && (
          <button onClick={() => onView(book)} className="btn-secondary"
            style={{ flex:1, justifyContent:'center', padding:'0.4rem 0.6rem', fontSize:'0.78rem' }}>
            <Eye size={13}/> Details
          </button>
        )}
        {showStudentBorrow && available && onBorrow && (
          <button
            onClick={() => onBorrow(book)}
            className="btn-primary"
            style={{ flex:1, justifyContent:'center', padding:'0.4rem 0.6rem', fontSize:'0.78rem' }}>
            <ArrowDownCircle size={13}/> Borrow
          </button>
        )}
        {showStudentBorrow && !available && book.ebookUrl && (
          <button
            onClick={() => onReadEbook ? onReadEbook(book) : window.open(book.ebookUrl,'_blank')}
            style={{
              flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.3rem',
              padding:'0.4rem 0.6rem', fontSize:'0.78rem', fontWeight:700, borderRadius:10,
              background:'rgba(253,230,138,0.14)', border:'1px solid rgba(253,230,138,0.40)',
              color:'#fde68a', cursor:'pointer', transition:'all .2s',
            }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(253,230,138,0.25)'}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(253,230,138,0.14)'}}>
            📖 Read E-Book
          </button>
        )}
        {onEdit && (
          <button onClick={() => onEdit(book)} className="btn-secondary"
            style={{ flex:1, justifyContent:'center', padding:'0.4rem 0.6rem', fontSize:'0.78rem' }}>
            Edit
          </button>
        )}
        {onDelete && (
          <button onClick={() => onDelete(book)} className="btn-danger"
            style={{ padding:'0.4rem 0.6rem', fontSize:'0.78rem' }}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
