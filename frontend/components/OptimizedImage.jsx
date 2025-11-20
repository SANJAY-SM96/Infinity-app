import React, { useState, useEffect, useRef } from 'react';
import { getWebPImage, createPictureSources } from '../utils/imageOptimizer';

/**
 * Optimized Image Component
 * - Lazy loading
 * - WebP support with fallback
 * - Width/height attributes for CLS prevention
 * - Responsive images with srcset
 * - Proper alt text
 * - Error handling
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  fetchpriority = 'auto',
  sizes,
  useWebP = true,
  onLoad,
  onError,
  aspectRatio,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PC9zdmc+',
  ...props
}) {
  const [imageSrc, setImageSrc] = useState(src);
  const [imageError, setImageError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef(null);
  const pictureSources = useWebP && src ? createPictureSources(src) : null;

  // Calculate aspect ratio if not provided
  const calculatedAspectRatio = aspectRatio || (width && height ? height / width : null);

  useEffect(() => {
    setImageSrc(src);
    setImageError(false);
    setIsLoaded(false);
  }, [src]);

  const handleLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  const handleError = (e) => {
    if (imageError) {
      // Already tried fallback, use placeholder
      setImageSrc(placeholder);
      if (onError) onError(e);
    } else {
      // Try fallback without WebP
      setImageError(true);
      if (useWebP && src && src !== placeholder) {
        setImageSrc(src); // Fallback to original
      } else {
        setImageSrc(placeholder);
      }
    }
  };

  // Ensure width and height are provided (required for CLS prevention)
  const finalWidth = width || 800;
  const finalHeight = height || (calculatedAspectRatio ? finalWidth * calculatedAspectRatio : 600);

  // Inline style for aspect ratio container
  const containerStyle = calculatedAspectRatio
    ? { paddingBottom: `${calculatedAspectRatio * 100}%` }
    : {};

  // If WebP is supported and sources are available, use picture element
  if (useWebP && pictureSources && !imageError) {
    return (
      <picture className={className} style={{ display: 'block' }}>
        {/* WebP source */}
        <source
          srcSet={pictureSources.webpSrcSet}
          sizes={sizes || pictureSources.sizes}
          type="image/webp"
        />
        {/* Fallback source */}
        <source
          srcSet={pictureSources.fallbackSrcSet}
          sizes={sizes || pictureSources.sizes}
        />
        {/* Fallback img */}
        <img
          ref={imgRef}
          src={imageSrc}
          alt={alt || ''}
          width={finalWidth}
          height={finalHeight}
          loading={loading}
          fetchPriority={fetchpriority}
          decoding="async"
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'cover'
          }}
          {...props}
        />
      </picture>
    );
  }

  // Standard img element with optimizations
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={calculatedAspectRatio ? containerStyle : {}}
    >
      <img
        ref={imgRef}
        src={imageSrc}
        alt={alt || ''}
        width={finalWidth}
        height={finalHeight}
        loading={loading}
        fetchPriority={fetchpriority}
        decoding="async"
        className={`${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 w-full h-full object-cover`}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          position: calculatedAspectRatio ? 'absolute' : 'relative',
          top: calculatedAspectRatio ? 0 : 'auto',
          left: calculatedAspectRatio ? 0 : 'auto'
        }}
        {...props}
      />
      {!isLoaded && !imageError && (
        <div
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          aria-hidden="true"
        />
      )}
    </div>
  );
}

