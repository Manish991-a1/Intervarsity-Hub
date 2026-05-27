import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FileText, Image as ImageIcon, Video, File, Upload, Loader2 } from 'lucide-react';

const ResourceSharing = () => {
    const [resources, setResources] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    
    // Active network IP configuration matching terminal routing
   const API_BASE = "http://10.10.70.54:5000";

    // Fetch resources on component mount
    useEffect(() => {
        fetchResources();
    }, []);

    const fetchResources = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/resources`);
            if (res.data && Array.isArray(res.data)) {
                setResources(res.data);
            }
        } catch (err) {
            console.error("Error fetching resources from endpoint:", err);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setIsUploading(true);
        try {
            const res = await axios.post(`${API_BASE}/api/resources/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            
            if (res.data) {
                // Prepend new resource object instance directly to display layer
                setResources((prev) => [res.data, ...prev]);
                alert("✅ File uploaded successfully!");
            }
        } catch (err) {
            console.error("Upload execution boundary error:", err);
            alert("❌ Upload failed. Make sure the 'uploads' folder exists in your Backend directory and the server is running.");
        } finally {
            setIsUploading(false);
            // Reset standard form state context targets
            if (e.target) e.target.value = null;
        }
    };

    const handleDownload = (url, fileName) => {
        if (!url) return;
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName || 'download');
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    // Enhanced matching logic to align with backend extension parsing
    const getIcon = (type) => {
        const fileType = type ? type.toLowerCase() : '';
        if (fileType.includes('pdf')) return <FileText size={40} className="text-red-500" />;
        if (
            fileType.includes('image') || 
            fileType.includes('png') || 
            fileType.includes('jpg') || 
            fileType.includes('jpeg') || 
            fileType.includes('gif')
        ) {
            return <ImageIcon size={40} className="text-blue-500" />;
        }
        if (fileType.includes('video') || fileType.includes('mp4') || fileType.includes('mkv')) {
            return <Video size={40} className="text-purple-500" />;
        }
        return <File size={40} className="text-gray-500" />;
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen font-sans selection:bg-indigo-100">
            <div className="max-w-7xl mx-auto">
                {/* Upper Functional Header Box */}
                <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Resource Hub</h1>
                        <p className="text-gray-500 text-sm mt-0.5">Share and access campus resources</p>
                    </div>
                    
                    <input 
                        type="file" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleUpload}
                        disabled={isUploading}
                    />

                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className={`flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 active:scale-[0.98] transition shadow-sm ${
                            isUploading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>Uploading...</span>
                            </>
                        ) : (
                            <>
                                <Upload size={18} /> 
                                <span>Upload Resource</span>
                            </>
                        )}
                    </button>
                </header>

                {/* Main Render Section Layout Grid */}
                <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {resources.length === 0 ? (
                        <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <File className="text-gray-300 mb-4" size={48} />
                            <p className="text-gray-400 font-medium italic">No resources found. Upload the first one!</p>
                        </div>
                    ) : (
                        resources.map((res, index) => {
                            // Secure key resolution framework
                            const uniqueKey = res.id || res._id || `resource-fallback-${index}`;
                            return (
                                <div key={uniqueKey} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col justify-between group">
                                    <div>
                                        <div className="flex items-center justify-center h-32 bg-gray-50 rounded-lg mb-4 group-hover:bg-gray-100 transition">
                                            {getIcon(res.type)}
                                        </div>
                                        <h3 className="font-semibold text-gray-700 truncate" title={res.name}>
                                            {res.name}
                                        </h3>
                                        <div className="flex justify-between text-xs text-gray-400 mt-2">
                                            <span>{res.size || 'Unknown size'}</span>
                                            <span>{res.date || 'Recent'}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleDownload(res.url, res.name)}
                                        className="w-full mt-4 py-2 text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-600 hover:border-indigo-600 hover:text-white transition text-sm font-medium"
                                    >
                                        Download
                                    </button>
                                </div>
                            );
                        })
                    )}
                </main>
            </div>
        </div>
    );
};

export default ResourceSharing;