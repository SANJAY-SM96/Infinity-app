# INFINITY Frontend Documentation

## Starting the Frontend Server

### Quick Start

```powershell
cd p:\clg_proj\Infinity-app\frontend
npm install
copy .env.example .env
# Edit .env with your values
npm run dev
```

The development server will start on `http://localhost:3000`

## Project Structure

### Components
- `Navbar.jsx` - Top navigation bar
- `Footer.jsx` - Footer with links
- `ProductCard.jsx` - Product display card
- `Loader.jsx` - Loading spinner
- `ProtectedRoute.jsx` - Auth protected route
- `AdminRoute.jsx` - Admin only route

### Pages
- `Home.jsx` - Homepage with featured products
- `ProductList.jsx` - Product listing with filters
- `ProductDetails.jsx` - Single product page
- `Cart.jsx` - Shopping cart
- `Checkout.jsx` - Checkout form
- `Login.jsx` - Login page
- `Register.jsx` - Registration page
- `UserDashboard.jsx` - User profile and orders
- `AdminDashboard.jsx` - Admin analytics

### Context API
- `AuthContext.jsx` - Authentication state
- `CartContext.jsx` - Shopping cart state

### API Services
- `apiClient.js` - Axios configuration with interceptors
- `authService.js` - Auth endpoints
- `productService.js` - Product endpoints
- `cartService.js` - Cart endpoints
- `orderService.js` - Order endpoints
- `paymentService.js` - Payment endpoints
- `adminService.js` - Admin endpoints

## State Management

### AuthContext
```javascript
{
  user,           // Current user object
  token,          // JWT token
  loading,        // Loading state
  isAuthenticated, // Boolean flag
  login(email, password),
  register(name, email, password),
  logout(),
  updateProfile(data)
}
```

### CartContext
```javascript
{
  cart,           // Cart object with items
  loading,        // Loading state
  cartCount,      // Number of items
  cartTotal,      // Total price
  fetchCart(),
  addToCart(productId, quantity),
  updateCartItem(itemId, quantity),
  removeFromCart(itemId),
  clearCart()
}
```

## Styling

- **Framework**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Colors**:
  - Primary: `#00d4ff` (cyan)
  - Accent: `#ff006e` (pink)
  - Dark: `#0b0f14`
  - Dark Light: `#1a1f28`

## UI Components Usage

### ProductCard
```jsx
<ProductCard product={product} />
```

### Loader
```jsx
<Loader />
```

### ProtectedRoute
```jsx
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>
```

## Forms & Validation

### Frontend Validation
- Email format validation
- Password strength (min 6 chars)
- Required field checks
- Axios request/response validation

### Backend Validation
- Express-validator rules
- Schema validation with Mongoose
- Sanitization of inputs

## API Error Handling

Errors are caught with try-catch and displayed using:
```jsx
import toast from 'react-hot-toast';

try {
  const response = await service.action();
} catch (error) {
  toast.error(error.response?.data?.message || 'Error occurred');
}
```

## Performance Tips

1. **Lazy Loading**: Images use `loading="lazy"`
2. **Code Splitting**: Pages are loaded on-demand
3. **Caching**: Cart data cached in localStorage
4. **Pagination**: Products loaded in batches
5. **Debouncing**: Search uses debounce to reduce API calls

## Common Tasks

### Add New Page
1. Create file in `src/pages/`
2. Add route in `App.jsx`
3. Add navigation link in `Navbar.jsx`

### Add New API Call
1. Create method in `src/api/` service file
2. Use in component with try-catch
3. Display errors with toast

### Modify Theme Colors
Edit `tailwind.config.js` theme.extend.colors

### Add New Component
1. Create file in `src/components/`
2. Export as default
3. Import and use in pages

## Building for Production

```powershell
npm run build
# Creates dist/ folder
npm run preview  # Test production build locally
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Responsive Breakpoints

- Mobile: 0px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px+

Uses Tailwind breakpoints: `sm`, `md`, `lg`, `xl`

## Environment Variables

- `VITE_API_URL` - Backend API base URL
- `VITE_STRIPE_KEY` - Stripe public key
- `VITE_RAZORPAY_KEY` - Razorpay key

## Development Tips

- Use React DevTools extension
- Check Network tab for API calls
- Use localStorage for debugging
- Test on mobile devices/emulators
- Validate forms before submission
- Check console for errors
