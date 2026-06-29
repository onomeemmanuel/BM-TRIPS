import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import pool from './config/db.js';
import { seedAdmin, seedTours, seedPosts } from './config/seed.js';
import authRoutes from './routes/auth.js';
import toursRoutes from './routes/tours.js';
import bookingsRoutes from './routes/bookings.js';
import contactsRoutes from './routes/contacts.js';
import postsRoutes from './routes/post.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:5174',
].filter(Boolean);

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/tours', toursRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/posts', postsRoutes);

app.get('/api/health', (_, res) =>
  res.json({ status: 'ok', time: new Date() })
);

const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.get(/^(?!\/api\/|\/uploads\/).*/, (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

const start = async () => {
  try {
    const port = process.env.PORT || 5000;

    // Test DB connection
    console.log('🔌 Connecting to database...');
    console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
    await pool.query('SELECT 1');
    console.log('✅ Database connected');

    // Seed data
    await seedAdmin();
    await seedTours();
    await seedPosts();

    app.listen(port, () =>
      console.log(`🚀 Server running on port ${port}`)
    );
  } catch (err) {
    console.error('❌ Startup failed:');
    console.error('Message:', err.message);
    console.error('Stack:', err.stack);
    process.exit(1);
  }
};

start();