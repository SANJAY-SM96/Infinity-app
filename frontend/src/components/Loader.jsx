import React from 'react';
import { motion } from 'framer-motion';

export default function Loader() {
  return (
    <motion.div
      className="flex items-center justify-center h-64"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="text-primary text-sm font-medium">Loading...</p>
      </div>
    </motion.div>
  );
}
