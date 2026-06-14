import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import BookCard from '../components/BookCard';
import BookModal from '../components/BookModal';
import EBookViewer from '../components/EBookViewer';
import { useAuth } from '../context/AuthContext';
import { Search, BookOpen, Plus, X } from 'lucide-react';
import { MOCK_BOOKS, BOOK_CATEGORIES } from '../data/mockData';
import toast from 'react-hot-toast';

export default function BooksPage() {
  const { isLibrarian } = useAuth();
  const [query,    setQuery]    = useState('');
  const [category, setCategory] = useState('All');
  const [viewBook, setViewBook] = useState(null);
  const [showAdd,  setShowAdd]  = useState(false);
  const [ebookBook, setEbookBook] = useState(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return MOCK_BOOKS.filter(b => {
      const matchCat = category === 'All' || b.category === category;
      const matchQ   = !q ||
        b.title.toLowerCase().includes(q)  ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.includes(q) ||
        b.category.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [query, category]);

  const handleBorrow = book => {
    if (book.availableCopies === 0) {
      toast.error('No copies available right now.');
      return;
    }
    toast.success(`"${book.title}" — borrow request sent!`);
  };

  return (
    <Layout>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1.75rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <p className="section-eyebrow">Catalog</p>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', color:'#f1f5f9' }}>Books Library</h1>
          <p style={{ color:'#64748b', fontSize:'0.875rem', marginTop:'0.25rem' }}>
            {MOCK_BOOKS.length} titles across {BOOK_CATEGORIES.length - 1} categories
          </p>
        </div>
        {isLibrarian && (
          <button className="btn-primary" onClick={() => setShowAdd(true)}>
            <Plus size={16}/> Add Book
          </button>
        )}
      </div>

      {/* Search + Filter */}
      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:1, minWidth:220 }}>
          <Search size={15} style={{ position:'absolute', left:'0.9rem', top:'50%', transform:'translateY(-50%)', color:'#475569' }}/>
          <input
            className="input-field"
            style={{ paddingLeft:'2.4rem' }}
            placeholder="Search by title, author, ISBN…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        {query && (
          <button className="btn-secondary" onClick={() => setQuery('')} style={{ padding:'0.6rem' }}>
            <X size={15}/>
          </button>
        )}
      </div>

      {/* Category pills */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.75rem', flexWrap:'wrap' }}>
        {BOOK_CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            style={{
              padding:'0.35rem 0.85rem', borderRadius:20,
              border: category === c ? 'none' : '1px solid rgba(196,181,253,.22)',
              background: category === c
                ? 'linear-gradient(135deg,#c084fc,#818cf8)'
                : 'rgba(15,23,42,.4)',
              color: category === c ? '#fff' : '#64748b',
              fontSize:'0.8rem', fontWeight: category === c ? 700 : 500,
              cursor:'pointer', transition:'all .2s', whiteSpace:'nowrap',
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Results count */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.25rem' }}>
        <BookOpen size={14} color="#c084fc"/>
        <span style={{ fontSize:'0.82rem', color:'#64748b' }}>
          {filtered.length} book{filtered.length !== 1 ? 's' : ''} found
          {(query || category !== 'All') && (
            <button
              onClick={() => { setQuery(''); setCategory('All'); }}
              style={{ marginLeft:'0.5rem', color:'#c084fc', background:'none', border:'none', cursor:'pointer', fontSize:'0.82rem' }}
            >
              Clear filters
            </button>
          )}
        </span>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'4rem 2rem', color:'#475569' }}>
          <BookOpen size={48} style={{ marginBottom:'1rem', opacity:0.3 }}/>
          <p>No books match your search.</p>
        </div>
      ) : (
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',
          gap:'1rem',
        }}>
          {filtered.map(b => (
            <BookCard
              key={b.id} book={b}
              isStudent={!isLibrarian}
              onView={setViewBook}
              onBorrow={handleBorrow}
              onReadEbook={setEbookBook}
            />
          ))}
        </div>
      )}

      {/* Detail modal */}
      <BookModal book={viewBook} onClose={() => setViewBook(null)}/>

      {/* E-Book viewer */}
      {ebookBook && <EBookViewer book={ebookBook} onClose={() => setEbookBook(null)}/>}

      {/* Add book placeholder */}
      {showAdd && (
        <div style={{
          position:'fixed', inset:0, zIndex:100,
          background:'rgba(6,11,24,.80)', backdropFilter:'blur(8px)',
          display:'flex', alignItems:'center', justifyContent:'center',
        }}>
          <div className="card" style={{ width:'100%', maxWidth:440, padding:'2rem', margin:'1rem' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <h2 style={{ fontFamily:"'Playfair Display',serif", color:'#f1f5f9' }}>Add New Book</h2>
              <button onClick={() => setShowAdd(false)} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748b' }}>
                <X size={18}/>
              </button>
            </div>
            {['ISBN','Title','Author','Category','Total Copies','Shelf Location'].map(f => (
              <div key={f} style={{ marginBottom:'0.9rem' }}>
                <label className="input-label">{f}</label>
                <input className="input-field" placeholder={`Enter ${f.toLowerCase()}`}/>
              </div>
            ))}
            <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'1rem' }}>
              <button className="btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn-primary" onClick={() => {
                toast.success('Book added to catalog!');
                setShowAdd(false);
              }}>
                <Plus size={15}/> Add Book
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}