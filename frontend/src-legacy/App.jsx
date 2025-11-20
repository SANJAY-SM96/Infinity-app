import React, { Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Loader from './components/Loader';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductList from './pages/ProductList';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register.jsx';
import OTPVerification from './pages/OTPVerification';
import UserDashboard from './pages/UserDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import OrderDetails from './pages/OrderDetails';
import StudentHome from './pages/StudentHome';
import CustomerHome from './pages/CustomerHome';
import AdminDashboard from './pages/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminProjectForm from './pages/admin/AdminProjectForm';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';
import AdminOAuthConfig from './pages/admin/AdminOAuthConfig';
import AdminProjectRequests from './pages/admin/AdminProjectRequests';
import AdminSEOTools from './pages/admin/AdminSEOTools';
import AdminSEOContent from './pages/admin/AdminSEOContent';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminBlogForm from './pages/admin/AdminBlogForm';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import TermsAndConditions from './pages/TermsAndConditions';
import ShippingPolicy from './pages/ShippingPolicy';
import CancellationsAndRefunds from './pages/CancellationsAndRefunds';

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
  const { isAuthenticated } = useAuth();

  return (
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
        element={isAuthenticated ? <Navigate to="/" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" /> : <Register />}
      />
      <Route
        path="/verify-otp"
        element={isAuthenticated ? <Navigate to="/" /> : <OTPVerification />}
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
    </Routes>
  );
}

function AppContent() {
  const location = useLocation();
  const { isDark } = useTheme();
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
