import React, { useState, useEffect, useRef } from 'react';
import Layout from '../components/Layout';
import {
  TrendingUp, BookOpen, AlertTriangle, CheckCircle,
  Calendar, Zap, BarChart2, RefreshCw, Download,
  ArrowUp, ArrowDown, Minus, Target, Package, Clock,
} from 'lucide-react';
import { MOCK_BOOKS, MOCK_TRANSACTIONS, MOCK_TEACHER_TRANSACTIONS } from '../data/mockData';

// ─── Demand Engine ────────────────────────────────────────────────────────────
const EXAM_SEASONS = [
  { name: 'Mid-Semester Exam', start: new Date('2026-10-01'), end: new Date('2026-10-15'), multiplier: 2.8 },
  { name: 'End-Semester Exam', start: new Date('2026-11-15'), end: new Date('2026-12-05'), multiplier: 3.5 },
  { name: 'Internals',         start: new Date('2026-08-20'), end: new Date('2026-08-30'), multiplier: 2.0 },
];

function getDaysUntilExam() {
  const now = new Date();
  const upcoming = EXAM_SEASONS
    .map(e => ({ ...e, daysUntil: Math.ceil((e.start - now) / 86400000) }))
    .filter(e => e.daysUntil > 0)
    .sort((a, b) => a.daysUntil - b.daysUntil);
  return upcoming[0] || null;
}

function isExamSeason() {
  const now = new Date();
  return EXAM_SEASONS.find(e => now >= e.start && now <= e.end) || null;
}

function predictDemand(book) {
  const borrows = MOCK_TRANSACTIONS.filter(t => t.bookId === book.id).length;
  const teacherBorrows = MOCK_TEACHER_TRANSACTIONS.filter(t => t.bookId === book.id).length;
  const totalBorrows = borrows + teacherBorrows;
  const returnRate = MOCK_TRANSACTIONS.filter(t => t.bookId === book.id && t.returned).length / Math.max(borrows, 1);
  const utilRate = (book.totalCopies - book.availableCopies) / Math.max(book.totalCopies, 1);
  const nextExam = getDaysUntilExam();
  const examMultiplier = nextExam ? Math.max(1, 2.5 - nextExam.daysUntil / 60) : 1;
  const baseDemand = Math.round((totalBorrows * 1.4 + utilRate * 8) * examMultiplier);
  const predicted = Math.min(baseDemand, book.totalCopies * 4);
  const needed = Math.max(0, predicted - book.availableCopies);
  const urgency = needed === 0 ? 'ok' : needed >= book.totalCopies ? 'critical' : needed > 1 ? 'high' : 'medium';
  return { predicted, needed, urgency, utilRate: Math.round(utilRate * 100), returnRate: Math.round(returnRate * 100), examMultiplier };
}

function generateMonthlyData(book) {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const base = (book.totalCopies - book.availableCopies) * 1.2;
  return months.map((m, i) => {
    const examBump = (i === 3 || i === 4) ? 2.8 : (i === 7) ? 1.8 : 1;
    const val = Math.max(1, Math.round(base * examBump + Math.random() * 1.5));
    return { month: m, demand: Math.min(val, book.totalCopies * 3) };
  });
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
function MiniBarChart({ data, color = '#c084fc', height = 80 }) {
  const max = Math.max(...data.map(d => d.demand), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height, padding: '0.25rem 0' }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div
            title={`${d.month}: ${d.demand}`}
            style={{
              width: '100%',
              height: `${(d.demand / max) * (height - 20)}px`,
              background: i >= 9 ? `linear-gradient(180deg, ${color}, ${color}88)` : `${color}44`,
              borderRadius: '3px 3px 0 0',
              transition: 'height 0.5s ease',
              cursor: 'pointer',
              minHeight: 4,
            }}
          />
          <span style={{ fontSize: 8, color: '#475569', whiteSpace: 'nowrap' }}>{d.month}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Urgency Badge ────────────────────────────────────────────────────────────
function UrgencyBadge({ urgency }) {
  const cfg = {
    ok:       { label: '✓ Sufficient',  bg: 'rgba(134,239,172,.15)', color: '#86efac', border: 'rgba(134,239,172,.35)' },
    medium:   { label: '⚡ Watch',       bg: 'rgba(251,191,36,.15)',  color: '#fbbf24', border: 'rgba(251,191,36,.35)' },
    high:     { label: '⚠ High Need',   bg: 'rgba(249,168,212,.15)', color: '#f9a8d4', border: 'rgba(249,168,212,.35)' },
    critical: { label: '🔥 Critical',   bg: 'rgba(239,68,68,.15)',   color: '#fca5a5', border: 'rgba(239,68,68,.35)' },
  }[urgency] || {};
  return (
    <span style={{
      padding: '2px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 700,
      background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
      whiteSpace: 'nowrap',
    }}>{cfg.label}</span>
  );
}

// ─── Stat Box ─────────────────────────────────────────────────────────────────
function PredictStat({ label, value, icon: Icon, color, sub }) {
  return (
    <div style={{
      background: 'rgba(15,23,42,0.6)', border: `1px solid ${color}33`,
      borderRadius: 12, padding: '1rem', display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Icon size={14} color={color} />
        <span style={{ fontSize: '0.7rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
      </div>
      <span style={{ fontSize: '1.5rem', fontWeight: 800, color }}>{value}</span>
      {sub && <span style={{ fontSize: '0.68rem', color: '#64748b' }}>{sub}</span>}
    </div>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ value, max, color }) {
  const pct = Math.min(100, (value / Math.max(max, 1)) * 100);
  return (
    <div style={{ background: 'rgba(15,23,42,0.5)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
      <div style={{
        width: `${pct}%`, height: '100%', borderRadius: 4,
        background: `linear-gradient(90deg, ${color}, ${color}bb)`,
        transition: 'width 0.6s ease',
      }} />
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DemandPredictionPage() {
  const [activeBook, setActiveBook] = useState(null);
  const [sortBy, setSortBy] = useState('urgency');
  const [filterCat, setFilterCat] = useState('All');
  const [refreshKey, setRefreshKey] = useState(0);
  const [tab, setTab] = useState('overview');
  const nextExam = getDaysUntilExam();
  const currentSeason = isExamSeason();

  const categories = ['All', ...new Set(MOCK_BOOKS.map(b => b.category))];

  const booksWithPrediction = MOCK_BOOKS
    .filter(b => filterCat === 'All' || b.category === filterCat)
    .map(b => ({ ...b, pred: predictDemand(b), chartData: generateMonthlyData(b) }))
    .sort((a, b) => {
      if (sortBy === 'urgency') {
        const ord = { critical: 0, high: 1, medium: 2, ok: 3 };
        return ord[a.pred.urgency] - ord[b.pred.urgency];
      }
      if (sortBy === 'demand') return b.pred.predicted - a.pred.predicted;
      if (sortBy === 'util') return b.pred.utilRate - a.pred.utilRate;
      return 0;
    });

  const critical = booksWithPrediction.filter(b => b.pred.urgency === 'critical').length;
  const highNeed = booksWithPrediction.filter(b => b.pred.urgency === 'high').length;
  const totalNeeded = booksWithPrediction.reduce((s, b) => s + b.pred.needed, 0);
  const avgUtil = Math.round(booksWithPrediction.reduce((s, b) => s + b.pred.utilRate, 0) / Math.max(booksWithPrediction.length, 1));

  const selected = activeBook ? booksWithPrediction.find(b => b.id === activeBook) : null;

  return (
    <Layout>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p className="section-eyebrow">Librarian · AI Intelligence</p>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: '2rem', color: '#f1f5f9', marginBottom: '0.25rem' }}>
              📊 Demand Prediction
            </h1>
            <p style={{ color: '#475569', fontSize: '0.85rem' }}>
              AI-powered book demand forecasting & smart resource allocation
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button className="btn-secondary" onClick={() => setRefreshKey(k => k + 1)} style={{ gap: '0.4rem' }}>
              <RefreshCw size={14} /> Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Exam Alert Banner */}
      {nextExam && (
        <div style={{
          marginBottom: '1.5rem', padding: '0.9rem 1.25rem', borderRadius: 12,
          background: nextExam.daysUntil < 14 ? 'rgba(239,68,68,.10)' : 'rgba(251,191,36,.08)',
          border: `1px solid ${nextExam.daysUntil < 14 ? 'rgba(239,68,68,.30)' : 'rgba(251,191,36,.25)'}`,
          display: 'flex', alignItems: 'center', gap: '0.75rem',
        }}>
          <Calendar size={18} color={nextExam.daysUntil < 14 ? '#fca5a5' : '#fbbf24'} />
          <div style={{ flex: 1 }}>
            <span style={{ fontWeight: 700, color: nextExam.daysUntil < 14 ? '#fca5a5' : '#fbbf24', fontSize: '0.875rem' }}>
              {nextExam.name}
            </span>
            <span style={{ color: '#64748b', fontSize: '0.82rem', marginLeft: '0.75rem' }}>
              in {nextExam.daysUntil} days — demand multiplier {nextExam.multiplier}×
            </span>
          </div>
          <span style={{
            padding: '2px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 800,
            background: nextExam.daysUntil < 14 ? 'rgba(239,68,68,.20)' : 'rgba(251,191,36,.18)',
            color: nextExam.daysUntil < 14 ? '#fca5a5' : '#fbbf24',
          }}>
            {nextExam.daysUntil < 14 ? 'URGENT' : 'UPCOMING'}
          </span>
        </div>
      )}

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <PredictStat label="Critical Books"     value={critical}       icon={AlertTriangle} color="#fca5a5" sub="need immediate procurement" />
        <PredictStat label="High Demand"        value={highNeed}       icon={TrendingUp}    color="#f9a8d4" sub="watch closely" />
        <PredictStat label="Copies Needed"      value={totalNeeded}    icon={Package}       color="#fbbf24" sub="total shortfall est." />
        <PredictStat label="Avg Utilisation"    value={`${avgUtil}%`}  icon={BarChart2}     color="#7dd3fc" sub="across catalog" />
        <PredictStat label="Books Monitored"    value={MOCK_BOOKS.length} icon={BookOpen}   color="#86efac" sub="in prediction engine" />
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {['overview', 'analytics', 'allocate'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '0.45rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer',
            fontSize: '0.82rem', fontWeight: tab === t ? 700 : 500,
            background: tab === t ? 'rgba(192,132,252,.18)' : 'rgba(15,23,42,.5)',
            color: tab === t ? '#c084fc' : '#64748b',
            borderBottom: tab === t ? '2px solid #c084fc' : '2px solid transparent',
            transition: 'all 0.2s',
          }}>
            {t === 'overview' ? '📋 Overview' : t === 'analytics' ? '📈 Analytics' : '🎯 Allocate'}
          </button>
        ))}
      </div>

      {/* ─── Tab: Overview ─── */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap: '1.25rem' }}>
          {/* Book Table */}
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            {/* Filters */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap',
              padding: '1rem 1.25rem', borderBottom: '1px solid rgba(196,181,253,.10)',
            }}>
              <select
                value={filterCat}
                onChange={e => setFilterCat(e.target.value)}
                style={{
                  background: 'rgba(15,23,42,.7)', border: '1px solid rgba(196,181,253,.20)',
                  color: '#e2e8f0', borderRadius: 8, padding: '0.4rem 0.75rem',
                  fontSize: '0.8rem', cursor: 'pointer', outline: 'none',
                }}
              >
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                style={{
                  background: 'rgba(15,23,42,.7)', border: '1px solid rgba(196,181,253,.20)',
                  color: '#e2e8f0', borderRadius: 8, padding: '0.4rem 0.75rem',
                  fontSize: '0.8rem', cursor: 'pointer', outline: 'none',
                }}
              >
                <option value="urgency">Sort: Urgency</option>
                <option value="demand">Sort: Demand</option>
                <option value="util">Sort: Utilisation</option>
              </select>
              <span style={{ fontSize: '0.78rem', color: '#475569', marginLeft: 'auto' }}>
                {booksWithPrediction.length} books
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Available</th>
                    <th>Utilisation</th>
                    <th>Predicted Demand</th>
                    <th>Copies Needed</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {booksWithPrediction.map(book => (
                    <tr
                      key={book.id}
                      onClick={() => setActiveBook(activeBook === book.id ? null : book.id)}
                      style={{ cursor: 'pointer', background: activeBook === book.id ? 'rgba(192,132,252,.08)' : undefined }}
                    >
                      <td style={{ maxWidth: 200 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: book.accentColor, flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 600, lineHeight: 1.3 }}>{book.title}</p>
                            <p style={{ fontSize: '0.7rem', color: '#475569' }}>{book.category}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        <span style={{ color: book.availableCopies === 0 ? '#fca5a5' : '#86efac', fontWeight: 700 }}>
                          {book.availableCopies}
                        </span>
                        <span style={{ color: '#475569' }}>/{book.totalCopies}</span>
                      </td>
                      <td style={{ minWidth: 100 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <ProgressBar value={book.pred.utilRate} max={100} color={book.pred.utilRate > 75 ? '#fca5a5' : book.pred.utilRate > 50 ? '#fbbf24' : '#86efac'} />
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>{book.pred.utilRate}%</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#c084fc' }}>{book.pred.predicted}</span>
                        {book.pred.examMultiplier > 1.2 && (
                          <span style={{ marginLeft: 4, fontSize: '0.65rem', color: '#fbbf24' }}>
                            ×{book.pred.examMultiplier.toFixed(1)}
                          </span>
                        )}
                      </td>
                      <td>
                        <span style={{
                          fontWeight: 700, fontSize: '0.875rem',
                          color: book.pred.needed === 0 ? '#86efac' : book.pred.needed > 2 ? '#fca5a5' : '#fbbf24',
                        }}>
                          {book.pred.needed === 0 ? '—' : `+${book.pred.needed}`}
                        </span>
                      </td>
                      <td><UrgencyBadge urgency={book.pred.urgency} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detail Panel */}
          {selected && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card" style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: selected.accentColor }} />
                  <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', color: '#f1f5f9', lineHeight: 1.3 }}>
                    {selected.title}
                  </h2>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '1rem' }}>{selected.author} · {selected.category}</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
                  {[
                    { l: 'Total Copies', v: selected.totalCopies, c: '#c084fc' },
                    { l: 'Available',    v: selected.availableCopies, c: '#86efac' },
                    { l: 'Predicted',    v: selected.pred.predicted, c: '#7dd3fc' },
                    { l: 'Needed',       v: selected.pred.needed || '—', c: selected.pred.needed ? '#fbbf24' : '#86efac' },
                  ].map(({ l, v, c }) => (
                    <div key={l} style={{ background: 'rgba(15,23,42,.5)', borderRadius: 10, padding: '0.75rem', textAlign: 'center' }}>
                      <p style={{ fontSize: '0.65rem', color: '#475569', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{l}</p>
                      <p style={{ fontSize: '1.3rem', fontWeight: 800, color: c }}>{v}</p>
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
                  12-Month Demand Forecast
                </p>
                <MiniBarChart data={selected.chartData} color={selected.accentColor} height={90} />

                <div style={{ marginTop: '1rem', padding: '0.75rem', borderRadius: 10, background: 'rgba(192,132,252,.06)', border: '1px solid rgba(192,132,252,.15)' }}>
                  <p style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 700, marginBottom: 4 }}>🤖 AI Recommendation</p>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6 }}>
                    {selected.pred.urgency === 'critical'
                      ? `Procure at least ${selected.pred.needed + 2} additional copies immediately. Utilisation is at ${selected.pred.utilRate}% with exam season approaching.`
                      : selected.pred.urgency === 'high'
                      ? `Consider procuring ${selected.pred.needed} copies before exam season. Current utilisation ${selected.pred.utilRate}%.`
                      : selected.pred.urgency === 'medium'
                      ? `Monitor closely. Reserve 1 copy for peak exam demand. Currently ${selected.pred.utilRate}% utilised.`
                      : `Stock levels healthy. ${selected.availableCopies} copies available with ${selected.pred.utilRate}% utilisation.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Tab: Analytics ─── */}
      {tab === 'analytics' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
          {/* Category Demand */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', color: '#f1f5f9', marginBottom: '1.25rem' }}>
              Demand by Category
            </h2>
            {Object.entries(
              MOCK_BOOKS.reduce((acc, b) => {
                if (!acc[b.category]) acc[b.category] = { total: 0, avail: 0, count: 0 };
                acc[b.category].total += b.totalCopies;
                acc[b.category].avail += b.availableCopies;
                acc[b.category].count++;
                return acc;
              }, {})
            ).map(([cat, data]) => {
              const util = Math.round(((data.total - data.avail) / data.total) * 100);
              const color = util > 75 ? '#fca5a5' : util > 50 ? '#fbbf24' : '#86efac';
              return (
                <div key={cat} style={{ marginBottom: '0.9rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: '0.8rem', color: '#e2e8f0', fontWeight: 500 }}>{cat}</span>
                    <span style={{ fontSize: '0.78rem', color, fontWeight: 700 }}>{util}%</span>
                  </div>
                  <ProgressBar value={util} max={100} color={color} />
                  <span style={{ fontSize: '0.68rem', color: '#475569' }}>{data.count} books · {data.total - data.avail}/{data.total} borrowed</span>
                </div>
              );
            })}
          </div>

          {/* Bottleneck Detection */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', color: '#f1f5f9', marginBottom: '0.25rem' }}>
              🚨 Bottleneck Detection
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '1.25rem' }}>Books with 0 copies & high transaction history</p>
            {MOCK_BOOKS.filter(b => b.availableCopies === 0).map(book => {
              const txCount = MOCK_TRANSACTIONS.filter(t => t.bookId === book.id).length;
              return (
                <div key={book.id} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.7rem 0', borderBottom: '1px solid rgba(196,181,253,.07)',
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fca5a5', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 600 }}>{book.title}</p>
                    <p style={{ fontSize: '0.7rem', color: '#475569' }}>{book.category} · {txCount} total borrows</p>
                  </div>
                  <span style={{
                    fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20,
                    background: 'rgba(239,68,68,.15)', color: '#fca5a5', border: '1px solid rgba(239,68,68,.30)',
                  }}>OUT</span>
                </div>
              );
            })}
          </div>

          {/* Return Velocity */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', color: '#f1f5f9', marginBottom: '1.25rem' }}>
              📦 Return Velocity
            </h2>
            {MOCK_BOOKS.slice(0, 8).map(book => {
              const txs = MOCK_TRANSACTIONS.filter(t => t.bookId === book.id);
              const returned = txs.filter(t => t.returned).length;
              const pct = txs.length ? Math.round((returned / txs.length) * 100) : 0;
              return (
                <div key={book.id} style={{ marginBottom: '0.8rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 500, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{book.title}</span>
                    <span style={{ fontSize: '0.75rem', color: pct > 60 ? '#86efac' : '#fbbf24', fontWeight: 700 }}>{pct}%</span>
                  </div>
                  <ProgressBar value={pct} max={100} color={pct > 60 ? '#86efac' : '#fbbf24'} />
                </div>
              );
            })}
          </div>

          {/* Exam Readiness */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', color: '#f1f5f9', marginBottom: '0.25rem' }}>
              🎓 Exam Readiness Score
            </h2>
            <p style={{ fontSize: '0.75rem', color: '#475569', marginBottom: '1.25rem' }}>Readiness = available ÷ predicted demand</p>
            {booksWithPrediction.filter(b => b.pred.urgency !== 'ok').slice(0, 7).map(b => {
              const score = Math.min(100, Math.round((b.availableCopies / Math.max(b.pred.predicted, 1)) * 100));
              return (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: b.accentColor, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                      <span style={{ fontSize: '0.78rem', color: '#cbd5e1', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</span>
                      <span style={{ fontSize: '0.75rem', color: score < 40 ? '#fca5a5' : '#fbbf24', fontWeight: 700 }}>{score}%</span>
                    </div>
                    <ProgressBar value={score} max={100} color={score < 40 ? '#fca5a5' : '#fbbf24'} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Tab: Allocate ─── */}
      {tab === 'allocate' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>
          {/* Procurement Recommendations */}
          <div className="card" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', color: '#f1f5f9' }}>
                🎯 Smart Procurement Plan
              </h2>
              <span style={{ fontSize: '0.7rem', color: '#475569' }}>AI-Generated · {new Date().toLocaleDateString('en-IN')}</span>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Current Stock</th>
                  <th>Predicted Need</th>
                  <th>Recommend Order</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {booksWithPrediction.filter(b => b.pred.needed > 0).map(book => {
                  const order = book.pred.needed + (book.pred.urgency === 'critical' ? 2 : 1);
                  return (
                    <tr key={book.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: book.accentColor }} />
                          <span style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 600 }}>{book.title}</span>
                        </div>
                        <span style={{ fontSize: '0.7rem', color: '#475569' }}>{book.author}</span>
                      </td>
                      <td style={{ fontSize: '0.82rem' }}>
                        <span style={{ color: '#fca5a5', fontWeight: 700 }}>{book.availableCopies}</span>
                        <span style={{ color: '#475569' }}>/{book.totalCopies}</span>
                      </td>
                      <td style={{ fontSize: '0.875rem', color: '#c084fc', fontWeight: 700 }}>{book.pred.predicted}</td>
                      <td>
                        <span style={{
                          padding: '3px 12px', borderRadius: 20, fontSize: '0.78rem', fontWeight: 700,
                          background: 'rgba(192,132,252,.15)', color: '#c084fc', border: '1px solid rgba(192,132,252,.30)',
                        }}>
                          +{order} copies
                        </span>
                      </td>
                      <td><UrgencyBadge urgency={book.pred.urgency} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* AI Summary Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card" style={{ padding: '1.25rem', background: 'rgba(192,132,252,.06)', border: '1px solid rgba(192,132,252,.20)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Zap size={16} color="#c084fc" />
                <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', color: '#c084fc' }}>AI Insights</h2>
              </div>
              {[
                { icon: '📚', text: `${critical} books are critically low and need emergency procurement.` },
                { icon: '📅', text: nextExam ? `${nextExam.name} in ${nextExam.daysUntil} days — expect ${nextExam.multiplier}× demand spike.` : 'No exam season in the next 60 days.' },
                { icon: '💡', text: `Top demand: AI & ML and Database Systems categories.` },
                { icon: '♻️', text: `Avg. return rate is healthy — maintain current loan period.` },
                { icon: '⚡', text: `Procure ${totalNeeded + critical * 2} total copies to meet forecasted demand.` },
              ].map(({ icon, text }, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(192,132,252,.08)' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>{icon}</span>
                  <p style={{ fontSize: '0.78rem', color: '#94a3b8', lineHeight: 1.6 }}>{text}</p>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: '1.25rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', color: '#f1f5f9', marginBottom: '0.75rem' }}>
                📅 Seasonal Peaks
              </h2>
              {EXAM_SEASONS.map(e => (
                <div key={e.name} style={{ marginBottom: '0.75rem', padding: '0.65rem 0', borderBottom: '1px solid rgba(196,181,253,.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 600 }}>{e.name}</span>
                    <span style={{ fontSize: '0.7rem', padding: '1px 8px', borderRadius: 20, background: 'rgba(251,191,36,.12)', color: '#fbbf24', fontWeight: 700 }}>
                      {e.multiplier}×
                    </span>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: '#475569', marginTop: 2 }}>
                    {e.start.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} – {e.end.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
