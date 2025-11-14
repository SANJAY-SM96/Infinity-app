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

// Get the active AI provider (default to Gemini if available, otherwise OpenAI)
const getAIProvider = () => {
  if (geminiClient && process.env.AI_PROVIDER !== 'openai') {
    return 'gemini';
  } else if (openaiClient) {
    return 'openai';
  }
  return null;
};

// Analyze project requirements using AI
exports.analyzeProjectRequirements = async (requirements) => {
  try {
    const provider = getAIProvider();
    
    if (!provider) {
      throw new Error('No AI provider configured');
    }

    const prompt = `Analyze the following project requirements and provide:
1. Project category (Web Development, Mobile App, AI/ML, etc.)
2. Suggested tech stack
3. Key features
4. Estimated complexity (low/medium/high)
5. Timeline estimate
6. Budget recommendations

Project Requirements:
Title: ${requirements.projectTitle}
Description: ${requirements.description}
Domain: ${requirements.domain}
Budget: ${requirements.budget} ${requirements.currency}

Please provide a JSON response with the following structure:
{
  "category": "string",
  "techStack": ["string"],
  "features": ["string"],
  "complexity": "low|medium|high",
  "timeline": "string",
  "budgetRecommendation": "string",
  "suggestions": "string"
}`;

    if (provider === 'gemini') {
      try {
        const model = geminiClient.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt + '\n\nPlease respond with valid JSON only.');
        const response = await result.response;
        const text = response.text();
        
        // Try to extract JSON from response
        let jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          // Try to find JSON in code blocks
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
        
        // Fallback: return parsed response
        return {
          category: 'Other',
          techStack: [],
          features: [],
          complexity: 'medium',
          timeline: '2-4 weeks',
          budgetRecommendation: 'Please contact for custom quote',
          suggestions: text
        };
      } catch (error) {
        console.error('Gemini API error:', error);
        throw error;
      }
    } else if (provider === 'openai') {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a project analyst. Analyze project requirements and provide structured JSON responses.'
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
    console.error('AI analysis error:', error);
    throw error;
  }
};

// Get project suggestions based on user input
exports.getProjectSuggestions = async (userQuery) => {
  try {
    const provider = getAIProvider();
    
    if (!provider) {
      throw new Error('No AI provider configured');
    }

    const prompt = `Based on the following user query, suggest relevant projects or solutions:
Query: ${userQuery}

Provide 3-5 project suggestions with:
1. Project title
2. Brief description
3. Tech stack
4. Price range
5. Key features

Format as JSON array with the following structure:
[
  {
    "title": "string",
    "description": "string",
    "techStack": ["string"],
    "priceRange": "string",
    "features": ["string"]
  }
]`;

    if (provider === 'gemini') {
      try {
        const model = geminiClient.getGenerativeModel({ model: 'gemini-pro' });
        const result = await model.generateContent(prompt + '\n\nPlease respond with valid JSON only.');
        const response = await result.response;
        const text = response.text();
        
        // Try to extract JSON array from response
        let jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
          // Try to find JSON in code blocks
          jsonMatch = text.match(/```json\s*(\[[\s\S]*?\])\s*```/);
          if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
          }
          jsonMatch = text.match(/```\s*(\[[\s\S]*?\])\s*```/);
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
        
        return [];
      } catch (error) {
        console.error('Gemini API error:', error);
        throw error;
      }
    } else if (provider === 'openai') {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a project recommendation assistant. Provide relevant project suggestions based on user queries.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
      });

      const response = JSON.parse(completion.choices[0].message.content);
      return response.suggestions || [];
    }
  } catch (error) {
    console.error('AI suggestion error:', error);
    throw error;
  }
};

// Chatbot response
exports.getChatbotResponse = async (message, conversationHistory = []) => {
  try {
    const provider = getAIProvider();
    
    if (!provider) {
      throw new Error('No AI provider configured');
    }

    const systemPrompt = `You are a helpful assistant for an IT product selling website. 
You help users with:
- Project requirements
- Product recommendations
- Technical questions
- Pricing information
- General support

Be friendly, professional, and concise.`;

    if (provider === 'gemini') {
      const model = geminiClient.getGenerativeModel({ model: 'gemini-pro' });
      
      // Build conversation context
      let conversationContext = systemPrompt + '\n\n';
      conversationHistory.forEach(msg => {
        conversationContext += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
      conversationContext += `User: ${message}\nAssistant:`;
      
      const result = await model.generateContent(conversationContext);
      const response = await result.response;
      return response.text();
    } else if (provider === 'openai') {
      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        ...conversationHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: 'user',
          content: message
        }
      ];

      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500
      });

      return completion.choices[0].message.content;
    }
  } catch (error) {
    console.error('Chatbot error:', error);
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

