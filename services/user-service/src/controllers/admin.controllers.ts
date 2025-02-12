import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler.middleware";
import errorHandler from "../utils/errorHandler.utils";
import Role from "../models/Role.model";
import logger from "../utils/logger.utils";

interface IAddRoleRequestBody {
    roleName: string;
}

interface IDeleteRoleParams {
    roleId: string;
}

// interface IGetAllRolesResponse {
//     success: boolean;
//     count: number;
//     roles: Role[];
// }

//get all roles
export const getAllRoles = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { count, rows: roles } = await Role.findAndCountAll(); //returns { count, rows }

            if (count === 0) {
                return next(new errorHandler("No roles found", 404));
            }

            res.status(200).json({
                success: true,
                count,
                roles,
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

//add new role controller
export const addRole = asyncHandler(
    async (
        req: Request<{}, {}, IAddRoleRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const { roleName } = req.body;

        if (!roleName) {
            return next(new errorHandler("Provide role name", 400));
        }

        try {
            //checking for existing role
            const existingRole = await Role.findOne({
                where: { roleName: roleName },
                raw: true,
            });

            if (existingRole) {
                return next(
                    new errorHandler(`${roleName} role already exists`, 400),
                );
            }

            //create a new role
            await Role.create({
                roleName: roleName,
            });

            res.status(201).json({
                success: true,
                message: `${roleName} role created successfully`,
            });
        } catch (error: unknown) {
            return next(
                new errorHandler(
                    `${process.env.NODE_ENV !== "production" && error instanceof Error ? error.message : "Something Went Wrong"}`,
                    500,
                ),
            );
        }
    },
);

//delete role
export const deleteRole = asyncHandler(
    async (
        req: Request<IDeleteRoleParams>,
        res: Response,
        next: NextFunction,
    ) => {
        const { roleId } = req.params;

        if (!roleId) {
            return next(new errorHandler("Provide Role id", 400));
        }

        try {
            //checking for existing role
            const existingRole = await Role.findOne({
                where: { id: roleId },
                raw: true,
            });

            if (!existingRole) {
                return next(new errorHandler(`Role doesn't exists`, 404));
            }

            //deleting the role from database
            await Role.destroy({ where: { id: roleId } });

            res.status(200).json({
                success: true,
                message: "Role deleted successfully",
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
