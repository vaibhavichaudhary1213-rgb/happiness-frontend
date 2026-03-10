// services/adminApi.js
import { userTracking } from './userTracking';

// Get admin stats from REAL user tracking data
export const getAdminStats = async () => {
  console.log("📊 Reading real user data from tracking...");
  
  const stats = userTracking.getUserStats();
  
  return {
    uniqueUsers: stats.uniqueDevices || 0,
    activitiesCompleted: stats.totalActivities || 0,
    totalSessions: stats.totalSessions || 0,
    signups: stats.totalSignups || 0
  };
};

// Get recent reflections from localStorage
export const getRecentReflections = async () => {
  // Get reflections from tracking data or localStorage
  const reflections = JSON.parse(localStorage.getItem('ivyInsightReflections') || '[]');
  
  // If no reflections yet, return empty array (no mock data)
  return { 
    reflections: reflections.slice(-5).reverse() // Last 5, newest first
  };
};

// Get learning goals from localStorage
export const getLearningGoals = async () => {
  const goals = JSON.parse(localStorage.getItem('ivyInsightGoals') || '[]');
  return { goals };
};

// Add a new goal
export const addGoal = async (goalText) => {
  const goals = JSON.parse(localStorage.getItem('ivyInsightGoals') || '[]');
  const newGoal = {
    id: Date.now(),
    text: goalText,
    completed: false,
    createdAt: new Date().toISOString()
  };
  goals.push(newGoal);
  localStorage.setItem('ivyInsightGoals', JSON.stringify(goals));
  return { success: true, goal: newGoal };
};

// Toggle goal completion status
export const toggleGoal = async (goalId) => {
  const goals = JSON.parse(localStorage.getItem('ivyInsightGoals') || '[]');
  const updatedGoals = goals.map(g => 
    g.id === goalId ? { ...g, completed: !g.completed } : g
  );
  localStorage.setItem('ivyInsightGoals', JSON.stringify(updatedGoals));
  return { success: true };
};

// Save a reflection
export const saveReflection = async (question, answer) => {
  const reflections = JSON.parse(localStorage.getItem('ivyInsightReflections') || '[]');
  const newReflection = {
    id: Date.now(),
    question,
    answer,
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    timestamp: new Date().toISOString()
  };
  reflections.push(newReflection);
  localStorage.setItem('ivyInsightReflections', JSON.stringify(reflections));
  return { success: true, reflection: newReflection };
};

// Get combined dashboard data
export const getDashboardData = async () => {
  const [stats, reflections, goals] = await Promise.all([
    getAdminStats(),
    getRecentReflections(),
    getLearningGoals()
  ]);
  
  return {
    stats,
    reflections: reflections.reflections,
    goals: goals.goals
  };
};

// Track user activity (wrapper for userTracking)
export const trackUserActivity = (activityName, duration) => {
  const userId = userTracking.getUserId();
  userTracking.trackActivity(userId, activityName, duration, true);
};

// Track page view / session
export const trackPageView = () => {
  userTracking.trackSession('page_view');
};

// Export all functions
export default {
  getAdminStats,
  getRecentReflections,
  getLearningGoals,
  addGoal,
  toggleGoal,
  saveReflection,
  getDashboardData,
  trackUserActivity,
  trackPageView
};