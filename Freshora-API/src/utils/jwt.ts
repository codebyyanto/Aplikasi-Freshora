import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || 'secret';
export function signToken(payload: object, expiresIn = '7d') {
  return jwt.sign(payload, secret, { expiresIn });
}
export function verifyToken(token: string) {
  return jwt.verify(token, secret);
}
