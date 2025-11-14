# 🔐 How to Access Admin Page

## Overview

To access the admin dashboard at `/admin`, you need a user account with `role: 'admin'`. By default, all new users are created with `role: 'user'`.

## Method 1: Using the Create Admin Script (Recommended)

### Step 1: Make sure your backend is set up
- Ensure you have a `.env` file in the `backend` folder
- Make sure `MONGO_URI` is configured correctly
- Your MongoDB database should be accessible

### Step 2: Run the create admin script

```powershell
# Navigate to backend folder
cd p:\clg_proj\Infinity-app\backend

# Create admin with default credentials
npm run create-admin

# OR create admin with custom credentials
npm run create-admin admin@example.com mypassword123 "Admin Name"
```

### Step 3: Login with admin credentials
1. Go to `http://localhost:3000/login`
2. Enter the admin email and password
3. Click "Login"
4. You'll see an "Admin" link in the navbar (if you're logged in as admin)
5. Click on "Admin" or navigate to `http://localhost:3000/admin`

## Method 2: Manual MongoDB Update

### Step 1: Create a regular user
1. Go to `http://localhost:3000/register`
2. Register a new user with your email and password

### Step 2: Update user role in MongoDB

#### Option A: Using MongoDB Compass (GUI)
1. Open MongoDB Compass
2. Connect to your MongoDB Atlas cluster
3. Navigate to your database (e.g., `infinity-app`)
4. Open the `users` collection
5. Find your user by email
6. Edit the user document
7. Change `role` from `"user"` to `"admin"`
8. Save the changes

#### Option B: Using MongoDB Shell (mongosh)
```bash
# Connect to your database
mongosh "your-mongodb-connection-string"

# Switch to your database
use infinity-app

# Update user role
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)

# Verify the update
db.users.findOne({ email: "your-email@example.com" })
```

#### Option C: Using MongoDB Atlas Web Interface
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to your cluster
3. Click "Browse Collections"
4. Find your database and `users` collection
5. Find your user document
6. Click "Edit Document"
7. Change `role` field to `"admin"`
8. Click "Update"

### Step 3: Login and access admin
1. Logout from your account (if logged in)
2. Login again with your credentials
3. Navigate to `http://localhost:3000/admin`

## Method 3: Update Existing User via API (Advanced)

If you already have admin access, you can promote other users:

1. Login as admin
2. Use the API endpoint:
```bash
PUT /api/users/:userId/role
Headers: Authorization: Bearer <admin_token>
Body: { "role": "admin" }
```

## Verification

To verify you have admin access:

1. **Check the Navbar**: After logging in, you should see an "Admin" link in the navbar
2. **Check User Role**: In your browser console, check `localStorage.getItem('user')` - the role should be `"admin"`
3. **Try Admin Route**: Navigate to `http://localhost:3000/admin` - you should see the admin dashboard

## Troubleshooting

### Issue: Admin link not showing in navbar
- **Solution**: Make sure you've logged out and logged back in after updating the role
- Clear browser cache and localStorage
- Check that `user.role === 'admin'` in your AuthContext

### Issue: Can't access /admin page (redirects to home)
- **Solution**: 
  1. Verify your user role is actually `"admin"` in the database
  2. Logout and login again
  3. Check browser console for errors
  4. Verify the token is being sent with requests

### Issue: Script fails to connect to MongoDB
- **Solution**:
  1. Check your `.env` file has `MONGO_URI` set correctly
  2. Make sure MongoDB Atlas IP whitelist includes your IP (or `0.0.0.0/0` for development)
  3. Verify your MongoDB connection string format

### Issue: "User already exists" error
- **Solution**: The script will check if the user exists and promote them to admin if they're not already admin

## Default Admin Credentials (if using script defaults)

- **Email**: `admin@infinity.com`
- **Password**: `admin123`
- **Name**: `Admin User`

**⚠️ IMPORTANT**: Change these default credentials in production!

## Security Notes

1. **Never commit admin credentials** to version control
2. **Change default passwords** immediately after setup
3. **Use strong passwords** for admin accounts
4. **Limit admin access** to trusted users only
5. **Monitor admin activity** in production

## Admin Features

Once you have admin access, you can:

- ✅ View dashboard statistics
- ✅ Manage products (add, edit, delete)
- ✅ Manage orders (view, update status)
- ✅ Manage users (view, update roles)
- ✅ View sales analytics and charts
- ✅ View low stock alerts
- ✅ View category statistics
- ✅ View top-selling products

## Quick Command Reference

```powershell
# Create admin user
cd backend
npm run create-admin

# Create admin with custom credentials
npm run create-admin your-email@example.com yourpassword "Your Name"

# Start backend (if not running)
npm run dev

# Start frontend (if not running)
cd ../frontend
npm run dev
```

---

## Need Help?

1. Check the browser console for errors
2. Check the backend server logs
3. Verify MongoDB connection
4. Check that all environment variables are set
5. Review the `AdminRoute` component in `frontend/src/components/AdminRoute.jsx`

---

**Happy Admin-ing! 🚀**

