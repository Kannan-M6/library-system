/**
 * components/BookModal.js
 * Two modes:
 *   View mode:  <BookModal book={book} onClose={fn} />         — no onSave
 *   Edit mode:  <BookModal book={book} onSave={fn} onClose={fn}/>
 */
import React, { useState, useEffect } from 'react';
import { X, BookOpen, User, Hash, MapPin, Copy } from 'lucide-react';

export default function BookModal({ book, onSave, onClose }) {
  const [form, setForm]     = useState({ title:'', author:'', isbn:'', category:'', description:'', totalCopies:1, shelf:'' });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  useEffect(() => {
    if (book) setForm({ ...form, ...book });
    // eslint-disable-next-line
  }, [book]);

  if (!book) return null;

  // ── View-only mode ──────────────────────────────────────────────────────
  if (!onSave) {
    const avail = book.availableCopies ?? book.available_count ?? 0;
    const total = book.totalCopies    ?? book.total_count    ?? 0;
    const accent = book.accentColor || '#c084fc';

    return (
      <div style={{
        position:'fixed', inset:0, zIndex:100,
        background:'rgba(6,11,24,0.85)', backdropFilter:'blur(10px)',
        display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem',
      }} onClick={onClose}>
        <div style={{
          background:'rgba(15,23,42,0.97)',
          border:`1px solid ${accent}35`,
          borderRadius:18, width:'100%', maxWidth:480,
          animation:'fadeInUp 0.25s ease-out',
        }} onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div style={{
            display:'flex', alignItems:'center', justifyContent:'space-between',
            padding:'1.25rem 1.5rem', borderBottom:`1px solid rgba(196,181,253,0.10)`,
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
              <div style={{
                width:38, height:38, borderRadius:10,
                background:`${accent}1a`, border:`1px solid ${accent}33`,
                display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              }}>
                <BookOpen size={18} color={accent}/>
              </div>
              <p style={{ fontSize:'0.72rem', fontWeight:700, textTransform:'uppercase',
                letterSpacing:'0.08em', color:accent }}>Book Details</p>
            </div>
            <button onClick={onClose} style={{
              background:'none', border:'none', cursor:'pointer',
              color:'#475569', display:'flex', alignItems:'center',
            }}>
              <X size={18}/>
            </button>
          </div>

          {/* Body */}
          <div style={{ padding:'1.5rem' }}>
            <h2 style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:'1.3rem', color:'#f1f5f9', marginBottom:'0.35rem', lineHeight:1.3,
            }}>{book.title}</h2>
            <p style={{ color:'#64748b', fontSize:'0.875rem', marginBottom:'1.25rem',
              display:'flex', alignItems:'center', gap:'0.35rem' }}>
              <User size={13}/> {book.author}
            </p>

            {book.description && (
              <p style={{ fontSize:'0.85rem', color:'#94a3b8', lineHeight:1.65,
                marginBottom:'1.25rem', padding:'0.75rem', borderRadius:10,
                background:'rgba(196,181,253,0.05)', border:'1px solid rgba(196,181,253,0.08)' }}>
                {book.description}
              </p>
            )}

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
              {[
                { icon: Hash,   label:'ISBN',      value: book.isbn },
                { icon: MapPin, label:'Shelf',     value: book.shelf },
                { icon: Copy,   label:'Available', value: `${avail} / ${total}` },
                { icon: null,   label:'Category',  value: book.category },
              ].filter(r => r.value).map(({ icon: Icon, label, value }) => (
                <div key={label} style={{
                  padding:'0.6rem 0.8rem', borderRadius:10,
                  background:'rgba(15,23,42,0.6)', border:'1px solid rgba(196,181,253,0.08)',
                }}>
                  <p style={{ fontSize:'0.65rem', color:'#475569', fontWeight:700,
                    textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:2 }}>
                    {label}
                  </p>
                  <p style={{ fontSize:'0.82rem', color:'#e2e8f0',
                    fontFamily: label==='ISBN' ? 'JetBrains Mono,monospace' : 'inherit' }}>
                    {value}
                  </p>
                </div>
              ))}
            </div>

            {/* Availability bar */}
            <div style={{ marginTop:'1rem' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem' }}>
                <span style={{ fontSize:'0.72rem', color:'#475569' }}>Availability</span>
                <span style={{ fontSize:'0.72rem', color: avail>0 ? '#86efac' : '#fca5a5', fontWeight:700 }}>
                  {avail}/{total} copies
                </span>
              </div>
              <div style={{ height:5, borderRadius:3, background:'rgba(196,181,253,0.12)', overflow:'hidden' }}>
                <div style={{
                  height:'100%', borderRadius:3, transition:'width 0.4s ease',
                  width:`${total > 0 ? (avail/total)*100 : 0}%`,
                  background: avail>0 ? '#86efac' : '#fca5a5',
                }}/>
              </div>
            </div>
          </div>

          <div style={{ padding:'0 1.5rem 1.25rem', display:'flex', justifyContent:'flex-end' }}>
            <button className="btn-secondary" onClick={onClose}>Close</button>
          </div>
        </div>
        <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>
      </div>
    );
  }

  // ── Edit / Add mode ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    try { await onSave(form); }
    catch (err) { setError(err.response?.data?.error || 'Failed to save.'); }
    finally { setSaving(false); }
  };

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:100,
      background:'rgba(6,11,24,0.85)', backdropFilter:'blur(10px)',
      display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem',
    }}>
      <div style={{
        background:'rgba(15,23,42,0.97)',
        border:'1px solid rgba(196,181,253,0.18)',
        borderRadius:18, width:'100%', maxWidth:480,
      }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'1.25rem 1.5rem', borderBottom:'1px solid rgba(196,181,253,0.10)' }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", color:'#f1f5f9', fontSize:'1.2rem' }}>
            {form.id ? 'Edit Book' : 'Add New Book'}
          </h2>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color:'#475569' }}>
            <X size={18}/>
          </button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1rem' }}>
          {error && (
            <div style={{ padding:'0.6rem 0.9rem', borderRadius:8, fontSize:'0.82rem',
              background:'rgba(239,68,68,0.12)', border:'1px solid rgba(239,68,68,0.30)', color:'#fca5a5' }}>
              {error}
            </div>
          )}
          {[
            { label:'Title',    field:'title',    placeholder:'Book title', required:true },
            { label:'Author',   field:'author',   placeholder:'Author name', required:true },
            { label:'ISBN',     field:'isbn',     placeholder:'978-...', mono:true },
            { label:'Category', field:'category', placeholder:'e.g. AI & ML' },
            { label:'Shelf',    field:'shelf',    placeholder:'e.g. A-01' },
          ].map(({ label, field, placeholder, required, mono }) => (
            <div key={field}>
              <label className="input-label">{label}{required && ' *'}</label>
              <input className="input-field" placeholder={placeholder} required={required}
                style={mono ? { fontFamily:'JetBrains Mono,monospace' } : {}}
                value={form[field] || ''}
                onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}/>
            </div>
          ))}
          <div>
            <label className="input-label">Total Copies *</label>
            <input className="input-field" type="number" min="1" value={form.totalCopies || form.total_count || 1}
              onChange={e => setForm(f => ({ ...f, totalCopies: parseInt(e.target.value)||1 }))}/>
          </div>
          <div>
            <label className="input-label">Description</label>
            <textarea className="input-field" rows={3} placeholder="Brief description…"
              style={{ resize:'vertical' }}
              value={form.description || ''}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}/>
          </div>
          <div style={{ display:'flex', gap:'0.75rem', justifyContent:'flex-end', marginTop:'0.25rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving…' : form.id ? 'Save Changes' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
