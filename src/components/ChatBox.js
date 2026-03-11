// components/ChatBox.js
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble.js";
import ActivitySuggestions from "./ActivitySuggester.js";
import { sendMoodMessage } from "../services/api.js";
import { forestCabinTheme } from "../styles/forestCabinTheme.js";
import { Send, Sparkles } from 'lucide-react';

function ChatBox({ onEmotionDetected, userData, isPopupOpen }) {
  const [messages, setMessages] = useState([
    { 
      id: 1,
      sender: "bot", 
      text: userData 
        ? `Hi ${userData.name}, I'm Kindred Keeper. How are you feeling today? 🌲`
        : "Hi, I'm Kindred Keeper. How are you feeling today? 🌲",
      timestamp: new Date(),
      type: "greeting"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [lastMoodData, setLastMoodData] = useState(null);
  const [activityConfirmation, setActivityConfirmation] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

   // ADD THIS HELPER FUNCTION HERE (right after state declarations)
  const addMessage = (text, sender) => {
    const newMessage = {
      id: Date.now(),
      text: text,
      sender: sender,
      timestamp: new Date(),
      type: "support-message"
    };
    setMessages(prev => [...prev, newMessage]);
  };


  // Use Forest Cabin theme
  const theme = forestCabinTheme;

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  useEffect(() => {
  // Function to handle new bot messages from ActivitySuggester
  const handleNewBotMessage = (event) => {
    addMessage(event.detail, 'bot');
  };

  // Check localStorage for any pending messages
  const pendingMessage = localStorage.getItem('pendingBotMessage');
  if (pendingMessage) {
    addMessage(pendingMessage, 'bot');
    localStorage.removeItem('pendingBotMessage');
  }

  // Listen for custom events
  window.addEventListener('newBotMessage', handleNewBotMessage);

  // Cleanup
  return () => {
    window.removeEventListener('newBotMessage', handleNewBotMessage);
  };
}, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await sendMoodMessage(input);
      
      const moodData = {
        emotion: response.primary_emotion,
        intensity: response.intensity,
        sentiment: response.sentiment
      };
      
      setLastMoodData(moodData);
      onEmotionDetected?.(response.primary_emotion, response.intensity);

      const botReply = {
        id: Date.now() + 1,
        sender: "bot",
        text: response.chatbot_response,
        timestamp: new Date(),
        emotion: response.primary_emotion,
        gratitudePrompt: response.gratitude_prompt,
        kindnessChallenge: response.kindness_challenge,
        type: "mood-response"
      };

      setMessages(prev => [...prev, botReply]);
      
      // Wait 8 seconds before showing activities
      setTimeout(() => {
        const activityPrompt = {
          id: Date.now() + 2,
          sender: "bot",
          text: "Let's try some activities which might help with how you're feeling. 🌱",
          timestamp: new Date(),
          type: "activity-prompt"
        };
        setMessages(prev => [...prev, activityPrompt]);
        
        // Show activities immediately after the prompt
        setShowSuggestions(true);
      }, 8000);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: "bot",
        text: "I'm here with you. Would you like to try again?",
        timestamp: new Date(),
        type: "error"
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActivitySelected = (activity) => {
    // Add confirmation message that appears AFTER the activity selection
    const confirmationMessage = {
      id: Date.now(),
      sender: "bot",
      text: `Beautiful choice. Take your time with "${activity.name}" - I'll be here when you return. 🌲`,
      timestamp: new Date(),
      type: "activity-confirmation"
    };
    
    setActivityConfirmation(confirmationMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Get user avatar
  const userAvatar = userData?.personality || { emoji: "🌲", name: "The Poet" };

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      background: theme.colors.background.paper,
      borderRadius: theme.borderRadius['2xl'],
      height: 'calc(100vh - 64px)',
      overflow: 'hidden',
      boxShadow: theme.shadows.warm,
      border: `1px solid ${theme.colors.neutral[200]}`,
      position: 'relative'
    }}>
      {/* Decorative forest pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '120px',
        background: `radial-gradient(circle at 20% 50%, ${theme.colors.primary.light}40 0%, transparent 50%)`,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Chat Header */}
      <div style={{
        padding: theme.spacing.xl,
        background: theme.colors.background.warm,
        borderBottom: `1px solid ${theme.colors.neutral[200]}`,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.lg,
        position: 'relative',
        zIndex: 1,
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          width: 56,
          height: 56,
          borderRadius: theme.borderRadius.full,
          background: `linear-gradient(135deg, ${theme.colors.primary.light} 0%, ${theme.colors.primary.main} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          boxShadow: theme.shadows.md
        }}>
          🌲
        </div>
        <div>
          <h3 style={{ 
            margin: 0, 
            fontSize: theme.typography.h3,
            color: theme.colors.text.primary,
            fontWeight: 600,
            letterSpacing: '-0.02em'
          }}>
            Kindred Keeper
          </h3>
          <p style={{ 
            margin: '4px 0 0', 
            fontSize: theme.typography.small,
            color: theme.colors.text.muted,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.xs
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: theme.colors.accent.sage,
              display: 'inline-block'
            }} />
            Here for {userData?.name || 'you'} • always
          </p>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: theme.spacing.sm }}>
          <div className="gentle-float" style={{
            padding: theme.spacing.sm,
            background: `${theme.colors.accent.sage}40`,
            borderRadius: theme.borderRadius.full,
            color: theme.colors.text.secondary,
            fontSize: theme.typography.small
          }}>
            🌱 {lastMoodData?.emotion || 'calm'}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: theme.spacing.xl,
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.lg,
        background: theme.colors.background.main,
        position: 'relative',
        zIndex: 1
      }}>
        <AnimatePresence>
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg.text}
              sender={msg.sender}
              timestamp={msg.timestamp}
              emotion={msg.emotion}
              gratitudePrompt={msg.gratitudePrompt}
              kindnessChallenge={msg.kindnessChallenge}
            />
          ))}

          {showSuggestions && lastMoodData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                marginTop: theme.spacing.md,
                marginBottom: theme.spacing.md
              }}
            >
              <ActivitySuggestions
                moodData={lastMoodData}
                onClose={() => setShowSuggestions(false)}
                onActivitySelected={handleActivitySelected}
              />
            </motion.div>
          )}

          {/* Activity confirmation appears AFTER the activities */}
          {activityConfirmation && !showSuggestions && (
            <MessageBubble
              key={activityConfirmation.id}
              message={activityConfirmation.text}
              sender={activityConfirmation.sender}
              timestamp={activityConfirmation.timestamp}
              type={activityConfirmation.type}
            />
          )}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'flex',
                gap: theme.spacing.sm,
                padding: theme.spacing.lg,
                background: theme.colors.background.warm,
                borderRadius: theme.borderRadius.xl,
                width: 'fit-content',
                border: `1px solid ${theme.colors.neutral[200]}`,
                alignSelf: 'flex-start'
              }}
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: theme.colors.accent.sage,
                    opacity: 0.6
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Hidden when popup is open */}
      {!isPopupOpen && (
        <div style={{
          padding: `${theme.spacing.md} ${theme.spacing.xl}`,
          background: theme.colors.background.paper,
          borderTop: `1px solid ${theme.colors.neutral[200]}`,
          display: 'flex',
          gap: theme.spacing.md,
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
          backdropFilter: 'blur(10px)',
          minHeight: '70px'
        }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`How are you feeling, ${userData?.name || 'friend'}?`}
              style={{
                width: '100%',
                padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                borderRadius: theme.borderRadius.xl,
                border: `1px solid ${theme.colors.neutral[300]}`,
                background: theme.colors.neutral[50],
                fontSize: theme.typography.body,
                outline: 'none',
                transition: 'all 0.2s',
                color: theme.colors.text.primary,
                height: '44px'
              }}
              onFocus={(e) => e.target.style.borderColor = theme.colors.accent.sage}
              onBlur={(e) => e.target.style.borderColor = theme.colors.neutral[300]}
            />
            <Sparkles 
              size={18} 
              color={theme.colors.text.muted}
              style={{
                position: 'absolute',
                right: theme.spacing.md,
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!input.trim()}
            style={{
              padding: theme.spacing.sm,
              borderRadius: theme.borderRadius.full,
              border: 'none',
              background: !input.trim() 
                ? theme.colors.neutral[300] 
                : `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.primary.dark} 100%)`,
              color: 'white',
              cursor: !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              boxShadow: !input.trim() ? 'none' : theme.shadows.md,
              transition: 'all 0.2s'
            }}
          >
            <Send size={18} />
          </motion.button>
        </div>
      )}

      {/* Forest corner decoration */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: '150px',
        height: '150px',
        background: `radial-gradient(circle at 100% 100%, ${theme.colors.primary.light}30 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 0,
        borderRadius: '100% 0 0 0'
      }} />
    </div>
  );
}

export default ChatBox;