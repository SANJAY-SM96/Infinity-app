require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const User = require('../models/User');
const { generateBlogPost } = require('../services/blogAIService');
const connectDB = require('../config/db');

// Blog topics related to your IT project marketplace
const blogTopics = [
  {
    topic: 'Complete Guide to React Projects for College Students',
    category: 'React Projects',
    keywords: ['React', 'React projects', 'college projects', 'final year projects', 'React tutorials'],
    tone: 'educational'
  },
  {
    topic: 'Best Python Projects for Final Year Students',
    category: 'Python Projects',
    keywords: ['Python', 'Python projects', 'final year projects', 'college projects', 'Python programming'],
    tone: 'professional'
  },
  {
    topic: 'How to Build a Full-Stack E-Commerce Website',
    category: 'Full-Stack Projects',
    keywords: ['Full-stack', 'E-commerce', 'MERN stack', 'web development', 'online shopping'],
    tone: 'technical'
  },
  {
    topic: 'AI and Machine Learning Projects for Beginners',
    category: 'AI/ML Projects',
    keywords: ['AI', 'Machine Learning', 'ML projects', 'artificial intelligence', 'data science'],
    tone: 'friendly'
  },
  {
    topic: 'Top 10 Web Development Projects to Build in 2025',
    category: 'Web Development',
    keywords: ['Web development', 'web projects', 'frontend', 'backend', 'full-stack development'],
    tone: 'professional'
  },
  {
    topic: 'MERN Stack vs MEAN Stack: Which Should You Choose?',
    category: 'Tutorials',
    keywords: ['MERN stack', 'MEAN stack', 'web development', 'JavaScript', 'Node.js'],
    tone: 'technical'
  },
  {
    topic: 'How to Buy IT Projects Online: A Complete Guide',
    category: 'Tutorials',
    keywords: ['buy IT projects', 'online projects', 'source code', 'project marketplace', 'IT projects'],
    tone: 'friendly'
  },
  {
    topic: 'React Hooks Explained: useState, useEffect, and More',
    category: 'React Projects',
    keywords: ['React Hooks', 'useState', 'useEffect', 'React tutorials', 'React development'],
    tone: 'educational'
  },
  {
    topic: 'Building RESTful APIs with Node.js and Express',
    category: 'Full-Stack Projects',
    keywords: ['Node.js', 'Express', 'REST API', 'backend development', 'API design'],
    tone: 'technical'
  },
  {
    topic: 'Mobile App Development: React Native vs Flutter',
    category: 'Mobile Development',
    keywords: ['React Native', 'Flutter', 'mobile development', 'app development', 'cross-platform'],
    tone: 'professional'
  },
  {
    topic: 'Database Design Best Practices for Web Applications',
    category: 'Web Development',
    keywords: ['Database', 'MongoDB', 'MySQL', 'database design', 'data modeling'],
    tone: 'technical'
  },
  {
    topic: 'SEO Optimization Tips for IT Project Websites',
    category: 'Industry News',
    keywords: ['SEO', 'search engine optimization', 'website SEO', 'Google ranking', 'SEO tips'],
    tone: 'professional'
  },
  {
    topic: 'Why Buy Ready-Made IT Projects Instead of Building from Scratch',
    category: 'Industry News',
    keywords: ['buy projects', 'ready-made projects', 'IT projects', 'source code', 'project marketplace'],
    tone: 'friendly'
  },
  {
    topic: 'Top Programming Languages to Learn in 2025',
    category: 'Industry News',
    keywords: ['programming languages', 'JavaScript', 'Python', 'career', 'coding'],
    tone: 'professional'
  },
  {
    topic: 'Complete Guide to Authentication in Web Applications',
    category: 'Tutorials',
    keywords: ['authentication', 'JWT', 'OAuth', 'login system', 'user authentication'],
    tone: 'technical'
  }
];

async function generateAllBlogs() {
  try {
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Get admin user
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      console.error('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    console.log(`\n📝 Generating ${blogTopics.length} blog posts...\n`);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < blogTopics.length; i++) {
      const topicData = blogTopics[i];
      console.log(`[${i + 1}/${blogTopics.length}] Generating: ${topicData.topic}`);

      try {
        // Check if blog already exists
        const existingBlog = await Blog.findOne({ 
          title: { $regex: new RegExp(topicData.topic, 'i') } 
        });

        if (existingBlog) {
          console.log(`   ⚠️  Blog already exists, skipping...\n`);
          continue;
        }

        // Generate blog content
        const blogContent = await generateBlogPost({
          topic: topicData.topic,
          category: topicData.category,
          keywords: topicData.keywords,
          tone: topicData.tone,
          length: 'medium'
        });

        // Create blog (as draft, admin can publish later)
        const blog = new Blog({
          title: blogContent.title,
          excerpt: blogContent.excerpt,
          content: blogContent.content,
          category: topicData.category,
          tags: blogContent.tags || topicData.keywords,
          metaTitle: blogContent.metaTitle || blogContent.title,
          metaDescription: blogContent.metaDescription || blogContent.excerpt,
          keywords: blogContent.keywords || topicData.keywords,
          author: admin._id,
          authorName: admin.name,
          aiGenerated: true,
          aiPrompt: `Topic: ${topicData.topic}, Category: ${topicData.category}, Tone: ${topicData.tone}`,
          isPublished: false, // Start as draft
          seoScore: blogContent.seoScore || 75
        });

        await blog.save();
        console.log(`   ✅ Generated successfully!\n`);
        successCount++;

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`   ❌ Error: ${error.message}\n`);
        errorCount++;
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`\n💡 Tip: Review the generated blogs in the admin panel and publish them when ready!\n`);

    process.exit(0);
  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateAllBlogs();
}

module.exports = { generateAllBlogs };

