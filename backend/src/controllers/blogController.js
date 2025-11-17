const Blog = require('../models/Blog');
const paginate = require('../utils/paginate');
const { generateBlogPost } = require('../services/blogAIService');
const { generateBlogStructuredData } = require('../services/seoAIService');
const { generateFeaturedImage } = require('../utils/imageGenerator');
const { slugify, generateUniqueSlug } = require('../utils/slugify');

// Get all published blogs
exports.getBlogs = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);
    const { category, tag, search, featured } = req.query;
    const isAdmin = req.user && req.user.role === 'admin';

    let filter = {};
    
    // Non-admin users only see published blogs
    if (!isAdmin) {
      filter.isPublished = true;
      filter.publishedAt = { $lte: new Date() };
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Tag filter
    if (tag) {
      filter.tags = { $in: [tag] };
    }

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Featured filter
    if (featured === 'true') {
      filter.isFeatured = true;
    }

    const sortBy = req.query.sortBy || '-publishedAt';

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .populate('author', 'name email')
        .select('-content') // Don't send full content in list
        .lean(),
      Blog.countDocuments(filter)
    ]);

    res.json({
      success: true,
      blogs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get single blog by slug
exports.getBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const isAdmin = req.user && req.user.role === 'admin';

    let filter = { slug };
    if (!isAdmin) {
      filter.isPublished = true;
      filter.publishedAt = { $lte: new Date() };
    }

    const blog = await Blog.findOne(filter)
      .populate('author', 'name email')
      .lean();

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Increment views
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

    res.json({
      success: true,
      blog: {
        ...blog,
        views: blog.views + 1
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get blog categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Blog.distinct('category', { isPublished: true });
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    next(error);
  }
};

// Get blog tags
exports.getTags = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ isPublished: true }).select('tags').lean();
    const allTags = blogs.flatMap(blog => blog.tags || []);
    const uniqueTags = [...new Set(allTags)];
    
    res.json({
      success: true,
      tags: uniqueTags
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create blog
exports.createBlog = async (req, res, next) => {
  try {
    const blogData = {
      ...req.body,
      author: req.user._id,
      authorName: req.user.name
    };

    // Generate featured image if not provided
    if (!blogData.featuredImage && blogData.title && blogData.category) {
      blogData.featuredImage = generateFeaturedImage(
        blogData.title,
        blogData.category,
        Array.isArray(blogData.keywords) ? blogData.keywords : []
      );
    }

    // Generate slug if not provided - REQUIRED for blog creation
    if (!blogData.slug) {
      if (!blogData.title) {
        return res.status(400).json({ 
          message: 'Title is required to generate slug' 
        });
      }
      
      const baseSlug = slugify(blogData.title);
      blogData.slug = await generateUniqueSlug(
        baseSlug,
        async (slug) => {
          const existing = await Blog.findOne({ slug });
          return !!existing;
        }
      );
    }

    if (blogData.isPublished && !blogData.publishedAt) {
      blogData.publishedAt = new Date();
    }

    const blog = new Blog(blogData);
    await blog.save();

    // Generate structured data for SEO if blog is published
    if (blog.isPublished) {
      try {
        const structuredData = await generateBlogStructuredData({
          title: blog.title,
          excerpt: blog.excerpt,
          featuredImage: blog.featuredImage,
          publishedAt: blog.publishedAt,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          authorName: blog.authorName,
          slug: blog.slug,
          keywords: blog.keywords,
          tags: blog.tags,
          category: blog.category,
          readingTime: blog.readingTime
        });
        blog.structuredData = structuredData;
        await blog.save();
      } catch (error) {
        console.error('Failed to generate structured data:', error);
      }
    }

    res.status(201).json({
      success: true,
      blog
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Blog with this slug already exists' });
    }
    next(error);
  }
};

// Admin: Update blog
exports.updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Get existing blog to check current values
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    // Generate featured image if missing and title/category exists
    if (!updateData.featuredImage && !existingBlog.featuredImage && 
        (updateData.title || existingBlog.title) && 
        (updateData.category || existingBlog.category)) {
      updateData.featuredImage = generateFeaturedImage(
        updateData.title || existingBlog.title,
        updateData.category || existingBlog.category,
        Array.isArray(updateData.keywords) ? updateData.keywords : (existingBlog.keywords || [])
      );
    }

    if (updateData.isPublished && !updateData.publishedAt && !existingBlog.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    // Regenerate structured data if blog is published and content changed
    if (blog.isPublished && (updateData.title || updateData.excerpt || updateData.content)) {
      try {
        const structuredData = await generateBlogStructuredData({
          title: blog.title,
          excerpt: blog.excerpt,
          featuredImage: blog.featuredImage,
          publishedAt: blog.publishedAt,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          authorName: blog.authorName,
          slug: blog.slug,
          keywords: blog.keywords,
          tags: blog.tags,
          category: blog.category,
          readingTime: blog.readingTime
        });
        blog.structuredData = structuredData;
        await blog.save();
      } catch (error) {
        console.error('Failed to regenerate structured data:', error);
      }
    }

    res.json({
      success: true,
      blog
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete blog
exports.deleteBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Generate blog using AI
exports.generateBlog = async (req, res, next) => {
  try {
    const { topic, category, keywords, tone, length } = req.body;

    if (!topic || !category) {
      return res.status(400).json({ 
        message: 'Topic and category are required' 
      });
    }

    const blogContent = await generateBlogPost({
      topic,
      category,
      keywords: keywords || [],
      tone: tone || 'professional',
      length: length || 'medium'
    });

    // Validate that AI generated a title
    if (!blogContent.title || typeof blogContent.title !== 'string' || blogContent.title.trim() === '') {
      return res.status(500).json({ 
        message: 'AI failed to generate blog title. Please try again.' 
      });
    }

    // Generate unique slug from title - REQUIRED before saving
    // This MUST happen before creating the blog instance to prevent validation errors
    let uniqueSlug;
    try {
      const baseSlug = slugify(blogContent.title);
      if (!baseSlug) {
        throw new Error('Failed to generate slug from title');
      }
      
      uniqueSlug = await generateUniqueSlug(
        baseSlug,
        async (slug) => {
          const existing = await Blog.findOne({ slug });
          return !!existing;
        }
      );
      
      if (!uniqueSlug) {
        throw new Error('Failed to generate unique slug');
      }
    } catch (slugError) {
      console.error('Slug generation error:', slugError);
      return res.status(500).json({ 
        message: 'Failed to generate blog slug. Please try again.',
        error: slugError.message 
      });
    }

    // Generate featured image automatically
    const featuredImage = generateFeaturedImage(
      blogContent.title.trim(),
      category,
      Array.isArray(blogContent.keywords) ? blogContent.keywords : (keywords || [])
    );

    // Create blog draft (not published)
    // Ensure slug is ALWAYS included - this is a required field
    const blogData = {
      title: blogContent.title.trim(),
      slug: uniqueSlug, // REQUIRED - Always included before saving
      excerpt: blogContent.excerpt || '',
      content: blogContent.content || '',
      category,
      tags: Array.isArray(blogContent.tags) ? blogContent.tags : (keywords || []),
      featuredImage, // Auto-generated relevant image
      metaTitle: blogContent.metaTitle || blogContent.title.trim(),
      metaDescription: blogContent.metaDescription || blogContent.excerpt || '',
      keywords: Array.isArray(blogContent.keywords) ? blogContent.keywords : (keywords || []),
      author: req.user._id,
      authorName: req.user.name,
      aiGenerated: true,
      aiPrompt: `Topic: ${topic}, Category: ${category}, Tone: ${tone || 'professional'}`,
      imagePrompt: blogContent.imagePrompt || '',
      imageSuggestions: Array.isArray(blogContent.imageSuggestions) ? blogContent.imageSuggestions : [],
      isPublished: false,
      seoScore: typeof blogContent.seoScore === 'number' ? blogContent.seoScore : 0
    };

    // Validate blogData has required fields before creating instance
    if (!blogData.slug || !blogData.title) {
      return res.status(500).json({ 
        message: 'Blog data validation failed: missing required fields (title or slug)' 
      });
    }

    const blog = new Blog(blogData);
    
    try {
      await blog.save();
    } catch (saveError) {
      console.error('Blog save error:', saveError);
      // If slug validation fails, try one more time with a timestamp
      if (saveError.errors && saveError.errors.slug) {
        try {
          const timestamp = Date.now();
          blogData.slug = `${uniqueSlug}-${timestamp}`;
          const retryBlog = new Blog(blogData);
          await retryBlog.save();
          // Use the retry blog
          Object.assign(blog, retryBlog);
        } catch (retryError) {
          return res.status(500).json({ 
            message: 'Failed to save blog. Please try again.',
            error: saveError.message 
          });
        }
      } else {
        return res.status(500).json({ 
          message: 'Failed to save blog. Please try again.',
          error: saveError.message 
        });
      }
    }

    // Generate structured data for SEO
    try {
      const structuredData = await generateBlogStructuredData({
        title: blog.title,
        excerpt: blog.excerpt,
        featuredImage: blog.featuredImage,
        publishedAt: blog.publishedAt,
        createdAt: blog.createdAt,
        updatedAt: blog.updatedAt,
        authorName: blog.authorName,
        slug: blog.slug,
        keywords: blog.keywords,
        tags: blog.tags,
        category: blog.category,
        readingTime: blog.readingTime
      });
      blog.structuredData = structuredData;
      await blog.save();
    } catch (error) {
      console.error('Failed to generate structured data:', error);
      // Don't fail the request if structured data generation fails
    }

    res.status(201).json({
      success: true,
      blog,
      message: 'Blog generated successfully. Review and publish when ready.'
    });
  } catch (error) {
    console.error('AI blog generation error:', error);
    res.status(500).json({
      message: 'Failed to generate blog',
      error: error.message
    });
  }
};

// Admin: Get all blogs (including unpublished)
exports.getAllBlogs = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);
    const { category, search, published } = req.query;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (published !== undefined) {
      filter.isPublished = published === 'true';
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }

    const [blogs, total] = await Promise.all([
      Blog.find(filter)
        .sort('-createdAt')
        .skip(skip)
        .limit(limit)
        .populate('author', 'name email')
        .lean(),
      Blog.countDocuments(filter)
    ]);

    res.json({
      success: true,
      blogs,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

// Generate structured data for a blog
exports.generateStructuredData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id).lean();

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const structuredData = await generateBlogStructuredData({
      title: blog.title,
      excerpt: blog.excerpt,
      featuredImage: blog.featuredImage,
      publishedAt: blog.publishedAt,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
      authorName: blog.authorName,
      slug: blog.slug,
      keywords: blog.keywords,
      tags: blog.tags,
      category: blog.category,
      readingTime: blog.readingTime
    });

    // Update blog with structured data
    await Blog.findByIdAndUpdate(id, { structuredData });

    res.json({
      success: true,
      structuredData
    });
  } catch (error) {
    console.error('Structured data generation error:', error);
    res.status(500).json({
      message: 'Failed to generate structured data',
      error: error.message
    });
  }
};

