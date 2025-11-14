# 🎯 Admin Dashboard Guide

## Overview

The INFINITY Admin Dashboard is a comprehensive, modern admin panel built with React, Tailwind CSS, and Framer Motion. It provides a complete solution for managing products, orders, users, and analytics.

## Features

### ✅ Dashboard Overview
- Real-time statistics (Orders, Users, Products, Revenue)
- Sales charts and analytics
- Order status distribution
- Category statistics
- Top-selling products
- Recent orders

### ✅ Projects Management
- View all products with pagination
- Search and filter products
- Add new products
- Edit existing products
- Delete products
- Image upload support
- Stock management
- Category management

### ✅ Orders Management
- View all orders
- Filter by status
- Search orders
- Update order status
- View order details
- Payment status tracking

### ✅ Users Management
- View all registered users
- Search users
- View user details
- Role management
- User statistics

### ✅ Analytics
- Revenue charts (Area, Line, Bar)
- Order statistics
- Category distribution (Pie chart)
- Top-selling products
- Time range filters (7, 30, 90, 365 days)

### ✅ Settings
- Profile management
- Password change
- Account information
- Role display

## Design Features

- **Dark Theme**: Futuristic dark theme with cyan and pink accents
- **Animations**: Smooth Framer Motion animations
- **Responsive**: Fully responsive design for all devices
- **Sidebar Navigation**: Collapsible sidebar with icons
- **Top Navbar**: Search, notifications, and profile dropdown
- **Glowing Effects**: Subtle glow effects on interactive elements
- **Gradients**: Beautiful gradient backgrounds and buttons

## Accessing the Admin Dashboard

### Step 1: Create Admin User
```powershell
cd backend
npm run create-admin
```

### Step 2: Login
1. Go to `http://localhost:3000/login`
2. Login with admin credentials
3. Navigate to `/admin` or click "Admin" in navbar

### Step 3: Explore Dashboard
- Dashboard Overview: `/admin`
- Projects: `/admin/projects`
- Orders: `/admin/orders`
- Users: `/admin/users`
- Analytics: `/admin/analytics`
- Settings: `/admin/settings`

## Pages Overview

### 1. Dashboard Overview (`/admin`)
- **Stats Cards**: Total Orders, Users, Products, Revenue
- **Sales Chart**: Area chart showing revenue over time
- **Order Status Chart**: Bar chart showing orders by status
- **Category Distribution**: Pie chart showing products by category
- **Top Products**: List of top-selling products
- **Recent Orders**: Table of recent orders

### 2. Projects Management (`/admin/projects`)
- **List View**: Table of all products with images
- **Search**: Search products by title, description, brand
- **Filter**: Filter by category
- **Pagination**: Navigate through pages
- **Actions**: Edit and delete buttons
- **Add Project**: Button to add new product

### 3. Add/Edit Project (`/admin/projects/add` or `/admin/projects/edit/:id`)
- **Basic Information**: Title, category, price, brand, stock
- **Description**: Rich text description
- **Images**: Upload multiple images
- **Specifications**: Dynamic key-value pairs
- **Additional Info**: Warranty, returns policy
- **Options**: Featured product, active status

### 4. Orders Management (`/admin/orders`)
- **Order List**: Table of all orders
- **Search**: Search by order ID, customer name, email
- **Filter**: Filter by order status
- **Status Update**: Dropdown to update order status
- **Payment Status**: Display payment status
- **Order Details**: View order items and shipping info

### 5. Users Management (`/admin/users`)
- **User Grid**: Card view of all users
- **Search**: Search users by name or email
- **User Info**: Name, email, role, join date
- **Role Badge**: Display user role (admin/user)

### 6. Analytics (`/admin/analytics`)
- **Revenue Overview**: Area chart with time range selector
- **Order Statistics**: Bar chart of orders by status
- **Category Distribution**: Pie chart of products by category
- **Top Products**: List of top-selling products with revenue

### 7. Settings (`/admin/settings`)
- **Profile Settings**: Update name, phone
- **Password Change**: Change password
- **Account Info**: Display role, account created date, last login

## API Endpoints

### Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `GET /api/admin/dashboard/sales-chart` - Get sales chart data
- `GET /api/admin/dashboard/order-stats` - Get order statistics
- `GET /api/admin/dashboard/top-products` - Get top-selling products
- `GET /api/admin/dashboard/category-stats` - Get category statistics

### Projects
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status (admin only)

### Users
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/users/:id` - Get user by ID (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (admin only)

## Cloudinary Integration

### Setup
1. Create a Cloudinary account: https://cloudinary.com
2. Get your API credentials
3. Add to `.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Usage
```javascript
const { uploadImage, uploadVideo } = require('../utils/cloudinary');

// Upload image
const result = await uploadImage(imagePath, {
  folder: 'infinity-app/products',
  width: 800,
  height: 600
});

// Upload video
const videoResult = await uploadVideo(videoPath, {
  folder: 'infinity-app/videos'
});
```

### Implementation
The Cloudinary helper is available at `backend/src/utils/cloudinary.js`. To use it in the product form:

1. Install Cloudinary:
   ```powershell
   cd backend
   npm install cloudinary
   ```

2. Update product controller to use Cloudinary for image uploads
3. Update frontend to send image files to backend
4. Backend uploads to Cloudinary and returns URLs

## Styling

### Colors
- **Primary**: Cyan (#00d4ff)
- **Accent**: Pink (#ff006e)
- **Dark**: #0a0e12
- **Dark Light**: #1a1f28
- **Dark Lighter**: #131820

### Components
- **Cards**: Gradient backgrounds with borders
- **Buttons**: Gradient buttons with hover effects
- **Inputs**: Dark backgrounds with primary borders
- **Tables**: Dark tables with hover effects
- **Charts**: Custom styled charts matching the theme

## Responsive Design

- **Mobile**: Stacked layout, collapsible sidebar
- **Tablet**: Two-column layout
- **Desktop**: Full layout with sidebar and content

## Security

- **JWT Authentication**: All admin routes require authentication
- **Role-Based Access**: Only users with `role: 'admin'` can access
- **Protected Routes**: AdminRoute component protects all admin pages
- **API Security**: Backend middleware protects all admin endpoints

## Performance

- **Lazy Loading**: Images load on demand
- **Pagination**: Server-side pagination for large datasets
- **Optimized Queries**: Efficient database queries
- **Caching**: React Query for data caching (optional)

## Troubleshooting

### Admin Dashboard Not Loading
- Check if user has `role: 'admin'` in database
- Verify JWT token is valid
- Check browser console for errors
- Verify backend is running

### Images Not Uploading
- Check Cloudinary credentials in `.env`
- Verify image file size (max 10MB)
- Check network connection
- Verify Cloudinary account is active

### Charts Not Displaying
- Check if data exists in database
- Verify API endpoints are returning data
- Check browser console for errors
- Verify Recharts is installed

### Products Not Showing
- Check if products exist in database
- Verify filters are correct
- Check pagination settings
- Verify API is returning data

## Next Steps

1. **Cloudinary Setup**: Set up Cloudinary for image/video uploads
2. **Email Notifications**: Add email notifications for orders
3. **Export Data**: Add export functionality for orders/products
4. **Advanced Analytics**: Add more analytics and reports
5. **Bulk Operations**: Add bulk delete/edit operations
6. **Product Variants**: Add product variants (sizes, colors)
7. **Inventory Management**: Add advanced inventory management
8. **Shipping Integration**: Add shipping provider integration

## Support

For issues or questions:
1. Check the browser console for errors
2. Check the backend logs
3. Verify environment variables
4. Check database connection
5. Review API documentation

---

**Happy Admin-ing! 🚀**

