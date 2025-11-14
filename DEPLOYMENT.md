# Deployment Guide for INFINITY E-Commerce Platform

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Code tested locally
- [ ] Database backups created
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Security headers set
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Payment integration tested
- [ ] SSL certificate ready

## Backend Deployment (Render)

### Step 1: Prepare Your Code
```bash
# Clean up
rm -r node_modules
npm install
npm audit fix

# Test build
npm run build  # if applicable
```

### Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/infinity-backend.git
git push -u origin main
```

### Step 3: Deploy on Render
1. Go to https://render.com
2. Sign up / Login with GitHub
3. Click "New +" > "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: infinity-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: Free (upgrade as needed)

### Step 4: Set Environment Variables
In Render dashboard, go to "Environment":
```
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/infinity
PORT=5000
NODE_ENV=production
JWT_SECRET=your_very_long_secret_key_min_32_chars
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_live_your_stripe_key
STRIPE_WEBHOOK_SECRET=whsec_live_your_webhook_secret
CLIENT_URL=https://your-frontend-domain.com
```

### Step 5: Deploy
- Click "Deploy"
- Wait for build to complete
- Copy your API URL (e.g., https://infinity-api.onrender.com)

### Step 6: Configure Stripe Webhooks
1. Go to Stripe Dashboard > Webhooks
2. Click "Add endpoint"
3. URL: `https://infinity-api.onrender.com/api/payments/stripe/webhook`
4. Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

## Frontend Deployment (Vercel)

### Step 1: Prepare Your Code
```bash
# Clean up
rm -r node_modules
npm install
npm run build
npm run preview
```

### Step 2: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/infinity-frontend.git
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to https://vercel.com
2. Sign up / Login with GitHub
3. Click "New Project"
4. Import your frontend repository
5. Configure:
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 4: Set Environment Variables
In Vercel dashboard, go to "Settings" > "Environment Variables":
```
VITE_API_URL=https://infinity-api.onrender.com/api
VITE_STRIPE_KEY=pk_live_your_stripe_key
VITE_RAZORPAY_KEY=rzp_live_your_key
```

### Step 5: Deploy
- Click "Deploy"
- Wait for build to complete
- Your frontend will be live at `https://your-project.vercel.app`

## Database Setup (MongoDB Atlas Production)

### Step 1: Create Production Cluster
1. Go to https://mongodb.com/cloud/atlas
2. Create a new project: "Infinity-Production"
3. Create a new cluster:
   - Cloud Provider: AWS
   - Region: Closest to your users
   - Cluster Tier: M0 (free) or M10+ (paid)
   - Cluster Name: infinity-prod

### Step 2: Configure Security
1. Go to "Database Access"
2. Create database user:
   - Username: `infinity_user`
   - Password: Generate strong password
   - Role: Atlas Admin

3. Go to "Network Access"
4. Add IP Address:
   - For development: Your IP
   - For production: Render's IP or 0.0.0.0/0
   - **Better**: Use Render's IP whitelist feature

### Step 3: Get Connection String
1. Go to "Clusters" > "Connect"
2. Choose "Connect Your Application"
3. Copy connection string
4. Format: `mongodb+srv://user:password@cluster.mongodb.net/infinity?retryWrites=true&w=majority`

### Step 4: Create Database & Collections
```javascript
// MongoDB CLI or Atlas UI
use infinity
db.createCollection("users")
db.createCollection("products")
db.createCollection("orders")
db.createCollection("carts")

// Create indexes
db.users.createIndex({ email: 1 })
db.products.createIndex({ title: "text", description: "text" })
db.orders.createIndex({ user: 1, createdAt: -1 })
```

### Step 5: Enable Backups
1. Go to "Backup"
2. Enable "Continuous Backups"
3. Set retention to 35 days
4. Enable "Point-in-Time Restore"

## Domain Configuration (Optional)

### Vercel Custom Domain
1. In Vercel dashboard, go to "Settings" > "Domains"
2. Add your domain (e.g., app.infinityshop.com)
3. Update DNS records at your domain registrar:
   - Type: CNAME
   - Name: app
   - Value: cname.vercel-dns.com

### Render Custom Domain
1. In Render dashboard, go to "Settings"
2. Add custom domain (e.g., api.infinityshop.com)
3. Update DNS records:
   - Type: CNAME
   - Name: api
   - Value: api.onrender.com

## SSL/TLS Certificate

Both Vercel and Render provide free SSL certificates automatically.

To verify:
- Frontend: Visit your domain (check URL bar for lock icon)
- Backend: Run `curl -I https://your-api-domain.com`

## Environment-Specific Configurations

### Production Frontend `.env`
```
VITE_API_URL=https://infinity-api.onrender.com/api
VITE_STRIPE_KEY=pk_live_xxxx
```

### Production Backend `.env`
```
NODE_ENV=production
JWT_SECRET=very_long_random_secret_string
CORS_ORIGIN=https://your-frontend-domain.com
```

## Monitoring & Logging

### Backend Logs
- **Render**: Dashboard > "Logs" tab
- Check for errors in real-time

### Frontend Errors
- **Vercel**: Analytics > Real Experience Monitoring
- Use browser DevTools Console

### Database Monitoring
- **MongoDB Atlas**: Dashboard > "Metrics" tab
- Monitor connections, operations, storage

## Performance Optimization

### Frontend (Vercel)
- [ ] Enable "Web Analytics"
- [ ] Configure "Preload" for critical assets
- [ ] Enable caching headers
- [ ] Use image optimization

### Backend (Render)
- [ ] Monitor response times
- [ ] Enable Redis caching (optional)
- [ ] Configure auto-scaling (paid)
- [ ] Monitor database queries

### Database (MongoDB Atlas)
- [ ] Create indexes on frequently queried fields
- [ ] Enable compression
- [ ] Monitor slow queries
- [ ] Configure read replicas for high-traffic

## Troubleshooting Deployments

### Build Failures
```bash
# Check build logs in Vercel/Render dashboard
# Common causes:
- Missing environment variables
- Invalid dependencies
- TypeScript errors
- Tailwind CSS issues

# Fix:
npm install
npm run build  # Test locally first
```

### API Connection Issues
- Verify `VITE_API_URL` matches backend deployment URL
- Check CORS configuration in backend
- Verify environment variables are set
- Test API endpoint with Postman

### Database Connection Issues
- Verify IP is whitelisted in MongoDB Atlas
- Check connection string format
- Ensure database user has correct permissions
- Monitor MongoDB connection pool

### Payment Processing Issues
- Verify Stripe/Razorpay keys are for live environment
- Check webhook URLs are correct
- Monitor webhook logs in payment provider dashboard
- Test payment flow in staging first

## Rollback Procedures

### Vercel Rollback
1. Go to "Deployments"
2. Find previous working deployment
3. Click "..." > "Promote to Production"

### Render Rollback
1. Go to "Deploys"
2. Find previous build
3. Click "Redeploy"

### MongoDB Rollback
1. Go to "Backup" tab
2. Click "Restore from backup"
3. Choose previous backup point
4. Restore to new cluster

## Security Checklist

- [ ] All environment variables secured
- [ ] HTTPS enforced
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] SQL injection protection (N/A for MongoDB)
- [ ] XSS protection (Helmet.js)
- [ ] CSRF tokens (if applicable)
- [ ] API key rotation scheduled
- [ ] Secrets manager configured
- [ ] Security headers set (Helmet.js)
- [ ] Regular security audits scheduled

## Support & Help

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.mongodb.com/manual
- **Stripe Docs**: https://stripe.com/docs
- **React Docs**: https://react.dev

## Next Steps Post-Deployment

1. Monitor error logs daily
2. Set up alerts for failures
3. Schedule regular backups
4. Plan database scaling strategy
5. Implement analytics tracking
6. Set up uptime monitoring
7. Plan feature releases
8. Schedule security audits

---

**Congratulations! Your INFINITY platform is live! 🚀**
