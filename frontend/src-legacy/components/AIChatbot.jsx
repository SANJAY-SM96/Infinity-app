import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiMinimize2, FiZap, FiTarget, FiAlertCircle, FiCpu } from 'react-icons/fi';
import { aiService } from '../api/aiService';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant. I can help you with project suggestions, requirement analysis, and answer questions about our products. How can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [collectionMode, setCollectionMode] = useState(null); // 'ideas', 'recommend', 'explain'
  const [collectionData, setCollectionData] = useState({});
  const messagesEndRef = useRef(null);
  const { isDark } = useTheme();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessageContent = input.trim();
    const userMessage = {
      role: 'user',
      content: userMessageContent
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setShowQuickActions(false);

    // Handle collection mode for structured inputs
    if (collectionMode === 'ideas') {
      handleProjectIdeasSubmission(userMessageContent);
      return;
    } else if (collectionMode === 'recommend') {
      handleRecommendProjectsSubmission(userMessageContent);
      return;
    } else if (collectionMode === 'explain') {
      handleExplainFunctionalitySubmission(userMessageContent);
      return;
    }

    setLoading(true);

    try {
      // Format conversation history for backend (exclude system message)
      const conversationHistory = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      // Use chatbot endpoint
      const response = await aiService.chatbot(userMessageContent, conversationHistory);

      const assistantMessage = {
        role: 'assistant',
        content: response.data?.response || response.data?.message || 'I understand your requirements. Let me help you find the best solution!'
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chatbot error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error message:', error.message);

      // Show more detailed error in development
      const errorDetails = error.response?.data?.error || error.response?.data?.message || error.message;
      const errorMessage = {
        role: 'assistant',
        content: process.env.NODE_ENV === 'development'
          ? `I encountered an error: ${errorDetails}. Please check the backend console for more details.`
          : 'I apologize, but I encountered an error. Please try again or contact our support team for assistance.'
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error(`Failed to get response from AI: ${errorDetails}`);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectIdeas = () => {
    setShowQuickActions(false);
    setCollectionMode('ideas');
    setCollectionData({});
    const botMessage = {
      role: 'assistant',
      content: 'Great! I\'d love to help you with project ideas. What are your interests or what kind of project are you looking for?'
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleProjectIdeasSubmission = async (interests) => {
    if (!interests || interests.trim() === '') return;

    setLoading(true);
    setCollectionMode(null);

    try {
      const response = await aiService.getProjectIdeas({ interests: interests.trim() });
      const ideas = response.data?.ideas || [];

      let content = 'Here are some project ideas for you:\n\n';
      ideas.forEach((idea, index) => {
        content += `${index + 1}. **${idea.title}**\n`;
        content += `   ${idea.description}\n`;
        content += `   Tech Stack: ${idea.techStack?.join(', ') || 'Not specified'}\n`;
        content += `   Complexity: ${idea.complexity}\n`;
        content += `   Development Time: ${idea.developmentTime}\n\n`;
      });

      setMessages(prev => [...prev, { role: 'assistant', content }]);
    } catch (error) {
      console.error('Project ideas error:', error);
      toast.error('Failed to get project ideas');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I couldn\'t generate project ideas at this time. Please try again later.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendProjects = () => {
    setShowQuickActions(false);
    setCollectionMode('recommend');
    setCollectionData({ step: 'experience' });
    const botMessage = {
      role: 'assistant',
      content: 'Perfect! I\'ll help you find the best projects. Let\'s start:\n\n**1. What is your experience level?**\n(Beginner/Intermediate/Advanced)'
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleRecommendProjectsSubmission = async (userInput) => {
    setLoading(true);

    const currentData = { ...collectionData };

    if (currentData.step === 'experience') {
      currentData.experienceLevel = userInput.trim() || 'Intermediate';
      currentData.step = 'interests';
      setCollectionData(currentData);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Got it! Experience level: **${currentData.experienceLevel}**\n\n**2. What are your interests?**\n(What topics or domains excite you?)`
      }]);
      setLoading(false);
      return;
    } else if (currentData.step === 'interests') {
      currentData.interests = userInput.trim();
      currentData.step = 'skills';
      setCollectionData(currentData);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Great! Your interests: **${currentData.interests}**\n\n**3. What skills do you have?**\n(Separate multiple skills with commas, e.g., React, Python, MongoDB)`
      }]);
      setLoading(false);
      return;
    } else if (currentData.step === 'skills') {
      currentData.skills = userInput.trim();
      currentData.step = 'goals';
      setCollectionData(currentData);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Excellent! Skills: **${currentData.skills}**\n\n**4. What are your goals?**\n(What do you want to achieve with these projects?)`
      }]);
      setLoading(false);
      return;
    } else if (currentData.step === 'goals') {
      currentData.goals = userInput.trim();

      // Now process all collected data
      try {
        const response = await aiService.recommendProjects({
          experienceLevel: currentData.experienceLevel || 'Intermediate',
          interests: currentData.interests || '',
          skills: (currentData.skills || '').split(',').map(s => s.trim()).filter(s => s),
          goals: currentData.goals || ''
        });

        const recommendations = response.data?.recommendations || [];
        let content = 'Here are my personalized project recommendations for you:\n\n';

        recommendations.forEach((rec, index) => {
          content += `${index + 1}. **${rec.projectTitle}** (${rec.priority} priority)\n`;
          content += `   Why it fits: ${rec.fitReason}\n`;
          content += `   Overview: ${rec.overview}\n`;
          content += `   Tech Stack: ${rec.techStack?.join(', ') || 'Not specified'}\n`;
          content += `   Timeline: ${rec.timeline}\n\n`;
        });

        if (response.data?.summary) {
          content += `\n**Summary:** ${response.data.summary}`;
        }

        setMessages(prev => [...prev, { role: 'assistant', content }]);
      } catch (error) {
        console.error('Recommendations error:', error);
        toast.error('Failed to get project recommendations');
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I apologize, but I couldn\'t generate recommendations at this time. Please try again later.'
        }]);
      } finally {
        setCollectionMode(null);
        setCollectionData({});
        setLoading(false);
      }
    }
  };

  const handleExplainFunctionality = () => {
    setShowQuickActions(false);
    setCollectionMode('explain');
    setCollectionData({ step: 'title' });
    const botMessage = {
      role: 'assistant',
      content: 'I\'d be happy to explain project functionality! Let\'s gather some information:\n\n**1. What is the project title?**'
    };
    setMessages(prev => [...prev, botMessage]);
  };

  const handleExplainFunctionalitySubmission = async (userInput) => {
    setLoading(true);

    const currentData = { ...collectionData };

    if (currentData.step === 'title') {
      if (!userInput.trim()) {
        setLoading(false);
        return;
      }
      currentData.projectTitle = userInput.trim();
      currentData.step = 'description';
      setCollectionData(currentData);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Project title: **${currentData.projectTitle}**\n\n**2. Describe the project:**\n(What does this project do? Provide a brief overview)`
      }]);
      setLoading(false);
      return;
    } else if (currentData.step === 'description') {
      if (!userInput.trim()) {
        setLoading(false);
        return;
      }
      currentData.projectDescription = userInput.trim();
      currentData.step = 'features';
      setCollectionData(currentData);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Got it! Project description recorded.\n\n**3. List key features:**\n(Separate multiple features with commas, or type "none" to skip)`
      }]);
      setLoading(false);
      return;
    } else if (currentData.step === 'features') {
      currentData.features = userInput.trim().toLowerCase() === 'none' ? '' : userInput.trim();

      // Now process all collected data
      try {
        const response = await aiService.explainFunctionality({
          projectTitle: currentData.projectTitle,
          projectDescription: currentData.projectDescription,
          features: currentData.features ? currentData.features.split(',').map(f => f.trim()).filter(f => f) : []
        });

        const explanation = response.data?.explanation || {};
        let content = `**Functionality Explanation for ${currentData.projectTitle}**\n\n`;
        content += `**Core Functionality:**\n${explanation.coreFunctionality || 'Not available'}\n\n`;

        if (explanation.featureExplanations?.length > 0) {
          content += `**Feature Breakdown:**\n`;
          explanation.featureExplanations.forEach((feat, index) => {
            content += `${index + 1}. ${feat.feature}: ${feat.explanation}\n`;
          });
          content += '\n';
        }

        if (explanation.userFlow) {
          content += `**User Flow:**\n${explanation.userFlow}\n\n`;
        }

        if (explanation.technicalArchitecture) {
          content += `**Technical Architecture:**\n${explanation.technicalArchitecture}\n\n`;
        }

        setMessages(prev => [...prev, { role: 'assistant', content }]);
      } catch (error) {
        console.error('Functionality explanation error:', error);
        toast.error('Failed to explain functionality');
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'I apologize, but I couldn\'t explain the functionality at this time. Please try again later.'
        }]);
      } finally {
        setCollectionMode(null);
        setCollectionData({});
        setLoading(false);
      }
    }
  };

  const bgClass = isDark
    ? 'bg-gray-900/95 backdrop-blur-xl border-gray-700'
    : 'bg-white/95 backdrop-blur-xl border-gray-200 shadow-2xl';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const inputBg = isDark
    ? 'bg-gray-800/50 border-gray-600 text-white placeholder-gray-400'
    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500';

  // Bot Avatar Component
  const BotAvatar = () => (
    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg flex-shrink-0">
      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    </div>
  );

  // User Avatar Component
  const UserAvatar = () => (
    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center shadow-lg flex-shrink-0">
      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
      </svg>
    </div>
  );

  return (
    <>
      {/* Chatbot Toggle Button - Responsive positioning */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, x: -20 }}
          animate={{ scale: 1, x: 0 }}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all flex items-center justify-center group touch-manipulation"
          aria-label="Open AI Assistant"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="group-hover:scale-110 transition-transform"
          >
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </motion.div>
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full border-2 border-white"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.button>
      )}

      {/* Chatbot Window - Responsive positioning and sizing */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed inset-0 sm:inset-auto sm:bottom-6 sm:left-6 sm:right-auto z-50 ${bgClass} border sm:rounded-3xl shadow-2xl flex flex-col ${isMinimized
                ? 'sm:w-80 h-16'
                : 'w-full h-full sm:w-[420px] sm:h-[700px] sm:max-h-[85vh] sm:rounded-3xl'
              } transition-all duration-300`}
          >
            {/* Header */}
            <div className={`flex items-center justify-between p-4 sm:p-5 border-b ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'} bg-gradient-to-r ${isDark ? 'from-gray-800/50 to-gray-800/30' : 'from-blue-50/50 to-purple-50/50'} flex-shrink-0`}>
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <BotAvatar />
                <div className="min-w-0">
                  <h3 className={`${textClass} font-bold text-base sm:text-lg flex items-center gap-2 truncate`}>
                    <span className="truncate">AI Assistant</span>
                    <motion.div
                      className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} truncate`}>Online • Ready to help</p>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className={`p-2 rounded-lg touch-manipulation ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700 active:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-100'} transition`}
                  title="Minimize"
                  aria-label="Minimize chat"
                >
                  <FiMinimize2 size={18} />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`p-2 rounded-lg touch-manipulation ${isDark ? 'text-gray-400 hover:text-white hover:bg-gray-700 active:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 active:bg-gray-100'} transition`}
                  title="Close"
                  aria-label="Close chat"
                >
                  <FiX size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Quick Actions */}
                {showQuickActions && messages.length === 1 && (
                  <div className="p-4 sm:p-5 border-b border-gray-200/50 dark:border-gray-700/50 bg-gradient-to-r from-blue-50/30 to-purple-50/30 dark:from-gray-800/30 dark:to-gray-800/20 flex-shrink-0">
                    <p className={`text-xs font-semibold mb-3 uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Quick Actions:</p>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      <motion.button
                        onClick={handleProjectIdeas}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-2 sm:px-4 py-2 sm:py-3 bg-gradient-to-br from-blue-500/20 to-blue-600/20 text-blue-600 dark:text-blue-400 rounded-lg sm:rounded-xl hover:from-blue-500/30 hover:to-blue-600/30 active:from-blue-500/40 active:to-blue-600/40 transition-all text-xs font-semibold flex flex-col items-center justify-center gap-1 sm:gap-2 border border-blue-500/20 shadow-sm touch-manipulation"
                        aria-label="Get project ideas"
                      >
                        <FiZap size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="text-[10px] sm:text-xs">Ideas</span>
                      </motion.button>
                      <motion.button
                        onClick={handleRecommendProjects}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-2 sm:px-4 py-2 sm:py-3 bg-gradient-to-br from-green-500/20 to-green-600/20 text-green-600 dark:text-green-400 rounded-lg sm:rounded-xl hover:from-green-500/30 hover:to-green-600/30 active:from-green-500/40 active:to-green-600/40 transition-all text-xs font-semibold flex flex-col items-center justify-center gap-1 sm:gap-2 border border-green-500/20 shadow-sm touch-manipulation"
                        aria-label="Get project recommendations"
                      >
                        <FiTarget size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="text-[10px] sm:text-xs">Recommend</span>
                      </motion.button>
                      <motion.button
                        onClick={handleExplainFunctionality}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-2 sm:px-4 py-2 sm:py-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 text-purple-600 dark:text-purple-400 rounded-lg sm:rounded-xl hover:from-purple-500/30 hover:to-purple-600/30 active:from-purple-500/40 active:to-purple-600/40 transition-all text-xs font-semibold flex flex-col items-center justify-center gap-1 sm:gap-2 border border-purple-500/20 shadow-sm touch-manipulation"
                        aria-label="Explain functionality"
                      >
                        <FiAlertCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
                        <span className="text-[10px] sm:text-xs">Explain</span>
                      </motion.button>
                    </div>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-3 sm:space-y-4 custom-scrollbar overscroll-contain">
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10, x: message.role === 'user' ? 20 : -20 }}
                      animate={{ opacity: 1, y: 0, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start`}
                    >
                      {message.role === 'assistant' && (
                        <div className="flex-shrink-0 mt-1">
                          <BotAvatar />
                        </div>
                      )}
                      <div className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'} max-w-[85%] sm:max-w-[75%] min-w-0`}>
                        <div
                          className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-lg break-words ${message.role === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-tr-none'
                              : isDark
                                ? 'bg-gray-800/80 text-white border border-gray-700/50 rounded-tl-none'
                                : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900 border border-gray-200/50 rounded-tl-none'
                            }`}
                        >
                          <div className={`text-sm sm:text-base leading-relaxed break-words ${message.role === 'user' ? 'text-white' : ''}`}>
                            <ReactMarkdown
                              components={{
                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal ml-4 mb-2" {...props} />,
                                li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                strong: ({ node, ...props }) => <strong className="font-bold" {...props} />,
                                a: ({ node, ...props }) => <a className="underline hover:text-blue-300" target="_blank" rel="noopener noreferrer" {...props} />,
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        </div>
                        <span className={`text-[10px] sm:text-xs mt-1 px-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      {message.role === 'user' && (
                        <div className="flex-shrink-0 mt-1">
                          <UserAvatar />
                        </div>
                      )}
                    </motion.div>
                  ))}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2 sm:gap-3 items-start"
                    >
                      <div className="flex-shrink-0 mt-1">
                        <BotAvatar />
                      </div>
                      <div className={`rounded-2xl rounded-tl-none px-3 py-2 sm:px-4 sm:py-3 shadow-lg ${isDark
                          ? 'bg-gray-800/80 text-white border border-gray-700/50'
                          : 'bg-gradient-to-r from-gray-100 to-gray-50 text-gray-900 border border-gray-200/50'
                        }`}>
                        <div className="flex gap-1.5">
                          <motion.div
                            animate={{ y: [0, -6, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                            className="w-2 h-2 bg-blue-500 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -6, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                            className="w-2 h-2 bg-purple-500 rounded-full"
                          />
                          <motion.div
                            animate={{ y: [0, -6, 0], scale: [1, 1.2, 1] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                            className="w-2 h-2 bg-pink-500 rounded-full"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSend} className={`p-3 sm:p-5 border-t ${isDark ? 'border-gray-700/50 bg-gray-900/50' : 'border-gray-200/50 bg-white/50'} flex-shrink-0 safe-area-inset-bottom`}>
                  <div className="flex gap-2 sm:gap-3 items-end">
                    <div className="flex-1 relative min-w-0">
                      <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={
                          collectionMode === 'ideas'
                            ? 'Tell me about your interests...'
                            : collectionMode === 'recommend' && collectionData.step === 'experience'
                              ? 'Beginner, Intermediate, or Advanced?'
                              : collectionMode === 'recommend' && collectionData.step === 'interests'
                                ? 'What topics interest you?'
                                : collectionMode === 'recommend' && collectionData.step === 'skills'
                                  ? 'List your skills...'
                                  : collectionMode === 'recommend' && collectionData.step === 'goals'
                                    ? 'What do you want to achieve?'
                                    : collectionMode === 'explain' && collectionData.step === 'title'
                                      ? 'Enter the project title...'
                                      : collectionMode === 'explain' && collectionData.step === 'description'
                                        ? 'Describe the project...'
                                        : collectionMode === 'explain' && collectionData.step === 'features'
                                          ? 'List key features...'
                                          : 'Type your message...'
                        }
                        className={`w-full ${inputBg} px-3 py-2.5 sm:px-4 sm:py-3 pr-10 sm:pr-12 rounded-xl sm:rounded-2xl border text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none touch-manipulation`}
                        disabled={loading}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend(e);
                          }
                        }}
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                      />
                      {input.trim() && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute right-2 sm:right-3 bottom-2 sm:bottom-3"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        </motion.div>
                      )}
                    </div>
                    <motion.button
                      type="submit"
                      disabled={loading || !input.trim()}
                      whileHover={{ scale: input.trim() ? 1.05 : 1 }}
                      whileTap={{ scale: input.trim() ? 0.95 : 1 }}
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center disabled:hover:scale-100 touch-manipulation flex-shrink-0 ${input.trim() ? 'animate-pulse' : ''
                        }`}
                      aria-label="Send message"
                    >
                      <FiSend size={18} className="sm:w-5 sm:h-5" />
                    </motion.button>
                  </div>
                  <p className={`text-[10px] sm:text-xs mt-2 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'} hidden sm:block`}>
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

