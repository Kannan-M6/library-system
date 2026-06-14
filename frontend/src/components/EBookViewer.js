/**
 * components/EBookViewer.js
 * Full-screen modal that opens when a physical book is unavailable.
 * Shows an embedded reader (iframe) + fallback open-in-new-tab option.
 */
import React, { useState } from 'react';
import {
  X, BookOpen, ExternalLink, Wifi, AlertTriangle,
  Globe, Maximize2, Minimize2, Info,
} from 'lucide-react';

const SOURCE_ICONS = {
  'deeplearningbook.org': '🧠',
  'Open Library':         '📚',
  'Internet Archive':     '🏛️',
  'themlbook.com':        '📖',
  'wesmckinney.com':      '🐍',
  'db-book.com':          '🗄️',
};

export default function EBookViewer({ book, onClose }) {
  const [mode, setMode]         = useState('info');   // 'info' | 'embed'
  const [fullscreen, setFull]   = useState(false);
  const [iframeError, setIErr]  = useState(false);

  if (!book) return null;
  const accent = book.accentColor || '#7dd3fc';

  const openExternal = () => window.open(book.ebookUrl, '_blank', 'noopener,noreferrer');

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(4,8,20,0.92)', backdropFilter: 'blur(14px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: fullscreen ? 0 : '1rem',
      animation: 'fadeInUp 0.25s ease-out',
    }}>
      <div style={{
        width: '100%',
        maxWidth: fullscreen ? '100%' : 860,
        height: fullscreen ? '100vh' : 'calc(100vh - 4rem)',
        maxHeight: fullscreen ? '100vh' : 780,
        background: 'rgba(10,16,35,0.98)',
        border: `1px solid ${accent}35`,
        borderRadius: fullscreen ? 0 : 18,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        boxShadow: `0 24px 80px ${accent}20`,
      }}>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.5rem',
          background: `linear-gradient(135deg, ${accent}10, rgba(10,16,35,0))`,
          borderBottom: `1px solid ${accent}20`,
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: `${accent}1a`, border: `1px solid ${accent}33`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BookOpen size={18} color={accent}/>
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '0.68rem', fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.1em', color: accent, marginBottom: 2 }}>
                📖 E-Book Viewer
              </p>
              <p style={{
                fontSize: '0.9rem', fontWeight: 700, color: '#f1f5f9',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {book.title}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            {/* Mode toggle */}
            <div style={{
              display: 'flex', background: 'rgba(15,23,42,0.80)',
              borderRadius: 8, padding: 3, border: '1px solid rgba(196,181,253,0.15)',
            }}>
              {[{ id:'info', label:'Info' }, { id:'embed', label:'Read Online' }].map(m => (
                <button key={m.id} onClick={() => { setMode(m.id); setIErr(false); }}
                  style={{
                    padding: '0.3rem 0.75rem', borderRadius: 6, border: 'none',
                    cursor: 'pointer', fontSize: '0.75rem', fontWeight: mode===m.id ? 700 : 500,
                    background: mode===m.id ? `${accent}25` : 'none',
                    color: mode===m.id ? accent : '#475569',
                    transition: 'all .15s',
                  }}>
                  {m.label}
                </button>
              ))}
            </div>

            <button onClick={() => setFull(f => !f)} style={{
              background: 'rgba(15,23,42,0.7)', border: '1px solid rgba(196,181,253,0.15)',
              borderRadius: 8, cursor: 'pointer', padding: '0.4rem',
              color: '#64748b', display: 'flex', alignItems: 'center',
            }}>
              {fullscreen ? <Minimize2 size={15}/> : <Maximize2 size={15}/>}
            </button>

            <button onClick={onClose} style={{
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)',
              borderRadius: 8, cursor: 'pointer', padding: '0.4rem',
              color: '#fca5a5', display: 'flex', alignItems: 'center',
            }}>
              <X size={15}/>
            </button>
          </div>
        </div>

        {/* ── Unavailable notice ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.6rem 1.5rem',
          background: 'rgba(253,230,138,0.06)',
          borderBottom: '1px solid rgba(253,230,138,0.15)',
          flexShrink: 0,
        }}>
          <AlertTriangle size={13} color="#fde68a"/>
          <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            <strong style={{ color: '#fde68a' }}>Physical copy unavailable</strong>
            {' '}— Access this free e-book via {book.ebookSource}
            {book.ebookFree && (
              <span style={{
                marginLeft: '0.5rem', fontSize: '0.65rem', fontWeight: 700,
                padding: '1px 7px', borderRadius: 10,
                background: 'rgba(134,239,172,0.15)', color: '#86efac',
                border: '1px solid rgba(134,239,172,0.30)',
              }}>FREE</span>
            )}
          </p>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

          {/* INFO tab */}
          {mode === 'info' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.75rem 1.5rem' }} className="fade-in">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

                {/* Book details */}
                <div style={{
                  background: 'rgba(15,23,42,0.60)', border: `1px solid ${accent}20`,
                  borderRadius: 14, padding: '1.25rem',
                }}>
                  <p style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569',
                    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                    Book Details
                  </p>
                  {[
                    ['Author',   book.author],
                    ['ISBN',     book.isbn],
                    ['Category', book.category],
                    ['Shelf',    book.shelf],
                    ['E-Source', book.ebookSource],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between',
                      padding: '0.35rem 0', borderBottom: '1px solid rgba(196,181,253,0.07)' }}>
                      <span style={{ fontSize: '0.72rem', color: '#475569' }}>{k}</span>
                      <span style={{ fontSize: '0.78rem', color: '#e2e8f0',
                        fontFamily: k==='ISBN' ? 'monospace' : 'inherit' }}>{v}</span>
                    </div>
                  ))}
                </div>

                {/* Access info */}
                <div style={{
                  background: `${accent}08`, border: `1px solid ${accent}20`,
                  borderRadius: 14, padding: '1.25rem',
                }}>
                  <p style={{ fontSize: '0.68rem', fontWeight: 700, color: accent,
                    textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>
                    {SOURCE_ICONS[book.ebookSource] || '📖'} Access Details
                  </p>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.65, marginBottom: '1rem' }}>
                    {book.description}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem',
                      fontSize: '0.75rem', color: '#86efac' }}>
                      <Globe size={12}/> Source: {book.ebookSource}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem',
                      fontSize: '0.75rem', color: '#86efac' }}>
                      ✓ No account required to read
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem',
                      fontSize: '0.75rem', color: '#fde68a' }}>
                      <Info size={12}/> Some pages may require free login
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  className="btn-primary"
                  style={{ fontSize: '0.9rem', padding: '0.7rem 1.5rem' }}
                  onClick={() => setMode('embed')}
                >
                  <BookOpen size={16}/> Read Online (Embedded)
                </button>
                <button
                  className="btn-secondary"
                  style={{ fontSize: '0.9rem', padding: '0.7rem 1.5rem' }}
                  onClick={openExternal}
                >
                  <ExternalLink size={15}/> Open in New Tab
                </button>
              </div>

              <div style={{
                marginTop: '1.5rem', padding: '0.85rem 1.1rem', borderRadius: 12,
                background: 'rgba(125,211,252,0.06)', border: '1px solid rgba(125,211,252,0.20)',
              }}>
                <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.6 }}>
                  <strong style={{ color: '#7dd3fc' }}>Note:</strong> E-books are sourced from{' '}
                  legally free platforms (Open Library, Internet Archive, official author sites).
                  These are provided as a temporary alternative while physical copies are unavailable.
                </p>
              </div>
            </div>
          )}

          {/* EMBED tab */}
          {mode === 'embed' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }} className="fade-in">
              {iframeError ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
                  <Wifi size={40} style={{ color: '#475569', marginBottom: '1rem', opacity: 0.5 }}/>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                    Embedded view blocked
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: '1.5rem', maxWidth: 360, lineHeight: 1.6 }}>
                    This website doesn't allow embedding. Open it directly in a new browser tab to read.
                  </p>
                  <button className="btn-primary" onClick={openExternal}>
                    <ExternalLink size={15}/> Open {book.ebookSource} in New Tab
                  </button>
                </div>
              ) : (
                <>
                  <div style={{
                    padding: '0.5rem 1rem', background: 'rgba(15,23,42,0.8)',
                    borderBottom: '1px solid rgba(196,181,253,0.10)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0,
                  }}>
                    <Globe size={12} color="#475569"/>
                    <span style={{ fontSize: '0.72rem', color: '#475569',
                      fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {book.ebookUrl}
                    </span>
                    <button onClick={openExternal}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none',
                        cursor: 'pointer', color: '#475569', display: 'flex', alignItems: 'center',
                        flexShrink: 0, gap: 4, fontSize: '0.72rem' }}>
                      <ExternalLink size={12}/> Open tab
                    </button>
                  </div>
                  <iframe
                    title={book.title}
                    src={book.ebookUrl}
                    style={{ flex: 1, border: 'none', background: '#fff' }}
                    onError={() => setIErr(true)}
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  />
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
