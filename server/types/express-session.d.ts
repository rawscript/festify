
// This file extends express-session type definitions

import 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: {
      id: string;
      email: string;
      name?: string;
    };
  }
}
