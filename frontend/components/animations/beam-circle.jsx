import React from "react";
import { motion } from "framer-motion";
import { FiCpu, FiZap, FiLayers, FiTrendingUp } from "react-icons/fi";

// ✅ Center icon EXACT same symbol
const CenterArrowIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#000000ff"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="7 8 12 3 17 8" />
    <polyline points="7 16 12 21 17 16" />
  </svg>
);

// ✅ orbit ring setup (matching image)
const defaultOrbits = [
  {
    id: 1,
    radiusFactor: 0.28,
    speed: 18,
    icon: <FiTrendingUp className="text-orange-400" size={26} />,
    iconSize: 26,
    orbitColor: "rgba(99,102,241,0.18)",
  },
  {
    id: 2,
    radiusFactor: 0.44,
    speed: 22,
    icon: <FiLayers className="text-green-400" size={26} />,
    iconSize: 26,
    orbitColor: "rgba(34,197,94,0.14)",
  },
  {
    id: 3,
    radiusFactor: 0.6,
    speed: 26,
    icon: <FiCpu className="text-purple-500" size={26} />,
    iconSize: 26,
    orbitColor: "rgba(168,85,247,0.14)",
  },
  {
    id: 4,
    radiusFactor: 0.78,
    speed: 30,
    icon: <FiZap className="text-yellow-400" size={26} />,
    iconSize: 26,
    orbitColor: "rgba(234,179,8,0.14)",
  },
];

export default function BeamCircle({ size = 420, centerIcon = (
  <img src="/devops.svg" alt="DevOps" style={{ width: '68%', height: '68%', objectFit: 'contain' }} />
), orbits = defaultOrbits }) {
  const centerX = size / 2;
  const centerY = size / 2;
  const centerSize = size * 0.22;

  return (
    <div className="relative flex items-center justify-center pointer-events-none" style={{ width: size, height: size }}>
      {/* Render dashed rings and rotating icons */}
      {orbits.map((orbit) => {
        const radius = (size / 2) * orbit.radiusFactor;

        return (
          <div key={orbit.id} className="absolute inset-0">
            <svg className="absolute inset-0" style={{ width: size, height: size }}>
              <circle
                cx={centerX}
                cy={centerY}
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
                left: centerX - radius,
                top: centerY - radius,
                transformOrigin: "center center",
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: orbit.speed, repeat: Infinity, ease: "linear" }}
            >
              <div
                className="absolute"
                style={{
                  top: -((orbit.iconSize || 26) / 2),
                  left: radius - (orbit.iconSize || 26) / 2,
                }}
              >
                {orbit.icon}
              </div>
            </motion.div>
          </div>
        );
      })}

      {/* soft halo behind center */}
      <div
        className="absolute rounded-full"
        style={{
          width: centerSize * 1.6,
          height: centerSize * 1.6,
          left: centerX - (centerSize * 1.6) / 2,
          top: centerY - (centerSize * 1.6) / 2,
          background: 'radial-gradient(circle, rgba(99,102,241,0.08), transparent)',
          filter: 'blur(10px)',
          zIndex: 0,
        }}
      />

      {/* Center bubble with transparent surface so SVG background shows through */}
      <div
        className="absolute flex items-center justify-center rounded-full"
        style={{
          width: centerSize,
          height: centerSize,
          left: centerX - centerSize / 2,
          top: centerY - centerSize / 2,
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '0 8px 24px rgba(15,23,42,0.08)',
          zIndex: 2,
        }}
      >
        {React.cloneElement(centerIcon, { style: { ...(centerIcon.props?.style || {}), background: 'transparent' } })}
      </div>

      {/* thin dashed ring around the center */}
      <svg
        className="absolute"
        style={{
          width: centerSize * 1.6,
          height: centerSize * 1.6,
          left: centerX - (centerSize * 1.6) / 2,
          top: centerY - (centerSize * 1.6) / 2,
          zIndex: 1,
        }}
      >
        <circle
          cx={(centerSize * 1.6) / 2}
          cy={(centerSize * 1.6) / 2}
          r={(centerSize * 1.6) / 2 - 6}
          fill="none"
          stroke="rgba(99,102,241,0.12)"
          strokeWidth={1.5}
          strokeDasharray="4,6"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
