import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { suggestActivity, completeActivity } from "../services/activityApi.js";
import { forestCabinTheme as theme } from "../styles/forestCabinTheme.js";
import { saveFavorites, getRewards } from "../services/rewardsApi.js";
import { trackActivity } from '../services/adminApi';
import userTracking from '../services/userTracking';

// Icons
import { 
  Music, 
  Film, 
  Coffee, 
  Dumbbell, 
  Book, 
  Heart, 
  Sparkles,
  Clock,
  Award,
  X,
  Star,
  Wind,
  PenTool,
  Sunset,
  Smile,
  Timer,
  MapPin,
  Utensils,
  Coffee as DrinkIcon,
  Send
} from 'lucide-react';

function ActivitySuggestions({ moodData, darkMode, onClose, onActivitySelected, onPopupStateChange }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showRewards, setShowRewards] = useState(false);
  const [rewards, setRewards] = useState(null);
  const [favorites, setFavorites] = useState({
    song: "",
    movie: "",
    food: "",
    drink: "",
    place: ""
  });
  
  // Popup states
  const [showTimer, setShowTimer] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [showFavoritePopup, setShowFavoritePopup] = useState(false);
  const [currentFavorite, setCurrentFavorite] = useState(null);
  const [favoriteInput, setFavoriteInput] = useState("");
  
  // New state for gratitude and kindness answers
  const [showAnswerPopup, setShowAnswerPopup] = useState(false);
  const [currentAnswerActivity, setCurrentAnswerActivity] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [answerInput, setAnswerInput] = useState("");

  // Notify parent component when any popup is open
useEffect(() => {
  const isAnyPopupOpen = showTimer || showChallenge || showFavoritePopup || showAnswerPopup || showRewards;
  if (onPopupStateChange) {
    onPopupStateChange(isAnyPopupOpen);
  }
}, [showTimer, showChallenge, showFavoritePopup, showAnswerPopup, showRewards, onPopupStateChange]);

  // Pre-defined activities
  const activityOptions = [
    {
      id: 'music',
      icon: Music,
      name: 'Listen to Music',
      description: 'Relax with your favorite tunes',
      color: '#8B5CF6',
      category: 'favorites',
      emoji: '🎵',
      action: 'favorite'
    },
    {
      id: 'movie',
      icon: Film,
      name: 'Watch a Movie',
      description: 'Enjoy a comfort film',
      color: '#EC4899',
      category: 'favorites',
      emoji: '🎬',
      action: 'favorite'
    },
    {
      id: 'kindness',
      icon: Heart,
      name: 'Kindness Challenge',
      description: 'Do something kind for someone',
      color: '#10B981',
      category: 'kindness',
      emoji: '💝',
      action: 'challenge',
      questions: [
        "Who can you send an encouraging message to today?",
        "What's a genuine compliment you can give someone?",
        "How can you help someone with a small task?",
        "What's one kind thing you can do for yourself?"
      ]
    },
    {
      id: 'gratitude',
      icon: Sparkles,
      name: 'Gratitude Moment',
      description: 'Reflect on what you\'re grateful for',
      color: '#F59E0B',
      category: 'gratitude',
      emoji: '🙏',
      action: 'questions',
      questions: [
        "Who made you smile today?",
        "What's one thing you're thankful for right now?",
        "What's beautiful in your surroundings?",
        "What's a lesson you learned recently?",
        "What's something you're looking forward to?",
        "Name one small joy from today"
      ]
    },
    {
      id: 'meditation',
      icon: Coffee,
      name: 'Mindful Moment',
      description: '5-minute breathing exercise',
      color: '#6366F1',
      category: 'wellness',
      emoji: '🧘',
      action: 'timer',
      duration: 300
    },
    {
      id: 'food',
      icon: Utensils,
      name: 'Favorite Food',
      description: 'Discover food rewards',
      color: '#F97316',
      category: 'favorites',
      emoji: '🍽️',
      action: 'favorite'
    },
    {
      id: 'drink',
      icon: DrinkIcon,
      name: 'Favorite Drink',
      description: 'Discover drink rewards',
      color: '#14B8A6',
      category: 'favorites',
      emoji: '☕',
      action: 'favorite'
    },
    {
      id: 'place',
      icon: MapPin,
      name: 'Favorite Place',
      description: 'Discover place rewards',
      color: '#8B5CF6',
      category: 'favorites',
      emoji: '📍',
      action: 'favorite'
    }
  ];

  // Backend activity mapper with questions
  const mapBackendActivity = (backendActivity, emotion, intensity) => {
    const activityMap = {
      '5-minute deep breathing': {
        icon: Wind,
        color: '#10B981',
        category: 'wellness',
        emoji: '🌬️',
        action: 'timer',
        duration: 300
      },
      'Write one kind thing about yourself': {
        icon: PenTool,
        color: '#8B5CF6',
        category: 'kindness',
        emoji: '💭',
        action: 'questions',
        questions: [
          "What is something you're good at?",
          "What do you appreciate about yourself?",
          "What makes you unique?",
          "What's a challenge you've overcome?",
          "What's something you did well today?",
          "What do your loved ones appreciate about you?"
        ]
      },
      '3-minute gratitude pause': {
        icon: Sunset,
        color: '#F59E0B',
        category: 'gratitude',
        emoji: '🌅',
        action: 'questions',
        duration: 180,
        questions: [
          "What's something beautiful you noticed today?",
          "Who is someone you're grateful for?",
          "What made you smile recently?",
          "What's a simple pleasure you enjoyed?",
          "What's something you're looking forward to?",
          "What's one thing about yourself you're grateful for?"
        ]
      }
    };

    let mapping = null;
    const activityName = backendActivity.recommended_activity || '';
    
    for (const [key, value] of Object.entries(activityMap)) {
      if (activityName.toLowerCase().includes(key.toLowerCase())) {
        mapping = value;
        break;
      }
    }

    if (!mapping) {
      mapping = {
        icon: Sparkles,
        color: '#6366F1',
        category: 'suggested',
        emoji: '✨',
        action: 'timer',
        duration: 300
      };
    }

    return {
      id: `suggested-${Date.now()}`,
      icon: mapping.icon,
      name: backendActivity.recommended_activity || 'Mindful Moment',
      description: backendActivity.description || 'Take a moment for yourself',
      color: mapping.color,
      duration: backendActivity.default_duration_minutes ? backendActivity.default_duration_minutes * 60 : mapping.duration || 300,
      category: mapping.category,
      emoji: mapping.emoji,
      followUp: backendActivity.follow_up_prompt,
      isBackendSuggested: true,
      action: mapping.action,
      questions: mapping.questions || [backendActivity.follow_up_prompt || 'Take a moment to reflect...'],
      moodContext: { emotion, intensity }
    };
  };

  useEffect(() => {
    if (moodData) {
      fetchActivities();
    }
  }, [moodData]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (timerSeconds === 0 && timerActive) {
      setTimerActive(false);
      showCompletionRewards(selectedActivity);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const result = await suggestActivity(moodData.emotion, moodData.intensity);
      
      let backendActivity = null;
      if (result && result.recommended_activity) {
        backendActivity = mapBackendActivity(result, moodData.emotion, moodData.intensity);
      }

      const combinedActivities = backendActivity 
        ? [backendActivity, ...activityOptions]
        : activityOptions;
      
      setActivities(combinedActivities);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities(activityOptions);
    }
    setLoading(false);
  };

  const handleFavoriteSubmit = async () => {
    if (!favoriteInput.trim()) return;
    
    const activity = currentFavorite;
    const favoriteValue = favoriteInput;
    
    const updatedFavorites = {
      ...favorites,
      [activity.id]: favoriteValue
    };
    setFavorites(updatedFavorites);
    
    try {
      await saveFavorites({
        song: updatedFavorites.music || "",
        movie: updatedFavorites.movie || "",
        food: updatedFavorites.food || "",
        drink: updatedFavorites.drink || "",
        place: updatedFavorites.place || ""
      });
      
      const rewardsData = await getRewards();
      
      let rewardMessage = "";
      let rewardLink = "";
      let badgeName = "";
      
      switch(activity.id) {
        case 'music':
          rewardMessage = `🎵 Enjoy listening to "${favoriteValue}"!`;
          rewardLink = `https://open.spotify.com/search/${encodeURIComponent(favoriteValue)}`;
          badgeName = 'Music Lover';
          window.open(rewardLink, '_blank');
          break;
        case 'movie':
          rewardMessage = `🎬 Enjoy watching "${favoriteValue}"!`;
          rewardLink = `https://www.imdb.com/find?q=${encodeURIComponent(favoriteValue)}`;
          badgeName = 'Movie Buff';
          window.open(rewardLink, '_blank');
          break;
        case 'food':
          rewardMessage = `🍽️ Time to enjoy some "${favoriteValue}"!`;
          rewardLink = `https://www.swiggy.com/search/${encodeURIComponent(favoriteValue)}`;
          badgeName = 'Food Explorer';
          window.open(rewardLink, '_blank');
          break;
        case 'drink':
          rewardMessage = `☕ Enjoy your "${favoriteValue}"!`;
          rewardLink = `https://www.swiggy.com/search/recipes?q=${encodeURIComponent(favoriteValue)}`;
          badgeName = 'Drink Connoisseur';
          window.open(rewardLink, '_blank');
          break;
        case 'place':
          rewardMessage = `📍 Explore "${favoriteValue}"!`;
          rewardLink = `https://www.tripadvisor.com/Search?q=${encodeURIComponent(favoriteValue)}`;
          badgeName = 'Place Explorer';
          window.open(rewardLink, '_blank');
          break;
        default:
          rewardMessage = `Enjoy your favorite!`;
          badgeName = 'Explorer';
      }

      userTracking.trackActivity(
      userTracking.getUserId(),
      activity.name,
      5, // default duration for favorites
      true
    );
      
      setShowFavoritePopup(false);
      setCurrentFavorite(null);
      setFavoriteInput("");
      
      // Show rewards popup
      setRewards({
        message: rewardMessage,
        points: 25,
        badge: badgeName,
        emoji: activity.emoji || '🎉',
        showBelow: true
      });
      setShowRewards(true);
      
      if (onActivitySelected) {
        onActivitySelected(activity);
      }
      
    } catch (error) {
      console.error("Error saving favorites:", error);
      
      const fallbackLinks = {
        music: `https://open.spotify.com/search/${encodeURIComponent(favoriteValue)}`,
        movie: `https://www.imdb.com/find?q=${encodeURIComponent(favoriteValue)}`,
        food: `https://www.swiggy.com/search/${encodeURIComponent(favoriteValue)}`,
        drink: `https://www.swiggy.com/search/recipes?q=${encodeURIComponent(favoriteValue)}`,
        place: `https://www.tripadvisor.com/Search?q=${encodeURIComponent(favoriteValue)}`
      };
      
      window.open(fallbackLinks[activity.id], '_blank');
      
      setShowFavoritePopup(false);
      setCurrentFavorite(null);
      setFavoriteInput("");

      userTracking.trackActivity(
      userTracking.getUserId(),
      activity.name,
      5,
      true
    );
      
      setRewards({
        message: `✨ Enjoy exploring your favorite ${activity.name.toLowerCase()}! Congrats! You are dancing through the lightening strikes`,
        points: 25,
        badge: `${activity.name} Explorer`,
        emoji: '🌟',
        showBelow: true
      });
      setShowRewards(true);
    }
  };

  const showCompletionRewards = (activity) => {
    setShowTimer(false);
    setShowChallenge(false);
    setShowAnswerPopup(false);
    setSelectedActivity(null);

    // Track activity completion
    userTracking.trackActivity(
      userTracking.getUserId(),
      activity.name,
      activity.duration || 5,
    true
    );
    
    setRewards({
      message: `✨ You completed the ${activity.name.toLowerCase()}! Congrats! You are dancing through the lightening strikes`,
      points: 50,
      badge: 'Mindfulness Beginner',
      emoji: '🎉',
      showBelow: true
    });
    setShowRewards(true);
  };

  const startTimer = (activity) => {
    setSelectedActivity(activity);
    setTimerSeconds(activity.duration || 300);
    setTimerActive(true);
    setShowTimer(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
    
    if (activity.category === 'favorites') {
      setCurrentFavorite(activity);
      setFavoriteInput("");
      setShowFavoritePopup(true);
      return;
    }
    
    if (activity.action === 'timer') {
      startTimer(activity);
    } else if (activity.action === 'questions' || activity.action === 'challenge') {
      // Start the questions/reflection activity
      setCurrentAnswerActivity(activity);
      setAnswers(new Array(activity.questions.length).fill(""));
      setCurrentAnswerIndex(0);
      setAnswerInput("");
      setShowAnswerPopup(true);
    }
  };

  const handleAnswerSubmit = () => {
    if (!answerInput.trim() && currentAnswerActivity.questions[currentAnswerIndex]) {
      return; // Don't allow empty answers for questions
    }
    
    // Save current answer
    const newAnswers = [...answers];
    newAnswers[currentAnswerIndex] = answerInput;
    setAnswers(newAnswers);
    
    // Move to next question or finish
    if (currentAnswerIndex < currentAnswerActivity.questions.length - 1) {
      setCurrentAnswerIndex(currentAnswerIndex + 1);
      setAnswerInput("");
    } else {
      // All questions answered, show completion
      setShowAnswerPopup(false);
      showCompletionRewards(currentAnswerActivity);
    }
  };

  const handleSkipQuestion = () => {
    if (currentAnswerIndex < currentAnswerActivity.questions.length - 1) {
      setCurrentAnswerIndex(currentAnswerIndex + 1);
      setAnswerInput("");
    } else {
      setShowAnswerPopup(false);
      showCompletionRewards(currentAnswerActivity);
    }
  };

  const completeChallenge = () => {
    setShowChallenge(false);
    showCompletionRewards(currentChallenge);
  };

  const closePopup = (e) => {
    if (e) {
      e.stopPropagation();
    }
    
    setShowTimer(false);
    setShowChallenge(false);
    setShowFavoritePopup(false);
    setShowAnswerPopup(false);
    setShowRewards(false);
    setSelectedActivity(null);
    setCurrentChallenge(null);
    setCurrentFavorite(null);
    setCurrentAnswerActivity(null);
    setTimerActive(false);
  };

  if (!moodData) return null;

  return (
    <>
      {/* Global Popup Container */}
      <AnimatePresence>
        {/* Timer Popup */}
        {showTimer && selectedActivity && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999 // Maximum z-index
          }}
          onClick={(e) => closePopup(e)}
        >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: -50 }}
              exit={{ scale: 0.9, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: theme.borderRadius?.xl || '1rem',
                padding: theme.spacing?.xl || '2rem',
                boxShadow: theme.shadows?.xl || '0 20px 25px -5px rgba(0,0,0,0.2)',
                maxWidth: '400px',
                width: '90%',
                textAlign: 'center',
                border: `2px solid ${selectedActivity.color}40`,
                position: 'relative'
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closePopup();
                }}
                style={{
                  position: 'absolute',
                  top: theme.spacing?.sm || '0.75rem',
                  right: theme.spacing?.sm || '0.75rem',
                  background: theme.colors?.neutral?.[100] || '#F3F4F6',
                  border: 'none',
                  cursor: 'pointer',
                  color: theme.colors?.neutral?.[500] || '#6B7280',
                  width: 32,
                  height: 32,
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  zIndex: 10
                }}
                onMouseEnter={(e) => e.target.style.background = theme.colors?.accent?.peach || '#FED7C1'}
                onMouseLeave={(e) => e.target.style.background = theme.colors?.neutral?.[100] || '#F3F4F6'}
              >
                <X size={18} />
              </button>

              <div style={{ fontSize: '64px', marginBottom: theme.spacing?.md || '1rem' }}>
                {selectedActivity.emoji}
              </div>
              <h3 style={{ marginBottom: theme.spacing?.sm || '0.75rem', color: selectedActivity.color }}>
                {selectedActivity.name}
              </h3>
              <div style={{
                fontSize: '48px',
                fontWeight: 'bold',
                marginBottom: theme.spacing?.lg || '1.5rem',
                color: theme.colors?.text?.primary || '#111827'
              }}>
                {formatTime(timerSeconds)}
              </div>
              {timerActive ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setTimerActive(false)}
                  style={{
                    padding: `${theme.spacing?.md || '1rem'} ${theme.spacing?.xl || '2rem'}`,
                    background: theme.colors?.accent?.terracotta || '#E6A57E',
                    color: 'white',
                    border: 'none',
                    borderRadius: theme.borderRadius?.full || '9999px',
                    fontSize: theme.typography?.body || '1rem',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  Pause Timer
                </motion.button>
              ) : (
                <div style={{ display: 'flex', gap: theme.spacing?.md || '1rem', justifyContent: 'center' }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimerActive(true)}
                    style={{
                      padding: `${theme.spacing?.md || '1rem'} ${theme.spacing?.xl || '2rem'}`,
                      background: selectedActivity.color,
                      color: 'white',
                      border: 'none',
                      borderRadius: theme.borderRadius?.full || '9999px',
                      fontSize: theme.typography?.body || '1rem',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    {timerSeconds === (selectedActivity.duration || 300) ? 'Start' : 'Resume'}
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Answer Popup for Gratitude and Kindness Activities */}
        {showAnswerPopup && currentAnswerActivity && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999
          }}
          onClick={(e) => closePopup(e)}
        >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: -50 }}
              exit={{ scale: 0.9, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: theme.borderRadius?.xl || '1rem',
                padding: theme.spacing?.xl || '2rem',
                boxShadow: theme.shadows?.xl || '0 20px 25px -5px rgba(0,0,0,0.2)',
                maxWidth: '500px',
                width: '90%',
                border: `2px solid ${currentAnswerActivity.color}40`,
                position: 'relative'
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closePopup();
                }}
                style={{
                  position: 'absolute',
                  top: theme.spacing?.sm || '0.75rem',
                  right: theme.spacing?.sm || '0.75rem',
                  background: theme.colors?.neutral?.[100] || '#F3F4F6',
                  border: 'none',
                  cursor: 'pointer',
                  color: theme.colors?.neutral?.[500] || '#6B7280',
                  width: 32,
                  height: 32,
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  zIndex: 10
                }}
                onMouseEnter={(e) => e.target.style.background = theme.colors?.accent?.peach || '#FED7C1'}
                onMouseLeave={(e) => e.target.style.background = theme.colors?.neutral?.[100] || '#F3F4F6'}
              >
                <X size={18} />
              </button>

              <div style={{ fontSize: '48px', marginBottom: theme.spacing?.md || '1rem', textAlign: 'center' }}>
                {currentAnswerActivity.emoji}
              </div>
              
              <h3 style={{ 
                marginBottom: theme.spacing?.md || '1rem', 
                color: currentAnswerActivity.color,
                textAlign: 'center'
              }}>
                {currentAnswerActivity.name}
              </h3>
              
              {/* Progress indicator */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: theme.spacing?.xs || '0.5rem',
                marginBottom: theme.spacing?.lg || '1.5rem'
              }}>
                {currentAnswerActivity.questions.map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: index === currentAnswerIndex 
                        ? currentAnswerActivity.color 
                        : index < currentAnswerIndex 
                          ? `${currentAnswerActivity.color}60`
                          : theme.colors?.neutral?.[300] || '#D1D5DB'
                    }}
                  />
                ))}
              </div>
              
              {/* Question */}
              <div style={{
                fontSize: theme.typography?.h4 || '1.25rem',
                color: theme.colors?.text?.primary || '#111827',
                marginBottom: theme.spacing?.lg || '1.5rem',
                textAlign: 'center',
                fontWeight: 500
              }}>
                {currentAnswerActivity.questions[currentAnswerIndex]}
              </div>
              
              {/* Answer input */}
              <div style={{ marginBottom: theme.spacing?.lg || '1.5rem' }}>
                <textarea
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  placeholder="Write your reflection here..."
                  rows="4"
                  style={{
                    width: '100%',
                    padding: theme.spacing?.md || '1rem',
                    borderRadius: theme.borderRadius?.lg || '0.75rem',
                    border: `1px solid ${theme.colors?.neutral?.[300] || '#D1D5DB'}`,
                    fontSize: theme.typography?.body || '1rem',
                    outline: 'none',
                    transition: 'all 0.2s',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  onFocus={(e) => e.target.style.borderColor = currentAnswerActivity.color}
                  onBlur={(e) => e.target.style.borderColor = theme.colors?.neutral?.[300] || '#D1D5DB'}
                  autoFocus
                />
              </div>
              
              {/* Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: theme.spacing?.md || '1rem', 
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAnswerSubmit}
                  disabled={!answerInput.trim() && currentAnswerActivity.questions[currentAnswerIndex]}
                  style={{
                    padding: `${theme.spacing?.md || '1rem'} ${theme.spacing?.xl || '2rem'}`,
                    background: !answerInput.trim() && currentAnswerActivity.questions[currentAnswerIndex] 
                      ? theme.colors?.neutral?.[300] || '#D1D5DB'
                      : currentAnswerActivity.color,
                    color: 'white',
                    border: 'none',
                    borderRadius: theme.borderRadius?.full || '9999px',
                    fontSize: theme.typography?.body || '1rem',
                    cursor: (!answerInput.trim() && currentAnswerActivity.questions[currentAnswerIndex]) ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing?.xs || '0.5rem',
                    opacity: (!answerInput.trim() && currentAnswerActivity.questions[currentAnswerIndex]) ? 0.7 : 1
                  }}
                >
                  <Send size={16} />
                  {currentAnswerIndex === currentAnswerActivity.questions.length - 1 ? 'Complete' : 'Next'}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSkipQuestion}
                  style={{
                    padding: `${theme.spacing?.md || '1rem'} ${theme.spacing?.xl || '2rem'}`,
                    background: 'transparent',
                    border: `1px solid ${theme.colors?.neutral?.[300] || '#D1D5DB'}`,
                    borderRadius: theme.borderRadius?.full || '9999px',
                    color: theme.colors?.text?.secondary || '#6B7280',
                    fontSize: theme.typography?.body || '1rem',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  Skip
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Favorite Input Popup */}
        {showFavoritePopup && currentFavorite && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999
          }}
          onClick={(e) => closePopup(e)}
        >
            <motion.div
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1, y: -50 }}
              exit={{ scale: 0.9, y: -20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: theme.borderRadius?.xl || '1rem',
                padding: theme.spacing?.xl || '2rem',
                boxShadow: theme.shadows?.xl || '0 20px 25px -5px rgba(0,0,0,0.2)',
                maxWidth: '400px',
                width: '90%',
                border: `2px solid ${currentFavorite.color}40`,
                position: 'relative'
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closePopup();
                }}
                style={{
                  position: 'absolute',
                  top: theme.spacing?.sm || '0.75rem',
                  right: theme.spacing?.sm || '0.75rem',
                  background: theme.colors?.neutral?.[100] || '#F3F4F6',
                  border: 'none',
                  cursor: 'pointer',
                  color: theme.colors?.neutral?.[500] || '#6B7280',
                  width: 32,
                  height: 32,
                  borderRadius: '9999px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  zIndex: 10
                }}
                onMouseEnter={(e) => e.target.style.background = theme.colors?.accent?.peach || '#FED7C1'}
                onMouseLeave={(e) => e.target.style.background = theme.colors?.neutral?.[100] || '#F3F4F6'}
              >
                <X size={18} />
              </button>

              <div style={{ fontSize: '48px', marginBottom: theme.spacing?.md || '1rem', textAlign: 'center' }}>
                {currentFavorite.emoji}
              </div>
              <h3 style={{ 
                marginBottom: theme.spacing?.lg || '1.5rem', 
                color: currentFavorite.color,
                textAlign: 'center'
              }}>
                {currentFavorite.name}
              </h3>
              
              <div style={{ marginBottom: theme.spacing?.lg || '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: theme.spacing?.sm || '0.75rem',
                  fontSize: theme.typography?.small || '0.875rem',
                  color: theme.colors?.text?.secondary || '#6B7280',
                  textAlign: 'center'
                }}>
                  {currentFavorite.id === 'music' && "🎵 What's your favorite song?"}
                  {currentFavorite.id === 'movie' && "🎬 What's your favorite movie?"}
                  {currentFavorite.id === 'food' && "🍔 What's your favorite food?"}
                  {currentFavorite.id === 'drink' && "🥤 What's your favorite drink?"}
                  {currentFavorite.id === 'place' && "📍 What's your favorite place?"}
                </label>
                <input
                  type="text"
                  value={favoriteInput}
                  onChange={(e) => setFavoriteInput(e.target.value)}
                  placeholder="Type your answer here..."
                  style={{
                    width: '100%',
                    padding: theme.spacing?.md || '1rem',
                    borderRadius: theme.borderRadius?.lg || '0.75rem',
                    border: `1px solid ${theme.colors?.neutral?.[300] || '#D1D5DB'}`,
                    fontSize: theme.typography?.body || '1rem',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = currentFavorite.color}
                  onBlur={(e) => e.target.style.borderColor = theme.colors?.neutral?.[300] || '#D1D5DB'}
                  autoFocus
                />
              </div>
              
              <div style={{ display: 'flex', gap: theme.spacing?.md || '1rem', justifyContent: 'center' }}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFavoriteSubmit}
                  disabled={!favoriteInput.trim()}
                  style={{
                    padding: `${theme.spacing?.md || '1rem'} ${theme.spacing?.xl || '2rem'}`,
                    background: !favoriteInput.trim() ? theme.colors?.neutral?.[300] || '#D1D5DB' : currentFavorite.color,
                    color: 'white',
                    border: 'none',
                    borderRadius: theme.borderRadius?.full || '9999px',
                    fontSize: theme.typography?.body || '1rem',
                    cursor: !favoriteInput.trim() ? 'not-allowed' : 'pointer',
                    fontWeight: 600,
                    opacity: !favoriteInput.trim() ? 0.7 : 1
                  }}
                >
                  Save & Explore
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Rewards Popup */}
{showRewards && rewards && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 999999
          }}
          onClick={closePopup}
        >
    <motion.div
      initial={{ scale: 0.9, y: -20 }}
      animate={{ scale: 1, y: -50 }}
      exit={{ scale: 0.9, y: -20 }}
      onClick={(e) => e.stopPropagation()}
      style={{
        background: `linear-gradient(135deg, ${theme.colors?.accent?.peach || '#FED7C1'}20, ${theme.colors?.accent?.lavender || '#E2D4E2'}20)`,
        borderRadius: theme.borderRadius?.lg || '0.75rem',
        padding: theme.spacing?.xl || '2rem',
        border: `1px solid ${theme.colors?.accent?.terracotta || '#E6A57E'}30`,
        textAlign: 'center',
        maxWidth: '400px',
        width: '90%',
        boxShadow: theme.shadows?.xl || '0 20px 25px -5px rgba(0,0,0,0.2)',
        backdropFilter: 'blur(10px)',
        position: 'relative'
      }}
    >
      <div style={{
        position: 'absolute',
        top: -12,
        left: '50%',
        transform: 'translateX(-50%)',
        background: theme.colors?.accent?.terracotta || '#E6A57E',
        color: 'white',
        padding: '4px 16px',
        borderRadius: '9999px',
        fontSize: theme.typography?.small || '0.875rem',
        fontWeight: 600
      }}>
        ✨ Achievement Unlocked
      </div>
      
      <div style={{ fontSize: '64px', marginBottom: theme.spacing?.md || '1rem' }}>
        {rewards.emoji || '🎉'}
      </div>
      
      <h4 style={{ 
        margin: `${theme.spacing?.sm || '0.75rem'} 0`, 
        color: theme.colors?.text?.primary || '#111827',
        fontSize: theme.typography?.h4 || '1.25rem'
      }}>
        {rewards.message || 'Activity Complete! 🎉'}
      </h4>
      
      <div style={{
        display: 'flex',
        gap: theme.spacing?.md || '1rem',
        justifyContent: 'center',
        marginTop: theme.spacing?.lg || '1.5rem'
      }}>
        <div style={{
          background: 'white',
          padding: `${theme.spacing?.sm || '0.75rem'} ${theme.spacing?.md || '1rem'}`,
          borderRadius: theme.borderRadius?.md || '0.5rem',
          boxShadow: theme.shadows?.sm || '0 1px 2px 0 rgba(0,0,0,0.05)',
          minWidth: '100px'
        }}>
          <p style={{ margin: 0, fontSize: theme.typography?.tiny || '0.75rem', color: theme.colors?.text?.secondary || '#6B7280' }}>Points</p>
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: theme.typography?.h4 || '1.25rem', color: theme.colors?.accent?.terracotta || '#E6A57E' }}>+{rewards.points || 50}</p>
        </div>
        <div style={{
          background: 'white',
          padding: `${theme.spacing?.sm || '0.75rem'} ${theme.spacing?.md || '1rem'}`,
          borderRadius: theme.borderRadius?.md || '0.5rem',
          boxShadow: theme.shadows?.sm || '0 1px 2px 0 rgba(0,0,0,0.05)',
          minWidth: '100px'
        }}>
          <p style={{ margin: 0, fontSize: theme.typography?.tiny || '0.75rem', color: theme.colors?.text?.secondary || '#6B7280' }}>Badge</p>
          <p style={{ margin: 0, fontWeight: 'bold', fontSize: theme.typography?.small || '0.875rem', color: theme.colors?.accent?.sage || '#10B981' }}>🏆 {rewards.badge || 'New'}</p>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={closePopup}
        style={{
          marginTop: theme.spacing?.lg || '1.5rem',
          padding: `${theme.spacing?.sm || '0.75rem'} ${theme.spacing?.lg || '1.5rem'}`,
          background: theme.colors?.accent?.terracotta || '#E6A57E',
          color: 'white',
          border: 'none',
          borderRadius: theme.borderRadius?.full || '9999px',
          fontSize: theme.typography?.small || '0.875rem',
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        Close
      </motion.button>
    </motion.div>
  </motion.div>
)}
      </AnimatePresence>

      {/* Main Activity Suggestions Component - Keep the rest unchanged */}
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      style={{
        background: darkMode ? theme.colors.neutral[800] : theme.colors.background?.paper || 'white',
        borderRadius: theme.borderRadius?.xl || '1rem',
        padding: theme.spacing?.lg || '1.5rem',
        marginTop: theme.spacing?.md || '1rem',
        marginBottom: theme.spacing?.md || '1rem',
        boxShadow: theme.shadows?.lg || '0 10px 15px -3px rgba(0,0,0,0.1)',
        border: `1px solid ${darkMode ? theme.colors?.neutral?.[700] || '#374151' : theme.colors?.neutral?.[200] || '#E5E7EB'}`,
        position: 'relative',
        zIndex: 1 // Lower z-index for the main component
      }}
      >
        
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: `radial-gradient(circle at 20% 30%, ${theme.colors?.accent?.peach || '#FED7C1'}30 0%, transparent 70%)`,
          borderRadius: theme.borderRadius?.xl || '1rem',
          pointerEvents: 'none'
        }} />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: theme.spacing?.md || '1rem',
            right: theme.spacing?.md || '1rem',
            background: darkMode ? theme.colors?.neutral?.[700] || '#374151' : theme.colors?.neutral?.[100] || '#F3F4F6',
            border: 'none',
            cursor: 'pointer',
            color: darkMode ? theme.colors?.neutral?.[400] || '#9CA3AF' : theme.colors?.neutral?.[500] || '#6B7280',
            width: 32,
            height: 32,
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.background = theme.colors?.accent?.peach || '#FED7C1'}
          onMouseLeave={(e) => e.target.style.background = darkMode ? theme.colors?.neutral?.[700] || '#374151' : theme.colors?.neutral?.[100] || '#F3F4F6'}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ 
          marginBottom: theme.spacing?.lg || '1.5rem',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing?.sm || '0.75rem',
            marginBottom: theme.spacing?.xs || '0.5rem'
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '9999px',
              background: `linear-gradient(135deg, ${theme.colors?.accent?.peach || '#FED7C1'} 0%, ${theme.colors?.accent?.terracotta || '#E6A57E'} 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={20} color="white" />
            </div>
            <h4 style={{
              margin: 0,
              fontSize: theme.typography?.h4 || '1.25rem',
              color: darkMode ? 'white' : theme.colors?.text?.primary || '#111827',
              fontWeight: 600
            }}>
              Activities for You
            </h4>
          </div>
          <p style={{
            margin: 0,
            marginLeft: 52,
            fontSize: theme.typography?.small || '0.875rem',
            color: darkMode ? theme.colors?.neutral?.[400] || '#9CA3AF' : theme.colors?.text?.secondary || '#6B7280'
          }}>
            {moodData?.emotion ? `Feeling ${moodData.emotion}? Try these:` : 'Choose an activity that feels right:'}
          </p>
        </div>

        {/* Activity Grid */}
        {loading ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: theme.spacing?.xl || '2rem',
            gap: theme.spacing?.md || '1rem'
          }}>
            <div className="spinner" style={{
              width: 48,
              height: 48,
              border: `3px solid ${theme.colors?.accent?.peach || '#FED7C1'}`,
              borderTopColor: theme.colors?.accent?.terracotta || '#E6A57E',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: theme.colors?.text?.secondary || '#6B7280' }}>
              Finding the perfect activity for you...
            </p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: theme.spacing?.md || '1rem',
              position: 'relative',
              zIndex: 1
            }}>
              {activities.slice(0, 8).map((activity, index) => {
                const Icon = activity.icon;
                const isSuggested = activity.isBackendSuggested;
                
                return (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleActivitySelect(activity)}
                    style={{
                      background: darkMode 
                        ? theme.colors?.neutral?.[700] || '#374151'
                        : isSuggested 
                          ? `linear-gradient(135deg, ${activity.color}15, ${activity.color}05)`
                          : 'white',
                      borderRadius: theme.borderRadius?.lg || '0.75rem',
                      padding: theme.spacing?.lg || '1.5rem',
                      cursor: 'pointer',
                      border: isSuggested 
                        ? `2px solid ${activity.color}40`
                        : `1px solid ${darkMode ? theme.colors?.neutral?.[600] || '#4B5563' : theme.colors?.neutral?.[200] || '#E5E7EB'}`,
                      boxShadow: isSuggested ? (theme.shadows?.warm || '0 4px 20px rgba(166,138,120,0.15)') : (theme.shadows?.md || '0 4px 6px -1px rgba(0,0,0,0.1)'),
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: theme.spacing?.sm || '0.75rem',
                      transition: 'all 0.2s',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    {isSuggested && (
                      <>
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '4px',
                          background: `linear-gradient(90deg, ${activity.color}, ${theme.colors?.accent?.peach || '#FED7C1'})`
                        }} />
                        <div style={{
                          position: 'absolute',
                          top: theme.spacing?.xs || '0.5rem',
                          right: theme.spacing?.xs || '0.5rem',
                          fontSize: '16px'
                        }}>
                          ✨
                        </div>
                      </>
                    )}
                    
                    <div style={{
                      width: 56,
                      height: 56,
                      borderRadius: '9999px',
                      background: isSuggested 
                        ? `linear-gradient(135deg, ${activity.color}30, ${activity.color}10)`
                        : `${activity.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: activity.color,
                      fontSize: '24px'
                    }}>
                      {activity.emoji ? <span>{activity.emoji}</span> : <Icon size={24} />}
                    </div>
                    
                    <h5 style={{
                      margin: 0,
                      fontSize: theme.typography?.small || '0.875rem',
                      fontWeight: isSuggested ? 700 : 600,
                      color: darkMode ? 'white' : theme.colors?.text?.primary || '#111827'
                    }}>
                      {activity.name}
                    </h5>
                    
                    <p style={{
                      margin: 0,
                      fontSize: theme.typography?.tiny || '0.75rem',
                      color: darkMode ? theme.colors?.neutral?.[400] || '#9CA3AF' : theme.colors?.text?.secondary || '#6B7280',
                      lineHeight: 1.4
                    }}>
                      {activity.description}
                    </p>
                    
                    {activity.duration && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: theme.typography?.tiny || '0.75rem',
                        color: activity.color,
                        background: `${activity.color}10`,
                        padding: '4px 8px',
                        borderRadius: '9999px',
                        marginTop: theme.spacing?.xs || '0.5rem'
                      }}>
                        <Clock size={12} />
                        {Math.floor(activity.duration / 60)} min
                      </div>
                    )}

                    {activity.action === 'timer' && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: theme.typography?.tiny || '0.75rem',
                        color: theme.colors?.accent?.sage || '#10B981',
                        background: `${theme.colors?.accent?.sage || '#10B981'}10`,
                        padding: '4px 8px',
                        borderRadius: '9999px'
                      }}>
                        <Timer size={12} />
                        Timer
                      </div>
                    )}

                    {activity.action === 'challenge' && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: theme.typography?.tiny || '0.75rem',
                        color: theme.colors?.accent?.lavender || '#8B5CF6',
                        background: `${theme.colors?.accent?.lavender || '#8B5CF6'}10`,
                        padding: '4px 8px',
                        borderRadius: '9999px'
                      }}>
                        <Sparkles size={12} />
                        Challenge
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Rewards Section - Below Activities */}
            <AnimatePresence>
              {showRewards && rewards && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  style={{
                    marginTop: theme.spacing?.xl || '2rem',
                    background: `linear-gradient(135deg, ${theme.colors?.accent?.peach || '#FED7C1'}20, ${theme.colors?.accent?.lavender || '#E2D4E2'}20)`,
                    borderRadius: theme.borderRadius?.lg || '0.75rem',
                    padding: theme.spacing?.lg || '1.5rem',
                    border: `1px solid ${theme.colors?.accent?.terracotta || '#E6A57E'}30`,
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 5
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: theme.colors?.accent?.terracotta || '#E6A57E',
                    color: 'white',
                    padding: '4px 16px',
                    borderRadius: '9999px',
                    fontSize: theme.typography?.small || '0.875rem',
                    fontWeight: 600
                  }}>
                    ✨ Achievement Unlocked
                  </div>
                  
                  <div style={{ fontSize: '48px', marginBottom: theme.spacing?.sm || '0.75rem' }}>
                    {rewards.emoji || '🎉'}
                  </div>
                  
                  <h4 style={{ 
                    margin: `${theme.spacing?.sm || '0.75rem'} 0`, 
                    color: darkMode ? 'white' : theme.colors?.text?.primary || '#111827',
                    fontSize: theme.typography?.h4 || '1.25rem'
                  }}>
                    {rewards.message || 'Activity Complete! 🎉'}
                  </h4>
                  
                  {rewards.link && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.open(rewards.link, '_blank')}
                      style={{
                        marginTop: theme.spacing?.sm || '0.75rem',
                        marginBottom: theme.spacing?.md || '1rem',
                        padding: `${theme.spacing?.sm || '0.75rem'} ${theme.spacing?.lg || '1.5rem'}`,
                        background: theme.colors?.accent?.terracotta || '#E6A57E',
                        color: 'white',
                        border: 'none',
                        borderRadius: theme.borderRadius?.full || '9999px',
                        fontSize: theme.typography?.small || '0.875rem',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      Explore Now
                    </motion.button>
                  )}
                  
                  <div style={{
                    display: 'flex',
                    gap: theme.spacing?.md || '1rem',
                    justifyContent: 'center',
                    marginTop: theme.spacing?.sm || '0.75rem'
                  }}>
                    <div style={{
                      background: 'white',
                      padding: `${theme.spacing?.sm || '0.75rem'} ${theme.spacing?.md || '1rem'}`,
                      borderRadius: theme.borderRadius?.md || '0.5rem',
                      boxShadow: theme.shadows?.sm || '0 1px 2px 0 rgba(0,0,0,0.05)',
                      minWidth: '100px'
                    }}>
                      <p style={{ margin: 0, fontSize: theme.typography?.tiny || '0.75rem', color: theme.colors?.text?.secondary || '#6B7280' }}>Points</p>
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: theme.typography?.h4 || '1.25rem', color: theme.colors?.accent?.terracotta || '#E6A57E' }}>+{rewards.points || 50}</p>
                    </div>
                    <div style={{
                      background: 'white',
                      padding: `${theme.spacing?.sm || '0.75rem'} ${theme.spacing?.md || '1rem'}`,
                      borderRadius: theme.borderRadius?.md || '0.5rem',
                      boxShadow: theme.shadows?.sm || '0 1px 2px 0 rgba(0,0,0,0.05)',
                      minWidth: '100px'
                    }}>
                      <p style={{ margin: 0, fontSize: theme.typography?.tiny || '0.75rem', color: theme.colors?.text?.secondary || '#6B7280' }}>Badge</p>
                      <p style={{ margin: 0, fontWeight: 'bold', fontSize: theme.typography?.small || '0.875rem', color: theme.colors?.accent?.sage || '#10B981' }}>🏆 {rewards.badge || 'New'}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        {/* Mood Context Footer */}
        {moodData && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: theme.spacing?.lg || '1.5rem',
              padding: theme.spacing?.sm || '0.75rem',
              textAlign: 'center',
              fontSize: theme.typography?.tiny || '0.75rem',
              color: theme.colors?.text?.muted || '#9CA3AF',
              borderTop: `1px dashed ${theme.colors?.neutral?.[300] || '#D1D5DB'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme.spacing?.sm || '0.75rem'
            }}
          >
            <Smile size={14} color={theme.colors?.accent?.terracotta || '#E6A57E'} />
            <span>Feeling <strong style={{ color: theme.colors?.accent?.terracotta || '#E6A57E' }}>{moodData.emotion}</strong> • Intensity <strong>{moodData.intensity}/10</strong></span>
          </motion.div>
        )}
      </motion.div>
    </>
  );
}

export default ActivitySuggestions;