import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  FiCode, 
  FiUsers, 
  FiTrendingUp, 
  FiAward,
  FiTarget,
  FiZap,
  FiShield,
  FiGlobe
} from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

export default function About() {
  const { isDark } = useTheme();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const bgClass = isDark 
    ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
    : 'bg-gradient-to-br from-white via-blue-50 to-indigo-50';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const cardBg = isDark 
    ? 'bg-gray-800/50 backdrop-blur-xl border-gray-700' 
    : 'bg-white/80 backdrop-blur-xl border-gray-200';

  const stats = [
    { icon: FiCode, value: '500+', label: 'IT Projects Available', color: 'text-blue-400' },
    { icon: FiUsers, value: '10K+', label: 'Happy Customers', color: 'text-green-400' },
    { icon: FiTrendingUp, value: '2K+', label: 'Student Requests', color: 'text-yellow-400' },
    { icon: FiAward, value: '4.9/5', label: 'Customer Rating', color: 'text-pink-400' },
  ];

  const values = [
    {
      icon: FiTarget,
      title: 'Our Mission',
      description: 'To bridge the gap between students needing custom IT projects and customers looking for ready-made solutions. We provide quality, affordable IT projects for college students and professionals.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: FiZap,
      title: 'Innovation',
      description: 'We stay ahead with the latest technologies - React, Python, AI/ML, Full-Stack development, and more. Every project is built with modern best practices.',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: FiShield,
      title: 'Quality Assurance',
      description: 'All projects undergo rigorous quality checks. We ensure clean code, proper documentation, and complete functionality before delivery.',
      gradient: 'from-green-500 to-teal-500'
    },
    {
      icon: FiGlobe,
      title: 'Accessibility',
      description: 'We serve customers across India with projects priced in Indian Rupees. Easy payment options and instant downloads make it convenient for everyone.',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <div className={`min-h-screen ${bgClass} ${textClass} overflow-hidden relative`}>
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: mousePosition.x * 0.01,
            y: mousePosition.y * 0.01,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: mousePosition.x * -0.01,
            y: mousePosition.y * -0.01,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
        <motion.div
          className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{
            x: mousePosition.x * 0.015,
            y: mousePosition.y * 0.015,
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 py-20">
        <motion.div
          style={{ y: heroY }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold mb-6"
          >
            <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              About Infinity
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-xl sm:text-2xl ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-12 leading-relaxed`}
          >
            Your trusted marketplace for IT projects. We connect students with custom project solutions 
            and provide ready-made IT projects for customers across India.
          </motion.p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className={`${cardBg} border rounded-2xl p-6 text-center`}
                >
                  <Icon className={`w-8 h-8 ${stat.color} mx-auto mb-4`} />
                  <div className="text-3xl md:text-4xl font-extrabold mb-2">{stat.value}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} font-medium`}>
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Our Values
              </span>
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              What drives us every day
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`${cardBg} border rounded-3xl p-8`}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${value.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${cardBg} border rounded-3xl p-8 md:p-12`}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Our Story
              </span>
            </h2>
            <div className={`space-y-4 text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'} leading-relaxed`}>
              <p>
                Infinity was born from a simple idea: making quality IT projects accessible to everyone. 
                We noticed that college students often struggle to find custom projects for their coursework, 
                while professionals and businesses need ready-made solutions quickly.
              </p>
              <p>
                Today, we're India's leading IT project marketplace, serving thousands of students and customers. 
                We specialize in React, Python, AI/ML, Full-Stack web applications, and more. Every project 
                is carefully crafted, tested, and delivered with complete source code and documentation.
              </p>
              <p>
                Our commitment is simple: provide the best IT projects at affordable prices, all in Indian Rupees, 
                with instant downloads and excellent customer support.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

