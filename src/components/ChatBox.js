// components/ChatBox.js
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble.js";
import ActivitySuggestions from "./ActivitySuggester.js";
import { sendMoodMessage } from "../services/api.js";
import { forestCabinTheme } from "../styles/forestCabinTheme.js";
import { 
  Send, 
  Sparkles, 
  Heart, 
  Phone, 
  MessageCircle, 
  ExternalLink, 
  X 
} from 'lucide-react';

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
  const [showHelpPopup, setShowHelpPopup] = useState(false); // 👈 ADD THIS
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const theme = forestCabinTheme; // 👈 ADD THIS

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

  useEffect(() => {
    scrollToBottom();
    inputRef.current?.focus();
  }, [messages]);

  useEffect(() => {
    const handleNewBotMessage = (event) => {
      addMessage(event.detail, 'bot');
    };

    const pendingMessage = localStorage.getItem('pendingBotMessage');
    if (pendingMessage) {
      addMessage(pendingMessage, 'bot');
      localStorage.removeItem('pendingBotMessage');
    }

    window.addEventListener('newBotMessage', handleNewBotMessage);
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
      
      setTimeout(() => {
        const activityPrompt = {
          id: Date.now() + 2,
          sender: "bot",
          text: "Let's try some activities which might help with how you're feeling. 🌱",
          timestamp: new Date(),
          type: "activity-prompt"
        };
        setMessages(prev => [...prev, activityPrompt]);
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
      {/* Header */}
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
        
        <div style={{ flex: 1 }}>
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

        {/* Support Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowHelpPopup(true)}
          style={{
            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
            background: `linear-gradient(135deg, ${theme.colors.accent.terracotta}, ${theme.colors.accent.peach})`,
            border: 'none',
            borderRadius: theme.borderRadius.full,
            color: 'white',
            fontSize: theme.typography.small,
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: theme.shadows.sm,
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing.xs,
            marginRight: theme.spacing.sm
          }}
        >
          <Heart size={14} />
          Need Support?
        </motion.button>

        {/* Context Tag */}
        <div className="gentle-float" style={{
          padding: theme.spacing.sm,
          background: `${theme.colors.accent.sage}40`,
          borderRadius: theme.borderRadius.full,
          color: theme.colors.text.secondary,
          fontSize: theme.typography.small,
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.xs
        }}>
          🌱 {lastMoodData?.emotion || 'calm'}
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
          {showSuggestions && lastMoodData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{
                marginTop: theme.spacing.md,
                marginBottom: theme.spacing.md,
                order: -1,
                position: 'relative',
                zIndex: 10
              }}
            >
              <ActivitySuggestions
                moodData={lastMoodData}
                onClose={() => {}}
                onActivitySelected={handleActivitySelected}
                onAddBotMessage={addMessage}
              />
            </motion.div>
          )}

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

      {/* Input Area */}
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

      {/* Help Popup */}
      <AnimatePresence>
        {showHelpPopup && (
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
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999
            }}
            onClick={() => setShowHelpPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: theme.colors.background.paper,
                borderRadius: theme.borderRadius['2xl'],
                padding: theme.spacing['2xl'],
                maxWidth: '500px',
                width: '90%',
                position: 'relative',
                boxShadow: theme.shadows.xl,
                border: `1px solid ${theme.colors.accent.terracotta}30`
              }}
            >
              <button
                onClick={() => setShowHelpPopup(false)}
                style={{
                  position: 'absolute',
                  top: theme.spacing.md,
                  right: theme.spacing.md,
                  background: theme.colors.neutral[100],
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: theme.colors.neutral[500]
                }}
              >
                <X size={18} />
              </button>

              <div style={{ fontSize: '48px', textAlign: 'center', marginBottom: theme.spacing.md }}>
                🫂
              </div>

              <h3 style={{
                fontSize: theme.typography.h3,
                color: theme.colors.text.primary,
                marginBottom: theme.spacing.lg,
                textAlign: 'center'
              }}>
                You're Not Alone
              </h3>

              {/* Helpline Section */}
              <div style={{
                background: `${theme.colors.accent.sage}15`,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.lg,
                marginBottom: theme.spacing.lg
              }}>
                <h4 style={{
                  fontSize: theme.typography.h4,
                  color: theme.colors.accent.sage,
                  marginBottom: theme.spacing.sm,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm
                }}>
                  <Phone size={20} />
                  Mental Health Helplines
                </h4>
                <p style={{ marginBottom: theme.spacing.sm }}>
                  <strong>🇮🇳 Tele-MANAS:</strong> <a href="tel:14416" style={{ color: theme.colors.accent.terracotta, textDecoration: 'none' }}>14416</a> (24/7)
                </p>
                <p style={{ marginBottom: theme.spacing.sm }}>
                  <strong>🇮🇳 KIRAN Helpline:</strong> <a href="tel:18005990019" style={{ color: theme.colors.accent.terracotta, textDecoration: 'none' }}>1800-599-0019</a> (24/7)
                </p>
                <p>
                  <strong>🇮🇳 MANODARPAN:</strong> <a href="tel:8448440632" style={{ color: theme.colors.accent.terracotta, textDecoration: 'none' }}>8448440632</a> (Student Support)
                </p>
              </div>

              {/* Feedback Section */}
              <div style={{
                background: `${theme.colors.accent.peach}15`,
                borderRadius: theme.borderRadius.lg,
                padding: theme.spacing.lg,
                marginBottom: theme.spacing.lg
              }}>
                <h4 style={{
                  fontSize: theme.typography.h4,
                  color: theme.colors.accent.terracotta,
                  marginBottom: theme.spacing.sm,
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing.sm
                }}>
                  <MessageCircle size={20} />
                  Share Your Feedback
                </h4>
                <p style={{ marginBottom: theme.spacing.md }}>
                  Help us make this app better for everyone. Your feedback matters! 💖
                </p>
                <motion.a
                  href="https://docs.google.com/forms/d/e/1FAIpQLSdg2eyJJwZEw1UXLYTIH20cSestuHt4aGTLD9TkyJHAwXaIqg/viewform?usp=pp_url"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: theme.spacing.sm,
                    padding: `${theme.spacing.sm} ${theme.spacing.lg}`,
                    background: theme.colors.accent.terracotta,
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: theme.borderRadius.full,
                    fontSize: theme.typography.small,
                    fontWeight: 600
                  }}
                >
                  Open Feedback Form
                  <ExternalLink size={16} />
                </motion.a>
              </div>

              <p style={{
                fontSize: theme.typography.tiny,
                color: theme.colors.text.muted,
                textAlign: 'center',
                fontStyle: 'italic'
              }}>
                These services are free, confidential, and available 24/7
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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