import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle2,
    Circle,
    ArrowRight,
    Lightbulb,
    FileText,
    Code2,
    Rocket
} from 'lucide-react';

const steps = [
    {
        id: 1,
        title: 'Ideation',
        icon: Lightbulb,
        description: 'Define your problem statement and core features.',
        content: (
            <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-800">
                    <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Tip: Start Small</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        Focus on a single core problem to solve. Don't try to build everything at once.
                    </p>
                </div>
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project Title Idea</label>
                    <input
                        type="text"
                        placeholder="e.g., AI-Powered Study Assistant"
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                    />
                </div>
            </div>
        )
    },
    {
        id: 2,
        title: 'Planning',
        icon: FileText,
        description: 'Create a roadmap and select your tech stack.',
        content: (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    {['React', 'Node.js', 'Python', 'Flutter', 'MongoDB', 'Firebase'].map((tech) => (
                        <div key={tech} className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                            <div className="w-4 h-4 rounded-full border border-gray-300 mr-3"></div>
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{tech}</span>
                        </div>
                    ))}
                </div>
            </div>
        )
    },
    {
        id: 3,
        title: 'Development',
        icon: Code2,
        description: 'Start coding with best practices and version control.',
        content: (
            <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4">
                    <Code2 size={32} />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Ready to Code?</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                    Remember to commit your changes frequently and write clean, documented code.
                </p>
                <button className="px-4 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                    Open GitHub Guide
                </button>
            </div>
        )
    },
    {
        id: 4,
        title: 'Launch',
        icon: Rocket,
        description: 'Deploy your project and share it with the world.',
        content: (
            <div className="space-y-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                        <h4 className="font-semibold text-green-800 dark:text-green-200 mb-1">Launch Checklist</h4>
                        <ul className="text-sm text-green-700 dark:text-green-300 space-y-1 list-disc list-inside">
                            <li>Test all core features</li>
                            <li>Optimize images and assets</li>
                            <li>Setup SEO meta tags</li>
                            <li>Verify mobile responsiveness</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
];

export default function ProjectPlanner() {
    const [currentStep, setCurrentStep] = useState(1);

    return (
        <section className="py-8 sm:py-12 bg-gray-50 dark:bg-gray-900/50 rounded-3xl my-8 border border-gray-100 dark:border-gray-800 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
                <div className="text-center mb-10">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                        Project Planner
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        From idea to launch, follow our structured path to build successful projects.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Steps Navigation */}
                    <div className="lg:col-span-4 space-y-4">
                        {steps.map((step) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;

                            return (
                                <motion.div
                                    key={step.id}
                                    onClick={() => setCurrentStep(step.id)}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 flex items-start gap-4 ${isActive
                                            ? 'bg-white dark:bg-gray-800 border-primary shadow-lg ring-1 ring-primary/20'
                                            : isCompleted
                                                ? 'bg-white/50 dark:bg-gray-800/50 border-green-200 dark:border-green-900/30'
                                                : 'bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-gray-800/50'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${isActive
                                            ? 'bg-primary text-white'
                                            : isCompleted
                                                ? 'bg-green-500 text-white'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                                        }`}>
                                        {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'
                                            }`}>
                                            {step.title}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 line-clamp-2">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl p-6 sm:p-8 h-full flex flex-col">
                            <div className="flex-1">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={currentStep}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="flex items-center gap-3 mb-6">
                                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                                                Step {currentStep}
                                            </span>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                {steps[currentStep - 1].title}
                                            </h3>
                                        </div>

                                        {steps[currentStep - 1].content}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                                <button
                                    onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                                    disabled={currentStep === 1}
                                    className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
                                    className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center gap-2"
                                >
                                    {currentStep === steps.length ? 'Finish' : 'Next Step'}
                                    <ArrowRight size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
