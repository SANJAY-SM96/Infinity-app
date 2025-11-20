'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '../../utils/helpers';

export const DynamicNavigation = ({
  links,
  backgroundColor,
  textColor,
  highlightColor,
  glowIntensity = 5,
  className,
  showLabelsOnMobile = false,
  onLinkClick,
  activeLink,
  enableRipple = true,
  variant = 'horizontal', // horizontal, vertical, mobile
}) => {
  const pathname = usePathname();
  const navRef = useRef(null);
  const highlightRef = useRef(null);
  const [active, setActive] = useState(
    activeLink || (links.length > 0 ? links[0].id : null)
  );

  // Update active link based on current route
  useEffect(() => {
    const currentLink = links.find((link) => {
      const linkHref = link.href || link.to;
      return linkHref === pathname || pathname?.startsWith(linkHref + '/');
    });
    if (currentLink) {
      setActive(currentLink.id);
    }
  }, [pathname, links]);

  // Update highlight position based on active link
  const updateHighlightPosition = (id) => {
    if (!navRef.current || !highlightRef.current || variant === 'mobile') return;

    const linkElement = navRef.current.querySelector(`#nav-item-${id || active}`);
    if (!linkElement) return;

    const navRect = navRef.current.getBoundingClientRect();
    const linkInner = linkElement.querySelector('a');

    if (!linkInner) return;

    const innerRect = linkInner.getBoundingClientRect();

    if (variant === 'vertical') {
      // For vertical, align with the inner link element
      highlightRef.current.style.transform = `translateY(${innerRect.top - navRect.top}px)`;
      highlightRef.current.style.width = `${innerRect.width}px`;
      highlightRef.current.style.height = `${innerRect.height}px`;
    } else {
      // For horizontal, center the highlight on the link
      highlightRef.current.style.transform = `translateX(${innerRect.left - navRect.left}px)`;
      highlightRef.current.style.width = `${innerRect.width}px`;
      highlightRef.current.style.height = `${innerRect.height}px`;
    }
  };

  // Create ripple effect
  const createRipple = (event) => {
    if (!enableRipple) return;

    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const rect = button.getBoundingClientRect();

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - diameter / 2}px`;
    circle.style.top = `${event.clientY - rect.top - diameter / 2}px`;
    circle.className = 'absolute bg-white rounded-full pointer-events-none opacity-30 animate-ripple';

    button.appendChild(circle);
    setTimeout(() => circle.remove(), 600);
  };

  // Handle link click
  const handleLinkClick = (id, event) => {
    if (enableRipple && event) {
      createRipple(event);
    }

    setActive(id);
    if (onLinkClick) {
      onLinkClick(id);
    }

    // Update highlight position after a short delay to allow DOM update
    setTimeout(() => updateHighlightPosition(id), 50);
  };

  // Handle link hover - disabled
  const handleLinkHover = (id) => {
    // Highlight animation disabled
  };

  // Set initial highlight position and update on window resize
  useEffect(() => {
    if (variant !== 'mobile') {
      updateHighlightPosition();
      const handleResize = () => updateHighlightPosition();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [active, links, variant]);

  // Update when active link changes externally
  useEffect(() => {
    if (activeLink && activeLink !== active) {
      setActive(activeLink);
    }
  }, [activeLink]);

  // Determine container classes based on variant
  const containerClasses = cn(
    'relative transition-all duration-300',
    variant === 'horizontal' && 'flex items-center',
    variant === 'vertical' && 'flex flex-col',
    variant === 'mobile' && 'flex flex-col w-full',
    className
  );

  // Default styles based on theme
  const defaultBg = backgroundColor || 'bg-white/95 dark:bg-slate-800/95';
  const defaultText = textColor || 'text-slate-700 dark:text-slate-300';
  const defaultHighlight = highlightColor || 'bg-slate-100/50 dark:bg-slate-700/50';
  const defaultGlow = '';

  if (variant === 'mobile') {
    return (
      <nav className={containerClasses}>
        <ul className="flex flex-col gap-1 w-full">
          {links.map((link) => {
            const isActive = active === link.id;
            const linkHref = link.href || link.to;
            
            if (!linkHref) return null;

            return (
              <li key={link.id} className="w-full" id={`nav-item-${link.id}`}>
                <Link
                  href={linkHref}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors duration-200 ease-out relative overflow-hidden w-full',
                    defaultText,
                    isActive
                      ? 'bg-slate-100 dark:bg-slate-700/50 font-semibold border border-slate-200 dark:border-slate-600'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-transparent'
                  )}
                  onClick={(e) => handleLinkClick(link.id, e)}
                >
                  {link.icon && <span className="text-current text-lg flex-shrink-0">{link.icon}</span>}
                  <span className="flex-1">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              @keyframes ripple {
                to {
                  transform: scale(4);
                  opacity: 0;
                  }
              }
              .animate-ripple {
                animation: ripple 0.6s linear;
              }
            `,
          }}
        />
      </nav>
    );
  }

  return (
    <nav
      ref={navRef}
      className={cn(
        'relative rounded-full backdrop-blur-md border shadow-lg transition-all duration-300',
        defaultBg,
        variant === 'vertical' && 'rounded-2xl p-2',
        className
      )}
      style={{
        backgroundColor: backgroundColor,
        color: textColor,
      }}
    >
      {/* Background highlight for hover/active - disabled */}
      <div
        ref={highlightRef}
        className="hidden"
        style={{
          display: 'none',
        }}
      />

      <ul
        className={cn(
          'flex relative z-10',
          variant === 'horizontal' && 'justify-center items-center gap-1 py-2 px-1.5 h-full',
          variant === 'vertical' && 'flex-col gap-1'
        )}
      >
        {links.map((link) => {
          const isActive = active === link.id;
          // Safeguard against missing href/to property
          const linkHref = link.href || link.to;
          if (!linkHref) {
            if (process.env.NODE_ENV === 'development') {
              console.warn('DynamicNavigation: Missing "href" or "to" property for link', link);
            }
            return null;
          }

          return (
            <li
              key={link.id}
              className={cn(
                'relative flex items-center',
                variant === 'horizontal' && 'mx-0.5 lg:mx-1',
                variant === 'vertical' && 'w-full'
              )}
              id={`nav-item-${link.id}`}
            >
              <Link
                href={linkHref}
                className={cn(
                  'flex gap-2 items-center justify-center rounded-full font-medium transition-colors duration-200 ease-out relative overflow-hidden',
                  defaultText,
                  variant === 'horizontal' && 'h-10 px-4 text-xs md:text-sm min-h-[40px]',
                  variant === 'vertical' && 'h-12 px-4 text-sm w-full',
                  isActive && 'font-semibold',
                  // Hover state - subtle color change without blue/purple
                  variant === 'horizontal' && !isActive && 'hover:opacity-80',
                  variant === 'vertical' && !isActive && 'hover:opacity-80'
                )}
                onClick={(e) => handleLinkClick(link.id, e)}
              >
                {link.icon && (
                  <span className="text-current text-sm md:text-base flex-shrink-0 flex items-center justify-center">
                    {link.icon}
                  </span>
                )}
                <span
                  className={cn(
                    showLabelsOnMobile ? 'flex' : 'hidden sm:flex',
                    'relative z-10 whitespace-nowrap'
                  )}
                >
                  {link.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes ripple {
              to {
                transform: scale(4);
                opacity: 0;
              }
            }
            .animate-ripple {
              animation: ripple 0.6s linear;
            }
          `,
        }}
      />
    </nav>
  );
};

export default DynamicNavigation;

