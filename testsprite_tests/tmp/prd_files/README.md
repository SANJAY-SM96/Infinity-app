# INFINITY - MERN Stack IT Product Marketplace

A production-ready, full-stack e-commerce platform for IT products built with MongoDB, Express.js, React, and Node.js.

## 🚀 Features

### Core Functionality
- ✅ User Authentication (JWT + Bcrypt)
- ✅ Product Catalog with Search & Filtering
- ✅ Shopping Cart Management
- ✅ Secure Checkout Process
- ✅ Order Tracking
- ✅ Admin Dashboard with Analytics
- ✅ Responsive Design (Mobile-first)
- ✅ Dark Tech-style UI with Framer Motion animations

### Security
- 🔒 Helmet.js for HTTP headers security
- 🔒 CORS configuration
- 🔒 Rate limiting
- 🔒 Input validation & sanitization
- 🔒 Password hashing with bcryptjs
- 🔒 JWT authentication with expiration

### Performance
- ⚡ Pagination for large datasets
- ⚡ Lazy loading images
- ⚡ Gzip compression
- ⚡ MongoDB indexes
- ⚡ React Query for caching
- ⚡ Code splitting with React Router

### Payment Integration
- 💳 Stripe integration
- 💳 Razorpay support (scaffold)
- 💳 Webhook handling
- 💳 Order status tracking

## 📁 Project Structure

```
Infinity-app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Order.js
│   │   │   └── Cart.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── products.js
│   │   │   ├── cart.js
│   │   │   ├── orders.js
│   │   │   ├── payments.js
│   │   │   └── admin.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── productController.js
│   │   │   ├── cartController.js
│   │   │   ├── orderController.js
│   │   │   ├── paymentController.js
│   │   │   └── adminController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── validateRequest.js
│   │   └── utils/
│   │       ├── generateToken.js
│   │       └── paginate.js
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   └── .gitignore
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   ├── apiClient.js
    │   │   ├── authService.js
    │   │   ├── productService.js
    │   │   ├── cartService.js
    │   │   ├── orderService.js
    │   │   ├── paymentService.js
    │   │   └── adminService.js
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── CartContext.jsx
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── Footer.jsx
    │   │   ├── ProductCard.jsx
    │   │   ├── Loader.jsx
    │   │   ├── ProtectedRoute.jsx
    │   │   └── AdminRoute.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── ProductList.jsx
    │   │   ├── ProductDetails.jsx
    │   │   ├── Cart.jsx
    │   │   ├── Checkout.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── UserDashboard.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── hooks/
    │   ├── utils/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    ├── .env.example
    └── .gitignore
```

## ⚙️ Prerequisites

- Node.js >= 18.0.0
- npm or yarn
- MongoDB Atlas account (free tier available)
- Stripe account (for payments)

## 🔧 Installation & Setup

### Backend Setup

1. **Clone and navigate to backend:**
```powershell
cd p:\clg_proj\Infinity-app\backend
```

2. **Install dependencies:**
```powershell
npm install
```

3. **Create .env file:**
```powershell
Copy-Item .env.example .env
```

4. **Configure environment variables** in `.env`:
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/infinity-app
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_min_32_chars_long
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_your_key
CLIENT_URL=http://localhost:3000
```

5. **Start the server:**
```powershell
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Open new terminal and navigate to frontend:**
```powershell
cd p:\clg_proj\Infinity-app\frontend
```

2. **Install dependencies:**
```powershell
npm install
```

3. **Create .env file:**
```powershell
Copy-Item .env.example .env
```

4. **Configure environment variables** in `.env`:
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_KEY=pk_test_your_key
```

5. **Start the development server:**
```powershell
npm run dev
```

The frontend will run on `http://localhost:3000`

## 🗄️ MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Create a database user with a strong password
5. Get the connection string
6. Replace `username`, `password`, and `cluster` in `MONGO_URI`

## 💳 Payment Integration

### Stripe Setup
1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the dashboard
3. Add to `.env` in backend:
   - `STRIPE_SECRET_KEY` = sk_test_...
   - `STRIPE_WEBHOOK_SECRET` = whsec_... (for webhooks)
4. Add to `.env` in frontend:
   - `VITE_STRIPE_KEY` = pk_test_...

### Razorpay Setup (Optional)
1. Create a [Razorpay account](https://razorpay.com)
2. Get your keys from settings
3. Add to backend `.env`:
   - `RAZORPAY_KEY_ID` = rzp_test_...
   - `RAZORPAY_KEY_SECRET` = ...

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Products
- `GET /api/products` - Get all products (with pagination, search, filters)
- `GET /api/products/:id` - Get product details
- `GET /api/products/featured` - Get featured products
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)
- `POST /api/products/:id/reviews` - Add review

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/:itemId` - Update item quantity
- `DELETE /api/cart/:itemId` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Payments
- `POST /api/payments/stripe/create-payment-intent` - Create Stripe payment intent
- `POST /api/payments/stripe/confirm-payment` - Confirm payment
- `POST /api/payments/stripe/webhook` - Stripe webhook

### Admin
- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/dashboard/sales-chart` - Sales data (30 days)
- `GET /api/admin/dashboard/order-stats` - Order statistics
- `GET /api/admin/dashboard/top-products` - Top selling products
- `GET /api/admin/dashboard/low-stock` - Low stock alerts
- `GET /api/admin/dashboard/category-stats` - Category statistics

## 🧪 Testing

### Test User Credentials
- Email: `test@example.com`
- Password: `test123`

### Manual Testing Checklist
- [ ] User registration
- [ ] User login
- [ ] Browse products
- [ ] Add to cart
- [ ] Update cart quantity
- [ ] Remove from cart
- [ ] Checkout process
- [ ] Order creation
- [ ] Admin dashboard access
- [ ] Product management (add/edit/delete)
- [ ] Order status updates

## 🚀 Deployment

### Deploy Frontend to Firebase (Recommended)

**Quick Setup:**
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting` (select `frontend/dist` as public directory)
4. Update `.firebaserc` with your Firebase project ID
5. Deploy: `.\deploy-firebase.ps1` (Windows) or `./deploy-firebase.sh` (Linux/Mac)

**Detailed Guide:** See [FIREBASE_DEPLOYMENT.md](./FIREBASE_DEPLOYMENT.md) or [QUICK_FIREBASE_SETUP.md](./QUICK_FIREBASE_SETUP.md)

**Your app will be live at:**
- `https://your-project-id.web.app`
- `https://your-project-id.firebaseapp.com`

### Deploy Backend (Render/Railway/Heroku)

**Option 1: Railway (Recommended)**
1. Go to [Railway.app](https://railway.app/)
2. Create new project → Deploy from GitHub
3. Select backend directory
4. Add environment variables (MONGO_URI, JWT_SECRET, etc.)
5. Deploy automatically

**Option 2: Render**
1. Push your backend code to GitHub
2. Go to [Render.com](https://render.com)
3. Connect your GitHub account
4. Create a new Web Service
5. Configure:
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && node server.js`
6. Add Environment Variables:
   - `MONGO_URI` = your MongoDB connection string
   - `JWT_SECRET` = your secret key
   - `STRIPE_SECRET_KEY` = your Stripe secret
   - `CLIENT_URL` = your Firebase frontend URL
7. Deploy

**Option 3: Vercel (Alternative Frontend)**
1. Push your frontend code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Import your repository
4. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variables:
   - `VITE_API_URL` = your backend API URL
   - `VITE_STRIPE_KEY` = your Stripe public key
6. Deploy

### MongoDB Atlas Production Setup

1. Create a production cluster
2. Enable encryption at rest
3. Enable IP whitelist (whitelist your deployment IPs)
4. Create database backups
5. Use strong database passwords
6. Enable audit logging

## 🔐 Security Best Practices

- ✅ Always use HTTPS in production
- ✅ Rotate JWT secrets periodically
- ✅ Use environment variables for secrets
- ✅ Enable rate limiting
- ✅ Implement CORS correctly
- ✅ Validate all user inputs
- ✅ Use strong password hashing
- ✅ Keep dependencies updated
- ✅ Use Content Security Policy headers
- ✅ Monitor logs for suspicious activity

## 📊 Performance Optimization

- Images are lazy-loaded
- Database queries are paginated
- Indexes on frequently searched fields
- Gzip compression enabled
- React Query for data caching
- Code splitting with React Router
- Production build optimizations

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Verify IP is whitelisted in MongoDB Atlas
- Check connection string format
- Ensure database user has correct permissions

### CORS Errors
- Verify `CLIENT_URL` matches your frontend URL
- Check frontend `.env` has correct `VITE_API_URL`

### Port Already in Use
```powershell
# Find process using port 5000
netstat -ano | findstr :5000
# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Frontend Build Issues
```powershell
# Clear node_modules and reinstall
rm -r node_modules
npm install
npm run build
```

## 📝 Environment Variables Reference

### Backend `.env`
```
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
PORT=5000
NODE_ENV=development|production
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=xxx
CLIENT_URL=http://localhost:3000
```

### Frontend `.env`
```
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_KEY=pk_test_xxx
VITE_RAZORPAY_KEY=rzp_test_xxx
```

## 📚 Useful Links

- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)
- [Stripe Documentation](https://stripe.com/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and commercial purposes.

## 🎉 Getting Help

For issues, questions, or suggestions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check your environment variables
4. Review browser console for errors
5. Check server logs for backend errors

---

**Happy coding! 🚀**
