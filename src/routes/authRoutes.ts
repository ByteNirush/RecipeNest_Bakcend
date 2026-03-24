import { Router } from "express";
import { login, signUp } from "../controllers/authController";
import {
  handleValidationErrors,
  validateLogin,
  validateSignUp,
} from "../middleware/validate";

const router = Router();

router.post("/signup", validateSignUp, handleValidationErrors, signUp);
router.post("/login", validateLogin, handleValidationErrors, login);

export default router;
