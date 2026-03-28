import Category from "../models/Category";
import Recipe from "../models/Recipe";
import { AppError } from "../utils/AppError";

interface CreateRecipeInput {
  title: string;
  category: string;
  ingredients: string[];
  instructions: string;
  cuisineType?: string;
  preparationTime?: number;
  cookingTime?: number;
  recipeImage?: string;
  recipeVideo?: string;
  publishNow?: boolean;
}

interface UpdateRecipeInput {
  title?: string;
  category?: string;
  ingredients?: string[];
  instructions?: string;
  cuisineType?: string | null;
  preparationTime?: number | null;
  cookingTime?: number | null;
  recipeImage?: string | null;
  recipeVideo?: string | null;
}

interface UpdateRecipeOptions {
  isFullUpdate: boolean;
}

export const createChefRecipe = async (
  userId: string,
  input: CreateRecipeInput
) => {
  const normalizedCategory = input.category.trim().toLowerCase();
  let categoryDoc = await Category.findOne({ normalizedName: normalizedCategory });

  if (!categoryDoc) {
    categoryDoc = await Category.create({
      name: input.category,
      createdBy: userId,
    });
  }

  const recipe = await Recipe.create({
    title: input.title,
    category: categoryDoc._id,
    ingredients: input.ingredients.map((ingredient) => ingredient.trim()),
    instructions: input.instructions,
    cuisineType: input.cuisineType,
    preparationTime: input.preparationTime,
    cookingTime: input.cookingTime,
    recipeImage: input.recipeImage,
    recipeVideo: input.recipeVideo,
    isPublished: input.publishNow !== false,
    createdBy: userId,
  });

  return Recipe.findById(recipe._id)
    .populate("category", "name")
    .populate("createdBy", "fullName role");
};

export const listPublishedRecipes = async () => {
  return Recipe.find({ isPublished: true })
    .sort({ createdAt: -1 })
    .populate("category", "name")
    .populate("createdBy", "fullName role");
};

export const listRecipeCategories = async () => {
  return Category.find().sort({ name: 1 }).select("name");
};

export const createCategoryIfMissing = async (userId: string, name: string) => {
  const normalizedName = name.trim().toLowerCase();
  const existingCategory = await Category.findOne({ normalizedName });

  if (existingCategory) {
    return {
      alreadyExists: true,
      category: existingCategory,
    };
  }

  const category = await Category.create({
    name,
    createdBy: userId,
  });

  return {
    alreadyExists: false,
    category,
  };
};

export const updateChefRecipe = async (
  userId: string,
  recipeId: string,
  input: UpdateRecipeInput,
  options: UpdateRecipeOptions
) => {
  const recipe = await Recipe.findById(recipeId);

  if (!recipe) {
    throw new AppError("Recipe not found", 404);
  }

  if (recipe.createdBy.toString() !== userId) {
    throw new AppError("Unauthorized to update this recipe", 403);
  }

  if (options.isFullUpdate) {
    if (input.title === undefined) {
      throw new AppError("Recipe title is required", 400);
    }

    if (input.category === undefined) {
      throw new AppError("Category is required", 400);
    }

    if (input.instructions === undefined) {
      throw new AppError("Cooking instructions are required", 400);
    }

    if (input.ingredients === undefined) {
      throw new AppError("Ingredients are required", 400);
    }
  }

  let nextCategoryId = recipe.category;
  if (input.category !== undefined) {
    const normalizedCategory = input.category.trim().toLowerCase();
    let categoryDoc = await Category.findOne({ normalizedName: normalizedCategory });

    if (!categoryDoc) {
      categoryDoc = await Category.create({
        name: input.category,
        createdBy: userId,
      });
    }

    nextCategoryId = categoryDoc._id;
  }

  const nextTitle =
    input.title !== undefined ? input.title.trim() : recipe.title;
  const nextInstructions =
    input.instructions !== undefined
      ? input.instructions.trim()
      : recipe.instructions;
  const nextIngredients =
    input.ingredients !== undefined
      ? input.ingredients.map((ingredient) => ingredient.trim())
      : recipe.ingredients;

  if (!nextTitle) {
    throw new AppError("Recipe title is required", 400);
  }

  if (!nextCategoryId) {
    throw new AppError("Category is required", 400);
  }

  if (!nextInstructions) {
    throw new AppError("Cooking instructions are required", 400);
  }

  if (!Array.isArray(nextIngredients) || nextIngredients.length === 0) {
    throw new AppError("Ingredients are required", 400);
  }

  if (nextIngredients.some((ingredient) => !ingredient)) {
    throw new AppError("Ingredient cannot be empty", 400);
  }

  recipe.title = nextTitle;
  recipe.category = nextCategoryId;
  recipe.instructions = nextInstructions;
  recipe.ingredients = nextIngredients;

  if (Object.prototype.hasOwnProperty.call(input, "cuisineType")) {
    recipe.cuisineType = input.cuisineType ? input.cuisineType.trim() : undefined;
  }

  if (Object.prototype.hasOwnProperty.call(input, "preparationTime")) {
    recipe.preparationTime = input.preparationTime ?? undefined;
  }

  if (Object.prototype.hasOwnProperty.call(input, "cookingTime")) {
    recipe.cookingTime = input.cookingTime ?? undefined;
  }

  if (Object.prototype.hasOwnProperty.call(input, "recipeImage")) {
    recipe.recipeImage = input.recipeImage ? input.recipeImage.trim() : undefined;
  }

  if (Object.prototype.hasOwnProperty.call(input, "recipeVideo")) {
    recipe.recipeVideo = input.recipeVideo ? input.recipeVideo.trim() : undefined;
  }

  await recipe.save();

  return Recipe.findById(recipe._id)
    .populate("category", "name")
    .populate("createdBy", "fullName role");
};
