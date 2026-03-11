// App.js
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "./components/Sidebar.js";
import ChatBox from "./components/ChatBox.js";
import WellnessDashboard from "./components/WellnessDashboard.js";
import HabitTracker from "./components/HabitTracker.js";
import GrowthTracker from "./components/GrowthTracker.js";
import MoodGraph from "./components/MoodGraph.js";
import FloatingHearts from "./components/FloatingHearts.js";
import WelcomePage from "./components/WelcomePage.js";
import { forestCabinTheme } from "./styles/forestCabinTheme.js";
import "./styles/global.css";
import AdminDashboard from './components/AdminDashboard.js';
import { userTracking } from './services/userTracking';
import PublicQRPage from './components/PublicQRPage';

function App() {
  const [activeTab, setActiveTab] = useState("chat");
  const [userId] = useState("user_1");
  const [lastEmotion, setLastEmotion] = useState(null);
  const [lastIntensity, setLastIntensity] = useState(3);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [showWelcome, setShowWelcome] = useState(true);
  const [userData, setUserData] = useState(null);
  
  // Check if this is the public QR page
  const isPublicQRPage = window.location.pathname === '/public/qr';
  
  // ✅ Track when user visits main app
  useEffect(() => {
    const userId = userTracking.getUserId();
    userTracking.trackSession('app_visit');
  }, []);

  // Use Whispering Woods & Lavender theme
  const theme = forestCabinTheme;

  // Default personality - The Poet
  const defaultPersonality = {
    id: 2,
    icon: "🌙",
    name: "The Poet",
    color: "#8B5CF6",
    emoji: "🌙",
    description: "Finding beauty in every moment"
  };

  const handleEmotionDetected = (emotion, intensity) => {
    setLastEmotion(emotion);
    setLastIntensity(intensity || 3);
  };

  const handleWelcomeComplete = (data) => {
    // Add default personality if not selected
    const userWithPersonality = {
      ...data,
      personality: data.personality || defaultPersonality
    };
    setUserData(userWithPersonality);
    setShowWelcome(false);
  };

  const handleUpdateUser = (updatedData) => {
    setUserData(updatedData);
  };

  // Logout function to return to welcome page
  const handleLogout = () => {
    setShowWelcome(true);
    setUserData(null);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch(activeTab) {
      case "chat":
        return <ChatBox 
          onEmotionDetected={handleEmotionDetected} 
          userData={userData}
          theme={theme}
        />;
      case "wellness":
        return <WellnessDashboard userId={userId} userData={userData} theme={theme} />;
      case "habits":
        return <HabitTracker userId={userId} userData={userData} theme={theme} />;
      case "growth":
        return <GrowthTracker userId={userId} userData={userData} theme={theme} />;
      case "mood":
        return <MoodGraph userId={userId} userData={userData} theme={theme} />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <ChatBox 
          onEmotionDetected={handleEmotionDetected}
          userData={userData}
          theme={theme}
        />;
    }
  };

  // If this is the public QR page, render it without any app wrapper
  if (isPublicQRPage) {
    return <PublicQRPage />;
  }

  // Otherwise render the main app
  return (
    <div 
      className="whisper-linen-texture whisper-glow" 
      style={{
        background: theme.colors.background.main,
        minHeight: "100vh",
        display: "flex",
        position: "relative"
      }}
    >
      {/* Warm forest gradient overlay */}
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "300px",
        background: `radial-gradient(circle at 50% 0%, ${theme.colors.primary.light}30 0%, transparent 70%)`,
        pointerEvents: "none",
        zIndex: 0
      }} />
      
      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", width: "100%" }}>
        <AnimatePresence mode="wait">
          {showWelcome ? (
            <WelcomePage 
              key="welcome"
              onWelcomeComplete={handleWelcomeComplete}
              theme={theme}
            />
          ) : (
            <motion.div
              key="main"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', width: '100%' }}
            >
              <Sidebar 
                activeTab={activeTab} 
                onTabChange={setActiveTab}
                onExpandChange={setIsSidebarExpanded}
                userData={userData}
                onUpdateUser={handleUpdateUser}
                theme={theme}
                onLogout={handleLogout}
              />
              
              <motion.main
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                style={{
                  flex: 1,
                  marginLeft: !showWelcome && isSidebarExpanded ? "280px" : "0",
                  padding: theme.spacing.xl,
                  transition: theme.animation.normal,
                  overflowY: "auto",
                  maxHeight: "100vh",
                  width: "100%",
                  position: 'relative',
                  background: `
                    radial-gradient(circle at 0% 30%, ${theme.colors.secondary.light}25 0%, transparent 60%),
                    radial-gradient(circle at 100% 70%, ${theme.colors.primary.light}20 0%, transparent 50%),
                    linear-gradient(135deg, ${theme.colors.background.main} 0%, ${theme.colors.background.warm} 100%)
                  `,
                }}
              >
                {/* Lavender whisper from the left */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `
                    linear-gradient(90deg, 
                      ${theme.colors.secondary.main}25 0%, 
                      transparent 40%,
                      transparent 70%,
                      ${theme.colors.primary.main}20 100%
                    )
                  `,
                  pointerEvents: 'none',
                  zIndex: 0
                }} />
                
                {/* Top right lavender glow */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '500px',
                  height: '500px',
                  background: `
                    radial-gradient(circle at 100% 0%, 
                      ${theme.colors.secondary.light}20 0%, 
                      transparent 70%
                    )
                  `,
                  pointerEvents: 'none',
                  zIndex: 0
                }} />
                
                {/* Bottom left forest glow */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '400px',
                  height: '400px',
                  background: `
                    radial-gradient(circle at 0% 100%, 
                      ${theme.colors.primary.main}20 0%, 
                      transparent 70%
                    )
                  `,
                  pointerEvents: 'none',
                  zIndex: 0
                }} />
                
                {/* Content container */}
                <div style={{
                  maxWidth: "1200px",
                  width: "100%",
                  margin: "0 auto",
                  position: 'relative',
                  zIndex: 1
                }}>
                  {renderContent()}
                </div>
              </motion.main>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating elements */}
      <div style={{
        position: 'fixed',
        bottom: 30,
        right: 30,
        zIndex: 100,
        pointerEvents: 'none'
      }}>
        {['🌲', '🌙', '🍃', '✨', '💜', '🌿'].map((element, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: 4 + i, 
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            style={{
              fontSize: "28px",
              margin: "8px",
              filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))",
              opacity: 0.3,
              color: theme.colors.secondary.light
            }}
          >
            {element}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default App;