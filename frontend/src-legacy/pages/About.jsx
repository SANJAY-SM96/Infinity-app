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
      title: 'About Us | Infinity IT Project Marketplace | Ready-made & Custom IT Projects',
      description: 'Infinity connects students and customers across India with high-quality ready-made and custom IT projects. Discover our mission, services, quality guarantees, and how we help students publish projects and customers find reliable solutions quickly.',
      keywords: 'Infinity, IT project marketplace, ready-made IT projects, publish projects, college projects, final year projects, custom IT solutions, India IT projects, student projects',
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
        description: 'Infinity connects students and customers with ready-made and custom IT projects across India. We focus on quality, documentation, and excellent support.',
        url: `${baseUrl}/about`,
        mainEntity: {
          '@type': 'Organization',
          name: 'Infinity Web Technology',
          url: baseUrl,
          description: 'A trusted IT project marketplace offering hundreds of ready-made projects and a platform for students to publish their work.',
          email: 'infinitywebtechnology1@gmail.com',
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'IN'
          }
        },
        potentialAction: [
          {
            '@type': 'SearchAction',
            'target': `${baseUrl}/products?query={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        ]
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

  const faqs = [
    {
      q: 'What types of projects do you offer?',
      a: 'We offer a wide range of ready-made IT projects across React, Node.js, Python, AI/ML, Full-Stack applications, mobile apps, and more. Each project includes source code, setup instructions, and documentation.'
    },
    {
      q: 'Can students publish their own projects?',
      a: 'Yes — students can publish their projects on our platform to earn, share their work, and reach customers who need custom solutions.'
    },
    {
      q: 'How do I get support after purchase?',
      a: 'Every purchase includes support via email. We also provide optional paid support or customization services for complex requirements.'
    },
    {
      q: 'Is the code quality verified?',
      a: 'Yes — every project goes through quality checks including code review, documentation verification, and automated tests where applicable.'
    }
  ];

  const jsonLd = useMemo(() => {
    const org = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Infinity Web Technology',
      url: 'https://infinitywebtechnology.com',
      logo: 'https://infinitywebtechnology.com/og-image.jpg',
      contactPoint: [{
        '@type': 'ContactPoint',
        telephone: '+91-0000000000',
        contactType: 'customer service',
        areaServed: 'IN'
      }]
    };

    const faqEntities = faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.a
      }
    }));

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqEntities
    };

    return [org, faqSchema];
  }, [faqs]);

  return (
    <PageLayout
      title="About Infinity"
      subtitle="Your trusted marketplace for IT projects. We connect students with custom project solutions and provide ready-made IT projects for customers across India."
    >
      {/* Visible H1 for SEO */}
      <header className="mb-6">
        <h1 className={cn('text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2', commonClasses.textBody(isDark))}>
          About Infinity — India’s Trusted IT Project Marketplace
        </h1>
        <p className={cn('text-sm sm:text-base md:text-lg', commonClasses.textMuted(isDark))}>
          We help students publish projects and customers find reliable, ready-made and custom IT solutions quickly.
        </p>
      </header>

      {/* JSON-LD for Organization + FAQPage to boost SEO/rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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

      {/* Services & How It Works */}
      <motion.section 
        className={commonClasses.section}
        variants={animationVariants.staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className={commonClasses.containerSmall}>
          <motion.div variants={animationVariants.fadeIn} className={commonClasses.card(isDark)}>
            <h2 className={cn(commonClasses.heading2(isDark), 'text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6')}>
              <span className={commonClasses.gradientText}>What We Offer</span>
            </h2>
            <div className={cn('space-y-4 text-sm sm:text-base md:text-lg leading-relaxed', commonClasses.textBody(isDark))}>
              <p>
                Infinity provides both <strong>ready-made</strong> and <strong>custom</strong> IT projects. Browse our curated catalog for instant downloads or request a custom project tailored to your specifications.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Ready-made projects with complete source code & documentation</li>
                <li>Custom project requests and student-led development</li>
                <li>Optional customization, deployment, and support</li>
                <li>Secure payment options and fast delivery</li>
              </ul>
            </div>
          </motion.div>

          <motion.div variants={animationVariants.slideUp} className={cn(commonClasses.card(isDark), 'mt-6')}>
            <h3 className={cn(commonClasses.heading3(isDark), 'text-xl sm:text-2xl mb-3')}>How It Works — Simple, Transparent, Fast</h3>
            <ol className="list-decimal pl-5 space-y-3 text-sm sm:text-base md:text-base leading-relaxed">
              <li><strong>Browse</strong> the catalog and choose a ready-made project or post a custom request.</li>
              <li><strong>Purchase or Request</strong> — pay securely and receive the project files instantly or get matched with a student developer.</li>
              <li><strong>Download & Run</strong> — each project includes setup instructions, dependencies, and documentation.</li>
              <li><strong>Support</strong> — reach out for clarifications, minor fixes, or paid customization.</li>
            </ol>
          </motion.div>
        </div>
      </motion.section>

      {/* Trust, Security & Support */}
      <motion.section 
        className={commonClasses.section}
        variants={animationVariants.fadeIn}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className={commonClasses.container}>
          <motion.div variants={animationVariants.fadeIn} className={cn(commonClasses.card(isDark))}>
            <h2 className={cn(commonClasses.heading2(isDark), 'text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6')}>
              <span className={commonClasses.gradientText}>Trust & Security</span>
            </h2>
            <div className={cn('grid sm:grid-cols-1 md:grid-cols-2 gap-6', commonClasses.textBody(isDark))}>
              <div>
                <p className="mb-3">We prioritise trust: every seller is verified, and every project includes clear licensing terms. Payments are processed securely and customer data is protected with standard security practices.</p>
                <p className="mb-3">We also offer an optional code review and a money-back guarantee for projects that are not delivered as described.</p>
              </div>
              <div>
                <p className="mb-3">Support is available through our contact form and email. For development or deployment assistance, we provide paid professional services.</p>
                <p className="mb-3">For enterprise inquiries or bulk licensing, contact our sales team via the <a href="/contact" className="text-primary underline">Contact</a> page.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        className={commonClasses.section}
        variants={animationVariants.staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <div className={commonClasses.containerSmall}>
          <motion.div variants={animationVariants.fadeIn} className={commonClasses.card(isDark)}>
            <h2 className={cn(commonClasses.heading2(isDark), 'text-2xl sm:text-3xl md:text-4xl mb-4 sm:mb-6')}>
              <span className={commonClasses.gradientText}>Frequently Asked Questions</span>
            </h2>
            <div className="space-y-4">
              {faqs.map((f, i) => (
                <details key={i} className={cn('p-4 rounded-md', commonClasses.cardHover(isDark))}>
                  <summary className={cn('font-medium cursor-pointer', commonClasses.textBody(isDark))}>{f.q}</summary>
                  <div className={cn('mt-2 text-sm', commonClasses.textMuted(isDark))}>{f.a}</div>
                </details>
              ))}
            </div>
          </motion.div>
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
              <span className={commonClasses.gradientText}>Our Story</span>
            </h2>

            <div className={cn('space-y-4 text-sm sm:text-base md:text-lg leading-relaxed', commonClasses.textBody(isDark))}>
              <p>
                <strong>Infinity</strong> started as a student-driven project to solve a real problem: students needed reliable, well-documented
                code for coursework and real-world builds, while businesses and professionals required fast, dependable solutions without long
                development timelines. We built a marketplace that values quality, transparency, and learning — where students can publish work
                and customers can purchase projects they can trust.
              </p>

              <p>
                Over the years, Infinity has grown into a community of contributors and customers across India. We curate projects in
                technologies such as <strong>React, Node.js, Python, Django, Flask, AI/ML, and Android</strong>. Each listing includes setup
                guides, sample data, and optional enhancement services so buyers can deploy quickly and students can showcase their skills.
              </p>

              <p>
                We focus on three pillars: <strong>Learn</strong> (students gain real-world experience), <strong>Earn</strong> (publish and monetize
                projects), and <strong>Deliver</strong> (customers receive working, documented solutions). Our team continually improves
                the platform with better search, categorization, and secure payment processing.
              </p>

              {/* Timeline */}
              <div className="mt-6">
                <h3 className={cn(commonClasses.heading3(isDark), 'text-lg sm:text-xl mb-3')}>Our Journey</h3>
                <ol className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 space-y-4">
                  <li>
                    <div className="text-xs text-muted">2019</div>
                    <div className="font-medium">Foundation</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Platform launched to help students share project templates and earn.</div>
                  </li>
                  <li>
                    <div className="text-xs text-muted">2020-2021</div>
                    <div className="font-medium">Growth</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Expanded categories, improved QA checks, and introduced instant downloads.</div>
                  </li>
                  <li>
                    <div className="text-xs text-muted">2022</div>
                    <div className="font-medium">Marketplace Maturity</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">Introduced publishing workflow for students and optional customization services.</div>
                  </li>
                  <li>
                    <div className="text-xs text-muted">2024</div>
                    <div className="font-medium">Quality & Scale</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">500+ projects listed and robust support and review systems in place.</div>
                  </li>
                </ol>
              </div>

              {/* Team */}
              <div className="mt-6">
                <h3 className={cn(commonClasses.heading3(isDark), 'text-lg sm:text-xl mb-3')}>Meet Our Core Team</h3>
                <div className="flex justify-center">
                  <div className={cn(commonClasses.cardHover(isDark), 'p-6 w-full sm:w-80 flex items-center gap-4')}>
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">S</div>
                    <div>
                      <div className="font-medium">Sanjay — Founder</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Product strategy, community growth, partnerships.</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 text-center">
                <a href="/contact" className="inline-block px-6 py-2 bg-primary text-white rounded-md shadow-md">contact us</a>
                <p className="text-xs mt-2 text-gray-500">Or <a href="/contact" className="underline text-primary">contact us</a> for custom requests and enterprise licensing.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </PageLayout>
  );
}

