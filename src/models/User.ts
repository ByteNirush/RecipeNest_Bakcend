import bcrypt from "bcrypt";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password: string;
  role: "user" | "chef";
  chefProfile?: {
    phoneNumber: string;
    location: string;
    yearsOfExperience: number;
    cuisineSpecialties: string[];
    professionalBio: string;
    socialMediaLinks: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "chef"],
      default: "user",
    },
    chefProfile: {
      phoneNumber: {
        type: String,
        trim: true,
      },
      location: {
        type: String,
        trim: true,
      },
      yearsOfExperience: {
        type: Number,
        min: 0,
        max: 60,
      },
      cuisineSpecialties: {
        type: [String],
        default: [],
      },
      professionalBio: {
        type: String,
        trim: true,
      },
      socialMediaLinks: {
        type: [String],
        default: [],
      },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (this: IUser) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;
