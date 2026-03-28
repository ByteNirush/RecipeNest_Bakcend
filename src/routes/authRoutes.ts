import { Router } from "express";
import {
  getChefProfile,
  getCurrentUser,
  login,
  signUp,
  upsertChefProfile,
} from "../controllers/authController";
import { authorizeRoles, protect } from "../middleware/auth";
import {
  handleValidationErrors,
  validateChefProfile,
  validateLogin,
  validateSignUp,
} from "../middleware/validate";

const router = Router();

router.post("/signup", validateSignUp, handleValidationErrors, signUp);
router.post("/login", validateLogin, handleValidationErrors, login);
router.get("/me", protect, getCurrentUser);
router.get("/chef/profile", protect, authorizeRoles("chef"), getChefProfile);
router.put(
  "/chef/profile",
  protect,
  authorizeRoles("chef"),
  validateChefProfile,
  handleValidationErrors,
  upsertChefProfile
);

export default router;
