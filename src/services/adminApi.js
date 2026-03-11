// services/adminApi.js - COMPLETE FIXED VERSION
import api from './api';

// Admin login
export const adminLogin = async (password) => {
  console.log('🔵 Attempting login with password:', password);
  
  try {
    const response = await api.post('/admin/login', { password });
    console.log('🔵 Login response:', response.data);
    
    // Check if response has the expected structure
    if (response.data && response.data.success && response.data.token) {
      // Store token in localStorage
      localStorage.setItem('adminToken', response.data.token);
      console.log('🔵 Token stored successfully');
      return { success: true };
    } else {
      console.error('🔴 Unexpected response format:', response.data);
      return { success: false, error: 'Invalid server response' };
    }
  } catch (error) {
    console.error('🔴 Login error:', error.response?.data || error.message);
    
    // Provide specific error message based on response
    if (error.response?.status === 401) {
      return { success: false, error: 'Invalid password' };
    } else if (error.response?.status === 422) {
      return { success: false, error: 'Invalid request format' };
    } else {
      return { success: false, error: 'Connection error. Please try again.' };
    }
  }
};

// Check if admin is authenticated
export const isAdminAuthenticated = () => {
  const token = localStorage.getItem('adminToken');
  console.log('🔵 Checking authentication, token exists:', !!token);
  return !!token;
};

// Logout
export const adminLogout = () => {
  console.log('🔵 Logging out, removing token');
  localStorage.removeItem('adminToken');
};

// Get REAL admin stats from backend
export const getAdminStats = async () => {
  console.log('🔵 Fetching admin stats');
  try {
    const response = await api.get('/admin/stats');
    console.log('🔵 Stats received:', response.data);
    
    return {
      uniqueUsers: response.data.uniqueUsers || 0,
      activitiesCompleted: response.data.activitiesCompleted || 0,
      totalSessions: response.data.totalSessions || 0,
      signups: response.data.signups || 0,
      activeToday: response.data.activeToday || 0,
      activitiesToday: response.data.activitiesToday || 0
    };
  } catch (error) {
    console.error("🔴 Failed to fetch stats:", error.response?.data || error.message);
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
    const response = await api.get('/admin/stats');
    return { 
      reflections: response.data.recentReflections || [] 
    };
  } catch (error) {
    console.error("🔴 Failed to fetch reflections:", error);
    return { reflections: [] };
  }
};

// Get learning goals from backend
export const getLearningGoals = async () => {
  try {
    const response = await api.get('/admin/stats');
    return { 
      goals: response.data.learningGoals || [] 
    };
  } catch (error) {
    console.error("🔴 Failed to fetch goals:", error);
    return { goals: [] };
  }
};

// Add a new goal
export const addGoal = async (goalText) => {
  try {
    const response = await api.post('/admin/goals', { text: goalText });
    return { success: true, goal: response.data.goal };
  } catch (error) {
    console.error("🔴 Failed to add goal:", error);
    return { success: false };
  }
};

// Toggle goal completion
export const toggleGoal = async (goalId) => {
  try {
    await api.post(`/admin/goals/${goalId}/toggle`);
    return { success: true };
  } catch (error) {
    console.error("🔴 Failed to toggle goal:", error);
    return { success: false };
  }
};

// Track user activity
export const trackUserActivity = async (activityType, activityData) => {
  const userId = localStorage.getItem('userId') || generateUserId();
  
  try {
    await api.post('/admin/track/user', {
      user_id: userId,
      activity_type: activityType,
      activity_data: activityData
    });
  } catch (error) {
    console.error("🔴 Failed to track activity:", error);
  }
};

// Generate consistent user ID
function generateUserId() {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
    console.log('🔵 Generated new user ID:', userId);
  }
  return userId;
}