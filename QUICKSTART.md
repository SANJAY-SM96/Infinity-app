# 🚀 INFINITY - Quick Start Guide

## 30-Second Setup

```powershell
# Terminal 1 - Backend
cd p:\clg_proj\Infinity-app\backend
npm install
copy .env.example .env
# Edit .env file with MongoDB URI
npm run dev

# Terminal 2 - Frontend (after backend starts)
cd p:\clg_proj\Infinity-app\frontend
npm install
copy .env.example .env
npm run dev
```

Visit: **http://localhost:3000**

---

## 📋 Pre-Setup Requirements

1. **Node.js** (18+): Download from [nodejs.org](https://nodejs.org)
2. **MongoDB Atlas**: Free account at [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
3. **Stripe** (optional): Account at [stripe.com](https://stripe.com)

---

## 🔑 MongoDB Atlas Setup (5 minutes)

1. Create free MongoDB Atlas account
2. Create a cluster (choose Free tier M0)
3. Create a database user (remember username & password)
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/infinity`
5. Paste into backend `.env` as `MONGO_URI`

---

## 🏗️ Project Structure at a Glance

```
Backend:
- server.js → Express app entry
- src/models/ → Database schemas
- src/routes/ → API endpoints
- src/controllers/ → Business logic
- src/middleware/ → Auth, errors, validation

Frontend:
- src/App.jsx → Main app component
- src/pages/ → Page components
- src/components/ → Reusable UI components
- src/context/ → Auth & Cart state
- src/api/ → API service methods
```

---

## 📚 Documentation Files

1. **README.md** - Full project overview & features
2. **BACKEND.md** - Backend API documentation
3. **FRONTEND.md** - Frontend structure & components
4. **DATABASE.md** - Database schema & queries
5. **DEPLOYMENT.md** - Production deployment guide

---

## 🧪 Test the App

### Create Test User
1. Go to http://localhost:3000/register
2. Enter any name, email, password
3. You'll auto-login

### Add Test Product (Admin Only)
1. Login with admin role (manually set in MongoDB)
2. Go to `/admin` dashboard
3. Create a product

### Test Purchase Flow
1. Go to `/products`
2. Click a product
3. Add to cart
4. Checkout with test Stripe card: `4242 4242 4242 4242`

---

## 🔧 Common Commands

### Backend
```powershell
npm run dev      # Start development server
npm start        # Start production server
npm test         # Run tests (if configured)
```

### Frontend
```powershell
npm run dev      # Start development server
npm run build    # Create production build
npm run preview  # Test production build
```

---

## 🐛 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection fails | Check .env MONGO_URI, verify IP whitelist |
| CORS errors | Verify backend CLIENT_URL matches frontend origin |
| API 404 errors | Check backend is running on port 5000 |
| Page not found | Make sure frontend routes match in App.jsx |
| Styling not loaded | Run `npm install` in frontend folder |

---

## 📱 Testing Credentials

| Field | Value |
|-------|-------|
| Email | any@example.com |
| Password | anything (min 6 chars) |
| Stripe Test Card | 4242 4242 4242 4242 |
| Stripe Exp | Any future date (12/25) |
| Stripe CVC | Any 3 digits (123) |

---

## 🎯 Next Steps

After setup works:

1. ✅ **Explore the API** - Try endpoints in Postman
2. ✅ **Understand the flow** - Trace a product purchase
3. ✅ **Customize design** - Edit colors in `tailwind.config.js`
4. ✅ **Add more products** - Use admin dashboard
5. ✅ **Setup Stripe keys** - Get live keys from Stripe
6. ✅ **Deploy** - Follow DEPLOYMENT.md guide

---

## 📞 Getting Help

### Check These Files First
- Error in API? → Check `BACKEND.md`
- UI issue? → Check `FRONTEND.md`
- Database error? → Check `DATABASE.md`
- Deployment issue? → Check `DEPLOYMENT.md`

### Common Fixes
```powershell
# Clear everything and restart
cd backend && rm -r node_modules && npm install && npm run dev
cd frontend && rm -r node_modules && npm install && npm run dev
```

---

## ✨ Features Checklist

- ✅ User Registration & Login (JWT)
- ✅ Product Catalog with Search
- ✅ Shopping Cart
- ✅ Checkout Process
- ✅ Order Management
- ✅ Admin Dashboard
- ✅ Analytics Charts
- ✅ Dark Theme UI
- ✅ Responsive Design
- ✅ Payment Integration (Stripe ready)

---

## 🚀 You're All Set!

**Backend**: http://localhost:5000
**Frontend**: http://localhost:3000
**Admin**: http://localhost:3000/admin (if admin user)

---

### Now What?

1. **Read** BACKEND.md for API details
2. **Explore** the frontend pages and components
3. **Try** creating products and orders
4. **Test** the admin analytics dashboard
5. **Deploy** when ready (see DEPLOYMENT.md)

---

**Happy coding! 🎉**

For detailed guides, see the documentation files in the root directory.
