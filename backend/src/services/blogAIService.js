const { GoogleGenerativeAI } = require('@google/generative-ai');
const OpenAI = require('openai');
const { parseJSONSafely, sanitizeJSON, validateJSONStructure } = require('../utils/jsonSanitizer');

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

// Helper function to call Gemini API
const callGeminiAPI = async (prompt) => {
  const modelNames = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash'];
  let lastError = null;
  
  for (const modelName of modelNames) {
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
      const errorMessage = error.message || error.toString() || '';
      const isNotFound = errorMessage.includes('404') || 
                        errorMessage.includes('not found') || 
                        errorMessage.includes('Not Found');
      
      if (isNotFound) {
        lastError = error;
        continue;
      }
      throw new Error(`Gemini API error (${modelName}): ${error.message}`);
    }
  }
  
  throw new Error(`All Gemini models failed. Last error: ${lastError?.message}`);
};

/**
 * Generate a complete blog post using AI
 */
exports.generateBlogPost = async (options) => {
  try {
    const { topic, category, keywords = [], tone = 'professional', length = 'medium' } = options;
    
    const provider = getAIProvider();
    if (!provider) {
      throw new Error('No AI provider configured');
    }

    const lengthWords = {
      short: 500,
      medium: 1500,
      long: 3000
    };

    const targetWords = lengthWords[length] || 1500;

    const systemPrompt = `You are an expert SEO content writer. You MUST ALWAYS respond with valid JSON only. Do not include any markdown formatting, code blocks, explanations, or text outside the JSON object. Your response must be a valid JSON object that can be parsed directly.`;

    const prompt = `Write a comprehensive, SEO-optimized blog post about "${topic}" for a category: "${category}".

Requirements:
- Title: Create an engaging, SEO-friendly title (50-70 characters)
- Excerpt: Write a compelling excerpt (150-200 characters) that summarizes the post
- Content: Write ${targetWords} words of high-quality, well-structured content
- Tone: ${tone}
- Include relevant keywords naturally: ${keywords.join(', ') || 'related to the topic'}
- Use proper headings (H2, H3) for structure
- Include practical examples, tips, or use cases
- Make it informative and valuable for readers
- Optimize for SEO (keyword density 1-2%, natural keyword placement)
- Include a conclusion that summarizes key points

CRITICAL: You MUST respond with ONLY valid JSON. No markdown, no code blocks, no explanations. Just the JSON object.

Required JSON structure:
{
  "title": "SEO-optimized title here",
  "excerpt": "Compelling excerpt here (150-200 chars)",
  "content": "Full blog post content with proper HTML formatting (use <h2>, <h3>, <p>, <ul>, <ol>, <strong>, <em> tags)",
  "metaTitle": "SEO meta title (50-60 chars)",
  "metaDescription": "SEO meta description (150-160 chars)",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "tags": ["tag1", "tag2", "tag3"],
  "seoScore": 85,
  "imagePrompt": "Detailed image description for generating a featured image (describe visual elements, style, colors, mood)",
  "imageSuggestions": ["suggestion1", "suggestion2", "suggestion3"]
}

Remember: Return ONLY the JSON object, nothing else.`;

    if (provider === 'gemini') {
      // Try up to 2 times to get valid JSON
      let lastError = null;
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const fullPrompt = attempt === 1 
            ? `${systemPrompt}\n\n${prompt}\n\nRemember: Return ONLY valid JSON, no markdown, no code blocks, no explanations.`
            : `${systemPrompt}\n\nIMPORTANT: Your previous response was not valid JSON. Please try again and return ONLY valid JSON, no markdown, no code blocks, no explanations.\n\n${prompt}\n\nCRITICAL: Your response must be valid JSON that can be parsed directly.`;
          
          const text = await callGeminiAPI(fullPrompt);
          
          // Parse JSON with sanitization
          const parsed = parseJSONSafely(text, 3);
          
          // Validate required fields
          const requiredFields = ['title', 'excerpt', 'content'];
          if (validateJSONStructure(parsed, requiredFields)) {
            // Ensure all fields have defaults
            return {
              title: parsed.title || `${topic} - Complete Guide`,
              excerpt: parsed.excerpt || `Learn everything about ${topic} in this comprehensive guide.`,
              content: parsed.content || `<h2>Introduction</h2><p>About ${topic}...</p>`,
              metaTitle: parsed.metaTitle || parsed.title || `${topic} - Complete Guide`,
              metaDescription: parsed.metaDescription || parsed.excerpt || `Comprehensive guide about ${topic}.`,
              keywords: Array.isArray(parsed.keywords) ? parsed.keywords : (keywords.length > 0 ? keywords : [topic, category]),
              tags: Array.isArray(parsed.tags) ? parsed.tags : [category, topic],
              seoScore: typeof parsed.seoScore === 'number' ? parsed.seoScore : 70,
              imagePrompt: parsed.imagePrompt || `Professional, modern illustration related to ${topic}, ${category} theme, tech-focused, vibrant colors, clean design`,
              imageSuggestions: Array.isArray(parsed.imageSuggestions) ? parsed.imageSuggestions : [
                `${topic} concept illustration`,
                `${category} technology visual`,
                `Modern ${topic} design`
              ]
            };
          } else {
            throw new Error('Missing required fields in JSON response');
          }
        } catch (error) {
          lastError = error;
          console.warn(`Gemini JSON parse attempt ${attempt} failed:`, error.message);
          if (attempt === 2) {
            // Final fallback
            break;
          }
        }
      }
      
      // Fallback if all attempts fail
      console.error('All Gemini JSON parsing attempts failed, using fallback');
      return {
        title: `${topic} - Complete Guide`,
        excerpt: `Learn everything about ${topic} in this comprehensive guide.`,
        content: `<h2>Introduction</h2><p>This is a comprehensive guide about ${topic} in the ${category} category.</p><h2>Key Points</h2><p>Explore important aspects of ${topic} and learn how to implement it effectively.</p><h2>Conclusion</h2><p>${topic} is an essential topic in ${category}. This guide provides the foundation you need to get started.</p>`,
        metaTitle: `${topic} - Complete Guide`,
        metaDescription: `Comprehensive guide about ${topic}. Learn everything you need to know.`,
        keywords: keywords.length > 0 ? keywords : [topic, category],
        tags: [category, topic],
        seoScore: 70,
        imagePrompt: `Professional, modern illustration related to ${topic}, ${category} theme, tech-focused, vibrant colors, clean design`,
        imageSuggestions: [
          `${topic} concept illustration`,
          `${category} technology visual`,
          `Modern ${topic} design`
        ]
      };
    } else if (provider === 'openai') {
      try {
        const completion = await openaiClient.chat.completions.create({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7
        });

        const content = completion.choices[0].message.content;
        const parsed = parseJSONSafely(content, 3);
        
        // Validate and return with defaults
        return {
          title: parsed.title || `${topic} - Complete Guide`,
          excerpt: parsed.excerpt || `Learn everything about ${topic} in this comprehensive guide.`,
          content: parsed.content || `<h2>Introduction</h2><p>About ${topic}...</p>`,
          metaTitle: parsed.metaTitle || parsed.title || `${topic} - Complete Guide`,
          metaDescription: parsed.metaDescription || parsed.excerpt || `Comprehensive guide about ${topic}.`,
          keywords: Array.isArray(parsed.keywords) ? parsed.keywords : (keywords.length > 0 ? keywords : [topic, category]),
          tags: Array.isArray(parsed.tags) ? parsed.tags : [category, topic],
          seoScore: typeof parsed.seoScore === 'number' ? parsed.seoScore : 85,
          imagePrompt: parsed.imagePrompt || `Professional, modern illustration related to ${topic}, ${category} theme, tech-focused, vibrant colors, clean design`,
          imageSuggestions: Array.isArray(parsed.imageSuggestions) ? parsed.imageSuggestions : [
            `${topic} concept illustration`,
            `${category} technology visual`,
            `Modern ${topic} design`
          ]
        };
      } catch (error) {
        console.error('OpenAI JSON parsing error:', error);
        // Fallback
        return {
          title: `${topic} - Complete Guide`,
          excerpt: `Learn everything about ${topic} in this comprehensive guide.`,
          content: `<h2>Introduction</h2><p>This is a comprehensive guide about ${topic}.</p>`,
          metaTitle: `${topic} - Complete Guide`,
          metaDescription: `Comprehensive guide about ${topic}.`,
          keywords: keywords.length > 0 ? keywords : [topic, category],
          tags: [category, topic],
          seoScore: 70,
          imagePrompt: `Professional, modern illustration related to ${topic}, ${category} theme`,
          imageSuggestions: [`${topic} illustration`, `${category} visual`]
        };
      }
    }
  } catch (error) {
    console.error('Blog generation error:', error);
    throw error;
  }
};

/**
 * Generate image prompt for blog post
 */
exports.generateImagePrompt = async (blogTitle, blogContent, category, keywords = []) => {
  try {
    const provider = getAIProvider();
    if (!provider) {
      throw new Error('No AI provider configured');
    }

    const prompt = `Generate a detailed, professional image description/prompt for a blog post featured image.

Blog Title: ${blogTitle}
Category: ${category}
Keywords: ${keywords.join(', ')}

Create a detailed image prompt that describes:
- Visual style (modern, professional, tech-focused, illustration, photo, etc.)
- Main subject/elements related to the blog topic
- Color scheme (vibrant, professional, tech colors)
- Mood/atmosphere (inspiring, educational, professional)
- Composition (centered, balanced, clean)
- Any text or typography elements (optional)

Return as JSON:
{
  "imagePrompt": "Detailed image description here",
  "imageSuggestions": ["suggestion 1", "suggestion 2", "suggestion 3"],
  "style": "modern illustration",
  "colors": ["primary color", "secondary color"],
  "dimensions": "1200x630"
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
        imagePrompt: `Professional ${category} illustration, ${blogTitle} concept, modern tech design, vibrant colors, clean composition`,
        imageSuggestions: [
          `${blogTitle} illustration`,
          `${category} technology visual`,
          `Modern ${category} design`
        ],
        style: 'modern illustration',
        colors: ['#3B82F6', '#8B5CF6'],
        dimensions: '1200x630'
      };
    } else if (provider === 'openai') {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at creating detailed image prompts for blog post featured images.'
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
    console.error('Image prompt generation error:', error);
    throw error;
  }
};

