const ProjectRequest = require('../models/ProjectRequest');
const aiService = require('../services/aiService');

// Create project request
exports.createProjectRequest = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      projectTitle,
      description,
      domain,
      budget,
      currency,
      techStack,
      features,
      timeline
    } = req.body;

    // Validate required fields
    if (!name || !email || !projectTitle || !description || !domain || !budget) {
      return res.status(400).json({
        message: 'Please provide all required fields: name, email, projectTitle, description, domain, budget'
      });
    }

    // Create project request
    // Check if user is authenticated (optional middleware sets req.user if token exists)
    const userId = req.user && req.user._id ? req.user._id : null;
    
    const projectRequest = new ProjectRequest({
      user: userId,
      name,
      email,
      phone: phone || '',
      projectTitle,
      description,
      domain,
      budget: parseFloat(budget),
      currency: 'INR',
      techStack: techStack || [],
      features: features || [],
      timeline: timeline || '',
      status: 'pending'
    });

    // Use AI to analyze requirements if available
    try {
      if (aiService.isAIAvailable()) {
        const analysis = await aiService.analyzeProjectRequirements({
          projectTitle,
          description,
          domain,
          budget: parseFloat(budget),
          currency: currency || 'USD'
        });
        projectRequest.aiAnalysis = analysis;
        
        // Update tech stack and features if AI provided them
        if (analysis.techStack && analysis.techStack.length > 0) {
          projectRequest.techStack = analysis.techStack;
        }
        if (analysis.features && analysis.features.length > 0) {
          projectRequest.features = analysis.features;
        }
        if (analysis.complexity) {
          projectRequest.priority = analysis.complexity === 'high' ? 'high' : 
                                   analysis.complexity === 'medium' ? 'medium' : 'low';
        }
      }
    } catch (aiError) {
      console.error('AI analysis error (non-blocking):', aiError);
      // Continue without AI analysis
    }

    await projectRequest.save();

    res.status(201).json({
      success: true,
      message: 'Project request submitted successfully',
      projectRequest
    });
  } catch (error) {
    console.error('Create project request error:', error);
    next(error);
  }
};

// Get all project requests (admin only)
exports.getAllProjectRequests = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10, search } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by status if provided
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { projectTitle: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { domain: { $regex: search, $options: 'i' } }
      ];
    }

    // Get pagination parameters
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    // Fetch project requests
    const projectRequests = await ProjectRequest.find(query)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })
      .limit(limitNum)
      .skip(skip);

    // Get total count
    const total = await ProjectRequest.countDocuments(query);

    res.json({
      success: true,
      requests: projectRequests,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get all project requests error:', error);
    next(error);
  }
};

// Get project request by ID
exports.getProjectRequestById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const projectRequest = await ProjectRequest.findById(id)
      .populate('user', 'name email')
      .populate('assignedTo', 'name email');

    if (!projectRequest) {
      return res.status(404).json({ message: 'Project request not found' });
    }

    res.json({
      success: true,
      projectRequest
    });
  } catch (error) {
    next(error);
  }
};

// Update project request status (admin only)
exports.updateProjectRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, priority, adminNotes, assignedTo } = req.body;

    const projectRequest = await ProjectRequest.findById(id);

    if (!projectRequest) {
      return res.status(404).json({ message: 'Project request not found' });
    }

    if (status) projectRequest.status = status;
    if (priority) projectRequest.priority = priority;
    if (adminNotes !== undefined) projectRequest.adminNotes = adminNotes;
    if (assignedTo) projectRequest.assignedTo = assignedTo;

    await projectRequest.save();

    res.json({
      success: true,
      message: 'Project request updated successfully',
      projectRequest
    });
  } catch (error) {
    next(error);
  }
};

// Delete project request (admin only)
exports.deleteProjectRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const projectRequest = await ProjectRequest.findByIdAndDelete(id);

    if (!projectRequest) {
      return res.status(404).json({ message: 'Project request not found' });
    }

    res.json({
      success: true,
      message: 'Project request deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get user's project requests
exports.getUserProjectRequests = async (req, res, next) => {
  try {
    const projectRequests = await ProjectRequest.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      projectRequests
    });
  } catch (error) {
    next(error);
  }
};

