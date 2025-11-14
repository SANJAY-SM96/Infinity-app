# Render Deployment Configuration

## Frontend Deployment on Render

### Build Settings:
- **Root Directory**: `frontend` (set this in Render dashboard)
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18 or 22 (as specified in frontend/package.json)

### Environment Variables:
Set these in Render dashboard:
```
VITE_API_URL=https://infinity-apps.onrender.com/api
NODE_ENV=production
```

### Alternative: If Root Directory is Project Root

If you can't set root directory to `frontend`, use these settings:
- **Build Command**: `cd frontend && npm install && npm run build`
- **Publish Directory**: `frontend/dist`

## Backend Deployment on Render

### Build Settings:
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 18 or 22

### Environment Variables:
Set all your backend environment variables in Render:
```
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-jwt-secret
CLIENT_URL=https://your-frontend-url.onrender.com
STRIPE_SECRET_KEY=your-stripe-key
RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
NODE_ENV=production
```

## Quick Setup Steps:

1. **Frontend Service**:
   - Create new Static Site
   - Connect your Git repository
   - Set Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Add environment variables

2. **Backend Service**:
   - Create new Web Service
   - Connect your Git repository
   - Set Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Add all environment variables

## Troubleshooting:

If build fails with "Missing script: build":
- Make sure Root Directory is set to `frontend` in Render dashboard
- OR use build command: `cd frontend && npm install && npm run build`

