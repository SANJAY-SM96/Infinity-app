import React from 'react';
import { motion } from 'framer-motion';
import {
    Code,
    Cpu,
    Database,
    Globe,
    Smartphone,
    Cloud,
    Lock,
    Brain,
    Layers,
    ArrowRight
} from 'lucide-react';

const topics = [
    { id: 1, title: 'Web Development', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10', desc: 'React, Next.js, MERN Stack' },
    { id: 2, title: 'AI & Machine Learning', icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10', desc: 'Python, TensorFlow, NLP' },
    { id: 3, title: 'Mobile Apps', icon: Smartphone, color: 'text-green-500', bg: 'bg-green-500/10', desc: 'Flutter, React Native, iOS' },
    { id: 4, title: 'Cloud Computing', icon: Cloud, color: 'text-sky-500', bg: 'bg-sky-500/10', desc: 'AWS, Azure, Docker, K8s' },
    { id: 5, title: 'Cyber Security', icon: Lock, color: 'text-red-500', bg: 'bg-red-500/10', desc: 'Ethical Hacking, Network Sec' },
    { id: 6, title: 'Data Science', icon: Database, color: 'text-orange-500', bg: 'bg-orange-500/10', desc: 'Big Data, Analytics, Viz' },
    { id: 7, title: 'IoT & Robotics', icon: Cpu, color: 'text-yellow-500', bg: 'bg-yellow-500/10', desc: 'Arduino, Raspberry Pi' },
    { id: 8, title: 'Blockchain', icon: Layers, color: 'text-indigo-500', bg: 'bg-indigo-500/10', desc: 'Solidity, Smart Contracts' },
];

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function ProjectTopics() {
    return (
        <section className="py-8 sm:py-12">
            <div className="mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    Explore Trending Topics
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    Discover projects in the most in-demand technology domains.
                </p>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
            >
                {topics.map((topic) => {
                    const Icon = topic.icon;
                    return (
                        <motion.div
                            key={topic.id}
                            variants={item}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                            className="group relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 p-6 cursor-pointer"
                        >
                            <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full ${topic.bg} opacity-50 transition-transform group-hover:scale-110`} />

                            <div className={`w-12 h-12 rounded-xl ${topic.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                <Icon className={`w-6 h-6 ${topic.color}`} />
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                                {topic.title}
                            </h3>

                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                {topic.desc}
                            </p>

                            <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                <span>Browse Projects</span>
                                <ArrowRight className="w-4 h-4 ml-1" />
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
