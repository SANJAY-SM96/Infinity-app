import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Image, Text, Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowRight, ExternalLink, Star } from 'lucide-react';

// 3D Card Component
function Card({ url, title, position, rotation, onClick, active }) {
    const ref = useRef();
    const [hovered, hover] = useState(false);

    useFrame((state, delta) => {
        if (ref.current) {
            // Gentle floating animation
            ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.1;

            // Smooth rotation on hover
            const targetRotation = hovered ? 0 : rotation[1];
            ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, targetRotation, delta * 2);

            // Scale effect
            const targetScale = active ? 1.2 : hovered ? 1.1 : 1;
            ref.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), delta * 5);
        }
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group
                ref={ref}
                position={position}
                rotation={rotation}
                onClick={onClick}
                onPointerOver={() => hover(true)}
                onPointerOut={() => hover(false)}
            >
                <Image url={url} scale={[3, 2]} transparent opacity={active ? 1 : 0.6} radius={0.1} />
                {active && (
                    <Text
                        position={[0, -1.2, 0.1]}
                        fontSize={0.15}
                        color="white"
                        anchorX="center"
                        anchorY="middle"
                        outlineWidth={0.01}
                        outlineColor="black"
                    >
                        {title}
                    </Text>
                )}
            </group>
        </Float>
    );
}

// 3D Scene Component
function Scene({ items, activeIndex, setActiveIndex }) {
    return (
        <Canvas camera={{ position: [0, 0, 6], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Environment preset="city" />

            <group position={[0, 0.5, 0]}>
                {items.map((item, index) => {
                    // Calculate position in a semi-circle
                    const angle = (index - activeIndex) * 0.8;
                    const x = Math.sin(angle) * 4;
                    const z = Math.cos(angle) * 2 - 2;
                    const rotY = angle;

                    // Only render visible items to save performance
                    if (Math.abs(index - activeIndex) > 2) return null;

                    return (
                        <Card
                            key={item.id}
                            url={item.image}
                            title={item.title}
                            position={[x, 0, z]}
                            rotation={[0, -rotY, 0]}
                            active={index === activeIndex}
                            onClick={() => setActiveIndex(index)}
                        />
                    );
                })}
            </group>
        </Canvas>
    );
}

const projects = [
    {
        id: 1,
        title: 'AI Health Assistant',
        category: 'Healthcare',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%234F46E5"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="48" fill="white"%3EAI Health Assistant%3C/text%3E%3C/svg%3E',
        description: 'A machine learning model to predict potential health risks based on symptoms.',
        tech: ['Python', 'TensorFlow', 'React'],
        stars: 124
    },
    {
        id: 2,
        title: 'EcoTrack IoT',
        category: 'IoT',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%2310B981"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="48" fill="white"%3EEcoTrack IoT%3C/text%3E%3C/svg%3E',
        description: 'Smart sensors for monitoring environmental parameters in real-time.',
        tech: ['Arduino', 'Node.js', 'MQTT'],
        stars: 89
    },
    {
        id: 3,
        title: 'CryptoVault',
        category: 'Blockchain',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%23F59E0B"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="48" fill="white"%3ECryptoVault%3C/text%3E%3C/svg%3E',
        description: 'Secure decentralized wallet for managing digital assets.',
        tech: ['Solidity', 'Web3.js', 'Next.js'],
        stars: 256
    },
    {
        id: 4,
        title: 'EduLearn VR',
        category: 'Education',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%238B5CF6"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="48" fill="white"%3EEduLearn VR%3C/text%3E%3C/svg%3E',
        description: 'Immersive virtual reality classroom experience for remote learning.',
        tech: ['Unity', 'C#', 'Oculus SDK'],
        stars: 178
    },
    {
        id: 5,
        title: 'SmartTraffic',
        category: 'Smart City',
        image: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%23EF4444"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="48" fill="white"%3ESmartTraffic%3C/text%3E%3C/svg%3E',
        description: 'AI-based traffic management system to reduce congestion.',
        tech: ['Python', 'OpenCV', 'YOLO'],
        stars: 145
    }
];

export default function ProjectGallery() {
    const [activeIndex, setActiveIndex] = useState(2);
    const [is3D, setIs3D] = useState(true);

    // Fallback for mobile/performance
    useEffect(() => {
        const checkMobile = () => {
            if (window.innerWidth < 768) setIs3D(false);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <section className="py-12 sm:py-16">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Student Showcase
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Inspiring projects built by students like you.
                    </p>
                </div>
                <button
                    onClick={() => setIs3D(!is3D)}
                    className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                    {is3D ? 'Switch to Grid View' : 'Switch to 3D View'}
                </button>
            </div>

            <div className="relative min-h-[400px] sm:min-h-[500px] bg-gray-900 rounded-3xl overflow-hidden shadow-2xl">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black z-0" />

                {is3D ? (
                    <div className="absolute inset-0 z-10">
                        <Scene items={projects} activeIndex={activeIndex} setActiveIndex={setActiveIndex} />

                        {/* Overlay Info for Active Item */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent text-white">
                            <div className="max-w-3xl mx-auto text-center">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary-300 text-xs font-bold uppercase tracking-wider mb-2">
                                        {projects[activeIndex].category}
                                    </span>
                                    <h3 className="text-2xl sm:text-3xl font-bold mb-2">{projects[activeIndex].title}</h3>
                                    <p className="text-gray-300 mb-4 max-w-xl mx-auto">{projects[activeIndex].description}</p>
                                    <div className="flex items-center justify-center gap-4">
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            <Star size={16} fill="currentColor" />
                                            <span className="font-bold">{projects[activeIndex].stars}</span>
                                        </div>
                                        <button className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors">
                                            View Project <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors z-20 disabled:opacity-30"
                            disabled={activeIndex === 0}
                            aria-label="Previous Project"
                        >
                            <ArrowRight size={24} className="rotate-180" />
                        </button>
                        <button
                            onClick={() => setActiveIndex(Math.min(projects.length - 1, activeIndex + 1))}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors z-20 disabled:opacity-30"
                            disabled={activeIndex === projects.length - 1}
                            aria-label="Next Project"
                        >
                            <ArrowRight size={24} />
                        </button>
                    </div>
                ) : (
                    <div className="relative z-10 p-6 sm:p-8 overflow-y-auto h-full">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {projects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    whileHover={{ y: -5 }}
                                    className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg group"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                className="p-3 rounded-full bg-white text-black hover:scale-110 transition-transform"
                                                aria-label={`View ${project.title} details`}
                                            >
                                                <ExternalLink size={20} />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold text-primary-400 uppercase tracking-wider">
                                                {project.category}
                                            </span>
                                            <div className="flex items-center gap-1 text-yellow-400 text-xs font-bold">
                                                <Star size={12} fill="currentColor" />
                                                {project.stars}
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">{project.title}</h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{project.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.tech.map(t => (
                                                <span key={t} className="px-2 py-1 rounded-md bg-gray-700 text-gray-300 text-xs">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
