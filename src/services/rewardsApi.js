import axios from "axios";

// Person 2's backend
const REWARDS_API = axios.create({
  baseURL: "http://localhost:8002",
  timeout: 10000
});

// Save user's favorites
export const saveFavorites = async (favorites) => {
  try {
    const response = await REWARDS_API.post("/rewards/set-favorites", {
      favorite_song: favorites.song || "",
      favorite_movie: favorites.movie || "",
      favorite_food: favorites.food || "",
      favorite_drink: favorites.drink || "",
      favorite_place: favorites.place || ""
    });
    return response.data;
  } catch (error) {
    console.error("Error saving favorites:", error);
    throw error;
  }
};

// Get rewards based on favorites
export const getRewards = async () => {
  try {
    const response = await REWARDS_API.get("/rewards/get-rewards");
    return response.data;
  } catch (error) {
    console.error("Error getting rewards:", error);
    return {
      message: "Here are your rewards",
      reward: {
        spotify_link: "https://open.spotify.com",
        youtube_link: "https://youtube.com",
        imdb_link: "https://imdb.com"
      }
    };
  }
};