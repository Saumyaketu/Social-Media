import React from 'react';
import { countWords } from './PostActions'; 

const MAX_WORDS = 100;

export default function PostContent({ 
    post, 
    isEditing, 
    editText, 
    editLoading, 
    isSaveDisabled, 
    wordsCount, 
    wordsLeft,
    handleEditChange, 
    submitEdit, 
    cancelEdit 
}) {
  return (
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
  );
}