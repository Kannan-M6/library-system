import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

import LandingPage      from './pages/LandingPage';
import LoginPage        from './pages/LoginPage';
import RegisterPage     from './pages/RegisterPage';
import LibrarianDashboard from './pages/LibrarianDashboard';
import StudentDashboard from './pages/StudentDashboard';
import BooksPage        from './pages/BooksPage';
import TransactionsPage from './pages/TransactionsPage';
import ChatbotPage      from './pages/ChatbotPage';
import CameraPage       from './pages/CameraPage';
import ManualEntryPage    from './pages/ManualEntryPage';
import EBooksPage         from './pages/EBooksPage';
import TeacherDashboard   from './pages/TeacherDashboard';
import TeacherBooksPage   from './pages/TeacherBooksPage';
import TeacherLoansPage   from './pages/TeacherLoansPage';
import TeacherRequestPage from './pages/TeacherRequestPage';
import DemandPredictionPage from './pages/DemandPredictionPage';

function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(160deg,#1a0e05,#0f0d0a)' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{
          width:44, height:44, borderRadius:'50%', margin:'0 auto 1rem',
          border:'3px solid rgba(192,132,252,0.25)',
          borderTopColor:'#c084fc',
          animation:'spin 0.8s linear infinite',
        }}/>
        <p style={{ color:'#64748b', fontFamily:'Poppins,sans-serif', fontSize:'0.875rem' }}>Loading…</p>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    const home = user.role === 'librarian' ? '/librarian'
               : user.role === 'teacher'   ? '/teacher'
               : '/student';
    return <Navigate to={home} replace />;
  }
  return children;
}

function AppRoutes() {
  const { user } = useAuth();
  const homeRoute = user?.role === 'librarian' ? '/librarian'
                  : user?.role === 'teacher'   ? '/teacher'
                  : '/student';
  return (
    <Routes>
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={user ? <Navigate to={homeRoute} /> : <LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Librarian routes */}
      <Route path="/librarian" element={<PrivateRoute role="librarian"><LibrarianDashboard /></PrivateRoute>} />
      <Route path="/librarian/books" element={<PrivateRoute role="librarian"><BooksPage /></PrivateRoute>} />
      <Route path="/librarian/transactions" element={<PrivateRoute role="librarian"><TransactionsPage /></PrivateRoute>} />
      <Route path="/librarian/camera" element={<PrivateRoute role="librarian"><CameraPage /></PrivateRoute>} />
      <Route path="/librarian/manual-entry" element={<PrivateRoute role="librarian"><ManualEntryPage /></PrivateRoute>} />
      <Route path="/librarian/chatbot" element={<PrivateRoute role="librarian"><ChatbotPage /></PrivateRoute>} />
      <Route path="/librarian/demand" element={<PrivateRoute role="librarian"><DemandPredictionPage /></PrivateRoute>} />

      {/* Student routes */}
      <Route path="/student" element={<PrivateRoute><StudentDashboard /></PrivateRoute>} />
      <Route path="/student/books" element={<PrivateRoute><BooksPage /></PrivateRoute>} />
      <Route path="/student/ebooks" element={<PrivateRoute><EBooksPage /></PrivateRoute>} />
      <Route path="/student/chatbot" element={<PrivateRoute><ChatbotPage /></PrivateRoute>} />

      {/* Teacher / Staff routes */}
      <Route path="/teacher"         element={<PrivateRoute role="teacher"><TeacherDashboard /></PrivateRoute>} />
      <Route path="/teacher/books"   element={<PrivateRoute role="teacher"><TeacherBooksPage /></PrivateRoute>} />
      <Route path="/teacher/ebooks"  element={<PrivateRoute role="teacher"><EBooksPage /></PrivateRoute>} />
      <Route path="/teacher/loans"   element={<PrivateRoute role="teacher"><TeacherLoansPage /></PrivateRoute>} />
      <Route path="/teacher/request" element={<PrivateRoute role="teacher"><TeacherRequestPage /></PrivateRoute>} />
      <Route path="/teacher/chatbot" element={<PrivateRoute role="teacher"><ChatbotPage /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#2a2520', color: '#e5e3dc', border: '1px solid #4b453a' },
            success: { iconTheme: { primary: '#d4821e', secondary: '#fdf8f0' } },
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}
