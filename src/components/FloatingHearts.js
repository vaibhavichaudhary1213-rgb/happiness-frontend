// components/FloatingHearts.js
import React from "react";
import { motion } from "framer-motion";
import { theme } from "../styles/forestCabinTheme.js";

function FloatingHearts() {
  const cozyElements = ["🌸", "🌼", "✨", "🕯️", "📖", "☕", "🌿", "💫"];

  return (
    <div style={{
      position: "fixed",
      right: 30,
      bottom: 30,
      zIndex: 100,
      pointerEvents: "none"
    }}>
      {cozyElements.map((element, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            opacity: [0.3, 0.8, 0.3]
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
            filter: "drop-shadow(0 4px 8px rgba(166, 138, 120, 0.15))",
            opacity: 0.4
          }}
        >
          {element}
        </motion.div>
      ))}
    </div>
  );
}

export default FloatingHearts;