import { Request, Response } from "express";
import { asyncHandler } from "../middleware/asyncHandler";
import {
  createCategoryIfMissing,
  createChefRecipe,
  listPublishedRecipes,
  listRecipeCategories,
  updateChefRecipe,
} from "../services/recipeService";
import { AppError } from "../utils/AppError";

export const createRecipe = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.userId) {
      throw new AppError("Unauthorized", 401);
    }

    const recipe = await createChefRecipe(req.userId, req.body);

    res.status(201).json({
      success: true,
      message: "Recipe published successfully",
      data: {
        recipe,
      },
    });
  }
);

export const getPublishedRecipes = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const recipes = await listPublishedRecipes();

    res.status(200).json({
      success: true,
      data: {
        recipes,
      },
    });
  }
);

export const getRecipeCategories = asyncHandler(
  async (_req: Request, res: Response): Promise<void> => {
    const categories = await listRecipeCategories();

    res.status(200).json({
      success: true,
      data: {
        categories,
      },
    });
  }
);

export const createRecipeCategory = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.userId) {
      throw new AppError("Unauthorized", 401);
    }

    const { name } = req.body as { name: string };
    const result = await createCategoryIfMissing(req.userId, name);

    if (result.alreadyExists) {
      res.status(200).json({
        success: true,
        message: "Category already exists",
        data: {
          category: result.category,
        },
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: {
        category: result.category,
      },
    });
  }
);

export const updateRecipe = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.userId) {
      throw new AppError("Unauthorized", 401);
    }

    const recipeId = Array.isArray(req.params.recipeId)
      ? req.params.recipeId[0]
      : req.params.recipeId;

    const recipe = await updateChefRecipe(req.userId, recipeId, req.body, {
      isFullUpdate: req.method === "PUT",
    });

    res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      data: {
        recipe,
      },
    });
  }
);