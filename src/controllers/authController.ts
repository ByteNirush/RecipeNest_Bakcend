import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  getChefUserProfile,
  getCurrentUserById,
  loginUser,
  signUpUser,
  upsertChefUserProfile,
} from "../services/authService";
import { AppError } from "../utils/AppError";

export const signUp = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, password, role } = req.body;
  const result = await signUpUser({ fullName, email, password, role });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await loginUser({ email, password });

  res.status(200).json({
    success: true,
    message: "Logged in successfully",
    data: result,
  });
});

export const upsertChefProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.userId) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await upsertChefUserProfile(req.userId, req.body);

    res.status(200).json({
      success: true,
      message: "Chef profile updated successfully",
      data: {
        user: result,
      },
    });
  }
);

export const getChefProfile = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.userId) {
      throw new AppError("Unauthorized", 401);
    }

    const result = await getChefUserProfile(req.userId);

    res.status(200).json({
      success: true,
      data: {
        user: result,
      },
    });
  }
);

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.userId) {
      throw new AppError("Unauthorized", 401);
    }

    const user = await getCurrentUserById(req.userId);

    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });
  }
);
