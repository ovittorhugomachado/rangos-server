import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto';

export function authenticateToken(req: Request & { user?: any }, res: Response, next: NextFunction): void {

  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  console.log('Cookies:', req.cookies);
  console.log('Token do cookie:', req.cookies?.token);
  if (!token) {
    res.status(401).json({ message: 'Token não fornecido' });
    return;
  }

  try {
    console.log('Cookies:', req.cookies);
    console.log('Token do cookie:', req.cookies?.token);

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}