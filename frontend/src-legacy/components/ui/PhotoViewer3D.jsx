import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiZoomIn, FiZoomOut, FiRotateCw, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

/**
 * 3D Photo Viewer Component
 * Interactive 3D image viewer with rotation, zoom, and pan capabilities
 */
export default function PhotoViewer3D({ 
  images = [], 
  isOpen = false, 
  onClose, 
  initialIndex = 0,
  title = '3D Photo Gallery'
}) {
  const { isDark } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const currentImage = images[currentIndex];

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setRotation({ x: 0, y: 0 });
      setZoom(1);
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, currentIndex, images.length]);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - rotation.y,
      y: e.clientY - rotation.x
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    setRotation({
      x: e.clientY - dragStart.y,
      y: e.clientX - dragStart.x
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  };

  const resetView = () => {
    setRotation({ x: 0, y: 0 });
    setZoom(1);
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  };

  if (!isOpen || !currentImage) return null;

  const cardBg = isDark 
    ? 'bg-gray-900/95 backdrop-blur-xl border-gray-700' 
    : 'bg-white/95 backdrop-blur-xl border-gray-200';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Main Container */}
        <motion.div
          ref={containerRef}
          initial={{ scale: 0.9, opacity: 0, rotateY: -15 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          exit={{ scale: 0.9, opacity: 0, rotateY: 15 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`relative ${cardBg} rounded-2xl shadow-2xl border max-w-6xl w-full max-h-[90vh] overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {title}
              </h2>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {currentIndex + 1} / {images.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleFullscreen}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                aria-label="Toggle fullscreen"
              >
                {isFullscreen ? (
                  <FiMinimize2 className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                ) : (
                  <FiMaximize2 className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                aria-label="Close"
              >
                <FiX className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-900'}`} />
              </motion.button>
            </div>
          </div>

          {/* 3D Image Container */}
          <div
            className="relative w-full h-[60vh] overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <motion.div
              ref={imageRef}
              className="w-full h-full flex items-center justify-center"
              style={{
                transform: `
                  perspective(1000px) 
                  rotateX(${rotation.x * 0.1}deg) 
                  rotateY(${rotation.y * 0.1}deg) 
                  scale(${zoom})
                `,
                transformStyle: 'preserve-3d',
              }}
              animate={{
                rotateX: rotation.x * 0.1,
                rotateY: rotation.y * 0.1,
                scale: zoom,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <img
                src={currentImage}
                alt={`3D view ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                style={{
                  filter: 'drop-shadow(0 20px 40px rgba(0,0,0,0.3))',
                }}
                draggable={false}
              />
            </motion.div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1, x: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handlePrevious}
                  className={`absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full ${isDark ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-md shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} z-10`}
                  aria-label="Previous image"
                >
                  <FiRotateCw className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} style={{ transform: 'scaleX(-1)' }} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleNext}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full ${isDark ? 'bg-gray-800/80' : 'bg-white/80'} backdrop-blur-md shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} z-10`}
                  aria-label="Next image"
                >
                  <FiRotateCw className={`w-6 h-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                </motion.button>
              </>
            )}
          </div>

          {/* Controls */}
          <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              {/* Zoom Controls */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                  aria-label="Zoom out"
                >
                  <FiZoomOut className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                </motion.button>
                <span className={`text-sm font-medium min-w-[60px] text-center ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  {Math.round(zoom * 100)}%
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setZoom(prev => Math.min(3, prev + 0.1))}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-colors`}
                  aria-label="Zoom in"
                >
                  <FiZoomIn className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                </motion.button>
              </div>

              {/* Reset Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resetView}
                className={`px-4 py-2 rounded-lg ${isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors font-medium text-sm`}
              >
                Reset View
              </motion.button>

              {/* Thumbnail Navigation */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto max-w-md">
                  {images.map((img, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        setCurrentIndex(index);
                        resetView();
                      }}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                        index === currentIndex
                          ? isDark
                            ? 'border-primary shadow-lg shadow-primary/50'
                            : 'border-primary shadow-lg shadow-primary/30'
                          : isDark
                          ? 'border-gray-700 opacity-60 hover:opacity-100'
                          : 'border-gray-300 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Instructions */}
            <p className={`text-xs mt-3 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Drag to rotate • Scroll to zoom • Arrow keys to navigate
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

