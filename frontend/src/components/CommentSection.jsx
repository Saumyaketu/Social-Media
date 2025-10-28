import React, { useState, useContext } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import API from '../api';
import Avatar from './Avatar';
import { AuthContext } from '../context/AuthContext';

dayjs.extend(relativeTime);

const CommentItem = ({ comment }) => {
  const authorName = comment.user?.name || 'Unknown User';
  return (
    <div className="flex gap-2 p-2 bg-white rounded-lg text-sm mb-2 shadow-sm border border-gray-100">
        <div className="shrink-0 pt-1">
            <Avatar name={authorName} size={32} />
        </div>
        <div className="flex-1">
            <div className="font-semibold text-gray-800">{authorName}</div>
            <p className="text-gray-700 whitespace-pre-wrap">{comment.text}</p>
            <div className="text-xs text-gray-400 mt-1">
                {dayjs(comment.createdAt).fromNow()}
            </div>
        </div>
    </div>
  );
};


export default function CommentSection({ post, refresh, isEditing }) {
  const { user } = useContext(AuthContext);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  
  const [showComments, setShowComments] = useState(false); 

  // Comment Submission
  const submitComment = async (e) => {
    e.preventDefault();
    const text = commentText.trim();
    if (!text) return;
    
    try {
      setCommentLoading(true);
      await API.post(`/posts/${post._id}/comment`, { text });
      setCommentText('');
      
      // After successfully posting a comment, show the comments and refresh the post data
      setShowComments(true); 
      if (refresh) refresh(); 
    } catch (err) {
      console.error('Comment error:', err?.response || err);
      alert(err?.response?.data?.message || 'Could not post comment');
    } finally {
      setCommentLoading(false);
    }
  };

  if (isEditing) return null;

  const commentsCount = post.comments?.length || 0;
  const toggleComments = () => setShowComments(prev => !prev);

  return (
    <div className="mt-3 border-t border-gray-200 pt-3">
        {/* Interaction Bar */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => API.post(`/posts/${post._id}/like`).then(refresh).catch(console.error)} 
                    className="btn btn-ghost text-sm px-3 py-1.5"
                >
                    Like &#128077; ({post.likes?.length || 0})
                </button>
                {/* Toggle Button: Show count when hidden, show "Hide" when visible */}
                <button 
                    onClick={toggleComments} 
                    className="btn btn-ghost text-sm px-3 py-1.5 text-gray-600 hover:text-blue-500"
                >
                    {commentsCount} {commentsCount === 1 ? 'Comment' : 'Comments'}
                    {commentsCount > 0 && (
                        <span className="ml-1 text-base">
                            {showComments ? '▲' : '▼'}
                        </span>
                    )}
                </button>
            </div>
            <div className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</div>
        </div>

        {/* Conditional Content: Show comment form and list only if showComments is true */}
        {showComments && (
            <div className="comment-details-section">
                
                {/* Comment Form */}
                <form onSubmit={submitComment} className="flex gap-2 mb-4">
                    <div className="shrink-0 pt-1">
                        <Avatar name={user?.name || 'You'} size={32} />
                    </div>
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 p-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                        disabled={commentLoading}
                        required
                    />
                    <button
                        type="submit"
                        className={`
                            bg-blue-500 text-white px-4 py-2 text-sm rounded-full font-medium transition
                            ${commentLoading || !commentText.trim() ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-600'}
                        `}
                        disabled={commentLoading || !commentText.trim()}
                    >
                        {commentLoading ? '...' : 'Post'}
                    </button>
                </form>

                {/* Existing Comments */}
                <div className="space-y-2">
                    {commentsCount === 0 ? (
                        <p className="text-center text-gray-500 text-sm py-4">No comments yet. Be the first!</p>
                    ) : (
                        post.comments.map(c => (
                            <CommentItem key={c._id} comment={c} />
                        ))
                    )}
                </div>
            </div>
        )}
    </div>
  );
}