import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ThreeDCard({ children, isDark, className = '' }) {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const maxRotate = 15;
    setRotateX((mouseY / rect.height) * -maxRotate);
    setRotateY((mouseX / rect.width) * maxRotate);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        transformStyle: 'preserve-3d',
      }}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
    >
      <motion.div
        className="relative w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glow effect */}
        <motion.div
          className={`absolute -inset-1 rounded-3xl transition-opacity duration-300 ${
            isDark 
              ? 'bg-gradient-to-r from-purple-500 via-purple-400 to-indigo-500' 
              : 'bg-gradient-to-r from-purple-400 via-purple-300 to-indigo-400'
          }`}
          animate={{
            opacity: isHovered ? 0.4 : 0.2,
          }}
        />
        
        {/* Card content */}
        <div className="relative">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

