// components/PublicQRPage.js
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { forestCabinTheme as theme } from '../styles/forestCabinTheme';
import { userTracking } from '../services/userTracking';
import { Heart } from 'lucide-react';

function PublicQRPage() {
  const appUrl = "https://happiness-frontend.vercel.app";

  useEffect(() => {
    // Generate user ID and track this visit
    const userId = userTracking.getUserId();
    userTracking.trackSession('qr_scan_visit');
    
    // Store a flag that this came from QR code
    localStorage.setItem('cameFromQR', 'true');
    
    // Optional: Track as new signup
    userTracking.trackUserSignup({
      userId: userId,
      source: 'qr_code_scan'
    });
  }, []);

  const handleOpenApp = () => {
    // Redirect to main app
    window.location.href = appUrl;
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${theme.colors.primary.dark} 0%, ${theme.colors.secondary.dark} 100%)`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          background: theme.colors.background.paper,
          borderRadius: theme.borderRadius['2xl'],
          padding: theme.spacing['2xl'],
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          boxShadow: theme.shadows.xl,
          border: `1px solid ${theme.colors.accent.terracotta}30`
        }}
      >
        <div style={{ fontSize: '64px', marginBottom: theme.spacing.lg }}>
          🌳
        </div>

        <h1 style={{
          fontSize: theme.typography.h1,
          color: theme.colors.text.primary,
          marginBottom: theme.spacing.md
        }}>
          Welcome to Ivy Insight
        </h1>

        <p style={{
          fontSize: theme.typography.body,
          color: theme.colors.text.secondary,
          marginBottom: theme.spacing.xl,
          lineHeight: 1.6
        }}>
          Your gentle guide through life's forest. Tap below to begin your journey.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpenApp}
          style={{
            padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
            background: `linear-gradient(135deg, ${theme.colors.accent.terracotta}, ${theme.colors.accent.peach})`,
            border: 'none',
            borderRadius: theme.borderRadius.full,
            color: 'white',
            fontSize: theme.typography.h4,
            fontWeight: 600,
            cursor: 'pointer',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: theme.spacing.sm,
            marginBottom: theme.spacing.lg
          }}
        >
          <Heart size={24} />
          Open App
        </motion.button>

        <p style={{
          fontSize: theme.typography.tiny,
          color: theme.colors.text.muted
        }}>
          By continuing, you agree to create a profile to enhance your experience
        </p>
      </motion.div>
    </div>
  );
}

export default PublicQRPage;