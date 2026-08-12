import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { PrismaClient } from "@prisma/client";
import { AuthService } from "../services/auth.service";

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Retrieve token from cookies, Authorization header, request body, or query parameters
    let token = req.cookies?.accessToken;
    if (!token) {
      const authHeader = req.header('Authorization') || req.headers['authorization'];
      if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7).trim();
      }
    }
    // Fallbacks: body or query
    if (!token) {
      token = (req.body?.accessToken as string) || (req.query?.accessToken as string);
    }

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    // Normalize token: remove common wrappers that can appear in cookies/headers
    if (typeof token === "string") {
      token = token.trim();
      // Some clients or middleware may send signed cookie values prefixed with `s:`
      if (token.startsWith("s:")) token = token.slice(2);
      // Strip surrounding quotes if present
      if ((token.startsWith('"') && token.endsWith('"')) || (token.startsWith("'") && token.endsWith("'"))) {
        token = token.slice(1, -1);
      }
    }

    const decodedToken: any = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || "access_secret"
    );

    const user = await prisma.user.findUnique({
      where: { id: decodedToken.id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    // If token expired, attempt refresh using refresh token
    if (error instanceof jwt.TokenExpiredError) {
      try {
        const oldRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
        if (!oldRefreshToken) {
          throw new ApiError(401, "Refresh token is required");
        }
        const { accessToken, refreshToken } = await AuthService.refreshToken(oldRefreshToken);

        // Set new access token cookie
        const accessCookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict" as const,
          maxAge: 15 * 60 * 1000, // 15 minutes
        };
        res.cookie("accessToken", accessToken, accessCookieOptions);
        // Rotate refresh token cookie (7 days)
        const refreshCookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict" as const,
          maxAge: 7 * 24 * 60 * 60 * 1000,
        };
        res.cookie("refreshToken", refreshToken, refreshCookieOptions);

        // Decode the new access token to fetch user info
        const decoded: any = jwt.verify(
          accessToken,
          process.env.ACCESS_TOKEN_SECRET || "access_secret"
        );
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        });
        if (!user) {
          throw new ApiError(401, "Invalid Access Token");
        }
        req.user = user;
        return next();
      } catch (refreshError) {
        return next(
          new ApiError(
            401,
            (refreshError as Error)?.message || "Unauthorized request"
          )
        );
      }
    }
    // Token expired handled above. Handle other JWT errors explicitly.
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, (error as Error)?.message || "Invalid access token"));
    }

    // Fallback for other errors
    return next(
      new ApiError(401, (error as Error)?.message || "Invalid access token")
    );
  }
};




