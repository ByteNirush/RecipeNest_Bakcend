import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRecipe extends Document {
  title: string;
  category: Types.ObjectId;
  ingredients: string[];
  instructions: string;
  cuisineType?: string;
  preparationTime?: number;
  cookingTime?: number;
  recipeImage?: string;
  recipeVideo?: string;
  isPublished: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const recipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: [true, "Recipe title is required"],
      trim: true,
      minlength: [2, "Recipe title must be at least 2 characters"],
      maxlength: [150, "Recipe title must be at most 150 characters"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Recipe category is required"],
    },
    ingredients: {
      type: [String],
      required: [true, "Ingredients are required"],
      validate: {
        validator: (value: string[]) =>
          Array.isArray(value) && value.length > 0 && value.every(Boolean),
        message: "At least one ingredient is required",
      },
    },
    instructions: {
      type: String,
      required: [true, "Cooking instructions are required"],
      trim: true,
      minlength: [10, "Cooking instructions must be at least 10 characters"],
    },
    cuisineType: {
      type: String,
      trim: true,
      maxlength: [80, "Cuisine type must be at most 80 characters"],
    },
    preparationTime: {
      type: Number,
      min: [1, "Preparation time must be at least 1 minute"],
    },
    cookingTime: {
      type: Number,
      min: [1, "Cooking time must be at least 1 minute"],
    },
    recipeImage: {
      type: String,
      trim: true,
    },
    recipeVideo: {
      type: String,
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Recipe = mongoose.model<IRecipe>("Recipe", recipeSchema);

export default Recipe;