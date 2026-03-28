import { NextFunction, Request, Response } from "express";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppError } from "../utils/AppError";

interface DuplicateKeyError {
  code?: number;
}

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (error instanceof TokenExpiredError || error instanceof JsonWebTokenError) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
    return;
  }

  const maybeDuplicateKey = error as DuplicateKeyError;
  if (maybeDuplicateKey?.code === 11000) {
    res.status(409).json({
      success: false,
      message: "An account with this email already exists",
    });
    return;
  }

  console.error("Unhandled error:", error);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
