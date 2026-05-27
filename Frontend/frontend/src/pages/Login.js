import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// 1. Live Tunnel Endpoint for your Backend API
const API_BASE = "https://blue-dodos-begin.loca.lt";

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 2. Uses the API_BASE tunnel URL to route network requests from your phone
            const response = await fetch(`${API_BASE}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                alert("Login Successful!");
                navigate('/'); 
            } else {
                setError(data.msg || "Invalid email or password");
            }
        } catch (err) {
            // 3. Informative error fallback tracking the active path
            setError(`Server error. Check if your backend is running at ${API_BASE}`);
        }
    };

    return (
        <div style={containerStyle}>
            <div style={cardStyle}>
                <h2 style={{ color: '#1a73e8', marginBottom: '20px' }}>Login to Hub</h2>
                {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}
                
                <form onSubmit={handleSubmit} style={formStyle}>
                    <input 
                        name="email" 
                        type="email" 
                        placeholder="Email Address" 
                        onChange={handleChange} 
                        required 
                        style={inputStyle} 
                    />
                    <input 
                        name="password" 
                        type="password" 
                        placeholder="Password" 
                        onChange={handleChange} 
                        required 
                        style={inputStyle} 
                    />
                    <button type="submit" style={buttonStyle}>Login</button>
                </form>

                <p style={{ marginTop: '20px', fontSize: '14px' }}>
                    Don't have an account? <Link to="/register" style={{ color: '#1a73e8' }}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

// Styles
const containerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' };
const cardStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center', width: '100%', maxWidth: '400px' };
const formStyle = { display: 'flex', flexDirection: 'column', gap: '15px' };
const inputStyle = { padding: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px' };
const buttonStyle = { padding: '12px', borderRadius: '6px', border: 'none', backgroundColor: '#1a73e8', color: 'white', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' };

export default Login;