import React, { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import { Search, ArrowLeftRight, CheckCircle, X, IndianRupee, Filter } from 'lucide-react';
import { MOCK_TRANSACTIONS, getBookById, getStudentById, calcFine } from '../data/mockData';
import toast from 'react-hot-toast';

function fmtDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

export default function TransactionsPage() {
  const [txList, setTxList]     = useState(MOCK_TRANSACTIONS);
  const [query,  setQuery]      = useState('');
  const [filter, setFilter]     = useState('all'); // all | active | overdue | returned | manual

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return txList.filter(tx => {
      const book = getBookById(tx.bookId);
      const stu  = getStudentById(tx.studentId);
      const over = !tx.returned && new Date(tx.dueDate) < new Date();
      const matchQ = !q ||
        book?.title.toLowerCase().includes(q) ||
        stu?.name.toLowerCase().includes(q)   ||
        stu?.rollNo.toLowerCase().includes(q);
      if (!matchQ) return false;
      if (filter === 'active')   return !tx.returned && !over;
      if (filter === 'overdue')  return !tx.returned && over;
      if (filter === 'returned') return tx.returned;
      if (filter === 'manual')   return tx.method === 'manual';
      return true;
    });
  }, [txList, query, filter]);

  const handleReturn = txId => {
    setTxList(prev => prev.map(t => t.id === txId
      ? { ...t, returned:true, returnDate: new Date().toISOString().split('T')[0] }
      : t
    ));
    toast.success('Book marked as returned!');
  };

  const counts = useMemo(() => ({
    all:      txList.length,
    active:   txList.filter(t => !t.returned && new Date(t.dueDate) >= new Date()).length,
    overdue:  txList.filter(t => !t.returned && new Date(t.dueDate) < new Date()).length,
    returned: txList.filter(t =>  t.returned).length,
    manual:   txList.filter(t =>  t.method === 'manual').length,
  }), [txList]);

  const FILTERS = [
    { id:'all',      label:'All',      count:counts.all },
    { id:'active',   label:'Active',   count:counts.active },
    { id:'overdue',  label:'Overdue',  count:counts.overdue },
    { id:'returned', label:'Returned', count:counts.returned },
    { id:'manual',   label:'Manual',   count:counts.manual },
  ];

  return (
    <Layout>
      {/* Header */}
      <div style={{ marginBottom:'1.75rem' }}>
        <p className="section-eyebrow">Records</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', color:'#f1f5f9' }}>Transactions</h1>
        <p style={{ color:'#64748b', fontSize:'0.875rem', marginTop:'0.25rem' }}>
          Complete borrowing ledger — scanner and manual entries
        </p>
      </div>

      {/* Search */}
      <div style={{ position:'relative', maxWidth:440, marginBottom:'1.25rem' }}>
        <Search size={15} style={{ position:'absolute', left:'0.9rem', top:'50%', transform:'translateY(-50%)', color:'#475569' }}/>
        <input className="input-field" style={{ paddingLeft:'2.4rem' }}
          placeholder="Search by book title, student name or roll no…"
          value={query} onChange={e => setQuery(e.target.value)}/>
        {query && (
          <button onClick={() => setQuery('')} style={{
            position:'absolute', right:'0.75rem', top:'50%', transform:'translateY(-50%)',
            background:'none', border:'none', cursor:'pointer', color:'#475569',
          }}><X size={15}/></button>
        )}
      </div>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {FILTERS.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            style={{
              display:'flex', alignItems:'center', gap:'0.4rem',
              padding:'0.35rem 0.85rem', borderRadius:20, cursor:'pointer',
              border: filter === f.id ? 'none' : '1px solid rgba(196,181,253,.22)',
              background: filter === f.id
                ? 'linear-gradient(135deg,#c084fc,#818cf8)'
                : 'rgba(15,23,42,.4)',
              color: filter === f.id ? '#fff' : '#64748b',
              fontSize:'0.8rem', fontWeight: filter === f.id ? 700 : 500,
              transition:'all .2s',
            }}
          >
            {f.label}
            <span style={{
              fontSize:'0.68rem', padding:'1px 6px', borderRadius:10,
              background: filter === f.id ? 'rgba(255,255,255,.25)' : 'rgba(196,181,253,.15)',
            }}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card" style={{ padding:0, overflow:'hidden' }}>
        <div style={{ overflowX:'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Book</th>
                <th>Borrower</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Return Date</th>
                <th>Status</th>
                <th>Method</th>
                <th>Fine</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ textAlign:'center', padding:'3rem', color:'#475569' }}>
                    No transactions match your filters.
                  </td>
                </tr>
              ) : filtered.map(tx => {
                const book = getBookById(tx.bookId);
                const stu  = getStudentById(tx.studentId);
                const over = !tx.returned && new Date(tx.dueDate) < new Date();
                const fine = tx.returned ? tx.fine : calcFine(tx.dueDate);

                return (
                  <tr key={tx.id}>
                    <td style={{ color:'#334155', fontFamily:'JetBrains Mono,monospace', fontSize:'0.75rem' }}>
                      {tx.id}
                    </td>
                    <td style={{ maxWidth:180 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                        <div style={{ width:6, height:6, borderRadius:'50%', flexShrink:0, background:book?.accentColor || '#c084fc' }}/>
                        <span style={{ fontSize:'0.82rem', color:'#e2e8f0',
                                      overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                          {book?.title}
                        </span>
                      </div>
                    </td>
                    <td>
                      <p style={{ fontSize:'0.82rem', color:'#e2e8f0' }}>{stu?.name}</p>
                      <p style={{ fontSize:'0.72rem', color:'#475569', fontFamily:'JetBrains Mono,monospace' }}>{stu?.rollNo}</p>
                    </td>
                    <td style={{ fontSize:'0.82rem', color:'#64748b' }}>{fmtDate(tx.borrowDate)}</td>
                    <td style={{ fontSize:'0.82rem', color: over ? '#fde68a' : '#64748b' }}>{fmtDate(tx.dueDate)}</td>
                    <td style={{ fontSize:'0.82rem', color:'#64748b' }}>{fmtDate(tx.returnDate)}</td>
                    <td>
                      <span className={
                        tx.returned ? 'badge-returned'
                        : over       ? 'badge-overdue'
                                     : 'badge-available'
                      }>
                        {tx.returned ? 'Returned' : over ? 'Overdue' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <span className={tx.method === 'manual' ? 'badge-manual' : 'badge-returned'}>
                        {tx.method === 'manual' ? '✍ Manual' : '⬡ Scan'}
                      </span>
                    </td>
                    <td style={{ color: fine > 0 ? '#f9a8d4' : '#86efac', fontSize:'0.85rem', fontWeight:600 }}>
                      {fine > 0 ? `₹${fine}` : '—'}
                    </td>
                    <td>
                      {!tx.returned && (
                        <button
                          className="btn-success"
                          style={{ padding:'0.3rem 0.7rem', fontSize:'0.75rem' }}
                          onClick={() => handleReturn(tx.id)}
                        >
                          <CheckCircle size={12}/> Return
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}