import { User } from '@supabase/supabase-js';
import { InfoIcon } from 'lucide-react';
import React from 'react'

interface HomePageProps {
    user: User;
}

export default function HomePage({ user }: HomePageProps) {
    return (
        <div className="flex-1 w-full flex flex-col gap-12 px-6 py-8 bg-white dark:bg-background">
            {/* Call to Action Section */}
            <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg shadow-md border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-4">
                    <InfoIcon size={36} className="text-blue-500 dark:text-blue-300" />
                    <div>
                        <h4 className="font-semibold text-xl text-gray-800 dark:text-white">
                            Explore Features
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400">
                            Check out the the features of this web app by navigating to the pages on the navbar.
                        </p>
                    </div>
                </div>
            </div>
            {/* Welcome Section */}
            <div className="flex flex-col gap-4 items-start">
                <h2 className="font-bold text-3xl mb-4 text-gray-900 dark:text-white">
                    Welcome back, {'User'}!
                </h2>
                <p className="text-lg text-gray-700 dark:text-gray-400">
                    We're glad to have you back. Here's a summary of your account.
                </p>
            </div>

            {/* User Info Section */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 w-full">
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                    Your Profile Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <h4 className="font-semibold text-lg text-gray-600 dark:text-gray-300">Email:</h4>
                        <p className="text-gray-700 dark:text-gray-200">{user?.email || 'Not available'}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-lg text-gray-600 dark:text-gray-300">User ID:</h4>
                        <p className="text-gray-700 dark:text-gray-200">{user?.id || 'Not available'}</p>
                    </div>
                    {/* Add more fields here if needed */}
                </div>
            </div>

        </div>
    );
}
