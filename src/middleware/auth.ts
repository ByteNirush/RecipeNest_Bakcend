import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { AppError } from "../utils/AppError";

interface TokenPayload {
  id: string;
}

export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AppError("Authorization token is required", 401);
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("JWT_SECRET is not defined in environment variables", 500);
  }

  let decoded: TokenPayload;
  try {
    decoded = jwt.verify(token, secret) as TokenPayload;
  } catch (_error) {
    throw new AppError("Invalid or expired token", 401);
  }

  const user = await User.findById(decoded.id).select("_id role");

  if (!user) {
    throw new AppError("Invalid token", 401);
  }

  req.userId = user._id.toString();
  req.userRole = user.role;
  next();
};

export const authorizeRoles =
  (...roles: ReadonlyArray<"user" | "chef">) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      throw new AppError("You do not have permission to perform this action", 403);
    }

    next();
  };
