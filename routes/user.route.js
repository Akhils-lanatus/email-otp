import express from "express";
import {
  SendOtpToUserForLogin,
  UserRegister,
  verifyUserOTP,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", SendOtpToUserForLogin);
router.post("/verify-otp", verifyUserOTP);

export default router;
