import jwt, { Secret, SignOptions } from 'jsonwebtoken';

const secret: Secret = process.env.JWT_SECRET || 'secret'; // pastikan string
const defaultExpiresIn: SignOptions['expiresIn'] = '7d';

export function signToken(payload: object, expiresIn: SignOptions['expiresIn'] = defaultExpiresIn): string {
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    return null;
  }
}
