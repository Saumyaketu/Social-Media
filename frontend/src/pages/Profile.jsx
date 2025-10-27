import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import Post from '../components/Post'; 
import ProfileCard from '../components/ProfileCard'; 

export default function Profile() {
  const { id } = useParams();
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch posts and set user details from the first post found
        const { data: allPosts } = await API.get('/posts');
        
        const userPosts = allPosts.filter(p => {
          const authorId = p.author && (p.author._id || p.author);
          return String(authorId) === String(id);
        });

        setPosts(userPosts);
        if (userPosts.length > 0) {
            setUser(userPosts[0].author);
        } else {
            setUser({ name: 'User Profile', id });
        }
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Could not load posts or profile data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [id]);

  if (loading) {
    return <div className="container mx-auto max-w-3xl mt-20"><div className="bg-white shadow-sm rounded-lg text-center py-10 text-gray-500"><p className="font-medium">Loading profile...</p><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mt-4"></div></div></div>;
  }
  
  const profileName = user?.name || 'Unknown User';
  const Card = ({ children, className = '', padding = 'p-5' }) => (<div className={`bg-white shadow-sm rounded-lg ${padding} ${className}`}>{children}</div>);

  return (
    <div className="container mx-auto mt-8 max-w-3xl">

      <ProfileCard user={user} postsCount={posts.length} />

      <h3 className="text-xl font-semibold text-gray-800 mb-4 ml-2">
        {posts.length > 0 ? `${profileName.split(' ')[0]}'s Posts` : 'No Posts Yet'}
      </h3>
      
      <div className="space-y-4">
        {error && (<Card className="bg-red-50 text-red-700">Error: {error}</Card>)}
        
        {posts.length === 0 && !error ? (
          <Card className="text-center py-6 text-gray-500">
            {profileName} hasn't shared anything.
          </Card>
        ) : (
          posts.map(p => (<Post key={p._id} post={p} />)) 
        )}
      </div>
    </div>
  );
}