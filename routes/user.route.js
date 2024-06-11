import express from "express";
import {
  SendOtpToUserForLogin,
  UserRegister,
} from "../controllers/user.controller.js";
const router = express.Router();

router.post("/register", UserRegister);
router.post("/login", SendOtpToUserForLogin);

export default router;
