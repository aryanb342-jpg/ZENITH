import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Models
import Product from './models/Product.js';
import User from './models/User.js';
import Coupon from './models/Coupon.js';

// Import Routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import orderRoutes from './routes/orders.js';
import couponRoutes from './routes/coupons.js';
import cartRoutes from './routes/cart.js';
import wishlistRoutes from './routes/wishlist.js';

dotenv.config();

const app = express();

// Database Connection Status Variables
let dbConnectionError = null;
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/khroniq-watches';

// Middleware to ensure DB connection and seeding
const ensureDb = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('Connecting to MongoDB via middleware...');
      await mongoose.connect(mongoURI);
      console.log('Connected to MongoDB');
      dbConnectionError = null;
    }
    await seedDatabase();
    next();
  } catch (err) {
    console.error('ensureDb connection error:', err);
    dbConnectionError = err.message || err.toString();
    next();
  }
};

// Middlewares
app.use(cors());
app.use(express.json());
app.use(ensureDb);

// Vercel Serverless Routing URL Restorer
app.use((req, res, next) => {
  if (req.headers['x-now-route-asis'] || process.env.VERCEL) {
    req.url = req.originalUrl;
  }
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Base Endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the KHRONIQ Watches API' });
});

// Diagnostics Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    env: {
      has_mongodb_uri: !!process.env.MONGODB_URI,
      has_jwt_secret: !!process.env.JWT_SECRET,
      node_env: process.env.NODE_ENV
    },
    mongoose: {
      readyState: mongoose.connection.readyState, // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      error: dbConnectionError
    }
  });
});

// Database Seed Function
const seedDatabase = async () => {
  try {
    // Migration: Update existing products with category 'Chronomaster' to 'Khronomaster'
    await Product.updateMany({ category: 'Chronomaster' }, { $set: { category: 'Khronomaster' } });

    // 1. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount < 8) {
      const initialProducts = [
        {
          name: 'Khroniq Heritage Rose Gold',
          image: '/assets/media__1782899491225.jpg',
          brand: 'KHRONIQ',
          price: 1250,
          stock: 8,
          category: 'Heritage',
          gender: 'women',
          description: "A luxurious timeless classic watch featuring a stunning rose gold casing and index numerals, matching its premium metallic link bracelet. A tribute to Khroniq's heritage.",
          specs: {
            movement: 'Automatic Chronometer',
            case: 'Rose Gold PVD Steel (40mm)',
            strap: 'Rose Gold Stainless Steel Bracelet',
            waterResistance: '50m (5 ATM)',
            glass: 'Scratch-resistant Sapphire Crystal'
          },
          reviews: [
            { userName: 'John Doe', rating: 5, comment: 'Exquisite design, feels very premium and heavy. Highly recommend!', date: '2026-06-15', status: 'approved' },
            { userName: 'Alice Smith', rating: 4, comment: 'Elegant dial, but the bracelet needed adjustment. Overall beautiful watch.', date: '2026-06-20', status: 'approved' }
          ]
        },
        {
          name: 'Khroniq Khronomaster Black Edition',
          image: '/assets/media__1782899491297.jpg',
          brand: 'KHRONIQ',
          price: 4800,
          stock: 5,
          category: 'Khronomaster',
          gender: 'men',
          description: 'High-precision luxury chronograph watch in matte black design with silver sub-dials and detailed tachymeter scale. Equipped with the legendary El Primero movement DNA.',
          specs: {
            movement: 'El Primero Chronograph (36,000 vph)',
            case: 'Matte Black Ceramic (42mm)',
            strap: 'Black Rubberized Steel Link',
            waterResistance: '100m (10 ATM)',
            glass: 'Double Anti-reflective Sapphire'
          },
          reviews: [
            { userName: 'Marc V.', rating: 5, comment: 'The El Primero movement is flawless. The black ceramic case is scratchproof!', date: '2026-05-10', status: 'approved' }
          ]
        },
        {
          name: 'Khroniq Elite Classic Brown',
          image: '/assets/media__1782899491320.jpg',
          brand: 'KHRONIQ',
          price: 2100,
          stock: 12,
          category: 'Elite',
          gender: 'unisex',
          description: 'An ultra-minimalist timepiece featuring an elegant cream white dial, gold baton markers, and a premium textured brown leather strap. Perfect for formal dress occasions.',
          specs: {
            movement: 'Elite Ultra-Thin Automatic',
            case: '18K Yellow Gold (39mm)',
            strap: 'Brown Alligator Leather',
            waterResistance: '30m (3 ATM)',
            glass: 'Dome Sapphire Crystal'
          },
          reviews: [
            { userName: 'David K.', rating: 4, comment: 'Classic dress watch. Super thin and fits under any cuff.', date: '2026-06-01', status: 'approved' }
          ]
        },
        {
          name: 'Khroniq Defy Automatic Steel',
          image: '/assets/media__1782899491366.jpg',
          brand: 'KHRONIQ',
          price: 3450,
          stock: 4,
          category: 'Defy',
          gender: 'men',
          description: 'A robust, sporty luxury watch with a brushed stainless steel case, textured black dial, day-date automatic calendar, and deep brown premium leather strap overlay.',
          specs: {
            movement: 'Automatic Calendar Caliber',
            case: 'Brushed Stainless Steel (41mm)',
            strap: 'Brown Leather with Rubber Backing',
            waterResistance: '100m (10 ATM)',
            glass: 'Scratch-resistant Sapphire'
          },
          reviews: [
            { userName: 'Sarah L.', rating: 5, comment: 'Sturdy yet elegant. Ideal everyday luxury watch.', date: '2026-06-25', status: 'approved' }
          ]
        },
        {
          name: 'Khroniq Khronomaster Open Heart',
          image: '/assets/media__1782899491297.jpg',
          brand: 'KHRONIQ',
          price: 5200,
          stock: 6,
          category: 'Khronomaster',
          gender: 'men',
          description: 'An exquisite luxury timepiece featuring a dial opening revealing the high-frequency El Primero balance wheel. Crafted with a polished steel case.',
          specs: {
            movement: 'El Primero Automatic Chronograph',
            case: 'Polished Steel (42mm)',
            strap: 'Alligator Leather Strap',
            waterResistance: '100m (10 ATM)',
            glass: 'Domed Sapphire Crystal'
          },
          reviews: []
        },
        {
          name: 'Khroniq Heritage Star Dial',
          image: '/assets/media__1782899491225.jpg',
          brand: 'KHRONIQ',
          price: 3100,
          stock: 4,
          category: 'Heritage',
          gender: 'women',
          description: 'A dazzling feminine watch with a diamond-studded bezel and a guilloche mother-of-pearl dial. Elegant and graceful.',
          specs: {
            movement: 'Elite Automatic Caliber',
            case: 'Steel with Diamond Bezel (37mm)',
            strap: 'White Satin Strap',
            waterResistance: '30m (3 ATM)',
            glass: 'Sapphire Crystal'
          },
          reviews: []
        },
        {
          name: 'Khroniq Elite Moonphase',
          image: '/assets/media__1782899491320.jpg',
          brand: 'KHRONIQ',
          price: 2650,
          stock: 7,
          category: 'Elite',
          gender: 'unisex',
          description: 'A sophisticated dress watch displaying the moon phases at 6 o\'clock. Featuring a clean silver sunray dial and gold markers.',
          specs: {
            movement: 'Elite Moonphase Automatic',
            case: 'Yellow Gold PVD (40mm)',
            strap: 'Black Leather Strap',
            waterResistance: '50m (5 ATM)',
            glass: 'Sapphire Crystal'
          },
          reviews: []
        },
        {
          name: 'Khroniq Defy Skyline Skeleton',
          image: '/assets/media__1782899491366.jpg',
          brand: 'KHRONIQ',
          price: 4100,
          stock: 5,
          category: 'Defy',
          gender: 'men',
          description: 'A modern architectural masterpiece featuring an openworked black skeleton dial inside a sharp octagonal steel case.',
          specs: {
            movement: 'El Primero High-Frequency Automatic',
            case: 'Brushed Steel Octagonal (41mm)',
            strap: 'Black Rubber Strap',
            waterResistance: '100m (10 ATM)',
            glass: 'Sapphire Crystal'
          },
          reviews: []
        }
      ];

      for (const prod of initialProducts) {
        const exists = await Product.findOne({ name: prod.name });
        if (!exists) {
          await Product.create(prod);
          console.log(`Database Seeding: Product "${prod.name}" successfully seeded!`);
        }
      }
    }

    // 2. Seed Default Coupons
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      const initialCoupons = [
        { code: 'KHRONIQSTAR', discountPercent: 20, description: '20% off Khroniq Signature Collection' },
        { code: 'WELCOME10', discountPercent: 10, description: '10% off for first-time buyers' }
      ];
      await Coupon.insertMany(initialCoupons);
      console.log('Database Seeding: Coupons successfully seeded!');
    }

    // 3. Seed Default Admin User
    const adminExists = await User.findOne({ email: 'admin@khroniq.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin Administrator',
        email: 'admin@khroniq.com',
        password: 'admin123', // User model hooks will hash this auto
        role: 'admin'
      });
      console.log('Database Seeding: Default admin user (admin@khroniq.com / admin123) successfully seeded!');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Non-blocking background database connection startup
mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Successfully connected to MongoDB in background');
    dbConnectionError = null;
    await seedDatabase();
  })
  .catch((err) => {
    console.error('MongoDB background connection error:', err);
    dbConnectionError = err.message || err.toString();
  });

const PORT = process.env.PORT || 5000;

// Only listen when running locally
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
