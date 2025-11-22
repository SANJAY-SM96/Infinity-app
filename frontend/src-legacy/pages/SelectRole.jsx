import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FaUserGraduate, FaUserTie, FaCheckCircle } from 'react-icons/fa';
import GlassCard from '../components/ui/GlassCard';
import toast from 'react-hot-toast';

export default function SelectRole() {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState(user?.userType || null);

    const handleRoleSelect = async (role) => {
        setSelectedRole(role);
        setLoading(true);
        try {
            const result = await updateProfile({ userType: role });
            if (result.success) {
                toast.success(`Role updated to ${role === 'student' ? 'Student' : 'Customer'}`);
                if (role === 'student') {
                    navigate('/home/student');
                } else {
                    navigate('/home/customer');
                }
            } else {
                toast.error(result.error || 'Failed to update role');
            }
        } catch (error) {
            console.error('Role update error:', error);
            toast.error('An error occurred while updating role');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-300 ${isDark ? 'bg-slate-900' : 'bg-gray-50'
            }`}>
            <div className="max-w-4xl w-full">
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'
                            }`}
                    >
                        Choose Your Role
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className={`text-lg ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
                    >
                        Select how you want to use Infinity
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Student Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <GlassCard
                            className={`h-full p-8 cursor-pointer transition-all duration-300 border-2 ${selectedRole === 'student'
                                    ? 'border-primary ring-4 ring-primary/20 transform scale-105'
                                    : 'border-transparent hover:border-primary/50 hover:scale-105'
                                }`}
                            onClick={() => handleRoleSelect('student')}
                        >
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className={`p-6 rounded-full ${isDark ? 'bg-primary/20' : 'bg-primary/10'
                                    }`}>
                                    <FaUserGraduate className="w-12 h-12 text-primary" />
                                </div>
                                <div>
                                    <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'
                                        }`}>
                                        I am a Student
                                    </h3>
                                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                        I want to publish my projects, access resources, and use student tools.
                                    </p>
                                </div>
                                <ul className="text-left space-y-3 w-full">
                                    <li className="flex items-center gap-2">
                                        <FaCheckCircle className="text-green-500" />
                                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Publish your projects</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FaCheckCircle className="text-green-500" />
                                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Access student dashboard</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FaCheckCircle className="text-green-500" />
                                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Exclusive student discounts</span>
                                    </li>
                                </ul>
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Customer Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <GlassCard
                            className={`h-full p-8 cursor-pointer transition-all duration-300 border-2 ${selectedRole === 'customer'
                                    ? 'border-accent ring-4 ring-accent/20 transform scale-105'
                                    : 'border-transparent hover:border-accent/50 hover:scale-105'
                                }`}
                            onClick={() => handleRoleSelect('customer')}
                        >
                            <div className="flex flex-col items-center text-center space-y-6">
                                <div className={`p-6 rounded-full ${isDark ? 'bg-accent/20' : 'bg-accent/10'
                                    }`}>
                                    <FaUserTie className="w-12 h-12 text-accent" />
                                </div>
                                <div>
                                    <h3 className={`text-2xl font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'
                                        }`}>
                                        I am a Customer
                                    </h3>
                                    <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                                        I want to buy projects, hire developers, and manage orders.
                                    </p>
                                </div>
                                <ul className="text-left space-y-3 w-full">
                                    <li className="flex items-center gap-2">
                                        <FaCheckCircle className="text-green-500" />
                                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Buy premium projects</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FaCheckCircle className="text-green-500" />
                                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Track your orders</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <FaCheckCircle className="text-green-500" />
                                        <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>Priority support</span>
                                    </li>
                                </ul>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>

                {loading && (
                    <div className="mt-8 text-center">
                        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className={`mt-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                            Updating your profile...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
