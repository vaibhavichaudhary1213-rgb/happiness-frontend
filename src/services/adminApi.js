// services/adminApi.js - SIMPLIFIED, NO MOCK DATA
import axios from "axios";

// Track users in localStorage
const getLocalUsers = () => {
  // Get all users from localStorage
  const users = JSON.parse(localStorage.getItem('ivyInsightUsers') || '[]');
  const sessions = JSON.parse(localStorage.getItem('ivyInsightSessions') || '{}');
  const activities = JSON.parse(localStorage.getItem('ivyInsightActivities') || '[]');
  
  return {
    uniqueUsers: users.length,
    activitiesCompleted: activities.length,
    totalSessions: Object.values(sessions).reduce((a, b) => a + b, 0),
    signups: users.length
  };
};

// Get admin stats - reads from REAL localStorage data
export const getAdminStats = async () => {
  console.log("📊 Reading real user data from browser...");
  return getLocalUsers();
};

// Get recent reflections
export const getRecentReflections = async () => {
  const reflections = JSON.parse(localStorage.getItem('ivyInsightReflections') || '[]');
  return { reflections: reflections.slice(-5).reverse() }; // Last 5, newest first
};

// Get learning goals
export const getLearningGoals = async () => {
  const goals = JSON.parse(localStorage.getItem('ivyInsightGoals') || '[]');
  return { goals };
};

// Add goal
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

// Toggle goal
export const toggleGoal = async (goalId) => {
  const goals = JSON.parse(localStorage.getItem('ivyInsightGoals') || '[]');
  const updatedGoals = goals.map(g => 
    g.id === goalId ? { ...g, completed: !g.completed } : g
  );
  localStorage.setItem('ivyInsightGoals', JSON.stringify(updatedGoals));
  return { success: true };
};

// Track new user
export const trackUser = (userData) => {
  const users = JSON.parse(localStorage.getItem('ivyInsightUsers') || '[]');
  const newUser = {
    id: Date.now(),
    ...userData,
    joinedAt: new Date().toISOString()
  };
  users.push(newUser);
  localStorage.setItem('ivyInsightUsers', JSON.stringify(users));
};

// Track activity
export const trackActivity = (activityData) => {
  const activities = JSON.parse(localStorage.getItem('ivyInsightActivities') || '[]');
  activities.push({
    id: Date.now(),
    ...activityData,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('ivyInsightActivities', JSON.stringify(activities));
};

// Track session
export const trackSession = (userId) => {
  const sessions = JSON.parse(localStorage.getItem('ivyInsightSessions') || '{}');
  sessions[userId] = (sessions[userId] || 0) + 1;
  localStorage.setItem('ivyInsightSessions', JSON.stringify(sessions));
};