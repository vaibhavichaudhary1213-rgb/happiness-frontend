// components/MessageBubble.js
import React from "react";
import { motion } from "framer-motion";
import { forestCabinTheme as theme } from "../styles/forestCabinTheme.js";
import { Sparkles, Heart } from 'lucide-react';

function MessageBubble({ 
  message, 
  sender, 
  timestamp, 
  emotion, 
  gratitudePrompt, 
  kindnessChallenge
}) {
  const isUser = sender === "user";

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      happy: theme.colors.accent.sage || '#1A3A3A',
      sad: theme.colors.accent.lavender || '#2A254A',
      anxious: theme.colors.accent.softLavender || '#3A2A5A',
      angry: theme.colors.accent.terracotta || '#B88A7A',
      calm: theme.colors.primary.main || '#1A3A3A',
      excited: theme.colors.accent.honey || '#D8C0A0',
      grateful: theme.colors.accent.sage || '#1A3A3A',
      loved: theme.colors.accent.lavender || '#2A254A'
    };
    return colors[emotion?.toLowerCase()] || theme.colors.neutral[400];
  };

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      happy: "😊",
      sad: "💭",
      anxious: "🌿",
      angry: "🌸",
      calm: "✨",
      excited: "🌟",
      grateful: "🙏",
      loved: "💖"
    };
    return emojis[emotion?.toLowerCase()] || "💫";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: theme.spacing.md,
        width: '100%'
      }}
    >
      {/* Sender Info */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.xs,
        marginBottom: theme.spacing.xs,
        marginLeft: isUser ? 0 : theme.spacing.sm,
        marginRight: isUser ? theme.spacing.sm : 0
      }}>
        {!isUser && (
          <div style={{
            width: 24,
            height: 24,
            borderRadius: theme.borderRadius.full,
            background: `linear-gradient(135deg, ${theme.colors.primary.main} 0%, ${theme.colors.secondary.main} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px'
          }}>
            🌙
          </div>
        )}
        <span style={{
          fontSize: theme.typography.tiny,
          color: theme.colors.text.secondary,
          fontWeight: 500
        }}>
          {isUser ? 'You' : 'Ivy Insight'}
          {emotion && !isUser && (
            <span style={{
              marginLeft: theme.spacing.xs,
              color: getEmotionColor(emotion),
              background: `${getEmotionColor(emotion)}30`,
              padding: '2px 8px',
              borderRadius: theme.borderRadius.full,
              fontSize: theme.typography.tiny,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {getEmotionEmoji(emotion)} {emotion}
            </span>
          )}
        </span>
      </div>

      {/* Message Bubble */}
      <div style={{
        maxWidth: '70%',
        minWidth: 100,
        position: 'relative'
      }}>
        <motion.div
          whileHover={{ scale: 1.01 }}
          style={{
            background: isUser 
              ? theme.colors.secondary.main  // Dark lavender for user messages
              : theme.colors.primary.main,    // Deep forest for bot messages
            color: '#FFFFFF',  // Force white text
            padding: theme.spacing.lg,
            borderRadius: isUser 
              ? `${theme.borderRadius.xl} ${theme.borderRadius.xl} ${theme.borderRadius.sm} ${theme.borderRadius.xl}`
              : `${theme.borderRadius.xl} ${theme.borderRadius.xl} ${theme.borderRadius.xl} ${theme.borderRadius.sm}`,
            boxShadow: theme.shadows.md,
            border: `1px solid ${isUser ? theme.colors.secondary.light : theme.colors.primary.light}40`,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Decorative corner for bot messages */}
          {!isUser && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '30px',
              height: '30px',
              background: `radial-gradient(circle at 0 0, ${theme.colors.accent.lavender}30 0%, transparent 70%)`,
              borderRadius: `${theme.borderRadius.xl} 0 0 0`,
              pointerEvents: 'none'
            }} />
          )}

          {/* Main Message */}
          <p style={{ 
            margin: 0, 
            lineHeight: 1.6, 
            fontSize: theme.typography.body,
            color: '#FFFFFF',
            fontWeight: 400,
            position: 'relative',
            zIndex: 1,
            textShadow: '0 1px 2px rgba(0,0,0,0.2)'
          }}>
            {message}
          </p>

          {/* Gratitude Prompt */}
          {gratitudePrompt && !isUser && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                marginTop: theme.spacing.md,
                padding: theme.spacing.md,
                background: `${theme.colors.accent.sage}30`,
                borderRadius: theme.borderRadius.lg,
                border: `1px solid ${theme.colors.accent.sage}40`,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm
              }}
            >
              <Sparkles size={16} color="#FFFFFF" />
              <p style={{ 
                margin: 0, 
                fontSize: theme.typography.small,
                color: '#FFFFFF',
                fontStyle: 'italic'
              }}>
                {gratitudePrompt}
              </p>
            </motion.div>
          )}

          {/* Kindness Challenge */}
          {kindnessChallenge && !isUser && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                marginTop: theme.spacing.sm,
                padding: theme.spacing.md,
                background: `${theme.colors.accent.lavender}30`,
                borderRadius: theme.borderRadius.lg,
                border: `1px solid ${theme.colors.accent.lavender}40`,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing.sm
              }}
            >
              <Heart size={16} color="#FFFFFF" />
              <p style={{ 
                margin: 0, 
                fontSize: theme.typography.small,
                color: '#FFFFFF',
                fontStyle: 'italic'
              }}>
                {kindnessChallenge}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Timestamp */}
        <div style={{
          fontSize: theme.typography.tiny,
          color: theme.colors.text.secondary,
          marginTop: theme.spacing.xs,
          marginLeft: isUser ? 0 : theme.spacing.sm,
          marginRight: isUser ? theme.spacing.sm : 0,
          textAlign: isUser ? 'right' : 'left'
        }}>
          {formatTime(timestamp)}
        </div>
      </div>
    </motion.div>
  );
}

export default MessageBubble;