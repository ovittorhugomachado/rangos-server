import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secreto';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'refresh_secreto';

export function generateTokens(payload: object) {

  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  
  const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '30d' });

  return { accessToken, refreshToken };
}