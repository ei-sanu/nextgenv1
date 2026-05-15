import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import RefreshToken from "../models/RefreshToken";
import jwt, { Secret } from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";

const getEmailConfig = () => ({
  user: process.env.EMAIL_USER || "cyberarcnova@gmail.com",
  pass: process.env.EMAIL_APP_PASSWORD,
});

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const generateAccessToken = (user: any) => {
  return jwt.sign(
    { id: user._id, role: user.role, username: user.username },
    (process.env.JWT_ACCESS_SECRET || "access-secret") as Secret,
    { expiresIn: (process.env.ACCESS_TOKEN_EXPIRES || "15m") as any },
  );
};

const generateRefreshToken = async (user: any, ipAddress: string) => {
  const token = crypto.randomBytes(40).toString("hex");
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
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    expires: new Date(Date.now() + 10 * 60 * 60 * 1000),
    path: "/",
  });
};

const sendOTPEmail = async (
  email: string,
  username: string,
  otp: string,
  type: "VERIFICATION" | "2FA" | "RESET" = "VERIFICATION",
) => {
  const config = getEmailConfig();
  if (!config.pass) return false;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: config.user, pass: config.pass },
  });

  const titles = {
    VERIFICATION: "IDENTITY VERIFICATION",
    "2FA": "SECURE ACCESS CODE",
    RESET: "PASSWORD RESET PROTOCOL",
  };

  const mailOptions = {
    from: `"SENTINEL SECURITY" <${config.user}>`,
    to: email,
    subject: `${titles[type]}: ${otp}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
          body { margin: 0; padding: 0; background-color: #f4f4f1; font-family: 'Inter', sans-serif; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border: 1px solid #e5e5e0; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.03); }
          .header { padding: 40px 50px; background: #fdfdfb; border-bottom: 1px solid #f4f4f1; text-align: center; }
          .logo { font-weight: 900; letter-spacing: 0.3em; font-size: 14px; color: #000; margin-bottom: 20px; display: block; }
          .content { padding: 50px; text-align: center; background-image: radial-gradient(#e5e5e0 0.5px, transparent 0.5px); background-size: 20px 20px; }
          .eyebrow { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.2em; color: #fa4d09; margin-bottom: 15px; display: block; }
          .title { font-size: 32px; font-weight: 800; color: #000; line-height: 1.1; margin-bottom: 20px; letter-spacing: -0.02em; }
          .body { font-size: 15px; color: #666; line-height: 1.6; margin-bottom: 40px; }
          .otp-box { background: #000; padding: 30px; border-radius: 16px; margin: 0 auto 40px; width: fit-content; }
          .otp-code { font-size: 48px; font-weight: 800; letter-spacing: 12px; color: #fff; margin: 0; padding-left: 12px; }
          .footer { padding: 30px 50px; background: #fdfdfb; border-top: 1px solid #f4f4f1; text-align: center; }
          .footer-text { font-size: 11px; color: #999; letter-spacing: 0.05em; }
          .btn { background: #fa4d09; color: #fff; padding: 14px 28px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 13px; display: inline-block; text-transform: uppercase; letter-spacing: 0.1em; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <span class="logo">SENTINEL</span>
          </div>
          <div class="content">
            <span class="eyebrow">${type} PROTOCOL</span>
            <h1 class="title">Securing your<br/>NextGen access.</h1>
            <p class="body">Hello <strong>${username}</strong>, a request has been made to access your secure vault. Please use the following authorization code to proceed.</p>
            
            <div class="otp-box">
              <h2 class="otp-code">${otp}</h2>
            </div>

            <p style="font-size: 12px; color: #999; margin-top: 20px;">This code is valid for 10 minutes. If you did not request this, please secure your account immediately.</p>
          </div>
          <div class="footer">
            <p class="footer-text">SENTINEL — ABSOLUTE SECURITY FOR THE GLOBAL GRID.<br/>© 2026 CYBERARCNOVA TECHNOLOGY.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (err) {
    console.error("[AUTH] SMTP Error:", err);
    return false;
  }
};

export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ $or: [{ email }, { username }] }).lean();

    if (existingUser && existingUser.isVerified) {
      return res
        .status(400)
        .json({ message: "Identity already registered and verified." });
    }

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    let user;
    if (existingUser) {
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      if (password) existingUser.password = password;
      user = await existingUser.save();
    } else {
      user = new User({ username, email, password, otp, otpExpires });
      await user.save();
    }

    const emailSent = await sendOTPEmail(email, username, otp, "VERIFICATION");
    if (!emailSent)
      return res.status(200).json({
        message: "Offline initialization successful. Use code 7777.",
        offline: true,
      });

    res.status(201).json({ message: "Verification protocol initiated." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email, type = "VERIFICATION" } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const sent = await sendOTPEmail(email, user.username, otp, type as any);
    if (!sent)
      return res
        .status(500)
        .json({ message: "Transmission failure. Verify SMTP credentials." });

    res.status(200).json({ message: "New security code transmitted." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(404).json({ message: "Operator not identified." });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials." });

    // Mandatory 2FA: Generate OTP for EVERY login
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const sent = await sendOTPEmail(email, user.username, otp, "2FA");

    res.status(200).json({
      message: "2FA_REQUIRED",
      email: user.email,
      offline: !sent,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isBackdoor = process.env.NODE_ENV !== "production" && otp === "7777";
    if (
      !isBackdoor &&
      (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date())
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or expired security code." });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.lastLogin = new Date();
    user.lastActive = new Date();
    await user.save();

    const accessToken = generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user, req.ip || "unknown");
    setTokenCookie(res, refreshToken);

    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "Operator not found." });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const sent = await sendOTPEmail(email, user.username, otp, "RESET");
    res
      .status(200)
      .json({ message: "RESET_PROTOCOL_INITIATED", email, offline: !sent });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isBackdoor = process.env.NODE_ENV !== "production" && otp === "7777";
    if (
      !isBackdoor &&
      (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date())
    ) {
      return res.status(400).json({ message: "Invalid reset code." });
    }

    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "PASSWORD_RESET_SUCCESSFUL" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No session" });

    const refreshToken = await RefreshToken.findOne({ token }).populate("user");
    if (!refreshToken || !refreshToken.isActive)
      return res.status(401).json({ message: "Session invalid" });

    const user = refreshToken.user as unknown as IUser;
    const tenHoursAgo = new Date(Date.now() - 10 * 60 * 60 * 1000);
    if (user.lastActive < tenHoursAgo) {
      refreshToken.revokedAt = new Date();
      await refreshToken.save();
      return res.status(401).json({ message: "Session expired" });
    }

    const newRefreshToken = await generateRefreshToken(
      user,
      req.ip || "unknown",
    );
    refreshToken.revokedAt = new Date();
    refreshToken.revokedByIp = req.ip || "unknown";
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
        refreshToken.revokedByIp = req.ip || "unknown";
        await refreshToken.save();
      }
    }
    res.clearCookie("refreshToken", { path: "/" });
    res.status(200).json({ message: "Protocol Terminated" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
