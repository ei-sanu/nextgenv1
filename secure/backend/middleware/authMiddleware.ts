import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import User from '../models/User';

const ACCESS_SECRET = (process.env.JWT_ACCESS_SECRET || 'access-secret') as Secret;

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded: any = jwt.verify(token, ACCESS_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Update lastActive on each authenticated request
    user.lastActive = new Date();
    await user.save();

    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  if ((req as any).user && (req as any).user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Admin access required' });
  }
};
