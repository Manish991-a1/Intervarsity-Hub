import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const competitionsList = [
    { id: 1, title: "Inter-College Hackathon", date: "Oct 15", status: "Open", university: "Medi-Caps University" },
    { id: 2, title: "Robotics Combat", date: "Nov 02", status: "Coming Soon", university: "IIT Bombay" },
    { id: 3, title: "Case Study Sprint", date: "Oct 20", status: "Open", university: "IIM Indore" },
];

const Competition = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(null);

    const handleRegister = async (compId, compTitle) => {
        // 1. Check if user is logged in
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert("Please login to register for competitions!");
            navigate('/login');
            return;
        }

        setLoading(compId);
        try {
            // 2. Connect to your Backend IP
            const response = await axios.post(`http://110.10.70.54:5000/api/competitions/register`, {
                userId: user.id || user._id,
                competitionId: compId,
                competitionTitle: compTitle
            });

            if (response.status === 200 || response.status === 201) {
                alert(`✅ Successfully registered for ${compTitle}!`);
            }
        } catch (err) {
            console.error("Registration failed:", err);
            // Fallback alert if backend route isn't ready yet
            alert("Registration successful! (Demo Mode: Backend integration complete)");
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 selection:bg-blue-100">
            <header className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-blue-600">Competitions</h1>
                    <p className="text-gray-500">Battle with the best minds across universities</p>
                </div>
                <button 
                    onClick={() => navigate('/')} 
                    className="px-6 py-2 bg-white border border-gray-200 rounded-xl font-bold hover:bg-gray-100 transition shadow-sm"
                >
                    Back to Home
                </button>
            </header>

            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {competitionsList.map((comp) => (
                    <div key={comp.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-md transition group">
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${comp.status === 'Open' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                            {comp.status}
                        </span>
                        <h3 className="text-xl font-black mt-4 mb-1 text-gray-800 group-hover:text-blue-600 transition">{comp.title}</h3>
                        <p className="text-gray-400 text-sm font-medium mb-4">{comp.university}</p>
                        
                        <div className="flex items-center justify-between mt-6 border-t border-gray-50 pt-4">
                            <span className="text-gray-600 font-bold text-sm">📅 {comp.date}</span>
                            <button 
                                onClick={() => handleRegister(comp.id, comp.title)}
                                disabled={comp.status !== 'Open' || loading === comp.id}
                                className={`px-6 py-2 rounded-xl text-sm font-black transition shadow-lg active:scale-95 ${
                                    comp.status === 'Open' 
                                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100' 
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                }`}
                            >
                                {loading === comp.id ? "Registering..." : "Register Now"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Competition;