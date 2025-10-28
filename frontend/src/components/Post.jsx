import React, { useContext } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import API from '../api';
import { AuthContext } from '../context/AuthContext';
import Avatar from './Avatar';
import PostActions, { usePostEdit } from './PostActions';
import PostContent from './PostContent';
import CommentSection from './CommentSection';

dayjs.extend(relativeTime);

export default function Post({ post, refresh }) {
  const { user } = useContext(AuthContext);

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
  
  const {
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
  } = usePostEdit(post.text, post._id, refresh);

  const author = post.author || {};

  return (
    <article className="post-card-outer bg-white rounded-lg text-sm p-3 shadow-sm border border-gray-100 mb-4">
      <div className="flex gap-4">
        <div className="shrink-0">
          <Avatar name={author.name || 'Unknown'} size={48} />
        </div>

        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="font-semibold text-gray-900">{author.name || 'Unknown'}</div>
              <div className="text-xs text-gray-500">{post.createdAt ? dayjs(post.createdAt).fromNow() : ''}</div>
            </div>

            {/* Owner Actions (Edit/Delete) */}
            <PostActions 
                post={post} 
                refresh={refresh} 
                isEditing={isEditing} 
                startEdit={startEdit} 
                remove={remove} 
            />
          </div>

          {/* Post Content & Editor */}
          <PostContent
            post={post}
            isEditing={isEditing}
            editText={editText}
            editLoading={editLoading}
            isSaveDisabled={isSaveDisabled}
            wordsCount={wordsCount}
            wordsLeft={wordsLeft}
            handleEditChange={handleEditChange}
            submitEdit={submitEdit}
            cancelEdit={cancelEdit}
          />
          
          {/* Comment & Like Section */}
          <CommentSection 
            post={post}
            refresh={refresh}
            isEditing={isEditing}
          />

        </div>
      </div>
    </article>
  );
}