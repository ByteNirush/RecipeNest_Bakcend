import { Router } from "express";
import {
  createRecipe,
  createRecipeCategory,
  getPublishedRecipes,
  getRecipeCategories,
  updateRecipe,
} from "../controllers/recipeController";
import { authorizeRoles, protect } from "../middleware/auth";
import {
  handleValidationErrors,
  validateCreateRecipe,
  validateCreateRecipeCategory,
  validateUpdateRecipePatch,
  validateUpdateRecipePut,
} from "../middleware/validate";

const router = Router();

router.get("/", getPublishedRecipes);
router.get("/categories", getRecipeCategories);

router.post(
  "/",
  protect,
  authorizeRoles("chef"),
  validateCreateRecipe,
  handleValidationErrors,
  createRecipe
);

router.post(
  "/categories",
  protect,
  authorizeRoles("chef"),
  validateCreateRecipeCategory,
  handleValidationErrors,
  createRecipeCategory
);

router.patch(
  "/:recipeId",
  protect,
  authorizeRoles("chef"),
  validateUpdateRecipePatch,
  handleValidationErrors,
  updateRecipe
);

router.put(
  "/:recipeId",
  protect,
  authorizeRoles("chef"),
  validateUpdateRecipePut,
  handleValidationErrors,
  updateRecipe
);

export default router;