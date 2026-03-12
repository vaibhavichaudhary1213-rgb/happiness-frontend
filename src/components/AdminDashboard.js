// components/AdminDashboard.js - UPDATED WITH AUTH
import React, { useState, useEffect } from 'react';
import { 
  getAdminStats, 
  getRecentReflections, 
  getLearningGoals,
  addGoal,
  toggleGoal,
  isAdminAuthenticated,
  adminLogout
} from '../services/adminApi';
import AdminLogin from './AdminLogin';
import AdminCSVExport from './AdminCSVExport';
import '../styles/global.css';

function AdminDashboard() {
  const [authenticated, setAuthenticated] = useState(isAdminAuthenticated());
  const [stats, setStats] = useState(null);
  const [reflections, setReflections] = useState([]);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authenticated) {
      loadDashboardData();
    }
  }, [authenticated]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, reflectionsData, goalsData] = await Promise.all([
        getAdminStats(),
        getRecentReflections(),
        getLearningGoals()
      ]);
      
      setStats(statsData);
      setReflections(reflectionsData.reflections || []);
      setGoals(goalsData.goals || []);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.trim()) return;
    await addGoal(newGoal);
    setNewGoal('');
    loadDashboardData();
  };

  const handleToggleGoal = async (goalId) => {
    await toggleGoal(goalId);
    loadDashboardData();
  };

  const handleLogout = () => {
    adminLogout();
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  const completedCount = goals.filter(g => g.completed).length;

  return (
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h2>Admin Dashboard</h2>
        <div className="header-actions">
          <AdminCSVExport data={{ stats, reflections, goals }} />
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard title="Unique Users" value={stats?.uniqueUsers || 0} />
        <StatCard title="Activities" value={stats?.activitiesCompleted || 0} />
        <StatCard title="Sessions" value={stats?.totalSessions || 0} />
        <StatCard title="Sign-ups (This Week)" value={stats?.signups || 0} />
        <StatCard title="Active Today" value={stats?.activeToday || 0} />
        <StatCard title="Activities Today" value={stats?.activitiesToday || 0} />
      </div>

      {/* Two Column Layout */}
      <div className="dashboard-columns">
        {/* Recent Reflections */}
        {/* Recent Reflections - UPDATED WITH PURPLE THEME */}
<div className="reflections-card">
  <h3 className="text-whisper-dark-purple">Recent Reflections</h3>
  {reflections.map((ref, idx) => (
    <div key={idx} className="reflection-item">
      <p className="reflection-question text-whisper-dark-purple">
        {ref.question}
      </p>
      <p className="reflection-answer text-whisper-deep-purple">
        {ref.answer}
      </p>
      <p className="reflection-date text-whisper-secondary">
        {ref.date}
      </p>
    </div>
  ))}
</div>

        {/* Learning Goals */}
        {/* Learning Goals - UPDATED WITH PURPLE THEME */}
<div className="goals-card">
  <h3 className="text-whisper-dark-purple">Learning Goals</h3>
  
  {goals.map((goal) => (
    <div key={goal.id} className={`goal-item ${goal.completed ? 'completed' : ''}`}>
      <input 
        type="checkbox" 
        checked={goal.completed}
        onChange={() => handleToggleGoal(goal.id)}
        className="goal-checkbox"
        style={{ accentColor: '#6B46C1' }}
      />
      <span className={`goal-text ${goal.completed ? 'completed' : 'text-whisper-dark-purple'}`}>
        {goal.text}
      </span>
    </div>
  ))}

  {/* Progress Section */}
  <div className="progress-section">
    <p className="text-whisper-dark-purple">
      Progress: {completedCount}/{goals.length} completed
    </p>
    <div className="progress-bar-bg">
      <div 
        className="progress-bar-fill"
        style={{ 
          width: `${(completedCount/goals.length)*100}%`,
          background: '#6B46C1' 
        }}
      />
    </div>
  </div>

  {/* Add Goal Input */}
  <div className="add-goal">
    <input
      type="text"
      value={newGoal}
      onChange={(e) => setNewGoal(e.target.value)}
      placeholder="+ Add Goal"
      onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
      className="whisper-input"
      style={{ color: '#9F7AEA' }}
    />
  </div>
</div>
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

export default AdminDashboard;