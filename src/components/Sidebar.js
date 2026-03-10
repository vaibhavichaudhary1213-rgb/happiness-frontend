// components/Sidebar.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { forestCabinTheme as theme } from "../styles/forestCabinTheme.js";
import { 
  Sun, Moon, Cloud, Flower2, Leaf, 
  Star, Heart, Coffee, Smile, Cat, Bird 
} from 'lucide-react';

function Sidebar({ activeTab, onTabChange, onExpandChange, userData, onUpdateUser, onLogout }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showPersonalitySelector, setShowPersonalitySelector] = useState(false);

  // Define menu items WITH admin tab clearly visible
  const menuItems = [
    { id: "chat", icon: "💭", label: "Chat", color: theme?.colors?.secondary?.main || "#2A254A" },
    { id: "wellness", icon: "🌿", label: "Wellness", color: theme?.colors?.primary?.main || "#1A3A3A" },
    { id: "habits", icon: "⭐", label: "Habits", color: theme?.colors?.accent?.honey || "#D8C0A0" },
    { id: "growth", icon: "🌸", label: "Growth", color: theme?.colors?.accent?.lavender || "#2A254A" },
    { id: "mood", icon: "📊", label: "Mood Tracker", color: theme?.colors?.accent?.softLavender || "#3A2A5A" },
    { id: "admin", icon: "📊", label: "Admin", color: theme?.colors?.secondary?.main || "#2A254A" } // ADMIN TAB HERE
  ];

  // Log to verify admin tab is in the array
  console.log("Menu items:", menuItems.map(item => item.id));
  console.log("Admin tab present:", menuItems.some(item => item.id === "admin"));

  // Avatars reflecting diverse mental states and personalities
  // Avatars reflecting diverse mental states and personalities
const personalityOptions = [
  { 
    id: 1, 
    name: "The Optimist", 
    color: "#F59E0B", 
    emoji: "☀️", 
    description: "This pain wouldn't be forevermore" 
  },
  { 
    id: 2, 
    name: "The Poet", 
    color: "#8B5CF6", 
    emoji: "🌙", 
    description: "All is fair in love and poetry" 
  },
  { 
    id: 3, 
    name: "The Overthinker", 
    color: "#6B7280", 
    emoji: "☁️", 
    description: "I wake in the night, I pace like a ghost" 
  },
  { 
    id: 4, 
    name: "The Healer", 
    color: "#EC4899", 
    emoji: "🌸", 
    description: "Turning pain into poetry" 
  },
  { 
    id: 5, 
    name: "The Grounded One", 
    color: "#10B981", 
    emoji: "🍃", 
    description: "Right here where I stand is holy ground" 
  },
  { 
    id: 6, 
    name: "The Dreamer", 
    color: "#FCD34D", 
    emoji: "✨", 
    description: "I will go to the secret gardens in my mind" 
  },
  { 
    id: 7, 
    name: "The Empath", 
    color: "#F97316", 
    emoji: "💝", 
    description: "Too soft for all of it" 
  },
  { 
    id: 8, 
    name: "The Escapist", 
    color: "#8B4513", 
    emoji: "☕", 
    description: "They nicknamed me 'The Bolter'" 
  },
  { 
    id: 9, 
    name: "The Survivor", 
    color: "#FBBF24", 
    emoji: "😊", 
    description: "Long story short, I survived" 
  },
  { 
    id: 10, 
    name: "The Curious Soul", 
    color: "#9CA3AF", 
    emoji: "🐱", 
    description: "Curious time gave me no compasses, gave me no signs" 
  },
  { 
    id: 11, 
    name: "The Free Spirit", 
    color: "#60A5FA", 
    emoji: "🐦", 
    description: "Happy, free, confused and lonely in the best way" 
  }
];

  const toggleSidebar = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onExpandChange(newExpanded);
  };

  const handlePersonalityChange = (personality) => {
    const updatedUser = {
      ...userData,
      personality: personality
    };
    onUpdateUser(updatedUser);
    setShowPersonalitySelector(false);
  };

  // Get user avatar data
  const avatar = userData?.personality || personalityOptions[1];
  const userName = userData?.name || 'Guest';
  const userAge = userData?.age || '—';

  return (
    <motion.div
      initial={{ width: 280 }}
      animate={{ width: isExpanded ? 280 : 80 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        height: "100vh",
        background: theme?.colors?.background?.paper || "#1A2A2A",
        boxShadow: theme?.shadows?.warm || "0 4px 20px rgba(0,0,0,0.5)",
        position: "fixed",
        left: 0,
        top: 0,
        overflow: "hidden",
        zIndex: 1000,
        borderRight: `1px solid ${theme?.colors?.neutral?.[400] || "#4A4A4A"}`,
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Decorative top gradient */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "120px",
        background: `linear-gradient(180deg, ${theme?.colors?.secondary?.light || "#2A254A"}30 0%, transparent 100%)`,
        pointerEvents: "none"
      }} />

      {/* Header */}
      <div style={{
        padding: theme?.spacing?.xl || "2rem",
        borderBottom: `1px solid ${theme?.colors?.neutral?.[400] || "#4A4A4A"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: isExpanded ? "space-between" : "center",
        position: "relative"
      }}>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <h2 style={{ 
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 600,
              color: theme?.colors?.text?.primary || "#E8E0E0",
              letterSpacing: "-0.02em"
            }}>
              Ivy Insight
            </h2>
            <p style={{
              margin: "4px 0 0",
              fontSize: theme?.typography?.tiny || "0.75rem",
              color: theme?.colors?.text?.secondary || "#C0B8C0"
            }}>
              your forest sanctuary
            </p>
          </motion.div>
        )}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleSidebar}
          style={{
            background: theme?.colors?.neutral?.[200] || "#2A2F2A",
            border: "none",
            fontSize: "20px",
            cursor: "pointer",
            padding: "0.5rem",
            borderRadius: "9999px",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: theme?.colors?.text?.primary || "#E8E0E0",
          }}
        >
          {isExpanded ? "←" : "→"}
        </motion.button>
      </div>

      {/* Menu Items - Admin is clearly here */}
      <div style={{ 
        padding: theme?.spacing?.lg || "1.5rem",
        marginTop: theme?.spacing?.md || "1rem",
        overflowY: "auto",
        maxHeight: "calc(100vh - 200px)"
      }}>
        {menuItems.map((item, index) => {
          const isActive = activeTab === item.id;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 8 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onTabChange(item.id)}
              style={{
                padding: theme?.spacing?.md || "1rem",
                marginBottom: theme?.spacing?.xs || "0.5rem",
                borderRadius: theme?.borderRadius?.lg || "16px",
                background: isActive 
                  ? `${item.color}30`
                  : "transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: theme?.spacing?.lg || "1.5rem",
                color: isActive ? (theme?.colors?.text?.primary || "#E8E0E0") : (theme?.colors?.text?.secondary || "#C0B8C0"),
                border: isActive ? `1px solid ${item.color}60` : "1px solid transparent",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeIndicator"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "4px",
                    background: item.color,
                    borderRadius: "0 4px 4px 0"
                  }}
                />
              )}
              <span style={{ fontSize: "24px" }}>{item.icon}</span>
              {isExpanded && (
                <span style={{ 
                  fontSize: theme?.typography?.body || "1rem",
                  fontWeight: isActive ? 600 : 400,
                }}>
                  {item.label}
                </span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* User Profile Section */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: theme?.spacing?.lg || "1.5rem",
        borderTop: `1px solid ${theme?.colors?.neutral?.[400] || "#4A4A4A"}`,
        background: theme?.colors?.background?.warm || "#1A2525"
      }}>
        {/* Profile info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: theme?.spacing?.lg || "1.5rem",
            cursor: "pointer",
            marginBottom: isExpanded ? theme?.spacing?.sm || "0.75rem" : 0
          }}
          onClick={() => isExpanded && setShowPersonalitySelector(true)}
        >
          <div style={{
            width: 40,
            height: 40,
            borderRadius: "9999px",
            background: `linear-gradient(135deg, ${avatar.color}20, ${avatar.color}40)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            border: `2px solid ${avatar.color}`,
          }}>
            {avatar.emoji}
          </div>
          
          {isExpanded && (
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontWeight: 600,
                color: theme?.colors?.text?.primary || "#E8E0E0",
                fontSize: theme?.typography?.small || "0.875rem"
              }}>
                {userName}
              </div>
              <div style={{ 
                fontSize: theme?.typography?.tiny || "0.75rem",
                color: theme?.colors?.text?.secondary || "#C0B8C0",
              }}>
                {avatar.name} · {userAge} years
              </div>
              <div style={{
                fontSize: theme?.typography?.tiny || "0.75rem",
                color: avatar.color,
                marginTop: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <span>Click to change</span>
                <span style={{ fontSize: '10px' }}>✎</span>
              </div>
            </div>
          )}
        </div>

        {/* Logout Button */}
        {isExpanded && onLogout && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            style={{
              padding: `${theme?.spacing?.xs || "0.5rem"} ${theme?.spacing?.sm || "0.75rem"}`,
              background: 'transparent',
              border: `1px solid ${theme?.colors?.neutral?.[400] || "#4A4A4A"}`,
              borderRadius: "9999px",
              color: theme?.colors?.text?.secondary || "#C0B8C0",
              fontSize: theme?.typography?.tiny || "0.75rem",
              cursor: 'pointer',
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: theme?.spacing?.xs || "0.5rem",
              marginTop: theme?.spacing?.sm || "0.75rem",
            }}
          >
            <span>🚪</span> Return to Welcome
          </motion.button>
        )}
      </div>

      {/* Personality Selector Modal */}
      <AnimatePresence>
        {showPersonalitySelector && (
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
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000
            }}
            onClick={() => setShowPersonalitySelector(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: theme?.colors?.background?.paper || "#1A2A2A",
                borderRadius: theme?.borderRadius?.xl || "24px",
                padding: theme?.spacing?.xl || "2rem",
                boxShadow: theme?.shadows?.xl || "0 20px 25px -5px rgba(0,0,0,0.5)",
                maxWidth: '600px',
                width: '90%',
                maxHeight: '80vh',
                overflow: 'auto',
              }}
            >
              <h3 style={{
                fontSize: theme?.typography?.h3 || "1.5rem",
                color: theme?.colors?.text?.primary || "#E8E0E0",
                marginBottom: theme?.spacing?.sm || "0.75rem",
                textAlign: 'center'
              }}>
                Choose Your Forest Spirit
              </h3>
              <p style={{
                fontSize: theme?.typography?.small || "0.875rem",
                color: theme?.colors?.text?.secondary || "#C0B8C0",
                marginBottom: theme?.spacing?.xl || "2rem",
                textAlign: 'center'
              }}>
                Pick the one that resonates with your soul
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                gap: theme?.spacing?.md || "1rem"
              }}>
                {personalityOptions.map((personality) => (
                  <motion.div
                    key={personality.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handlePersonalityChange(personality)}
                    style={{
                      background: avatar.id === personality.id 
                        ? `${personality.color}30` 
                        : (theme?.colors?.background?.cozy || "#152020"),
                      borderRadius: theme?.borderRadius?.lg || "16px",
                      padding: theme?.spacing?.md || "1rem",
                      cursor: 'pointer',
                      border: avatar.id === personality.id 
                        ? `2px solid ${personality.color}`
                        : `1px solid ${theme?.colors?.neutral?.[400] || "#4A4A4A"}`,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: theme?.spacing?.xs || "0.5rem",
                      textAlign: 'center'
                    }}
                  >
                    <div style={{
                      width: 48,
                      height: 48,
                      borderRadius: "9999px",
                      background: `${personality.color}30`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      color: personality.color
                    }}>
                      {personality.emoji}
                    </div>
                    <div style={{
                      fontSize: theme?.typography?.small || "0.875rem",
                      fontWeight: 600,
                      color: theme?.colors?.text?.primary || "#E8E0E0"
                    }}>
                      {personality.name}
                    </div>
                    <div style={{
                      fontSize: theme?.typography?.tiny || "0.75rem",
                      color: theme?.colors?.text?.secondary || "#C0B8C0"
                    }}>
                      {personality.description}
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowPersonalitySelector(false)}
                style={{
                  marginTop: theme?.spacing?.xl || "2rem",
                  padding: `${theme?.spacing?.md || "1rem"} ${theme?.spacing?.xl || "2rem"}`,
                  background: theme?.colors?.neutral?.[300] || "#3A3F3A",
                  border: 'none',
                  borderRadius: "9999px",
                  color: theme?.colors?.text?.primary || "#E8E0E0",
                  fontSize: theme?.typography?.body || "1rem",
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Sidebar;