import axios from "axios";

const ACTIVITY_API = axios.create({
  baseURL: "https://insight-ivy-api.onrender.com",
  timeout: 10000
});
// Add auth token if needed
// API.interceptors.request.use(config => {
//   const token = localStorage.getItem('token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// Wellness Tracking
export const trackSleep = async (userId, hours, quality = null) => {
  try {
    const response = await API.post("/wellness/track/sleep", {
      user_id: userId,
      hours,
      quality
    });
    return response.data;
  } catch (error) {
    console.error("Sleep tracking error:", error);
    throw error;
  }
};

export const trackExercise = async (userId, minutes, intensity = "moderate") => {
  try {
    const response = await API.post("/wellness/track/exercise", {
      user_id: userId,
      minutes,
      intensity
    });
    return response.data;
  } catch (error) {
    console.error("Exercise tracking error:", error);
    throw error;
  }
};

export const trackWater = async (userId, glasses) => {
  try {
    const response = await API.post("/wellness/track/water", {
      user_id: userId,
      glasses
    });
    return response.data;
  } catch (error) {
    console.error("Water tracking error:", error);
    throw error;
  }
};

export const getWellnessScore = async (userId, date = null) => {
  try {
    const url = date ? `/wellness/wellness/score/${userId}?date=${date}` : `/wellness/wellness/score/${userId}`;
    const response = await API.get(url);
    return response.data;
  } catch (error) {
    console.error("Wellness score error:", error);
    throw error;
  }
};

// Habit Tracking
export const addHabit = async (userId, habitName, habitType = "build", targetDays = 21) => {
  try {
    const response = await API.post("/wellness/habits/add", {
      user_id: userId,
      habit_name: habitName,
      habit_type: habitType,
      target_days: targetDays
    });
    return response.data;
  } catch (error) {
    console.error("Add habit error:", error);
    throw error;
  }
};

export const trackHabit = async (userId, habitName, completed = true) => {
  try {
    const response = await API.post("/wellness/habits/track", {
      user_id: userId,
      habit_name: habitName,
      completed
    });
    return response.data;
  } catch (error) {
    console.error("Track habit error:", error);
    throw error;
  }
};

export const getHabitStreak = async (userId, habitName) => {
  try {
    const response = await API.get(`/wellness/habits/streak/${userId}/${habitName}`);
    return response.data;
  } catch (error) {
    console.error("Habit streak error:", error);
    throw error;
  }
};

export const getCelebrations = async (userId, days = 7) => {
  try {
    const response = await API.get(`/wellness/habits/celebrations/${userId}?days=${days}`);
    return response.data;
  } catch (error) {
    console.error("Celebrations error:", error);
    throw error;
  }
};

// Happiness Tracking
export const logMood = async (userId, mood, intensity, notes = "") => {
  try {
    const response = await API.post("/wellness/happiness/log", {
      user_id: userId,
      mood,
      intensity,
      notes
    });
    return response.data;
  } catch (error) {
    console.error("Log mood error:", error);
    throw error;
  }
};

export const getWeeklyMood = async (userId) => {
  try {
    const response = await API.get(`/wellness/happiness/weekly/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Weekly mood error:", error);
    throw error;
  }
};

export const getMoodTrends = async (userId) => {
  try {
    const response = await API.get(`/wellness/happiness/trends/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Mood trends error:", error);
    throw error;
  }
};

// Growth & Motivation
export const getJoyQuestion = async () => {
  try {
    const response = await API.get("/growth/joy/question");
    return response.data;
  } catch (error) {
    console.error("Joy question error:", error);
    throw error;
  }
};

export const saveJoyAnswer = async (userId, question, answer) => {
  try {
    const response = await API.post("/growth/joy/answer", {
      user_id: userId,
      question,
      answer
    });
    return response.data;
  } catch (error) {
    console.error("Save joy answer error:", error);
    throw error;
  }
};

export const getStudentPrompt = async () => {
  try {
    const response = await API.get("/growth/student/prompt");
    return response.data;
  } catch (error) {
    console.error("Student prompt error:", error);
    throw error;
  }
};

export const getKindnessChallenge = async (category = "all") => {
  try {
    const response = await API.get(`/growth/kindness/challenge?category=${category}`);
    return response.data;
  } catch (error) {
    console.error("Kindness challenge error:", error);
    throw error;
  }
};

export const completeKindnessChallenge = async (userId, challenge) => {
  try {
    const response = await API.post("/growth/kindness/complete", {
      user_id: userId,
      challenge
    });
    return response.data;
  } catch (error) {
    console.error("Complete kindness error:", error);
    throw error;
  }
};

export const getKindnessStats = async (userId) => {
  try {
    const response = await API.get(`/growth/kindness/stats/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Kindness stats error:", error);
    throw error;
  }
};