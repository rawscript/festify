
import mongoose from 'mongoose';
import { Schema, model, Document } from 'mongoose';

// User interface
export interface IUser extends Document {
  email: string;
  name?: string;
  passwordHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User schema
const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  name: { type: String },
  passwordHash: { type: String },
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
