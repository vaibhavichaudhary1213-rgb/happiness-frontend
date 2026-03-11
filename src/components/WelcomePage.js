// components/WelcomePage.js
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { forestCabinTheme as theme } from "../styles/forestCabinTheme.js";
import { userTracking } from '../services/userTracking';

// Icons
import { 
  Sparkles, 
  Heart, 
  Coffee, 
  Sun, 
  Moon, 
  Cloud, 
  Flower2,
  Leaf,
  Star,
  Smile,
  Cat,
  Bird
} from 'lucide-react';

function WelcomePage({ onWelcomeComplete }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [error, setError] = useState("");

  // Default personality for fallback
  const defaultPersonality = {
    id: 2, 
    icon: Moon,
    name: "The Poet",
    color: "#8B5CF6",
    emoji: "🌙",
    description: "Finding beauty in every moment"
  };

  // Avatars reflecting diverse mental states and personalities
  const avatars = [
    { 
      id: 1, 
      icon: Sun, 
      name: "The Optimist", 
      color: "#F59E0B", 
      emoji: "☀️", 
      description: "This pain wouldn't be forevermore" 
    },
    { 
      id: 2, 
      icon: Moon, 
      name: "The Poet", 
      color: "#8B5CF6", 
      emoji: "🌙", 
      description: "All is fair in love and poetry" 
    },
    { 
      id: 3, 
      icon: Cloud, 
      name: "The Overthinker", 
      color: "#6B7280", 
      emoji: "☁️", 
      description: "I wake in the night, I pace like a ghost" 
    },
    { 
      id: 4, 
      icon: Flower2, 
      name: "The Healer", 
      color: "#EC4899", 
      emoji: "🌸", 
      description: "Turning pain into poetry" 
    },
    { 
      id: 5, 
      icon: Leaf, 
      name: "The Grounded One", 
      color: "#10B981", 
      emoji: "🍃", 
      description: "Right here where I stand is holy ground" 
    },
    { 
      id: 6, 
      icon: Star, 
      name: "The Dreamer", 
      color: "#FCD34D", 
      emoji: "✨", 
      description: "I will go to the secret gardens in my mind" 
    },
    { 
      id: 7, 
      icon: Heart, 
      name: "The Empath", 
      color: "#F97316", 
      emoji: "💝", 
      description: "Too soft for all of it" 
    },
    { 
      id: 8, 
      icon: Coffee, 
      name: "The Escapist", 
      color: "#8B4513", 
      emoji: "☕", 
      description: "They nicknamed me 'The Bolter'" 
    },
    { 
      id: 9, 
      icon: Smile, 
      name: "The Survivor", 
      color: "#FBBF24", 
      emoji: "😊", 
      description: "Long story short, I survived" 
    },
    { 
      id: 10, 
      icon: Cat, 
      name: "The Curious Soul", 
      color: "#9CA3AF", 
      emoji: "🐱", 
      description: "Curious time gave me no compasses, gave me no signs" 
    },
    { 
      id: 11, 
      icon: Bird, 
      name: "The Free Spirit", 
      color: "#60A5FA", 
      emoji: "🐦", 
      description: "Happy, free, confused and lonely in the best way" 
    }
  ];

  const handleNext = () => {
    if (step === 1 && !name.trim()) {
      setError("Please tell me your name, friend 🌿");
      return;
    }
    if (step === 2 && !age) {
      setError("Please share your age 🌱");
      return;
    }
    if (step === 2 && (age < 1 || age > 120)) {
      setError("Please enter a valid age 💫");
      return;
    }
    if (step === 3 && !selectedAvatar) {
      setError("Please choose a forest spirit ✨");
      return;
    }
    
    setError("");
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Get selected avatar or use default
      const selectedPersonality = avatars.find(a => a.id === selectedAvatar) || defaultPersonality;
      
      // Create user data object
      const userData = {
        userId: userTracking.getUserId(), // Generate or get existing user ID
        name: name.trim(),
        age: parseInt(age),
        personality: {
          id: selectedPersonality.id,
          name: selectedPersonality.name,
          color: selectedPersonality.color,
          emoji: selectedPersonality.emoji,
          description: selectedPersonality.description
        },
        joinedAt: new Date().toISOString()
      };

      // ✅ Track the signup in user tracking
      userTracking.trackUserSignup({
        userId: userData.userId,
        name: userData.name,
        age: userData.age,
        personality: userData.personality.name
      });

      // ✅ Track session start
      userTracking.trackSession('app_start', { 
        from: 'welcome',
        name: userData.name,
        personality: userData.personality.name
      });

      // Save to localStorage for persistence
      localStorage.setItem('ivyInsightUser', JSON.stringify(userData));
      
      // Call the completion handler with user data
      onWelcomeComplete(userData);
    }
  };

  const handleBack = () => {
    setError("");
    setStep(step - 1);
  };

  return (
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
        background: 'linear-gradient(to bottom, #0a1420 0%, #1a2a35 50%, #1e3a2a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.xl,
        zIndex: 10000,
        overflow: 'auto'
      }}
    >
      {/* Optional: Add subtle moon glow effect */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '15%',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(255,245,230,0.1) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none'
      }} />

      {/* Centered Content Container */}
      <motion.div
        layout
        style={{
          background: theme.colors.background.paper,
          backdropFilter: 'blur(20px)',
          borderRadius: theme.borderRadius['2xl'],
          padding: theme.spacing['2xl'],
          maxWidth: '600px',
          width: '100%',
          boxShadow: theme.shadows.xl,
          border: `1px solid ${theme.colors.secondary.main}40`,
          position: 'relative',
          zIndex: 10,
          margin: 'auto'
        }}
      >
        {/* Progress Bar */}
        <div style={{
          display: 'flex',
          gap: theme.spacing.sm,
          marginBottom: theme.spacing.xl,
          justifyContent: 'center'
        }}>
          {[1, 2, 3].map((s) => (
            <motion.div
              key={s}
              animate={{
                width: step === s ? 60 : 40,
                backgroundColor: step >= s ? theme.colors.secondary.main : theme.colors.neutral[500]
              }}
              style={{
                height: 4,
                borderRadius: theme.borderRadius.full,
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div style={{ fontSize: '64px', textAlign: 'center', marginBottom: theme.spacing.lg }}>
                🌙
              </div>
              <h2 style={{
                fontSize: theme.typography.h2,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
                textAlign: 'center'
              }}>
                Welcome to Ivy Insight
              </h2>
              
              {/* Inspirational Quotes */}
              <div style={{
                background: `${theme.colors.secondary.main}20`,
                borderRadius: theme.borderRadius.xl,
                padding: theme.spacing.xl,
                marginBottom: theme.spacing.xl,
                borderLeft: `4px solid ${theme.colors.secondary.main}`
              }}>
                <p style={{
                  fontSize: theme.typography.h4,
                  color: theme.colors.text.primary,
                  fontStyle: 'italic',
                  marginBottom: theme.spacing.md,
                  lineHeight: 1.6
                }}>
                  "Give yourself the green light of forgiveness"
                </p>
                <p style={{
                  fontSize: theme.typography.body,
                  color: theme.colors.text.secondary,
                  fontStyle: 'italic',
                  lineHeight: 1.6
                }}>
                  "There is happiness, past the blood and bruise, 
                  past the curses and cries, I believe there is happiness"
                </p>
                <div style={{
                  marginTop: theme.spacing.md,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  color: theme.colors.secondary.main
                }}>
                  <span>— Ivy Insight</span>
                </div>
              </div>
              
              <p style={{
                fontSize: theme.typography.body,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.xl,
                textAlign: 'center'
              }}>
                Your gentle guide through life's forest
              </p>
              
              <div style={{ marginBottom: theme.spacing.xl }}>
                <label style={{
                  display: 'block',
                  fontSize: theme.typography.small,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.sm,
                  textAlign: 'center'
                }}>
                  What should I call you? 🌙
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Sarah, Alex, Jamie..."
                  className="whisper-input"
                  style={{
                    width: '100%',
                    padding: theme.spacing.lg,
                    borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${error ? theme.colors.error.main : theme.colors.neutral[400]}`,
                    fontSize: theme.typography.body,
                    outline: 'none',
                    transition: 'all 0.2s',
                    background: theme.colors.background.paper,
                    color: theme.colors.text.primary
                  }}
                  onFocus={(e) => e.target.style.borderColor = theme.colors.secondary.main}
                  onBlur={(e) => e.target.style.borderColor = error ? theme.colors.error.main : theme.colors.neutral[400]}
                  autoFocus
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div style={{ fontSize: '64px', textAlign: 'center', marginBottom: theme.spacing.lg }}>
                🌱
              </div>
              <h2 style={{
                fontSize: theme.typography.h2,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
                textAlign: 'center'
              }}>
                A Little About You
              </h2>
              <p style={{
                fontSize: theme.typography.body,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.xl,
                textAlign: 'center'
              }}>
                This helps me personalize your forest journey
              </p>
              
              <div style={{ marginBottom: theme.spacing.xl }}>
                <label style={{
                  display: 'block',
                  fontSize: theme.typography.small,
                  color: theme.colors.text.secondary,
                  marginBottom: theme.spacing.sm,
                  textAlign: 'center'
                }}>
                  How many autumns have you seen? 🍂
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter your age"
                  min="1"
                  max="120"
                  className="whisper-input"
                  style={{
                    width: '100%',
                    padding: theme.spacing.lg,
                    borderRadius: theme.borderRadius.lg,
                    border: `1px solid ${error ? theme.colors.error.main : theme.colors.neutral[400]}`,
                    fontSize: theme.typography.body,
                    outline: 'none',
                    transition: 'all 0.2s',
                    background: theme.colors.background.paper,
                    color: theme.colors.text.primary
                  }}
                  onFocus={(e) => e.target.style.borderColor = theme.colors.secondary.main}
                  onBlur={(e) => e.target.style.borderColor = error ? theme.colors.error.main : theme.colors.neutral[400]}
                  autoFocus
                />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div style={{ fontSize: '64px', textAlign: 'center', marginBottom: theme.spacing.lg }}>
                ✨
              </div>
              <h2 style={{
                fontSize: theme.typography.h2,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.sm,
                textAlign: 'center'
              }}>
                Choose Your Forest Spirit
              </h2>
              <p style={{
                fontSize: theme.typography.body,
                color: theme.colors.text.secondary,
                marginBottom: theme.spacing.xl,
                textAlign: 'center'
              }}>
                Pick the one that resonates with your soul
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: theme.spacing.md,
                marginBottom: theme.spacing.xl,
                maxHeight: '400px',
                overflowY: 'auto',
                padding: theme.spacing.sm
              }}>
                {avatars.map((avatar) => {
                  const isSelected = selectedAvatar === avatar.id;
                  
                  return (
                    <motion.div
                      key={avatar.id}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedAvatar(avatar.id)}
                      style={{
                        background: isSelected ? `${avatar.color}30` : theme.colors.background.cozy,
                        borderRadius: theme.borderRadius.lg,
                        padding: theme.spacing.md,
                        cursor: 'pointer',
                        border: isSelected ? `2px solid ${avatar.color}` : `1px solid ${theme.colors.neutral[400]}`,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: theme.spacing.xs,
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? theme.shadows.md : 'none'
                      }}
                    >
                      <div style={{
                        width: 48,
                        height: 48,
                        borderRadius: theme.borderRadius.full,
                        background: `${avatar.color}30`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: avatar.color,
                        fontSize: '24px'
                      }}>
                        {avatar.emoji}
                      </div>
                      <div style={{
                        fontSize: theme.typography.tiny,
                        fontWeight: isSelected ? 600 : 400,
                        color: theme.colors.text.primary,
                        textAlign: 'center'
                      }}>
                        {avatar.name}
                      </div>
                      <div style={{
                        fontSize: theme.typography.tiny,
                        color: theme.colors.text.secondary,
                        textAlign: 'center'
                      }}>
                        {avatar.description}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                background: `${theme.colors.error.main}20`,
                color: theme.colors.error.main,
                padding: theme.spacing.md,
                borderRadius: theme.borderRadius.md,
                marginBottom: theme.spacing.lg,
                fontSize: theme.typography.small,
                textAlign: 'center',
                border: `1px solid ${theme.colors.error.main}40`
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          gap: theme.spacing.md,
          justifyContent: step === 1 ? 'flex-end' : 'space-between'
        }}>
          {step > 1 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBack}
              className="whisper-button-secondary"
              style={{
                padding: `${theme.spacing.md} ${theme.spacing.xl}`,
                background: 'transparent',
                border: `1px solid ${theme.colors.neutral[400]}`,
                borderRadius: theme.borderRadius.full,
                color: theme.colors.text.secondary,
                fontSize: theme.typography.body,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              ← Back
            </motion.button>
          )}
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            className="whisper-button-primary"
            style={{
              padding: `${theme.spacing.md} ${theme.spacing.xl}`,
              background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
              border: 'none',
              borderRadius: theme.borderRadius.full,
              color: '#FFFFFF',
              fontSize: theme.typography.body,
              cursor: 'pointer',
              fontWeight: 600,
              boxShadow: theme.shadows.md,
              flex: step === 1 ? 1 : '0 1 auto'
            }}
          >
            {step === 3 ? '✨ Enter the Forest' : 'Continue →'}
          </motion.button>
        </div>

        {/* Cozy Footer */}
        <div style={{
          marginTop: theme.spacing.xl,
          textAlign: 'center',
          fontSize: theme.typography.tiny,
          color: theme.colors.text.muted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: theme.spacing.xs
        }}>
          <Leaf size={12} color={theme.colors.secondary.main} />
          <span>Your journey through the forest begins here</span>
          <Leaf size={12} color={theme.colors.secondary.main} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default WelcomePage;