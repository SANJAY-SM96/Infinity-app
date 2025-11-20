/**
 * Dynamic Sitemap Generator
 * Generates sitemap entries for all pages, products, and blogs
 */

import { BASE_URL } from './seoConfig';

/**
 * Generate sitemap XML string
 */
export function generateSitemap(entries) {
  const urls = entries
    .map(entry => {
      const {
        url,
        lastmod = new Date().toISOString().split('T')[0],
        changefreq = 'weekly',
        priority = '0.8'
      } = entry;

      return `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`;
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate static page entries
 */
export function getStaticPageEntries() {
  return [
    {
      url: BASE_URL,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '1.0'
    },
    {
      url: `${BASE_URL}/products`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.9'
    },
    {
      url: `${BASE_URL}/about`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.8'
    },
    {
      url: `${BASE_URL}/contact`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.7'
    },
    {
      url: `${BASE_URL}/blog`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      url: `${BASE_URL}/terms-and-conditions`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'yearly',
      priority: '0.5'
    },
    {
      url: `${BASE_URL}/privacy-policy`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'yearly',
      priority: '0.5'
    },
    {
      url: `${BASE_URL}/shipping-policy`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'yearly',
      priority: '0.5'
    },
    {
      url: `${BASE_URL}/cancellations-and-refunds`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'yearly',
      priority: '0.5'
    },
    // Category filter pages
    {
      url: `${BASE_URL}/products?filter=react`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      url: `${BASE_URL}/products?filter=python`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      url: `${BASE_URL}/products?filter=ai-ml`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      url: `${BASE_URL}/products?filter=full-stack`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.8'
    },
    {
      url: `${BASE_URL}/products?filter=mern`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.8'
    }
  ];
}

/**
 * Generate product entries
 */
export function generateProductEntries(products) {
  return products.map(product => ({
    url: `${BASE_URL}/products/${product.slug || product._id}`,
    lastmod: product.updatedAt 
      ? new Date(product.updatedAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    changefreq: 'weekly',
    priority: '0.9'
  }));
}

/**
 * Generate blog entries
 */
export function generateBlogEntries(blogs) {
  return blogs.map(blog => ({
    url: `${BASE_URL}/blog/${blog.slug}`,
    lastmod: blog.updatedAt || blog.publishedAt || blog.createdAt
      ? new Date(blog.updatedAt || blog.publishedAt || blog.createdAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    changefreq: 'monthly',
    priority: '0.7'
  }));
}

/**
 * Generate complete sitemap
 */
export async function generateCompleteSitemap(fetchProducts, fetchBlogs) {
  const entries = getStaticPageEntries();

  try {
    // Fetch and add products
    if (fetchProducts) {
      const products = await fetchProducts();
      entries.push(...generateProductEntries(products));
    }
  } catch (error) {
    console.error('Error fetching products for sitemap:', error);
  }

  try {
    // Fetch and add blogs
    if (fetchBlogs) {
      const blogs = await fetchBlogs();
      entries.push(...generateBlogEntries(blogs));
    }
  } catch (error) {
    console.error('Error fetching blogs for sitemap:', error);
  }

  return generateSitemap(entries);
}

