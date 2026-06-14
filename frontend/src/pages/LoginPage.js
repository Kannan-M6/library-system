import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NightSkyBackground from '../components/NightSkyBackground';
import LoginForm from '../components/LoginForm';
import { Library, GraduationCap, ArrowLeft, BookUser } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('student');   // 'student' | 'librarian'
  const [busy, setBusy] = useState(false);

  const handleLogin = async ({ email, password }) => {
    setBusy(true);
    try {
      const user = await login({ email, password });
      const dest = user.role === 'librarian' ? '/librarian'
                 : user.role === 'teacher'   ? '/teacher'
                 : '/student';
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Login failed. Check your credentials.');
    } finally {
      setBusy(false);
    }
  };

  const TABS = [
    { id: 'student',   label: 'Student',  icon: GraduationCap, email: 'kannan@paavai.edu',    hint: 'student@2024' },
    { id: 'teacher',   label: 'Staff',    icon: BookUser,      email: 'suresh@paavai.edu',    hint: 'staff@2024'   },
    { id: 'librarian', label: 'Librarian',icon: Library,       email: 'librarian@paavai.edu', hint: 'lib@2024'     },
  ];

  const active = TABS.find(t => t.id === tab);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <NightSkyBackground />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 440, margin: '1rem', padding: '1rem 0' }}>
        {/* Back link */}
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          color: '#475569', fontSize: '0.82rem', textDecoration: 'none',
          marginBottom: '1.5rem',
          transition: 'color .2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#c4b5fd'}
          onMouseLeave={e => e.currentTarget.style.color = '#475569'}
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>

        {/* Card */}
        <div className="card" style={{ padding: '2rem 2.25rem' }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14, margin: '0 auto 0.75rem',
              background: 'linear-gradient(135deg,#c084fc,#818cf8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Library size={24} color="#fff" />
            </div>
            <h1 style={{
              fontFamily: "'Playfair Display',serif", fontSize: '1.6rem', color: '#f1f5f9',
            }}>
              Welcome back
            </h1>
            <p style={{ color: '#475569', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              Sign in to LibrarIQ
            </p>
          </div>

          {/* Role tabs */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            background: 'rgba(15,23,42,.65)', borderRadius: 10, padding: '4px',
            marginBottom: '1.75rem', gap: 4,
          }}>
            {TABS.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem',
                    padding: '0.55rem', borderRadius: 8, border: 'none', cursor: 'pointer',
                    fontSize: '0.875rem', fontWeight: tab === t.id ? 700 : 500,
                    background: tab === t.id
                      ? 'linear-gradient(135deg,rgba(192,132,252,.30),rgba(129,140,248,.20))'
                      : 'none',
                    color: tab === t.id ? '#c4b5fd' : '#475569',
                    border: tab === t.id ? '1px solid rgba(192,132,252,.35)' : '1px solid transparent',
                    transition: 'all .2s',
                  }}
                >
                  <Icon size={15} /> {t.label}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <LoginForm
            key={tab}
            onSubmit={handleLogin}
            loading={busy}
            defaultEmail={active.email}
          />

          {/* Hint */}
          <div style={{
            marginTop: '1.25rem', padding: '0.7rem 0.9rem', borderRadius: 10,
            background: 'rgba(253,230,138,.07)', border: '1px dashed rgba(253,230,138,.25)',
          }}>
            <p style={{ fontSize: '0.73rem', color: '#64748b', fontFamily: 'JetBrains Mono,monospace' }}>
              Demo pw: <strong style={{ color: '#fde68a' }}>{active.hint}</strong>
            </p>
          </div>

          {/* Register link */}
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#475569' }}>
            New student?{' '}
            <Link to="/register" style={{ color: '#c084fc', fontWeight: 600, textDecoration: 'none' }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}