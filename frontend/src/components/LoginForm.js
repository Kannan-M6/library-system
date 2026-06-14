/**
 * components/LoginForm.js
 * Reusable email + password form.
 * Props:
 *   onSubmit(email, password) — called on submit
 *   loading   — shows spinner on button
 *   defaultEmail — pre-fills the email field
 */
import React, { useState } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginForm({ onSubmit, loading = false, defaultEmail = '' }) {
  const [email,    setEmail]    = useState(defaultEmail);
  const [password, setPassword] = useState('');
  const [showPw,   setShowPw]   = useState(false);

  // Sync defaultEmail when tab switches (parent changes the prop)
  React.useEffect(() => { setEmail(defaultEmail); }, [defaultEmail]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Please fill in both fields.');
      return;
    }
    if (onSubmit) {
      try {
        await onSubmit({ email: email.trim(), password });
      } catch (err) {
        toast.error(err?.response?.data?.error || 'Login failed. Check your credentials.');
      }
    }
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(15,23,42,0.65)',
    border: '1px solid rgba(196,181,253,0.22)',
    color: '#f1f5f9',
    borderRadius: 10,
    padding: '0.65rem 1rem',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const onFocus  = e => { e.target.style.borderColor = 'rgba(192,132,252,0.55)'; e.target.style.boxShadow = '0 0 0 3px rgba(192,132,252,0.12)'; };
  const onBlur   = e => { e.target.style.borderColor = 'rgba(196,181,253,0.22)'; e.target.style.boxShadow = 'none'; };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Email */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{
          display: 'block', fontSize: '0.75rem', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          color: '#64748b', marginBottom: '0.4rem',
        }}>
          Email Address
        </label>
        <input
          type="email"
          placeholder="you@college.edu"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          autoComplete="email"
          style={inputStyle}
          disabled={loading}
        />
      </div>

      {/* Password */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{
          display: 'block', fontSize: '0.75rem', fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '0.06em',
          color: '#64748b', marginBottom: '0.4rem',
        }}>
          Password
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPw ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            autoComplete="current-password"
            style={{ ...inputStyle, paddingRight: '3rem' }}
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowPw(p => !p)}
            style={{
              position: 'absolute', right: '0.9rem', top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#475569', display: 'flex', alignItems: 'center',
            }}
            tabIndex={-1}
          >
            {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
          padding: '0.75rem',
          background: loading ? 'rgba(192,132,252,0.5)' : 'linear-gradient(135deg,#c084fc,#818cf8)',
          color: '#fff',
          fontWeight: 700, fontSize: '0.9rem',
          border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          boxShadow: loading ? 'none' : '0 4px 14px rgba(192,132,252,0.30)',
        }}
      >
        {loading
          ? <><Loader2 size={16} style={{ animation:'spin 0.8s linear infinite' }}/> Signing in…</>
          : 'Sign In'
        }
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </button>
    </form>
  );
}
