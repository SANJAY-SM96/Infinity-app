import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { COLORS } from '../../utils/constants';
import Particles from './Particles';

export default function AuthLayout({ children, title, subtitle }) {
    const { isDark } = useTheme();

    // Match navbar background colors - same as navbar
    const bgColor = isDark ? 'rgb(18, 26, 41)' : 'rgba(249, 250, 251, 0.95)';

    // Theme-aware particle colors
    const particleColors = isDark 
        ? [COLORS.primary, COLORS.primaryLight, COLORS.accent]
        : [COLORS.primary, COLORS.accent, COLORS.accentLight];

    return (
        <div 
            className="min-h-screen flex relative overflow-hidden transition-colors duration-300"
            style={{
                backgroundColor: bgColor
            }}
        >
            {/* Particle Background */}
            <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
                <Particles
                    particleColors={particleColors}
                    particleCount={200}
                    particleSpread={10}
                    speed={0.1}
                    particleBaseSize={100}
                    moveParticlesOnHover={true}
                    alphaParticles={false}
                    disableRotation={false}
                    interactiveColor={true}
                    hoverColor={COLORS.accent}
                />
            </div>

            {/* Form Content - Centered */}
            <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative z-10">
                <div className="w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-full"
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

