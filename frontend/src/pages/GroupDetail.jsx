import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { api } from '../utils/api';

import GroupChat from '../components/GroupChat';

export default function GroupDetail() {
  const { user } = useAuth();
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [adminAction, setAdminAction] = useState({ loading: false, userId: null, action: null });

  useEffect(() => {
    fetchGroup();
  }, [groupId]);

  const fetchGroup = () => {
    api.groups.getById(groupId)
      .then(data => {
        if (!data) throw new Error('Group not found');
        setGroup(data);
      })
      .catch((err) => {
        toast.error(err.message);
        navigate('/groups');
      })
      .finally(() => setLoading(false));
  };

  const handleJoinRequest = async () => {
    setJoining(true);
    try {
      await api.groups.join(groupId);
      toast.success('Join request sent!');
      fetchGroup();
    } catch (err) {
      toast.error(err.message || 'Failed to send request');
    } finally {
      setJoining(false);
    }
  };

  const doAdminAction = async (endpoint, userId) => {
    setAdminAction({ loading: true, userId, action: endpoint });
    try {
      await api.groups.adminAction(groupId, endpoint, userId);
      toast.success(`${endpoint} success!`);
      fetchGroup();
    } catch (err) {
      toast.error(err.message || 'Action failed');
    } finally {
      setAdminAction({ loading: false, userId: null, action: null });
    }
  };

  const doDeleteGroup = async () => {
    if (!window.confirm('Are you sure you want to delete this group?')) return;

    setAdminAction({ loading: true, userId: null, action: 'delete' });
    try {
      await api.groups.delete(groupId);
      toast.success('Group deleted successfully');
      navigate('/groups');
    } catch (err) {
      toast.error(err.message || 'Delete failed');
    } finally {
      setAdminAction({ loading: false, userId: null, action: null });
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (!group) return null;

  const isAdmin = user && group.admin &&
    (user.id === (group.admin._id || group.admin));

  const isMember = user && group.members?.some(m => (m._id || m) === user.id);
  const isPending = user && group.joinRequests?.some(r => (r._id || r) === user.id);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex justify-between items-center mb-6">
        <Link to="/groups" className="text-gray-500 hover:text-indigo-600 flex items-center gap-2 text-sm font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Communities
        </Link>

        {!isMember && !isAdmin && (
          <button
            onClick={handleJoinRequest}
            disabled={joining || isPending}
            className={`px-6 py-2 rounded-full font-bold shadow-md transition-all ${isPending
              ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white transform active:scale-95'
              }`}
          >
            {isPending ? 'Request Pending' : 'Join Community'}
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-[#0b141a] rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 p-8 md:p-12 mb-10 transition-all">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                Community Hub
              </span>
            </div>
            <h1 className="text-5xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-none">
              {group.name}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed max-w-2xl font-medium">
              {group.description}
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto">
            {isAdmin && (
              <button
                onClick={doDeleteGroup}
                className="bg-red-500/10 text-red-500 px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all shadow-sm"
                disabled={adminAction.loading}
              >
                Delete Community
              </button>
            )}
            <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-indigo-500/20">
                {group.admin?.username?.[0] || 'A'}
              </div>
              <div>
                <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest leading-tight">Founder</p>
                <p className="font-bold text-gray-900 dark:text-gray-100 text-sm whitespace-nowrap">{group.admin?.username || 'Admin'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        <div className="md:col-span-8 space-y-8">
          {isMember || isAdmin ? (
            <GroupChat groupId={groupId} user={user} />
          ) : (
            <div className="bg-gray-50 dark:bg-gray-900/40 p-12 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800 text-center">
              <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6 text-indigo-600">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Private Community</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm mx-auto mb-8">
                Join this community to participate in discussions and connect with other members.
              </p>
              {!isPending && (
                <button onClick={handleJoinRequest} className="text-indigo-600 font-bold hover:underline">
                  Join now to see chat &rarr;
                </button>
              )}
            </div>
          )}
        </div>

        <div className="md:col-span-4 space-y-8">
          {isAdmin && group.joinRequests?.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-yellow-100 dark:border-yellow-900/20 overflow-hidden">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 border-b border-yellow-100 dark:border-yellow-900/20">
                <h3 className="font-black text-xs text-yellow-800 dark:text-yellow-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                  Pending Requests ({group.joinRequests.length})
                </h3>
              </div>
              <div className="p-4 space-y-3">
                {group.joinRequests.map(req => (
                  <div key={req._id || req} className="bg-white dark:bg-gray-700/50 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600">
                    <p className="font-bold text-gray-800 dark:text-gray-100 text-sm mb-3">{req.username || 'Loading...'}</p>
                    <div className="flex gap-2">
                      <button
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                        onClick={() => doAdminAction('approve', req._id || req)}
                        disabled={adminAction.loading}
                      >
                        Approve
                      </button>
                      <button
                        className="flex-1 bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all"
                        onClick={() => doAdminAction('reject', req._id || req)}
                        disabled={adminAction.loading}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 dark:text-gray-100">Members</h3>
              <span className="text-[10px] px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full font-bold">{group.members?.length || 0}</span>
            </div>
            <div className="p-5 max-h-[400px] overflow-y-auto">
              <div className="space-y-4">
                {group.members?.map(member => (
                  <div key={member._id || member} className="flex justify-between items-center group/member">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-center font-bold text-indigo-600 text-[10px]">
                        {member.username?.[0] || 'M'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{member.username || 'Loading...'}</span>
                        {group.blocked?.some(bid => String(bid._id || bid) === String(member._id || member)) && (
                          <span className="text-[8px] text-red-500 font-black uppercase tracking-widest">Restricted</span>
                        )}
                      </div>
                    </div>
                    {isAdmin && (member._id || member) !== (group.admin._id || group.admin) && (
                      <div className="flex gap-3 items-center opacity-0 group-hover/member:opacity-100 transition-all">
                        <button
                          onClick={() => doAdminAction('remove', member._id || member)}
                          className="text-gray-400 hover:text-red-500 text-[10px] font-bold uppercase tracking-wider"
                          disabled={adminAction.loading}
                        >
                          Kick
                        </button>
                        {group.blocked?.some(bid => String(bid._id || bid) === String(member._id || member)) ? (
                          <button
                            onClick={() => doAdminAction('unblock', member._id || member)}
                            className="text-green-500 hover:text-green-600 font-black text-[10px] uppercase tracking-wider"
                            disabled={adminAction.loading}
                          >
                            Unblock
                          </button>
                        ) : (
                          <button
                            onClick={() => doAdminAction('block', member._id || member)}
                            className="text-red-400 hover:text-red-600 font-black text-[10px] uppercase tracking-wider"
                            disabled={adminAction.loading}
                            title="Ban from community"
                          >
                            Block
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {/* Restricted Members Section (Admin Only) */}
            {isAdmin && group.blocked?.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-red-500">Restricted Members</h3>
                  <span className="text-[9px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold">{group.blocked.length}</span>
                </div>
                <div className="space-y-4">
                  {group.blocked.map(blockedUser => (
                    <div key={blockedUser._id || blockedUser} className="flex justify-between items-center bg-red-50/30 dark:bg-red-900/10 p-3 rounded-xl border border-red-100 dark:border-red-900/20">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-md bg-red-100 text-red-600 flex items-center justify-center text-[8px] font-black">
                          {blockedUser.username?.[0] || '!'}
                        </div>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{blockedUser.username || 'Restricted Identity'}</span>
                      </div>
                      <button
                        onClick={() => doAdminAction('unblock', blockedUser._id || blockedUser)}
                        className="bg-white dark:bg-gray-800 text-green-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-sm hover:shadow-md transition-all"
                      >
                        Unblock
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
