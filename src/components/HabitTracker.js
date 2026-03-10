// components/HabitTracker.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { forestCabinTheme as theme } from "../styles/forestCabinTheme.js";
import * as wellnessApi from "../services/wellnessApi.js";

// Icons
import { 
  Plus,
  Check,
  X,
  TrendingUp,
  Calendar,
  Award,
  Flame,
  Target,
  Clock,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Heart,
  Brain,
  Book,
  Dumbbell,
  Coffee,
  Sun,
  Moon,
  Droplets,
  Smile,
  Zap,
  AlertCircle
} from 'lucide-react';

function HabitTracker({ userId = "user_1", userData }) {
  const [habits, setHabits] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newHabit, setNewHabit] = useState({ 
    name: "", 
    type: "build", 
    category: "wellness",
    targetDays: 21,
    frequency: "daily",
    reminder: false,
    reminderTime: "09:00",
    color: theme.colors.accent.sage,
    icon: "✨"
  });
  const [loading, setLoading] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [filter, setFilter] = useState("all");
  const [stats, setStats] = useState({
    totalHabits: 0,
    completedToday: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalCompletions: 0
  });

  // Habit categories with icons and colors
  const habitCategories = [
    { id: 'wellness', label: 'Wellness', icon: Heart, color: theme.colors.accent.peach },
    { id: 'mindfulness', label: 'Mindfulness', icon: Brain, color: theme.colors.accent.lavender },
    { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: theme.colors.accent.sage },
    { id: 'learning', label: 'Learning', icon: Book, color: theme.colors.accent.honey },
    { id: 'nutrition', label: 'Nutrition', icon: Coffee, color: theme.colors.accent.terracotta },
    { id: 'sleep', label: 'Sleep', icon: Moon, color: theme.colors.accent.purple },
    { id: 'hydration', label: 'Hydration', icon: Droplets, color: theme.colors.accent.teal },
    { id: 'mood', label: 'Mood', icon: Smile, color: theme.colors.accent.orange }
  ];

  // Habit types
  const habitTypes = [
    { id: 'build', label: 'Build (start doing)', icon: TrendingUp },
    { id: 'quit', label: 'Quit (stop doing)', icon: X }
  ];

  // Frequencies
  const frequencies = [
    { id: 'daily', label: 'Daily' },
    { id: 'weekdays', label: 'Weekdays' },
    { id: 'weekends', label: 'Weekends' },
    { id: 'weekly', label: 'Weekly' },
    { id: 'custom', label: 'Custom' }
  ];

  // Icons for habits
  const habitIcons = [
    { emoji: '✨', name: 'Sparkle' },
    { emoji: '💪', name: 'Strength' },
    { emoji: '🧘', name: 'Meditation' },
    { emoji: '📚', name: 'Reading' },
    { emoji: '🚶', name: 'Walking' },
    { emoji: '💧', name: 'Water' },
    { emoji: '😴', name: 'Sleep' },
    { emoji: '🥗', name: 'Healthy' },
    { emoji: '🎯', name: 'Goal' },
    { emoji: '🎨', name: 'Creative' },
    { emoji: '🎵', name: 'Music' },
    { emoji: '📝', name: 'Journal' }
  ];

  useEffect(() => {
    loadHabits();
  }, []);

  useEffect(() => {
    calculateStats();
  }, [habits, selectedDate]);

  const loadHabits = async () => {
    setLoading(true);
    try {
      // Mock data for demonstration
      const mockHabits = [
        {
          id: 1,
          name: "Morning Meditation",
          type: "build",
          category: "mindfulness",
          targetDays: 21,
          frequency: "daily",
          reminder: true,
          reminderTime: "07:00",
          color: theme.colors.accent.lavender,
          icon: "🧘",
          streak: 7,
          longestStreak: 12,
          totalCompletions: 45,
          lastCompleted: "2024-03-09",
          history: generateMockHistory(30, 0.7),
          createdAt: "2024-01-15"
        },
        {
          id: 2,
          name: "Drink 8 Glasses of Water",
          type: "build",
          category: "hydration",
          targetDays: 30,
          frequency: "daily",
          reminder: true,
          reminderTime: "10:00",
          color: theme.colors.accent.teal,
          icon: "💧",
          streak: 5,
          longestStreak: 14,
          totalCompletions: 62,
          lastCompleted: "2024-03-09",
          history: generateMockHistory(30, 0.8),
          createdAt: "2024-02-01"
        },
        {
          id: 3,
          name: "Evening Walk",
          type: "build",
          category: "fitness",
          targetDays: 21,
          frequency: "daily",
          reminder: true,
          reminderTime: "18:00",
          color: theme.colors.accent.sage,
          icon: "🚶",
          streak: 3,
          longestStreak: 8,
          totalCompletions: 23,
          lastCompleted: "2024-03-08",
          history: generateMockHistory(30, 0.6),
          createdAt: "2024-02-15"
        },
        {
          id: 4,
          name: "No Social Media After 9pm",
          type: "quit",
          category: "wellness",
          targetDays: 21,
          frequency: "daily",
          reminder: true,
          reminderTime: "20:45",
          color: theme.colors.accent.terracotta,
          icon: "📱",
          streak: 2,
          longestStreak: 5,
          totalCompletions: 12,
          lastCompleted: "2024-03-07",
          history: generateMockHistory(30, 0.4),
          createdAt: "2024-02-20"
        }
      ];
      
      setHabits(mockHabits);
    } catch (error) {
      console.error("Failed to load habits:", error);
    }
    setLoading(false);
  };

  // Helper to generate mock history data
  function generateMockHistory(days, successRate) {
    const history = [];
    const today = new Date();
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      // Random completion based on success rate, but make it look realistic
      const completed = Math.random() < successRate;
      history.push({ date: dateStr, completed });
    }
    return history;
  }

  const calculateStats = () => {
    const today = new Date().toISOString().split('T')[0];
    const completedToday = habits.filter(h => 
      h.history?.some(day => day.date === today && day.completed)
    ).length;

    const totalCompletions = habits.reduce((sum, h) => 
      sum + (h.totalCompletions || 0), 0
    );

    const longestStreak = Math.max(...habits.map(h => h.longestStreak || 0), 0);

    setStats({
      totalHabits: habits.length,
      completedToday,
      currentStreak: habits.reduce((sum, h) => sum + (h.streak || 0), 0),
      longestStreak,
      totalCompletions
    });
  };

  const addHabit = () => {
    if (!newHabit.name.trim()) return;

    const habit = {
      id: Date.now(),
      ...newHabit,
      streak: 0,
      longestStreak: 0,
      totalCompletions: 0,
      lastCompleted: null,
      history: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setHabits([habit, ...habits]);
    setNewHabit({ 
      name: "", 
      type: "build", 
      category: "wellness",
      targetDays: 21,
      frequency: "daily",
      reminder: false,
      reminderTime: "09:00",
      color: theme.colors.accent.sage,
      icon: "✨"
    });
    setShowAddForm(false);
  };

  const updateHabit = () => {
    if (!editingHabit) return;

    setHabits(habits.map(h => 
      h.id === editingHabit.id ? editingHabit : h
    ));
    setEditingHabit(null);
  };

  const deleteHabit = (habitId) => {
    if (window.confirm("Are you sure you want to delete this habit?")) {
      setHabits(habits.filter(h => h.id !== habitId));
    }
  };

  const toggleHabitCompletion = (habit) => {
    const today = new Date().toISOString().split('T')[0];
    const wasCompletedToday = habit.history?.some(day => day.date === today && day.completed);

    let updatedHabit = { ...habit };

    if (wasCompletedToday) {
      // Undo completion
      updatedHabit.streak = Math.max(0, (habit.streak || 0) - 1);
      updatedHabit.totalCompletions = (habit.totalCompletions || 0) - 1;
      updatedHabit.history = habit.history.filter(day => day.date !== today);
      
      // Find the most recent completion for lastCompleted
      const lastCompletion = [...updatedHabit.history]
        .filter(day => day.completed)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
      updatedHabit.lastCompleted = lastCompletion?.date || null;
    } else {
      // Mark as completed
      const newStreak = (habit.streak || 0) + 1;
      updatedHabit.streak = newStreak;
      updatedHabit.longestStreak = Math.max(newStreak, habit.longestStreak || 0);
      updatedHabit.totalCompletions = (habit.totalCompletions || 0) + 1;
      updatedHabit.lastCompleted = today;
      
      // Add to history
      const newHistory = [...(habit.history || []), { date: today, completed: true }];
      updatedHabit.history = newHistory;
    }

    setHabits(habits.map(h => h.id === habit.id ? updatedHabit : h));
  };

  const getFilteredHabits = () => {
    let filtered = habits;
    
    if (filter !== "all") {
      filtered = habits.filter(h => h.category === filter);
    }
    
    return filtered;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const isCompletedToday = (habit) => {
    const today = new Date().toISOString().split('T')[0];
    return habit.history?.some(day => day.date === today && day.completed);
  };

  const getProgressColor = (streak, target) => {
    const percentage = (streak / target) * 100;
    if (percentage >= 100) return theme.colors.success.main;
    if (percentage >= 70) return theme.colors.accent.sage;
    if (percentage >= 40) return theme.colors.accent.honey;
    return theme.colors.accent.peach;
  };

  const getMotivationalMessage = (streak) => {
    if (streak === 0) return "Start your journey today! 🌱";
    if (streak === 1) return "First step completed! Keep going! 🌟";
    if (streak < 7) return `Day ${streak} - You're building momentum! 💪`;
    if (streak < 21) return `Day ${streak} - This is becoming a habit! ✨`;
    if (streak < 30) return `Day ${streak} - You're on fire! 🔥`;
    return `Day ${streak} - Unstoppable! 🏆`;
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
            <Target size={28} /> Habit Tracker
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

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          style={{
            padding: `${theme.spacing.md} ${theme.spacing.xl}`,
            background: `linear-gradient(135deg, ${theme.colors.accent.peach}, ${theme.colors.accent.terracotta})`,
            border: 'none',
            borderRadius: theme.borderRadius.full,
            color: 'white',
            fontSize: theme.typography.body,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.sm,
            boxShadow: theme.shadows.md
          }}
        >
          <Plus size={20} />
          New Habit
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl
      }}>
        <div style={statCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: theme.borderRadius.full,
              background: `${theme.colors.accent.lavender}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target size={20} color={theme.colors.accent.lavender} />
            </div>
            <div>
              <div style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                Total Habits
              </div>
              <div style={{ fontSize: theme.typography.h3, fontWeight: 600 }}>
                {stats.totalHabits}
              </div>
            </div>
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: theme.borderRadius.full,
              background: `${theme.colors.accent.sage}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Check size={20} color={theme.colors.accent.sage} />
            </div>
            <div>
              <div style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                Completed Today
              </div>
              <div style={{ fontSize: theme.typography.h3, fontWeight: 600 }}>
                {stats.completedToday}/{stats.totalHabits}
              </div>
            </div>
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: theme.borderRadius.full,
              background: `${theme.colors.accent.honey}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Flame size={20} color={theme.colors.accent.honey} />
            </div>
            <div>
              <div style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                Current Streak
              </div>
              <div style={{ fontSize: theme.typography.h3, fontWeight: 600 }}>
                {stats.currentStreak} days
              </div>
            </div>
          </div>
        </div>

        <div style={statCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: theme.borderRadius.full,
              background: `${theme.colors.accent.purple}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={20} color={theme.colors.accent.purple} />
            </div>
            <div>
              <div style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                Best Streak
              </div>
              <div style={{ fontSize: theme.typography.h3, fontWeight: 600 }}>
                {stats.longestStreak} days
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and View Toggle */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        flexWrap: 'wrap',
        gap: theme.spacing.md
      }}>
        <div style={{ display: 'flex', gap: theme.spacing.xs, flexWrap: 'wrap' }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: `${theme.spacing.xs} ${theme.spacing.md}`,
              background: filter === "all" ? theme.colors.primary.main : 'transparent',
              border: `1px solid ${filter === "all" ? 'transparent' : theme.colors.neutral[300]}`,
              borderRadius: theme.borderRadius.full,
              color: filter === "all" ? 'white' : theme.colors.text.secondary,
              fontSize: theme.typography.small,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            All Habits
          </button>
          {habitCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              style={{
                padding: `${theme.spacing.xs} ${theme.spacing.md}`,
                background: filter === cat.id ? cat.color : 'transparent',
                border: `1px solid ${filter === cat.id ? 'transparent' : theme.colors.neutral[300]}`,
                borderRadius: theme.borderRadius.full,
                color: filter === cat.id ? 'white' : theme.colors.text.secondary,
                fontSize: theme.typography.small,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: theme.spacing.xs }}>
          <button
            onClick={() => setViewMode("grid")}
            style={{
              padding: theme.spacing.sm,
              background: viewMode === "grid" ? theme.colors.neutral[200] : 'transparent',
              border: 'none',
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect x="2" y="2" width="6" height="6" rx="1" />
              <rect x="12" y="2" width="6" height="6" rx="1" />
              <rect x="2" y="12" width="6" height="6" rx="1" />
              <rect x="12" y="12" width="6" height="6" rx="1" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("list")}
            style={{
              padding: theme.spacing.sm,
              background: viewMode === "list" ? theme.colors.neutral[200] : 'transparent',
              border: 'none',
              borderRadius: theme.borderRadius.md,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <rect x="2" y="2" width="16" height="3" rx="1" />
              <rect x="2" y="8" width="16" height="3" rx="1" />
              <rect x="2" y="14" width="16" height="3" rx="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Add Habit Form Modal */}
      <AnimatePresence>
        {showAddForm && (
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
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000
            }}
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing.xl,
                maxWidth: '500px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
            >
              <h3 style={{ 
                fontSize: theme.typography.h3, 
                marginBottom: theme.spacing.lg,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm
              }}>
                <Plus size={24} />
                Create New Habit
              </h3>

              {/* Habit Name */}
              <div style={{ marginBottom: theme.spacing.lg }}>
                <label style={modalLabelStyle}>
                  Habit Name
                </label>
                <input
                  type="text"
                  value={newHabit.name}
                  onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                  placeholder="e.g., Morning Meditation, Drink Water..."
                  style={modalInputStyle}
                  autoFocus
                />
              </div>

              {/* Icon Selection */}
              <div style={{ marginBottom: theme.spacing.lg }}>
                <label style={modalLabelStyle}>Choose Icon</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: theme.spacing.xs
                }}>
                  {habitIcons.map(icon => (
                    <button
                      key={icon.emoji}
                      onClick={() => setNewHabit({ ...newHabit, icon: icon.emoji })}
                      style={{
                        padding: theme.spacing.sm,
                        background: newHabit.icon === icon.emoji ? `${theme.colors.accent.lavender}20` : 'white',
                        border: `2px solid ${newHabit.icon === icon.emoji ? theme.colors.accent.lavender : theme.colors.neutral[200]}`,
                        borderRadius: theme.borderRadius.lg,
                        fontSize: '24px',
                        cursor: 'pointer',
                        aspectRatio: '1'
                      }}
                    >
                      {icon.emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Habit Type */}
              <div style={{ marginBottom: theme.spacing.lg }}>
                <label style={modalLabelStyle}>Habit Type</label>
                <div style={{ display: 'flex', gap: theme.spacing.md }}>
                  {habitTypes.map(type => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setNewHabit({ ...newHabit, type: type.id })}
                        style={{
                          flex: 1,
                          padding: theme.spacing.md,
                          background: newHabit.type === type.id ? `${theme.colors.accent.sage}20` : 'white',
                          border: `2px solid ${newHabit.type === type.id ? theme.colors.accent.sage : theme.colors.neutral[200]}`,
                          borderRadius: theme.borderRadius.lg,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: theme.spacing.sm
                        }}
                      >
                        <Icon size={18} />
                        {type.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Category */}
              <div style={{ marginBottom: theme.spacing.lg }}>
                <label style={modalLabelStyle}>Category</label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: theme.spacing.sm
                }}>
                  {habitCategories.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setNewHabit({ ...newHabit, category: cat.id, color: cat.color })}
                        style={{
                          padding: theme.spacing.sm,
                          background: newHabit.category === cat.id ? `${cat.color}20` : 'white',
                          border: `2px solid ${newHabit.category === cat.id ? cat.color : theme.colors.neutral[200]}`,
                          borderRadius: theme.borderRadius.lg,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: theme.spacing.sm
                        }}
                      >
                        <Icon size={16} color={cat.color} />
                        <span style={{ fontSize: theme.typography.small }}>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Frequency */}
              <div style={{ marginBottom: theme.spacing.lg }}>
                <label style={modalLabelStyle}>Frequency</label>
                <select
                  value={newHabit.frequency}
                  onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                  style={modalInputStyle}
                >
                  {frequencies.map(f => (
                    <option key={f.id} value={f.id}>{f.label}</option>
                  ))}
                </select>
              </div>

              {/* Target Days */}
              <div style={{ marginBottom: theme.spacing.lg }}>
                <label style={modalLabelStyle}>Target Days to Form Habit</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={newHabit.targetDays}
                  onChange={(e) => setNewHabit({ ...newHabit, targetDays: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
                <div style={{ textAlign: 'center', marginTop: theme.spacing.xs }}>
                  {newHabit.targetDays} days
                </div>
              </div>

              {/* Reminder */}
              <div style={{ marginBottom: theme.spacing.xl }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm,
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    checked={newHabit.reminder}
                    onChange={(e) => setNewHabit({ ...newHabit, reminder: e.target.checked })}
                  />
                  <span style={{ fontSize: theme.typography.body }}>Set daily reminder</span>
                </label>

                {newHabit.reminder && (
                  <div style={{ marginTop: theme.spacing.sm }}>
                    <input
                      type="time"
                      value={newHabit.reminderTime}
                      onChange={(e) => setNewHabit({ ...newHabit, reminderTime: e.target.value })}
                      style={modalInputStyle}
                    />
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: theme.spacing.md }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addHabit}
                  disabled={!newHabit.name.trim()}
                  style={{
                    flex: 2,
                    padding: theme.spacing.md,
                    background: !newHabit.name.trim() ? theme.colors.neutral[300] : theme.colors.success.main,
                    color: 'white',
                    border: 'none',
                    borderRadius: theme.borderRadius.lg,
                    fontSize: theme.typography.body,
                    fontWeight: 600,
                    cursor: !newHabit.name.trim() ? 'not-allowed' : 'pointer'
                  }}
                >
                  Create Habit
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddForm(false)}
                  style={{
                    flex: 1,
                    padding: theme.spacing.md,
                    background: theme.colors.neutral[200],
                    color: theme.colors.text.secondary,
                    border: 'none',
                    borderRadius: theme.borderRadius.lg,
                    fontSize: theme.typography.body,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habits Grid/List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: theme.spacing.xl }}>
          <div className="spinner" style={{ margin: '0 auto' }} />
        </div>
      ) : getFilteredHabits().length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            textAlign: 'center',
            padding: theme.spacing.xl,
            background: theme.colors.neutral[50],
            borderRadius: theme.borderRadius.xl,
            border: `2px dashed ${theme.colors.neutral[300]}`
          }}
        >
          <Target size={48} color={theme.colors.text.muted} />
          <h3 style={{ fontSize: theme.typography.h4, marginTop: theme.spacing.md }}>
            No habits yet
          </h3>
          <p style={{ color: theme.colors.text.secondary, marginBottom: theme.spacing.lg }}>
            Start by adding your first habit!
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            style={{
              padding: `${theme.spacing.md} ${theme.spacing.xl}`,
              background: `linear-gradient(135deg, ${theme.colors.accent.peach}, ${theme.colors.accent.terracotta})`,
              border: 'none',
              borderRadius: theme.borderRadius.full,
              color: 'white',
              fontSize: theme.typography.body,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: theme.spacing.sm
            }}
          >
            <Plus size={20} />
            Add Your First Habit
          </motion.button>
        </motion.div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: viewMode === 'grid' 
            ? 'repeat(auto-fill, minmax(300px, 1fr))' 
            : '1fr',
          gap: theme.spacing.md
        }}>
          {getFilteredHabits().map((habit, index) => {
            const completedToday = isCompletedToday(habit);
            const progressColor = getProgressColor(habit.streak || 0, habit.targetDays);
            
            return viewMode === 'grid' ? (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  background: 'white',
                  borderRadius: theme.borderRadius.xl,
                  padding: theme.spacing.lg,
                  boxShadow: theme.shadows.md,
                  border: `1px solid ${theme.colors.neutral[200]}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Progress bar at top */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: theme.colors.neutral[200]
                }}>
                  <div style={{
                    width: `${Math.min(100, (habit.streak / habit.targetDays) * 100)}%`,
                    height: '100%',
                    background: progressColor,
                    transition: 'width 0.3s'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: theme.spacing.md }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: theme.borderRadius.full,
                      background: `${habit.color}20`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      {habit.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: theme.typography.h4, margin: 0 }}>{habit.name}</h4>
                      <span style={{
                        fontSize: theme.typography.tiny,
                        color: theme.colors.text.muted,
                        background: theme.colors.neutral[100],
                        padding: '2px 8px',
                        borderRadius: theme.borderRadius.full,
                        display: 'inline-block',
                        marginTop: 4
                      }}>
                        {habit.category}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: theme.spacing.xs }}>
                    <button
                      onClick={() => setEditingHabit(habit)}
                      style={iconButtonStyle}
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteHabit(habit.id)}
                      style={iconButtonStyle}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: theme.spacing.md,
                  marginBottom: theme.spacing.md
                }}>
                  <div>
                    <div style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                      Current Streak
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Flame size={16} color={theme.colors.accent.honey} />
                      <span style={{ fontSize: theme.typography.h3, fontWeight: 600 }}>
                        {habit.streak || 0}
                      </span>
                      <span style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                        days
                      </span>
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                      Best Streak
                    </div>
                    <div style={{ fontSize: theme.typography.h3, fontWeight: 600 }}>
                      {habit.longestStreak || 0}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: theme.spacing.md }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                      Progress to {habit.targetDays} days
                    </span>
                    <span style={{ fontSize: theme.typography.tiny, fontWeight: 600 }}>
                      {Math.min(100, Math.round((habit.streak / habit.targetDays) * 100))}%
                    </span>
                  </div>
                  <div style={{
                    height: 8,
                    background: theme.colors.neutral[200],
                    borderRadius: theme.borderRadius.full,
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(100, (habit.streak / habit.targetDays) * 100)}%`,
                      height: '100%',
                      background: progressColor,
                      transition: 'width 0.3s'
                    }} />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: theme.spacing.md
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing.xs,
                    fontSize: theme.typography.tiny,
                    color: theme.colors.text.secondary
                  }}>
                    <Clock size={14} />
                    {habit.reminder ? habit.reminderTime : 'No reminder'}
                  </div>
                  <div style={{
                    fontSize: theme.typography.tiny,
                    color: theme.colors.text.muted,
                    background: theme.colors.neutral[100],
                    padding: '2px 8px',
                    borderRadius: theme.borderRadius.full
                  }}>
                    {habit.frequency}
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleHabitCompletion(habit)}
                  style={{
                    width: '100%',
                    padding: theme.spacing.md,
                    background: completedToday 
                      ? `${theme.colors.success.light}`
                      : `linear-gradient(135deg, ${habit.color}, ${habit.color}dd)`,
                    border: 'none',
                    borderRadius: theme.borderRadius.lg,
                    color: completedToday ? theme.colors.success.dark : 'white',
                    fontSize: theme.typography.body,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: theme.spacing.sm
                  }}
                >
                  {completedToday ? (
                    <>
                      <Check size={20} />
                      Completed Today
                    </>
                  ) : (
                    <>
                      <Check size={20} />
                      Mark as Done
                    </>
                  )}
                </motion.button>

                <div style={{
                  marginTop: theme.spacing.sm,
                  fontSize: theme.typography.tiny,
                  color: theme.colors.text.muted,
                  textAlign: 'center',
                  fontStyle: 'italic'
                }}>
                  {getMotivationalMessage(habit.streak || 0)}
                </div>
              </motion.div>
            ) : (
              // List view item
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                style={{
                  background: 'white',
                  borderRadius: theme.borderRadius.lg,
                  padding: theme.spacing.md,
                  boxShadow: theme.shadows.sm,
                  border: `1px solid ${theme.colors.neutral[200]}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.md
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: theme.borderRadius.full,
                  background: `${habit.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  {habit.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                    <h4 style={{ fontSize: theme.typography.h4, margin: 0 }}>{habit.name}</h4>
                    <span style={{
                      fontSize: theme.typography.tiny,
                      color: 'white',
                      background: habit.color,
                      padding: '2px 8px',
                      borderRadius: theme.borderRadius.full
                    }}>
                      {habit.category}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginTop: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Flame size={14} color={theme.colors.accent.honey} />
                      <span style={{ fontSize: theme.typography.small, fontWeight: 600 }}>
                        {habit.streak || 0} day streak
                      </span>
                    </div>
                    <div style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                      Best: {habit.longestStreak || 0}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <button
                    onClick={() => toggleHabitCompletion(habit)}
                    style={{
                      padding: theme.spacing.sm,
                      background: completedToday ? theme.colors.success.main : 'transparent',
                      border: `2px solid ${completedToday ? 'transparent' : theme.colors.neutral[300]}`,
                      borderRadius: theme.borderRadius.full,
                      cursor: 'pointer',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {completedToday ? (
                      <Check size={20} color="white" />
                    ) : (
                      <Check size={20} color={theme.colors.text.muted} />
                    )}
                  </button>

                  <button
                    onClick={() => setEditingHabit(habit)}
                    style={iconButtonStyle}
                  >
                    <Edit2 size={16} />
                  </button>
                  
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    style={iconButtonStyle}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit Habit Modal */}
      <AnimatePresence>
        {editingHabit && (
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
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000
            }}
            onClick={() => setEditingHabit(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'white',
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing.xl,
                maxWidth: '500px',
                width: '90%'
              }}
            >
              <h3 style={{ fontSize: theme.typography.h3, marginBottom: theme.spacing.lg }}>
                Edit Habit
              </h3>
              
              <div style={{ marginBottom: theme.spacing.lg }}>
                <label style={modalLabelStyle}>Habit Name</label>
                <input
                  type="text"
                  value={editingHabit.name}
                  onChange={(e) => setEditingHabit({ ...editingHabit, name: e.target.value })}
                  style={modalInputStyle}
                />
              </div>

              <div style={{ marginBottom: theme.spacing.lg }}>
                <label style={modalLabelStyle}>Target Days</label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={editingHabit.targetDays}
                  onChange={(e) => setEditingHabit({ ...editingHabit, targetDays: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
                <div style={{ textAlign: 'center', marginTop: theme.spacing.xs }}>
                  {editingHabit.targetDays} days
                </div>
              </div>

              <div style={{ marginBottom: theme.spacing.lg }}>
                <label style={modalLabelStyle}>Reminder</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                  <input
                    type="checkbox"
                    checked={editingHabit.reminder}
                    onChange={(e) => setEditingHabit({ ...editingHabit, reminder: e.target.checked })}
                  />
                  <span>Set daily reminder</span>
                </div>
                {editingHabit.reminder && (
                  <input
                    type="time"
                    value={editingHabit.reminderTime}
                    onChange={(e) => setEditingHabit({ ...editingHabit, reminderTime: e.target.value })}
                    style={{ ...modalInputStyle, marginTop: theme.spacing.sm }}
                  />
                )}
              </div>

              <div style={{ display: 'flex', gap: theme.spacing.md }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={updateHabit}
                  style={{
                    flex: 2,
                    padding: theme.spacing.md,
                    background: theme.colors.success.main,
                    color: 'white',
                    border: 'none',
                    borderRadius: theme.borderRadius.lg,
                    fontSize: theme.typography.body,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Save Changes
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setEditingHabit(null)}
                  style={{
                    flex: 1,
                    padding: theme.spacing.md,
                    background: theme.colors.neutral[200],
                    color: theme.colors.text.secondary,
                    border: 'none',
                    borderRadius: theme.borderRadius.lg,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Weekly Progress Summary */}
      <div style={{
        marginTop: theme.spacing.xl,
        padding: theme.spacing.lg,
        background: theme.colors.neutral[50],
        borderRadius: theme.borderRadius.xl,
        border: `1px solid ${theme.colors.neutral[200]}`
      }}>
        <h4 style={{ 
          fontSize: theme.typography.h4, 
          marginBottom: theme.spacing.md,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.sm
        }}>
          <Sparkles size={20} />
          Weekly Progress
        </h4>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: theme.spacing.sm,
          textAlign: 'center'
        }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
            const date = new Date();
            date.setDate(date.getDate() - date.getDay() + i + 1);
            const dateStr = date.toISOString().split('T')[0];
            
            const completedCount = habits.filter(h => 
              h.history?.some(d => d.date === dateStr && d.completed)
            ).length;
            
            const percentage = habits.length > 0 ? (completedCount / habits.length) * 100 : 0;

            return (
              <div key={day}>
                <div style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                  {day}
                </div>
                <div style={{
                  width: '100%',
                  height: 60,
                  background: theme.colors.neutral[200],
                  borderRadius: theme.borderRadius.lg,
                  marginTop: 4,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: `${percentage}%`,
                    background: `linear-gradient(to top, ${theme.colors.accent.sage}, ${theme.colors.accent.teal})`,
                    transition: 'height 0.3s'
                  }} />
                </div>
                <div style={{ fontSize: theme.typography.tiny, marginTop: 4 }}>
                  {completedCount}/{habits.length}
                </div>
              </div>
            );
          })}
        </div>

        {/* Motivational Quote */}
        <div style={{
          marginTop: theme.spacing.lg,
          padding: theme.spacing.md,
          background: 'white',
          borderRadius: theme.borderRadius.lg,
          textAlign: 'center',
          fontStyle: 'italic',
          color: theme.colors.text.secondary
        }}>
          "Small daily improvements are the key to staggering long-term results."
        </div>
      </div>
    </motion.div>
  );
}

// Styles
const statCardStyle = {
  background: 'white',
  borderRadius: theme.borderRadius.lg,
  padding: theme.spacing.lg,
  boxShadow: theme.shadows.sm,
  border: `1px solid ${theme.colors.neutral[200]}`
};

const iconButtonStyle = {
  padding: theme.spacing.xs,
  background: theme.colors.neutral[100],
  border: 'none',
  borderRadius: theme.borderRadius.md,
  cursor: 'pointer',
  color: theme.colors.text.secondary,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32
};

const modalLabelStyle = {
  display: 'block',
  fontSize: theme.typography.small,
  color: theme.colors.text.secondary,
  marginBottom: theme.spacing.xs
};

const modalInputStyle = {
  width: '100%',
  padding: theme.spacing.md,
  borderRadius: theme.borderRadius.lg,
  border: `1px solid ${theme.colors.neutral[300]}`,
  fontSize: theme.typography.body,
  outline: 'none',
  transition: 'all 0.2s'
};

export default HabitTracker;