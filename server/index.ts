import express from 'express';
import { env } from './config';
import session from 'express-session';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectToMongoDB } from './db';
import MongoStore from 'connect-mongo';

// Get directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create Express app
const app = express();

// Initialize database connection
connectToMongoDB();

// Setup session
app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: env.MONGODB_URI,
      collectionName: 'sessions',
      ttl: 14 * 24 * 60 * 60, // 14 days
    }),
    cookie: {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 14 days
      secure: env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes and middleware
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import preferencesRoutes from './routes/preferences';
import { attachUser } from './middleware/auth';

// Apply global middleware
app.use(attachUser);

// API routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: env.NODE_ENV });
});

// Auth routes
app.use('/api/auth', authRoutes);

// Profile routes (protected)
app.use('/api/profile', profileRoutes);

app.use('/api/preferences', preferencesRoutes);


// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
import { errorHandler } from './middleware/errorHandler';
app.use(errorHandler);

// Serve static files
if (env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
} else {
  // In development mode, provide a basic response for the root route
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <head>
          <title>Festify - Development Mode</title>
          <style>
            body { font-family: system-ui, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; }
            h1 { color: hsl(258, 90%, 66%); }
            .card { border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; }
            code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 3px; font-size: 0.9rem; }
          </style>
        </head>
        <body>
          <h1>Festify Development Server</h1>
          <p>The server is running in development mode. Here are some available endpoints:</p>

          <div class="card">
            <h3>API Endpoints</h3>
            <p><code>GET /api/health</code> - Check server status</p>
          </div>

          <div class="card">
            <h3>Development Tips</h3>
            <p>To build the frontend, run: <code>npm run build</code></p>
            <p>Your API requests should go to <code>/api/...</code> endpoints</p>
          </div>
        </body>
      </html>
    `);
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});