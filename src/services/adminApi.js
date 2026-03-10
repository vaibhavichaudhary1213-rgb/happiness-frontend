// services/adminApi.js
import { userTracking } from './userTracking';

// Mock data for fallback
const MOCK_DATA = {
  reflections: [
    { id: 1, question: "What made you smile today?", answer: "Seeing a puppy at the park", date: "Mar 9" },
    { id: 2, question: "What's a small pleasure you enjoyed?", answer: "Morning coffee in silence", date: "Mar 8" },
    { id: 3, question: "What memory warms your heart?", answer: "Childhood beach trips with family", date: "Mar 7" }
  ],
  goals: [
    { id: 1, text: "Read 12 books this year", completed: false },
    { id: 2, text: "Learn meditation basics", completed: false },
    { id: 3, text: "Practice daily journaling", completed: false }
  ]
};

// Get admin stats - NOW WITH REAL UNIQUE DEVICES
export const getAdminStats = async () => {
  console.log("📊 Reading real user data...");
  
  const stats = userTracking.getUserStats();
  
  return {
    uniqueUsers: stats.uniqueDevices, // This is now REAL unique devices/browsers
    activitiesCompleted: stats.totalActivities,
    totalSessions: stats.totalSessions,
    signups: stats.totalSignups // This is actual sign-ups
  };
};

// Get recent reflections
export const getRecentReflections = async () => {
  return { reflections: MOCK_DATA.reflections };
};

// Get learning goals
export const getLearningGoals = async () => {
  return { goals: MOCK_DATA.goals };
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