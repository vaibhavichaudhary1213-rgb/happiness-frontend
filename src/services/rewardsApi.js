import axios from "axios";

// Person 2's backend - UPDATED to use live backend
const REWARDS_API = axios.create({
  baseURL: "https://insight-ivy-api.onrender.com", // ✅ Fixed: Now pointing to live backend
  timeout: 10000
});

// Save user's favorites
export const saveFavorites = async (favorites) => {
  try {
    console.log("💾 Saving favorites:", favorites);
    
    // Try to save to backend
    try {
      const response = await REWARDS_API.post("/rewards/set-favorites", {
        favorite_song: favorites.song || "",
        favorite_movie: favorites.movie || "",
        favorite_food: favorites.food || "",
        favorite_drink: favorites.drink || "",
        favorite_place: favorites.place || ""
      });
      console.log("✅ Favorites saved successfully:", response.data);
      return response.data;
    } catch (backendError) {
      // If backend endpoint doesn't exist, store locally
      console.log("📝 Storing favorites locally (backend endpoint not available)");
      
      // Store in localStorage as fallback
      localStorage.setItem('userFavorites', JSON.stringify(favorites));
      
      return {
        success: true,
        message: "Favorites saved locally",
        favorites: favorites,
        offline: true
      };
    }
  } catch (error) {
    console.error("❌ Error saving favorites:", error);
    
    // Fallback - store locally
    localStorage.setItem('userFavorites', JSON.stringify(favorites));
    
    return {
      success: true,
      message: "Favorites saved offline",
      favorites: favorites,
      offline: true
    };
  }
};

// Get rewards based on favorites
export const getRewards = async () => {
  try {
    console.log("🎁 Fetching rewards...");
    
    // Try to get from backend
    try {
      const response = await REWARDS_API.get("/rewards/get-rewards");
      console.log("✅ Rewards received:", response.data);
      return response.data;
    } catch (backendError) {
      console.log("📝 Using local rewards (backend endpoint not available)");
      
      // Get favorites from localStorage if available
      const savedFavorites = localStorage.getItem('userFavorites');
      const favorites = savedFavorites ? JSON.parse(savedFavorites) : null;
      
      // Return personalized rewards based on favorites
      return {
        message: "Here are your personalized rewards",
        reward: {
          spotify_link: favorites?.favorite_song 
            ? `https://open.spotify.com/search/${encodeURIComponent(favorites.favorite_song)}`
            : "https://open.spotify.com",
          youtube_link: favorites?.favorite_movie
            ? `https://youtube.com/results?search_query=${encodeURIComponent(favorites.favorite_movie)}`
            : "https://youtube.com",
          imdb_link: favorites?.favorite_movie
            ? `https://imdb.com/find?q=${encodeURIComponent(favorites.favorite_movie)}`
            : "https://imdb.com",
          food_suggestion: favorites?.favorite_food 
            ? `Try ordering ${favorites.favorite_food} today!`
            : "Try your favorite food as a treat",
          drink_suggestion: favorites?.favorite_drink
            ? `Enjoy a ${favorites.favorite_drink}`
            : "Treat yourself to your favorite drink",
          place_suggestion: favorites?.favorite_place
            ? `Plan a visit to ${favorites.favorite_place} soon`
            : "Visit your happy place"
        },
        offline: true
      };
    }
  } catch (error) {
    console.error("❌ Error getting rewards:", error);
    
    // Ultimate fallback with default rewards
    return {
      message: "Here are your rewards",
      reward: {
        spotify_link: "https://open.spotify.com",
        youtube_link: "https://youtube.com",
        imdb_link: "https://imdb.com",
        food_suggestion: "Try your favorite comfort food",
        drink_suggestion: "Enjoy a warm cup of tea",
        place_suggestion: "Visit a place that makes you happy"
      },
      offline: true
    };
  }
};

// Check if rewards backend is available
export const checkRewardsBackend = async () => {
  try {
    const response = await REWARDS_API.get("/health");
    return { 
      online: true, 
      message: response.data.message || "Connected",
      version: response.data.version
    };
  } catch (error) {
    return { 
      online: false, 
      message: "Using offline rewards",
      offline: true
    };
  }
};

// Get personalized reward suggestion
export const getPersonalizedReward = async (category) => {
  try {
    const savedFavorites = localStorage.getItem('userFavorites');
    const favorites = savedFavorites ? JSON.parse(savedFavorites) : null;
    
    const rewards = {
      song: {
        link: favorites?.favorite_song 
          ? `https://open.spotify.com/search/${encodeURIComponent(favorites.favorite_song)}`
          : "https://open.spotify.com",
        message: favorites?.favorite_song 
          ? `Listen to "${favorites.favorite_song}"`
          : "Discover new music"
      },
      movie: {
        link: favorites?.favorite_movie
          ? `https://youtube.com/results?search_query=${encodeURIComponent(favorites.favorite_movie)}+trailer`
          : "https://youtube.com",
        message: favorites?.favorite_movie
          ? `Watch "${favorites.favorite_movie}" trailer`
          : "Find a movie to watch"
      },
      food: {
        message: favorites?.favorite_food
          ? `Treat yourself to ${favorites.favorite_food}`
          : "Enjoy your favorite meal"
      },
      drink: {
        message: favorites?.favorite_drink
          ? `Sip on ${favorites.favorite_drink}`
          : "Have your favorite drink"
      },
      place: {
        message: favorites?.favorite_place
          ? `Visit ${favorites.favorite_place} when you can`
          : "Go to your happy place"
      }
    };
    
    return rewards[category] || { message: "Time for a reward!" };
    
  } catch (error) {
    console.error("Error getting personalized reward:", error);
    return { message: "Time for a reward!" };
  }
};

export default {
  saveFavorites,
  getRewards,
  checkRewardsBackend,
  getPersonalizedReward
};