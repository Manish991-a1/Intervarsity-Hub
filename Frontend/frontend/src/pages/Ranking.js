import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Ranking = () => {
    const [rankings, setRankings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                // We will create this backend route in the next step
                const response = await axios.get('http://10.10.70.54:5000/api/auth/rankings');
                setRankings(response.data);
                setLoading(true);
            } catch (err) {
                console.error("Error fetching leaderboard:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchRankings();
    }, []);

    if (loading) return <div className="p-10 text-center font-bold">Calculating Leaderboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans text-gray-900">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate('/')} 
                    className="mb-6 text-blue-600 font-semibold hover:underline flex items-center gap-2"
                >
                    ← Back to Home
                </button>

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900">Monthly Leaderboard 🏆</h1>
                    <p className="text-gray-500 mt-2">Ranked by points earned through university tasks</p>
                </div>

                {/* Top 3 Podium (Optional Visuals) */}
                <div className="grid grid-cols-3 gap-4 mb-10 items-end text-center">
                    {rankings.slice(0, 3).map((user, i) => (
                        <div key={user._id} className={`p-4 rounded-2xl shadow-sm bg-white border-b-4 ${i === 0 ? 'border-yellow-400 h-48' : i === 1 ? 'border-gray-300 h-40' : 'border-orange-400 h-36'}`}>
                            <div className="text-2xl mb-2">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                            <div className="font-bold truncate text-sm md:text-base">{user.name.split(' ')[0]}</div>
                            <div className="text-blue-600 font-black">{user.points}</div>
                            <div className="text-[10px] text-gray-400 uppercase mt-1">Points</div>
                        </div>
                    ))}
                </div>

                {/* Full Ranking Table */}
                <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-gray-400 text-xs uppercase tracking-wider font-bold">
                            <tr>
                                <th className="px-6 py-4">Rank</th>
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">University</th>
                                <th className="px-6 py-4 text-right">Points</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {rankings.map((user, index) => (
                                <tr key={user._id} className="hover:bg-blue-50/50 transition">
                                    <td className="px-6 py-4 font-bold text-gray-400">#{index + 1}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="font-semibold text-gray-700">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{user.university}</td>
                                    <td className="px-6 py-4 text-right font-black text-blue-600">{user.points}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Ranking;