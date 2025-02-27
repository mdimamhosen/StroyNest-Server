import jwt, { JwtPayload, Secret, SignOptions } from 'jsonwebtoken';

export const createToken = (
  jwtPayload: {
    id: string;
    role: string;
    email: string;
  },
  jwtSecret: Secret,
  expiresIn: string,
): string => {
  const options: SignOptions = {
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(jwtPayload, jwtSecret, options);
};

export const verifyToken = (token: string, secret: string) => {
  const decoded = jwt.verify(token, secret) as JwtPayload;

  return decoded;
};
