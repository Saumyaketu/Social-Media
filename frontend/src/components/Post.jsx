import React, { useContext, useState } from 'react';
import API from '../api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AuthContext } from '../context/AuthContext';
import Avatar from './Avatar';

dayjs.extend(relativeTime);

const MAX_WORDS = 100;

function countWords(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export default function Post({ post, refresh }) {
  const { user } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(post.text);
  const [editLoading, setEditLoading] = useState(false);


  const like = async () => {
    try {
      await API.post(`/posts/${post._id}/like`);
      if (refresh) refresh();
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const remove = async () => {
    if (!confirm('Delete this post?')) return;
    try {
      await API.delete(`/posts/${post._id}`);
      if (refresh) refresh();
    } catch (err) {
      console.error('Delete error:', err);
      alert('Could not delete post.');
    }
  };

  // Functions for editing
  const startEdit = () => {
    setEditText(post.text);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditText(post.text);
  };

  const handleEditChange = (e) => {
    const raw = e.target.value;
    const words = raw.trim() ? raw.trim().split(/\s+/) : [];
    if (words.length > MAX_WORDS) {
      const trimmed = words.slice(0, MAX_WORDS).join(' ');
      setEditText(trimmed);
    } else {
      setEditText(raw);
    }
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    const body = editText.trim();
    const words = countWords(body);
    if (!body || words === 0) return;
    if (words > MAX_WORDS) {
      alert(`Post is too long — maximum ${MAX_WORDS} words allowed.`);
      return;
    }
    if (body === post.text) {
      setIsEditing(false);
      return;
    }

    try {
      setEditLoading(true);
      await API.put(`/posts/${post._id}`, { text: body });
      setIsEditing(false);
      if (refresh) refresh(); 
    } catch (err) {
      console.error('Edit post error:', err?.response || err);
      alert(err?.response?.data?.message || 'Could not update post');
    } finally {
      setEditLoading(false);
    }
  };

  const author = post.author || {};
  const authorId = author._id || author;
  const currentUserId = user?.id;
  const isOwner = !!(currentUserId && String(authorId) === String(currentUserId));
  
  const wordsCount = countWords(editText);
  const wordsLeft = Math.max(0, MAX_WORDS - wordsCount);
  const isSaveDisabled = editLoading || wordsCount === 0 || editText.trim() === post.text.trim();

  return (
    <article className="post-card-outer mb-4">
      <div className="flex gap-4">
        <div className="shrink-0">
          <Avatar name={author.name || 'Unknown'} size={48} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-gray-900">{author.name || 'Unknown'}</div>
              <div className="text-xs text-gray-500">{post.createdAt ? dayjs(post.createdAt).fromNow() : ''}</div>
            </div>

            {isOwner && !isEditing && ( 
              <div className="flex items-center gap-2">
                <button onClick={startEdit} className="text-sm text-blue-500 hover:underline">Edit</button>
                <button onClick={remove} className="text-sm text-red-500 hover:underline">Delete</button>
              </div>
            )}
          </div>

          <div className="mt-3 post-bubble">
            {isEditing ? (
                <form onSubmit={submitEdit} className="space-y-3">
                    <textarea
                        rows="4" 
                        className="w-full text-base p-2 focus:outline-none resize-y min-h-[70px] border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-300 placeholder-gray-400"
                        value={editText}
                        onChange={handleEditChange}
                        aria-label="Edit post text"
                    />
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            {wordsCount} / {MAX_WORDS} words 
                            <span className="ml-2">• {wordsLeft} words left</span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={cancelEdit}
                                className="px-3 py-1 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                                disabled={editLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={`
                                    bg-blue-500 text-white px-3 py-1 text-xs rounded-md font-medium transition
                                    ${isSaveDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-600'}
                                `}
                                disabled={isSaveDisabled}
                            >
                                {editLoading ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <p className="text-gray-800 whitespace-pre-wrap">{post.text}</p>
            )}
          </div>

          {!isEditing && (
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={like} className="btn btn-ghost text-sm px-3 py-1.5">
                  Like &#128077; ({post.likes?.length || 0})
                </button>
                <button className="btn btn-ghost text-sm px-3 py-1.5">Comment</button>
              </div>
              <div className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</div>
            </div>
          )}

        </div>
      </div>
    </article>
  );
}
