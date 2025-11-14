# Database Schema & Migrations

## MongoDB Collections

### Users Collection
```javascript
db.users.createIndex({ email: 1 })

// Sample document
{
  _id: ObjectId("..."),
  name: "John Doe",
  email: "john@example.com",
  password: "$2a$10$...", // bcrypt hash
  avatar: "https://...",
  role: "user", // or "admin"
  addresses: [
    {
      _id: ObjectId("..."),
      label: "Home",
      fullName: "John Doe",
      phone: "+1234567890",
      line1: "123 Main St",
      line2: "",
      city: "New York",
      state: "NY",
      postalCode: "10001",
      country: "US",
      isDefault: true
    }
  ],
  phone: "+1234567890",
  isActive: true,
  lastLogin: ISODate("2025-11-11T10:00:00Z"),
  createdAt: ISODate("2025-11-01T10:00:00Z"),
  updatedAt: ISODate("2025-11-11T10:00:00Z")
}
```

### Products Collection
```javascript
// Text index for search
db.products.createIndex({ title: "text", description: "text", brand: "text" })
db.products.createIndex({ category: 1 })
db.products.createIndex({ createdAt: -1 })

// Sample document
{
  _id: ObjectId("..."),
  title: "MacBook Pro 14-inch M3",
  slug: "macbook-pro-14-inch-m3",
  description: "Powerful laptop with M3 chip...",
  price: 1999.99,
  originalPrice: 2399.99,
  images: [
    "https://example.com/product1.jpg",
    "https://example.com/product2.jpg"
  ],
  category: "Laptops",
  brand: "Apple",
  stock: 50,
  rating: 4.5,
  reviews: [
    {
      user: ObjectId("..."),
      name: "Jane Smith",
      rating: 5,
      comment: "Excellent product!",
      createdAt: ISODate("2025-11-10T10:00:00Z")
    }
  ],
  specifications: {
    processor: "Apple M3",
    ram: "16GB",
    storage: "512GB SSD",
    display: "14-inch",
    battery: "17 hours"
  },
  warranty: "1 year limited",
  returnsPolicy: "30 days",
  isFeatured: true,
  isActive: true,
  createdAt: ISODate("2025-11-01T10:00:00Z"),
  updatedAt: ISODate("2025-11-11T10:00:00Z")
}
```

### Carts Collection
```javascript
db.carts.createIndex({ user: 1 })

// Sample document
{
  _id: ObjectId("..."),
  user: ObjectId("..."),
  items: [
    {
      _id: ObjectId("..."),
      product: ObjectId("..."),
      title: "MacBook Pro 14-inch M3",
      price: 1999.99,
      image: "https://...",
      quantity: 1
    }
  ],
  total: 1999.99,
  itemCount: 1,
  createdAt: ISODate("2025-11-11T10:00:00Z"),
  updatedAt: ISODate("2025-11-11T10:00:00Z")
}
```

### Orders Collection
```javascript
db.orders.createIndex({ user: 1 })
db.orders.createIndex({ createdAt: -1 })

// Sample document
{
  _id: ObjectId("..."),
  user: ObjectId("..."),
  items: [
    {
      product: ObjectId("..."),
      title: "MacBook Pro 14-inch M3",
      price: 1999.99,
      quantity: 1,
      image: "https://..."
    }
  ],
  shippingInfo: {
    fullName: "John Doe",
    phone: "+1234567890",
    line1: "123 Main St",
    line2: "Apt 4",
    city: "New York",
    state: "NY",
    postalCode: "10001",
    country: "US"
  },
  paymentInfo: {
    provider: "stripe",
    transactionId: "pi_xxx",
    paymentStatus: "completed"
  },
  subtotal: 1999.99,
  tax: 99.99,
  shippingCost: 0,
  total: 2099.98,
  orderStatus: "Processing", // or "Confirmed", "Shipped", "Delivered"
  trackingNumber: "1Z999AA10123456784",
  notes: "Handle with care",
  createdAt: ISODate("2025-11-11T10:00:00Z"),
  updatedAt: ISODate("2025-11-11T10:00:00Z")
}
```

## Aggregation Pipelines

### Sales by Date (Last 30 Days)
```javascript
db.orders.aggregate([
  {
    $match: {
      createdAt: { $gte: new Date(new Date() - 30*24*60*60*1000) },
      "paymentInfo.paymentStatus": "completed"
    }
  },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      sales: { $sum: "$total" },
      orders: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
])
```

### Top Selling Products
```javascript
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.product",
      quantity: { $sum: "$items.quantity" },
      revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
    }
  },
  { $sort: { quantity: -1 } },
  { $limit: 10 },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "productDetails"
    }
  }
])
```

### Order Status Distribution
```javascript
db.orders.aggregate([
  {
    $group: {
      _id: "$orderStatus",
      count: { $sum: 1 }
    }
  }
])
```

## Data Seeding Script

Create `backend/scripts/seedData.js`:

```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Product = require('../src/models/Product');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create sample products
    const products = await Product.insertMany([
      {
        title: 'MacBook Pro 14-inch',
        description: 'Powerful laptop with M3 chip',
        price: 1999.99,
        originalPrice: 2399.99,
        images: ['https://via.placeholder.com/300'],
        category: 'Laptops',
        brand: 'Apple',
        stock: 50,
        isFeatured: true
      },
      // Add more products...
    ]);

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
```

Run with: `node scripts/seedData.js`

## Backup & Recovery

### Backup MongoDB Atlas
1. Go to MongoDB Atlas Dashboard
2. Select cluster > Backup tab
3. Click "Create a backup"
4. Configure retention policy

### Restore from Backup
1. Go to Backup tab
2. Click "..." menu
3. Select "Restore from backup"
4. Choose backup point and restore to new cluster

## Performance Indexes

Recommended indexes:
```javascript
// Users
db.users.createIndex({ email: 1 })

// Products
db.products.createIndex({ title: "text", description: "text" })
db.products.createIndex({ category: 1 })
db.products.createIndex({ createdAt: -1 })

// Orders
db.orders.createIndex({ user: 1 })
db.orders.createIndex({ createdAt: -1 })
db.orders.createIndex({ "paymentInfo.paymentStatus": 1 })

// Carts
db.carts.createIndex({ user: 1 })
```

Check index usage:
```javascript
db.collection.aggregate([{ $indexStats: {} }])
```
