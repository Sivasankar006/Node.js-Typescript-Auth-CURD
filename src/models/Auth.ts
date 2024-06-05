import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Interface for the User document
interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

// User Schema
const AuthSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true  // Adds createdAt and updatedAt timestamps
});

// Pre-save hook to hash password before saving
AuthSchema.pre<IUser>('save', async function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    return next();
  } catch (error: any) {
    return next(error);
  }
});

// Convert encrypt password
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// Token verify
export const verifyToken = (token: string): { userId: string } | null => {
  try {
    const decoded = jwt.verify(token, '76DKJSNNiuxnn097') as { userId: string };
    return decoded;
  } catch (err) {
    return null;
  }
};

// Method to compare password for login
AuthSchema.methods.comparePassword = function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate authentication token
AuthSchema.methods.generateAuthToken = function (): string {
  const user = this;
  const token = jwt.sign({ userId: user._id }, '76DKJSNNiuxnn097', {
    expiresIn: '7d',
  });
  return token;
};

AuthSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Create and export User model
export const Auth = model<IUser>('Auth', AuthSchema);
