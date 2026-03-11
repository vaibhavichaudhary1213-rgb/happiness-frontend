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

  // -------- MOCK DATA --------

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

  // ---------- ADD MOOD ----------

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

  // ---------- UI ----------

  if (loading) {
    return <div>Loading mood data...</div>;
  }

  return (
    <div style={{padding:30}}>
      <h2>Mood Tracker</h2>

      <button onClick={()=>setShowAddMood(true)}>
        <Plus size={18}/> Log Mood
      </button>

      {/* Weekly Graph */}
      <div style={{display:'flex',alignItems:'flex-end',gap:10,height:200,marginTop:20}}>
        {weeklyData.map((day,index)=>(
          <div key={index} style={{flex:1,textAlign:'center'}}>
            <div
              style={{
                height:day.happiness_score,
                background:day.color,
                borderRadius:8
              }}
            />
            <div>{day.day}</div>
            <div>{day.emoji}</div>
          </div>
        ))}
      </div>

      {/* Mood History */}
      <h3 style={{marginTop:30}}>Recent Mood Entries</h3>

      {moodHistory.slice(0,5).map(entry=>{
        const mood=moodOptions.find(m=>m.id===entry.emotion);
        return(
          <div key={entry.id} style={{padding:10,borderBottom:"1px solid #eee"}}>
            <strong>{mood?.label}</strong> ({entry.intensity}/10) — {entry.timeOfDay}
          </div>
        );
      })}

      {/* Modal */}
      <AnimatePresence>
      {showAddMood && (
        <motion.div
          initial={{opacity:0}}
          animate={{opacity:1}}
          exit={{opacity:0}}
          style={{
            position:"fixed",
            top:0,left:0,right:0,bottom:0,
            background:"rgba(0,0,0,0.6)",
            display:"flex",
            alignItems:"center",
            justifyContent:"center"
          }}
        >
          <motion.div
            initial={{scale:0.9}}
            animate={{scale:1}}
            exit={{scale:0.9}}
            style={{background:"white",padding:30,borderRadius:10,width:400}}
          >
            <h3>How are you feeling?</h3>

            {moodOptions.map(mood=>(
              <button
                key={mood.id}
                onClick={()=>setNewMood({...newMood,emotion:mood.id})}
                style={{margin:5}}
              >
                {mood.emoji} {mood.label}
              </button>
            ))}

            <br/><br/>

            <button onClick={handleAddMood}>Save Mood</button>
            <button onClick={()=>setShowAddMood(false)}>Cancel</button>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}

export default MoodGraph;
