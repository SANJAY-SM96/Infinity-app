/**
 * Comprehensive SEO Configuration System
 * Centralized metadata, structured data, and SEO utilities
 */

const BASE_URL = import.meta.env.VITE_APP_URL || 'https://infinitywebtechnology.com';
const SITE_NAME = 'Infinity';
const COMPANY_NAME = 'Infinity Web Technology';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.jpg`;

/**
 * Generate page metadata
 */
export function generatePageMetadata({
  title,
  description,
  keywords = '',
  tags = [],
  image = DEFAULT_OG_IMAGE,
  url = '',
  type = 'website',
  noindex = false,
  canonical = null
}) {
  // Ensure title is under 60 characters for SEO
  const baseTitle = title || `${SITE_NAME} - IT Project Marketplace | Discover & Share IT Projects Online`;
  const fullTitle = baseTitle.length > 60
    ? `${baseTitle.substring(0, 57)}... | ${SITE_NAME}`
    : `${baseTitle} | ${SITE_NAME}`;

  // Ensure description is under 155 characters for SEO
  let metaDescription = description || `${SITE_NAME} - India's leading IT project marketplace. Discover and share IT projects with complete source code.`;
  if (metaDescription.length > 155) {
    metaDescription = metaDescription.substring(0, 152) + '...';
  }

  // Combine keywords and tags
  const tagsStr = Array.isArray(tags) && tags.length > 0 ? tags.join(', ') : '';
  const combinedKeywords = [keywords, tagsStr].filter(Boolean).join(', ') ||
    'IT projects, React projects, Python projects, AI ML projects, access IT projects, share IT projects, source code, college projects';

  const canonicalUrl = canonical || url || BASE_URL;

  return {
    title: fullTitle,
    description: metaDescription,
    keywords: combinedKeywords,
    image,
    url: canonicalUrl,
    type,
    noindex,
    canonical: canonicalUrl
  };
}

/**
 * Generate Open Graph metadata
 */
export function generateOGMetadata({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  url = BASE_URL,
  type = 'website',
  siteName = SITE_NAME
}) {
  return {
    'og:title': title,
    'og:description': description,
    'og:image': image,
    'og:url': url,
    'og:type': type,
    'og:site_name': siteName,
    'og:image:width': '1200',
    'og:image:height': '630',
    'og:image:alt': title || `${SITE_NAME} - IT Project Marketplace`,
    'og:locale': 'en_US',
    'og:locale:alternate': 'en_GB'
  };
}

/**
 * Generate Twitter Card metadata
 */
export function generateTwitterMetadata({
  title,
  description,
  image = DEFAULT_OG_IMAGE,
  url = BASE_URL,
  card = 'summary_large_image',
  creator = '@infiniitywebtechnology',
  site = '@infiniitywebtechnology'
}) {
  return {
    'twitter:card': card,
    'twitter:site': site,
    'twitter:creator': creator,
    'twitter:title': title,
    'twitter:description': description,
    'twitter:image': image,
    'twitter:image:alt': title || `${SITE_NAME} - IT Project Marketplace`,
    'twitter:url': url
  };
}

/**
 * Generate Product structured data (JSON-LD)
 */
export function generateProductSchema(product, baseUrl = BASE_URL) {
  const productUrl = `${baseUrl}/products/${product.slug || product._id}`;
  const productImage = product.images?.[0] || DEFAULT_OG_IMAGE;
  const price = product.priceINR || product.price || 0;
  const rating = product.rating || 4.5;
  const reviewCount = product.reviews?.length || 0;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images || [productImage],
    sku: product._id,
    mpn: product._id,
    brand: {
      '@type': 'Brand',
      name: COMPANY_NAME
    },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      priceCurrency: 'INR',
      price: price,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Organization',
        name: COMPANY_NAME
      },
      eligibleQuantity: {
        '@type': 'QuantitativeValue',
        value: product.stock || 0
      }
    },
    category: product.category || 'IT Projects'
  };

  // Add tags/keywords if available
  if (product.tags && product.tags.length > 0) {
    schema.keywords = product.tags.join(', ');
  }

  // Add aggregate rating if available
  if (reviewCount > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating,
      reviewCount: reviewCount,
      bestRating: '5',
      worstRating: '1'
    };
  }

  // Add product tags as keywords in structured data
  if (product.tags && Array.isArray(product.tags) && product.tags.length > 0) {
    if (!schema.keywords) {
      schema.keywords = [];
    }
    if (typeof schema.keywords === 'string') {
      schema.keywords = [schema.keywords, ...product.tags];
    } else {
      schema.keywords = [...(schema.keywords || []), ...product.tags];
    }
    schema.keywords = Array.isArray(schema.keywords)
      ? schema.keywords.join(', ')
      : schema.keywords;
  }

  // Add additional properties (tech stack)
  if (product.techStack && product.techStack.length > 0) {
    schema.additionalProperty = product.techStack.map(tech => ({
      '@type': 'PropertyValue',
      name: 'Technology',
      value: tech
    }));
  }

  // Add product features
  if (product.features && product.features.length > 0) {
    schema.additionalProperty = [
      ...(schema.additionalProperty || []),
      ...product.features.map(feature => ({
        '@type': 'PropertyValue',
        name: 'Feature',
        value: feature
      }))
    ];
  }

  return schema;
}

/**
 * Generate Article/Blog structured data (JSON-LD)
 */
export function generateArticleSchema(blog, baseUrl = BASE_URL) {
  const blogUrl = `${baseUrl}/blog/${blog.slug}`;
  const blogImage = blog.featuredImage || blog.image || DEFAULT_OG_IMAGE;
  const publishedDate = blog.publishedAt || blog.createdAt;
  const modifiedDate = blog.updatedAt || publishedDate;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.excerpt || blog.metaDescription || blog.description,
    image: blogImage,
    datePublished: publishedDate,
    dateModified: modifiedDate,
    author: {
      '@type': 'Person',
      name: blog.authorName || 'Admin',
      url: `${baseUrl}/blog`
    },
    publisher: {
      '@type': 'Organization',
      name: COMPANY_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': blogUrl
    },
    keywords: Array.isArray(blog.keywords) ? blog.keywords.join(', ') : blog.keywords || '',
    articleSection: blog.category || 'Technology',
    wordCount: blog.content ? blog.content.replace(/<[^>]*>/g, '').split(/\s+/).length : 0,
    timeRequired: blog.readingTime ? `PT${blog.readingTime}M` : undefined
  };
}

/**
 * Generate Breadcrumb structured data (JSON-LD)
 */
export function generateBreadcrumbSchema(breadcrumbs, baseUrl = BASE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url || `${baseUrl}${item.path || ''}`
    }))
  };
}

/**
 * Generate FAQ structured data (JSON-LD)
 */
export function generateFAQSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generate ItemList structured data for product listing pages
 */
export function generateItemListSchema(products, pageTitle, pageUrl, baseUrl = BASE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: pageTitle,
    description: `Browse ${products.length} IT projects with complete source code`,
    url: pageUrl,
    numberOfItems: products.length,
    itemListElement: products.slice(0, 10).map((product, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        '@id': `${baseUrl}/products/${product.slug || product._id}`,
        name: product.title || `IT Project ${index + 1}`,
        description: product.description || `${product.title || 'IT Project'} with complete source code, documentation, and database.`,
        url: `${baseUrl}/products/${product.slug || product._id}`,
        image: product.images?.[0] || DEFAULT_OG_IMAGE,
        offers: {
          '@type': 'Offer',
          price: product.priceINR || product.price || 0,
          priceCurrency: 'INR',
          availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
        }
      }
    }))
  };
}

/**
 * Generate Organization structured data
 */
export function generateOrganizationSchema(baseUrl = BASE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY_NAME,
    alternateName: SITE_NAME,
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'India\'s leading IT project marketplace offering ready-made projects in React, Python, AI/ML, and Full-Stack technologies.',
    email: 'infinitywebtechnology1@gmail.com',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
      addressRegion: 'India'
    },
    sameAs: [
      'https://www.instagram.com/infiniitywebtechnology/'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'infinitywebtechnology1@gmail.com',
      contactType: 'Customer Service',
      areaServed: 'IN',
      availableLanguage: ['en', 'hi']
    }
  };
}

/**
 * Generate WebSite structured data with search action
 */
export function generateWebSiteSchema(baseUrl = BASE_URL) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: `${SITE_NAME} IT Project Marketplace`,
    url: baseUrl,
    description: 'IT Project Marketplace for students and customers. Discover and share IT projects with complete source code.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/products?search={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: COMPANY_NAME,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    }
  };
}

/**
 * Combine multiple structured data schemas
 */
export function combineSchemas(...schemas) {
  return schemas.filter(Boolean);
}

/**
 * Generate pagination metadata for list pages
 */
export function generatePaginationMetadata(currentPage, totalPages, basePath, baseUrl = BASE_URL) {
  const meta = {
    rel: 'canonical',
    href: `${baseUrl}${basePath}${currentPage === 1 ? '' : `?page=${currentPage}`}`
  };

  if (currentPage > 1) {
    meta.prev = {
      rel: 'prev',
      href: `${baseUrl}${basePath}${currentPage === 2 ? '' : `?page=${currentPage - 1}`}`
    };
  }

  if (currentPage < totalPages) {
    meta.next = {
      rel: 'next',
      href: `${baseUrl}${basePath}?page=${currentPage + 1}`
    };
  }

  return meta;
}

export {
  BASE_URL,
  SITE_NAME,
  COMPANY_NAME,
  DEFAULT_OG_IMAGE
};

