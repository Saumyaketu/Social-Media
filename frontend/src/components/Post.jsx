import React, { useContext } from 'react';
import API from '../api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { AuthContext } from '../context/AuthContext';
import Avatar from './Avatar';

dayjs.extend(relativeTime);

export default function Post({ post, refresh }) {
  const { user } = useContext(AuthContext);

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

  const author = post.author || {};
  const authorId = author._id || author;
  const currentUserId = user?.id;
  const isOwner = !!(currentUserId && String(authorId) === String(currentUserId));

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

            {isOwner && (
              <div className="flex items-center gap-2">
                <button onClick={remove} className="text-sm text-red-500 hover:underline">Delete</button>
              </div>
            )}
          </div>

          <div className="mt-3 post-bubble">
            <p className="text-gray-800 whitespace-pre-wrap">{post.text}</p>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={like} className="btn btn-ghost text-sm px-3 py-1.5">
                Like &#128077; ({post.likes?.length || 0})
              </button>
              <button className="btn btn-ghost text-sm px-3 py-1.5">Comment</button>
            </div>

            <div className="text-xs text-gray-400">{new Date(post.createdAt).toLocaleString()}</div>
          </div>
        </div>
      </div>
    </article>
  );
}
