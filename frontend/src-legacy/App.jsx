import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Loader from './components/Loader';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import LogoutAnimation from './components/LogoutAnimation';
import LoginAnimation from './components/LoginAnimation';

// Pages
// Pages - Lazy Loaded
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const ProductList = React.lazy(() => import('./pages/ProductList'));
const ProductDetails = React.lazy(() => import('./pages/ProductDetails'));
const Cart = React.lazy(() => import('./pages/Cart'));
const Checkout = React.lazy(() => import('./pages/Checkout'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register.jsx'));
const OTPVerification = React.lazy(() => import('./pages/OTPVerification'));
const UserDashboard = React.lazy(() => import('./pages/UserDashboard'));
const StudentDashboard = React.lazy(() => import('./pages/StudentDashboard'));
const CustomerDashboard = React.lazy(() => import('./pages/CustomerDashboard'));
const OrderDetails = React.lazy(() => import('./pages/OrderDetails'));
const StudentHome = React.lazy(() => import('./pages/StudentHome'));
const CustomerHome = React.lazy(() => import('./pages/CustomerHome'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AdminProjects = React.lazy(() => import('./pages/admin/AdminProjects'));
const AdminProjectForm = React.lazy(() => import('./pages/admin/AdminProjectForm'));
const AdminOrders = React.lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers'));
const AdminAnalytics = React.lazy(() => import('./pages/admin/AdminAnalytics'));
const AdminSettings = React.lazy(() => import('./pages/admin/AdminSettings'));
const AdminOAuthConfig = React.lazy(() => import('./pages/admin/AdminOAuthConfig'));
const AdminProjectRequests = React.lazy(() => import('./pages/admin/AdminProjectRequests'));
const AdminSEOTools = React.lazy(() => import('./pages/admin/AdminSEOTools'));
const AdminSEOContent = React.lazy(() => import('./pages/admin/AdminSEOContent'));
const AdminBlogs = React.lazy(() => import('./pages/admin/AdminBlogs'));
const AdminBlogForm = React.lazy(() => import('./pages/admin/AdminBlogForm'));
const BlogList = React.lazy(() => import('./pages/BlogList'));
const BlogDetail = React.lazy(() => import('./pages/BlogDetail'));
const TermsAndConditions = React.lazy(() => import('./pages/TermsAndConditions'));
const ShippingPolicy = React.lazy(() => import('./pages/ShippingPolicy'));
const CancellationsAndRefunds = React.lazy(() => import('./pages/CancellationsAndRefunds'));
const SelectRole = React.lazy(() => import('./pages/SelectRole'));

// Lazy load PrivacyPolicy to avoid ad blocker issues
const PrivacyPolicy = React.lazy(() =>
  import('./pages/PrivacyPolicy').catch(() => ({
    default: () => (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Please disable your ad blocker to view this page, or contact us directly.
          </p>
          <a
            href="mailto:infinitywebtechnology1@gmail.com"
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
          >
            Contact Us
          </a>
        </div>
      </div>
    )
  }))
);

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  // Helper component to redirect authenticated users to their home page
  const AuthRedirect = () => {
    if (!isAuthenticated) return null;

    const userData = user || JSON.parse(localStorage.getItem('user') || '{}');

    if (userData.userType === 'student') {
      return <Navigate to="/home/student" replace />;
    } else if (userData.userType === 'customer') {
      return <Navigate to="/home/customer" replace />;
    } else if (userData.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return null;
  };

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={isAuthenticated ? <AuthRedirect /> : <Login />}
        />
        <Route
          path="/register"
          element={isAuthenticated ? <AuthRedirect /> : <Register />}
        />
        <Route
          path="/verify-otp"
          element={isAuthenticated ? <Navigate to="/" /> : <OTPVerification />}
        />
        <Route
          path="/select-role"
          element={
            <ProtectedRoute>
              <SelectRole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/customer"
          element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/student"
          element={
            <ProtectedRoute>
              <StudentHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/home/customer"
          element={
            <ProtectedRoute>
              <CustomerHome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <AdminRoute>
              <AdminProjects />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/projects/add"
          element={
            <AdminRoute>
              <AdminProjectForm />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/projects/edit/:id"
          element={
            <AdminRoute>
              <AdminProjectForm />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <AdminRoute>
              <AdminAnalytics />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <AdminSettings />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/oauth-config"
          element={
            <AdminRoute>
              <AdminOAuthConfig />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/project-requests"
          element={
            <AdminRoute>
              <AdminProjectRequests />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/seo-tools"
          element={
            <AdminRoute>
              <AdminSEOTools />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/seo-content"
          element={
            <AdminRoute>
              <AdminSEOContent />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/blogs"
          element={
            <AdminRoute>
              <AdminBlogs />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/blogs/new"
          element={
            <AdminRoute>
              <AdminBlogForm />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/blogs/edit/:id"
          element={
            <AdminRoute>
              <AdminBlogForm />
            </AdminRoute>
          }
        />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route
          path="/privacy-policy"
          element={
            <Suspense fallback={<Loader />}>
              <PrivacyPolicy />
            </Suspense>
          }
        />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/cancellations-and-refunds" element={<CancellationsAndRefunds />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes >
    </Suspense >
  );
}

function AppContent() {
  const location = useLocation();
  const { isDark } = useTheme();
  const { isLoggingOut, isLoggingIn } = useAuth();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isHomePage = location.pathname === '/';

  // Theme-aware background classes - matching About/Contact pages
  const bgClass = isDark
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    : 'bg-gradient-to-br from-slate-50 via-indigo-50/30 to-primary-50/20';

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${bgClass}`}>
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <AnimatePresence>
        {isLoggingOut && <LogoutAnimation />}
        {isLoggingIn && <LoginAnimation />}
      </AnimatePresence>
      {!isAdminRoute && <Navbar isHomePage={isHomePage} />}
      <main id="main-content" className="flex-1" role="main">
        <AppRoutes />
      </main>
      {!isAdminRoute && <Footer isHomePage={isHomePage} />}
      <Toaster position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
