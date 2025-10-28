import React, { useContext, useState } from 'react';
import API from '../api';
import { AuthContext } from '../context/AuthContext';

const MAX_WORDS = 100;

export function countWords(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).filter(Boolean).length;
}

export default function PostActions({ post, refresh, isEditing, startEdit, remove }) {
  const { user } = useContext(AuthContext);

  const author = post.author || {};
  const authorId = author._id || author;
  const currentUserId = user?.id;
  const isOwner = !!(currentUserId && String(authorId) === String(currentUserId));

  if (!isOwner || isEditing) return null;

  return (
    <div className="flex items-center gap-2">
      <button onClick={startEdit} className="text-sm text-blue-500 hover:underline">Edit</button>
      <button onClick={remove} className="text-sm text-red-500 hover:underline">Delete</button>
    </div>
  );
}

export function usePostEdit(initialText, postId, refresh) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(initialText);
  const [editLoading, setEditLoading] = useState(false);

  const startEdit = () => {
    setEditText(initialText);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditText(initialText);
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

  const wordsCount = countWords(editText);
  const wordsLeft = Math.max(0, MAX_WORDS - wordsCount);
  const isSaveDisabled = editLoading || wordsCount === 0 || editText.trim() === initialText.trim();
  
  const submitEdit = async (e) => {
    e.preventDefault();
    const body = editText.trim();
    const words = countWords(body);
    if (!body || words === 0 || words > MAX_WORDS) {
        alert(words > MAX_WORDS ? `Post is too long — maximum ${MAX_WORDS} words allowed.` : 'Post text cannot be empty.');
        return;
    }

    try {
      setEditLoading(true);
      await API.put(`/posts/${postId}`, { text: body });
      setIsEditing(false);
      if (refresh) refresh(); 
    } catch (err) {
      console.error('Edit post error:', err?.response || err);
      alert(err?.response?.data?.message || 'Could not update post');
    } finally {
      setEditLoading(false);
    }
  };

  return {
    isEditing,
    editText,
    editLoading,
    wordsCount,
    wordsLeft,
    isSaveDisabled,
    startEdit,
    cancelEdit,
    handleEditChange,
    submitEdit,
  };
}