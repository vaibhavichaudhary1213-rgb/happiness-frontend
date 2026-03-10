import axios from "axios";

const API = axios.create({
  baseURL: "https://insight-ivy-api.onrender.com",
  timeout: 15000 // Consider increasing timeout to 15 seconds for free tier wake-up
});

// Request interceptor for loading states
API.interceptors.request.use(
  config => {
    // You can add loading state management here
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
API.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response) {
      // Server responded with error
      console.error("Server error:", error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error("No response from server");
    } else {
      // Something else happened
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export const sendMoodMessage = async (text, intensity = 3, userId = "user_1") => {
  try {
    console.log("📤 Sending message to /mood/analyze:", text);
    
    const response = await API.post("/mood/analyze", {
      user_id: userId,
      text: text,
      intensity: intensity
    });

    console.log("✅ Received response:", response.data);
    return response.data;

  } catch (error) {
    // More specific error logging
    if (error.code === 'ECONNABORTED') {
      console.error("❌ Request timeout - backend might be waking up");
    } else if (error.response?.status === 422) {
      console.error("❌ Data format error:", error.response.data);
    } else {
      console.error("❌ API Error:", error.message);
    }
    
    // Keep your friendly fallback
    return { 
      error: "Connection problem",
      chatbot_response: "I'm having trouble connecting. Please try again in a moment."
    };
  }
};

// Add a simple health check function
export const checkBackendHealth = async () => {
  try {
    // The root endpoint (/) works and returns the API info
    const response = await API.get('/');
    return { online: true, data: response.data };
  } catch (error) {
    console.warn("Backend health check failed:", error.message);
    return { online: false };
  }
};

export const getAnalytics = async () => {
  try {
    const response = await API.get("/analytics");
    return response.data;
  } catch (error) {
    console.error("Analytics error:", error);
    throw error;
  }
};

export default API;