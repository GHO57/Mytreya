import { Request, Response, NextFunction, CookieOptions } from "express";
import bcrypt from "bcrypt";
import asyncHandler from "../middleware/asyncHandler.middleware";
import errorHandler from "../utils/errorHandler.utils";
import {
    Role,
    User,
    Client,
    RolePermission,
    Permission,
    Vendor,
} from "../models";
import {
    IGetPermissionsByRoleIdRequestParams,
    ILoginUserRequestBody,
    IRefreshAccessTokenRequestBody,
    ISignupUserRequestBody,
    IUserDashboardRequest,
} from "../interfaces/auth.interfaces";
import {
    setAuthCookies,
    setNewAuthCookie,
    signAccessToken,
    signNewAccessToken,
    signRefreshToken,
} from "../utils/jwt.utils";
import logger from "../utils/logger.utils";

/* auth controllers */

//user signup(register)
export const signupUser = asyncHandler(
    async (
        req: Request<{}, {}, ISignupUserRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const { fullName, email, password } = req.body;

        if (!email || !password) {
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
                where: { roleName: "CLIENT" },
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
                // mobileNumber: mobileNumber,
                roleId: roleId,
            });

            //create a record in clients table
            await Client.create({
                userId: newUser.id,
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
                    // "mobileNumber",
                    "password",
                    "onBoarded",
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
            const accessToken = signAccessToken({
                id: user.id,
                roleId: user.roleId,
            });
            const refreshToken = signRefreshToken({
                id: user.id,
                roleId: user.roleId,
            });

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

//get permissions by role id for other services
export const getPermissionsByRole = asyncHandler(
    async (
        req: Request<IGetPermissionsByRoleIdRequestParams>,
        res: Response,
        next: NextFunction,
    ) => {
        const { roleId } = req.params;

        //find all permissions for this role id
        const permissions = await RolePermission.findAll({
            include: [
                {
                    model: Permission,
                    attributes: ["permissionName"],
                },
            ],
            attributes: [],
            where: { roleId: roleId, isDeleted: false },
            raw: true,
        });

        //map all the permissions to an array
        const permissionNames = permissions.map(
            (perm: any) => perm["Permission.permissionName"],
        );

        return res.status(200).json({
            success: true,
            permissionNames,
        });
    },
);

//user dashboard or user information

export const dashboard = asyncHandler(
    async (req: IUserDashboardRequest, res: Response, next: NextFunction) => {
        const id = req.user?.id;

        if (!id) {
            return next(new errorHandler("Something went wrong", 500));
        }

        try {
            //find existing user
            const userInfo = await User.findOne({
                include: [{ model: Role, attributes: ["roleName"] }],
                attributes: [
                    "fullName",
                    "email",
                    "roleId",
                    "onBoarded",
                    "isDeleted",
                ],
                where: { id: id },
                raw: true,
            });

            //assign roleName to user object
            (userInfo as any).roleName = (userInfo as any)["Role.roleName"];

            //delete the "Role.roleName" key in user
            delete (userInfo as any)["Role.roleName"];

            const roleName = (userInfo as any).roleName;

            //user object
            let user = {};

            //conditionally query user information
            if (String(roleName).toUpperCase() === "CLIENT") {
                //find existing client
                const clientInfo = await Client.findOne({
                    where: { userId: id },
                    attributes: [
                        "id",
                        "userId",
                        "age",
                        "gender",
                        "pincode",
                        "preferredLanguages",
                        "mobileNumber",
                    ],
                });

                //construct user object
                user = {
                    ...(clientInfo?.toJSON() || {}),
                    ...userInfo,
                };
            } else if (String(roleName).toUpperCase() === "VENDOR") {
                //find existing vendor
                const vendorInfo = await Vendor.findOne({
                    where: { userId: id },
                });

                //construct user object
                user = {
                    ...(vendorInfo?.toJSON() || {}),
                    ...userInfo,
                };
            } else {
                user = {
                    ...userInfo,
                };
            }

            res.status(200).json({
                success: true,
                user,
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
