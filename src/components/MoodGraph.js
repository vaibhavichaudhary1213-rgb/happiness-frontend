// components/MoodGraph.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { forestCabinTheme as theme } from "../styles/forestCabinTheme.js";
import * as wellnessApi from "../services/wellnessApi.js";

// Icons
import { 
  Smile, 
  Frown, 
  Meh, 
  Angry, 
  Heart, 
  Zap, 
  Moon, 
  Sun,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  Award,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Download,
  Share2,
  Filter,
  Edit3,
  Plus,
  X,
  Brain,
  Coffee,
  Music,
  Book
} from 'lucide-react';

function MoodGraph({ userId = "user_1", userData }) {
  const [weeklyData, setWeeklyData] = useState([]);
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState("week");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddMood, setShowAddMood] = useState(false);
  const [newMood, setNewMood] = useState({
    emotion: "",
    intensity: 5,
    note: "",
    activities: [],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  });
  const [moodHistory, setMoodHistory] = useState([]);
  const [insights, setInsights] = useState([]);
  const [correlations, setCorrelations] = useState([]);

  // Mood options
  const moodOptions = [
    { id: 'happy', label: 'Happy', icon: Smile, color: theme.colors.accent.honey, emoji: '😊', description: 'Feeling joyful and content' },
    { id: 'excited', label: 'Excited', icon: Zap, color: theme.colors.accent.orange, emoji: '🎉', description: 'Energetic and enthusiastic' },
    { id: 'calm', label: 'Calm', icon: Coffee, color: theme.colors.accent.sage, emoji: '😌', description: 'Peaceful and relaxed' },
    { id: 'grateful', label: 'Grateful', icon: Heart, color: theme.colors.accent.peach, emoji: '🙏', description: 'Appreciative and thankful' },
    { id: 'sad', label: 'Sad', icon: Frown, color: theme.colors.accent.lavender, emoji: '😔', description: 'Feeling down or low' },
    { id: 'anxious', label: 'Anxious', icon: Brain, color: theme.colors.accent.purple, emoji: '😰', description: 'Worried or nervous' },
    { id: 'tired', label: 'Tired', icon: Moon, color: theme.colors.neutral[500], emoji: '😴', description: 'Low energy, needing rest' },
    { id: 'angry', label: 'Angry', icon: Angry, color: theme.colors.error.main, emoji: '😤', description: 'Frustrated or irritated' }
  ];

  const activityOptions = [
    { id: 'exercise', label: 'Exercise', icon: Zap },
    { id: 'meditation', label: 'Meditation', icon: Brain },
    { id: 'social', label: 'Social Time', icon: Heart },
    { id: 'work', label: 'Work', icon: Activity },
    { id: 'sleep', label: 'Good Sleep', icon: Moon },
    { id: 'nature', label: 'Time in Nature', icon: Sun },
    { id: 'music', label: 'Music', icon: Music },
    { id: 'reading', label: 'Reading', icon: Book }
  ];

  useEffect(() => {
    fetchMoodData();
  }, [selectedDate, viewMode]);

  const fetchMoodData = async () => {
    setLoading(true);
    try {
      const mockWeeklyData = generateMockWeeklyData();
      const mockTrends = generateMockTrends();
      const mockHistory = generateMockHistory();
      const mockInsights = generateMockInsights();
      const mockCorrelations = generateMockCorrelations();

      setWeeklyData(mockWeeklyData);
      setTrends(mockTrends);
      setMoodHistory(mockHistory);
      setInsights(mockInsights);
      setCorrelations(mockCorrelations);
    } catch (error) {
      console.error("Failed to fetch mood data:", error);
    }
    setLoading(false);
  };

  const generateMockWeeklyData = () => {
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    const moods = ['happy','calm','grateful','excited','sad','anxious','tired'];

    return days.map((day,index)=>{
      const mood = moods[Math.floor(Math.random()*moods.length)];
      const intensity = Math.floor(Math.random()*5)+5;

      return {
        day,
        date: new Date(Date.now()-(6-index)*86400000).toLocaleDateString(),
        mood,
        intensity,
        happiness_score: intensity*10,
        color: moodOptions.find(m=>m.id===mood)?.color || theme.colors.primary.main,
        emoji: moodOptions.find(m=>m.id===mood)?.emoji || "😐",
        note: index===2 ? "Had a great day at work!" : index===4 ? "Feeling a bit tired" : ""
      };
    });
  };

  const generateMockTrends = () => {
    const moods=['happy','calm','grateful','excited','sad','anxious'];
    const mostCommon=moods[Math.floor(Math.random()*moods.length)];
    const trend=Math.random()>0.5?'improving':Math.random()>0.5?'declining':'stable';

    return {
      most_common_mood:mostCommon,
      trend,
      average_intensity:6.5,
      best_day:'Wednesday',
      challenging_day:'Monday',
      weekly_average:72,
      monthly_average:68,
      insights:[
        "Your mood tends to be highest on Wednesdays",
        "You feel most calm after meditation sessions",
        "Sleep quality strongly affects your morning mood"
      ]
    };
  };

  const generateMockHistory = () => {
    const history=[];

    for(let i=30;i>=0;i--){
      const date=new Date();
      date.setDate(date.getDate()-i);

      const mood=moodOptions[Math.floor(Math.random()*moodOptions.length)];

      history.push({
        id:Date.now()-i,
        date:date.toISOString().split('T')[0],
        emotion:mood.id,
        intensity:Math.floor(Math.random()*5)+5,
        note:i%5===0?"Notable day":"",
        activities:[activityOptions[Math.floor(Math.random()*activityOptions.length)].id],
        timeOfDay:['morning','afternoon','evening'][Math.floor(Math.random()*3)]
      });
    }

    return history;
  };

  const generateMockInsights = () => ([
    { id:1, title:"Your happiest time", value:"Tuesday afternoons", icon:Sun },
    { id:2, title:"Mood booster", value:"Exercise improves mood by 40%", icon:Zap },
    { id:3, title:"Sleep impact", value:"8+ hours = 30% better mood", icon:Moon },
    { id:4, title:"Weekly pattern", value:"Weekends are most positive", icon:Calendar }
  ]);

  const generateMockCorrelations = () => ([
    { activity:'exercise', correlation:0.8, impact:'Strong positive' },
    { activity:'meditation', correlation:0.7, impact:'Positive' },
    { activity:'sleep', correlation:0.9, impact:'Very strong positive' },
    { activity:'social', correlation:0.6, impact:'Moderate positive' },
    { activity:'work', correlation:-0.3, impact:'Slight negative' }
  ]);

  const handleAddMood = () => {
    if(!newMood.emotion) return;

    const moodEntry={
      id:Date.now(),
      date:selectedDate.toISOString().split('T')[0],
      ...newMood,
      timestamp:new Date().toISOString()
    };

    setMoodHistory([moodEntry,...moodHistory]);

    setShowAddMood(false);

    setNewMood({
      emotion:"",
      intensity:5,
      note:"",
      activities:[],
      time:new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})
    });
  };

  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay() + 1);
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    return days;
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + (direction * 7));
    setSelectedDate(newDate);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{
        background: theme.colors.background.paper,
        borderRadius: theme.borderRadius['2xl'],
        padding: theme.spacing.xl,
        boxShadow: theme.shadows.warm,
        border: `1px solid ${theme.colors.neutral[200]}`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <div className="spinner" style={{
          width: 48,
          height: 48,
          border: `3px solid ${theme.colors.accent.peach}`,
          borderTopColor: theme.colors.accent.terracotta
        }} />
      </div>
    );
  }

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
      {/* Header */}
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
            <Activity size={28} /> Mood Tracker
          </h2>
          <p style={{
            fontSize: theme.typography.small,
            color: theme.colors.text.secondary
          }}>
            Understand your emotional patterns
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddMood(true)}
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
            gap: theme.spacing.sm
          }}
        >
          <Plus size={20} />
          Log Mood
        </motion.button>
      </div>

      {/* Quick Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl
      }}>
        <div style={{
          background: theme.colors.neutral[50],
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          border: `1px solid ${theme.colors.neutral[200]}`
        }}>
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
              <Smile size={20} color={theme.colors.accent.sage} />
            </div>
            <div>
              <div style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                Average Mood
              </div>
              <div style={{ fontSize: theme.typography.h3, fontWeight: 600 }}>
                {trends?.weekly_average || 72}%
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: theme.colors.neutral[50],
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          border: `1px solid ${theme.colors.neutral[200]}`
        }}>
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
              <Calendar size={20} color={theme.colors.accent.honey} />
            </div>
            <div>
              <div style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                Best Day
              </div>
              <div style={{ fontSize: theme.typography.h3, fontWeight: 600 }}>
                {trends?.best_day || 'Wednesday'}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: theme.colors.neutral[50],
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          border: `1px solid ${theme.colors.neutral[200]}`
        }}>
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
              {trends?.trend === 'improving' ? <TrendingUp size={20} color={theme.colors.accent.sage} /> :
               trends?.trend === 'declining' ? <TrendingDown size={20} color={theme.colors.error.main} /> :
               <Activity size={20} color={theme.colors.accent.lavender} />}
            </div>
            <div>
              <div style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                Trend
              </div>
              <div style={{ fontSize: theme.typography.h3, fontWeight: 600, textTransform: 'capitalize' }}>
                {trends?.trend || 'Stable'}
              </div>
            </div>
          </div>
        </div>

        <div style={{
          background: theme.colors.neutral[50],
          borderRadius: theme.borderRadius.lg,
          padding: theme.spacing.lg,
          border: `1px solid ${theme.colors.neutral[200]}`
        }}>
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
                Entries
              </div>
              <div style={{ fontSize: theme.typography.h3, fontWeight: 600 }}>
                {moodHistory.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* View Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg
      }}>
        <div style={{ display: 'flex', gap: theme.spacing.sm }}>
          {['week', 'month', 'year'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: `${theme.spacing.xs} ${theme.spacing.lg}`,
                background: viewMode === mode ? theme.colors.primary.main : 'transparent',
                border: `1px solid ${viewMode === mode ? 'transparent' : theme.colors.neutral[300]}`,
                borderRadius: theme.borderRadius.full,
                color: viewMode === mode ? 'white' : theme.colors.text.secondary,
                fontSize: theme.typography.small,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {mode}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
          <button onClick={() => navigateWeek(-1)} style={{
            padding: theme.spacing.sm,
            background: theme.colors.neutral[100],
            border: 'none',
            borderRadius: theme.borderRadius.full,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.text.secondary
          }}>
            <ChevronLeft size={20} />
          </button>
          <span style={{ fontSize: theme.typography.body, fontWeight: 500 }}>
            {formatDate(getWeekDays()[0])} - {formatDate(getWeekDays()[6])}
          </span>
          <button onClick={() => navigateWeek(1)} style={{
            padding: theme.spacing.sm,
            background: theme.colors.neutral[100],
            border: 'none',
            borderRadius: theme.borderRadius.full,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.text.secondary
          }}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Weekly Mood Graph */}
      <div style={{
        background: theme.colors.neutral[50],
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xl,
        marginBottom: theme.spacing.xl
      }}>
        <h3 style={{ fontSize: theme.typography.h4, marginBottom: theme.spacing.lg }}>
          This Week's Mood
        </h3>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          height: '200px',
          gap: theme.spacing.sm
        }}>
          {weeklyData.map((day, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${day.happiness_score}px` }}
              transition={{ delay: index * 0.1 }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: theme.spacing.sm,
                cursor: 'pointer'
              }}
              onClick={() => setSelectedDay(day)}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  width: '100%',
                  height: `${day.happiness_score}px`,
                  background: day.color,
                  borderRadius: theme.borderRadius.lg,
                  position: 'relative',
                  opacity: 0.8,
                  boxShadow: theme.shadows.sm
                }}
              >
                {day.note && (
                  <div style={{
                    position: 'absolute',
                    top: -20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    fontSize: '16px'
                  }}>
                    📝
                  </div>
                )}
              </motion.div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: theme.typography.tiny, fontWeight: 600 }}>
                  {day.day}
                </div>
                <div style={{ fontSize: '20px' }}>
                  {day.emoji}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Selected Day Details */}
        <AnimatePresence>
          {selectedDay && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                marginTop: theme.spacing.lg,
                padding: theme.spacing.lg,
                background: 'white',
                borderRadius: theme.borderRadius.lg,
                border: `1px solid ${theme.colors.neutral[200]}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                    {selectedDay.date}
                  </span>
                  <h4 style={{ fontSize: theme.typography.h4, marginTop: 4 }}>
                    You were feeling {selectedDay.mood}
                  </h4>
                  {selectedDay.note && (
                    <p style={{ color: theme.colors.text.secondary, marginTop: theme.spacing.sm }}>
                      "{selectedDay.note}"
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedDay(null)}
                  style={{
                    padding: theme.spacing.xs,
                    background: theme.colors.neutral[100],
                    border: 'none',
                    borderRadius: theme.borderRadius.full,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 28,
                    height: 28,
                    color: theme.colors.text.secondary
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Insights and Correlations */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: theme.spacing.lg,
        marginBottom: theme.spacing.xl
      }}>
        {/* Mood Distribution */}
        <div style={{
          background: theme.colors.neutral[50],
          borderRadius: theme.borderRadius.xl,
          padding: theme.spacing.lg
        }}>
          <h4 style={{ fontSize: theme.typography.h4, marginBottom: theme.spacing.md }}>
            Mood Distribution
          </h4>
          <div style={{ display: 'grid', gap: theme.spacing.sm }}>
            {moodOptions.slice(0, 5).map((mood) => {
              const count = moodHistory.filter(m => m.emotion === mood.id).length;
              const percentage = moodHistory.length > 0 ? (count / moodHistory.length) * 100 : 0;
              
              return (
                <div key={mood.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: theme.typography.small, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>{mood.emoji}</span> {mood.label}
                    </span>
                    <span style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                      {Math.round(percentage)}%
                    </span>
                  </div>
                  <div style={{
                    height: 8,
                    background: theme.colors.neutral[200],
                    borderRadius: theme.borderRadius.full,
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${percentage}%`,
                      height: '100%',
                      background: mood.color
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Insights */}
        <div style={{
          background: theme.colors.neutral[50],
          borderRadius: theme.borderRadius.xl,
          padding: theme.spacing.lg
        }}>
          <h4 style={{ fontSize: theme.typography.h4, marginBottom: theme.spacing.md }}>
            Key Insights
          </h4>
          <div style={{ display: 'grid', gap: theme.spacing.md }}>
            {insights.map((insight) => {
              const Icon = insight.icon;
              return (
                <div key={insight.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.md,
                  padding: theme.spacing.md,
                  background: 'white',
                  borderRadius: theme.borderRadius.lg,
                  border: `1px solid ${theme.colors.neutral[200]}`
                }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: theme.borderRadius.full,
                    background: `${theme.colors.accent.lavender}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Icon size={16} color={theme.colors.accent.lavender} />
                  </div>
                  <div>
                    <div style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                      {insight.title}
                    </div>
                    <div style={{ fontSize: theme.typography.small, fontWeight: 600 }}>
                      {insight.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Correlations */}
        <div style={{
          background: theme.colors.neutral[50],
          borderRadius: theme.borderRadius.xl,
          padding: theme.spacing.lg
        }}>
          <h4 style={{ fontSize: theme.typography.h4, marginBottom: theme.spacing.md }}>
            What Affects Your Mood
          </h4>
          <div style={{ display: 'grid', gap: theme.spacing.md }}>
            {correlations.map((item) => {
              const activity = activityOptions.find(a => a.id === item.activity);
              if (!activity) return null;
              const Icon = activity.icon;
              
              return (
                <div key={item.activity} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: theme.spacing.md,
                  background: 'white',
                  borderRadius: theme.borderRadius.lg,
                  border: `1px solid ${theme.colors.neutral[200]}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                    <div style={{
                      width: 32,
                      height: 32,
                      borderRadius: theme.borderRadius.full,
                      background: `${item.correlation > 0 ? theme.colors.success.light : theme.colors.error.light}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={16} color={item.correlation > 0 ? theme.colors.success.dark : theme.colors.error.dark} />
                    </div>
                    <div>
                      <div style={{ fontSize: theme.typography.small, fontWeight: 600 }}>
                        {activity.label}
                      </div>
                      <div style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                        {item.impact}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: theme.typography.small,
                    fontWeight: 600,
                    color: item.correlation > 0 ? theme.colors.success.main : theme.colors.error.main
                  }}>
                    {item.correlation > 0 ? '+' : ''}{Math.round(item.correlation * 100)}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mood History Timeline */}
      <div style={{
        background: theme.colors.neutral[50],
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.xl
      }}>
        <h4 style={{ fontSize: theme.typography.h4, marginBottom: theme.spacing.lg }}>
          Recent Mood Entries
        </h4>
        
        <div style={{ display: 'grid', gap: theme.spacing.md }}>
          {moodHistory.slice(0, 5).map((entry) => {
            const mood = moodOptions.find(m => m.id === entry.emotion);
            return (
              <div
                key={entry.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: theme.spacing.md,
                  background: 'white',
                  borderRadius: theme.borderRadius.lg,
                  border: `1px solid ${theme.colors.neutral[200]}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: theme.borderRadius.full,
                    background: `${mood?.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    {mood?.emoji}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.sm }}>
                      <span style={{ fontSize: theme.typography.body, fontWeight: 600 }}>
                        {mood?.label}
                      </span>
                      <span style={{
                        fontSize: theme.typography.tiny,
                        color: 'white',
                        background: mood?.color,
                        padding: '2px 8px',
                        borderRadius: theme.borderRadius.full
                      }}>
                        {entry.intensity}/10
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing.md, marginTop: 4 }}>
                      <span style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      <span style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted }}>
                        {entry.timeOfDay}
                      </span>
                    </div>
                  </div>
                </div>
                {entry.note && (
                  <span style={{ fontSize: theme.typography.tiny, color: theme.colors.text.muted, fontStyle: 'italic' }}>
                    "{entry.note}"
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Mood Modal */}
      <AnimatePresence>
        {showAddMood && (
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
              zIndex: 10000
            }}
            onClick={() => setShowAddMood(false)}
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
              <h3 style={{ fontSize: theme.typography.h3, marginBottom: theme.spacing.lg }}>
                How are you feeling?
              </h3>

              {/* Mood Selection */}
              <div style={{ marginBottom: theme.spacing.lg }}>
                <label style={{
                  display: 'block',
                  fontSize: theme.typography.small,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.sm
                }}>
                  Select Your Mood
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: theme.spacing.sm
                }}>
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => setNewMood({ ...newMood, emotion: mood.id })}
                      style={{
                        padding: theme.spacing.md,
                        background: newMood.emotion === mood.id ? `${mood.color}20` : 'white',
                        border: `2px solid ${newMood.emotion === mood.id ? mood.color : theme.colors.neutral[200]}`,
                        borderRadius: theme.borderRadius.lg,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4
                      }}
                    >
                      <span style={{ fontSize: '24px' }}>{mood.emoji}</span>
                      <span style={{ fontSize: theme.typography.tiny }}>{mood.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Intensity Slider */}
              <div style={{ marginBottom: theme.spacing.lg }}>
                <label style={{
                  display: 'block',
                  fontSize: theme.typography.small,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.sm
                }}>
                  Intensity: {newMood.intensity}/10
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={newMood.intensity}
                  onChange={(e) => setNewMood({ ...newMood, intensity: parseInt(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>

              {/* Activities */}
              <div style={{ marginBottom: theme.spacing.lg }}>
                <label style={{
                  display: 'block',
                  fontSize: theme.typography.small,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.sm
                }}>
                  What have you been doing?
                </label>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, 1fr)',
                  gap: theme.spacing.sm
                }}>
                  {activityOptions.map((activity) => {
                    const Icon = activity.icon;
                    const isSelected = newMood.activities.includes(activity.id);
                    return (
                      <button
                        key={activity.id}
                        onClick={() => {
                          const updated = isSelected
                            ? newMood.activities.filter(a => a !== activity.id)
                            : [...newMood.activities, activity.id];
                          setNewMood({ ...newMood, activities: updated });
                        }}
                        style={{
                          padding: theme.spacing.sm,
                          background: isSelected ? `${theme.colors.accent.lavender}20` : 'white',
                          border: `2px solid ${isSelected ? theme.colors.accent.lavender : theme.colors.neutral[200]}`,
                          borderRadius: theme.borderRadius.lg,
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Icon size={16} color={isSelected ? theme.colors.accent.lavender : theme.colors.text.muted} />
                        <span style={{ fontSize: theme.typography.tiny }}>{activity.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div style={{ marginBottom: theme.spacing.lg }}>
                <label style={{
                  display: 'block',
                  fontSize: theme.typography.small,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.sm
                }}>
                  Add a note (optional)
                </label>
                <textarea
                  value={newMood.note}
                  onChange={(e) => setNewMood({ ...newMood, note: e.target.value })}
                  placeholder="What's on your mind?"
                  rows="3"
                  style={{
                    width: '100%',
                    padding: theme.spacing.md,
                    borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${theme.colors.neutral[300]}`,
                    fontSize: theme.typography.body,
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              {/* Time */}
              <div style={{ marginBottom: theme.spacing.xl }}>
                <label style={{
                  display: 'block',
                  fontSize: theme.typography.small,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.sm
                }}>
                  Time
                </label>
                <input
                  type="time"
                  value={newMood.time}
                  onChange={(e) => setNewMood({ ...newMood, time: e.target.value })}
                  style={{
                    width: '100%',
                    padding: theme.spacing.md,
                    borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${theme.colors.neutral[300]}`,
                    fontSize: theme.typography.body,
                    outline: 'none'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: theme.spacing.md }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddMood}
                  disabled={!newMood.emotion}
                  style={{
                    flex: 2,
                    padding: theme.spacing.md,
                    background: !newMood.emotion ? theme.colors.neutral[300] : theme.colors.success.main,
                    color: 'white',
                    border: 'none',
                    borderRadius: theme.borderRadius.lg,
                    fontSize: theme.typography.body,
                    fontWeight: 600,
                    cursor: !newMood.emotion ? 'not-allowed' : 'pointer'
                  }}
                >
                  Save Mood
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddMood(false)}
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
    </motion.div>
  );
}

// Styles
const statCardStyle = {
  background: theme.colors.neutral[50],
  borderRadius: theme.borderRadius.lg,
  padding: theme.spacing.lg,
  border: `1px solid ${theme.colors.neutral[200]}`
};

const navButtonStyle = {
  padding: theme.spacing.sm,
  background: theme.colors.neutral[100],
  border: 'none',
  borderRadius: theme.borderRadius.full,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.colors.text.secondary
};

const iconButtonStyle = {
  padding: theme.spacing.xs,
  background: theme.colors.neutral[100],
  border: 'none',
  borderRadius: theme.borderRadius.full,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 28,
  height: 28,
  color: theme.colors.text.secondary
};

const modalLabelStyle = {
  display: 'block',
  fontSize: theme.typography.small,
  color: theme.colors.text.secondary,
  marginBottom: theme.spacing.sm
};

const modalInputStyle = {
  width: '100%',
  padding: theme.spacing.md,
  borderRadius: theme.borderRadius.lg,
  border: `1px solid ${theme.colors.neutral[300]}`,
  fontSize: theme.typography.body,
  outline: 'none'
};

const modalTextareaStyle = {
  width: '100%',
  padding: theme.spacing.md,
  borderRadius: theme.borderRadius.lg,
  border: `1px solid ${theme.colors.neutral[300]}`,
  fontSize: theme.typography.body,
  outline: 'none',
  resize: 'vertical',
  fontFamily: 'inherit'
};

export default MoodGraph;