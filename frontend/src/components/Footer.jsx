import React from 'react';

export default function Footer() { 
    return (
        <footer className="bg-gray-100 border-t mt-8">
            <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-600">
                &copy; {new Date().getFullYear()} Social-Media. All rights reserved.
            </div>
        </footer>
    );
}