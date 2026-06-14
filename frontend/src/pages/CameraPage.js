import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { ScanLine, QrCode, ClipboardEdit, Wifi, WifiOff, Camera, AlertTriangle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CameraPage() {
  const [scannerState, setScannerState] = useState('idle'); // idle | scanning | found | error
  const [manualISBN,   setManualISBN]   = useState('');

  const simulateScan = () => {
    setScannerState('scanning');
    setTimeout(() => {
      // 60% chance of success for demo
      if (Math.random() > 0.4) {
        setScannerState('found');
        toast.success('Book scanned: Deep Learning (ISBN: 978-0-262-03384-8)');
      } else {
        setScannerState('error');
        toast.error('Scan failed — camera cannot read the code.');
      }
    }, 2200);
  };

  return (
    <Layout>
      {/* Header */}
      <div style={{ marginBottom:'1.75rem' }}>
        <p className="section-eyebrow">Scanner Module</p>
        <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'2rem', color:'#f1f5f9' }}>
          QR / Barcode Scanner
        </h1>
        <p style={{ color:'#64748b', fontSize:'0.875rem', marginTop:'0.25rem' }}>
          Point camera at book barcode or QR code to check in/out
        </p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'1.5rem' }}>
        {/* Camera viewport */}
        <div className="card" style={{ padding:'2rem' }}>
          {/* Viewport */}
          <div style={{
            position:'relative', width:'100%', aspectRatio:'16/9', maxHeight:380,
            background:'rgba(6,11,24,.8)', borderRadius:14, overflow:'hidden',
            border:'2px solid rgba(196,181,253,.20)',
            display:'flex', alignItems:'center', justifyContent:'center',
            marginBottom:'1.5rem',
          }}>
            {/* Corner guides */}
            {[
              { top:12, left:12, borderTop:'3px solid #c084fc', borderLeft:'3px solid #c084fc', width:28, height:28 },
              { top:12, right:12, borderTop:'3px solid #c084fc', borderRight:'3px solid #c084fc', width:28, height:28 },
              { bottom:12, left:12, borderBottom:'3px solid #c084fc', borderLeft:'3px solid #c084fc', width:28, height:28 },
              { bottom:12, right:12, borderBottom:'3px solid #c084fc', borderRight:'3px solid #c084fc', width:28, height:28 },
            ].map((s, i) => (
              <div key={i} style={{ position:'absolute', borderRadius:2, ...s }}/>
            ))}

            {scannerState === 'idle' && (
              <div style={{ textAlign:'center', color:'#334155' }}>
                <Camera size={56} style={{ marginBottom:'1rem', opacity:0.4 }}/>
                <p style={{ fontSize:'0.9rem' }}>Camera preview will appear here</p>
                <p style={{ fontSize:'0.8rem', marginTop:'0.4rem', color:'#1e293b' }}>
                  (Camera requires HTTPS in production)
                </p>
              </div>
            )}

            {scannerState === 'scanning' && (
              <div style={{ textAlign:'center', color:'#c4b5fd' }}>
                <div style={{
                  position:'absolute', top:0, left:0, right:0, height:3,
                  background:'linear-gradient(90deg,transparent,#c084fc,transparent)',
                  animation:'scanLine 1.8s linear infinite',
                }}/>
                <ScanLine size={52} style={{ marginBottom:'1rem', opacity:0.7, animation:'pulse 1s ease-in-out infinite' }}/>
                <p style={{ fontSize:'0.9rem' }}>Scanning…</p>
              </div>
            )}

            {scannerState === 'found' && (
              <div style={{ textAlign:'center', color:'#86efac' }}>
                <CheckCircle size={52} style={{ marginBottom:'1rem' }}/>
                <p style={{ fontSize:'0.95rem', fontWeight:600 }}>Book Found!</p>
                <p style={{ fontSize:'0.82rem', marginTop:'0.35rem', color:'#64748b' }}>
                  Deep Learning — Goodfellow et al.
                </p>
              </div>
            )}

            {scannerState === 'error' && (
              <div style={{ textAlign:'center', color:'#f9a8d4' }}>
                <AlertTriangle size={52} style={{ marginBottom:'1rem' }}/>
                <p style={{ fontSize:'0.95rem', fontWeight:600 }}>Scan Failed</p>
                <p style={{ fontSize:'0.82rem', marginTop:'0.35rem', color:'#64748b' }}>
                  Unable to read barcode or QR code
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div style={{ display:'flex', gap:'0.75rem', justifyContent:'center', flexWrap:'wrap' }}>
            <button className="btn-primary" onClick={simulateScan}
              disabled={scannerState === 'scanning'}
              style={{ minWidth:160, justifyContent:'center' }}>
              <Camera size={16}/>
              {scannerState === 'scanning' ? 'Scanning…' : 'Start Scan'}
            </button>
            <button className="btn-secondary"
              onClick={() => setScannerState('idle')}
              style={{ justifyContent:'center' }}>
              Reset
            </button>
          </div>

          {/* Manual ISBN */}
          <div style={{ marginTop:'1.5rem', paddingTop:'1.5rem', borderTop:'1px solid rgba(196,181,253,.12)' }}>
            <p style={{ fontSize:'0.82rem', color:'#64748b', marginBottom:'0.75rem' }}>
              Or enter ISBN / Book ID manually:
            </p>
            <div style={{ display:'flex', gap:'0.75rem' }}>
              <input
                className="input-field"
                placeholder="e.g. 978-0-262-03384-8"
                value={manualISBN}
                onChange={e => setManualISBN(e.target.value)}
                style={{ fontFamily:'JetBrains Mono,monospace' }}
              />
              <button className="btn-secondary" onClick={() => {
                if (manualISBN.trim()) toast.success(`Lookup: ${manualISBN}`);
              }}>
                <QrCode size={15}/> Look up
              </button>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {/* Scanner status */}
          <div className="card" style={{ padding:'1.25rem' }}>
            <h3 style={{ fontFamily:"'Playfair Display',serif", color:'#f1f5f9', fontSize:'1rem', marginBottom:'1rem' }}>
              Scanner Status
            </h3>
            {[
              { label:'Camera Hardware', status: scannerState === 'error' ? 'error' : 'ok',    text: scannerState === 'error' ? 'Error detected' : 'Connected' },
              { label:'Barcode Engine',  status: 'ok',   text:'Ready' },
              { label:'QR Engine',       status: 'ok',   text:'Ready' },
              { label:'Network',         status: 'warn', text:'Check connectivity' },
            ].map(({ label, status, text }) => (
              <div key={label} style={{
                display:'flex', justifyContent:'space-between', alignItems:'center',
                paddingBottom:'0.6rem', marginBottom:'0.6rem',
                borderBottom:'1px solid rgba(196,181,253,.09)',
              }}>
                <span style={{ fontSize:'0.82rem', color:'#64748b' }}>{label}</span>
                <span style={{
                  fontSize:'0.75rem', fontWeight:600,
                  color: status === 'ok' ? '#86efac' : status === 'warn' ? '#fde68a' : '#f9a8d4',
                }}>
                  {status === 'ok' ? '●' : status === 'warn' ? '◐' : '○'} {text}
                </span>
              </div>
            ))}
          </div>

          {/* Manual entry CTA */}
          <div className="card" style={{
            padding:'1.25rem',
            background:'rgba(125,211,252,.07)',
            border:'1px dashed rgba(125,211,252,.35)',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.75rem' }}>
              <WifiOff size={18} color="#fde68a"/>
              <span style={{ fontSize:'0.85rem', fontWeight:700, color:'#fde68a' }}>Scanner not working?</span>
            </div>
            <p style={{ fontSize:'0.82rem', color:'#64748b', lineHeight:1.6, marginBottom:'1rem' }}>
              Don't let a broken scanner stop library operations. Use the <strong style={{ color:'#7dd3fc' }}>Manual Entry Module</strong> to record transactions without any hardware.
            </p>
            <Link to="/librarian/manual-entry">
              <button className="btn-primary" style={{ width:'100%', justifyContent:'center',
                background:'linear-gradient(135deg,rgba(125,211,252,.25),rgba(192,132,252,.20))',
                border:'1px solid rgba(125,211,252,.40)', color:'#7dd3fc' }}>
                <ClipboardEdit size={15}/> Open Manual Entry
              </button>
            </Link>
          </div>

          {/* Tip */}
          <div className="card" style={{ padding:'1rem', background:'rgba(192,132,252,.06)' }}>
            <p style={{ fontSize:'0.75rem', color:'#64748b', lineHeight:1.6 }}>
              💡 <strong style={{ color:'#c4b5fd' }}>Tip:</strong> QR/barcode scanning requires camera access on HTTPS.
              For production, integrate <em>QuaggaJS</em> or <em>ZXing</em> in the camera component.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scanLine {
          0%  { top:0;    opacity:1; }
          100%{ top:100%; opacity:0; }
        }
        @keyframes pulse {
          0%,100%{ opacity:1; }
          50%    { opacity:0.4; }
        }
      `}</style>
    </Layout>
  );
}