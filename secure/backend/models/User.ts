import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'user' | 'analyst';
  isVerified: boolean;
  otp?: string;
  otpExpires?: Date;
  lastActive: Date;
  createdAt: Date;
  lastLogin: Date;
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['admin', 'user', 'analyst'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  lastActive: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

// Hash password before saving
UserSchema.pre<IUser>('save', async function () {
  if (!this.isModified('password')) return;
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);

  // Automatically set admin role for the specified email
  if (this.email === 'someshranjanbiswal13678@gmail.com') {
    this.role = 'admin';
  }
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password!);
};

export default mongoose.model<IUser>('User', UserSchema);
