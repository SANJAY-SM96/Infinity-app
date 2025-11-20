/**
 * SEO Monitoring and Error Reporting Utilities
 * Tracks SEO issues, missing metadata, broken links, and performance metrics
 */

/**
 * Check for missing SEO elements
 */
export function checkSEOIssues() {
  const issues = [];

  // Check for missing title
  const title = document.querySelector('title');
  if (!title || !title.textContent || title.textContent.trim() === '') {
    issues.push({
      type: 'error',
      element: 'title',
      message: 'Page title is missing or empty'
    });
  }

  // Check for missing meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription || !metaDescription.content || metaDescription.content.trim() === '') {
    issues.push({
      type: 'error',
      element: 'meta[name="description"]',
      message: 'Meta description is missing or empty'
    });
  }

  // Check for missing canonical
  const canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical || !canonical.href) {
    issues.push({
      type: 'warning',
      element: 'link[rel="canonical"]',
      message: 'Canonical URL is missing'
    });
  }

  // Check for missing OG image
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (!ogImage || !ogImage.content) {
    issues.push({
      type: 'warning',
      element: 'meta[property="og:image"]',
      message: 'Open Graph image is missing'
    });
  }

  // Check for images without alt text
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.alt || img.alt.trim() === '') {
      issues.push({
        type: 'error',
        element: `img[${index}]`,
        message: `Image at index ${index} is missing alt text`
      });
    }
  });

  // Check for images without width/height (CLS prevention)
  images.forEach((img, index) => {
    if (!img.width || !img.height) {
      issues.push({
        type: 'warning',
        element: `img[${index}]`,
        message: `Image at index ${index} is missing width/height attributes (may cause CLS)`
      });
    }
  });

  // Check for missing heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let h1Count = 0;
  headings.forEach(h => {
    if (h.tagName === 'H1') h1Count++;
  });
  if (h1Count === 0) {
    issues.push({
      type: 'error',
      element: 'h1',
      message: 'Page is missing an H1 heading'
    });
  } else if (h1Count > 1) {
    issues.push({
      type: 'warning',
      element: 'h1',
      message: `Page has ${h1Count} H1 headings (should have only one)`
    });
  }

  // Check for links without href or aria-label
  const links = document.querySelectorAll('a');
  links.forEach((link, index) => {
    if (!link.href && !link.getAttribute('aria-label')) {
      issues.push({
        type: 'warning',
        element: `a[${index}]`,
        message: `Link at index ${index} is missing href and aria-label`
      });
    }
  });

  // Check for buttons without accessible labels
  const buttons = document.querySelectorAll('button');
  buttons.forEach((button, index) => {
    const hasText = button.textContent && button.textContent.trim() !== '';
    const hasAriaLabel = button.getAttribute('aria-label');
    const hasTitle = button.getAttribute('title');
    if (!hasText && !hasAriaLabel && !hasTitle) {
      issues.push({
        type: 'warning',
        element: `button[${index}]`,
        message: `Button at index ${index} is missing accessible label (text, aria-label, or title)`
      });
    }
  });

  // Check for structured data
  const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
  if (structuredData.length === 0) {
    issues.push({
      type: 'warning',
      element: 'script[type="application/ld+json"]',
      message: 'No structured data (JSON-LD) found on page'
    });
  }

  return issues;
}

/**
 * Log SEO issues to console (development only)
 */
export function logSEOIssues() {
  if (import.meta.env.DEV) {
    const issues = checkSEOIssues();
    if (issues.length > 0) {
      console.group('🔍 SEO Issues Detected');
      issues.forEach(issue => {
        const icon = issue.type === 'error' ? '❌' : '⚠️';
        console[issue.type === 'error' ? 'error' : 'warn'](
          `${icon} [${issue.type.toUpperCase()}] ${issue.element}: ${issue.message}`
        );
      });
      console.groupEnd();
    } else {
      console.log('✅ No SEO issues detected');
    }
  }
}

/**
 * Check for broken links (async)
 */
export async function checkBrokenLinks() {
  const links = Array.from(document.querySelectorAll('a[href]'));
  const brokenLinks = [];

  for (const link of links) {
    const href = link.href;
    // Skip external links and anchor links
    if (href.startsWith('http') && !href.includes(window.location.hostname)) {
      continue;
    }
    if (href.startsWith('#')) {
      continue;
    }

    try {
      const response = await fetch(href, { method: 'HEAD', mode: 'no-cors' });
      // Note: 'no-cors' mode doesn't allow checking status, so we can't reliably detect broken links
      // This is a simplified check
    } catch (error) {
      brokenLinks.push({
        url: href,
        element: link,
        error: error.message
      });
    }
  }

  return brokenLinks;
}

/**
 * Monitor Core Web Vitals
 */
export function monitorCoreWebVitals() {
  if (!window.PerformanceObserver) {
    return;
  }

  // Monitor LCP (Largest Contentful Paint)
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      if (import.meta.env.DEV) {
        console.log('📊 LCP:', lastEntry.renderTime || lastEntry.loadTime, 'ms');
      }

      // Report to analytics if needed
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'LCP',
          value: Math.round(lastEntry.renderTime || lastEntry.loadTime)
        });
      }
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
  } catch (e) {
    console.warn('LCP monitoring not supported');
  }

  // Monitor CLS (Cumulative Layout Shift)
  try {
    let clsValue = 0;
    let lastLogTime = 0;
    const LOG_THROTTLE_MS = 2000; // Log at most once every 2 seconds
    
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }

      // Throttle logging to reduce console noise
      const now = Date.now();
      if (import.meta.env.DEV && (now - lastLogTime) > LOG_THROTTLE_MS) {
        console.log('📊 CLS:', clsValue.toFixed(4));
        lastLogTime = now;
      }

      // Report to analytics if needed
      if (window.gtag) {
        window.gtag('event', 'web_vitals', {
          event_category: 'Web Vitals',
          event_label: 'CLS',
          value: Math.round(clsValue * 1000)
        });
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  } catch (e) {
    console.warn('CLS monitoring not supported');
  }

  // Monitor INP (Interaction to Next Paint) - FID fallback
  try {
    const inpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (import.meta.env.DEV) {
          console.log('📊 INP:', entry.processingStart - entry.startTime, 'ms');
        }

        // Report to analytics if needed
        if (window.gtag) {
          window.gtag('event', 'web_vitals', {
            event_category: 'Web Vitals',
            event_label: 'INP',
            value: Math.round(entry.processingStart - entry.startTime)
          });
        }
      }
    });
    inpObserver.observe({ entryTypes: ['first-input'] });
  } catch (e) {
    console.warn('INP monitoring not supported');
  }
}

/**
 * Initialize SEO monitoring
 */
export function initSEOMonitoring() {
  // Check for SEO issues after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        logSEOIssues();
        monitorCoreWebVitals();
      }, 1000); // Wait for dynamic content to load
    });
  } else {
    setTimeout(() => {
      logSEOIssues();
      monitorCoreWebVitals();
    }, 1000);
  }

  // Re-check on route changes (for SPAs)
  window.addEventListener('popstate', () => {
    setTimeout(() => {
      logSEOIssues();
    }, 500);
  });
}

