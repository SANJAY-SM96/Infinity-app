import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedLayout({ children, containerClassName = '', contentClassName = '' }) {
  const blobVariants = {
    animate: {
      x: [0, 20, -20, 0],
      y: [0, -15, 10, 0],
      rotate: [0, 10, -8, 0],
      transition: { duration: 12, repeat: Infinity, ease: 'easeInOut' }
    }
  };

  const enterVariants = {
    hidden: { opacity: 0, y: 24, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  return (
    <div className={`relative min-h-screen overflow-hidden text-white ${containerClassName}`}>
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(1250px_circle_at_10%_10%,rgba(0,212,255,0.25),transparent_50%),radial-gradient(1250px_circle_at_90%_20%,rgba(255,0,110,0.25),transparent_50%),linear-gradient(120deg,#0b1220,#0b0f1a)]" />

      {/* Floating blurred blobs */}
      <motion.div
        variants={blobVariants}
        animate="animate"
        className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-cyan-500/30 blur-3xl"
      />
      <motion.div
        variants={blobVariants}
        animate="animate"
        className="pointer-events-none absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-pink-500/30 blur-3xl"
      />
      <motion.div
        variants={blobVariants}
        animate="animate"
        className="pointer-events-none absolute top-1/3 -right-10 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl"
      />

      {/* Subtle grid overlay */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Content wrapper */}
      <div className="relative z-10">
        <motion.div
          variants={enterVariants}
          initial="hidden"
          animate="show"
          className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 ${contentClassName}`}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
