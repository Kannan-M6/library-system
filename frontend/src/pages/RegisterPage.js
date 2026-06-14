import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NightSkyBackground from '../components/NightSkyBackground';
import { Library, ArrowLeft, Eye, EyeOff, Loader2, UserPlus } from 'lucide-react';

const DEPARTMENTS = [
  'AI & Data Science','Computer Science','Electronics','Mechanical','Civil','Electrical',
  'Information Technology','Biotechnology','Chemical',
];
const YEARS = ['1','2','3','4'];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate      = useNavigate();

  const [form, setForm] = useState({
    name:'', email:'', rollNo:'', department:'AI & Data Science', year:'3', password:'', confirm:'',
  });
  const [showPw,  setShowPw]  = useState(false);
  const [busy,    setBusy]    = useState(false);
  const [error,   setError]   = useState('');

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6)       { setError('Password must be at least 6 characters.'); return; }
    setBusy(true);
    try {
      const user = await register(form);
      navigate(user.role === 'librarian' ? '/librarian' : '/student', { replace:true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', padding:'2rem 1rem' }}>
      <NightSkyBackground />

      <div style={{ position:'relative', zIndex:10, width:'100%', maxWidth:480 }}>
        <Link to="/login" style={{
          display:'inline-flex', alignItems:'center', gap:'0.4rem',
          color:'#475569', fontSize:'0.82rem', textDecoration:'none', marginBottom:'1.25rem',
        }}
        onMouseEnter={e=>e.currentTarget.style.color='#c4b5fd'}
        onMouseLeave={e=>e.currentTarget.style.color='#475569'}
        >
          <ArrowLeft size={14}/> Back to Login
        </Link>

        <div className="card" style={{ padding:'2rem 2.25rem' }}>
          <div style={{ textAlign:'center', marginBottom:'2rem' }}>
            <div style={{
              width:52, height:52, borderRadius:14, margin:'0 auto 0.75rem',
              background:'linear-gradient(135deg,#c084fc,#818cf8)',
              display:'flex', alignItems:'center', justifyContent:'center',
            }}>
              <Library size={24} color="#fff"/>
            </div>
            <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.5rem', color:'#f1f5f9' }}>
              Create Account
            </h1>
            <p style={{ color:'#475569', fontSize:'0.85rem', marginTop:'0.25rem' }}>
              Paavai Engineering College · Student Portal
            </p>
          </div>

          {error && (
            <div style={{
              background:'rgba(239,68,68,.15)', border:'1px solid rgba(239,68,68,.35)',
              borderRadius:10, padding:'0.7rem 1rem', color:'#fca5a5',
              fontSize:'0.875rem', marginBottom:'1.25rem',
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            {/* Row 1: Name */}
            <div>
              <label className="input-label">Full Name</label>
              <input required className="input-field" placeholder="e.g. Kannan S"
                value={form.name} onChange={set('name')}/>
            </div>

            {/* Row 2: Email */}
            <div>
              <label className="input-label">College Email</label>
              <input required type="email" className="input-field" placeholder="roll@paavai.edu"
                value={form.email} onChange={set('email')}/>
            </div>

            {/* Row 3: Roll No */}
            <div>
              <label className="input-label">Roll Number</label>
              <input required className="input-field" placeholder="e.g. 21BAID001"
                value={form.rollNo} onChange={set('rollNo')}
                style={{ fontFamily:'JetBrains Mono,monospace' }}/>
            </div>

            {/* Row 4: Department + Year */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:'0.75rem' }}>
              <div>
                <label className="input-label">Department</label>
                <select required className="input-field" value={form.department} onChange={set('department')}>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="input-label">Year</label>
                <select required className="input-field" value={form.year} onChange={set('year')}
                  style={{ width:80 }}>
                  {YEARS.map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
            </div>

            {/* Row 5: Password */}
            <div>
              <label className="input-label">Password</label>
              <div style={{ position:'relative' }}>
                <input required type={showPw ? 'text' : 'password'} className="input-field"
                  placeholder="Min. 6 characters" value={form.password} onChange={set('password')}
                  style={{ paddingRight:'2.8rem' }}/>
                <button type="button" onClick={() => setShowPw(p => !p)}
                  style={{ position:'absolute', right:'0.75rem', top:'50%', transform:'translateY(-50%)',
                            background:'none', border:'none', cursor:'pointer', color:'#475569',
                            display:'flex', alignItems:'center' }}>
                  {showPw ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              </div>
            </div>

            {/* Row 6: Confirm */}
            <div>
              <label className="input-label">Confirm Password</label>
              <input required type="password" className="input-field"
                placeholder="Re-enter password" value={form.confirm} onChange={set('confirm')}/>
            </div>

            <button type="submit" disabled={busy} className="btn-primary"
              style={{ justifyContent:'center', marginTop:'0.5rem' }}>
              {busy
                ? <Loader2 size={17} style={{ animation:'spin 1s linear infinite' }}/>
                : <UserPlus size={17}/>}
              {busy ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign:'center', marginTop:'1.5rem', fontSize:'0.85rem', color:'#475569' }}>
            Already registered?{' '}
            <Link to="/login" style={{ color:'#c084fc', fontWeight:600, textDecoration:'none' }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}