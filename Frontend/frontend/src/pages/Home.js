import React, { useEffect, useState } from "react";
import { motion } from "framer-motion"; 
import { useNavigate } from "react-router-dom"; 
import { Search, Zap } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // 1. UPDATED FEATURES LIST
  const features = [
    { 
      title: "Competition", 
      icon: "🏆", 
      bg: "bg-orange-50", 
      path: "/competitions", 
      desc: `Represent ${user?.university || "your university"} and prove you're the best.` 
    },
    { 
      title: "Paid Tasks", 
      icon: "💰", 
      bg: "bg-emerald-50", 
      path: "/tasks", 
      desc: "Complete verified campus tasks and earn real wallet rewards for your work." 
    },
    { 
      title: "Live Feed", 
      icon: "🔥", 
      bg: "bg-blue-50", 
      path: "/chat", 
      desc: "Stay connected with real-time updates from students across the country." 
    },
    { 
      title: "Resource Sharing", 
      icon: "📂", 
      bg: "bg-indigo-50", 
      path: "/resourcesharing", 
      desc: "Access notes, PDFs, and media shared across the campus." 
    }
  ];

  // Search Logic
  const filteredFeatures = features.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      try {
        setUser(JSON.parse(loggedInUser));
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
    setIsLoaded(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowMenu(false);
    navigate("/login");
  };

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 font-sans selection:bg-blue-100">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6 flex-shrink-0">
            <h1 
              className="text-2xl font-black tracking-tight text-blue-600 cursor-pointer hover:opacity-80 transition" 
              onClick={() => navigate('/')}
            >
              INTERVARSITY<span className="text-gray-900">HUB</span>
            </h1>
          </div>

          {/* SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                <Search size={18} />
              </span>
              <input 
                type="text" 
                placeholder="Search features (Tasks, Competition...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 border-none rounded-2xl py-2.5 pl-12 pr-4 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="hidden lg:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button onClick={() => navigate('/')} className="px-4 py-2 rounded-lg bg-white shadow-sm text-sm font-bold text-blue-600">Home</button>
              <button onClick={() => navigate('/tasks')} className="px-4 py-2 rounded-lg text-gray-500 text-sm font-bold hover:bg-white transition">Paid Tasks</button>
              <button onClick={() => navigate('/ranking')} className="px-4 py-2 rounded-lg text-gray-500 text-sm font-bold hover:bg-white transition">Ranking</button>
            </div>

            {user ? (
              <div className="relative flex items-center gap-3">
                <button 
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-2xl shadow-sm hover:shadow-md transition"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-bold hidden xl:block">
                    {user?.name?.split(' ')[0] || "User"}
                  </span>
                </button>

                <div className="relative">
                  <button onClick={() => setShowMenu(!showMenu)} className="p-2 hover:bg-gray-100 rounded-full text-xl font-bold leading-none">⋮</button>
                  {showMenu && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in zoom-in duration-200">
                      <button onClick={() => { navigate('/profile'); setShowMenu(false); }} className="w-full text-left px-6 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-medium">👤 My Profile</button>
                      <button onClick={() => { navigate('/universities'); setShowMenu(false); }} className="w-full text-left px-6 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-medium">🏫 Active Universities</button>
                      <button onClick={() => { navigate('/tasks'); setShowMenu(false); }} className="w-full text-left px-6 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-medium">💰 Paid Tasks</button>
                      <button onClick={() => { navigate('/competitions'); setShowMenu(false); }} className="w-full text-left px-6 py-3 hover:bg-gray-50 flex items-center gap-3 text-sm font-medium">🏆 Competitions</button>
                      <hr className="my-2 border-gray-100" />
                      <button onClick={handleLogout} className="w-full text-left px-6 py-3 text-red-500 hover:bg-red-50 flex items-center gap-3 text-sm font-bold">🚪 Logout</button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => navigate('/login')} className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-blue-600 transition">Login</button>
                <button onClick={() => navigate('/register')} className="bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition transform active:scale-95">Join Now</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-32">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-10"
        >
          <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-sm md:text-base font-black uppercase tracking-[0.2em]">
            Empowering students across campuses
          </span>
          
          <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-gray-900">
            Connect. <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">Compete.</span><br/>Collaborate.
          </h2>

          <div className="flex flex-col sm:flex-row justify-center gap-6 pt-4">
            <button 
              onClick={() => navigate(user ? '/tasks' : '/register')}
              className="flex items-center justify-center gap-3 px-12 py-5 bg-gray-900 text-white rounded-[2rem] font-bold text-lg shadow-2xl hover:bg-blue-600 transition duration-300 transform hover:-translate-y-1"
            >
              {user ? <><Zap size={20} /> View Paid Tasks</> : 'Get Started Free'}
            </button>
            <button onClick={() => navigate('/ranking')} className="px-12 py-5 bg-white border-2 border-gray-100 rounded-[2rem] font-bold text-lg hover:bg-gray-50 transition shadow-sm">Leaderboard</button>
          </div>
        </motion.div>

        {/* FEATURE CARDS */}
        <div className="mt-32">
          {searchQuery && (
            <p className="mb-8 text-gray-500 font-medium italic text-lg text-center">
              Showing results for "{searchQuery}"
            </p>
          )}
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFeatures.map((item, i) => (
              <motion.div 
                key={i}
                whileHover={{ scale: 1.05, y: -5 }}
                onClick={() => navigate(item.path)}
                className="p-8 bg-white rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center text-2xl mb-6`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-black mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}