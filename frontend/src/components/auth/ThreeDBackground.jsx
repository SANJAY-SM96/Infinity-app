import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function ThreeDBackground({ isDark }) {
  const containerRef = useRef(null);

  // Floating geometric shapes
  const shapes = [
    { size: 80, x: 10, y: 20, delay: 0, duration: 8 },
    { size: 120, x: 80, y: 60, delay: 2, duration: 10 },
    { size: 60, x: 50, y: 80, delay: 4, duration: 7 },
    { size: 100, x: 20, y: 50, delay: 1, duration: 9 },
    { size: 90, x: 70, y: 30, delay: 3, duration: 11 },
  ];

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Animated gradient orbs */}
      <motion.div
        className={`absolute top-0 left-1/4 w-96 h-96 rounded-full ${
          isDark ? 'bg-blue-500/30' : 'bg-blue-400/40'
        }`}
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={`absolute bottom-0 right-1/4 w-96 h-96 rounded-full ${
          isDark ? 'bg-purple-500/30' : 'bg-purple-400/40'
        }`}
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full ${
          isDark ? 'bg-indigo-500/20' : 'bg-indigo-400/30'
        }`}
        animate={{
          rotate: [0, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Floating 3D geometric shapes */}
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${
            isDark 
              ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-400/30' 
              : 'bg-gradient-to-br from-blue-300/30 to-purple-300/30 border-blue-400/40'
          } border rounded-2xl`}
          style={{
            width: shape.size,
            height: shape.size,
            left: `${shape.x}%`,
            top: `${shape.y}%`,
            transform: 'perspective(1000px) rotateX(45deg) rotateY(45deg)',
          }}
          animate={{
            y: [0, -30, 0],
            rotateX: [45, 50, 45],
            rotateY: [45, 50, 45],
            rotateZ: [0, 10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Grid pattern overlay */}
      <div 
        className={`absolute inset-0 opacity-10 ${
          isDark ? 'bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:50px_50px]' : 'bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]'}
        `}
      />
    </div>
  );
}

