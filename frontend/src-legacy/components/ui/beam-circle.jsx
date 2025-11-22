import React from 'react';
import { motion } from 'framer-motion';
import { FiCpu, FiZap, FiLayers, FiTrendingUp } from 'react-icons/fi';

const defaultOrbits = [
  { id: 1, radiusFactor: 0.25, speed: 10, icon: <FiTrendingUp className="text-blue-400" size={24} />, iconSize: 24, orbitColor: 'rgba(59,130,246,0.18)' },
  { id: 2, radiusFactor: 0.4, speed: 14, icon: <FiLayers className="text-green-400" size={24} />, iconSize: 24, orbitColor: 'rgba(34,197,94,0.14)' },
  { id: 3, radiusFactor: 0.55, speed: 18, icon: <FiCpu className="text-purple-400" size={24} />, iconSize: 24, orbitColor: 'rgba(168,85,247,0.14)' },
  { id: 4, radiusFactor: 0.7, speed: 22, icon: <FiZap className="text-yellow-400" size={24} />, iconSize: 24, orbitColor: 'rgba(234,179,8,0.14)' },
];

export default function BeamCircle({ size = 300, centerIcon = (
  <img src="/devops.svg" alt="DevOps" style={{ width: '68%', height: '68%', objectFit: 'contain', background: 'transparent' }} />
), orbits = defaultOrbits }) {
  const centerSize = size * 0.15;
  const center = size / 2;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {orbits.map((orbit) => {
        const radius = (size / 2) * orbit.radiusFactor;
        return (
          <div key={orbit.id} className="absolute inset-0 pointer-events-none">
            <svg className="absolute inset-0" style={{ width: size, height: size }}>
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={orbit.orbitColor}
                strokeWidth={1.4}
                strokeDasharray="8,8"
                strokeLinecap="round"
              />
            </svg>

            <motion.div
              className="absolute"
              style={{
                width: radius * 2,
                height: radius * 2,
                left: center - radius,
                top: center - radius,
                transformOrigin: 'center center',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: orbit.speed || 12, repeat: Infinity, ease: 'linear' }}
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

      <div
        className="absolute flex items-center justify-center rounded-full"
        style={{
          width: centerSize,
          height: centerSize,
          left: center - centerSize / 2,
          top: center - centerSize / 2,
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
          zIndex: 2,
        }}
      >
        {React.isValidElement(centerIcon)
          ? React.cloneElement(centerIcon, { style: { ...(centerIcon.props?.style || {}), background: 'transparent' } })
          : centerIcon}
      </div>
    </div>
  );
}

