import { Request, Response, NextFunction } from 'express';
const dotenv = require('dotenv');
import jwt from 'jsonwebtoken';
import { Auth } from '../models/Auth';

interface AuthRequest extends Request {
  user?: any;
  token?: string; 
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token){
    throw new Error('Authorization header not found');
  } 

  try {

    const decoded: any = jwt.verify(token, '76DKJSNNiuxnn097'); 

    const user = await Auth.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error('User not found!');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
