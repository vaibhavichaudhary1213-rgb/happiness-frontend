// services/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "https://insight-ivy-api.onrender.com",
  timeout: 15000 // Increased timeout for free tier wake-up
});

// Request interceptor for auth and loading states
API.interceptors.request.use(
  config => {
    // Add admin token if available
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    
    // Add user ID for tracking
    const userId = localStorage.getItem('userId');
    if (userId) {
      config.headers['X-User-ID'] = userId;
    }
    
    console.log(`📤 ${config.method.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  response => {
    console.log(`✅ Response from ${response.config.url}:`, response.status);
    return response;
  },
  error => {
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      console.log("🔒 Authentication required - redirecting to login");
      // Only clear token and redirect if it's an admin route
      if (error.config.url.includes('/admin/')) {
        localStorage.removeItem('adminToken');
        // You might want to trigger a redirect here
        window.dispatchEvent(new Event('admin-unauthorized'));
      }
    }
    
    if (error.response) {
      // Server responded with error
      console.error("❌ Server error:", {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      });
    } else if (error.request) {
      // Request made but no response
      console.error("❌ No response from server - backend might be waking up");
    } else {
      // Something else happened
      console.error("❌ Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// ==================== MOOD/CHAT FUNCTIONS ====================

export const sendMoodMessage = async (text, intensity = 3, userId = null) => {
  try {
    // Get or create user ID
    const actualUserId = userId || getOrCreateUserId();
    
    console.log("📤 Sending message to /mood/analyze:", text);
    
    const response = await API.post("/mood/analyze", {
      user_id: actualUserId,
      text: text,
      intensity: intensity
    });

    console.log("✅ Received response:", response.data);
    
    // Track this activity in the background
    trackUserActivity('mood_message', { text, intensity }).catch(() => {});
    
    return response.data;

  } catch (error) {
    // Friendly fallback
    return { 
      error: "Connection problem",
      chatbot_response: "I'm having trouble connecting. Please try again in a moment."
    };
  }
};

// ==================== ADMIN FUNCTIONS ====================

/**
 * Admin login
 */
export const adminLogin = async (password) => {
  try {
    const response = await API.post("/admin/login", null, {
      params: { password }
    });
    
    if (response.data.success && response.data.token) {
      localStorage.setItem('adminToken', response.data.token);
      return { success: true };
    }
    return { success: false, error: "Invalid response from server" };
  } catch (error) {
    console.error("Admin login error:", error);
    return { 
      success: false, 
      error: error.response?.data?.detail || "Login failed" 
    };
  }
};

/**
 * Check if admin is authenticated
 */
export const isAdminAuthenticated = () => {
  return !!localStorage.getItem('adminToken');
};

/**
 * Admin logout
 */
export const adminLogout = () => {
  localStorage.removeItem('adminToken');
};

/**
 * Get admin dashboard statistics
 */
export const getAdminStats = async () => {
  try {
    const response = await API.get("/admin/stats");
    console.log("📊 Admin stats received:", response.data);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    throw error;
  }
};

/**
 * Get recent reflections for admin
 */
export const getRecentReflections = async () => {
  try {
    const response = await API.get("/admin/stats");
    return { reflections: response.data.recentReflections || [] };
  } catch (error) {
    console.error("Failed to fetch reflections:", error);
    return { reflections: [] };
  }
};

/**
 * Get learning goals for admin
 */
export const getLearningGoals = async () => {
  try {
    const response = await API.get("/admin/stats");
    return { goals: response.data.learningGoals || [] };
  } catch (error) {
    console.error("Failed to fetch goals:", error);
    return { goals: [] };
  }
};

/**
 * Add a new goal (admin only)
 */
export const addGoal = async (goalText) => {
  try {
    const response = await API.post("/admin/goals", { text: goalText });
    return { success: true, goal: response.data.goal };
  } catch (error) {
    console.error("Failed to add goal:", error);
    return { success: false };
  }
};

/**
 * Toggle goal completion (admin only)
 */
export const toggleGoal = async (goalId) => {
  try {
    await API.post(`/admin/goals/${goalId}/toggle`);
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle goal:", error);
    return { success: false };
  }
};

// ==================== USER TRACKING FUNCTIONS ====================

/**
 * Get or create a user ID for tracking
 */
export const getOrCreateUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('userId', userId);
    
    // Track new user signup in background
    trackUserActivity('signup', {}).catch(() => {});
  }
  return userId;
};

/**
 * Track user activity
 */
export const trackUserActivity = async (activityType, activityData = {}) => {
  const userId = getOrCreateUserId();
  
  try {
    await API.post("/admin/track/user", {
      user_id: userId,
      activity_type: activityType,
      activity_data: activityData
    });
    return true;
  } catch (error) {
    console.warn("Failed to track activity:", error.message);
    return false;
  }
};

/**
 * Track page view / session
 */
export const trackPageView = async (pageName) => {
  return trackUserActivity('page_view', { page: pageName });
};

// ==================== UTILITY FUNCTIONS ====================

/**
 * Check backend health
 */
export const checkBackendHealth = async () => {
  try {
    const response = await API.get('/');
    return { 
      online: true, 
      data: response.data,
      message: "Backend is online"
    };
  } catch (error) {
    console.warn("Backend health check failed:", error.message);
    return { 
      online: false, 
      message: "Backend is waking up or unavailable"
    };
  }
};

/**
 * Get analytics (original function)
 */
export const getAnalytics = async () => {
  try {
    const response = await API.get("/analytics");
    return response.data;
  } catch (error) {
    console.error("Analytics error:", error);
    throw error;
  }
};

/**
 * Generate CSV export of admin data
 */
export const generateAdminCSV = (data) => {
  const { stats, reflections, goals } = data;
  
  let csv = 'Admin Dashboard Export\n';
  csv += `Generated: ${new Date().toLocaleString()}\n`;
  csv += `Backend: https://insight-ivy-api.onrender.com\n\n`;
  
  // Statistics section
  csv += '=== STATISTICS ===\n';
  csv += `Unique Users,${stats?.uniqueUsers || 0}\n`;
  csv += `Active Today,${stats?.activeToday || 0}\n`;
  csv += `Total Activities,${stats?.activitiesCompleted || 0}\n`;
  csv += `Activities Today,${stats?.activitiesToday || 0}\n`;
  csv += `Total Sessions,${stats?.totalSessions || 0}\n`;
  csv += `New Signups (Week),${stats?.signups || 0}\n`;
  csv += `Last Updated,${stats?.timestamp || 'N/A'}\n\n`;
  
  // Reflections section
  csv += '=== RECENT REFLECTIONS ===\n';
  csv += 'Question,Answer,Date,User ID\n';
  if (reflections && reflections.length > 0) {
    reflections.forEach(r => {
      // Escape quotes and commas in text fields
      const question = r.question?.replace(/"/g, '""') || '';
      const answer = r.answer?.replace(/"/g, '""') || '';
      csv += `"${question}","${answer}",${r.date || ''},${r.user_id || ''}\n`;
    });
  } else {
    csv += 'No reflections available\n';
  }
  csv += '\n';
  
  // Goals section
  csv += '=== LEARNING GOALS ===\n';
  csv += 'Goal,Completed,User ID\n';
  if (goals && goals.length > 0) {
    goals.forEach(g => {
      const text = g.text?.replace(/"/g, '""') || '';
      csv += `"${text}",${g.completed ? 'Yes' : 'No'},${g.user_id || ''}\n`;
    });
  } else {
    csv += 'No goals available\n';
  }
  
  return csv;
};

/**
 * Download data as CSV file
 */
export const downloadCSV = (csvContent, filename = null) => {
  if (!filename) {
    filename = `admin-export-${new Date().toISOString().split('T')[0]}.csv`;
  }
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Listen for unauthorized events (for redirect)
 */
export const setupAuthListener = (callback) => {
  window.addEventListener('admin-unauthorized', callback);
  return () => window.removeEventListener('admin-unauthorized', callback);
};

// Initialize user ID on module load
getOrCreateUserId();

export default API;