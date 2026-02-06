import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { api } from '../utils/api';
import { Link } from 'react-router-dom';

export default function GroupsList() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const { user } = useAuth(); // Using user instead of token

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = () => {
    // USING DUMMY DATA API
    api.groups.getAll()
      .then(data => setGroups(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const requestToJoin = async (groupId) => {
    setJoining(groupId);
    try {
      // USING DUMMY DATA API
      const data = await api.groups.join(groupId);
      toast.success(data.message);
    } catch {
      toast.error('Failed to join');
    } finally {
      setJoining(null);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const group = await api.groups.create(newGroup);
      toast.success('Group created successfully!');
      setNewGroup({ name: '', description: '' });
      setIsCreating(false);
      navigate(`/groups/${group._id}`);
    } catch (err) {
      toast.error(err.message || 'Failed to create group');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            Support Groups
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Connect, share, and heal together</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-medium shadow-md transition-all text-sm"
        >
          {isCreating ? 'Cancel' : 'Create Group'}
        </button>
      </div>

      {isCreating && (
        <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 animate-fade-in-down">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Create a New Group</h3>
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group Name</label>
              <input
                type="text"
                required
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Anxiety Support"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                required
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
                placeholder="What is this group about?"
                rows="3"
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-medium shadow-md hover:shadow-lg"
            >
              Create Group
            </button>
          </form>
        </div>
      )}

      {groups.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No groups found.</p>
          <button onClick={() => setIsCreating(true)} className="text-indigo-600 dark:text-indigo-400 hover:underline">
            Create the first group
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {groups.map((group) => (
            <div key={group._id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-full">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <Link to={`/groups/${group._id}`}
                    className="font-bold text-xl text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    {group.name}
                  </Link>
                  <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400">
                    {group.members?.length || 0} members
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-3">{group.description}</p>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <span className="text-xs text-gray-500">
                  Admin: <span className="font-medium text-gray-700 dark:text-gray-300">{group.admin?.username || 'Unknown'}</span>
                </span>
                <button
                  onClick={() => requestToJoin(group._id)}
                  className="bg-indigo-50 hover:bg-indigo-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  disabled={joining === group._id}
                >
                  {joining === group._id ? 'Requesting...' : 'Join Group'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
