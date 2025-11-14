const Product = require('../models/Product');
const paginate = require('../utils/paginate');

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
    const product = await Product.findOne({
      $or: [
        { _id: req.params.id },
        { slug: req.params.id }
      ]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Hide category from frontend (admin can see it)
    const isAdmin = req.user && req.user.role === 'admin';
    const productData = product.toObject();
    if (!isAdmin) {
      delete productData.category;
    }

    res.json({
      success: true,
      product: productData
    });
  } catch (error) {
    next(error);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { title, description, price, originalPrice, images, category, brand, stock, specifications, warranty, returnsPolicy } = req.body;

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
      images: Array.isArray(images) ? images : [],
      category,
      brand: brand || undefined,
      stock: stock ? parseInt(stock) : 0,
      specifications: specifications || undefined,
      warranty: warranty || undefined,
      returnsPolicy: returnsPolicy || undefined
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
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      product
    });
  } catch (error) {
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

