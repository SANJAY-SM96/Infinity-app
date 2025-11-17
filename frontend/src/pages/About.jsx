import React, { useEffect, useState, useMemo } from 'react';
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
import { useSEO } from '../hooks/useSEO';
import { commonClasses, getPageLayoutClasses, animationVariants, cn } from '../utils/designSystem';
import PageLayout from '../components/PageLayout';

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

  // SEO metadata
  const seoData = useMemo(() => {
    const baseUrl = 'https://infinitywebtechnology.com';
    return {
      title: 'About Us | Infinity IT Project Marketplace | India\'s Leading IT Project Platform',
      description: 'Learn about Infinity - India\'s leading IT project marketplace. We connect students with custom project solutions and provide ready-made IT projects for customers. Serving 10K+ customers with 500+ projects.',
      keywords: 'about infinity, IT project marketplace, IT projects India, buy IT projects, custom IT projects, college projects, final year projects',
      image: 'https://infinitywebtechnology.com/og-image.jpg',
      url: `${baseUrl}/about`,
      type: 'website',
      breadcrumbs: [
        { name: 'Home', url: baseUrl },
        { name: 'About', url: `${baseUrl}/about` }
      ],
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: 'About Infinity IT Project Marketplace',
        description: 'Learn about Infinity - India\'s leading IT project marketplace connecting students and customers.',
        url: `${baseUrl}/about`,
        mainEntity: {
          '@type': 'Organization',
          name: 'Infinity Web Technology',
          url: baseUrl,
          description: 'India\'s leading IT project marketplace offering 500+ ready-made projects',
          email: 'infinitywebtechnology1@gmail.com',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'IN'
          }
        }
      }
    };
  }, []);

  useSEO(seoData);

  const layoutClasses = getPageLayoutClasses(isDark);

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
    <PageLayout
      title="About Infinity"
      subtitle="Your trusted marketplace for IT projects. We connect students with custom project solutions and provide ready-made IT projects for customers across India."
    >
      {/* Stats Section */}
      <motion.section 
        className={commonClasses.section}
        variants={animationVariants.staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className={commonClasses.container}>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  variants={animationVariants.staggerItem}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className={cn(commonClasses.cardHover(isDark), 'text-center')}
                >
                  <Icon className={cn(`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${stat.color} mx-auto mb-3 sm:mb-4`)} />
                  <div className={cn('text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-1 sm:mb-2', commonClasses.textBody(isDark))}>{stat.value}</div>
                  <div className={cn('text-xs sm:text-sm font-medium', commonClasses.textMuted(isDark))}>
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Values Section */}
      <motion.section 
        className={commonClasses.section}
        variants={animationVariants.staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className={commonClasses.container}>
          <motion.div
            variants={animationVariants.fadeIn}
            className="text-center mb-10 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 sm:mb-4 px-2">
              <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Our Values
              </span>
            </h2>
            <p className={`text-base sm:text-lg md:text-xl px-4 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              What drives us every day
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
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
                  className={cn(commonClasses.cardHover(isDark), 'p-6 sm:p-8')}
                >
                  <div className={cn(`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${value.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6 shadow-lg`)}>
                      <Icon className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </div>
                  <h3 className={cn(commonClasses.heading3(isDark), 'text-xl sm:text-2xl mb-3 sm:mb-4')}>{value.title}</h3>
                  <p className={cn('text-sm sm:text-base leading-relaxed', commonClasses.textBody(isDark))}>
                    {value.title === 'Our Mission' ? (
                      <>To bridge the gap between <strong>students needing custom IT projects</strong> and <strong>customers looking for ready-made solutions</strong>. We provide <em>quality, affordable IT projects</em> for <strong>college students and professionals</strong>.</>
                    ) : value.title === 'Innovation' ? (
                      <>We stay ahead with the <strong>latest technologies</strong> - <em>React, Python, AI/ML, Full-Stack development</em>, and more. Every project is built with <strong>modern best practices</strong>.</>
                    ) : value.title === 'Quality Assurance' ? (
                      <>All projects undergo <strong>rigorous quality checks</strong>. We ensure <em>clean code, proper documentation</em>, and <strong>complete functionality</strong> before delivery.</>
                    ) : value.title === 'Accessibility' ? (
                      <>We serve <strong>customers across India</strong> with projects priced in <em>Indian Rupees</em>. <strong>Easy payment options</strong> and <em>instant downloads</em> make it convenient for everyone.</>
                    ) : (
                      value.description
                    )}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Story Section */}
      <motion.section 
        className={commonClasses.section}
        variants={animationVariants.fadeIn}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className={commonClasses.containerSmall}>
          <motion.div
            variants={animationVariants.slideUp}
            className={commonClasses.card(isDark)}
          >
            <h2 className={cn(commonClasses.heading2(isDark), 'text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6')}>
              <span className={commonClasses.gradientText}>
                Our Story
              </span>
            </h2>
            <div className={cn('space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg leading-relaxed', commonClasses.textBody(isDark))}>
              <p>
                <strong>Infinity</strong> was born from a simple idea: making <em>quality IT projects</em> accessible to everyone. 
                We noticed that <strong>college students</strong> often struggle to find <em>custom projects</em> for their coursework, 
                while <strong>professionals and businesses</strong> need <em>ready-made solutions</em> quickly.
              </p>
              <p>
                Today, we're <strong>India's leading IT project marketplace</strong>, serving <em>thousands of students and customers</em>. 
                We specialize in <strong>React, Python, AI/ML, Full-Stack web applications</strong>, and more. Every project 
                is carefully <em>crafted, tested, and delivered</em> with <strong>complete source code and documentation</strong>.
              </p>
              <p>
                Our commitment is simple: provide the <strong>best IT projects</strong> at <em>affordable prices</em>, all in <strong>Indian Rupees</strong>, 
                with <em>instant downloads</em> and <strong>excellent customer support</strong>.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </PageLayout>
  );
}

