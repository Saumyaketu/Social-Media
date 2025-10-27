import React, { useState } from 'react';
import API from '../api';
import Avatar from './Avatar';

const MAX_WORDS = 100;

function countWords(text) {
  const trimmed = (text || '').trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export default function CreatePost({ onCreated }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const raw = e.target.value;
    const words = raw.trim() ? raw.trim().split(/\s+/) : [];
    if (words.length > MAX_WORDS) {
      const trimmed = words.slice(0, MAX_WORDS).join(' ');
      setText(trimmed);
    } else {
      setText(raw);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const body = text.trim();
    const words = countWords(body);
    if (!body || words === 0) return;
    if (words > MAX_WORDS) {
      alert(`Post is too long — maximum ${MAX_WORDS} words allowed.`);
      return;
    }
    try {
      setLoading(true);
      await API.post('/posts', { text: body });
      setText('');
      if (onCreated) onCreated();
    } catch (err) {
      console.error('Create post error:', err?.response || err);
      alert(err?.response?.data?.message || 'Could not create post');
    } finally {
      setLoading(false);
    }
  };

  const wordsCount = countWords(text);
  const wordsLeft = Math.max(0, MAX_WORDS - wordsCount);

  return (
    <div className="bg-gray-100 shadow-sm rounded-lg p-4 mb-4">
      <form onSubmit={submit} className="flex gap-3">
        
        {/* Avatar */}
        <div className="shrink-0 pt-1">
          <Avatar name="You" size={36} /> 
          <p>You</p>
        </div>

        <div className="flex-1 w-full">
          
          <textarea
            rows="3" 
            className="w-full text-base p-2 focus:outline-none resize-y min-h-[70px] border-none focus:ring-1 focus:ring-blue-300 placeholder-gray-400"
            placeholder="Share something with your network... (max 1000 words)"
            value={text}
            onChange={handleChange}
            aria-label="Create a post"
          />

          {/* Action Bar */}
          <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 gap-3">
            
            <div className="text-sm text-gray-500 hidden sm:block">
              {wordsCount} / {MAX_WORDS} words 
              <span className="ml-3 hidden lg:inline">• {wordsLeft} words left</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setText("")}
                className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
              >
                Clear
              </button>
              <button
                type="submit"
                className={`
                  bg-blue-500 text-white px-4 py-2 text-sm rounded-md font-medium hover:bg-blue-600 transition
                  ${loading || !text.trim() ? 'opacity-60 cursor-not-allowed' : ''}
                `}
                disabled={loading || !text.trim()}
                aria-disabled={loading || !text.trim()}
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}