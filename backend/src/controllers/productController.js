const Product = require('../models/Product');
const paginate = require('../utils/paginate');
const { getFileUrl, deleteFile } = require('../utils/upload');
const path = require('path');
const mongoose = require('mongoose');

exports.listProducts = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);
    const search = req.query.search || '';
    const category = req.query.category || '';
    const filterType = req.query.filterType || ''; // 'trending', 'top-selling', 'new-uploads', 'web-based'
    let sortBy = req.query.sortBy || '-createdAt';
    const isAdmin = req.user && req.user.role === 'admin';

    // Admin can see all products, regular users only see active ones
    let filter = isAdmin ? {} : { isActive: true };

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter (backend only, not exposed to frontend)
    if (category) {
      filter.category = category;
    }

    // Filter type handling
    if (filterType === 'trending') {
      sortBy = '-rating -createdAt';
    } else if (filterType === 'top-selling') {
      sortBy = '-rating -isFeatured';
    } else if (filterType === 'new-uploads') {
      sortBy = '-createdAt';
    } else if (filterType === 'web-based') {
      const webCategories = [
        'React Projects',
        'Vue.js Projects',
        'Angular Projects',
        'Full-Stack Web Apps',
        'MERN Stack',
        'MEAN Stack'
      ];
      filter.category = { $in: webCategories };
    }

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sortBy).skip(skip).limit(limit).select('-category').lean(), // Hide category from frontend
      Product.countDocuments(filter)
    ]);

    res.json({
      success: true,
      products,
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

exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isAdmin = req.user && req.user.role === 'admin';
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[getProduct] Request for product ID/slug: ${id}`);
    }
    
    // Check if id is a valid MongoDB ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[getProduct] Is valid ObjectId: ${isValidObjectId}`);
    }
    
    // Build query: if valid ObjectId, search by both _id and slug, otherwise only by slug
    // Non-admin users can only see active products
    const baseQuery = isValidObjectId
      ? { $or: [{ _id: id }, { slug: id }] }
      : { slug: id };
    
    // Add isActive filter for non-admin users
    const query = isAdmin ? baseQuery : { ...baseQuery, isActive: true };

    if (process.env.NODE_ENV === 'development') {
      console.log(`[getProduct] Query:`, JSON.stringify(query, null, 2));
    }

    const product = await Product.findOne(query);

    if (!product) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`[getProduct] Product not found with query:`, JSON.stringify(query, null, 2));
      }
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    // Hide category from frontend (admin can see it)
    const productData = product.toObject();
    if (!isAdmin) {
      delete productData.category;
    }

    res.json({
      success: true,
      product: productData
    });
  } catch (error) {
    // Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[getProduct] Error:', error);
    }
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    // Handle FormData - parse JSON strings if present
    let specifications = req.body.specifications;
    if (typeof specifications === 'string') {
      try {
        specifications = JSON.parse(specifications);
      } catch (e) {
        specifications = {};
      }
    }
    
    // Parse arrays from FormData - handle both array format and indexed format
    let images = [];
    if (Array.isArray(req.body.images)) {
      images = req.body.images;
    } else if (req.body.images) {
      images = [req.body.images];
    } else {
      // Handle indexed format: images[0], images[1], etc.
      Object.keys(req.body).forEach(key => {
        if (key.startsWith('images[') && key.endsWith(']')) {
          const index = parseInt(key.match(/\[(\d+)\]/)[1]);
          images[index] = req.body[key];
        }
      });
      images = images.filter(Boolean);
    }
    
    let techStack = [];
    if (Array.isArray(req.body.techStack)) {
      techStack = req.body.techStack;
    } else if (req.body.techStack) {
      techStack = [req.body.techStack];
    } else {
      Object.keys(req.body).forEach(key => {
        if (key.startsWith('techStack[') && key.endsWith(']')) {
          const index = parseInt(key.match(/\[(\d+)\]/)[1]);
          techStack[index] = req.body[key];
        }
      });
      techStack = techStack.filter(Boolean);
    }
    
    let features = [];
    if (Array.isArray(req.body.features)) {
      features = req.body.features;
    } else if (req.body.features) {
      features = [req.body.features];
    } else {
      Object.keys(req.body).forEach(key => {
        if (key.startsWith('features[') && key.endsWith(']')) {
          const index = parseInt(key.match(/\[(\d+)\]/)[1]);
          features[index] = req.body[key];
        }
      });
      features = features.filter(Boolean);
    }
    
    const { title, description, price, originalPrice, category, brand, stock, warranty, returnsPolicy, sourceCode, demoVideo, demoUrl } = req.body;

    // Validate required fields
    if (!title || !description || price === undefined || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields',
        errors: [
          !title && { field: 'title', message: 'Title is required' },
          !description && { field: 'description', message: 'Description is required' },
          price === undefined && { field: 'price', message: 'Price is required' },
          !category && { field: 'category', message: 'Category is required' }
        ].filter(Boolean)
      });
    }

    // Validate images
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ 
        message: 'At least one image is required',
        errors: [{ field: 'images', message: 'Please add at least one image' }]
      });
    }

    // Validate source code - either file upload or link required
    let finalSourceCode = sourceCode;
    if (req.file) {
      // File was uploaded, use the file URL
      const baseUrl = req.protocol + '://' + req.get('host');
      finalSourceCode = `${baseUrl}/uploads/${req.file.filename}`;
    } else if (!sourceCode || sourceCode.trim() === '') {
      return res.status(400).json({ 
        message: 'Source code is required',
        errors: [{ field: 'sourceCode', message: 'Please upload a ZIP file or provide a source code link' }]
      });
    }

    // Validate price
    if (price < 0) {
      return res.status(400).json({ 
        message: 'Invalid price',
        errors: [{ field: 'price', message: 'Price must be positive' }]
      });
    }

    // Category validation is handled by mongoose schema enum

    const existingProduct = await Product.findOne({ title });
    if (existingProduct) {
      // If file was uploaded but product creation failed, delete the file
      if (req.file) {
        deleteFile(req.file.filename);
      }
      return res.status(409).json({ 
        message: 'Product with this title already exists',
        errors: [{ field: 'title', message: 'A product with this title already exists' }]
      });
    }

    const product = await Product.create({
      title,
      description,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      images: images,
      category,
      brand: brand || undefined,
      stock: stock ? parseInt(stock) : 0,
      specifications: specifications && Object.keys(specifications).length > 0 ? specifications : undefined,
      warranty: warranty || undefined,
      returnsPolicy: returnsPolicy || undefined,
      sourceCode: finalSourceCode,
      demoVideo: demoVideo || undefined,
      demoUrl: demoUrl || undefined,
      techStack: techStack,
      features: features
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      product
    });
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      return res.status(400).json({ 
        message: 'Validation error',
        errors
      });
    }
    next(error);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    
    // Handle FormData - parse JSON strings if present
    if (updateData.specifications && typeof updateData.specifications === 'string') {
      try {
        updateData.specifications = JSON.parse(updateData.specifications);
      } catch (e) {
        updateData.specifications = {};
      }
    }
    
    // Parse arrays from FormData
    if (updateData.images && !Array.isArray(updateData.images)) {
      updateData.images = updateData.images ? [updateData.images] : [];
    }
    if (updateData.techStack && !Array.isArray(updateData.techStack)) {
      updateData.techStack = updateData.techStack ? [updateData.techStack] : [];
    }
    if (updateData.features && !Array.isArray(updateData.features)) {
      updateData.features = updateData.features ? [updateData.features] : [];
    }

    // Handle source code file upload
    if (req.file) {
      const baseUrl = req.protocol + '://' + req.get('host');
      updateData.sourceCode = `${baseUrl}/uploads/${req.file.filename}`;
      
      // Delete old file if it was a local file
      const oldProduct = await Product.findById(id);
      if (oldProduct && oldProduct.sourceCode && !oldProduct.sourceCode.startsWith('http')) {
        const oldFilename = oldProduct.sourceCode.split('/').pop();
        deleteFile(oldFilename);
      }
    } else if (updateData.sourceCode === '' || updateData.sourceCode === null) {
      // If sourceCode is being cleared, check if we need to keep it
      const oldProduct = await Product.findById(id);
      if (oldProduct && oldProduct.sourceCode) {
        // Keep existing source code if not provided
        delete updateData.sourceCode;
      } else {
        return res.status(400).json({ 
          message: 'Source code is required',
          errors: [{ field: 'sourceCode', message: 'Please upload a ZIP file or provide a source code link' }]
        });
      }
    }

    // Ensure sourceCode is provided (either from file or link)
    if (!updateData.sourceCode) {
      const oldProduct = await Product.findById(id);
      if (!oldProduct || !oldProduct.sourceCode) {
        return res.status(400).json({ 
          message: 'Source code is required',
          errors: [{ field: 'sourceCode', message: 'Please upload a ZIP file or provide a source code link' }]
        });
      }
    }

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!product) {
      // If file was uploaded but product update failed, delete the file
      if (req.file) {
        deleteFile(req.file.filename);
      }
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
    // If file was uploaded but update failed, delete the file
    if (req.file) {
      deleteFile(req.file.filename);
    }
    next(error);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleFeatured = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.json({
      success: true,
      message: 'Product featured status updated',
      product
    });
  } catch (error) {
    next(error);
  }
};

exports.addReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.reviews.push({
      user: req.user._id,
      name: req.user.name,
      rating,
      comment
    });

    // Update product rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = Math.round((totalRating / product.reviews.length) * 10) / 10;

    await product.save();

    res.json({
      success: true,
      message: 'Review added successfully',
      product
    });
  } catch (error) {
    next(error);
  }
};

exports.getFeaturedProducts = async (req, res, next) => {
  try {
    const isAdmin = req.user && req.user.role === 'admin';
    const products = await Product.find({ isFeatured: true, isActive: true })
      .limit(8)
      .lean();

    // Hide category from frontend (admin can see it)
    if (!isAdmin) {
      products.forEach(product => {
        delete product.category;
      });
    }

    res.json({
      success: true,
      products
    });
  } catch (error) {
    next(error);
  }
};

// Filter endpoints - category metadata hidden from frontend
exports.getTrendingProducts = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);
    const filter = { isActive: true };
    
    // Trending = high rating + recent sales (using rating and createdAt)
    const products = await Product.find(filter)
      .sort({ rating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-category') // Hide category from response
      .lean();
    
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
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

exports.getTopSellingProducts = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);
    const filter = { isActive: true };
    
    // Top selling = high rating + featured
    const products = await Product.find(filter)
      .sort({ rating: -1, isFeatured: -1 })
      .skip(skip)
      .limit(limit)
      .select('-category') // Hide category from response
      .lean();
    
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
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

exports.getNewUploads = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);
    const filter = { isActive: true };
    
    // New uploads = most recent
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-category') // Hide category from response
      .lean();
    
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
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

exports.getWebBasedProjects = async (req, res, next) => {
  try {
    const { page, limit, skip } = paginate(req.query.page, req.query.limit);
    // Web-based projects = React, Vue, Angular, Full-Stack, MERN, MEAN
    const webCategories = [
      'React Projects',
      'Vue.js Projects',
      'Angular Projects',
      'Full-Stack Web Apps',
      'MERN Stack',
      'MEAN Stack'
    ];
    
    const filter = { 
      isActive: true,
      category: { $in: webCategories }
    };
    
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-category') // Hide category from response
      .lean();
    
    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
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

