import React from 'react';
import Sidebar from './Sidebar';

export default function Layout({ children }) {
  return (
    <div style={{ display:'flex', minHeight:'100vh' }}>
      <Sidebar />
      {/* Push content right of the 240px fixed sidebar */}
      <main style={{
        flex: 1,
        marginLeft: 240,
        overflowY: 'auto',
        minHeight: '100vh',
      }}>
        <div style={{ padding:'2rem 2.5rem', animation:'fadeInUp 0.35s ease-out' }}>
          {children}
        </div>
      </main>
      <style>{`
        @media (max-width: 767px) {
          main { margin-left: 0 !important; }
        }
      `}</style>
    </div>
  );
}
