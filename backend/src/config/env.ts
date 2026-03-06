import dotenv from 'dotenv';

dotenv.config();

const requireValue = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`${key} is required`);
  }
  return value;
};

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 5000),
  MONGODB_URI: requireValue(process.env.MONGODB_URI, 'MONGODB_URI'),
  CLIENT_URL: process.env.CLIENT_URL ?? 'http://localhost:5173'
};
