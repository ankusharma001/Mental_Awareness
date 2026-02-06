import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { api } from '../utils/api';
import { Link } from 'react-router-dom';

export default function MyGroups() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        fetchMyGroups();
    }, []);

    const fetchMyGroups = async () => {
        try {
            const data = await api.groups.getMyGroups();
            setGroups(data);
        } catch (err) {
            console.error(err);
            toast.error('Failed to fetch your groups');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );

    const createdGroups = groups.filter(g => g.admin === user?.id || g.admin?._id === user?.id);
    const joinedGroups = groups.filter(g => (g.admin !== user?.id && g.admin?._id !== user?.id));

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="mb-10">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">My Communities</h1>
                <p className="text-gray-500 dark:text-gray-400">Manage the groups you've created and joined.</p>
            </div>

            <div className="space-y-12">
                {/* Created Groups */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-1 h-8 bg-indigo-600 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Groups You Lead</h2>
                    </div>

                    {createdGroups.length === 0 ? (
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
                            <p className="text-gray-500 mb-4">You haven't created any groups yet.</p>
                            <Link to="/groups" className="text-indigo-600 font-medium hover:underline">Start a community</Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {createdGroups.map(group => (
                                <GroupCard key={group._id} group={group} isOwner={true} />
                            ))}
                        </div>
                    )}
                </section>

                {/* Joined Groups */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-1 h-8 bg-purple-600 rounded-full"></div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Joined Communities</h2>
                    </div>

                    {joinedGroups.length === 0 ? (
                        <div className="bg-gray-50 dark:bg-gray-800/50 p-8 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 text-center">
                            <p className="text-gray-500 mb-4">You haven't joined any groups yet.</p>
                            <Link to="/groups" className="text-purple-600 font-medium hover:underline">Explore groups</Link>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 gap-6">
                            {joinedGroups.map(group => (
                                <GroupCard key={group._id} group={group} isOwner={false} />
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

function GroupCard({ group, isOwner }) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <Link to={`/groups/${group._id}`} className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        {group.name}
                    </Link>
                    <p className="text-sm text-gray-500 mt-1">{group.members?.length || 0} members</p>
                </div>
                {isOwner && (
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">
                        Admin
                    </span>
                )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-6">
                {group.description}
            </p>
            <div className="flex items-center justify-between">
                <Link
                    to={`/groups/${group._id}`}
                    className="text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:underline flex items-center gap-1"
                >
                    View Dashboard
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
                <span className="text-xs text-gray-400 italic">
                    Last active 2h ago
                </span>
            </div>
        </div>
    );
}
