// components/WellnessDashboard.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { forestCabinTheme as theme } from "../styles/forestCabinTheme.js";
import * as wellnessApi from "../services/wellnessApi.js";

// Icons
import { 
  Moon, 
  Activity, 
  Droplets, 
  TrendingUp, 
  Calendar,
  Clock,
  Flame,
  Award,
  ChevronRight,
  Target,
  Sparkles,
  Heart,
  Sun,
  Zap
} from 'lucide-react';

function WellnessDashboard({ userId = "user_1", userData }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [sleep, setSleep] = useState({ 
    hours: 7, 
    quality: 3,
    bedtime: "22:30",
    wakeTime: "06:30",
    consistency: 85
  });
  const [exercise, setExercise] = useState({ 
    minutes: 30, 
    intensity: "moderate",
    type: "cardio",
    calories: 0,
    weekly: [25, 40, 30, 0, 45, 30, 0] // minutes per day
  });
  const [water, setWater] = useState({ 
    glasses: 0,
    goal: 8,
    history: [5, 6, 7, 8, 6, 7, 0] // glasses per day
  });
  const [wellnessScore, setWellnessScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showHistory, setShowHistory] = useState(false);
  const [streak, setStreak] = useState(0);

  // Exercise types
  const exerciseTypes = [
    { id: 'cardio', label: 'Cardio', icon: Activity },
    { id: 'strength', label: 'Strength', icon: Zap },
    { id: 'flexibility', label: 'Flexibility', icon: Heart },
    { id: 'walking', label: 'Walking', icon: Sun }
  ];

  // Sleep quality emojis
  const qualityEmojis = {
    1: "😴 Poor",
    2: "😐 Fair",
    3: "🙂 Good",
    4: "😊 Very Good",
    5: "✨ Excellent"
  };

  useEffect(() => {
    fetchWellnessScore();
    calculateStreak();
  }, []);

  const fetchWellnessScore = async () => {
    try {
      const score = await wellnessApi.getWellnessScore(userId);
      setWellnessScore(score);
    } catch (error) {
      console.error("Failed to fetch wellness score:", error);
    }
  };

  const calculateStreak = () => {
    // Calculate streak based on water intake history
    const streak = water.history.filter(glasses => glasses >= water.goal).length;
    setStreak(streak);
  };

  const handleTrackSleep = async () => {
    setLoading(true);
    try {
      const result = await wellnessApi.trackSleep(userId, sleep.hours, sleep.quality);
      setFeedback(result.insights?.[0] || "Sleep tracked successfully! 💤");
      fetchWellnessScore();
      
      // Show success message
      setTimeout(() => setFeedback(""), 3000);
    } catch (error) {
      setFeedback("Failed to track sleep. Please try again.");
    }
    setLoading(false);
  };

  const handleTrackExercise = async () => {
    setLoading(true);
    try {
      const caloriesBurned = calculateCalories(exercise.minutes, exercise.intensity);
      setExercise(prev => ({ ...prev, calories: caloriesBurned }));
      
      const result = await wellnessApi.trackExercise(userId, exercise.minutes, exercise.intensity);
      setFeedback(result.insights?.[0] || "Exercise logged! 💪");
      fetchWellnessScore();
      
      setTimeout(() => setFeedback(""), 3000);
    } catch (error) {
      setFeedback("Failed to track exercise.");
    }
    setLoading(false);
  };

  const calculateCalories = (minutes, intensity) => {
    const intensityMultiplier = {
      light: 4,
      moderate: 7,
      vigorous: 10
    };
    return Math.round(minutes * (intensityMultiplier[intensity] || 5));
  };

  const handleTrackWater = async () => {
    if (water.glasses >= water.goal) {
      setFeedback("You've already reached your goal! 🎉");
      setTimeout(() => setFeedback(""), 3000);
      return;
    }
    
    setLoading(true);
    try {
      const result = await wellnessApi.trackWater(userId, 1);
      setWater(prev => ({ 
        ...prev, 
        glasses: prev.glasses + 1,
        history: [...prev.history.slice(1), prev.glasses + 1]
      }));
      setFeedback(result.message || "💧 Water intake updated!");
      fetchWellnessScore();
      calculateStreak();
      
      setTimeout(() => setFeedback(""), 3000);
    } catch (error) {
      setFeedback("Failed to track water.");
    }
    setLoading(false);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getProgressColor = (value, goal) => {
    const percentage = (value / goal) * 100;
    if (percentage >= 100) return theme.colors.success.main;
    if (percentage >= 70) return theme.colors.accent.sage;
    if (percentage >= 40) return theme.colors.accent.honey;
    return theme.colors.accent.peach;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        background: theme.colors.background.paper,
        borderRadius: theme.borderRadius['2xl'],
        padding: theme.spacing.xl,
        boxShadow: theme.shadows.warm,
        border: `1px solid ${theme.colors.neutral[200]}`,
        maxWidth: '1200px',
        margin: '0 auto'
      }}
    >
      {/* Header with Date and Streak */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        flexWrap: 'wrap',
        gap: theme.spacing.md
      }}>
        <div>
          <h2 style={{ 
            fontSize: theme.typography.h2,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing.xs,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm
          }}>
            <span>🌿</span> Wellness Dashboard
          </h2>
          <p style={{
            fontSize: theme.typography.small,
            color: theme.colors.text.secondary,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.xs
          }}>
            <Calendar size={14} />
            {formatDate(selectedDate)}
          </p>
        </div>
        
        {streak > 0 && (
          <div style={{
            background: `linear-gradient(135deg, ${theme.colors.accent.honey}20, ${theme.colors.accent.peach}20)`,
            padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
            borderRadius: theme.borderRadius.full,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            border: `1px solid ${theme.colors.accent.honey}40`
          }}>
            <Flame size={20} color={theme.colors.accent.terracotta} />
            <span style={{ fontWeight: 600 }}>{streak} day streak</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.xl,
        borderBottom: `1px solid ${theme.colors.neutral[200]}`,
        paddingBottom: theme.spacing.sm,
        overflowX: 'auto'
      }}>
        {['overview', 'sleep', 'exercise', 'hydration'].map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
              background: activeTab === tab ? theme.colors.primary.gradient : 'transparent',
              border: 'none',
              borderRadius: theme.borderRadius.full,
              color: activeTab === tab ? 'white' : theme.colors.text.secondary,
              fontSize: theme.typography.small,
              fontWeight: activeTab === tab ? 600 : 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs,
              transition: 'all 0.2s'
            }}
          >
            {tab === 'overview' && <TrendingUp size={16} />}
            {tab === 'sleep' && <Moon size={16} />}
            {tab === 'exercise' && <Activity size={16} />}
            {tab === 'hydration' && <Droplets size={16} />}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Feedback Toast */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: theme.colors.success.light,
              color: theme.colors.success.dark,
              padding: theme.spacing.md,
              borderRadius: theme.borderRadius.lg,
              marginBottom: theme.spacing.lg,
              fontSize: theme.typography.small,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.sm,
              border: `1px solid ${theme.colors.success.main}40`
            }}
          >
            <Sparkles size={16} />
            {feedback}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wellness Score Card */}
      {wellnessScore && (
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          style={{
            background: `linear-gradient(135deg, ${userData?.personality?.color || theme.colors.accent.terracotta}20, ${theme.colors.accent.peach}20)`,
            borderRadius: theme.borderRadius.xl,
            padding: theme.spacing.xl,
            marginBottom: theme.spacing.xl,
            border: `1px solid ${userData?.personality?.color || theme.colors.accent.terracotta}30`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '150px',
            height: '150px',
            background: `radial-gradient(circle at 100% 0%, ${userData?.personality?.color || theme.colors.accent.terracotta}20, transparent 70%)`,
            borderRadius: '0 0 0 100%'
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md,
              flexWrap: 'wrap',
              gap: theme.spacing.sm
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                <Target size={20} color={userData?.personality?.color || theme.colors.accent.terracotta} />
                <span style={{ fontSize: theme.typography.small, fontWeight: 500 }}>
                  Daily Wellness Score
                </span>
              </div>
              {userData?.personality && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.xs,
                  background: 'white',
                  padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                  borderRadius: theme.borderRadius.full,
                  fontSize: theme.typography.tiny
                }}>
                  <span>{userData.personality.emoji}</span>
                  <span>{userData.personality.name}</span>
                </div>
              )}
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: theme.spacing.xs,
              marginBottom: theme.spacing.xs
            }}>
              <span style={{ fontSize: '64px', fontWeight: 700, lineHeight: 1 }}>
                {wellnessScore.score}
              </span>
              <span style={{ fontSize: theme.typography.h4, color: theme.colors.text.secondary }}>
                /100
              </span>
            </div>

            <p style={{
              fontSize: theme.typography.body,
              color: theme.colors.text.secondary,
              marginBottom: theme.spacing.md
            }}>
              {wellnessScore.interpretation || "Be kind to yourself. Every small step counts."}
            </p>

            {/* Weekly trend */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.md,
              flexWrap: 'wrap'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.xs,
                background: 'white',
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                borderRadius: theme.borderRadius.full
              }}>
                <TrendingUp size={14} color={theme.colors.success.main} />
                <span style={{ fontSize: theme.typography.tiny }}>
                  +12% from last week
                </span>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.xs,
                background: 'white',
                padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
                borderRadius: theme.borderRadius.full
              }}>
                <Award size={14} color={theme.colors.accent.honey} />
                <span style={{ fontSize: theme.typography.tiny }}>
                  Top 10% of users
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Content Area based on active tab */}
      <AnimatePresence mode="wait">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: theme.spacing.lg
            }}
          >
            {/* Sleep Card */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <Moon size={20} color={theme.colors.accent.lavender} />
                  <h3 style={cardTitleStyle}>Sleep</h3>
                </div>
                <span style={{
                  fontSize: theme.typography.tiny,
                  color: theme.colors.text.muted,
                  background: theme.colors.neutral[100],
                  padding: '2px 8px',
                  borderRadius: theme.borderRadius.full
                }}>
                  {sleep.consistency}% consistent
                </span>
              </div>
              
              <div style={{ marginBottom: theme.spacing.md }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: theme.spacing.xs
                }}>
                  <span style={{ fontSize: theme.typography.small, color: theme.colors.text.secondary }}>
                    Duration
                  </span>
                  <span style={{ fontSize: theme.typography.h3, fontWeight: 600 }}>
                    {sleep.hours}h
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: theme.spacing.sm
                }}>
                  <span style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                    {sleep.bedtime} - {sleep.wakeTime}
                  </span>
                  <span style={{
                    fontSize: theme.typography.tiny,
                    color: getProgressColor(sleep.hours, 8),
                    fontWeight: 600
                  }}>
                    {Math.round((sleep.hours / 8) * 100)}% of goal
                  </span>
                </div>
                
                {/* Quality indicator */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  padding: theme.spacing.sm,
                  background: theme.colors.neutral[50],
                  borderRadius: theme.borderRadius.lg
                }}>
                  <span style={{ fontSize: theme.typography.small }}>Quality:</span>
                  <div style={{ display: 'flex', gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((q) => (
                      <div
                        key={q}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: theme.borderRadius.full,
                          background: q <= sleep.quality ? theme.colors.accent.honey : theme.colors.neutral[200],
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px'
                        }}
                      >
                        {q <= sleep.quality ? '⭐' : ''}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('sleep')}
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  background: 'transparent',
                  border: `1px solid ${theme.colors.neutral[300]}`,
                  borderRadius: theme.borderRadius.lg,
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.small,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing.xs
                }}
              >
                View Details
                <ChevronRight size={16} />
              </motion.button>
            </div>

            {/* Exercise Card */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <Activity size={20} color={theme.colors.accent.sage} />
                  <h3 style={cardTitleStyle}>Exercise</h3>
                </div>
                <span style={{
                  fontSize: theme.typography.tiny,
                  color: theme.colors.text.muted,
                  background: theme.colors.neutral[100],
                  padding: '2px 8px',
                  borderRadius: theme.borderRadius.full
                }}>
                  {exercise.calories} cal
                </span>
              </div>

              <div style={{ marginBottom: theme.spacing.md }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: theme.spacing.xs
                }}>
                  <span style={{ fontSize: theme.typography.small, color: theme.colors.text.secondary }}>
                    Today
                  </span>
                  <span style={{ fontSize: theme.typography.h3, fontWeight: 600 }}>
                    {exercise.minutes}min
                  </span>
                </div>
                
                {/* Weekly mini chart */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end',
                  height: 40,
                  marginBottom: theme.spacing.sm
                }}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                    <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{
                        width: 24,
                        height: Math.max(4, (exercise.weekly[i] / 60) * 40),
                        background: exercise.weekly[i] > 0 ? theme.colors.accent.sage : theme.colors.neutral[200],
                        borderRadius: theme.borderRadius.sm,
                        marginBottom: 4
                      }} />
                      <span style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                        {day}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  padding: theme.spacing.sm,
                  background: theme.colors.neutral[50],
                  borderRadius: theme.borderRadius.lg
                }}>
                  <Zap size={16} color={theme.colors.accent.honey} />
                  <span style={{ fontSize: theme.typography.tiny }}>
                    {exercise.intensity.charAt(0).toUpperCase() + exercise.intensity.slice(1)} intensity
                  </span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('exercise')}
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  background: 'transparent',
                  border: `1px solid ${theme.colors.neutral[300]}`,
                  borderRadius: theme.borderRadius.lg,
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.small,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing.xs
                }}
              >
                View Details
                <ChevronRight size={16} />
              </motion.button>
            </div>

            {/* Hydration Card */}
            <div style={cardStyle}>
              <div style={cardHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <Droplets size={20} color={theme.colors.accent.teal} />
                  <h3 style={cardTitleStyle}>Hydration</h3>
                </div>
                <span style={{
                  fontSize: theme.typography.tiny,
                  color: theme.colors.text.muted,
                  background: theme.colors.neutral[100],
                  padding: '2px 8px',
                  borderRadius: theme.borderRadius.full
                }}>
                  {water.glasses}/{water.goal}
                </span>
              </div>

              <div style={{ marginBottom: theme.spacing.md }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  marginBottom: theme.spacing.xs
                }}>
                  <span style={{ fontSize: theme.typography.small, color: theme.colors.text.secondary }}>
                    Progress
                  </span>
                  <span style={{ fontSize: theme.typography.h3, fontWeight: 600 }}>
                    {Math.round((water.glasses / water.goal) * 100)}%
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{
                  height: 24,
                  background: theme.colors.neutral[100],
                  borderRadius: theme.borderRadius.full,
                  marginBottom: theme.spacing.md,
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(water.glasses / water.goal) * 100}%` }}
                    style={{
                      height: '100%',
                      background: `linear-gradient(90deg, ${theme.colors.accent.teal}, ${theme.colors.accent.sage})`,
                      borderRadius: theme.borderRadius.full,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      paddingRight: theme.spacing.sm
                    }}
                  >
                    {water.glasses > 0 && (
                      <span style={{ fontSize: theme.typography.tiny, color: 'white' }}>
                        {water.glasses}/{water.goal}
                      </span>
                    )}
                  </motion.div>
                </div>

                {/* Quick add buttons */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: theme.spacing.xs
                }}>
                  {[1, 2, 3, 4].map((amount) => (
                    <motion.button
                      key={amount}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        if (water.glasses + amount <= water.goal) {
                          setWater(prev => ({ ...prev, glasses: prev.glasses + amount }));
                          handleTrackWater();
                        }
                      }}
                      disabled={water.glasses + amount > water.goal}
                      style={{
                        padding: theme.spacing.sm,
                        background: water.glasses + amount <= water.goal 
                          ? theme.colors.accent.teal + '20'
                          : theme.colors.neutral[100],
                        border: 'none',
                        borderRadius: theme.borderRadius.lg,
                        color: water.glasses + amount <= water.goal 
                          ? theme.colors.accent.teal
                          : theme.colors.text.muted,
                        fontSize: theme.typography.small,
                        cursor: water.glasses + amount <= water.goal ? 'pointer' : 'not-allowed',
                        fontWeight: 600
                      }}
                    >
                      +{amount}
                    </motion.button>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab('hydration')}
                style={{
                  width: '100%',
                  padding: theme.spacing.sm,
                  background: 'transparent',
                  border: `1px solid ${theme.colors.neutral[300]}`,
                  borderRadius: theme.borderRadius.lg,
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.small,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing.xs
                }}
              >
                View Details
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Sleep Tab */}
        {activeTab === 'sleep' && (
          <motion.div
            key="sleep"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={detailCardStyle}>
              <h3 style={detailTitleStyle}>Track Your Sleep</h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: theme.spacing.xl,
                marginBottom: theme.spacing.xl
              }}>
                {/* Hours input */}
                <div>
                  <label style={labelStyle}>
                    <Clock size={16} />
                    Hours of Sleep
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="0.5"
                    value={sleep.hours}
                    onChange={(e) => setSleep({ ...sleep, hours: parseFloat(e.target.value) })}
                    style={{ width: '100%', marginTop: theme.spacing.sm }}
                  />
                  <div style={{
                    textAlign: 'center',
                    fontSize: theme.typography.h3,
                    fontWeight: 600,
                    marginTop: theme.spacing.sm,
                    color: getProgressColor(sleep.hours, 8)
                  }}>
                    {sleep.hours} hours
                  </div>
                </div>

                {/* Quality selection */}
                <div>
                  <label style={labelStyle}>
                    <Sparkles size={16} />
                    Sleep Quality
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: theme.spacing.xs,
                    marginTop: theme.spacing.sm
                  }}>
                    {[1, 2, 3, 4, 5].map((q) => (
                      <motion.button
                        key={q}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSleep({ ...sleep, quality: q })}
                        style={{
                          padding: theme.spacing.md,
                          border: `2px solid ${sleep.quality === q ? theme.colors.accent.honey : theme.colors.neutral[200]}`,
                          borderRadius: theme.borderRadius.lg,
                          background: sleep.quality === q ? `${theme.colors.accent.honey}20` : 'white',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <span style={{ fontSize: '20px' }}>
                          {q === 1 ? '😴' : q === 2 ? '😐' : q === 3 ? '🙂' : q === 4 ? '😊' : '✨'}
                        </span>
                        <span style={{ fontSize: theme.typography.tiny }}>
                          {qualityEmojis[q].split(' ')[1]}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Bedtime/Wake time */}
                <div>
                  <label style={labelStyle}>
                    <Moon size={16} />
                    Bedtime & Wake Time
                  </label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: theme.spacing.md,
                    marginTop: theme.spacing.sm
                  }}>
                    <div>
                      <span style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                        Bedtime
                      </span>
                      <input
                        type="time"
                        value={sleep.bedtime}
                        onChange={(e) => setSleep({ ...sleep, bedtime: e.target.value })}
                        style={timeInputStyle}
                      />
                    </div>
                    <div>
                      <span style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                        Wake up
                      </span>
                      <input
                        type="time"
                        value={sleep.wakeTime}
                        onChange={(e) => setSleep({ ...sleep, wakeTime: e.target.value })}
                        style={timeInputStyle}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTrackSleep}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: theme.spacing.lg,
                  background: `linear-gradient(135deg, ${theme.colors.accent.lavender}, ${theme.colors.accent.purple})`,
                  color: 'white',
                  border: 'none',
                  borderRadius: theme.borderRadius.lg,
                  fontSize: theme.typography.body,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing.sm
                }}
              >
                {loading ? 'Tracking...' : 'Track Sleep'}
                {!loading && <ChevronRight size={20} />}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Exercise Tab */}
        {activeTab === 'exercise' && (
          <motion.div
            key="exercise"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={detailCardStyle}>
              <h3 style={detailTitleStyle}>Log Your Exercise</h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: theme.spacing.xl,
                marginBottom: theme.spacing.xl
              }}>
                {/* Exercise type */}
                <div>
                  <label style={labelStyle}>Exercise Type</label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: theme.spacing.sm,
                    marginTop: theme.spacing.sm
                  }}>
                    {exerciseTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <motion.button
                          key={type.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setExercise({ ...exercise, type: type.id })}
                          style={{
                            padding: theme.spacing.md,
                            border: `2px solid ${exercise.type === type.id ? theme.colors.accent.sage : theme.colors.neutral[200]}`,
                            borderRadius: theme.borderRadius.lg,
                            background: exercise.type === type.id ? `${theme.colors.accent.sage}20` : 'white',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: theme.spacing.xs
                          }}
                        >
                          <Icon size={24} color={exercise.type === type.id ? theme.colors.accent.sage : theme.colors.text.muted} />
                          <span style={{ fontSize: theme.typography.tiny }}>{type.label}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label style={labelStyle}>
                    <Clock size={16} />
                    Duration (minutes)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="120"
                    step="5"
                    value={exercise.minutes}
                    onChange={(e) => {
                      const mins = parseInt(e.target.value);
                      setExercise({ 
                        ...exercise, 
                        minutes: mins,
                        calories: calculateCalories(mins, exercise.intensity)
                      });
                    }}
                    style={{ width: '100%', marginTop: theme.spacing.sm }}
                  />
                  <div style={{
                    textAlign: 'center',
                    fontSize: theme.typography.h3,
                    fontWeight: 600,
                    marginTop: theme.spacing.sm
                  }}>
                    {exercise.minutes} min
                  </div>
                </div>

                {/* Intensity */}
                <div>
                  <label style={labelStyle}>
                    <Zap size={16} />
                    Intensity
                  </label>
                  <select
                    value={exercise.intensity}
                    onChange={(e) => {
                      const intensity = e.target.value;
                      setExercise({ 
                        ...exercise, 
                        intensity,
                        calories: calculateCalories(exercise.minutes, intensity)
                      });
                    }}
                    style={{
                      width: '100%',
                      padding: theme.spacing.md,
                      borderRadius: theme.borderRadius.lg,
                      border: `1px solid ${theme.colors.neutral[300]}`,
                      fontSize: theme.typography.body,
                      marginTop: theme.spacing.sm,
                      background: 'white'
                    }}
                  >
                    <option value="light">Light (walking, stretching)</option>
                    <option value="moderate">Moderate (jogging, cycling)</option>
                    <option value="vigorous">Vigorous (running, HIIT)</option>
                  </select>
                </div>

                {/* Calories */}
                <div style={{
                  background: `${theme.colors.accent.sage}10`,
                  padding: theme.spacing.lg,
                  borderRadius: theme.borderRadius.lg,
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: theme.typography.small, color: theme.colors.text.secondary }}>
                    Estimated Calories Burned
                  </span>
                  <div style={{ fontSize: '48px', fontWeight: 700, color: theme.colors.accent.sage }}>
                    {exercise.calories}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTrackExercise}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: theme.spacing.lg,
                  background: `linear-gradient(135deg, ${theme.colors.accent.sage}, ${theme.colors.accent.teal})`,
                  color: 'white',
                  border: 'none',
                  borderRadius: theme.borderRadius.lg,
                  fontSize: theme.typography.body,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing.sm
                }}
              >
                {loading ? 'Logging...' : 'Log Exercise'}
                {!loading && <ChevronRight size={20} />}
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Hydration Tab */}
        {activeTab === 'hydration' && (
          <motion.div
            key="hydration"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={detailCardStyle}>
              <h3 style={detailTitleStyle}>Track Your Water Intake</h3>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: theme.spacing.xl,
                marginBottom: theme.spacing.xl
              }}>
                {/* Current progress */}
                <div style={{
                  background: `${theme.colors.accent.teal}10`,
                  borderRadius: theme.borderRadius.xl,
                  padding: theme.spacing.xl,
                  textAlign: 'center'
                }}>
                  <Droplets size={48} color={theme.colors.accent.teal} />
                  <div style={{ fontSize: '72px', fontWeight: 700, color: theme.colors.accent.teal }}>
                    {water.glasses}
                  </div>
                  <div style={{ fontSize: theme.typography.h4, color: theme.colors.text.secondary, marginBottom: theme.spacing.md }}>
                    of {water.goal} glasses
                  </div>
                  
                  {/* Progress circle */}
                  <div style={{
                    width: 120,
                    height: 120,
                    margin: '0 auto',
                    position: 'relative'
                  }}>
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke={theme.colors.neutral[200]}
                        strokeWidth="12"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="54"
                        fill="none"
                        stroke={theme.colors.accent.teal}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 54}`}
                        strokeDashoffset={2 * Math.PI * 54 * (1 - water.glasses / water.goal)}
                        transform="rotate(-90 60 60)"
                      />
                    </svg>
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      fontSize: theme.typography.h3,
                      fontWeight: 600
                    }}>
                      {Math.round((water.glasses / water.goal) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Quick add */}
                <div>
                  <label style={labelStyle}>Quick Add</label>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: theme.spacing.md,
                    marginTop: theme.spacing.sm
                  }}>
                    {[1, 2, 3, 4].map((amount) => (
                      <motion.button
                        key={amount}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (water.glasses + amount <= water.goal) {
                            for (let i = 0; i < amount; i++) {
                              handleTrackWater();
                            }
                          }
                        }}
                        disabled={water.glasses + amount > water.goal}
                        style={{
                          padding: theme.spacing.xl,
                          background: water.glasses + amount <= water.goal 
                            ? `${theme.colors.accent.teal}20`
                            : theme.colors.neutral[100],
                          border: `2px solid ${water.glasses + amount <= water.goal ? theme.colors.accent.teal : theme.colors.neutral[200]}`,
                          borderRadius: theme.borderRadius.lg,
                          color: water.glasses + amount <= water.goal 
                            ? theme.colors.accent.teal
                            : theme.colors.text.muted,
                          fontSize: theme.typography.h3,
                          cursor: water.glasses + amount <= water.goal ? 'pointer' : 'not-allowed',
                          fontWeight: 600,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: theme.spacing.sm
                        }}
                      >
                        <Droplets size={32} />
                        +{amount}
                      </motion.button>
                    ))}
                  </div>

                  {/* Goal setting */}
                  <div style={{ marginTop: theme.spacing.xl }}>
                    <label style={labelStyle}>Daily Goal</label>
                    <input
                      type="range"
                      min="4"
                      max="12"
                      step="1"
                      value={water.goal}
                      onChange={(e) => setWater({ ...water, goal: parseInt(e.target.value) })}
                      style={{ width: '100%', marginTop: theme.spacing.sm }}
                    />
                    <div style={{
                      textAlign: 'center',
                      fontSize: theme.typography.h3,
                      fontWeight: 600,
                      marginTop: theme.spacing.sm,
                      color: theme.colors.accent.teal
                    }}>
                      {water.goal} glasses
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weekly Summary */}
      <div style={{
        marginTop: theme.spacing.xl,
        padding: theme.spacing.lg,
        background: theme.colors.neutral[50],
        borderRadius: theme.borderRadius.xl,
        border: `1px solid ${theme.colors.neutral[200]}`
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.spacing.lg
        }}>
          <h4 style={{ fontSize: theme.typography.h4, display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
            <Calendar size={20} />
            This Week's Summary
          </h4>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHistory(!showHistory)}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.text.secondary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing.xs
            }}
          >
            {showHistory ? 'Show less' : 'View history'}
            <ChevronRight size={16} style={{ transform: showHistory ? 'rotate(90deg)' : 'none' }} />
          </motion.button>
        </div>

        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {/* Weekly charts would go here */}
              <p style={{ color: theme.colors.text.muted, textAlign: 'center', padding: theme.spacing.xl }}>
                Detailed weekly history coming soon...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Reusable styles
const cardStyle = {
  background: 'white',
  borderRadius: theme.borderRadius.xl,
  padding: theme.spacing.lg,
  boxShadow: theme.shadows.sm,
  border: `1px solid ${theme.colors.neutral[200]}`,
  transition: 'all 0.2s',
  ':hover': {
    boxShadow: theme.shadows.md,
    transform: 'translateY(-2px)'
  }
};

const cardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing.md
};

const cardTitleStyle = {
  fontSize: theme.typography.h4,
  margin: 0,
  color: theme.colors.text.primary
};

const detailCardStyle = {
  background: theme.colors.neutral[50],
  borderRadius: theme.borderRadius.xl,
  padding: theme.spacing.xl,
  border: `1px solid ${theme.colors.neutral[200]}`
};

const detailTitleStyle = {
  fontSize: theme.typography.h3,
  marginBottom: theme.spacing.xl,
  color: theme.colors.text.primary
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing.xs,
  fontSize: theme.typography.small,
  color: theme.colors.text.secondary,
  marginBottom: theme.spacing.xs
};

const timeInputStyle = {
  width: '100%',
  padding: theme.spacing.sm,
  borderRadius: theme.borderRadius.lg,
  border: `1px solid ${theme.colors.neutral[300]}`,
  fontSize: theme.typography.body,
  marginTop: 4,
  background: 'white'
};

export default WellnessDashboard;