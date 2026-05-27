import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// --- Page Component Imports ---
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import Tasks from './pages/Tasks';
import Ranking from './pages/Ranking';
import Competition from './pages/Competition'; 
import UniversityList from './pages/universitylist';
import ResourceSharing from './pages/Resourcesharing'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* --- Public & Authentication Routes --- */}
        {/* --- Home acts as the main landing dashboard for the hub --- */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- Core Student Features --- */}
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/ranking" element={<Ranking />} />
        <Route path="/chat" element={<Chat />} />
        
        {/* --- Content Features --- */}
        <Route path="/resourcesharing" element={<ResourceSharing />} />
        <Route path="/competitions" element={<Competition />} />
        
        {/* --- University & Hub Routes --- */}
        {/* Updated path to /universities to match the link in Home.js dropdown */}
        <Route path="/universities" element={<UniversityList />} />
        {/* Keeping /universitylist as an alias just in case */}
        <Route path="/universitylist" element={<UniversityList />} />
        
        {/* --- 404 Fallback: Catches any broken links --- */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-blue-600">404</h1>
                <p className="text-xl text-gray-500 mt-4">Oops! This page doesn't exist.</p>
                <a href="/" className="mt-6 inline-block px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">
                  Back to Hub
                </a>
              </div>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;