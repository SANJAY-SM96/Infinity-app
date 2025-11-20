import React from 'react';
import { motion } from 'framer-motion';
import { 
  FiSun, 
  FiCpu, 
  FiZap, 
  FiLayers,
  FiDatabase,
  FiTrendingUp
} from 'react-icons/fi';

// Default orbit configuration
const defaultOrbits = [
  {
    id: 1,
    radiusFactor: 0.25,
    speed: 10,
    icon: <FiTrendingUp className="text-blue-400" size={24} />,
    iconSize: 24,
    orbitColor: 'rgba(59, 130, 246, 0.3)',
    orbitThickness: 2,
  },
  {
    id: 2,
    radiusFactor: 0.4,
    speed: 14,
    icon: <FiLayers className="text-green-400" size={24} />,
    iconSize: 24,
    orbitColor: 'rgba(34, 197, 94, 0.3)',
    orbitThickness: 2,
  },
  {
    id: 3,
    radiusFactor: 0.55,
    speed: 18,
    icon: <FiCpu className="text-purple-400" size={24} />,
    iconSize: 24,
    orbitColor: 'rgba(168, 85, 247, 0.3)',
    orbitThickness: 2,
  },
  {
    id: 4,
    radiusFactor: 0.7,
    speed: 22,
    icon: <FiZap className="text-yellow-400" size={24} />,
    iconSize: 24,
    orbitColor: 'rgba(234, 179, 8, 0.3)',
    orbitThickness: 2,
  },
];

/**
 * BeamCircle Component
 * Animated component that renders multiple orbiting icons around a central element
 * 
 * @param {number} size - The overall diameter of the circular animation area
 * @param {React.ReactNode} centerIcon - The central icon or React node
 * @param {Array} orbits - Array of orbit configuration objects
 */
export function BeamCircle({ 
  size = 300, 
  centerIcon = null,
  orbits = defaultOrbits 
}) {
  const centerSize = size * 0.15;
  const centerX = size / 2;
  const centerY = size / 2;

  return (
    <div 
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Render orbit circles and icons */}
      {orbits.map((orbit) => {
        const radius = (size / 2) * orbit.radiusFactor;
        const orbitThickness = orbit.orbitThickness || 2;
        const orbitColor = orbit.orbitColor || 'rgba(0, 0, 0, 0.1)';

        return (
          <div key={orbit.id} className="absolute inset-0">
            {/* Orbit circle */}
            <svg
              className="absolute inset-0"
              style={{ width: size, height: size }}
            >
              <circle
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke={orbitColor}
                strokeWidth={orbitThickness}
                strokeDasharray="5,5"
                className="opacity-50"
              />
            </svg>

            {/* Orbiting icon container */}
            <motion.div
              className="absolute"
              style={{
                width: radius * 2,
                height: radius * 2,
                left: centerX - radius,
                top: centerY - radius,
                transformOrigin: 'center center',
              }}
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: orbit.speed || 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <div
                className="absolute"
                style={{
                  width: orbit.iconSize || 24,
                  height: orbit.iconSize || 24,
                  left: radius - (orbit.iconSize || 24) / 2,
                  top: -(orbit.iconSize || 24) / 2,
                }}
              >
                {orbit.icon}
              </div>
            </motion.div>
          </div>
        );
      })}

      {/* Central icon */}
      {centerIcon && (
        <motion.div
          className="absolute flex items-center justify-center z-10"
          style={{
            width: centerSize,
            height: centerSize,
            left: centerX - centerSize / 2,
            top: centerY - centerSize / 2,
          }}
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: {
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            },
            scale: {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          {centerIcon}
        </motion.div>
      )}
    </div>
  );
}

export default BeamCircle;

