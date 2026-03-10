// services/activityApi.js
import axios from "axios";

// Person 2's backend - using the working backend URL
const ACTIVITY_API = axios.create({
  baseURL: "https://insight-ivy-api.onrender.com",
  timeout: 10000
});

// Helper function to map emotion to the appropriate backend endpoint
const mapEmotionToEndpoint = (emotion) => {
  const endpointMap = {
    happy: '/growth/joy/',
    excited: '/growth/joy/',
    grateful: '/growth/gratitude/',
    appreciative: '/growth/appreciation/',
    kind: '/growth/kindness/',
    sad: '/growth/emotional/prompt',
    anxious: '/growth/emotional/prompt',
    angry: '/growth/emotional/prompt',
    stressed: '/growth/emotional/prompt',
    calm: '/wellness/habits/',
    tired: '/wellness/track/sleep',
    sleepy: '/wellness/track/sleep',
    energetic: '/wellness/track/exercise',
    thirsty: '/wellness/track/water',
    reflective: '/growth/student/prompt',
    thoughtful: '/growth/student/prompt'
  };
  return endpointMap[emotion?.toLowerCase()] || '/wellness/happiness/';
};

// Helper function to map emotion to category for UI
const mapEmotionToCategory = (emotion) => {
  const categoryMap = {
    happy: 'joy',
    excited: 'joy',
    grateful: 'gratitude',
    appreciative: 'appreciation',
    kind: 'kindness',
    sad: 'emotional',
    anxious: 'emotional',
    angry: 'emotional',
    stressed: 'emotional',
    calm: 'mindfulness',
    tired: 'rest',
    sleepy: 'rest',
    energetic: 'energy',
    thirsty: 'self-care',
    reflective: 'reflection',
    thoughtful: 'reflection'
  };
  return categoryMap[emotion?.toLowerCase()] || 'wellness';
};

// Helper function to extract activity from response
const extractActivityFromResponse = (data, emotion, category) => {
  // Default fallback activities based on category
  const defaultActivities = {
    joy: { name: "Joyful moment", description: "Take time to appreciate something that makes you happy" },
    gratitude: { name: "Gratitude practice", description: "Write down three things you're grateful for" },
    appreciation: { name: "Self-appreciation", description: "Acknowledge something you did well today" },
    kindness: { name: "Kindness challenge", description: "Do something kind for yourself or others" },
    emotional: { name: "Emotional check-in", description: "Acknowledge and accept your feelings" },
    mindfulness: { name: "Mindful moment", description: "Take five deep breaths" },
    rest: { name: "Rest break", description: "Take a short break to recharge" },
    energy: { name: "Energizing activity", description: "Move your body for a few minutes" },
    'self-care': { name: "Self-care moment", description: "Do something nice for yourself" },
    reflection: { name: "Reflection prompt", description: "Think about what matters to you" },
    wellness: { name: "Wellness check", description: "Check in with how you're feeling" }
  };

  // If data is an array, try to extract first item
  if (Array.isArray(data) && data.length > 0) {
    const item = data[0];
    return {
      name: item.title || item.name || item.prompt || defaultActivities[category]?.name,
      description: item.description || item.content || item.tip || defaultActivities[category]?.description
    };
  }
  
  // If data is an object with prompt
  if (data.prompt) {
    return {
      name: data.title || "Reflection prompt",
      description: data.prompt
    };
  }
  
  // If data has message
  if (data.message) {
    return {
      name: "Suggestion",
      description: data.message
    };
  }
  
  // If data has activity/tip
  if (data.activity || data.tip) {
    return {
      name: data.activity || "Wellness activity",
      description: data.tip || data.description || "Take a moment for yourself"
    };
  }
  
  // Return default based on category
  return defaultActivities[category] || defaultActivities.wellness;
};

// Get activity suggestions based on emotion
export const suggestActivity = async (emotion, intensity = 3) => {
  try {
    console.log("🎯 Fetching activity for:", { emotion, intensity });
    
    const category = mapEmotionToCategory(emotion);
    const endpoint = mapEmotionToEndpoint(emotion);
    
    console.log(`📡 Using endpoint: ${endpoint} for category: ${category}`);
    
    let response;
    
    // Handle different endpoint types (GET vs POST)
    if (endpoint.includes('/track/')) {
      // POST endpoints for tracking
      const trackData = {
        user_id: "user_1",
        timestamp: new Date().toISOString()
      };
      
      // Add specific data based on endpoint
      if (endpoint.includes('sleep')) {
        trackData.hours = 7;
      } else if (endpoint.includes('exercise')) {
        trackData.minutes = 15;
        trackData.type = "walking";
      } else if (endpoint.includes('water')) {
        trackData.glasses = 2;
      }
      
      response = await ACTIVITY_API.post(endpoint, trackData);
    } else {
      // GET endpoints
      response = await ACTIVITY_API.get(endpoint);
    }

    console.log("✅ Raw response from backend:", response.data);
    
    // Extract activity from response
    const activity = extractActivityFromResponse(response.data, emotion, category);
    
    // Format response for frontend
    return {
      activities: [{
        id: `activity-${Date.now()}`,
        type: category,
        name: activity.name,
        description: activity.description,
        duration: intensity === 1 ? 2 : intensity === 2 ? 5 : intensity === 3 ? 10 : 15,
        category: category,
        followUpPrompt: "How did that activity make you feel?",
        completed: false
      }],
      recommended_activity: activity.name,
      description: activity.description,
      default_duration_minutes: intensity === 1 ? 2 : intensity === 2 ? 5 : intensity === 3 ? 10 : 15,
      follow_up_prompt: "Would you like to try this activity?",
      raw: response.data
    };

  } catch (error) {
    console.error("❌ Activity suggestion error:", error);
    
    // Provide fallback activities based on emotion
    const category = mapEmotionToCategory(emotion);
    const fallbackActivities = {
      joy: { name: "Joy List", description: "Write down three things that made you smile today" },
      gratitude: { name: "Gratitude Moment", description: "Think of one thing you're grateful for right now" },
      appreciation: { name: "Self Love", description: "Say one kind thing to yourself" },
      kindness: { name: "Kind Act", description: "Do one small kindness for yourself" },
      emotional: { name: "Feelings Check", description: "Name what you're feeling without judgment" },
      mindfulness: { name: "Deep Breaths", description: "Take five slow, deep breaths" },
      rest: { name: "Rest Break", description: "Close your eyes for two minutes" },
      energy: { name: "Gentle Stretch", description: "Stand up and stretch your arms" },
      'self-care': { name: "Self-Care", description: "Drink a glass of water" },
      reflection: { name: "Quiet Reflection", description: "Ask yourself: What do I need right now?" },
      wellness: { name: "Wellness Pause", description: "Take a moment to breathe" }
    };
    
    const fallback = fallbackActivities[category] || fallbackActivities.wellness;
    
    return { 
      error: "Using offline suggestions",
      activities: [{
        id: `fallback-${Date.now()}`,
        type: category,
        name: fallback.name,
        description: fallback.description,
        duration: intensity === 1 ? 2 : intensity === 2 ? 5 : intensity === 3 ? 10 : 15,
        category: category,
        followUpPrompt: "How did that activity make you feel?",
        completed: false
      }],
      recommended_activity: fallback.name,
      description: fallback.description,
      default_duration_minutes: intensity === 1 ? 2 : intensity === 2 ? 5 : intensity === 3 ? 10 : 15,
      offline: true
    };
  }
};

// Start an activity with chosen duration
export const startActivity = async (activityName, chosenDuration, userId = "user_1") => {
  try {
    console.log("▶️ Starting activity:", { activityName, chosenDuration, userId });
    
    // Try to log to backend if endpoint exists
    try {
      await ACTIVITY_API.post("/wellness/habits/", {
        user_id: userId,
        activity: activityName,
        duration: chosenDuration,
        start_time: new Date().toISOString()
      });
    } catch (e) {
      // Silently fail if endpoint doesn't exist
      console.log("📝 Activity start logged locally");
    }
    
    return {
      success: true,
      message: `Started ${activityName} for ${chosenDuration} minutes`,
      startTime: new Date().toISOString(),
      activity: activityName,
      duration: chosenDuration
    };

  } catch (error) {
    console.error("❌ Start activity error:", error);
    return {
      success: false,
      message: "Could not start activity",
      activity: activityName,
      duration: chosenDuration
    };
  }
};

// Complete an activity and get rewards
export const completeActivity = async (userId = "user_1", activityName = null, duration = null) => {
  try {
    console.log("✅ Completing activity:", { userId, activityName, duration });
    
    // Try to log completion to backend
    try {
      await ACTIVITY_API.post("/wellness/happiness/", {
        user_id: userId,
        mood: "completed_activity",
        note: `Completed: ${activityName || 'activity'}`,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      // Silently fail if endpoint doesn't exist
    }
    
    // Calculate rewards based on duration
    const points = duration ? Math.floor(duration * 10) : 50;
    const streak = Math.floor(Math.random() * 3) + 1; // Mock streak
    
    return {
      success: true,
      message: "Great job completing the activity!",
      rewards: {
        points: points,
        badge: points > 100 ? "Wellness Warrior" : "Mindfulness Beginner",
        streak: streak,
        xp: points
      },
      completedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error("❌ Complete activity error:", error);
    
    // Return mock rewards even if backend fails
    return {
      success: true,
      message: "Great job! Activity completed.",
      rewards: {
        points: 50,
        badge: "Mindfulness Beginner",
        streak: 1,
        xp: 50
      },
      offline: true
    };
  }
};

// Get activity history
export const getActivityHistory = async (userId = "user_1") => {
  try {
    const response = await ACTIVITY_API.get("/wellness/happiness/");
    
    if (Array.isArray(response.data)) {
      return {
        success: true,
        history: response.data.map(item => ({
          id: item.id || Date.now(),
          date: item.timestamp || item.date,
          activity: item.note || item.activity || "Wellness activity",
          mood: item.mood,
          completed: true
        }))
      };
    }
    
    return {
      success: true,
      history: []
    };

  } catch (error) {
    console.log("📊 Activity history not available");
    return {
      success: true,
      history: []
    };
  }
};

// Check backend health
export const checkActivityBackend = async () => {
  try {
    const response = await ACTIVITY_API.get("/health");
    return { 
      online: true, 
      message: response.data.message || "Connected",
      endpoints: response.data.endpoints,
      version: response.data.version
    };
  } catch (error) {
    return { 
      online: false, 
      error: error.message,
      message: "Using offline mode"
    };
  }
};

// Get random wellness tip
export const getWellnessTip = async () => {
  const tips = [
    "Take three deep breaths",
    "Drink a glass of water",
    "Stretch for 2 minutes",
    "Look away from screen for 20 seconds",
    "Think of one thing you're grateful for",
    "Close your eyes and relax for 1 minute",
    "Roll your shoulders back",
    "Take a short walk",
    "Listen to your favorite song",
    "Write down one positive thought"
  ];
  
  try {
    // Try to get from backend first
    const response = await ACTIVITY_API.get("/wellness/habits/");
    if (response.data && response.data.tip) {
      return response.data.tip;
    }
  } catch (e) {
    // Use local tips if backend fails
  }
  
  return tips[Math.floor(Math.random() * tips.length)];
};

export default {
  suggestActivity,
  startActivity,
  completeActivity,
  getActivityHistory,
  checkActivityBackend,
  getWellnessTip
};