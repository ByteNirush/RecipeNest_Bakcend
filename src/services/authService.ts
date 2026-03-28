import jwt, { SignOptions } from "jsonwebtoken";
import User from "../models/User";
import { AppError } from "../utils/AppError";

interface SignUpInput {
  fullName: string;
  email: string;
  password: string;
  role?: "user" | "chef";
}

interface LoginInput {
  email: string;
  password: string;
}

interface ChefProfileInput {
  fullName: string;
  phoneNumber: string;
  location: string;
  yearsOfExperience: number;
  cuisineSpecialties: string[];
  professionalBio: string;
  socialMediaLinks: string[];
}

const mapUserResponse = (user: {
  _id: unknown;
  fullName: string;
  email: string;
  role: "user" | "chef";
}) => ({
  id: user._id,
  fullName: user.fullName,
  email: user.email,
  role: user.role,
});

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("JWT_SECRET is not defined in environment variables", 500);
  }

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "7d",
  };

  return jwt.sign({ id: userId }, secret, options);
};

export const signUpUser = async (input: SignUpInput) => {
  const existingUser = await User.findOne({ email: input.email });

  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  const user = await User.create({
    fullName: input.fullName,
    email: input.email,
    password: input.password,
    role: input.role || "user",
  });

  return {
    token: generateToken(user._id.toString()),
    user: mapUserResponse(user),
  };
};

export const loginUser = async (input: LoginInput) => {
  const user = await User.findOne({ email: input.email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await user.comparePassword(input.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  return {
    token: generateToken(user._id.toString()),
    user: mapUserResponse(user),
  };
};

export const upsertChefUserProfile = async (
  userId: string,
  input: ChefProfileInput
) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role !== "chef") {
    throw new AppError("Only chef accounts can update chef profile details", 403);
  }

  user.fullName = input.fullName;
  user.chefProfile = {
    phoneNumber: input.phoneNumber,
    location: input.location,
    yearsOfExperience: input.yearsOfExperience,
    cuisineSpecialties: input.cuisineSpecialties,
    professionalBio: input.professionalBio,
    socialMediaLinks: input.socialMediaLinks,
  };

  await user.save();

  return {
    ...mapUserResponse(user),
    chefProfile: user.chefProfile,
  };
};

export const getChefUserProfile = async (userId: string) => {
  const user = await User.findById(userId).select("fullName email role chefProfile");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.role !== "chef") {
    throw new AppError("Only chef accounts can access chef profile details", 403);
  }

  return {
    ...mapUserResponse(user),
    chefProfile: user.chefProfile || null,
  };
};

export const getCurrentUserById = async (userId: string) => {
  const user = await User.findById(userId).select("_id fullName email role");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  return mapUserResponse(user);
};
