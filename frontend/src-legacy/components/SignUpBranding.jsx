import React from 'react';
import { motion } from 'framer-motion';
import { FiCode, FiDownload, FiShield, FiTrendingUp } from 'react-icons/fi';
import LiquidFogCard from './ui/LiquidFogCard';

export default function SignUpBranding({ isDark }) {
  const features = [
    {
      icon: FiCode,
      title: '500+ Verified Projects',
      desc: 'Premium source code for every need'
    },
    {
      icon: FiDownload,
      title: 'Instant Access',
      desc: 'Download immediately after purchase'
    },
    {
      icon: FiTrendingUp,
      title: 'Sell & Earn',
      desc: 'Turn your code into passive income'
    },
    {
      icon: FiShield,
      title: 'Secure Platform',
      desc: 'Protected payments and verified user'
    }
  ];

  return (
    <LiquidFogCard className="h-full w-full flex flex-col justify-center p-12 lg:p-16 xl:p-20">
      <div className="max-w-lg mx-auto">
        {/* Logo/Brand */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-xl">
              <img
                src="/player.svg"
                alt="Infinity Logo"
                className="w-9 h-9"
              />
            </div>
            <h1 className="text-5xl font-bold text-white tracking-tight">
              INFINITY
            </h1>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Your Gateway to <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-purple-200">
              Premium Code
            </span>
          </h2>
          <p className="text-lg text-blue-100/80 leading-relaxed">
            Join the community of developers and students. Buy, sell, and learn from high-quality IT projects.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="flex items-start gap-4 group"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-200 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-blue-100/60 text-sm">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </LiquidFogCard>
  );
}

