import express from "express";
import {
    signupUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
} from "../controllers/auth.controllers";
import { isAuthenticated } from "../middleware/auth.middleware";

const router = express.Router();

//user signup route(fullName, email, password, mobileNumber) -- POST
router.route("/signup").post(signupUser);

//user login router(email and password) -- POST
router.route("/login").post(loginUser);

//renew access token using refresh token -- POST
router.route("/refresh").post(refreshAccessToken);

//logout user -- POST
router.route("/logout").post(logoutUser);

export default router;
