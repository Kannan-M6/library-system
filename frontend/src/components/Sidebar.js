import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, BookOpen, ArrowLeftRight,
  Camera, MessageCircle, LogOut, Menu, X,
  BookMarked, ClipboardEdit, BookText, BookUser,
  PlusSquare, History, TrendingUp,
} from 'lucide-react';

const librarianNav = [
  { to: '/librarian',              label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/librarian/books',        label: 'Books Catalog', icon: BookOpen },
  { to: '/librarian/transactions', label: 'Transactions',  icon: ArrowLeftRight },
  { to: '/librarian/camera',       label: 'Scan & Issue',  icon: Camera },
  { to: '/librarian/manual-entry', label: 'Manual Entry',  icon: ClipboardEdit, highlight: true },
  { to: '/librarian/demand',       label: 'Demand Predict', icon: TrendingUp },
  { to: '/librarian/chatbot',      label: 'AI Assistant',  icon: MessageCircle },
];

const studentNav = [
  { to: '/student',         label: 'My Dashboard', icon: LayoutDashboard },
  { to: '/student/books',   label: 'Browse Books', icon: BookOpen },
  { to: '/student/ebooks',  label: 'E-Books',      icon: BookText, highlight: true },
  { to: '/student/chatbot', label: 'AI Assistant', icon: MessageCircle },
];

const teacherNav = [
  { to: '/teacher',          label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/teacher/books',    label: 'Browse Books',   icon: BookOpen },
  { to: '/teacher/ebooks',   label: 'E-Books',        icon: BookText },
  { to: '/teacher/loans',    label: 'My Loans',       icon: History },
  { to: '/teacher/request',  label: 'Request a Book', icon: PlusSquare, highlight: true },
  { to: '/teacher/chatbot',  label: 'AI Assistant',   icon: MessageCircle },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const nav = user?.role === 'librarian' ? librarianNav
            : user?.role === 'teacher'   ? teacherNav
            : studentNav;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sidebarStyles = {
    sidebar: {
      position: 'fixed',
      top: 0, left: 0,
      height: '100%',
      width: 240,
      background: 'rgba(6,11,24,0.97)',
      borderRight: '1px solid rgba(196,181,253,0.12)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      backdropFilter: 'blur(16px)',
    },
    logo: {
      padding: '1.25rem 1.25rem 1rem',
      borderBottom: '1px solid rgba(196,181,253,0.10)',
    },
    logoInner: {
      display: 'flex', alignItems: 'center', gap: '0.75rem',
    },
    logoIcon: {
      width: 36, height: 36, borderRadius: 10,
      background: 'linear-gradient(135deg,#c084fc,#818cf8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    },
    userBox: {
      margin: '0.75rem 1rem',
      padding: '0.75rem',
      borderRadius: 12,
      background: 'rgba(196,181,253,0.06)',
      border: '1px solid rgba(196,181,253,0.12)',
      display: 'flex', alignItems: 'center', gap: '0.6rem',
    },
    avatar: {
      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
      background: 'linear-gradient(135deg,#c084fc,#818cf8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '0.875rem', fontWeight: 700, color: '#fff',
    },
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed', top: 16, left: 16, zIndex: 60,
          display: 'none', // hidden on desktop; shown via CSS below
          padding: '0.5rem',
          background: 'rgba(15,23,42,0.9)',
          border: '1px solid rgba(196,181,253,0.20)',
          borderRadius: 8, cursor: 'pointer',
        }}
        className="mobile-menu-btn"
        aria-label="Open menu"
      >
        <Menu size={20} color="#94a3b8"/>
      </button>

      {/* Overlay */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)', zIndex: 40,
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        ...sidebarStyles.sidebar,
        transform: open ? 'translateX(0)' : undefined,
      }}>
        {/* Logo */}
        <div style={sidebarStyles.logo}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div style={sidebarStyles.logoInner}>
              <div style={sidebarStyles.logoIcon}>
                <BookMarked size={18} color="#fff"/>
              </div>
              <div>
                <p style={{
                  fontFamily:"'Playfair Display',serif",
                  fontWeight:700, fontSize:'1rem',
                  color:'#c4b5fd', lineHeight:1.1,
                }}>
                  LibraryOS
                </p>
                <p style={{ fontSize:'0.68rem', color:'#475569', marginTop:2 }}>
                  Smart Library System
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background:'none', border:'none', cursor:'pointer', color:'#475569' }}
              className="sidebar-close-btn"
            >
              <X size={18}/>
            </button>
          </div>
        </div>

        {/* User info */}
        <div style={{ padding:'0 0.75rem 0.25rem' }}>
          <div style={sidebarStyles.userBox}>
            <div style={sidebarStyles.avatar}>
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div style={{ overflow:'hidden', flex:1 }}>
              <p style={{ fontSize:'0.82rem', fontWeight:600, color:'#f1f5f9',
                          overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {user?.name || 'Guest'}
              </p>
              <p style={{ fontSize:'0.7rem', color:'#c084fc', textTransform:'capitalize' }}>
                {user?.role || 'user'}
              </p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex:1, padding:'0.5rem 0.75rem', overflowY:'auto' }}>
          {nav.map(({ to, label, icon: Icon, highlight }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/librarian' || to === '/student'}
              onClick={() => setOpen(false)}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.6rem 0.9rem',
                borderRadius: 10,
                marginBottom: '0.2rem',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: isActive ? 700 : 500,
                color: isActive
                  ? '#c4b5fd'
                  : highlight
                    ? '#7dd3fc'
                    : '#64748b',
                background: isActive
                  ? 'rgba(192,132,252,0.14)'
                  : highlight
                    ? 'rgba(125,211,252,0.06)'
                    : 'transparent',
                border: isActive
                  ? '1px solid rgba(192,132,252,0.30)'
                  : highlight
                    ? '1px dashed rgba(125,211,252,0.25)'
                    : '1px solid transparent',
                transition: 'all 0.2s ease',
              })}
            >
              <Icon size={16}/>
              <span style={{ flex:1 }}>{label}</span>
              {highlight && (
                <span style={{
                  fontSize: '0.58rem', fontWeight: 800,
                  padding: '1px 6px', borderRadius: 4,
                  background: 'rgba(125,211,252,0.18)',
                  color: '#7dd3fc', letterSpacing: '0.04em',
                }}>
                  KEY
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding:'0.75rem', borderTop:'1px solid rgba(196,181,253,0.10)' }}>
          <button
            onClick={handleLogout}
            style={{
              display:'flex', alignItems:'center', gap:'0.65rem',
              padding:'0.6rem 0.9rem', width:'100%',
              background:'none', border:'1px solid transparent', borderRadius:10,
              cursor:'pointer', fontSize:'0.875rem', fontWeight:500,
              color:'#64748b', transition:'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#fca5a5';
              e.currentTarget.style.background = 'rgba(239,68,68,0.10)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#64748b';
              e.currentTarget.style.background = 'none';
              e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            <LogOut size={16}/>
            Sign Out
          </button>
        </div>
      </aside>

      <style>{`
        @media (max-width: 767px) {
          .mobile-menu-btn { display: flex !important; }
          .sidebar-close-btn { display: flex !important; }
          aside { transform: ${open ? 'translateX(0)' : 'translateX(-100%)'}; transition: transform 0.3s ease; }
        }
        @media (min-width: 768px) {
          .mobile-menu-btn { display: none !important; }
          .sidebar-close-btn { display: none !important; }
        }
      `}</style>
    </>
  );
}
