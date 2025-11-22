import React, { useEffect, useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { FiCode, FiDatabase, FiLayout, FiServer, FiCpu, FiGlobe } from 'react-icons/fi';

const FloatingIcon = ({ icon: Icon, delay, x, y, size, color }) => (
    <motion.div
        className={`absolute flex items-center justify-center rounded-xl backdrop-blur-md border shadow-lg ${color}`}
        style={{
            left: x,
            top: y,
            width: size,
            height: size,
        }}
        animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1],
        }}
        transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: delay,
            ease: "easeInOut",
        }}
    >
        <Icon className="w-1/2 h-1/2 opacity-80" />
    </motion.div>
);

const CodeSnippet = ({ lines, x, y, delay, width }) => {
    const { isDark } = useTheme();
    return (
        <motion.div
            className={`absolute p-3 rounded-lg backdrop-blur-sm border ${isDark ? 'bg-slate-900/40 border-slate-700/50' : 'bg-white/40 border-slate-200/50'
                }`}
            style={{ left: x, top: y, width }}
            animate={{
                y: [0, -10, 0],
                opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
                duration: 5 + Math.random() * 3,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut",
            }}
        >
            <div className="space-y-1.5">
                {lines.map((width, i) => (
                    <div
                        key={i}
                        className={`h-1.5 rounded-full ${isDark ? 'bg-slate-600/50' : 'bg-slate-400/50'
                            }`}
                        style={{ width: width }}
                    />
                ))}
            </div>
        </motion.div>
    );
};

export const TechParticles = () => {
    const { isDark } = useTheme();
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -50]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        const resizeCanvas = () => {
            const parent = canvas.parentElement;
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.size = Math.random() * 1.5 + 0.5;
                this.alpha = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = isDark
                    ? `rgba(147, 197, 253, ${this.alpha})` // blue-300
                    : `rgba(59, 130, 246, ${this.alpha})`; // blue-500
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            // Connect particles
            particles.forEach((a, i) => {
                particles.slice(i + 1).forEach(b => {
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.strokeStyle = isDark
                            ? `rgba(147, 197, 253, ${0.1 - distance / 1000})`
                            : `rgba(59, 130, 246, ${0.1 - distance / 1000})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(a.x, a.y);
                        ctx.lineTo(b.x, b.y);
                        ctx.stroke();
                    }
                });
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isDark]);

    const icons = useMemo(() => [
        { icon: FiCode, x: '10%', y: '20%', size: 48, color: isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-blue-50 border-blue-200 text-blue-600' },
        { icon: FiDatabase, x: '85%', y: '15%', size: 56, color: isDark ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-green-50 border-green-200 text-green-600' },
        { icon: FiServer, x: '15%', y: '70%', size: 40, color: isDark ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' : 'bg-purple-50 border-purple-200 text-purple-600' },
        { icon: FiGlobe, x: '80%', y: '65%', size: 64, color: isDark ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400' : 'bg-cyan-50 border-cyan-200 text-cyan-600' },
        { icon: FiCpu, x: '50%', y: '10%', size: 32, color: isDark ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-600' },
        { icon: FiLayout, x: '40%', y: '85%', size: 48, color: isDark ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' : 'bg-pink-50 border-pink-200 text-pink-600' },
    ], [isDark]);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Canvas Layer */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-0 opacity-60"
            />

            {/* Parallax Layer 1 - Icons */}
            <motion.div style={{ y: y1 }} className="absolute inset-0 z-10">
                {icons.map((item, i) => (
                    <FloatingIcon key={i} {...item} delay={i * 0.5} />
                ))}
            </motion.div>

            {/* Parallax Layer 2 - Code Snippets */}
            <motion.div style={{ y: y2 }} className="absolute inset-0 z-0">
                <CodeSnippet x="25%" y="30%" width="120px" lines={['80%', '60%', '90%']} delay={0} />
                <CodeSnippet x="70%" y="40%" width="100px" lines={['70%', '50%', '80%', '60%']} delay={1.5} />
                <CodeSnippet x="20%" y="60%" width="140px" lines={['90%', '40%', '70%']} delay={2.5} />
                <CodeSnippet x="60%" y="75%" width="110px" lines={['60%', '80%', '50%']} delay={3.5} />
            </motion.div>

            {/* Gradient Overlay for depth */}
            <div className={`absolute inset-0 bg-gradient-to-b ${isDark
                    ? 'from-transparent via-slate-900/10 to-slate-900/50'
                    : 'from-transparent via-white/10 to-white/50'
                }`} />
        </div>
    );
};
