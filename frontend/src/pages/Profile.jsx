import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, logout } = useAuth();

  if (!user) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-32"></div>
        <div className="px-8 pb-8 relative">
          <div className="relative -mt-12 mb-6">
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 overflow-hidden shadow-md">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/personas/svg?seed=${user.username}`}
                alt={user.username}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{user.username}</h1>
            <p className="text-indigo-600 dark:text-indigo-400 font-medium">{user.email}</p>
            {user.role && (
              <span className="inline-block mt-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
                {user.role}
              </span>
            )}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
            <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
              "Finding peace in the chaos."   {/* Dummy bio */}
            </p>

            <button
              onClick={logout}
              className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-2.5 rounded-lg font-medium transition-colors border border-red-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
