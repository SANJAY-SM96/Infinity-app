/**
 * Sanitize AI response to extract clean JSON
 * Removes markdown formatting, trailing commas, extra text, etc.
 * @param {string} text - Raw AI response text
 * @returns {string} - Clean JSON string
 */
function sanitizeJSON(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let cleaned = text.trim();

  // Remove markdown code blocks
  cleaned = cleaned.replace(/```json\s*/g, '');
  cleaned = cleaned.replace(/```\s*/g, '');
  cleaned = cleaned.replace(/```/g, '');

  // Extract JSON object (first { ... } block)
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  // Remove leading/trailing quotes if present
  cleaned = cleaned.replace(/^["']|["']$/g, '');

  // Remove trailing commas before closing braces/brackets
  cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');

  // Remove any text before first { or after last }
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  return cleaned.trim();
}

/**
 * Parse JSON with multiple attempts and sanitization
 * @param {string} text - Raw AI response text
 * @param {number} maxAttempts - Maximum parsing attempts
 * @returns {Object} - Parsed JSON object
 * @throws {Error} - If parsing fails after all attempts
 */
function parseJSONSafely(text, maxAttempts = 3) {
  if (!text) {
    throw new Error('Empty text provided for JSON parsing');
  }

  let lastError = null;
  let cleanedText = text;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Sanitize on each attempt
      cleanedText = sanitizeJSON(text);
      
      if (!cleanedText || !cleanedText.trim()) {
        throw new Error('No JSON found in response');
      }

      // Try to parse
      const parsed = JSON.parse(cleanedText);
      
      // Validate it's an object
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('Parsed JSON is not an object');
      }

      return parsed;
    } catch (error) {
      lastError = error;
      
      // On last attempt, try more aggressive cleaning
      if (attempt === maxAttempts) {
        // Try removing everything except JSON structure
        try {
          const aggressiveClean = text
            .replace(/[^{]*(\{[\s\S]*\})[^}]*/, '$1')
            .replace(/,(\s*[}\]])/g, '$1');
          return JSON.parse(aggressiveClean);
        } catch (finalError) {
          throw new Error(`JSON parsing failed after ${maxAttempts} attempts: ${lastError.message}`);
        }
      }
    }
  }

  throw lastError || new Error('JSON parsing failed');
}

/**
 * Validate JSON structure has required fields
 * @param {Object} obj - Parsed JSON object
 * @param {Array<string>} requiredFields - Array of required field names
 * @returns {boolean} - True if all required fields exist
 */
function validateJSONStructure(obj, requiredFields = []) {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  return requiredFields.every(field => {
    const value = obj[field];
    return value !== undefined && value !== null && value !== '';
  });
}

module.exports = {
  sanitizeJSON,
  parseJSONSafely,
  validateJSONStructure
};

