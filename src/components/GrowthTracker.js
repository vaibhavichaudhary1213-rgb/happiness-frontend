// components/GrowthTracker.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { forestCabinTheme as theme } from "../styles/forestCabinTheme.js";
import * as wellnessApi from "../services/wellnessApi.js";
import '../styles/global.css';

// Icons
import { 
  Heart, 
  Sparkles, 
  BookOpen, 
  Sun, 
  Moon,
  Plus, 
  Star,
  Smile,
  Coffee,
  Brain,
  Feather,
  Compass,
  Gift,
  Camera,
  Music,
  PenTool,
  Send,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Award,
  TrendingUp,
  Clock,
  Download,
  Share2,
  Lock,
  Unlock,
  Zap,
  X   
} from 'lucide-react';

function GrowthTracker({ userId = "user_1", userData }) {
  const [activeTab, setActiveTab] = useState("joy");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  
  // Joy Triggers State
  const [joyQuestion, setJoyQuestion] = useState("");
  const [joyAnswer, setJoyAnswer] = useState("");
  const [joyHistory, setJoyHistory] = useState([]);
  
  // Student Prompts State
  const [studentPrompt, setStudentPrompt] = useState("");
  const [studentAnswer, setStudentAnswer] = useState("");
  const [studentGoals, setStudentGoals] = useState([]);
  
  // Kindness State
  const [kindnessChallenge, setKindnessChallenge] = useState("");
  const [kindnessStats, setKindnessStats] = useState(null);
  const [kindnessActs, setKindnessActs] = useState([]);
  const [kindnessReflection, setKindnessReflection] = useState("");
  
  // Self Love State
  const [selfLovePrompt, setSelfLovePrompt] = useState("");
  const [selfLoveAnswer, setSelfLoveAnswer] = useState("");
  const [affirmations, setAffirmations] = useState([]);
  const [gratitudeEntries, setGratitudeEntries] = useState([]);
  
  // Achievement State
  const [achievements, setAchievements] = useState([]);
  const [streak, setStreak] = useState(0);
  const [points, setPoints] = useState(0);

  // Learning Goals state
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [newGoal, setNewGoal] = useState("");
  const [learningGoals, setLearningGoals] = useState([
    { id: 1, text: "Read 12 books this year", completed: false },
    { id: 2, text: "Learn meditation basics", completed: false },
    { id: 3, text: "Practice daily journaling", completed: false }
  ]);

  // Tabs configuration
  const tabs = [
    { 
      id: "joy", 
      label: "Joy Triggers", 
      icon: Sun, 
      color: theme.colors.accent.honey,
      description: "Discover what lights you up"
    },
    { 
      id: "student", 
      label: "Student Journey", 
      icon: BookOpen, 
      color: theme.colors.accent.lavender,
      description: "Learn and grow every day"
    },
    { 
      id: "kindness", 
      label: "Kindness Path", 
      icon: Heart, 
      color: theme.colors.accent.sage,
      description: "Spread warmth to others"
    },
    { 
      id: "selflove", 
      label: "Self Love", 
      icon: Star, 
      color: theme.colors.accent.peach,
      description: "Nurture your inner world"
    },
    { 
      id: "gratitude", 
      label: "Gratitude Garden", 
      icon: Sparkles, 
      color: theme.colors.accent.teal,
      description: "Count your blessings"
    },
    { 
      id: "achievements", 
      label: "Milestones", 
      icon: Award, 
      color: theme.colors.accent.purple,
      description: "Celebrate your growth"
    }
  ];

  // Joy triggers questions
  const joyQuestions = [
    "What instantly makes you smile?",
    "When did you last lose track of time?",
    "What's a small pleasure you enjoyed today?",
    "Who makes you feel most alive?",
    "What activity completely absorbs your attention?",
    "What's a childhood joy you still love?",
    "What sound brings you peace?",
    "What's your favorite way to spend a free afternoon?",
    "What memory never fails to warm your heart?",
    "What's something beautiful you saw recently?"
  ];

  // Student prompts
  const studentPrompts = [
    "What's one thing you learned today?",
    "What skill would you like to develop?",
    "What challenged you recently and how did you grow?",
    "What's a goal you're working toward?",
    "What's something you're curious about?",
    "What mistake taught you something valuable?",
    "What would you like to understand better?",
    "What's a book or article that changed your perspective?",
    "What's a question you're sitting with?",
    "What knowledge can you share with others?"
  ];

  // Kindness challenges
  const kindnessChallenges = [
    {
      id: 1,
      title: "Compliment Three People",
      description: "Give genuine compliments to three different people today",
      category: "words",
      points: 30
    },
    {
      id: 2,
      title: "Random Act of Kindness",
      description: "Do something unexpected and kind for a stranger",
      category: "actions",
      points: 50
    },
    {
      id: 3,
      title: "Listen Deeply",
      description: "Give someone your full attention without interrupting",
      category: "presence",
      points: 25
    },
    {
      id: 4,
      title: "Kind Message",
      description: "Send an encouraging message to someone who needs it",
      category: "words",
      points: 20
    },
    {
      id: 5,
      title: "Help Without Being Asked",
      description: "Notice what someone needs and offer help",
      category: "actions",
      points: 40
    },
    {
      id: 6,
      title: "Forgive Yourself",
      description: "Let go of one thing you've been holding against yourself",
      category: "self",
      points: 60
    }
  ];

  const handleAddGoal = () => {
  if (!newGoal.trim()) return;
  
  const goal = {
    id: Date.now(),
    text: newGoal,
    completed: false
  };
  
  setLearningGoals([...learningGoals, goal]);
  setNewGoal("");
  setShowGoalInput(false);
  
  setFeedback("📚 New goal added!");
  setTimeout(() => setFeedback(""), 3000);
};

const toggleGoalCompletion = (goalId) => {
  setLearningGoals(learningGoals.map(goal =>
    goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
  ));
  
  // Optional: Add points when completing a goal
  const goal = learningGoals.find(g => g.id === goalId);
  if (goal && !goal.completed) {
    setPoints(prev => prev + 10);
  }
};

const handleDeleteGoal = (goalId) => {
  if (window.confirm("Delete this goal?")) {
    setLearningGoals(learningGoals.filter(goal => goal.id !== goalId));
  }
};

  // Self love prompts
  const selfLovePrompts = [
    "What do you appreciate about your body?",
    "What's a kind thing you can say to yourself right now?",
    "What boundary do you need to set?",
    "What makes you uniquely you?",
    "What's something you've overcome?",
    "What do your loved ones appreciate about you?",
    "What self-care practice feels best today?",
    "What's a promise you can make to yourself?",
    "What strength have you developed recently?",
    "How can you be your own best friend today?"
  ];

  // Affirmations library
  const affirmationLibrary = [
    "I am enough, exactly as I am.",
    "My feelings are valid and important.",
    "I deserve love and kindness, especially from myself.",
    "I am growing stronger every day.",
    "I trust myself to make good decisions.",
    "I am worthy of rest and peace.",
    "I celebrate my progress, no matter how small.",
    "I release comparison and embrace my unique journey.",
    "I am capable of handling whatever comes my way.",
    "I choose to be kind to myself today."
  ];

  useEffect(() => {
    loadGrowthData();
    calculateStreak();
  }, []);

  const loadGrowthData = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      const mockJoyHistory = [
        { date: "2024-03-09", question: "What made you smile today?", answer: "Seeing a golden retriever at the park" },
        { date: "2024-03-08", question: "What's a small pleasure you enjoyed?", answer: "Morning coffee in silence" },
        { date: "2024-03-07", question: "What memory warms your heart?", answer: "Childhood beach trips with family" }
      ];

      const mockKindnessActs = [
        { id: 1, date: "2024-03-09", action: "Complimented a colleague", points: 30, category: "words" },
        { id: 2, date: "2024-03-08", action: "Held door for stranger", points: 20, category: "actions" },
        { id: 3, date: "2024-03-07", action: "Sent encouraging text", points: 25, category: "words" }
      ];

      const mockGratitudeEntries = [
        { id: 1, date: "2024-03-09", entry: "Cool breeze on my face" },
        { id: 2, date: "2024-03-09", entry: "Kind message from a friend" },
        { id: 3, date: "2024-03-08", entry: "Delicious homemade hot chocolate" }
      ];

      const mockAchievements = [
        { id: 1, title: "First Joy Reflection", description: "Completed your first joy trigger", unlocked: true, date: "2024-03-01", icon: "🌸" },
        { id: 2, title: "Kindness Starter", description: "Completed 5 kind acts", unlocked: true, date: "2024-03-05", icon: "💝" },
        { id: 3, title: "Gratitude Gatherer", description: "Wrote 10 gratitude entries", unlocked: false, progress: 7, target: 10, icon: "✨" },
        { id: 4, title: "Self Love Master", description: "Completed 15 self reflections", unlocked: false, progress: 8, target: 15, icon: "🌟" },
        { id: 5, title: "Student of Life", description: "Learned something new for 7 days", unlocked: false, progress: 4, target: 7, icon: "📚" }
      ];

      setJoyHistory(mockJoyHistory);
      setKindnessActs(mockKindnessActs);
      setGratitudeEntries(mockGratitudeEntries);
      setAchievements(mockAchievements);
      setJoyQuestion(joyQuestions[Math.floor(Math.random() * joyQuestions.length)]);
      setStudentPrompt(studentPrompts[Math.floor(Math.random() * studentPrompts.length)]);
      setSelfLovePrompt(selfLovePrompts[Math.floor(Math.random() * selfLovePrompts.length)]);
      setKindnessChallenge(kindnessChallenges[Math.floor(Math.random() * kindnessChallenges.length)]);
      
      // Calculate points from completed actions
      const totalPoints = mockKindnessActs.reduce((sum, act) => sum + act.points, 0) + 
                         mockJoyHistory.length * 10 + 
                         mockGratitudeEntries.length * 5;
      setPoints(totalPoints);

    } catch (error) {
      console.error("Failed to load growth data:", error);
    }
    setLoading(false);
  };

  const calculateStreak = () => {
    // Calculate streak based on daily reflections
    // This is a simplified version
    setStreak(5); // Mock streak
  };

  const handleJoySubmit = () => {
    if (!joyAnswer.trim()) return;

    const newEntry = {
      date: new Date().toISOString().split('T')[0],
      question: joyQuestion,
      answer: joyAnswer
    };

    setJoyHistory([newEntry, ...joyHistory]);
    setJoyAnswer("");
    setJoyQuestion(joyQuestions[Math.floor(Math.random() * joyQuestions.length)]);
    setPoints(prev => prev + 10);
    
    setFeedback("🌸 Joy captured! +10 points");
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleStudentSubmit = () => {
    if (!studentAnswer.trim()) return;

    const newGoal = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      prompt: studentPrompt,
      reflection: studentAnswer,
      completed: true
    };

    setStudentGoals([newGoal, ...studentGoals]);
    setStudentAnswer("");
    setStudentPrompt(studentPrompts[Math.floor(Math.random() * studentPrompts.length)]);
    setPoints(prev => prev + 15);
    
    setFeedback("📚 Growth recorded! +15 points");
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleKindnessComplete = (challenge) => {
    const newAct = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      action: challenge.title,
      points: challenge.points,
      category: challenge.category
    };

    setKindnessActs([newAct, ...kindnessActs]);
    setPoints(prev => prev + challenge.points);
    
    // Update stats
    const categoryCount = kindnessActs.filter(a => a.category === challenge.category).length + 1;
    setKindnessStats({
      total: kindnessActs.length + 1,
      by_category: {
        ...kindnessStats?.by_category,
        [challenge.category]: categoryCount
      }
    });

    setKindnessChallenge(kindnessChallenges[Math.floor(Math.random() * kindnessChallenges.length)]);
    
    setFeedback(`💝 Kindness logged! +${challenge.points} points`);
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleSelfLoveSubmit = () => {
    if (!selfLoveAnswer.trim()) return;

    // Add to affirmations or reflections
    setAffirmations([selfLoveAnswer, ...affirmations].slice(0, 10));
    setSelfLoveAnswer("");
    setSelfLovePrompt(selfLovePrompts[Math.floor(Math.random() * selfLovePrompts.length)]);
    setPoints(prev => prev + 20);
    
    setFeedback("💖 Self love recorded! +20 points");
    setTimeout(() => setFeedback(""), 3000);
  };

  const handleGratitudeSubmit = (entry) => {
    if (!entry.trim()) return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      entry: entry
    };

    setGratitudeEntries([newEntry, ...gratitudeEntries]);
    setPoints(prev => prev + 5);
    
    setFeedback("🙏 Gratitude added! +5 points");
    setTimeout(() => setFeedback(""), 3000);
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
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
      {/* Header with Stats */}
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
            <Sparkles size={28} /> Growth & Reflection
          </h2>
          <p style={{
            fontSize: theme.typography.small,
            color: theme.colors.text.secondary,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.xs
          }}>
            <Calendar size={14} />
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Points and Streak */}
        <div style={{ display: 'flex', gap: theme.spacing.md }}>
          <div style={{
            background: `${theme.colors.accent.honey}20`,
            padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
            borderRadius: theme.borderRadius.full,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            border: `1px solid ${theme.colors.accent.honey}40`
          }}>
            <Zap size={20} color={theme.colors.accent.honey} />
            <span style={{ fontWeight: 600 }}>{points} points</span>
          </div>
          <div style={{
            background: `${theme.colors.accent.sage}20`,
            padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
            borderRadius: theme.borderRadius.full,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            border: `1px solid ${theme.colors.accent.sage}40`
          }}>
            <TrendingUp size={20} color={theme.colors.accent.sage} />
            <span style={{ fontWeight: 600 }}>{streak} day streak</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{
        display: 'flex',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.xl,
        overflowX: 'auto',
        paddingBottom: theme.spacing.sm
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                background: isActive ? `${tab.color}20` : 'transparent',
                border: `1px solid ${isActive ? tab.color : theme.colors.neutral[200]}`,
                borderRadius: theme.borderRadius.full,
                color: isActive ? tab.color : theme.colors.text.secondary,
                fontSize: theme.typography.small,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm,
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </motion.button>
          );
        })}
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

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {/* Joy Triggers Tab */}
        {activeTab === 'joy' && (
          <motion.div
            key="joy"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <Sun size={24} color={tabs[0].color} />
                  <h3 style={sectionTitleStyle}>Joy Triggers</h3>
                </div>
                <span style={badgeStyle}>
                  {joyHistory.length} reflections
                </span>
              </div>

              <p style={sectionDescriptionStyle}>
                Discover what lights you up. The more you notice joy, the more it grows.
              </p>

              {/* Today's Question */}
              <div style={{
                background: `${tabs[0].color}10`,
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing.xl,
                marginBottom: theme.spacing.xl
              }}>
                <div style={{
                  fontSize: theme.typography.h4,
                  color: tabs[0].color,
                  marginBottom: theme.spacing.lg,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm
                }}>
                  <Sparkles size={20} />
                  {joyQuestion}
                </div>

                <textarea
                  value={joyAnswer}
                  onChange={(e) => setJoyAnswer(e.target.value)}
                  placeholder="Take a moment to reflect..."
                  rows="4"
                  style={textareaStyle}
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleJoySubmit}
                  disabled={!joyAnswer.trim()}
                  style={{
                    ...submitButtonStyle,
                    background: !joyAnswer.trim() ? theme.colors.neutral[300] : tabs[0].color
                  }}
                >
                  <Send size={16} />
                  Save Reflection
                </motion.button>
              </div>

              {/* History */}
              {joyHistory.length > 0 && (
                <div>
                  <h4 style={{ fontSize: theme.typography.h4, marginBottom: theme.spacing.md }}>
                    Recent Reflections
                  </h4>
                  <div style={{ display: 'grid', gap: theme.spacing.md }}>
                    {joyHistory.slice(0, 3).map((entry, index) => (
                      <div key={index} style={historyCardStyle}>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: theme.spacing.sm
                        }}>
                          <span style={{ fontSize: theme.typography.tiny, color: tabs[0].color }}>
                            {entry.question}
                          </span>
                          <span style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                            {formatDate(entry.date)}
                          </span>
                        </div>
                        <p style={{ fontSize: theme.typography.body, color: theme.colors.text.primary }}>
                          {entry.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Student Journey Tab */}
        {activeTab === 'student' && (
          <motion.div
            key="student"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <BookOpen size={24} color={tabs[1].color} />
                  <h3 style={sectionTitleStyle}>Student Journey</h3>
                </div>
                <span style={badgeStyle}>
                  {studentGoals.length} insights
                </span>
              </div>

              <p style={sectionDescriptionStyle}>
                Every day is a chance to learn something new. Capture your growth.
              </p>

              {/* Today's Prompt */}
              <div style={{
                background: `${tabs[1].color}10`,
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing.xl,
                marginBottom: theme.spacing.xl
              }}>
                <div style={{
                  fontSize: theme.typography.h4,
                  color: tabs[1].color,
                  marginBottom: theme.spacing.lg,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm
                }}>
                  <Brain size={20} />
                  {studentPrompt}
                </div>

                <textarea
                  value={studentAnswer}
                  onChange={(e) => setStudentAnswer(e.target.value)}
                  placeholder="What did you learn or discover today?"
                  rows="4"
                  style={textareaStyle}
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStudentSubmit}
                  disabled={!studentAnswer.trim()}
                  style={{
                    ...submitButtonStyle,
                    background: !studentAnswer.trim() ? theme.colors.neutral[300] : tabs[1].color
                  }}
                >
                  <Send size={16} />
                  Capture Insight
                </motion.button>
              </div>

              {/* Learning Goals */}
              {/* Learning Goals with Add Functionality */}
              <div style={{
                background: theme.colors.neutral[50],
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing.lg
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: theme.spacing.md
                }}>
                  <h4 style={{ fontSize: theme.typography.h4 }}>
                    Learning Goals
                  </h4>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowGoalInput(!showGoalInput)}
                    style={{
                    padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                    background: tabs[1].color,
                    border: 'none',
                    borderRadius: theme.borderRadius.full,
                    color: 'white',
                    fontSize: theme.typography.tiny,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Plus size={14} />
                  Add Goal
                </motion.button>
              </div>

              {/* Add Goal Input */}
              <AnimatePresence>
                {showGoalInput && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden', marginBottom: theme.spacing.md }}
                  >
                    <div style={{
                      display: 'flex',
                      gap: theme.spacing.sm
                    }}>
                      <input
                        type="text"
                        value={newGoal}
                        onChange={(e) => setNewGoal(e.target.value)}
                        placeholder="e.g., Learn to play guitar"
                        style={{
                          flex: 1,
                          padding: theme.spacing.md,
                          borderRadius: theme.borderRadius.lg,
                          border: `1px solid ${theme.colors.neutral[300]}`,
                          fontSize: theme.typography.small,
                          outline: 'none'
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newGoal.trim()) {
                            handleAddGoal();
                          }
                        }}
                        autoFocus
                      />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddGoal}
            disabled={!newGoal.trim()}
            style={{
              padding: theme.spacing.md,
              background: !newGoal.trim() ? theme.colors.neutral[300] : tabs[1].color,
              border: 'none',
              borderRadius: theme.borderRadius.lg,
              color: 'white',
              cursor: !newGoal.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Plus size={18} />
          </motion.button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>

  {/* Goals List */}
  <div style={{ display: 'grid', gap: theme.spacing.sm }}>
    {learningGoals.map((goal) => (
      <div
        key={goal.id}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: theme.spacing.sm,
          background: 'white',
          borderRadius: theme.borderRadius.lg,
          border: `1px solid ${theme.colors.neutral[200]}`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm, flex: 1 }}>
          <input
            type="checkbox"
            checked={goal.completed}
            onChange={() => toggleGoalCompletion(goal.id)}
            style={{ width: 20, height: 20, cursor: 'pointer' }}
          />
          <span style={{
            fontSize: theme.typography.body,
            textDecoration: goal.completed ? 'line-through' : 'none',
            color: goal.completed ? theme.colors.text.muted : theme.colors.text.primary
          }}>
            {goal.text}
          </span>
        </div>
        
        <button
          onClick={() => handleDeleteGoal(goal.id)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: theme.colors.text.muted,
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={16} />
        </button>
      </div>
    ))}
  </div>

  {/* Progress Summary */}
  {learningGoals.length > 0 && (
    <div style={{
      marginTop: theme.spacing.md,
      padding: theme.spacing.sm,
      background: 'white',
      borderRadius: theme.borderRadius.lg,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <span style={{ fontSize: theme.typography.tiny, color: theme.colors.text.secondary }}>
        Progress
      </span>
      <span style={{ fontSize: theme.typography.small, fontWeight: 600 }}>
        {learningGoals.filter(g => g.completed).length}/{learningGoals.length} completed
      </span>
    </div>
  )}
</div>
            </div>
          </motion.div>
        )}

        {/* Kindness Path Tab */}
        {activeTab === 'kindness' && (
          <motion.div
            key="kindness"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <Heart size={24} color={tabs[2].color} />
                  <h3 style={sectionTitleStyle}>Kindness Path</h3>
                </div>
                <span style={badgeStyle}>
                  {kindnessActs.length} acts of kindness
                </span>
              </div>

              <p style={sectionDescriptionStyle}>
                Small acts of kindness create ripples of warmth in the world.
              </p>

              {/* Today's Challenge */}
              {kindnessChallenge && (
                <div style={{
                  background: `${tabs[2].color}10`,
                  borderRadius: theme.borderRadius.xl,
                  padding: theme.spacing.xl,
                  marginBottom: theme.spacing.xl
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.sm,
                    marginBottom: theme.spacing.md
                  }}>
                    <Gift size={24} color={tabs[2].color} />
                    <span style={{
                      fontSize: theme.typography.tiny,
                      color: 'white',
                      background: tabs[2].color,
                      padding: '2px 8px',
                      borderRadius: theme.borderRadius.full
                    }}>
                      +{kindnessChallenge.points} points
                    </span>
                  </div>

                  <h4 style={{
                    fontSize: theme.typography.h4,
                    color: tabs[2].color,
                    marginBottom: theme.spacing.sm
                  }}>
                    {kindnessChallenge.title}
                  </h4>

                  <p style={{
                    fontSize: theme.typography.body,
                    color: theme.colors.text.secondary,
                    marginBottom: theme.spacing.lg
                  }}>
                    {kindnessChallenge.description}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleKindnessComplete(kindnessChallenge)}
                    style={{
                      ...submitButtonStyle,
                      background: tabs[2].color
                    }}
                  >
                    <Heart size={16} />
                    Mark as Complete
                  </motion.button>
                </div>
              )}

              {/* Recent Kindness Acts */}
              {kindnessActs.length > 0 && (
                <div>
                  <h4 style={{ fontSize: theme.typography.h4, marginBottom: theme.spacing.md }}>
                    Recent Acts of Kindness
                  </h4>
                  <div style={{ display: 'grid', gap: theme.spacing.sm }}>
                    {kindnessActs.slice(0, 3).map((act) => (
                      <div key={act.id} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: theme.spacing.md,
                        background: 'white',
                        borderRadius: theme.borderRadius.lg,
                        border: `1px solid ${theme.colors.neutral[200]}`
                      }}>
                        <div>
                          <div style={{ fontSize: theme.typography.small, fontWeight: 600 }}>
                            {act.action}
                          </div>
                          <div style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                            {formatDate(act.date)}
                          </div>
                        </div>
                        <span style={{
                          fontSize: theme.typography.tiny,
                          color: 'white',
                          background: tabs[2].color,
                          padding: '2px 8px',
                          borderRadius: theme.borderRadius.full
                        }}>
                          +{act.points}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Self Love Tab */}
        {activeTab === 'selflove' && (
          <motion.div
            key="selflove"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <Star size={24} color={tabs[3].color} />
                  <h3 style={sectionTitleStyle}>Self Love</h3>
                </div>
                <span style={badgeStyle}>
                  {affirmations.length} affirmations
                </span>
              </div>

              <p style={sectionDescriptionStyle}>
                The most important relationship is the one you have with yourself.
              </p>

              {/* Today's Reflection */}
              <div style={{
                background: `${tabs[3].color}10`,
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing.xl,
                marginBottom: theme.spacing.xl
              }}>
                <div style={{
                  fontSize: theme.typography.h4,
                  color: tabs[3].color,
                  marginBottom: theme.spacing.lg,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm
                }}>
                  <Feather size={20} />
                  {selfLovePrompt}
                </div>

                <textarea
                  value={selfLoveAnswer}
                  onChange={(e) => setSelfLoveAnswer(e.target.value)}
                  placeholder="Write gently to yourself..."
                  rows="4"
                  style={textareaStyle}
                />

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSelfLoveSubmit}
                  disabled={!selfLoveAnswer.trim()}
                  style={{
                    ...submitButtonStyle,
                    background: !selfLoveAnswer.trim() ? theme.colors.neutral[300] : tabs[3].color
                  }}
                >
                  <Send size={16} />
                  Save Reflection
                </motion.button>
              </div>

              {/* Daily Affirmation */}
              <div style={{
                background: 'white',
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing.lg,
                border: `1px solid ${theme.colors.neutral[200]}`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', marginBottom: theme.spacing.sm }}>💫</div>
                <p style={{
                  fontSize: theme.typography.h4,
                  color: tabs[3].color,
                  fontStyle: 'italic',
                  marginBottom: theme.spacing.md
                }}>
                  "{affirmationLibrary[Math.floor(Math.random() * affirmationLibrary.length)]}"
                </p>
                <p style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                  Today's affirmation
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Gratitude Garden Tab */}
        {activeTab === 'gratitude' && (
          <motion.div
            key="gratitude"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <Sparkles size={24} color={tabs[4].color} />
                  <h3 style={sectionTitleStyle}>Gratitude Garden</h3>
                </div>
                <span style={badgeStyle}>
                  {gratitudeEntries.length} blessings
                </span>
              </div>

              <p style={sectionDescriptionStyle}>
                Plant seeds of gratitude and watch your joy grow.
              </p>

              {/* Add Gratitude */}
              <div style={{
                background: `${tabs[4].color}10`,
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing.xl,
                marginBottom: theme.spacing.xl
              }}>
                <h4 style={{
                  fontSize: theme.typography.h4,
                  color: tabs[4].color,
                  marginBottom: theme.spacing.md
                }}>
                  What are you grateful for today?
                </h4>

                <input
                  type="text"
                  placeholder="e.g., Warm sunshine, kind words, good coffee..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.target.value.trim()) {
                      handleGratitudeSubmit(e.target.value);
                      e.target.value = '';
                    }
                  }}
                  style={inputStyle}
                />

                <p style={{
                  fontSize: theme.typography.tiny,
                  color: theme.colors.text.muted,
                  marginTop: theme.spacing.sm
                }}>
                  Press Enter to add to your garden
                </p>
              </div>

              {/* Gratitude List */}
              {gratitudeEntries.length > 0 && (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                  gap: theme.spacing.sm
                }}>
                  {gratitudeEntries.map((entry) => (
                    <div key={entry.id} style={{
                      background: 'white',
                      borderRadius: theme.borderRadius.lg,
                      padding: theme.spacing.md,
                      border: `1px solid ${theme.colors.neutral[200]}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: theme.spacing.sm
                    }}>
                      <span style={{ fontSize: '24px' }}>🌱</span>
                      <div>
                        <div style={{ fontSize: theme.typography.small }}>{entry.entry}</div>
                        <div style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                          {formatDate(entry.date)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div style={sectionStyle}>
              <div style={sectionHeaderStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <Award size={24} color={tabs[5].color} />
                  <h3 style={sectionTitleStyle}>Milestones</h3>
                </div>
                <span style={badgeStyle}>
                  {achievements.filter(a => a.unlocked).length} unlocked
                </span>
              </div>

              <p style={sectionDescriptionStyle}>
                Celebrate your growth journey, one step at a time.
              </p>

              {/* Achievements Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: theme.spacing.md
              }}>
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    style={{
                      background: achievement.unlocked ? 'white' : theme.colors.neutral[50],
                      borderRadius: theme.borderRadius.xl,
                      padding: theme.spacing.lg,
                      border: `1px solid ${achievement.unlocked ? achievement.icon : theme.colors.neutral[200]}`,
                      opacity: achievement.unlocked ? 1 : 0.7,
                      position: 'relative'
                    }}
                  >
                    {!achievement.unlocked && (
                      <Lock size={16} style={{
                        position: 'absolute',
                        top: theme.spacing.md,
                        right: theme.spacing.md,
                        color: theme.colors.text.muted
                      }} />
                    )}

                    <div style={{ fontSize: '48px', marginBottom: theme.spacing.sm }}>
                      {achievement.icon}
                    </div>
                    
                    <h4 style={{
                      fontSize: theme.typography.h4,
                      marginBottom: 4,
                      color: achievement.unlocked ? theme.colors.text.primary : theme.colors.text.muted
                    }}>
                      {achievement.title}
                    </h4>
                    
                    <p style={{
                      fontSize: theme.typography.small,
                      color: theme.colors.text.secondary,
                      marginBottom: theme.spacing.md
                    }}>
                      {achievement.description}
                    </p>

                    {!achievement.unlocked && achievement.progress !== undefined && (
                      <div>
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          fontSize: theme.typography.tiny,
                          marginBottom: 4
                        }}>
                          <span>Progress</span>
                          <span>{achievement.progress}/{achievement.target}</span>
                        </div>
                        <div style={{
                          height: 4,
                          background: theme.colors.neutral[200],
                          borderRadius: theme.borderRadius.full,
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${(achievement.progress / achievement.target) * 100}%`,
                            height: '100%',
                            background: tabs[5].color
                          }} />
                        </div>
                      </div>
                    )}

                    {achievement.unlocked && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing.xs,
                        marginTop: theme.spacing.sm,
                        fontSize: theme.typography.tiny,
                        color: theme.colors.success.main
                      }}>
                        <Unlock size={12} />
                        <span>Unlocked on {formatDate(achievement.date)}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Overall Progress */}
              <div style={{
                marginTop: theme.spacing.xl,
                padding: theme.spacing.lg,
                background: theme.colors.neutral[50],
                borderRadius: theme.borderRadius.xl,
                textAlign: 'center'
              }}>
                <h4 style={{ fontSize: theme.typography.h4, marginBottom: theme.spacing.md }}>
                  Overall Growth
                </h4>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: theme.spacing.xl
                }}>
                  <div>
                    <div style={{ fontSize: '48px', fontWeight: 700, color: tabs[5].color }}>
                      {Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)}%
                    </div>
                    <div style={{ fontSize: theme.typography.small, color: theme.colors.text.muted }}>
                      Complete
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '48px', fontWeight: 700, color: tabs[5].color }}>
                      {points}
                    </div>
                    <div style={{ fontSize: theme.typography.small, color: theme.colors.text.muted }}>
                      Total Points
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Styles
const sectionStyle = {
  background: theme.colors.neutral[50],
  borderRadius: theme.borderRadius.xl,
  padding: theme.spacing.xl
};

const sectionHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing.md
};

const sectionTitleStyle = {
  fontSize: theme.typography.h3,
  margin: 0,
  color: theme.colors.text.primary
};

const sectionDescriptionStyle = {
  fontSize: theme.typography.small,
  color: theme.colors.text.secondary,
  marginBottom: theme.spacing.xl
};

const badgeStyle = {
  fontSize: theme.typography.tiny,
  color: theme.colors.text.muted,
  background: 'white',
  padding: '4px 12px',
  borderRadius: theme.borderRadius.full,
  border: `1px solid ${theme.colors.neutral[200]}`
};

const textareaStyle = {
  width: '100%',
  padding: theme.spacing.lg,
  borderRadius: theme.borderRadius.lg,
  border: `1px solid ${theme.colors.neutral[300]}`,
  fontSize: theme.typography.body,
  outline: 'none',
  transition: 'all 0.2s',
  resize: 'vertical',
  fontFamily: 'inherit',
  marginBottom: theme.spacing.lg,
  background: 'white'
};

const inputStyle = {
  width: '100%',
  padding: theme.spacing.lg,
  borderRadius: theme.borderRadius.lg,
  border: `1px solid ${theme.colors.neutral[300]}`,
  fontSize: theme.typography.body,
  outline: 'none',
  transition: 'all 0.2s',
  background: 'white'
};

const submitButtonStyle = {
  width: '100%',
  padding: theme.spacing.md,
  color: 'white',
  border: 'none',
  borderRadius: theme.borderRadius.lg,
  fontSize: theme.typography.body,
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing.sm
};

const historyCardStyle = {
  background: 'white',
  borderRadius: theme.borderRadius.lg,
  padding: theme.spacing.md,
  border: `1px solid ${theme.colors.neutral[200]}`
};

export default GrowthTracker;