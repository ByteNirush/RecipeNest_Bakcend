import "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: "user" | "chef";
    }
  }
}

export {};
