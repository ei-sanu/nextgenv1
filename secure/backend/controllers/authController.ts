import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import RefreshToken from '../models/RefreshToken';
import jwt, { Secret } from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const getEmailConfig = () => ({
  user: process.env.EMAIL_USER || 'cyberarcnova@gmail.com',
  pass: process.env.EMAIL_APP_PASSWORD,
});

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const generateAccessToken = (user: any) => {
  return jwt.sign(
    { id: user._id, role: user.role, username: user.username },
    (process.env.JWT_ACCESS_SECRET || 'access-secret') as Secret,
    { expiresIn: (process.env.ACCESS_TOKEN_EXPIRES || '15m') as any }
  );
};

const generateRefreshToken = async (user: any, ipAddress: string) => {
  const token = crypto.randomBytes(40).toString('hex');
  const expiresAt = new Date(Date.now() + 10 * 60 * 60 * 1000);

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
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    expires: new Date(Date.now() + 10 * 60 * 60 * 1000),
    path: '/',
  });
};

const sendOTPEmail = async (email: string, username: string, otp: string) => {
  const config = getEmailConfig();
  if (!config.pass) {
      console.warn('[AUTH] EMAIL_APP_PASSWORD missing. Skipping email send.');
      return false;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: config.user, pass: config.pass },
  });

  const mailOptions = {
    from: `"SENTINEL SECURITY" <${config.user}>`,
    to: email,
    subject: 'VERIFICATION PROTOCOL: Your 4-Digit Security Code',
    html: `
      <div style="background-color: #000; color: #fff; padding: 40px; font-family: sans-serif; border: 1px solid #00f0ff; border-radius: 20px;">
        <h2 style="color: #00f0ff; letter-spacing: 2px;">SENTINEL ACCESS PROTOCOL</h2>
        <p style="color: #888;">User: <strong>${username}</strong></p>
        <p>Your 4-digit security code:</p>
        <div style="font-size: 48px; font-weight: bold; letter-spacing: 10px; margin: 30px 0; color: #00f0ff; text-align: center; background: rgba(0,240,255,0.05); padding: 20px; border-radius: 12px;">
          ${otp}
        </div>
        <p style="font-size: 12px; color: #555;">This code expires in 10 minutes.</p>
      </div>
    `,
  };

  try {
      await transporter.sendMail(mailOptions);
      return true;
  } catch (err) {
      console.error('[AUTH] SMTP Error:', err);
      return false;
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    
    // If user exists and is verified, block
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: 'User or Email already exists and is verified.' });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    let user;
    if (existingUser) {
        // If unverified user exists, update their record
        existingUser.otp = otp;
        existingUser.otpExpires = otpExpires;
        if (password) {
            existingUser.password = password; // Will be hashed by pre-save hook
        }
        user = await existingUser.save();
    } else {
        // Create new user
        user = new User({ username, email, password, otp, otpExpires });
        await user.save();
    }

    const emailSent = await sendOTPEmail(email, username, otp);

    if (!emailSent) {
        return res.status(200).json({ 
            message: 'User initialized, but verification system is OFFLINE. (Note: Use your 16-digit Google App Password in .env).',
            offline: true 
        });
    }

    res.status(201).json({ message: 'OTP transmitted successfully.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'Account already verified' });

        const otp = generateOTP();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        const sent = await sendOTPEmail(email, user.username, otp);
        if (!sent) return res.status(500).json({ 
            message: 'TRANSMISSION_FAILED: Use your 16-digit Google App Password in .env, not your regular password.' 
        });

        res.status(200).json({ message: 'New OTP transmitted.' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // BACKDOOR for local testing if email fails: if otp is '7777', verify anyway
    const isBackdoor = process.env.NODE_ENV !== 'production' && otp === '7777';

    if (!isBackdoor && (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date())) {
      return res.status(400).json({ message: 'Invalid or expired security code.' });
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

    if (!user) return res.status(404).json({ message: 'Operator not found.' });
    if (!user.isVerified) return res.status(403).json({ message: 'Verification Required', email: user.email });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid Credentials' });

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
    if (!token) return res.status(401).json({ message: 'No session found' });

    const refreshToken = await RefreshToken.findOne({ token }).populate('user');
    if (!refreshToken || !refreshToken.isActive) return res.status(401).json({ message: 'Session invalid' });

    const user = refreshToken.user as unknown as IUser;
    const tenHoursAgo = new Date(Date.now() - 10 * 60 * 60 * 1000);
    if (user.lastActive < tenHoursAgo) {
        refreshToken.revokedAt = new Date();
        await refreshToken.save();
        return res.status(401).json({ message: 'Session timed out' });
    }

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
    res.status(200).json({ message: 'Protocol Terminated' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
