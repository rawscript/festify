
import mongoose from 'mongoose';
import { Schema, model, Document } from 'mongoose';

// User preferences interface
export interface IUserPreferences {
  emailNotifications?: {
    accountUpdates: boolean;
    securityAlerts: boolean;
    newsletters: boolean;
    tips: boolean;
  };
  theme?: string;
  language?: string;
}

// User interface
export interface IUser extends Document {
  email: string;
  name?: string;
  passwordHash?: string;
  bio?: string;
  location?: string;
  website?: string;
  preferences?: IUserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

// User schema
const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  passwordHash: { type: String },
  bio: { type: String },
  location: { type: String },
  website: { type: String },
  preferences: {
    emailNotifications: {
      accountUpdates: { type: Boolean, default: true },
      securityAlerts: { type: Boolean, default: true },
      newsletters: { type: Boolean, default: false },
      tips: { type: Boolean, default: false }
    },
    theme: { type: String, default: 'system' },
    language: { type: String, default: 'en' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Session interface
export interface ISession extends Document {
  sid: string;
  sess: any;
  expire: Date;
}

// Session schema
const sessionSchema = new Schema<ISession>({
  sid: { type: String, required: true, unique: true },
  sess: { type: Schema.Types.Mixed, required: true },
  expire: { type: Date, required: true }
});

// Export models
export const User = mongoose.models.User || model<IUser>('User', userSchema);
export const Session = mongoose.models.Session || model<ISession>('Session', sessionSchema);
