import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET || "access_secret", {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRY || "15m") as any,
  });
};

export const generateRefreshToken = (payload: { id: string }): string => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET || "refresh_secret", {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRY || "7d") as any,
  });
};
