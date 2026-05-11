import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import RefreshToken from '../models/RefreshToken';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';
const ACCESS_EXPIRY = process.env.ACCESS_TOKEN_EXPIRES || '15m';
const REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXPIRES || '10h';

const EMAIL_USER = process.env.EMAIL_USER || 'cyberarcnova@gmail.com';
const EMAIL_PASS = process.env.EMAIL_APP_PASSWORD;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const generateAccessToken = (user: any) => {
  return jwt.sign(
    { id: user._id, role: user.role, username: user.username },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRY }
  );
};

const generateRefreshToken = async (user: any, ipAddress: string) => {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 60 * 1000); // 10 hours

  const refreshToken = new RefreshToken({
    user: user._id,
    token,
    expiresAt,
    createdByIp: ipAddress,
  });

  await refreshToken.save();
  return token;
};

const setTokenCookie = (res: Response, token: string) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    expires: new Date(Date.now() + 10 * 60 * 60 * 1000), // 10 hours
    path: '/',
  };
  res.cookie('refreshToken', token, cookieOptions);
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User or Email already exists' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({
      username,
      email,
      password,
      otp,
      otpExpires,
    });

    await user.save();

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
          <p style="font-size: 12px; color: #555;">This code expires in 10 minutes.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ message: 'OTP sent to email.' });
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

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, req.ip || 'unknown');
    setTokenCookie(res, refreshToken);

    res.status(200).json({ 
      accessToken, 
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
    if (!user.isVerified) return res.status(403).json({ message: 'Account not verified.' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    user.lastLogin = new Date();
    user.lastActive = new Date();
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, req.ip || 'unknown');
    setTokenCookie(res, refreshToken);

    res.status(200).json({ 
      accessToken, 
      user: { id: user._id, username: user.username, email: user.email, role: user.role } 
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    const refreshToken = await RefreshToken.findOne({ token }).populate('user');
    if (!refreshToken || !refreshToken.isActive) {
        return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Inactivity check (10 hours)
    const user = refreshToken.user as unknown as IUser;
    const tenHoursAgo = new Date(Date.now() - 10 * 60 * 60 * 1000);
    if (user.lastActive < tenHoursAgo) {
        refreshToken.revokedAt = new Date();
        await refreshToken.save();
        return res.status(401).json({ message: 'Session expired due to inactivity' });
    }

    // Refresh Token Rotation
    const newRefreshToken = await generateRefreshToken(user, req.ip || 'unknown');
    refreshToken.revokedAt = new Date();
    refreshToken.revokedByIp = req.ip || 'unknown';
    refreshToken.replacedByToken = newRefreshToken;
    await refreshToken.save();

    setTokenCookie(res, newRefreshToken);
    const accessToken = generateAccessToken(user);

    user.lastActive = new Date();
    await user.save();

    res.status(200).json({ accessToken });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
        const refreshToken = await RefreshToken.findOne({ token });
        if (refreshToken) {
            refreshToken.revokedAt = new Date();
            refreshToken.revokedByIp = req.ip || 'unknown';
            await refreshToken.save();
        }
    }
    res.clearCookie('refreshToken', { path: '/' });
    res.status(200).json({ message: 'Logged out' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
