import express from "express";
import {
    signupUser,
    loginUser,
    refreshAccessToken,
    logoutUser,
    getPermissionsByRole,
    dashboard,
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

//user dashboard or user details -- GET
router.route("/dashboard").get(isAuthenticated, dashboard);

/*
*
*
Routes used for inter service communications
*
*
*/

//all permissions by role id -- GET
router.route("/permissions/:roleId").get(getPermissionsByRole);

export default router;
