import React, { useState, useContext } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      login({ token: data.token, user: data.user });
      nav('/');
    } catch (err) {
      console.error('Login error:', err);
      alert(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-sm mt-20"> 
      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100"> 
        
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Sign In
        </h1>
        
        <form onSubmit={submit} className="space-y-4">
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-600 "
            placeholder="Email Address" 
            type="email"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required
          />
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-gray-600"
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required
          />
          <div className="flex justify-between items-center pt-2">
            <button 
              type="submit"
              className={`
                bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow-md 
                hover:bg-blue-700 transition duration-150
                ${loading || !email || !password ? 'opacity-60 cursor-not-allowed' : ''}
              `}
              disabled={loading || !email || !password}
            >
              {loading ? 'Logging In...' : 'Login'}
            </button>
            
            <Link to="/signup" className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition duration-150">
              Need an account? Sign Up
            </Link>
          </div>
        </form>
        
      </div>
    </div>
  );
}