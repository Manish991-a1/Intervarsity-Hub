import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const Chat = () => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState("");
    const [user, setUser] = useState(null);

    // CONSTANT: 15 Minutes in Milliseconds
    const EXPIRY_TIME = 15 * 60 * 1000;

    // Helper to filter old messages 
    const getValidMessages = useCallback((data) => {
        const now = Date.now();
        return data.filter(msg => (now - msg.time) < EXPIRY_TIME);
    }, [EXPIRY_TIME]);

    // 1. Initial Load: Auth Check and Hydrate Storage
    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (!loggedInUser) {
            navigate('/login');
            return;
        }
        setUser(loggedInUser);

        // Load and immediately filter history on startup 
        const savedChat = JSON.parse(localStorage.getItem('hub_chat_history')) || [];
        const validMessages = getValidMessages(savedChat);
        setMessages(validMessages);
        localStorage.setItem('hub_chat_history', JSON.stringify(validMessages));
    }, [navigate, getValidMessages]);

    // 2. Recycle Logic: Runs every 5 seconds to remove expired posts 
    useEffect(() => {
        const recycleInterval = setInterval(() => {
            setMessages(prevMessages => {
                const filtered = getValidMessages(prevMessages);
                if (filtered.length !== prevMessages.length) {
                    localStorage.setItem('hub_chat_history', JSON.stringify(filtered));
                    return filtered;
                }
                return prevMessages;
            });
        }, 5000); // Check more frequently for smoother recycling

        return () => clearInterval(recycleInterval);
    }, [getValidMessages]);

    const handlePost = (e) => {
        e.preventDefault();
        if (!inputText.trim() || !user) return;

        const newMessage = {
            id: `msg-${Date.now()}`,
            user: user.name,
            university: user.university || "Global",
            text: inputText.trim(),
            time: Date.now()
        };

        const updatedMessages = [newMessage, ...messages];
        setMessages(updatedMessages);
        localStorage.setItem('hub_chat_history', JSON.stringify(updatedMessages));
        setInputText("");
    };

    return (
        <div className="min-h-screen bg-gray-50 md:py-8 flex justify-center selection:bg-blue-100">
            <div className="w-full max-w-2xl bg-white min-h-screen md:min-h-[85vh] md:rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
                
                {/* Header */}
                <div className="sticky top-0 bg-white/80 backdrop-blur-xl p-6 border-b border-gray-100 flex items-center justify-between z-10">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 rounded-full transition text-xl">
                            ←
                        </button>
                        <div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Community Feed</h2>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400">Live Campus Pulse</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] bg-blue-600 text-white px-3 py-1 rounded-full font-black uppercase tracking-widest">
                            15m Recycle
                        </span>
                    </div>
                </div>

                {/* Input Section */}
                <div className="p-6 bg-white border-b-8 border-gray-50">
                    <form onSubmit={handlePost} className="space-y-4">
                        <div className="flex gap-4">
                            <div className="h-12 w-12 shrink-0 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg">
                                {user?.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                            <textarea 
                                className="flex-1 text-gray-700 placeholder:text-gray-300 outline-none resize-none py-2 bg-transparent text-lg font-medium"
                                placeholder="What's happening at your university?"
                                rows="2"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                        </div>
                        <div className="flex justify-end border-t border-gray-50 pt-4">
                            <button 
                                type="submit"
                                disabled={!inputText.trim()}
                                className="bg-blue-600 disabled:bg-gray-200 text-white px-10 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
                            >
                                Post Update
                            </button>
                        </div>
                    </form>
                </div>

                {/* Feed List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.length === 0 ? (
                        <div className="text-center py-24 opacity-40">
                            <div className="text-5xl mb-4">🌪️</div>
                            <p className="font-bold uppercase tracking-widest text-xs">Feed is empty</p>
                            <p className="text-sm mt-1">Posts disappear after 15 minutes</p>
                        </div>
                    ) : (
                        messages.map(msg => (
                            <div key={msg.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="flex gap-4 group">
                                    <div className="h-10 w-10 shrink-0 bg-gray-50 rounded-xl flex items-center justify-center font-black text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                        {msg.user?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-black text-gray-900 text-sm">{msg.user}</span>
                                                <span className="text-[9px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-black uppercase">
                                                    {msg.university}
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-300">
                                                {Math.max(0, Math.floor((Date.now() - msg.time) / 60000))}m ago
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mt-1.5 leading-relaxed font-medium break-words">
                                            {msg.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;