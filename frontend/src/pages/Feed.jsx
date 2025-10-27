import React, { useEffect, useState, useContext } from 'react';
import API from '../api';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import { AuthContext } from '../context/AuthContext';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/posts');
      setPosts(data);
    } catch (err) {
      console.error('fetchPosts error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div className="container mx-auto px-4 mt-6 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* main column */}
        <div className="lg:col-span-2 space-y-4">
          {user && <CreatePost onCreated={fetchPosts} />}

          {loading ? (
            <div className="card text-center text-gray-500">Loading posts...</div>
          ) : posts.length ? (
            posts.map(p => <Post key={p._id} post={p} refresh={fetchPosts} />)
          ) : (
            <div className="card text-center text-gray-500">
              No posts yet — be the first to share something!
            </div>
          )}
        </div>

        {/* right sidebar */}
        <aside className="hidden lg:block">
          <div className="card mb-4">
            <h3 className="text-lg font-semibold mb-2">Who to follow</h3>
            <p className="text-sm text-gray-500">Suggestions will appear here.</p>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-2">About</h3>
            <p className="text-sm text-gray-500">A simple LinkedIn-like feed built with React, Express & MongoDB.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
  