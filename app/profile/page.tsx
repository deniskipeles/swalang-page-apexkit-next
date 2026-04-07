import { redirect } from 'next/navigation';
import { getApexServer } from '@/lib/apexkit';
import type { User } from '@apexkit/sdk';

export default async function ProfilePage() {
  const apex = await getApexServer();
  let user: User | null = null;

  try {
    user = await apex.auth.getMe();
  } catch (e) {
    // Token is missing or invalid
  }

  if (!user) {
    return redirect('/auth/login');
  }
  
  // Format dates for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ApexKit stores OAuth provider details inside the metadata JSON block
  const provider = user.metadata?.provider || 'Email';

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto">
        
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold leading-6 text-gray-900 dark:text-white">
                User Profile
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                Personal details and account information.
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-swa-green/20 flex items-center justify-center text-swa-green font-bold text-xl">
              {user.email?.[0].toUpperCase() || 'U'}
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-700">
            <dl>
              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2">
                  {user.email}
                </dd>
              </div>
              
              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-gray-100 dark:border-gray-700">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  User ID
                </dt>
                <dd className="mt-1 text-sm font-mono text-gray-600 dark:text-gray-300 sm:mt-0 sm:col-span-2 break-all">
                  {user.id}
                </dd>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800/50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-gray-100 dark:border-gray-700">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Role
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 capitalize">
                  {user.role}
                </dd>
              </div>

              <div className="bg-white dark:bg-gray-800 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 border-t border-gray-100 dark:border-gray-700">
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Authentication Provider
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-white sm:mt-0 sm:col-span-2 capitalize">
                  {provider}
                </dd>
              </div>

            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}