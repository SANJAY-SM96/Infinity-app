# INFINITY Backend Documentation

## Starting the Backend Server

### Quick Start

```powershell
cd p:\clg_proj\Infinity-app\backend
npm install
copy .env.example .env
# Edit .env with your values
npm run dev
```

The server will start on `http://localhost:5000`

## API Response Format

All API endpoints return JSON in the following format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    ...
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Authentication

All protected routes require the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

## Rate Limiting

- General: 100 requests per 15 minutes per IP
- Auth endpoints: Standard rate limit
- Admin endpoints: Standard rate limit

## Database Models

### User
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  avatar: String,
  role: 'user' | 'admin',
  addresses: [Address],
  phone: String,
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Product
```javascript
{
  _id: ObjectId,
  title: String (unique),
  slug: String (unique),
  description: String,
  price: Number,
  originalPrice: Number,
  images: [String],
  category: String,
  brand: String,
  stock: Number,
  rating: Number,
  reviews: [Review],
  specifications: Map,
  warranty: String,
  returnsPolicy: String,
  isFeatured: Boolean,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  _id: ObjectId,
  user: ObjectId,
  items: [OrderItem],
  shippingInfo: Object,
  paymentInfo: {
    provider: 'stripe' | 'razorpay' | 'cod',
    transactionId: String,
    paymentStatus: 'pending' | 'completed' | 'failed'
  },
  subtotal: Number,
  tax: Number,
  shippingCost: Number,
  total: Number,
  orderStatus: String,
  trackingNumber: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Common Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Server Error

## Pagination

Use query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12, max: 100)

Example: `GET /api/products?page=1&limit=12`

## Filtering & Search

Products endpoint supports:
- `search` - Search by title, description, brand
- `category` - Filter by category
- `sortBy` - Sort field (default: -createdAt)

Example: `GET /api/products?search=laptop&category=Laptops&sortBy=price`

## Development Tips

- Use Postman or Insomnia for API testing
- Check network tab in browser DevTools for requests
- Monitor server logs in terminal
- Use MongoDB Atlas UI to verify data
- Test error cases thoroughly
