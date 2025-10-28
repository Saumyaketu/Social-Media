import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Users from './pages/Users';
import Navbar from './components/Navbar';
import { AuthContext } from './context/AuthContext';
import Footer from './components/Footer';

export default function App() {
  const { user } = useContext(AuthContext);
  
  return (
    <div className="flex flex-col min-h-screen">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <main className="container mx-auto px-4 grow mt-16">
        <Routes>
          <Route path="/" element={user ? <Feed /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/users" element={user ? <Users /> : <Navigate to="/login" />} />
          <Route path="/profile/:id" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      
      <Footer/>
    </div>
  );
}
