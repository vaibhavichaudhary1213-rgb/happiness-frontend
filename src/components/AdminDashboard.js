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
        <div className="reflections-card">
          <h3>Recent Reflections</h3>
          {reflections.length === 0 ? (
            <p className="no-data">No reflections yet</p>
          ) : (
            reflections.map((ref, idx) => (
              <div key={idx} className="reflection-item">
                <p className="reflection-question">{ref.question}</p>
                <p className="reflection-answer">{ref.answer}</p>
                <p className="reflection-date">{ref.date} - User: {ref.user_id?.substring(0, 8)}</p>
              </div>
            ))
          )}
        </div>

        {/* Learning Goals */}
        <div className="goals-card">
          <h3>Learning Goals</h3>
          {goals.length === 0 ? (
            <p className="no-data">No goals yet</p>
          ) : (
            goals.map(goal => (
              <div key={goal.id} className="goal-item">
                <input
                  type="checkbox"
                  checked={goal.completed}
                  onChange={() => handleToggleGoal(goal.id)}
                />
                <span className={goal.completed ? 'completed' : ''}>
                  {goal.text}
                </span>
              </div>
            ))
          )}
          
          {goals.length > 0 && (
            <div className="progress-section">
              <p>Progress: {completedCount}/{goals.length} completed</p>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(completedCount/goals.length)*100}%` }}
                />
              </div>
            </div>
          )}

          <div className="add-goal">
            <input
              type="text"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              placeholder="+ Add Goal"
              onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
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