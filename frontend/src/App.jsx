import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import { AuthContext } from './context/AuthContext';

export default function App() {
  const { user } = useContext(AuthContext);
  const NAV_HEIGHT_CLASS = 'pt-16';
  return (
    <div>
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <main className={`container mx-auto px-4 ${NAV_HEIGHT_CLASS}`}>
        <Routes>
          <Route path="/" element={user ? <Feed /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile/:id" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
