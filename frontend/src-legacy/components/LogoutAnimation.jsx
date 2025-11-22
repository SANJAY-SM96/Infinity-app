import React from 'react';
import { motion } from 'framer-motion';
import { FiLogOut } from 'react-icons/fi';

const LogoutAnimation = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/80 dark:bg-slate-900/90 backdrop-blur-sm"
        >
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    {/* Ripple effects */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 1.5, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
                        className="absolute inset-0 rounded-full bg-red-500/20"
                    />
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0.5 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
                        className="absolute inset-0 rounded-full bg-red-500/10"
                    />

                    {/* Icon container */}
                    <motion.div
                        initial={{ scale: 0.5, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-xl shadow-red-500/20"
                    >
                        <FiLogOut className="w-10 h-10 text-white" />
                    </motion.div>
                </div>

                <div className="text-center space-y-2">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold text-slate-900 dark:text-white"
                    >
                        Signing Out
                    </motion.h2>
                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-slate-500 dark:text-slate-400"
                    >
                        See you soon!
                    </motion.p>
                </div>

                {/* Loading dots */}
                <div className="flex gap-2 mt-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                                repeat: Infinity,
                                repeatType: "reverse",
                                duration: 0.6,
                                delay: i * 0.2
                            }}
                            className="w-2.5 h-2.5 rounded-full bg-red-500"
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default LogoutAnimation;
