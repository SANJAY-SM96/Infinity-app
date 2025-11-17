# Production Deployment Guide

This guide explains how to run the Infinity App in production mode.

## Changes Made

### Frontend
- ✅ Updated `build` script to set `NODE_ENV=production`
- ✅ Added `build:prod` script for explicit production builds
- ✅ Updated `preview` script to use production mode
- ✅ Optimized `vite.config.js` for production builds

### Backend
- ✅ Updated `start` script to set `NODE_ENV=production` by default
- ✅ Added `start:prod` script for explicit production mode
- ✅ Updated `dev` script to explicitly set `NODE_ENV=development`
- ✅ Added `cross-env` package for cross-platform compatibility

### Root
- ✅ Added `build:prod` script for production frontend builds
- ✅ Added `start:backend:prod` script for production backend
- ✅ Added `start:prod` script as a shortcut

## How to Launch in Production Mode

### Option 1: Build Frontend for Production

1. **Build the frontend:**
   ```powershell
   cd frontend
   npm run build
   # or
   npm run build:prod
   ```

2. **Start the backend in production mode:**
   ```powershell
   cd backend
   npm run start
   # or
   npm run start:prod
   ```

3. **Serve the frontend build:**
   - The built files will be in `frontend/dist/`
   - You can serve them using a static file server like:
     - `npm run preview` (Vite preview server)
     - Nginx
     - Apache
     - Any static hosting service (Netlify, Vercel, Firebase, etc.)

### Option 2: Using Root Scripts

1. **Build frontend for production:**
   ```powershell
   npm run build:prod
   ```

2. **Start backend in production:**
   ```powershell
   npm run start:prod
   ```

### Option 3: Preview Production Build Locally

1. **Build the frontend:**
   ```powershell
   cd frontend
   npm run build
   ```

2. **Preview the production build:**
   ```powershell
   cd frontend
   npm run preview
   ```
   This will start a local server to preview the production build.

## Environment Variables

### Backend (.env)
Make sure your backend `.env` file has:
```env
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
JWT_SECRET=your_production_jwt_secret
CLIENT_URL=https://your-production-frontend-url.com
# ... other production environment variables
```

### Frontend (.env)
For production builds, set:
```env
VITE_API_URL=https://your-production-api-url.com/api
VITE_STRIPE_KEY=pk_live_your_stripe_key
```

## Production Features Enabled

When running in production mode (`NODE_ENV=production`):

### Backend
- ✅ Rate limiting enabled (100 requests per 15 minutes per IP)
- ✅ Security headers enabled (Helmet)
- ✅ HTTPS redirect enabled
- ✅ Trust proxy configured safely
- ✅ Compression enabled
- ✅ Detailed logging disabled (only errors logged)
- ✅ CORS configured for production domains

### Frontend
- ✅ Minified and optimized bundles
- ✅ Code splitting for better caching
- ✅ Source maps disabled (smaller bundles, better security)
- ✅ Production API URLs used
- ✅ Console logs minimized
- ✅ Optimized asset loading

## Important Notes

1. **Always set NODE_ENV=production** in your production environment
2. **Update CORS origins** in `backend/server.js` to include your production frontend URL
3. **Use HTTPS** in production for security
4. **Set proper environment variables** before building/running
5. **Test the production build** locally using `npm run preview` before deploying

## Deployment Checklist

- [ ] Set `NODE_ENV=production` in environment
- [ ] Update backend `.env` with production values
- [ ] Update frontend `.env` with production API URL
- [ ] Build frontend: `npm run build:prod`
- [ ] Test production build locally: `npm run preview`
- [ ] Deploy frontend to hosting service
- [ ] Deploy backend to hosting service
- [ ] Verify CORS settings allow production frontend URL
- [ ] Test all functionality in production environment
- [ ] Monitor logs for errors
- [ ] Set up SSL certificates for HTTPS

## Troubleshooting

### Backend not starting in production mode
- Check that `cross-env` is installed: `cd backend && npm install`
- Verify `NODE_ENV` is set: `echo $env:NODE_ENV` (PowerShell) or `echo $NODE_ENV` (Bash)

### Frontend build fails
- Clear node_modules and reinstall: `rm -r node_modules && npm install`
- Check for TypeScript/ESLint errors
- Verify all environment variables are set

### API connection issues in production
- Verify `VITE_API_URL` is set correctly in frontend `.env`
- Check CORS settings in backend allow your frontend domain
- Ensure backend is accessible from the frontend domain

