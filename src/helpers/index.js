import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const SECRET = 'JOEY-REST-API';

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt, password) => {
  return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
};

export const generateSessionToken = (_id) => {
  const payload = { _id };
  return jwt.sign(payload, SECRET, { expiresIn: '30m' });
};

export const verifyJwtToken = (token) => {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded;
  } catch (err) {
    // O token não é válido
    return null;
  }
};
