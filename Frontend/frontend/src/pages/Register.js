import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        university: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // List of allowed academic domains
    const allowedDomains = ['.edu', '.ac.in', '.edu.co', '.edu.mx', '.ac.uk'];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateEmail = (email) => {
        // Checks if email matches any of the common academic TLDs
        return allowedDomains.some(domain => email.toLowerCase().endsWith(domain));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // 1. STRICT UNIVERSITY EMAIL VALIDATION
        if (!validateEmail(formData.email)) {
            setError("Access Denied: Please use a valid University email (e.g., .edu or .ac.in)");
            setLoading(false);
            return;
        }

        try {
            // 2. BACKEND API CALL (Make sure your exact localtunnel URL is pasted here!)
            const response = await axios.post('https://PASTE-YOUR-ACTUAL-LOCALTUNNEL-LINK-HERE.loca.lt/api/auth/register', formData);
            
            if (response.status === 201 || response.status === 200) {
                // Inform user about the verification step
                alert(`A verification link has been sent to ${formData.email}. Please verify your student status to log in.`);
                navigate('/login');
            }
        } catch (err) {
            // Displays exact error from backend if available, otherwise defaults to the fallback message
            setError(err.response?.data?.msg || "Registration failed. This email might already be in use.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center">
                <h2 className="text-3xl font-extrabold text-blue-600 mb-2">Student Hub</h2>
                <p className="text-gray-500 mb-6">Verify your university status to join</p>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        name="name" 
                        type="text"
                        placeholder="Full Name" 
                        value={formData.name}
                        onChange={handleChange} 
                        required 
                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <input 
                        name="email" 
                        type="email" 
                        placeholder="yourname@university.edu" 
                        value={formData.email}
                        onChange={handleChange} 
                        required 
                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <input 
                        name="university" 
                        type="text"
                        placeholder="University Name" 
                        value={formData.university}
                        onChange={handleChange} 
                        required 
                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <input 
                        name="password" 
                        type="password" 
                        placeholder="Create Secure Password" 
                        value={formData.password}
                        onChange={handleChange} 
                        required 
                        className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-4 bg-blue-600 text-white rounded-xl font-bold transition shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700 shadow-blue-100'}`}
                    >
                        {loading ? 'Processing...' : 'Verify & Register'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-3">Security Note</p>
                    <div className="p-3 bg-blue-50 rounded-xl text-blue-700 text-xs">
                        Registration is restricted to verified institution domains to ensure a safe peer-to-peer environment.
                    </div>
                </div>

                <p className="mt-6 text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;