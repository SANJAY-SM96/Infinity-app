const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Blog = require('../models/Blog');

/**
 * Dynamic Sitemap Generation
 * GET /api/seo/sitemap.xml
 */
router.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = process.env.FRONTEND_URL || 'https://infinitywebtechnology.com';
    const entries = [];

    // Static pages
    entries.push({
      url: baseUrl,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '1.0'
    });

    entries.push({
      url: `${baseUrl}/products`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.9'
    });

    entries.push({
      url: `${baseUrl}/about`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.8'
    });

    entries.push({
      url: `${baseUrl}/contact`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.7'
    });

    entries.push({
      url: `${baseUrl}/blog`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: '0.8'
    });

    // Category filter pages
    const categories = ['react', 'python', 'ai-ml', 'full-stack', 'mern'];
    categories.forEach(category => {
      entries.push({
        url: `${baseUrl}/products?filter=${category}`,
        lastmod: new Date().toISOString().split('T')[0],
        changefreq: 'daily',
        priority: '0.8'
      });
    });

    // Product pages
    try {
      const products = await Product.find({ isActive: true })
        .select('slug _id updatedAt')
        .lean()
        .limit(10000); // Limit to prevent huge sitemaps

      products.forEach(product => {
        entries.push({
          url: `${baseUrl}/products/${product.slug || product._id}`,
          lastmod: product.updatedAt
            ? new Date(product.updatedAt).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          changefreq: 'weekly',
          priority: '0.9'
        });
      });
    } catch (error) {
      console.error('Error fetching products for sitemap:', error);
    }

    // Blog pages
    try {
      const blogs = await Blog.find({ isPublished: true })
        .select('slug updatedAt publishedAt createdAt')
        .lean()
        .limit(1000);

      blogs.forEach(blog => {
        entries.push({
          url: `${baseUrl}/blog/${blog.slug}`,
          lastmod: (blog.updatedAt || blog.publishedAt || blog.createdAt)
            ? new Date(blog.updatedAt || blog.publishedAt || blog.createdAt).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.7'
        });
      });
    } catch (error) {
      console.error('Error fetching blogs for sitemap:', error);
    }

    // Generate XML
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

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls}
</urlset>`;

    res.set('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

function escapeXml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

module.exports = router;

