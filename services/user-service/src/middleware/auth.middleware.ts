import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import asyncHandler from "./asyncHandler.middleware";
import errorHandler from "../utils/errorHandler.utils";
import { Permission, Role, RolePermission, User } from "../models";
import {
    ICheckPermissionRequest,
    IIsAuthenticatedRequest,
} from "../interfaces/auth.interfaces";
import logger from "../utils/logger.utils";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET as Secret;

//check whether user is authenticated
export const isAuthenticated = asyncHandler(
    async (req: IIsAuthenticatedRequest, res: Response, next: NextFunction) => {
        try {
            //check for access token
            const { auth_access_mytreya } = req.cookies;

            if (!auth_access_mytreya) {
                return next(
                    new errorHandler("Login to access this resource", 401),
                );
            }

            //verify and decode the payload contents from jwt
            const decoded = jwt.verify(
                auth_access_mytreya,
                ACCESS_TOKEN_SECRET,
            ) as JwtPayload;

            const userId: string = decoded.id;
            const roleId: string = decoded.roleId;

            if (!userId || !roleId) {
                return next(
                    new errorHandler("Login to access this resource", 401),
                );
            }

            //build user object
            const user = {
                id: userId,
                roleId: roleId,
            };

            //assigning the user object to req.user
            req.user = user;

            next();
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

//check permissions
export const checkPermission = (permission: string) => {
    return asyncHandler(
        async (
            req: ICheckPermissionRequest,
            res: Response,
            next: NextFunction,
        ) => {
            try {
                // get the user's role id
                const roleId = req.user?.roleId as string;

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

                //check whether the permission is included in the queried permissions
                if (!permissionNames.includes(permission)) {
                    return next(
                        new errorHandler("Cannot access this resource", 403),
                    );
                }

                //permission granted
                next();
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
};
