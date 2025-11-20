import React from 'react';
import { motion } from 'framer-motion';

export default function LiquidFogCard({ children, className = '' }) {
    return (
        <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
            {/* Fog Animation Container */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Layer 1: Deep Background Blobs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-purple-900/40 to-transparent blur-3xl"
                />

                {/* Layer 2: Moving Fog Clouds */}
                <motion.div
                    animate={{
                        x: ['-20%', '20%', '-20%'],
                        y: ['-10%', '10%', '-10%'],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-0 left-0 w-full h-full"
                >
                    <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
                    <div className="absolute bottom-[10%] right-[10%] w-[35vw] h-[35vw] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-1000" />
                    <div className="absolute top-[40%] left-[40%] w-[30vw] h-[30vw] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-2000" />
                </motion.div>

                {/* Layer 3: Surface Liquid Effect */}
                <div className="absolute inset-0 opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150 mix-blend-overlay" />

                {/* Glass Overlay for Depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
}
