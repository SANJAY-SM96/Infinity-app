# Firebase Deployment Guide

This guide will help you deploy your Infinity App frontend to Firebase Hosting.

## Prerequisites

1. **Node.js** installed (v16 or higher)
2. **Firebase CLI** installed globally
3. **Firebase account** (free tier is sufficient)

## Step 1: Install Firebase CLI

If you haven't installed Firebase CLI, run:

```bash
npm install -g firebase-tools
```

## Step 2: Login to Firebase

```bash
firebase login
```

This will open a browser window for you to authenticate with your Google account.

## Step 3: Initialize Firebase Project

1. Navigate to your project root directory:
```bash
cd P:\clg_proj\Infinity-app
```

2. Initialize Firebase:
```bash
firebase init hosting
```

When prompted:
- **Select "Use an existing project"** (if you have one) or **"Create a new project"**
- **Public directory**: Enter `frontend/dist`
- **Configure as a single-page app**: **Yes**
- **Set up automatic builds and deploys with GitHub**: **No** (unless you want CI/CD)
- **File frontend/dist/index.html already exists. Overwrite?**: **No**

## Step 4: Update Firebase Project ID

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Copy your project ID
4. Update `.firebaserc` file with your actual project ID:
```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## Step 5: Update API Configuration

Before building, update your API endpoint in `frontend/src/api/apiClient.js`:

- **Development**: `http://localhost:5000`
- **Production**: Your backend server URL (e.g., `https://your-backend.herokuapp.com` or `https://api.yourdomain.com`)

## Step 6: Build the Frontend

```bash
cd frontend
npm run build
```

This will create a `dist` folder with the production build.

## Step 7: Deploy to Firebase

From the project root:

```bash
firebase deploy --only hosting
```

Or deploy everything:

```bash
firebase deploy
```

## Step 8: Access Your Site

After deployment, Firebase will provide you with a URL like:
```
https://your-project-id.web.app
```
or
```
https://your-project-id.firebaseapp.com
```

## Environment Variables

For production, you may need to set environment variables. Create a `.env.production` file in the `frontend` directory:

```env
VITE_API_URL=https://your-backend-url.com/api
```

Then rebuild:
```bash
cd frontend
npm run build
firebase deploy --only hosting
```

## Backend Deployment

**Important**: Firebase Hosting only hosts static files. Your Node.js backend needs to be deployed separately:

### Option 1: Railway (Recommended)
1. Go to [Railway.app](https://railway.app/)
2. Create a new project
3. Connect your GitHub repo or deploy directly
4. Set environment variables (MongoDB URI, JWT_SECRET, etc.)
5. Deploy

### Option 2: Render
1. Go to [Render.com](https://render.com/)
2. Create a new Web Service
3. Connect your repository
4. Set build command: `cd backend && npm install`
5. Set start command: `cd backend && node server.js`
6. Add environment variables

### Option 3: Heroku
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables
5. Deploy: `git push heroku main`

## Troubleshooting

### Build Errors
- Make sure all dependencies are installed: `cd frontend && npm install`
- Check for TypeScript/ESLint errors
- Clear node_modules and reinstall if needed

### API Connection Issues
- Ensure your backend CORS is configured to allow your Firebase domain
- Check that your backend is running and accessible
- Verify API URLs in production build

### Routing Issues
- Firebase Hosting is configured to redirect all routes to `index.html` for SPA routing
- If routes don't work, check `firebase.json` rewrites configuration

## Continuous Deployment

To set up automatic deployments:

1. Go to Firebase Console → Hosting
2. Click "Get started" with GitHub
3. Connect your repository
4. Configure build settings:
   - Build command: `cd frontend && npm install && npm run build`
   - Output directory: `frontend/dist`

## Useful Commands

```bash
# Preview locally
firebase serve

# Deploy only hosting
firebase deploy --only hosting

# View deployment history
firebase hosting:channel:list

# Rollback to previous version
firebase hosting:rollback
```

## Security Notes

- Never commit `.firebaserc` with sensitive data
- Use environment variables for API keys
- Enable Firebase Security Rules if using Firebase services
- Keep your Firebase CLI updated: `npm install -g firebase-tools@latest`

