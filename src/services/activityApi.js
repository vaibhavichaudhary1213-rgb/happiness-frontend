// services/activityApi.js
import axios from "axios";

// Person 2's backend
const ACTIVITY_API = axios.create({
  baseURL: "https://insight-ivy-api.onrender.com",
  timeout: 10000
});

// Helper function to map emotion to category
const mapEmotionToCategory = (emotion) => {
  const categoryMap = {
    happy: 'celebration',
    sad: 'comfort',
    anxious: 'calming',
    angry: 'release',
    calm: 'mindfulness',
    excited: 'energy',
    grateful: 'reflection',
    tired: 'rest'
  };
  return categoryMap[emotion?.toLowerCase()] || 'wellness';
};

// Helper function to get activity type from name
const getTypeFromActivity = (activityName) => {
  const typeMap = {
    'breathing': 'meditation',
    'deep breathing': 'meditation',
    'kind': 'kindness',
    'gratitude': 'gratitude',
    'write': 'reflection',
    'music': 'music',
    'movie': 'movie',
    'food': 'food',
    'drink': 'drink',
    'place': 'place'
  };
  
  const lowercaseName = activityName?.toLowerCase() || '';
  for (const [key, value] of Object.entries(typeMap)) {
    if (lowercaseName.includes(key)) {
      return value;
    }
  }
  return 'mindfulness';
};

// Get activity suggestions based on emotion and intensity
export const suggestActivity = async (emotion, intensity) => {
  try {
    console.log("🎯 Fetching activity for:", { emotion, intensity });
    
    const response = await ACTIVITY_API.post("/activities/suggest", {
      emotion: emotion,
      intensity: intensity
    });

    console.log("✅ Activity suggestion received:", response.data);
    
    const data = response.data;
    
    // Format response to include activities array
    return {
      activities: [{
        id: `backend-${Date.now()}`,
        type: getTypeFromActivity(data.recommended_activity),
        name: data.recommended_activity || "Mindful moment",
        description: data.description || "Take a moment to breathe",
        duration: data.default_duration_minutes || 5,
        category: mapEmotionToCategory(emotion),
        followUpPrompt: data.follow_up_prompt
      }],
      recommended_activity: data.recommended_activity,
      description: data.description,
      default_duration_minutes: data.default_duration_minutes,
      follow_up_prompt: data.follow_up_prompt,
      raw: data
    };

  } catch (error) {
    console.error("❌ Activity suggestion error:", error);
    return { 
      error: "Could not fetch activity suggestion",
      activities: [],
      recommended_activity: "Take a mindful moment",
      description: "Sometimes the best activity is just pausing and breathing.",
      default_duration_minutes: 5
    };
  }
};

// Start an activity with chosen duration
export const startActivity = async (activityName, chosenDuration, userId = "user_1") => {
  try {
    const response = await ACTIVITY_API.post("/activities/start", {
      activity_name: activityName,
      chosen_duration_minutes: chosenDuration,
      user_id: userId
    });

    console.log("✅ Activity started:", response.data);
    return response.data;

  } catch (error) {
    console.error("❌ Start activity error:", error);
    throw error;
  }
};

// Complete an activity and get rewards
export const completeActivity = async (userId = "user_1", activityName = null, duration = null) => {
  try {
    // Prepare the data based on what the backend expects
    const payload = {
      user_id: userId,
      completed: true,
      timestamp: new Date().toISOString()
    };
    
    // Add optional fields if provided
    if (activityName) payload.activity_name = activityName;
    if (duration) payload.duration_completed = duration;
    
    const response = await ACTIVITY_API.post("/activities/complete", payload);
    
    console.log("✅ Activity completed! Rewards:", response.data);
    return response.data;

  } catch (error) {
    console.error("❌ Complete activity error:", error);
    
    // If the error is about missing data, return a mock reward
    if (error.response?.status === 422) {
      console.log("⚠️ Backend expects specific data, using mock rewards");
      return {
        message: "Great job completing the activity!",
        rewards: {
          points: 50,
          badge: "Mindfulness Beginner",
          streak: 1
        }
      };
    }
    
    throw error;
  }
};

// Check backend health
export const checkActivityBackend = async () => {
  try {
    const response = await ACTIVITY_API.get("/health");
    return { online: true, ...response.data };
  } catch (error) {
    return { online: false, error: error.message };
  }
};