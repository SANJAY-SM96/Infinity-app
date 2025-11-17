const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');

// Initialize AI services
let geminiClient = null;
let openaiClient = null;

if (process.env.GEMINI_API_KEY) {
  geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

if (process.env.OPENAI_API_KEY) {
  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

const getAIProvider = () => {
  if (geminiClient && process.env.AI_PROVIDER !== 'openai') {
    return 'gemini';
  } else if (openaiClient) {
    return 'openai';
  }
  return null;
};

// Helper function to sleep/delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to call Gemini API with retry logic for a single model
const callGeminiModelWithRetry = async (modelName, prompt, retryCount = 0, maxRetries = 3) => {
  try {
    const model = geminiClient.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }
    
    return text;
  } catch (error) {
    // Check if it's a retryable error (503/overloaded) and we haven't exceeded retries
    const errorMessage = error.message || error.toString() || '';
    const isRetryable = error.status === 503 || 
                       errorMessage.includes('overloaded') || 
                       errorMessage.includes('503') ||
                       errorMessage.includes('Service Unavailable');
    
    if (isRetryable && retryCount < maxRetries) {
      // Exponential backoff: wait 1s, 2s, 4s...
      const delay = Math.pow(2, retryCount) * 1000;
      console.log(`Model ${modelName} overloaded, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})...`);
      await sleep(delay);
      return callGeminiModelWithRetry(modelName, prompt, retryCount + 1, maxRetries);
    }
    
    // Not retryable or max retries reached, throw the error
    throw error;
  }
};

// Helper function to call Gemini API with better error handling
const callGeminiAPI = async (prompt, options = {}) => {
  // Use current Gemini model names (as of 2025)
  // Try gemini-2.5-flash first (fastest, recommended), then gemini-2.5-pro, then gemini-2.0-flash
  // Note: gemini-1.5-* and gemini-pro are deprecated and no longer available
  const modelNames = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'];
  let lastError = null;
  
  for (const modelName of modelNames) {
    try {
      return await callGeminiModelWithRetry(modelName, prompt);
    } catch (error) {
      // Check if it's a 404/model not found error (try next model)
      const errorMessage = error.message || error.toString() || '';
      const isNotFound = errorMessage.includes('404') || 
                        errorMessage.includes('not found') || 
                        errorMessage.includes('Not Found') ||
                        error.code === 404 ||
                        error.status === 404;
      
      if (isNotFound) {
        console.warn(`Model ${modelName} not available (404), trying next model...`);
        lastError = error;
        continue;
      }
      
      // Check if it's a 503/overloaded error - wait before trying next model
      const isOverloaded = error.status === 503 || 
                          errorMessage.includes('overloaded') || 
                          errorMessage.includes('503') ||
                          errorMessage.includes('Service Unavailable');
      
      if (isOverloaded) {
        console.warn(`Model ${modelName} overloaded, waiting before trying next model...`);
        lastError = error;
        // Wait a bit before trying the next model
        await sleep(1000);
        continue;
      }
      
      // For other errors, log and rethrow
      console.error(`Gemini API error with model ${modelName}:`, {
        message: error.message,
        code: error.code,
        status: error.status || error.response?.status,
        statusText: error.response?.statusText,
        name: error.name
      });
      throw new Error(`Gemini API error (${modelName}): ${error.message}`);
    }
  }
  
  // If all models failed
  let errorMessage = 'All Gemini models failed';
  if (lastError) {
    if (lastError.message?.includes('overloaded') || lastError.status === 503) {
      errorMessage = 'AI service is currently overloaded. Please try again in a few moments.';
    } else {
      errorMessage = `All Gemini models failed. Last error: ${lastError.message}`;
    }
  }
  throw new Error(errorMessage);
};

/**
 * Generate SEO-optimized meta description
 */
exports.generateMetaDescription = async (productTitle, productDescription, keywords = []) => {
  try {
    const provider = getAIProvider();
    if (!provider) {
      throw new Error('No AI provider configured');
    }

    const prompt = `Generate a compelling SEO-optimized meta description (150-160 characters) for an IT project marketplace product.

Product Title: ${productTitle}
Product Description: ${productDescription}
Keywords: ${keywords.join(', ')}

Requirements:
- Exactly 150-160 characters
- Include primary keywords naturally
- Include call-to-action (buy, download, etc.)
- Mention key benefits (source code, documentation, etc.)
- Include price if available
- Make it compelling and click-worthy

Return ONLY the meta description text, no quotes, no explanation.`;

    if (provider === 'gemini') {
      const text = await callGeminiAPI(prompt);
      return text.trim().replace(/^["']|["']$/g, '');
    } else if (provider === 'openai') {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert. Generate concise, compelling meta descriptions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 100
      });
      return completion.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
    }
  } catch (error) {
    console.error('Meta description generation error:', error);
    throw error;
  }
};

/**
 * Generate SEO-optimized page title
 */
exports.generatePageTitle = async (productTitle, category, keywords = []) => {
  try {
    const provider = getAIProvider();
    if (!provider) {
      throw new Error('No AI provider configured');
    }

    const prompt = `Generate an SEO-optimized page title (50-60 characters) for an IT project.

Product Title: ${productTitle}
Category: ${category}
Keywords: ${keywords.join(', ')}

Requirements:
- Exactly 50-60 characters
- Include primary keyword at the beginning
- Include brand name "Infinity" or "Infinity Marketplace"
- Include value proposition (buy, source code, etc.)
- Make it compelling and search-friendly

Return ONLY the title text, no quotes, no explanation.`;

    if (provider === 'gemini') {
      const text = await callGeminiAPI(prompt);
      return text.trim().replace(/^["']|["']$/g, '');
    } else if (provider === 'openai') {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert. Generate concise, keyword-rich page titles.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 80
      });
      return completion.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
    }
  } catch (error) {
    console.error('Page title generation error:', error);
    throw error;
  }
};

/**
 * Generate SEO-optimized product description
 */
exports.generateProductDescription = async (productTitle, techStack, features, category) => {
  try {
    const provider = getAIProvider();
    if (!provider) {
      throw new Error('No AI provider configured');
    }

    const prompt = `Generate an SEO-optimized product description (200-300 words) for an IT project marketplace.

Product Title: ${productTitle}
Technology Stack: ${techStack.join(', ')}
Key Features: ${features.join(', ')}
Category: ${category}

Requirements:
- 200-300 words
- Include primary keywords naturally (at least 3-5 times)
- Include secondary keywords
- Mention benefits (complete source code, documentation, database, etc.)
- Include use cases (college projects, final year projects, professional use)
- Make it compelling and informative
- Use proper headings structure suggestions
- Include call-to-action

Format as JSON:
{
  "description": "full description text",
  "keywords": ["keyword1", "keyword2", ...],
  "headings": {
    "h2": ["heading1", "heading2", ...]
  },
  "seoTips": "SEO optimization tips for this product"
}`;

    if (provider === 'gemini') {
      const text = await callGeminiAPI(prompt + '\n\nPlease respond with valid JSON only.');
      
      // Extract JSON
      let jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        jsonMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1]);
        }
        jsonMatch = text.match(/```\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1]);
        }
      }
      
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
        }
      }
      
      // Fallback
      return {
        description: text,
        keywords: techStack,
        headings: { h2: ['Features', 'Technology Stack', 'Use Cases'] },
        seoTips: 'Add more keywords and improve content structure'
      };
    } else if (provider === 'openai') {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO expert. Generate optimized product descriptions with keyword suggestions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
      });
      return JSON.parse(completion.choices[0].message.content);
    }
  } catch (error) {
    console.error('Product description generation error:', error);
    throw error;
  }
};

/**
 * Generate keyword suggestions for SEO
 */
exports.generateKeywordSuggestions = async (productTitle, category, techStack) => {
  try {
    const provider = getAIProvider();
    if (!provider) {
      throw new Error('No AI provider configured');
    }

    const prompt = `Generate 20 SEO keyword suggestions for an IT project marketplace product.

Product Title: ${productTitle}
Category: ${category}
Tech Stack: ${techStack.join(', ')}

Include:
- Primary keywords (high search volume)
- Long-tail keywords (specific searches)
- Question-based keywords
- Local keywords (India, Indian)
- Action keywords (buy, download, get, etc.)

Return as JSON array:
{
  "primaryKeywords": ["keyword1", "keyword2", ...],
  "longTailKeywords": ["long tail keyword 1", ...],
  "questionKeywords": ["question keyword 1", ...],
  "localKeywords": ["local keyword 1", ...],
  "actionKeywords": ["action keyword 1", ...]
}`;

    if (provider === 'gemini') {
      const text = await callGeminiAPI(prompt + '\n\nPlease respond with valid JSON only.');
      
      let jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        jsonMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1]);
        }
      }
      
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
        }
      }
      
      // Fallback
      return {
        primaryKeywords: [`${productTitle}`, `${category} project`, 'IT project'],
        longTailKeywords: [`buy ${productTitle} online`, `${category} project with source code`],
        questionKeywords: [`where to buy ${category} projects`, `best ${category} projects`],
        localKeywords: [`${category} projects India`, 'IT projects India'],
        actionKeywords: ['buy IT projects', 'download source code', 'get project']
      };
    } else if (provider === 'openai') {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO keyword research expert.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8
      });
      return JSON.parse(completion.choices[0].message.content);
    }
  } catch (error) {
    console.error('Keyword generation error:', error);
    throw error;
  }
};

/**
 * Generate blog post ideas for SEO content marketing
 */
exports.generateBlogPostIdeas = async (category, techStack) => {
  try {
    const provider = getAIProvider();
    if (!provider) {
      throw new Error('No AI provider configured');
    }

    const prompt = `Generate 10 blog post ideas for an IT project marketplace website.

Category: ${category}
Tech Stack: ${techStack.join(', ')}

Focus on:
- SEO-friendly titles
- Topics that attract potential customers
- Educational content
- How-to guides
- Project tutorials
- Industry trends

Return as JSON:
{
  "blogPosts": [
    {
      "title": "SEO-optimized blog title",
      "description": "Brief description",
      "targetKeywords": ["keyword1", "keyword2"],
      "estimatedWordCount": 1500
    }
  ]
}`;

    if (provider === 'gemini') {
      const text = await callGeminiAPI(prompt + '\n\nPlease respond with valid JSON only.');
      
      let jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        jsonMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1]);
        }
      }
      
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
        }
      }
      
      return {
        blogPosts: [
          {
            title: `Complete Guide to ${category} Projects for College Students`,
            description: `Learn everything about ${category} projects`,
            targetKeywords: [`${category} projects`, 'college projects'],
            estimatedWordCount: 2000
          }
        ]
      };
    } else if (provider === 'openai') {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a content marketing expert specializing in SEO.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8
      });
      return JSON.parse(completion.choices[0].message.content);
    }
  } catch (error) {
    console.error('Blog post generation error:', error);
    throw error;
  }
};

/**
 * Analyze and improve existing content for SEO
 */
exports.analyzeContentSEO = async (content, targetKeywords) => {
  try {
    const provider = getAIProvider();
    if (!provider) {
      throw new Error('No AI provider configured');
    }

    const prompt = `Analyze the following content for SEO optimization.

Content: ${content}
Target Keywords: ${targetKeywords.join(', ')}

Provide analysis as JSON:
{
  "score": 85,
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "keywordDensity": {
    "keyword1": 2.5,
    "keyword2": 1.8
  },
  "suggestions": [
    "suggestion1",
    "suggestion2"
  ],
  "improvedContent": "improved version of content"
}`;

    if (provider === 'gemini') {
      const text = await callGeminiAPI(prompt + '\n\nPlease respond with valid JSON only.');
      
      let jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        jsonMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1]);
        }
      }
      
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
        }
      }
      
      return {
        score: 70,
        strengths: ['Content is readable', 'Has some keywords'],
        weaknesses: ['Low keyword density', 'Needs more optimization'],
        keywordDensity: {},
        suggestions: ['Add more target keywords', 'Improve content structure'],
        improvedContent: content
      };
    } else if (provider === 'openai') {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an SEO content analyst. Analyze content and provide improvement suggestions.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
      });
      return JSON.parse(completion.choices[0].message.content);
    }
  } catch (error) {
    console.error('Content analysis error:', error);
    throw error;
  }
};

/**
 * Generate structured data for blog post (Article schema)
 */
exports.generateBlogStructuredData = async (blogData) => {
  try {
    const provider = getAIProvider();
    if (!provider) {
      throw new Error('No AI provider configured');
    }

    const prompt = `Generate JSON-LD structured data for a blog post/article following Schema.org Article schema.

Blog Data:
${JSON.stringify(blogData, null, 2)}

Generate complete Article schema with:
- @context: "https://schema.org"
- @type: "BlogPosting" or "Article"
- headline: blog title
- description: blog excerpt/description
- image: featured image URL (if available)
- datePublished: publication date
- dateModified: last modified date
- author: author information with @type Person
- publisher: organization information
- mainEntityOfPage: canonical URL
- keywords: array of keywords
- articleSection: category
- wordCount: estimated word count
- timeRequired: reading time in ISO 8601 duration format

Return ONLY valid JSON-LD as JSON object, no explanation.`;

    if (provider === 'gemini') {
      const text = await callGeminiAPI(prompt + '\n\nPlease respond with valid JSON only.');
      
      let jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        jsonMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1]);
        }
      }
      
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
        }
      }
      
      // Fallback - basic Article schema
      // Use CLIENT_URL if available, otherwise FRONTEND_URL, with safe fallback
      const baseUrl = process.env.CLIENT_URL?.split(',')[0]?.trim() || 
                      process.env.FRONTEND_URL || 
                      (process.env.NODE_ENV === 'production' ? 'https://infinitywebtechnology.com' : 'http://localhost:5173');
      return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blogData.title || '',
        description: blogData.excerpt || blogData.metaDescription || '',
        image: blogData.featuredImage || `${baseUrl}/og-image.jpg`,
        datePublished: blogData.publishedAt || blogData.createdAt || new Date().toISOString(),
        dateModified: blogData.updatedAt || blogData.publishedAt || new Date().toISOString(),
        author: {
          '@type': 'Person',
          name: blogData.authorName || 'Admin'
        },
        publisher: {
          '@type': 'Organization',
          name: 'Infinity Web Technology',
          logo: {
            '@type': 'ImageObject',
            url: `${baseUrl}/logo.png`
          }
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${baseUrl}/blog/${blogData.slug || ''}`
        },
        keywords: blogData.keywords || blogData.tags || [],
        articleSection: blogData.category || ''
      };
    } else if (provider === 'openai') {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a structured data expert. Generate valid JSON-LD schemas for blog posts following Schema.org Article schema.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5
      });
      return JSON.parse(completion.choices[0].message.content);
    }
  } catch (error) {
    console.error('Blog structured data generation error:', error);
    throw error;
  }
};

/**
 * Generate structured data suggestions
 */
exports.generateStructuredData = async (productData) => {
  try {
    const provider = getAIProvider();
    if (!provider) {
      throw new Error('No AI provider configured');
    }

    const prompt = `Generate JSON-LD structured data for a product in an IT project marketplace.

Product Data:
${JSON.stringify(productData, null, 2)}

Generate complete Product schema with:
- All required fields
- Offers with pricing
- AggregateRating if reviews exist
- Brand information
- Category
- Additional properties

Return ONLY valid JSON-LD, no explanation.`;

    if (provider === 'gemini') {
      const text = await callGeminiAPI(prompt + '\n\nPlease respond with valid JSON only.');
      
      let jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        jsonMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[1]);
        }
      }
      
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
        }
      }
      
      // Fallback - basic structure
      return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: productData.title,
        description: productData.description
      };
    } else if (provider === 'openai') {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a structured data expert. Generate valid JSON-LD schemas.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5
      });
      return JSON.parse(completion.choices[0].message.content);
    }
  } catch (error) {
    console.error('Structured data generation error:', error);
    throw error;
  }
};

// Check if AI service is available
exports.isAIAvailable = () => {
  return getAIProvider() !== null;
};

// Get AI provider name
exports.getAIProviderName = () => {
  return getAIProvider() || 'none';
};

