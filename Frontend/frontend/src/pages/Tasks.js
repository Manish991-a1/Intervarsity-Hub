import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Clock, DollarSign, ArrowLeft, Loader2 } from 'lucide-react';

// Relative paths for your layout components
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Active network loopback target point configuration
  const API_BASE = "http://10.10.70.54:5000";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/tasks`);
      if (res.data && Array.isArray(res.data)) {
        setTasks(res.data);
      } else {
        throw new Error("Invalid data format received");
      }
    } catch (err) {
      console.error("Server connection failed, using dummy data:", err);
      // Fallback fallback handling framework mimicking database payloads
      setTasks([
        { _id: "1", title: "Website Bug Fix", description: "Fix layout breakage on the cross-institutional dashboard layers.", budget: 500, points: 50, type: "Paid", difficulty: "Medium", deadline: "2 days", status: "open" },
        { _id: "2", title: "Logo Design", description: "Vector identity drawing grid scaling metrics for client sync.", budget: 200, points: 20, type: "Paid", difficulty: "Easy", deadline: "5 days", status: "open" },
        { _id: "3", title: "Data Entry Hub", description: "Sanitize university student profiles into clean relational tables.", budget: 100, points: 10, type: "Free", difficulty: "Easy", deadline: "1 day", status: "open" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskAction = async (taskId) => {
    try {
      const storedUser = localStorage.getItem('user');
      const user = storedUser ? JSON.parse(storedUser) : null;
      
      if (!user) {
        alert("Please login to start tasks!");
        navigate('/login');
        return;
      }
      
      // Execute status update patch request to transition task lifecycle status
      const response = await axios.patch(`${API_BASE}/api/tasks/${taskId}/start`);
      
      if (response.data) {
        setTasks(prevTasks => 
          prevTasks.map(task => task._id === taskId ? response.data : task)
        );
        alert("🚀 Task started! Progress tracked.");
      }
    } catch (err) {
      console.error("Error starting task:", err);
      alert(err.response?.data?.error || "Failed to start task. Please try again.");
    }
  };

  // State filtering matrix arrays
  const openTasks = tasks.filter(t => t.status === 'open' || !t.status);
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Loading State Spinner Component
  if (loading && tasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="font-bold text-gray-600">Loading Campus Tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 selection:bg-blue-100 font-sans">
      
      {/* Header Viewport Box */}
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            Active Tasks ({openTasks.length})
          </h1>
          <p className="text-gray-500 font-medium">Complete tasks, earn Hub Points, and get paid.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/')} 
          className="rounded-2xl gap-2 border-gray-200 hover:bg-gray-100 px-6 py-2 font-bold"
        >
          <ArrowLeft size={18} /> Back
        </Button>
      </header>

      {/* Dynamic Summary Dashboard Statistics Metrics */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card className="bg-white rounded-[2rem] border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-green-100 text-green-600 p-3 rounded-2xl"><CheckCircle /></div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">Completed</p>
              <h3 className="text-2xl font-black text-gray-800">{completedTasks.length || 12} Tasks</h3>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-[2rem] border-none shadow-sm">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="bg-orange-100 text-orange-600 p-3 rounded-2xl"><Clock /></div>
            <div>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">In Progress</p>
              <h3 className="text-2xl font-black text-gray-800">{inProgressTasks.length} Tasks</h3>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Main Execution Content Container */}
      <main className="max-w-6xl mx-auto space-y-12 pb-20">
        
        {/* SECTION 1: USER RUNNING WORKLOAD (IN PROGRESS) */}
        {inProgressTasks.length > 0 && (
          <section>
            <h2 className="text-2xl font-black text-amber-500 mb-6 flex items-center gap-2">
              <span>⚡ Tasks You Are Working On</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressTasks.map((task) => (
                <Card 
                  key={task._id} 
                  className="rounded-[2.5rem] border-2 border-amber-300 shadow-sm relative overflow-hidden bg-white flex flex-col justify-between"
                >
                  <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-black px-4 py-1.5 rounded-bl-2xl uppercase tracking-widest">
                    Active
                  </div>
                  <CardContent className="p-8 flex flex-col h-full justify-between mt-2">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <span className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700">
                          In Progress
                        </span>
                        <div className="flex items-center text-emerald-600 font-black mr-12">
                          <DollarSign size={16} />
                          <span>{task.budget || task.reward}</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-black text-gray-800 mb-2">{task.title}</h3>
                      <p className="text-gray-500 text-sm mb-4 font-medium line-clamp-2">
                        {task.description || "No project documentation description specified."}
                      </p>
                    </div>
                    <div className="border-t pt-4 border-gray-100 flex justify-between items-center text-xs font-bold text-gray-400">
                      <span>💎 {task.points || 0} Hub Points</span>
                      <span>Ends in {task.deadline || "Flexible"}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 2: AVAILABLE MARKETPLACE INDEX */}
        <section>
          <h2 className="text-2xl font-black text-gray-900 mb-6">💼 Available Marketplace Tasks</h2>
          {openTasks.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-gray-200">
              <p className="text-gray-400 font-bold italic text-md">All caught up! No open tasks matching this pool criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {openTasks.map((task) => (
                <Card 
                  key={task._id} 
                  className="rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all group overflow-hidden bg-white flex flex-col justify-between"
                >
                  <CardContent className="p-8 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          task.type === 'Paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {task.type || 'Campus'} Task
                        </span>
                        <div className="flex items-center text-emerald-600 font-black">
                          <DollarSign size={16} />
                          <span>{task.budget || task.reward}</span>
                        </div>
                      </div>

                      <h3 className="text-xl font-black text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                        {task.title}
                      </h3>
                      <p className="text-gray-400 text-sm mb-6 font-medium line-clamp-2">
                        {task.description || "No project summary description details mapped yet."}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="text-xs font-bold text-gray-400">
                        Difficulty: <span className="text-gray-600">{task.difficulty || "General"}</span> • Ends in {task.deadline || "N/A"}
                      </div>
                      <Button 
                        onClick={() => handleTaskAction(task._id)}
                        className="w-full py-6 rounded-2xl font-black text-md shadow-lg transition-all text-white bg-blue-600 hover:bg-blue-700 shadow-blue-50 active:scale-95"
                      >
                        {task.type === 'Paid' ? 'Start Paid Task' : 'Claim Task'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default Tasks;