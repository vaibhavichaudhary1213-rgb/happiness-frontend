import axios from "axios";

const API = axios.create({
  baseURL:  "https://insight-ivy-api.onrender.com",
  timeout: 10000
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
    console.log("📤 Sending message:", text);
    
    const response = await API.post("/mood/analyze", {
      user_id: userId,
      text: text,
      intensity: intensity
    });

    console.log("✅ Received response:", response.data);
    
    return response.data;

  } catch (error) {
    console.error("❌ API Error:", error.message);
    return { 
      error: "Connection problem",
      chatbot_response: "I'm having trouble connecting. Please try again in a moment."
    };
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

