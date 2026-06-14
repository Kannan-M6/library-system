/**
 * pages/Register.js - Student/Staff self-registration
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../api/client';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', student_id: '' });

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { toast.error('All fields except Student ID are required'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await authAPI.register(form);
      toast.success('Account created! Please login.');
      navigate('/login/student');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-ink-900"
      style={{ background: 'radial-gradient(ellipse at 30% 70%, #051a10 0%, #0f0d0a 70%)' }}>
      <div className="w-full max-w-md animate-fade-in">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-ink-400 hover:text-ink-200 mb-8 text-sm transition-colors group">
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to home
        </button>

        <div className="card">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-10 h-10 bg-emerald-900/40 rounded-lg flex items-center justify-center">
              <UserPlus size={18} className="text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-ink-500 font-mono">LibraryOS · New Member</p>
              <h2 className="font-display font-bold text-2xl text-ink-50">Create Account</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-ink-300 mb-1.5 font-medium">Full Name *</label>
              <input type="text" placeholder="Arjun Kumar" className="input-field focus:border-emerald-500" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-1.5 font-medium">Email Address *</label>
              <input type="email" placeholder="arjun@student.edu" className="input-field focus:border-emerald-500" value={form.email} onChange={set('email')} />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-1.5 font-medium">Password *</label>
              <input type="password" placeholder="Min. 6 characters" className="input-field focus:border-emerald-500" value={form.password} onChange={set('password')} />
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-1.5 font-medium">Role *</label>
              <select className="input-field focus:border-emerald-500" value={form.role} onChange={set('role')}>
                <option value="student">Student</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-ink-300 mb-1.5 font-medium">Student / Staff ID <span className="text-ink-500">(optional)</span></label>
              <input type="text" placeholder="STU001 or STAFF001" className="input-field focus:border-emerald-500" value={form.student_id} onChange={set('student_id')} />
              <p className="text-xs text-ink-500 mt-1">Required for QR code barcode scanning at the library counter.</p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 mt-2">
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating…</> : 'Create Account'}
            </button>
          </form>

          <p className="mt-5 text-center text-ink-500 text-sm">
            Already have an account?{' '}
            <button onClick={() => navigate('/login/student')} className="text-emerald-400 hover:underline">Sign in</button>
          </p>
        </div>
      </div>
    </div>
  );
}
