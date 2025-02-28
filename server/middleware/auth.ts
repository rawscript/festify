
import { Request, Response, NextFunction } from 'express';

// Extend Express Request type to include user session
declare module 'express-session' {
  interface SessionData {
    user: {
      id: string;
      email: string;
      name?: string;
    };
  }
}

// Middleware to check if user is authenticated
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.session.user) {
    return next();
  }
  return res.status(401).json({ message: 'Authentication required' });
};

// Middleware to attach user to res.locals for use in templates
export const attachUser = (req: Request, res: Response, next: NextFunction) => {
  res.locals.user = req.session.user || null;
  res.locals.isAuthenticated = !!req.session.user;
  next();
};
