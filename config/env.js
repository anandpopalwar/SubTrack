import { config } from "dotenv";

// Load .env ONLY for local/dev
config();

const requiredEnv = [
  "PORT",
  "NODE_ENV",
  "DB_URI",
  "JWT_SECRET",
  "JWT_EXPIRE_IN",
  "ARCJET_KEY",
  "CLIENT_URL",
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`❌ Missing environment variable: ${key}`);
  }
}

export const PORT = process.env.PORT;
export const NODE_ENV = process.env.NODE_ENV;
export const DB_URI = process.env.DB_URI;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRE_IN = process.env.JWT_EXPIRE_IN;
export const ARCJET_KEY = process.env.ARCJET_KEY;
export const ARCJET_ENV = process.env.ARCJET_ENV;
export const CLIENT_URL = process.env.CLIENT_URL;
