# Gemini API Key Setup Guide

## Configure Gemini API Key

Your Gemini API key has been provided: `AIzaSyASIkxUfn2AJRvSABt-ulQVTW7IesrIJio`

## Quick Setup

### Option 1: Manual Setup (Recommended)

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Check if `.env` file exists:
   ```powershell
   Test-Path .env
   ```

3. If `.env` exists, edit it and add/update:
   ```env
   GEMINI_API_KEY=AIzaSyASIkxUfn2AJRvSABt-ulQVTW7IesrIJio
   AI_PROVIDER=gemini
   ```

4. If `.env` doesn't exist, create it with:
   ```env
   # AI Configuration
   GEMINI_API_KEY=AIzaSyASIkxUfn2AJRvSABt-ulQVTW7IesrIJio
   AI_PROVIDER=gemini

   # MongoDB Configuration
   MONGO_URI=mongodb://localhost:27017/infinity-app

   # JWT Secret Key
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # CORS Configuration
   CLIENT_URL=http://localhost:5173
   ```

### Option 2: Using PowerShell Script

1. Navigate to the backend directory:
   ```powershell
   cd backend
   ```

2. Run the setup script:
   ```powershell
   .\setup-gemini.ps1
   ```

This will automatically:
- Create `.env` file if it doesn't exist
- Add/update `GEMINI_API_KEY`
- Set `AI_PROVIDER=gemini`
- Keep existing environment variables

## Verify Configuration

1. Check if the key is set:
   ```powershell
   cd backend
   Get-Content .env | Select-String "GEMINI"
   ```

2. You should see:
   ```
   GEMINI_API_KEY=AIzaSyASIkxUfn2AJRvSABt-ulQVTW7IesrIJio
   AI_PROVIDER=gemini
   ```

## Test AI Features

1. Start the backend server:
   ```powershell
   cd backend
   npm run dev
   ```

2. Check AI availability:
   - Open browser: `http://localhost:5000/api/ai/availability`
   - You should see: `{"success":true,"available":true,"provider":"gemini"}`

3. Test the chatbot:
   - Open the frontend application
   - Click the chatbot button (bottom-right)
   - Send a message to test AI responses

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` file to git
- The `.env` file is already in `.gitignore`
- Keep your API key secure
- Don't share your API key publicly
- Rotate your API key if it's exposed

## Troubleshooting

### AI Not Working

1. **Check if API key is set:**
   ```powershell
   cd backend
   Get-Content .env | Select-String "GEMINI"
   ```

2. **Check backend logs:**
   - Look for errors in the console
   - Check if AI service is initialized

3. **Test API key:**
   - Visit: `http://localhost:5000/api/ai/availability`
   - Should return: `{"success":true,"available":true,"provider":"gemini"}`

4. **Check environment variables:**
   ```powershell
   cd backend
   node -e "require('dotenv').config(); console.log(process.env.GEMINI_API_KEY)"
   ```

### API Key Invalid

1. Verify the API key is correct
2. Check if the key has the necessary permissions
3. Make sure there are no extra spaces in `.env` file
4. Restart the backend server after updating `.env`

## Next Steps

1. ✅ Configure Gemini API key in `.env`
2. ✅ Set `AI_PROVIDER=gemini`
3. ✅ Start backend server
4. ✅ Test AI features (chatbot, project analysis, suggestions)
5. ✅ Verify all AI endpoints are working

## AI Features Available

Once configured, you can use:
- ✅ **AI Chatbot** - Chat with AI assistant
- ✅ **Project Requirement Analysis** - Analyze project requirements
- ✅ **Project Suggestions** - Get AI-powered project suggestions
- ✅ **Build My Project** - AI-assisted project requests

## Support

If you encounter any issues:
1. Check backend logs
2. Verify API key is correct
3. Check network connectivity
4. Verify Gemini API service is available

