import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'cyber-sentinel-vault-key-2026';
const EMAIL_USER = 'cyberarcnova@gmail.com';
// Note: In production, use App Passwords or a secure service.
const EMAIL_PASS = process.env.EMAIL_APP_PASSWORD; 

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User or Email already exists' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    const user = new User({
      username,
      email,
      password,
      otp,
      otpExpires,
    });

    await user.save();

    // Send OTP Email
    const mailOptions = {
      from: `"SENTINEL SECURITY" <${EMAIL_USER}>`,
      to: email,
      subject: 'VERIFICATION PROTOCOL: Your 4-Digit Security Code',
      html: `
        <div style="background-color: #000; color: #fff; padding: 40px; font-family: 'Courier New', Courier, monospace; border: 1px solid #00f0ff;">
          <h2 style="color: #00f0ff; letter-spacing: 2px;">SENTINEL ACCESS PROTOCOL</h2>
          <p style="color: #888;">System identifies user: <strong>${username}</strong></p>
          <p>Please enter the following 4-digit code to verify your identity:</p>
          <div style="font-size: 48px; font-bold; letter-spacing: 10px; margin: 30px 0; color: #00f0ff; text-align: center; border: 1px dashed #333; padding: 20px;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #555;">This code expires in 10 minutes. If you did not request this, secure your account immediately.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'OTP sent to email. Please verify.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      token, 
      user: { id: user._id, username: user.username, email: user.email, role: user.role } 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.isVerified) {
        return res.status(403).json({ message: 'Account not verified. Please verify your email.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ 
      token, 
      user: { id: user._id, username: user.username, email: user.email, role: user.role } 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
