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

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);

// Base Endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the ZENITH Watches API' });
});

// Database Seed Function
const seedDatabase = async () => {
  try {
    // 1. Seed Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const initialProducts = [
        {
          name: 'Zenith Heritage Rose Gold',
          image: '/assets/media__1782899491225.jpg',
          brand: 'ZENITH',
          price: 1250,
          stock: 8,
          category: 'Heritage',
          gender: 'women',
          description: "A luxurious timeless classic watch featuring a stunning rose gold casing and index numerals, matching its premium metallic link bracelet. A tribute to Zenith's heritage.",
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
          name: 'Zenith Chronomaster Black Edition',
          image: '/assets/media__1782899491297.jpg',
          brand: 'ZENITH',
          price: 4800,
          stock: 5,
          category: 'Chronomaster',
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
          name: 'Zenith Elite Classic Brown',
          image: '/assets/media__1782899491320.jpg',
          brand: 'ZENITH',
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
          name: 'Zenith Defy Automatic Steel',
          image: '/assets/media__1782899491366.jpg',
          brand: 'ZENITH',
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
        }
      ];
      await Product.insertMany(initialProducts);
      console.log('Database Seeding: Products successfully seeded!');
    }

    // 2. Seed Default Coupons
    const couponCount = await Coupon.countDocuments();
    if (couponCount === 0) {
      const initialCoupons = [
        { code: 'ZENITHSTAR', discountPercent: 20, description: '20% off Zenith Signature Collection' },
        { code: 'WELCOME10', discountPercent: 10, description: '10% off for first-time buyers' }
      ];
      await Coupon.insertMany(initialCoupons);
      console.log('Database Seeding: Coupons successfully seeded!');
    }

    // 3. Seed Default Admin User
    const adminExists = await User.findOne({ email: 'admin@zenith.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin Administrator',
        email: 'admin@zenith.com',
        password: 'admin123', // User model hooks will hash this auto
        role: 'admin'
      });
      console.log('Database Seeding: Default admin user (admin@zenith.com / admin123) successfully seeded!');
    }

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Database Connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zenith-watches';
mongoose.connect(mongoURI)
  .then(async () => {
    console.log('Successfully connected to MongoDB');
    await seedDatabase();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

const PORT = process.env.PORT || 5000;

// Only listen when running locally
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
