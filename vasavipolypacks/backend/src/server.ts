import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { PrismaClient } from './db/mongodb';

// Routes imports
import authRoutes from './routes/auth.routes';
import quoteRoutes from './routes/quote.routes';
import configRoutes from './routes/config.routes';
import orderRoutes from './routes/order.routes';
import leadRoutes from './routes/lead.routes';
import adminRoutes from './routes/admin.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
export const prisma = new PrismaClient();

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date(), service: 'Vasavi Polypacks API' });
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/configs', configRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/admin', adminRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    error: true,
    message: err.message || 'Internal Server Error'
  });
});

async function autoSeedDatabase() {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) return;

    console.log('Database is empty. Running auto-seed...');
    const bcrypt = await import('bcryptjs');
    const adminPassword = await bcrypt.hash('admin123', 10);
    const customerPassword = await bcrypt.hash('customer123', 10);

    // 1. Create Users
    const admin = await prisma.user.create({
      data: {
        email: 'admin@vasavipolypacks.com',
        password: adminPassword,
        name: 'Krishna Chaitanya',
        role: 'ADMIN',
        company: 'Vasavi Polypacks Admin Group',
        phone: '+91 98765 43210'
      }
    });

    const customer = await prisma.user.create({
      data: {
        email: 'buyer@industrialgrain.com',
        password: customerPassword,
        name: 'Ramesh Kumar',
        role: 'CUSTOMER',
        company: 'Sri Balaji Agro Industries',
        phone: '+91 91234 56789'
      }
    });

    // 2. Create Saved Bag Configurations
    const config1 = await prisma.bagConfig.create({
      data: {
        userId: customer.id,
        bagType: 'BOPP_LAMINATED',
        color: '#0D9488',
        textFront: 'Sri Balaji Premium Basmati Rice',
        textBack: '50kg NET WEIGHT - Packed in India',
        width: 55,
        height: 85,
        gusset: 10,
        features: JSON.stringify(['handles', 'liner', 'transparency_window']),
        printingStyle: 'GRAVURE',
        logoUrl: 'https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=200'
      }
    });

    const config2 = await prisma.bagConfig.create({
      data: {
        userId: customer.id,
        bagType: 'PP_WOVEN',
        color: '#1E293B',
        textFront: 'UltraTech Cement Grade A',
        textBack: '50kg - Industrial Strength',
        width: 50,
        height: 75,
        gusset: 0,
        features: JSON.stringify(['perforations']),
        printingStyle: 'FLEXO',
        logoUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=200'
      }
    });

    // 3. Create Quotes
    const quote1 = await prisma.quote.create({
      data: {
        userId: customer.id,
        name: 'Ramesh Kumar',
        email: 'buyer@industrialgrain.com',
        phone: '+91 91234 56789',
        company: 'Sri Balaji Agro Industries',
        quantity: 25000,
        materialType: 'BOPP_LAMINATED',
        dimensions: '55x85x10 cm',
        printingColors: 4,
        bagSpecs: JSON.stringify({ gsm: 85, liner: true, handles: true }),
        estimatedMinPrice: 425000,
        estimatedMaxPrice: 475000,
        status: 'CONVERTED',
        bagConfigId: config1.id
      }
    });

    const quote2 = await prisma.quote.create({
      data: {
        userId: customer.id,
        name: 'Ramesh Kumar',
        email: 'buyer@industrialgrain.com',
        phone: '+91 91234 56789',
        company: 'Sri Balaji Agro Industries',
        quantity: 50000,
        materialType: 'PP_WOVEN',
        dimensions: '50x75x0 cm',
        printingColors: 2,
        bagSpecs: JSON.stringify({ gsm: 75, liner: false, perforations: true }),
        estimatedMinPrice: 500000,
        estimatedMaxPrice: 550000,
        status: 'PENDING',
        bagConfigId: config2.id
      }
    });

    const quote3 = await prisma.quote.create({
      data: {
        name: 'Suresh Patel',
        email: 'spatel@suryafertilizers.com',
        phone: '+91 98888 77777',
        company: 'Surya Fertilizers Ltd',
        quantity: 100000,
        materialType: 'PP_WOVEN',
        dimensions: '60x90x0 cm',
        printingColors: 3,
        bagSpecs: JSON.stringify({ gsm: 90, liner: true }),
        estimatedMinPrice: 1250000,
        estimatedMaxPrice: 1350000,
        status: 'PENDING'
      }
    });

    // 4. Create Active Orders
    await prisma.order.create({
      data: {
        quoteId: quote1.id,
        orderNumber: 'VP-2026-0001',
        totalQuantity: 25000,
        status: 'LAMINATION',
        estDeliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      }
    });

    await prisma.order.create({
      data: {
        quoteId: quote2.id,
        orderNumber: 'VP-2026-0002',
        totalQuantity: 50000,
        status: 'PLATES_DESIGN',
        estDeliveryDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000)
      }
    });

    // 5. Create general Leads
    await prisma.lead.create({
      data: {
        name: 'Anita Desai',
        email: 'adesai@organicpulses.in',
        phone: '+91 99999 88888',
        company: 'Pure Organic Pulses Co.',
        message: 'Interested in B2B contract for multi-color BOPP dal bags. Need samples of 10kg & 26kg bags.',
        type: 'CONTACT',
        status: 'NEW'
      }
    });

    await prisma.lead.create({
      data: {
        name: 'John Miller',
        email: 'john@agriglobal-imports.com',
        phone: '+1 415 555 2671',
        company: 'AgriGlobal Imports LLC (USA)',
        message: 'Export pricing inquiry for food-grade woven sacks container load (approx 200,000 bags) to Savannah Port.',
        type: 'EXPORT',
        status: 'NEW'
      }
    });

    await prisma.lead.create({
      data: {
        name: 'Vikram Singh',
        email: 'vsingh@ambujabags.com',
        phone: '+91 97777 66666',
        company: 'Rajasthan Cement Works',
        message: 'Request callback for block bottom valve bags for cement packaging.',
        type: 'CALLBACK',
        status: 'CONTACTED'
      }
    });

    console.log('Database auto-seeded successfully.');
  } catch (error) {
    console.error('Database auto-seed failed:', error);
  }
}

async function startServer() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database.');
    
    // Auto-seed database if it is empty
    await autoSeedDatabase();

    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`Server is running in development mode on http://localhost:${PORT}`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
}

startServer();

export default app;
