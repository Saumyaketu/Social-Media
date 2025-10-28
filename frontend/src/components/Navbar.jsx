import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/login');
  };

  return (
    <header className="bg-gray-100 border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <span className="text-lg font-semibold">Social-Media</span>
        </Link>

        <div className="flex items-center gap-3">
          <nav className="hidden sm:flex items-center gap-4">
            <Link to="/" className="text-sm text-gray-700 hover:text-linkedin">Feed</Link>
            {/* Link to the new list of all users */}
            <Link to="/users" className="text-sm text-gray-700 hover:text-linkedin">Profiles</Link>
          </nav>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to={`/profile/${user.id}`} className="text-sm text-gray-700 hidden sm:block">{user.name}</Link>
              <button
                onClick={handleLogout}
                className="btn btn-primary text-sm"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="text-sm text-gray-700">Login</Link>
              <Link to="/signup" className="btn btn-primary text-sm">Signup</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
