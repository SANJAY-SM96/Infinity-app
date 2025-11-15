# Netlify Deployment Guide

This guide will help you deploy the Infinity App frontend to Netlify.

## Prerequisites

1. A Netlify account (sign up at [netlify.com](https://www.netlify.com))
2. Your backend API URL (currently: `https://infinity-apps.onrender.com/api`)

## Deployment Methods

### Method 1: Deploy via Netlify Dashboard (Recommended for first-time)

1. **Build the project locally** (optional, to test):
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. **Go to Netlify Dashboard**:
   - Visit [app.netlify.com](https://app.netlify.com)
   - Click "Add new site" → "Deploy manually"

3. **Drag and drop**:
   - Drag the `frontend/dist` folder to the deployment area
   - Netlify will automatically deploy your site

4. **Configure Environment Variables**:
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://infinity-apps.onrender.com/api`
   - Redeploy after adding environment variables

### Method 2: Deploy via Git (Recommended for continuous deployment)

1. **Push your code to GitHub/GitLab/Bitbucket**

2. **Connect to Netlify**:
   - Go to Netlify Dashboard
   - Click "Add new site" → "Import an existing project"
   - Connect your Git provider
   - Select your repository

3. **Configure Build Settings**:
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `frontend/dist`
   - **⚠️ IMPORTANT**: Make sure to click "Show advanced" and verify that no Next.js plugin is enabled

4. **Set Environment Variables**:
   - Go to Site settings → Environment variables
   - Add: `VITE_API_URL` = `https://infinity-apps.onrender.com/api`
   - (Replace with your actual backend URL if different)

5. **Deploy**:
   - Click "Deploy site"
   - Netlify will automatically build and deploy

### Method 3: Deploy via Netlify CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

4. **Initialize and deploy**:
   ```bash
   netlify init
   # Follow the prompts to link your site
   
   # Set environment variable
   netlify env:set VITE_API_URL https://infinity-apps.onrender.com/api
   
   # Deploy
   netlify deploy --prod
   ```

## Environment Variables

Make sure to set the following environment variable in Netlify:

- `VITE_API_URL`: Your backend API URL (e.g., `https://infinity-apps.onrender.com/api`)

**Note**: Vite requires environment variables to be prefixed with `VITE_` to be accessible in the frontend code.

## Post-Deployment Checklist

- [ ] Verify the site is accessible
- [ ] Test API connections (login, products, etc.)
- [ ] Check that client-side routing works (try navigating to different pages)
- [ ] Verify environment variables are set correctly
- [ ] Test authentication flow
- [ ] Check browser console for any errors

## Custom Domain (Optional)

1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow Netlify's instructions to configure DNS

## Continuous Deployment

Once connected via Git, Netlify will automatically:
- Deploy on every push to your main branch
- Create preview deployments for pull requests
- Rebuild when environment variables change

## Troubleshooting

### Netlify Detects Next.js Instead of Vite

If you see "Using Next.js Runtime" in your build logs, follow these steps:

1. **Go to Site Settings → Build & deploy → Build settings**
2. **Click "Edit settings"**
3. **Verify the build command is**: `npm install && npm run build`
4. **Verify the publish directory is**: `frontend/dist`
5. **Go to Site Settings → Plugins**
6. **Remove or disable the Next.js plugin** if it's installed
7. **Trigger a new deploy**

Alternatively, you can add this to your `netlify.toml` to explicitly prevent Next.js detection:
```toml
[build]
  command = "npm install && npm run build"
  publish = "dist"
```

### Build Command is `npm run dev` Instead of `npm run build`

If Netlify is running the dev server instead of building:

1. **Go to Site Settings → Build & deploy → Build settings**
2. **Change the build command to**: `npm install && npm run build`
3. **Save and trigger a new deploy**

The `netlify.toml` file should override these settings, but sometimes you need to set them explicitly in the UI.

### Build Fails
- Check that `npm install` completes successfully
- Verify Node.js version (Netlify uses Node 18 by default)
- Check build logs in Netlify dashboard

### API Calls Fail
- Verify `VITE_API_URL` environment variable is set
- Check CORS settings on your backend
- Ensure backend is accessible from the internet

### Routing Issues
- The `netlify.toml` file includes SPA redirect rules
- If routes don't work, verify the redirect configuration

### Environment Variables Not Working
- Remember: Vite requires `VITE_` prefix
- Redeploy after adding/changing environment variables
- Check that variables are set for the correct environment (Production/Deploy Preview)

## Support

For more information, visit:
- [Netlify Documentation](https://docs.netlify.com/)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#netlify)

