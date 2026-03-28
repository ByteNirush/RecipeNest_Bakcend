import { NextFunction, Request, Response } from "express";
import { body, param, validationResult } from "express-validator";

export const validateSignUp = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2 })
    .withMessage("Full name must be at least 2 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail({ gmail_remove_dots: false }),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value: string, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  body("role")
    .optional()
    .isIn(["user", "chef"])
    .withMessage('Role must be either "user" or "chef"'),
];

export const validateLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail({ gmail_remove_dots: false }),

  body("password").notEmpty().withMessage("Password is required"),
];

export const validateChefProfile = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required")
    .isLength({ min: 2 })
    .withMessage("Full name must be at least 2 characters"),

  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),

  body("location")
    .trim()
    .notEmpty()
    .withMessage("Location is required")
    .isLength({ min: 2, max: 120 })
    .withMessage("Location must be between 2 and 120 characters"),

  body("yearsOfExperience")
    .notEmpty()
    .withMessage("Years of experience is required")
    .isInt({ min: 0, max: 60 })
    .withMessage("Years of experience must be an integer between 0 and 60")
    .toInt(),

  body("cuisineSpecialties")
    .isArray({ min: 1 })
    .withMessage("Cuisine specialties must contain at least one item"),

  body("cuisineSpecialties.*")
    .isString()
    .withMessage("Each cuisine specialty must be a string")
    .trim()
    .notEmpty()
    .withMessage("Cuisine specialty cannot be empty"),

  body("professionalBio")
    .trim()
    .notEmpty()
    .withMessage("Professional bio is required")
    .isLength({ min: 20, max: 1000 })
    .withMessage("Professional bio must be between 20 and 1000 characters"),

  body("socialMediaLinks")
    .isArray()
    .withMessage("Social media links must be an array"),

  body("socialMediaLinks.*")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Each social media link must be a valid URL"),
];

export const validateCreateRecipe = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Recipe title is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("Recipe title must be between 2 and 150 characters"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Category must be between 2 and 60 characters"),

  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("Ingredients must contain at least one item"),

  body("ingredients.*")
    .isString()
    .withMessage("Each ingredient must be a string")
    .trim()
    .notEmpty()
    .withMessage("Ingredient cannot be empty"),

  body("instructions")
    .trim()
    .notEmpty()
    .withMessage("Cooking instructions are required")
    .isLength({ min: 10 })
    .withMessage("Cooking instructions must be at least 10 characters"),

  body("cuisineType")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("Cuisine type must be a string")
    .trim()
    .isLength({ max: 80 })
    .withMessage("Cuisine type must be at most 80 characters"),

  body("preparationTime")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 1440 })
    .withMessage("Preparation time must be an integer between 1 and 1440")
    .toInt(),

  body("cookingTime")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 1440 })
    .withMessage("Cooking time must be an integer between 1 and 1440")
    .toInt(),

  body("recipeImage")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Recipe image must be a valid URL"),

  body("recipeVideo")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Recipe video must be a valid URL"),

  body("publishNow")
    .optional({ values: "falsy" })
    .isBoolean()
    .withMessage("publishNow must be a boolean")
    .toBoolean(),
];

export const validateCreateRecipeCategory = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Category name must be between 2 and 60 characters"),
];

export const validateUpdateRecipePatch = [
  param("recipeId").isMongoId().withMessage("Invalid recipe ID"),

  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Recipe title is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("Recipe title must be between 2 and 150 characters"),

  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Category must be between 2 and 60 characters"),

  body("ingredients")
    .optional()
    .isArray({ min: 1 })
    .withMessage("Ingredients must contain at least one item"),

  body("ingredients.*")
    .optional()
    .isString()
    .withMessage("Each ingredient must be a string")
    .trim()
    .notEmpty()
    .withMessage("Ingredient cannot be empty"),

  body("instructions")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Cooking instructions are required")
    .isLength({ min: 10 })
    .withMessage("Cooking instructions must be at least 10 characters"),

  body("cuisineType")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("Cuisine type must be a string")
    .trim()
    .isLength({ max: 80 })
    .withMessage("Cuisine type must be at most 80 characters"),

  body("preparationTime")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 1440 })
    .withMessage("Preparation time must be an integer between 1 and 1440")
    .toInt(),

  body("cookingTime")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 1440 })
    .withMessage("Cooking time must be an integer between 1 and 1440")
    .toInt(),

  body("recipeImage")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Recipe image must be a valid URL"),

  body("recipeVideo")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Recipe video must be a valid URL"),
];

export const validateUpdateRecipePut = [
  param("recipeId").isMongoId().withMessage("Invalid recipe ID"),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("Recipe title is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("Recipe title must be between 2 and 150 characters"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isLength({ min: 2, max: 60 })
    .withMessage("Category must be between 2 and 60 characters"),

  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("Ingredients must contain at least one item"),

  body("ingredients.*")
    .isString()
    .withMessage("Each ingredient must be a string")
    .trim()
    .notEmpty()
    .withMessage("Ingredient cannot be empty"),

  body("instructions")
    .trim()
    .notEmpty()
    .withMessage("Cooking instructions are required")
    .isLength({ min: 10 })
    .withMessage("Cooking instructions must be at least 10 characters"),

  body("cuisineType")
    .optional({ values: "falsy" })
    .isString()
    .withMessage("Cuisine type must be a string")
    .trim()
    .isLength({ max: 80 })
    .withMessage("Cuisine type must be at most 80 characters"),

  body("preparationTime")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 1440 })
    .withMessage("Preparation time must be an integer between 1 and 1440")
    .toInt(),

  body("cookingTime")
    .optional({ values: "falsy" })
    .isInt({ min: 1, max: 1440 })
    .withMessage("Cooking time must be an integer between 1 and 1440")
    .toInt(),

  body("recipeImage")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Recipe image must be a valid URL"),

  body("recipeVideo")
    .optional({ values: "falsy" })
    .isURL()
    .withMessage("Recipe video must be a valid URL"),
];

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.type === "field" ? err.path : undefined,
        message: err.msg,
      })),
    });
    return;
  }

  next();
};
