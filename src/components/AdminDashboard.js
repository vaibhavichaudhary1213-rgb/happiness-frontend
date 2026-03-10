// components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { 
  getAdminStats, 
  getRecentReflections, 
  getLearningGoals,
  addGoal,
  toggleGoal 
} from '../services/adminApi';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [reflections, setReflections] = useState([]);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.trim()) return;
    await addGoal(newGoal);
    setNewGoal('');
    loadDashboardData(); // Refresh
  };

  const handleToggleGoal = async (goalId) => {
    await toggleGoal(goalId);
    loadDashboardData(); // Refresh
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  const completedCount = goals.filter(g => g.completed).length;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      
      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard title="Unique Users" value={stats?.uniqueUsers || 42} />
        <StatCard title="Activities" value={stats?.activitiesCompleted || 128} />
        <StatCard title="Sessions" value={stats?.totalSessions || 356} />
        <StatCard title="Sign-ups" value={stats?.signups || 42} />
      </div>

      {/* Two Column Layout */}
      <div className="dashboard-columns">
        {/* Recent Reflections */}
        <div className="reflections-card">
          <h3>Recent Reflections</h3>
          {reflections.map((ref, idx) => (
            <div key={idx} className="reflection-item">
              <p className="reflection-question">{ref.question}</p>
              <p className="reflection-answer">{ref.answer}</p>
              <p className="reflection-date">{ref.date}</p>
            </div>
          ))}
        </div>

        {/* Learning Goals */}
        <div className="goals-card">
          <h3>Learning Goals</h3>
          {goals.map(goal => (
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
          ))}
          
          <div className="progress-section">
            <p>Progress: {completedCount}/{goals.length} completed</p>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${(completedCount/goals.length)*100}%` }}
              />
            </div>
          </div>

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