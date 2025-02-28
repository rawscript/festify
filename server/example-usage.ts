
import { env } from './config';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { neon } from '@neondatabase/serverless';
import express from 'express';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';

// Example setup for database with environment variables
const sql = neon(env.DATABASE_URL);
const db = drizzle(sql);

// Example setup for sessions with environment variables
const app = express();
const PgSession = connectPgSimple(session);

// Create a session store with proper typing
const sessionStore = new PgSession({
  conString: env.DATABASE_URL,
  tableName: 'sessions',
  createTableIfMissing: true,
});

app.use(
  session({
    store: sessionStore,
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);

// Example route to verify setup
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', environment: env.NODE_ENV });
});

export { app, db };
