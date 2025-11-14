# 🚀 Quick Guide: Access Admin Dashboard

## ✅ Step-by-Step Instructions

### Step 1: Create Admin User

Open a terminal and run:

```powershell
cd p:\clg_proj\Infinity-app\backend
npm run create-admin
```

This will create an admin user with:
- **Email**: `admin@infinity.com`
- **Password**: `admin123`
- **Name**: `Admin User`

**OR** create with custom credentials:
```powershell
npm run create-admin your-email@example.com yourpassword "Your Name"
```

### Step 2: Login to the App

1. **Open your browser**: http://localhost:3000 (or http://localhost:3002 if that's where your frontend is running)

2. **Click "Login"** in the navbar or go to: http://localhost:3000/login

3. **Enter admin credentials**:
   - Email: `admin@infinity.com`
   - Password: `admin123`

4. **Click "Login"**

### Step 3: Access Admin Dashboard

**Option 1: Click "Admin" in Navbar**
- After logging in, you'll see an "Admin" link in the navbar
- Click on it to go to the admin dashboard

**Option 2: Direct URL**
- Navigate directly to: http://localhost:3000/admin
- Or: http://localhost:3002/admin (if that's your frontend port)

---

## 📍 Admin Dashboard URLs

Once logged in as admin, you can access:

- **Dashboard Overview**: http://localhost:3000/admin
- **Projects Management**: http://localhost:3000/admin/projects
- **Orders Management**: http://localhost:3000/admin/orders
- **Users Management**: http://localhost:3000/admin/users
- **Analytics**: http://localhost:3000/admin/analytics
- **Settings**: http://localhost:3000/admin/settings

---

## 🔐 Admin Dashboard Features

### Dashboard Overview (`/admin`)
- View statistics (Orders, Users, Products, Revenue)
- See sales charts
- View recent orders
- See top-selling products

### Projects Management (`/admin/projects`)
- View all products
- Add new products
- Edit existing products
- Delete products
- Search and filter products

### Orders Management (`/admin/orders`)
- View all orders
- Update order status
- Search orders
- Filter by status

### Users Management (`/admin/users`)
- View all registered users
- Search users
- View user details

### Analytics (`/admin/analytics`)
- View revenue charts
- See order statistics
- View category distribution
- See top-selling products

### Settings (`/admin/settings`)
- Update profile
- Change password
- View account information

---

## ⚠️ Troubleshooting

### Issue: Admin link not showing in navbar
**Solution:**
1. Make sure you're logged in as admin
2. Verify your user role is `admin` in the database
3. Logout and login again
4. Clear browser cache

### Issue: Can't access `/admin` page (redirects to home)
**Solution:**
1. Verify your user role is `admin` in the database
2. Create admin user: `cd backend && npm run create-admin`
3. Logout and login again
4. Check browser console for errors

### Issue: "Not authorized" error
**Solution:**
1. Make sure backend server is running
2. Verify JWT token is valid
3. Check if user role is `admin`
4. Try logging out and logging in again

### Issue: Cannot login
**Solution:**
1. Verify backend is running on port 5000
2. Check MongoDB connection
3. Verify admin user exists in database
4. Check browser console for errors

---

## 🎯 Quick Commands

### Create Admin User
```powershell
cd backend
npm run create-admin
```

### Start Backend Server
```powershell
cd backend
npm run dev
```

### Start Frontend Server
```powershell
cd frontend
npm run dev
```

### Check Server Status
```powershell
# Backend Health Check
Invoke-WebRequest -Uri "http://localhost:5000/health"

# Frontend Check
Invoke-WebRequest -Uri "http://localhost:3000"
```

---

## 📝 Notes

- **Default Admin Credentials**:
  - Email: `admin@infinity.com`
  - Password: `admin123`
  
- **Change Default Password**: After first login, go to Settings and change your password

- **Admin User Creation**: The script will create an admin user if it doesn't exist, or promote an existing user to admin

- **Multiple Admin Users**: You can create multiple admin users by running the script with different emails

---

## 🚀 You're All Set!

1. ✅ Create admin user: `cd backend && npm run create-admin`
2. ✅ Login at: http://localhost:3000/login
3. ✅ Access admin dashboard: http://localhost:3000/admin
4. ✅ Start managing your store!

---

**Happy Admin-ing! 🎉**

