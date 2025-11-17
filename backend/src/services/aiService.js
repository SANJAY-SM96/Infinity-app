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

// Helper function to sleep/delay
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to normalize conversation history for Gemini
const normalizeConversationHistory = (conversationHistory) => {
  if (!conversationHistory || !Array.isArray(conversationHistory) || conversationHistory.length === 0) {
    return [];
  }

  // Build chat history for Gemini - filter out invalid entries and ensure proper alternation
  let validHistory = conversationHistory
    .filter(msg => msg && msg.role && msg.content && typeof msg.content === 'string')
    .map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: String(msg.content) }]
    }));
  
  // Ensure history alternates properly (user -> model -> user -> model...)
  const normalizedHistory = [];
  for (let i = 0; i < validHistory.length; i++) {
    const current = validHistory[i];
    const previous = normalizedHistory[normalizedHistory.length - 1];
    
    // Skip if it's the same role as the previous message
    if (previous && previous.role === current.role) {
      // If we have two consecutive user messages, combine them
      if (current.role === 'user' && previous.role === 'user') {
        previous.parts[0].text += ' ' + current.parts[0].text;
      }
      // Skip duplicate assistant messages (keep the last one by replacing)
      if (current.role === 'model' && previous.role === 'model') {
        normalizedHistory[normalizedHistory.length - 1] = current;
      }
      continue;
    }
    
    normalizedHistory.push(current);
  }
  
  // Ensure history starts with a user message (Gemini requirement)
  while (normalizedHistory.length > 0 && normalizedHistory[0].role !== 'user') {
    normalizedHistory.shift();
  }
  
  return normalizedHistory;
};

// Helper function to send message with a Gemini model
const sendMessageWithGeminiModel = async (model, message, conversationHistory = []) => {
  const normalizedHistory = normalizeConversationHistory(conversationHistory);
  
  if (normalizedHistory.length > 0) {
    const chat = model.startChat({ history: normalizedHistory });
    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } else {
    // Fallback to generateContent if no valid history
    const result = await model.generateContent(message);
    const response = await result.response;
    return response.text();
  }
};

// Helper function to call Gemini chatbot with retry logic
const callGeminiChatbotWithRetry = async (modelName, message, systemPrompt, conversationHistory = [], retryCount = 0, maxRetries = 2) => {
  const model = geminiClient.getGenerativeModel({
    model: modelName,
    systemInstruction: systemPrompt
  });

  try {
    return await sendMessageWithGeminiModel(model, message, conversationHistory);
  } catch (error) {
    // Check if it's a retryable error (503/overloaded) and we haven't exceeded retries
    const isRetryable = error.status === 503 || 
                       error.message?.includes('overloaded') || 
                       error.message?.includes('503');

    if (isRetryable && retryCount < maxRetries) {
      // Exponential backoff: wait 1s, 2s, 4s...
      const delay = Math.pow(2, retryCount) * 1000;
      console.log(`Model ${modelName} overloaded, retrying in ${delay}ms (attempt ${retryCount + 1}/${maxRetries})...`);
      await sleep(delay);
      return callGeminiChatbotWithRetry(modelName, message, systemPrompt, conversationHistory, retryCount + 1, maxRetries);
    }

    // Not retryable or max retries reached, throw the error
    throw error;
  }
};

// Helper function to get chatbot response with model fallback
const getChatbotResponseWithFallback = async (message, systemPrompt, conversationHistory = []) => {
  if (!geminiClient) {
    throw new Error('Gemini client not initialized. Check GEMINI_API_KEY.');
  }

  const models = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];
  let lastError;

  for (let i = 0; i < models.length; i++) {
    const modelName = models[i];
    try {
      return await callGeminiChatbotWithRetry(modelName, message, systemPrompt, conversationHistory);
    } catch (error) {
      console.error(`Gemini ${modelName} error:`, {
        message: error.message,
        name: error.name,
        code: error.code,
        status: error.status
      });

      lastError = error;

      // Check if it's a quota error (429) - don't retry, throw immediately
      if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('limit')) {
        throw new Error('API quota exceeded. Please check your Gemini API quota limits. You may need to wait or upgrade your plan.');
      }

      // If it's not a 503/overloaded error, throw immediately
      if (error.status !== 503 && !error.message?.includes('overloaded') && !error.message?.includes('503')) {
        throw error;
      }

      // If this is not the last model, wait a bit and continue to next fallback
      if (i < models.length - 1) {
        const delayMs = (i + 1) * 500; // Exponential backoff: 500ms, 1000ms, etc.
        console.error(`Model ${modelName} overloaded, waiting ${delayMs}ms before trying next fallback: ${models[i + 1]}`);
        await sleep(delayMs);
        continue;
      }
    }
  }

  // All models failed
  let errorMessage = 'Failed to generate AI response';
  if (lastError) {
    if (lastError.message?.includes('overloaded') || lastError.status === 503) {
      errorMessage = 'AI service is currently overloaded. Please try again in a few moments.';
    } else if (lastError.message?.includes('API_KEY')) {
      errorMessage = 'Invalid or missing GEMINI_API_KEY';
    } else if (lastError.message?.includes('429') || lastError.message?.includes('quota')) {
      errorMessage = 'API quota exceeded. Please check your Gemini API quota limits.';
    } else {
      errorMessage = `AI service error: ${lastError.message}`;
    }
  }
  throw new Error(errorMessage);
};

// Helper function to generate content with Gemini model fallback
const generateContentWithFallback = async (prompt, options = {}) => {
  if (!geminiClient) {
    throw new Error('Gemini client not initialized. Check GEMINI_API_KEY.');
  }

  const models = options.models || ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];
  let lastError;

  for (let i = 0; i < models.length; i++) {
    const modelName = models[i];
    try {
      const model = geminiClient.getGenerativeModel({ 
        model: modelName,
        ...(options.systemInstruction && { systemInstruction: options.systemInstruction })
      });
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error(`Gemini ${modelName} error:`, {
        message: error.message,
        name: error.name,
        code: error.code,
        status: error.status
      });

      lastError = error;

      // If it's not a 503/overloaded error, throw immediately
      if (error.status !== 503 && !error.message?.includes('overloaded') && !error.message?.includes('503')) {
        throw error;
      }

      // If this is not the last model, wait a bit and continue to next fallback
      if (i < models.length - 1) {
        const delayMs = (i + 1) * 500; // Exponential backoff: 500ms, 1000ms, etc.
        console.error(`Model ${modelName} overloaded, waiting ${delayMs}ms before trying next fallback: ${models[i + 1]}`);
        await sleep(delayMs);
        continue;
      }
    }
  }

  // All models failed
  let errorMessage = 'Failed to generate AI response';
  if (lastError) {
    if (lastError.message?.includes('overloaded') || lastError.status === 503) {
      errorMessage = 'AI service is currently overloaded. Please try again in a few moments.';
    } else if (lastError.message?.includes('API_KEY')) {
      errorMessage = 'Invalid or missing GEMINI_API_KEY';
    } else if (lastError.message?.includes('429') || lastError.message?.includes('quota')) {
      errorMessage = 'API quota exceeded. Please check your Gemini API quota limits.';
    } else {
      errorMessage = `AI service error: ${lastError.message}`;
    }
  }
  throw new Error(errorMessage);
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
        // Use current Gemini model (gemini-1.5-flash is the recommended model)
        const model = geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
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
        // Use current Gemini model (gemini-1.5-flash is the recommended model)
        const model = geminiClient.getGenerativeModel({ model: 'gemini-1.5-flash' });
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
      throw new Error('No AI provider configured. Please set GEMINI_API_KEY or OPENAI_API_KEY in environment variables.');
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      throw new Error('Message is required and must be a non-empty string');
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
      // Use the improved helper function with retry logic and fallback
      return await getChatbotResponseWithFallback(message, systemPrompt, conversationHistory);
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

// Get project ideas based on user interests
exports.getProjectIdeas = async (interests, budget, techStack = []) => {
  try {
    const provider = getAIProvider();
    
    if (!provider) {
      throw new Error('No AI provider configured');
    }

    const prompt = `Generate 5-7 serious project ideas based on the following criteria:
Interests: ${interests}
Budget Range: ${budget || 'Not specified'}
Preferred Tech Stack: ${techStack.length > 0 ? techStack.join(', ') : 'Open to suggestions'}

For each project idea, provide:
1. Project Title
2. Brief Description (2-3 sentences)
3. Key Features (5-7 features)
4. Recommended Tech Stack
5. Estimated Development Time
6. Complexity Level (Beginner/Intermediate/Advanced)
7. Market Potential
8. Unique Selling Points
9. Potential Challenges
10. Success Metrics

Format as JSON array:
[
  {
    "title": "string",
    "description": "string",
    "features": ["string"],
    "techStack": ["string"],
    "developmentTime": "string",
    "complexity": "Beginner|Intermediate|Advanced",
    "marketPotential": "string",
    "uniqueSellingPoints": ["string"],
    "challenges": ["string"],
    "successMetrics": ["string"]
  }
]`;

    if (provider === 'gemini') {
      const fullPrompt = prompt + '\n\nPlease respond with valid JSON array only.';
      
      // Helper function to parse JSON from response text
      const parseProjectIdeasFromText = (text) => {
        let jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
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
      };

      // Use helper function with fallback
      const text = await generateContentWithFallback(fullPrompt);
      return parseProjectIdeasFromText(text);
    } else if (provider === 'openai') {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a project idea generator. Provide creative and practical project ideas in JSON format.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.8
      });

      const response = JSON.parse(completion.choices[0].message.content);
      return response.projects || response.ideas || [];
    }
  } catch (error) {
    console.error('Project ideas generation error:', error);
    throw error;
  }
};

// Recommend projects based on user profile
exports.recommendProjects = async (userProfile) => {
  try {
    const provider = getAIProvider();
    
    if (!provider) {
      throw new Error('No AI provider configured');
    }

    const prompt = `Based on the following user profile, recommend 3-5 projects that would be perfect for them:

User Profile:
- Experience Level: ${userProfile.experienceLevel || 'Not specified'}
- Interests: ${userProfile.interests || 'Not specified'}
- Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
- Goals: ${userProfile.goals || 'Not specified'}
- Budget: ${userProfile.budget || 'Not specified'}
- Timeline: ${userProfile.timeline || 'Not specified'}

For each recommended project, provide:
1. Why this project fits them
2. Project overview
3. Key features
4. Tech stack recommendation
5. Learning opportunities
6. Estimated timeline
7. Next steps to get started

Format as JSON:
{
  "recommendations": [
    {
      "projectTitle": "string",
      "fitReason": "string",
      "overview": "string",
      "features": ["string"],
      "techStack": ["string"],
      "learningOpportunities": ["string"],
      "timeline": "string",
      "nextSteps": ["string"],
      "priority": "high|medium|low"
    }
  ],
  "summary": "string"
}`;

    if (provider === 'gemini') {
      const fullPrompt = prompt + '\n\nPlease respond with valid JSON only.';
      const text = await generateContentWithFallback(fullPrompt);
      
      // Parse JSON from response
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
      
      return { recommendations: [], summary: 'Unable to generate recommendations' };
    } else if (provider === 'openai') {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a project recommendation expert. Provide personalized project recommendations in JSON format.'
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
    console.error('Project recommendation error:', error);
    throw error;
  }
};

// Explain project functionality
exports.explainProjectFunctionality = async (projectTitle, projectDescription, features = []) => {
  try {
    const provider = getAIProvider();
    
    if (!provider) {
      throw new Error('No AI provider configured');
    }

    const prompt = `Explain the functionality of the following project in detail:

Project Title: ${projectTitle}
Description: ${projectDescription}
Features: ${features.length > 0 ? features.join(', ') : 'Not specified'}

Provide a comprehensive explanation covering:
1. Core Functionality (detailed explanation)
2. How Each Feature Works
3. User Flow/Workflow
4. Technical Architecture Overview
5. Data Flow
6. Integration Points
7. User Experience Highlights
8. Key Technologies and Their Roles

Format as JSON:
{
  "coreFunctionality": "string",
  "featureExplanations": [
    {
      "feature": "string",
      "explanation": "string",
      "importance": "string"
    }
  ],
  "userFlow": "string",
  "technicalArchitecture": "string",
  "dataFlow": "string",
  "integrationPoints": ["string"],
  "userExperienceHighlights": ["string"],
  "technologyRoles": [
    {
      "technology": "string",
      "role": "string"
    }
  ]
}`;

    if (provider === 'gemini') {
      const fullPrompt = prompt + '\n\nPlease respond with valid JSON only.';
      const text = await generateContentWithFallback(fullPrompt);
      
      // Parse JSON from response
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
      
      return { coreFunctionality: 'Unable to generate explanation', featureExplanations: [] };
    } else if (provider === 'openai') {
      const completion = await openaiClient.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a technical documentation expert. Explain project functionality in detail using JSON format.'
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
    console.error('Functionality explanation error:', error);
    throw error;
  }
};

