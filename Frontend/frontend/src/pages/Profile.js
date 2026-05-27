import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Briefcase, LayoutDashboard, ArrowLeft, Save, X } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // PAGE VIEW CONTROLLER STATE: "dashboard" | "personal" | "professional"
  const [currentView, setCurrentView] = useState("dashboard");

  // Dynamic Multi-Section Form State Formatter
  const [formData, setFormData] = useState({
    name: "",
    university: "",
    headline: "",
    bio: "",
    skillsInput: ""
  });

  const navigate = useNavigate();
  const API_BASE = "http://10.10.70.54:5000";

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      const parsedUser = JSON.parse(loggedInUser);
      setUser(parsedUser);
      
      // Parse array formats out into a raw string value for form field fields
      const formattedSkills = parsedUser.skills?.map(s => `${s.name}:${s.level}`).join(", ") || "";
      
      setFormData({
        name: parsedUser.name || "",
        university: parsedUser.university || "",
        headline: parsedUser.headline || "Aspiring Developer",
        bio: parsedUser.bio || "Campus student matching core personal and professional skillsets.",
        skillsInput: formattedSkills
      });
    } else {
      navigate("/login"); 
    }
  }, [navigate]);

  if (!user) return <div className="p-10 text-center font-sans text-gray-500">Loading Hub Profile...</div>;

  const completedTasksCount = user.completedTasks?.length || 0;
  const globalRank = user.rank || "Unranked";
  const certificatesCount = user.certificates?.length || 0;
  const hubPoints = user.points || 0;
  const taskProgressPercentage = user.taskProgress || 0; 
  const projectsList = user.recentProjects || [];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      const userId = user.id || user._id;

      // Reverse comma notation map targets: "React:80, Node:90" -> [{ name: "React", level: 80 }]
      const updatedSkillsArray = formData.skillsInput.split(",").map(item => {
        const [name, level] = item.split(":");
        return { name: name?.trim(), level: parseInt(level?.trim()) || 80 };
      }).filter(s => s.name);

      const payload = {
        userId,
        name: formData.name,
        university: formData.university,
        headline: formData.headline,
        bio: formData.bio,
        skills: updatedSkillsArray
      };

      const response = await axios.put(`${API_BASE}/api/auth/update-profile`, payload);

      if (response.status === 200 || response.status === 201) {
        const updatedUserInstance = { ...user, ...payload };
        setUser(updatedUserInstance);
        localStorage.setItem("user", JSON.stringify(updatedUserInstance));
        setCurrentView("dashboard");
        alert("✅ Changes successfully synchronized with cloud database!");
      }
    } catch (error) {
      console.error("Profile sync exception:", error);
      
      // Local runtime synchronization layout fallback path
      const updatedSkillsArray = formData.skillsInput.split(",").map(item => {
        const [name, level] = item.split(":");
        return { name: name?.trim(), level: parseInt(level?.trim()) || 80 };
      }).filter(s => s.name);

      const updatedUserInstance = { ...user, ...formData, skills: updatedSkillsArray };
      setUser(updatedUserInstance);
      localStorage.setItem("user", JSON.stringify(updatedUserInstance));
      setCurrentView("dashboard");
      alert("⚠️ Saved locally! (Verify backend endpoints are connected)");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans selection:bg-blue-100">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Fixed Action Sidebar Controller */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="rounded-3xl shadow-sm bg-white p-6 text-center border border-gray-100">
            <div className="h-24 w-24 mx-auto mb-4 border-4 border-blue-50 shadow-sm rounded-full bg-blue-600 text-white text-2xl font-bold flex items-center justify-center">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-xs text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-full inline-block mt-1 mb-2">
              {user.headline || "Aspiring Developer"}
            </p>
            <p className="text-xs text-gray-400 font-medium truncate">{user.email}</p>
          </div>

          <div className="rounded-3xl shadow-sm bg-white p-6 border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">View Manager</h3>
            <nav className="space-y-1">
              <button 
                onClick={() => setCurrentView("dashboard")}
                className={`w-full text-left p-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition ${
                  currentView === "dashboard" ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard Overview</span>
              </button>
              
              <button 
                onClick={() => setCurrentView("personal")}
                className={`w-full text-left p-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition ${
                  currentView === "personal" ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <User size={18} />
                <span>Edit Personal Info</span>
              </button>

              <button 
                onClick={() => setCurrentView("professional")}
                className={`w-full text-left p-3 rounded-xl text-sm font-semibold flex items-center gap-3 transition ${
                  currentView === "professional" ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Briefcase size={18} />
                <span>Edit Professional Data</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* RIGHT COLUMN: Switching Core Application Workspace Panel */}
        <main className="lg:col-span-9">
          
          {/* SCREEN VIEW 1: DEFAULT MAIN DASHBOARD PROFILE GRAPHICS OVERVIEW */}
          {currentView === "dashboard" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Tasks Done", val: completedTasksCount, icon: "✅" },
                  { label: "Global Rank", val: typeof globalRank === 'number' ? `#${globalRank}` : globalRank, icon: "🌍" },
                  { label: "Certificates", val: certificatesCount, icon: "📜" },
                  { label: "Points Earned", val: `${hubPoints} XP`, icon: "⚡" },
                ].map((stat, i) => (
                  <div key={i} className="rounded-3xl shadow-sm p-5 bg-white border border-gray-100 flex flex-col justify-between min-h-[120px]">
                    <div className="text-2xl">{stat.icon}</div>
                    <div>
                      <div className="text-2xl font-black text-gray-900 tracking-tight">{stat.val}</div>
                      <div className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="rounded-3xl shadow-sm p-6 bg-white border border-gray-100 flex flex-col justify-between min-h-[280px]">
                  <h3 className="font-bold text-gray-900 text-sm">Task Progress</h3>
                  <div className="flex justify-center items-center my-auto h-40">
                    <div className="h-28 w-28 rounded-full border-[10px] border-blue-500 border-t-gray-100 flex items-center justify-center shadow-inner">
                      <span className="text-xl font-black text-gray-800">{taskProgressPercentage}%</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl shadow-sm p-6 bg-white border border-gray-100 md:col-span-2">
                  <h3 className="font-bold text-gray-900 text-sm mb-4">Top Registered Skills</h3>
                  <div className="space-y-3">
                    {user.skills?.length === 0 ? (
                      <p className="text-gray-400 text-xs italic py-6 text-center">No skills cached. Go to Professional Editor to populate values.</p>
                    ) : (
                      user.skills?.map((skill, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1 font-bold text-gray-600">
                            <span>{skill.name}</span>
                            <span className="text-blue-600">{skill.level}%</span>
                          </div>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${skill.level}%` }} />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN VIEW 2: INDEPENDENT PERSONAL EDIT PAGE VIEWPORT */}
          {currentView === "personal" && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Personal Settings</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Modify baseline system metrics and identity tags here.</p>
                </div>
                <button onClick={() => setCurrentView("dashboard")} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Account Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 font-medium text-gray-700"
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">University Affiliation</label>
                  <input 
                    type="text" 
                    name="university"
                    value={formData.university}
                    onChange={handleInputChange}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 font-medium text-gray-700"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-4">
                <button 
                  onClick={() => setCurrentView("dashboard")} 
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 rounded-xl transition"
                >
                  <ArrowLeft size={16} /> Back to Overview
                </button>
                <div className="flex gap-2">
                  <button onClick={handleSaveChanges} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-md hover:bg-blue-700 transition active:scale-95 disabled:opacity-50">
                    <Save size={16} />
                    <span>{isSaving ? "Saving..." : "Save Configuration"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN VIEW 3: INDEPENDENT PROFESSIONAL EDIT PAGE VIEWPORT */}
          {currentView === "professional" && (
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Professional Profile Management</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Update headlines, bios, resume summaries, and skills metadata loops.</p>
                </div>
                <button onClick={() => setCurrentView("dashboard")} className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Professional Headline</label>
                  <input 
                    type="text" 
                    name="headline"
                    value={formData.headline}
                    onChange={handleInputChange}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 font-medium text-gray-700"
                    placeholder="e.g. Full Stack Engineer / UI Designer"
                  />
                </div>
                
                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Skills Loop Matrix (Format string: `Name:Value` separated by commas)</label>
                  <input 
                    type="text" 
                    name="skillsInput"
                    value={formData.skillsInput}
                    onChange={handleInputChange}
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 font-mono text-gray-700"
                    placeholder="React:90, Node:80, Python:75"
                  />
                </div>

                <div className="flex flex-col space-y-2">
                  <label className="text-xs font-bold uppercase text-gray-400 tracking-wider">Profile Summary Bio</label>
                  <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={4}
                    className="border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-gray-700 resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t border-gray-100 mt-4">
                <button 
                  onClick={() => setCurrentView("dashboard")} 
                  className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 rounded-xl transition"
                >
                  <ArrowLeft size={16} /> Back to Overview
                </button>
                <button onClick={handleSaveChanges} disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-600 text-white shadow-md hover:bg-blue-700 transition active:scale-95 disabled:opacity-50">
                  <Save size={16} />
                  <span>{isSaving ? "Saving Metrics..." : "Save Professional Data"}</span>
                </button>
              </div>
            </div>
          )}

          {/* PROJECT FOOTPRINT SECTION CARD BOX */}
          <div className="rounded-3xl shadow-sm overflow-hidden bg-white border border-gray-100 mt-6">
            <div className="p-5 border-b border-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-900 text-sm">Recent Activity Tracking Log</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-400 uppercase font-bold tracking-wider">
                  <tr>
                    <th className="p-4">Project Module Workspace</th>
                    <th className="p-4">Status Map</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {projectsList.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="p-6 text-center text-gray-400 italic">No historical project entries found.</td>
                    </tr>
                  ) : (
                    projectsList.map((project, i) => (
                      <tr key={i} className="hover:bg-gray-50/50 transition">
                        <td className="p-4 font-semibold text-gray-700">{project.name}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-lg font-bold bg-blue-50 text-blue-600 uppercase text-[10px]">
                            {project.status || 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

      </div>
    </div>
  );
}