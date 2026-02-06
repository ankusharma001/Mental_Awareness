import React, { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';
import { toast } from 'react-hot-toast';

export default function GroupChat({ groupId, user }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);
    const scrollRef = useRef();

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 4000); // Polling every 4s
        return () => clearInterval(interval);
    }, [groupId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const data = await api.groups.getMessages(groupId);
            if (Array.isArray(data)) {
                setMessages(data);
                setIsBlocked(false);
            } else {
                setMessages([]);
            }
        } catch (err) {
            if (err.message.includes('blocked') || err.message.includes('403')) {
                setIsBlocked(true);
            }
            console.error('Chat fetch failed', err);
            setMessages([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending || isBlocked) return;

        setSending(true);
        try {
            const msg = await api.groups.sendMessage(groupId, newMessage);
            if (msg && msg._id) {
                setMessages(prev => [...prev, msg]);
                setNewMessage('');
            } else {
                toast.error('Sent but received invalid response');
                fetchMessages();
            }
        } catch (err) {
            if (err.message.includes('blocked')) setIsBlocked(true);
            toast.error(err.message || 'Failed to send message');
        } finally {
            setSending(false);
        }
    };

    if (loading) return (
        <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-500 mb-4"></div>
            <p className="text-gray-400 font-medium">Entering Community...</p>
        </div>
    );

    if (isBlocked) return (
        <div className="flex flex-col items-center justify-center h-[500px] bg-red-50 dark:bg-red-900/10 rounded-2xl border-2 border-dashed border-red-200 dark:border-red-900/30 p-10 text-center">
            <div className="w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-red-500 shadow-md mb-6 ring-4 ring-white dark:ring-gray-700">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            <h3 className="text-2xl font-black text-red-600 dark:text-red-400 mb-3">Access Denied</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm max-w-xs leading-relaxed">
                You have been permanently blocked from this community. Interaction is no longer permitted.
            </p>
        </div>
    );

    return (
        <div className="flex flex-col h-[550px] bg-white dark:bg-[#0b141a] rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-25"></div>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 tracking-tight">Community Chat</h3>
                </div>
                <button
                    onClick={fetchMessages}
                    className="text-gray-400 hover:text-indigo-600 transition-all p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                    <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                </button>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth bg-gray-50/20 dark:bg-transparent"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full opacity-30 select-none">
                        <p className="text-sm font-bold uppercase tracking-widest text-gray-400">Silence is golden...</p>
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender?._id === user?.id || msg.sender === user?.id;
                        return (
                            <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                                    {!isMe && (
                                        <p className="text-[10px] text-indigo-500 font-bold mb-1.5 ml-1">{msg.sender?.username}</p>
                                    )}
                                    <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm transition-all ${isMe
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-100 dark:border-gray-700'
                                        }`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[8px] text-gray-400 mt-1.5 font-bold uppercase tracking-tighter px-1">
                                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <form onSubmit={handleSend} className="p-4 bg-white dark:bg-gray-900/50 flex gap-3">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-100 dark:bg-gray-800/50 border-none rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                />
                <button
                    type="submit"
                    disabled={sending || !newMessage.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white w-12 h-12 rounded-2xl disabled:opacity-50 transition-all flex items-center justify-center shadow-lg hover:shadow-indigo-500/25 active:scale-95"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                </button>
            </form>
        </div>
    );
}
