import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import Avatar from '../components/Avatar';

const Card = ({ children, className = '', padding = 'p-5' }) => (
    <div className={`bg-white shadow-sm rounded-lg ${padding} ${className}`}>{children}</div>
);

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await API.get('/users');
        setUsers(data);
      } catch (err) {
        console.error("Fetch users error:", err);
        setError("Could not load the list of users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) {
    return (
        <div className="container mx-auto max-w-3xl mt-8">
            <Card className="text-center py-10 text-gray-500">
                <p className="font-medium">Loading users...</p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mt-4"></div>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto mt-8 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profiles</h1>
      
      {error && (<Card className="bg-red-50 text-red-700 mb-4">Error: {error}</Card>)}
      
      <div className="space-y-4">
        {users.length === 0 ? (
          <Card className="text-center py-6 text-gray-500">
            No users registered yet.
          </Card>
        ) : (
          users.map(u => (
            <Link 
              key={u._id} 
              to={`/profile/${u._id}`} 
              className="flex items-center gap-4 bg-white shadow-sm rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <Avatar name={u.name} size={48} />
              <div>
                <div className="font-semibold text-gray-900">{u.name}</div>
                <div className="text-sm text-gray-500">{u.email}</div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}