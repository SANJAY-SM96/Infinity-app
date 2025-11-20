import { useEffect } from 'react';
import { generatePageMetadata, generateOGMetadata, generateTwitterMetadata, generateBreadcrumbSchema, combineSchemas } from '../utils/seoConfig';

/**
 * Custom hook for managing SEO meta tags dynamically
 * @param {Object} seoData - SEO metadata object
 * @param {string} seoData.title - Page title
 * @param {string} seoData.description - Meta description
 * @param {string} seoData.keywords - Meta keywords (comma-separated)
 * @param {string} seoData.image - OG image URL
 * @param {string} seoData.url - Canonical URL
 * @param {string} seoData.type - OG type (website, article, product)
 * @param {Object|Array} seoData.structuredData - JSON-LD structured data (can be single object or array)
 * @param {Object} seoData.breadcrumbs - Breadcrumb data for BreadcrumbList schema
 * @param {boolean} seoData.noindex - Whether to add noindex directive
 */
export function useSEO(seoData) {
  useEffect(() => {
    const {
      title,
      description,
      keywords,
      image,
      url,
      type = 'website',
      structuredData = null,
      breadcrumbs = null,
      noindex = false
    } = seoData;

    // Generate metadata using SEO config
    const pageMeta = generatePageMetadata({
      title,
      description,
      keywords,
      image,
      url: url || window.location.href,
      type,
      noindex
    });

    const ogMeta = generateOGMetadata({
      title: pageMeta.title,
      description: pageMeta.description,
      image: pageMeta.image,
      url: pageMeta.url,
      type
    });

    const twitterMeta = generateTwitterMetadata({
      title: pageMeta.title,
      description: pageMeta.description,
      image: pageMeta.image,
      url: pageMeta.url
    });

    // Update document title
    document.title = pageMeta.title;

    // Update or create meta tags
    const updateMetaTag = (name, content, isProperty = false) => {
      if (!content) return;
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Robots meta tag
    if (noindex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // Primary meta tags
    updateMetaTag('title', pageMeta.title);
    updateMetaTag('description', pageMeta.description);
    if (pageMeta.keywords) {
      updateMetaTag('keywords', pageMeta.keywords);
    }
    
    // Open Graph tags
    Object.entries(ogMeta).forEach(([key, value]) => {
      updateMetaTag(key, value, true);
    });
    
    // Twitter Card tags
    Object.entries(twitterMeta).forEach(([key, value]) => {
      updateMetaTag(key, value);
    });
    
    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageMeta.canonical);

    // Hreflang tags for multi-language support
    const hreflangs = [
      { lang: 'en', href: pageMeta.url },
      { lang: 'en-US', href: pageMeta.url },
      { lang: 'en-GB', href: pageMeta.url },
      { lang: 'en-IN', href: pageMeta.url },
      { lang: 'x-default', href: pageMeta.url }
    ];
    
    // Remove existing hreflang tags
    const existingHreflangs = document.querySelectorAll('link[rel="alternate"][hreflang]');
    existingHreflangs.forEach(link => link.remove());
    
    // Add new hreflang tags
    hreflangs.forEach(({ lang, href }) => {
      const hreflang = document.createElement('link');
      hreflang.setAttribute('rel', 'alternate');
      hreflang.setAttribute('hreflang', lang);
      hreflang.setAttribute('href', href);
      document.head.appendChild(hreflang);
    });

    // Structured Data (JSON-LD) - Support both single object and array
    const existingScripts = document.querySelectorAll('script[type="application/ld+json"][data-dynamic-seo]');
    existingScripts.forEach(script => script.remove());

    const structuredDataArray = [];

    // Add breadcrumbs if provided
    if (breadcrumbs && Array.isArray(breadcrumbs) && breadcrumbs.length > 0) {
      structuredDataArray.push(generateBreadcrumbSchema(breadcrumbs));
    }

    // Add other structured data
    if (structuredData) {
      if (Array.isArray(structuredData)) {
        structuredDataArray.push(...structuredData);
      } else {
        structuredDataArray.push(structuredData);
      }
    }

    // Insert all structured data scripts
    structuredDataArray.forEach((data) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-dynamic-seo', 'true');
      script.textContent = JSON.stringify(data, null, 0);
      document.head.appendChild(script);
    });

    // Cleanup function
    return () => {
      // Structured data scripts are cleaned up on next render
    };
  }, [seoData]);
}

