// services/adminApi.js - FIXED VERSION
import api from './api';

// Admin login
export const adminLogin = async (password) => {
  try {
    const result = await api.post('/admin/login', { password });
    api.setToken(result.token);
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Invalid password' };
  }
};

// Check if admin is authenticated
export const isAdminAuthenticated = () => {
  return !!localStorage.getItem('adminToken');
};

// Logout
export const adminLogout = () => {
  localStorage.removeItem('adminToken');
};

// Get REAL admin stats from backend
export const getAdminStats = async () => {
  try {
    const data = await api.get('/admin/stats');
    console.log("📊 Real backend stats:", data);
    
    return {
      uniqueUsers: data.uniqueUsers || 0,
      activitiesCompleted: data.activitiesCompleted || 0,
      totalSessions: data.totalSessions || 0,
      signups: data.signups || 0,
      activeToday: data.activeToday || 0,
      activitiesToday: data.activitiesToday || 0
    };
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    // Return zeros instead of mock data
    return {
      uniqueUsers: 0,
      activitiesCompleted: 0,
      totalSessions: 0,
      signups: 0,
      activeToday: 0,
      activitiesToday: 0
    };
  }
};

// Get recent reflections from backend
export const getRecentReflections = async () => {
  try {
    const data = await api.get('/admin/stats'); // Stats already includes reflections
    return { 
      reflections: data.recentReflections || [] 
    };
  } catch (error) {
    console.error("Failed to fetch reflections:", error);
    return { reflections: [] };
  }
};

// Get learning goals from backend
export const getLearningGoals = async () => {
  try {
    const data = await api.get('/admin/stats'); // Stats already includes goals
    return { 
      goals: data.learningGoals || [] 
    };
  } catch (error) {
    console.error("Failed to fetch goals:", error);
    return { goals: [] };
  }
};

// Add a new goal
export const addGoal = async (goalText) => {
  try {
    const result = await api.post('/admin/goals', { text: goalText });
    return { success: true, goal: result.goal };
  } catch (error) {
    console.error("Failed to add goal:", error);
    return { success: false };
  }
};

// Toggle goal completion
export const toggleGoal = async (goalId) => {
  try {
    const result = await api.post(`/admin/goals/${goalId}/toggle`);
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle goal:", error);
    return { success: false };
  }
};

// Track user activity (called from other components)
export const trackUserActivity = async (activityType, activityData) => {
  const userId = localStorage.getItem('userId') || generateUserId();
  
  try {
    await api.post('/admin/track/user', {
      user_id: userId,
      activity_type: activityType,
      activity_data: activityData
    });
  } catch (error) {
    console.error("Failed to track activity:", error);
  }
};

// Generate consistent user ID
function generateUserId() {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
  }
  return userId;
}