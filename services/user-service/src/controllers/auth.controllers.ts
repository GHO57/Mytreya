import { Request, Response, NextFunction, CookieOptions } from "express";
import asyncHandler from "../middleware/asyncHandler.middleware";
import errorHandler from "../utils/errorHandler.utils";
import { Role, User } from "../models";
import {
    ILoginUserRequestBody,
    IRefreshAccessTokenRequestBody,
    ISignupUserRequestBody,
} from "../interfaces/auth.interfaces";
import bcrypt from "bcrypt";
import logger from "../utils/logger.utils";
import {
    setAuthCookies,
    setNewAuthCookie,
    signAccessToken,
    signNewAccessToken,
    signRefreshToken,
} from "../utils/jwt.utils";

/* auth controllers */

//user signup(register)
export const signupUser = asyncHandler(
    async (
        req: Request<{}, {}, ISignupUserRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const { fullName, email, password, mobileNumber } = req.body;

        if (!fullName || !email || !password || !mobileNumber) {
            return next(new errorHandler("Provide All Details", 400));
        }

        try {
            //find existing user
            const user = await User.findOne({
                where: { email: email },
                raw: true,
            });

            if (user) {
                return next(new errorHandler("User already registered", 400));
            }

            //find customer role(by default)
            const role = await Role.findOne({
                where: { roleName: "CUSTOMER" },
                attributes: ["id"],
                raw: true,
            });

            if (!role?.id) {
                return next(new errorHandler("Role not found", 400));
            }

            //defining roleId as string
            const roleId: string = role.id;

            //create/register new user
            const newUser = await User.create({
                fullName: fullName,
                email: email,
                password: password,
                mobileNumber: mobileNumber,
                roleId: roleId,
            });

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                user: newUser,
            });
        } catch (error) {
            return next(
                new errorHandler(
                    `${process.env.NODE_ENV !== "production" && error instanceof Error ? error.message : "Something Went Wrong"}`,
                    500,
                ),
            );
        }
    },
);

//user login
export const loginUser = asyncHandler(
    async (
        req: Request<{}, {}, ILoginUserRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new errorHandler("Provide all details", 400));
        }

        try {
            //find the existing user
            const user = await User.findOne({
                include: [{ model: Role, attributes: ["roleName"] }],
                attributes: [
                    "id",
                    "roleId",
                    "fullName",
                    "email",
                    "mobileNumber",
                    "password",
                    "isDeleted",
                ],
                where: { email: email },
                raw: true,
            });

            //return error when email is incorrect
            if (!user) {
                return next(new errorHandler("Invalid email or password", 400));
            }

            //assign roleName to user object
            (user as any).roleName = (user as any)["Role.roleName"];

            //delete the "Role.roleName" key in user
            delete (user as any)["Role.roleName"];

            //Check password match
            const isPasswordMatch = await bcrypt.compare(
                password,
                user.password,
            );
            if (!isPasswordMatch) {
                return next(new errorHandler("Invalid email or password", 400));
            }

            //generate access token & refresh token
            const accessToken = signAccessToken({ id: user.id });
            const refreshToken = signRefreshToken({ id: user.id });

            setAuthCookies(res, accessToken, refreshToken);

            //extract password key from user
            const { password: _, ...safeUser } = user;

            res.status(200).json({
                success: true,
                user: safeUser,
                // accessToken,
                // refreshToken,
            });
        } catch (error) {
            return next(
                new errorHandler(
                    `${process.env.NODE_ENV !== "production" && error instanceof Error ? error.message : "Something Went Wrong"}`,
                    500,
                ),
            );
        }
    },
);

//refresh access token using refresh token
export const refreshAccessToken = asyncHandler(
    async (
        req: Request & IRefreshAccessTokenRequestBody,
        res: Response,
        next: NextFunction,
    ) => {
        const { auth_refresh_mytreya } = req.cookies;

        if (!auth_refresh_mytreya) {
            return next(new errorHandler("Refresh token not provided", 400));
        }

        try {
            //generate new access token
            const newAccessToken = signNewAccessToken(auth_refresh_mytreya);

            //check whether token is null
            if (!newAccessToken) {
                return next(new errorHandler("Invalid refresh token", 400));
            }

            setNewAuthCookie(res, newAccessToken);

            res.status(200).json({
                success: true,
                message: "Access token refreshed",
            });
        } catch (error) {
            return next(
                new errorHandler(
                    `${process.env.NODE_ENV !== "production" && error instanceof Error ? error.message : "Something Went Wrong"}`,
                    500,
                ),
            );
        }
    },
);

//logout user
export const logoutUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            //cookie options
            const cookieOptions: CookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV !== "production" ? false : true,
                sameSite: "strict",
            };

            //clear access token
            res.clearCookie("auth_access_mytreya", {
                ...cookieOptions,
                path: "/",
            });

            //clear refresh token
            res.clearCookie("auth_refresh_mytreya", {
                ...cookieOptions,
                path: "/refresh",
            });

            res.status(200).json({
                success: true,
                message: "Logged out successfully",
            });
        } catch (error) {
            return next(
                new errorHandler(
                    `${process.env.NODE_ENV !== "production" && error instanceof Error ? error.message : "Something Went Wrong"}`,
                    500,
                ),
            );
        }
    },
);
