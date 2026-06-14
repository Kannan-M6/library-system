import React from 'react';
import { Link } from 'react-router-dom';
import NightSkyBackground from '../components/NightSkyBackground';
import {
  BookOpen, Brain, QrCode, ClipboardEdit, MessageSquare,
  Star, ArrowRight, GraduationCap, Library,
} from 'lucide-react';

const FEATURES = [
  { icon: BookOpen,      color:'#c084fc', title:'Smart Catalog',       desc:'Browse 200+ books across 16 categories with real-time availability.' },
  { icon: Brain,         color:'#818cf8', title:'AI Recommendations',  desc:'ML-powered suggestions personalized to your reading history.' },
  { icon: QrCode,        color:'#7dd3fc', title:'QR / Barcode Scan',   desc:'Instant checkout with integrated QR and barcode scanning.' },
  { icon: ClipboardEdit, color:'#86efac', title:'Manual Entry Module', desc:'Offline fallback when scanner is down — full audit trail kept.' },
  { icon: MessageSquare, color:'#f9a8d4', title:'AI Chatbot',          desc:'Ask any library question — availability, fines, recommendations.' },
  { icon: Star,          color:'#fde68a', title:'Fine Tracker',        desc:'Auto-calculated overdue fines with transparent daily breakdown.' },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight:'100vh', position:'relative' }}>
      <NightSkyBackground />

      <div style={{ position:'relative', zIndex:10 }}>
        {/* ── Nav bar ── */}
        <header style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'1.25rem 2.5rem',
          background:'rgba(6,11,24,.65)', backdropFilter:'blur(14px)',
          borderBottom:'1px solid rgba(196,181,253,.12)',
          position:'sticky', top:0, zIndex:50,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
            <div style={{
              width:36, height:36, borderRadius:10,
              background:'linear-gradient(135deg,#c084fc,#818cf8)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Library size={18} color="#fff"/>
            </div>
            <span style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:'1.4rem', fontWeight:800,
              background:'linear-gradient(90deg,#c4b5fd,#818cf8,#7dd3fc)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>
              LibrarIQ
            </span>
          </div>

          <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
            <Link to="/login">
              <button className="btn-secondary" style={{ padding:'0.45rem 1.1rem' }}>Sign In</button>
            </Link>
            <Link to="/register">
              <button className="btn-primary" style={{ padding:'0.45rem 1.1rem' }}>Register</button>
            </Link>
          </div>
        </header>

        {/* ── Hero ── */}
        <section style={{
          textAlign:'center', padding:'6rem 2rem 5rem',
          maxWidth:800, margin:'0 auto',
        }}>
          <span style={{
            display:'inline-block', marginBottom:'1.25rem',
            padding:'0.35rem 1rem', borderRadius:20,
            background:'rgba(192,132,252,.15)', border:'1px solid rgba(192,132,252,.35)',
            fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase',
            color:'#c084fc',
          }}>
            Paavai Engineering College · AI & Data Science
          </span>

          <h1 style={{
            fontFamily:"'Playfair Display',serif",
            fontSize:'clamp(2.4rem,6vw,4rem)', fontWeight:800,
            lineHeight:1.15, marginBottom:'1.5rem',
            color:'#f1f5f9',
          }}>
            Your College Library,{' '}
            <span style={{
              background:'linear-gradient(135deg,#c4b5fd,#818cf8,#7dd3fc)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
            }}>
              Intelligently Managed
            </span>
          </h1>

          <p style={{
            fontSize:'1.1rem', color:'#64748b', lineHeight:1.7,
            maxWidth:560, margin:'0 auto 2.5rem',
          }}>
            LibrarIQ combines AI-powered recommendations, QR scanning, and a dedicated
            manual-entry module so the library never stops — even when technology does.
          </p>

          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/login">
              <button className="btn-primary" style={{ fontSize:'1rem', padding:'0.75rem 2rem' }}>
                <GraduationCap size={18}/> Student Login
              </button>
            </Link>
            <Link to="/login">
              <button className="btn-secondary" style={{ fontSize:'1rem', padding:'0.75rem 2rem' }}>
                <Library size={18}/> Librarian Login <ArrowRight size={15}/>
              </button>
            </Link>
          </div>

          {/* Demo credentials hint */}
          <div style={{
            marginTop:'2rem', padding:'0.85rem 1.5rem', borderRadius:12,
            background:'rgba(253,230,138,.08)', border:'1px dashed rgba(253,230,138,.30)',
            display:'inline-block',
          }}>
            <p style={{ fontSize:'0.8rem', color:'#fde68a', marginBottom:'0.35rem', fontWeight:700 }}>
              🔑 Demo Credentials
            </p>
            <p style={{ fontSize:'0.78rem', color:'#64748b', fontFamily:'JetBrains Mono,monospace' }}>
              Librarian: librarian@paavai.edu / lib@2024
            </p>
            <p style={{ fontSize:'0.78rem', color:'#64748b', fontFamily:'JetBrains Mono,monospace' }}>
              Student: &nbsp;&nbsp;&nbsp;kannan@paavai.edu / student@2024
            </p>
          </div>
        </section>

        {/* ── Features grid ── */}
        <section style={{
          maxWidth:1100, margin:'0 auto', padding:'0 2rem 6rem',
        }}>
          <p style={{
            textAlign:'center', fontSize:'0.72rem', fontWeight:700,
            textTransform:'uppercase', letterSpacing:'0.12em',
            color:'#c084fc', marginBottom:'0.5rem',
          }}>Core Modules</p>
          <h2 style={{
            fontFamily:"'Playfair Display',serif",
            textAlign:'center', fontSize:'clamp(1.6rem,4vw,2.2rem)',
            color:'#f1f5f9', marginBottom:'3rem',
          }}>
            Everything your library needs
          </h2>

          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',
            gap:'1.25rem',
          }}>
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card" style={{ padding:'1.5rem' }}>
                  <div style={{
                    width:44, height:44, borderRadius:12, marginBottom:'1rem',
                    background:`${f.color}1a`, border:`1px solid ${f.color}40`,
                    display:'flex', alignItems:'center', justifyContent:'center',
                  }}>
                    <Icon size={20} color={f.color}/>
                  </div>
                  <h3 style={{
                    fontFamily:"'Playfair Display',serif",
                    fontSize:'1rem', color:'#f1f5f9', marginBottom:'0.4rem',
                  }}>{f.title}</h3>
                  <p style={{ fontSize:'0.85rem', color:'#64748b', lineHeight:1.6 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{
          borderTop:'1px solid rgba(196,181,253,.10)',
          padding:'2rem 2.5rem', textAlign:'center',
          background:'rgba(6,11,24,.55)', backdropFilter:'blur(8px)',
        }}>
          <p style={{ fontSize:'0.8rem', color:'#334155' }}>
            © 2024 LibrarIQ · Paavai Engineering College · Built by JVM Masters Team (Kannan, Pavithra, Rashika, Afzal)
          </p>
        </footer>
      </div>
    </div>
  );
}