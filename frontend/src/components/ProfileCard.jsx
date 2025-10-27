import React from 'react';
import Avatar from './Avatar';

const getFirstName = (name) => name ? name.split(' ')[0] : 'User';

const Card = ({ children, className = '', padding = 'p-5' }) => (
    <div className={`bg-white shadow-sm rounded-lg ${padding} ${className}`}>{children}</div>
);

export default function ProfileCard({ user, postsCount }) {
    const profileName = user?.name || 'Unknown User';
    const profileBio = `Posts and activity shared by ${getFirstName(profileName)}.`;

    return (
        <Card className="text-center relative overflow-hidden mb-8 p-0">
            
            {/* Cover Photo Placeholder */}
            <div className="h-28 bg-linear-to-r from-blue-500 to-indigo-600"></div>

            <div className="p-6 pt-0">
                {/* Avatar */}
                <div className="relative -mt-12 mb-4 mx-auto w-fit">
                    <Avatar name={profileName} size={100} className="border-4 border-white shadow-md" />
                </div>

                <h2 className="text-3xl font-bold text-gray-900">{profileName}</h2>
                <p className="text-md text-gray-500 mt-1">{profileBio}</p>
                
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-center space-x-8">
                    <div className="text-center">
                        <div className="text-xl font-bold text-blue-600">{postsCount}</div>
                        <div className="text-sm text-gray-500">Total Posts</div>
                    </div>
                </div>
            </div>
        </Card>
    );
}