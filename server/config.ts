
import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

// Define schema for environment variables to ensure type safety
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url().default("postgresql://postgres:postgres@localhost:5432/postgres"),
  
  // Authentication
  SESSION_SECRET: z.string().default("default-dev-session-secret-not-for-production"),
  
  // Optional services based on your package.json
  SENDGRID_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  UPLOADTHING_SECRET: z.string().optional(),
  UPLOADTHING_APP_ID: z.string().optional(),
  
  MAPBOX_ACCESS_TOKEN: z.string().optional(),
  
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
}).transform(env => {
  // In development mode, provide defaults for required variables
  if (env.NODE_ENV === 'development') {
    if (!env.SESSION_SECRET || env.SESSION_SECRET === 'default-dev-session-secret-not-for-production') {
      console.warn('⚠️ Using default SESSION_SECRET. This is not secure for production!');
    }
  }
  return env;
});

// Function to validate and get environment variables
export function getEnv() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('❌ Invalid environment variables:', error);
    throw new Error('Invalid environment variables');
  }
}

// Export validated environment variables
export const env = getEnv();
