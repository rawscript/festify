
import express from 'express';
import { env } from './config';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Create Express app
const app = express();

// Setup database connection
const sql = neon(env.DATABASE_URL);
const db = drizzle(sql);

// Session setup
const PgSession = connectPgSimple(session);
app.use(
  session({
    store: new PgSession({
      conString: env.DATABASE_URL,
      tableName: 'sessions',
      createTableIfMissing: true,
    }),
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: env.NODE_ENV === 'production',
      httpOnly: true,
    },
  })
);

// Parse JSON bodies
app.use(express.json());

// API routes
app.use('/api', (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: env.NODE_ENV });
});

// In production, serve the static files from the dist directory
if (env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  // Handle client-side routing
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

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

export { app, db };
