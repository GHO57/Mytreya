import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import asyncHandler from "../middleware/asyncHandler.middleware";
import errorHandler from "../utils/errorHandler.utils";
import {
    Role,
    Permission,
    RolePermission,
    VendorApplication,
    Vendor,
    User,
    Client,
} from "../models";
import {
    IGetAllRolesResponse,
    IAddRoleRequestBody,
    IDeleteRoleParams,
    IGetAllPermissionsResponse,
    IAddPermissionRequestBody,
    IDeletePermissionParams,
    IAssignPermissionRequestBody,
    IGetAllAssignedPermissionsResponse,
    IGetAllAssignedPermissionsByRoleRequestBody,
    IGetAllAssignedPermissionsByRoleResponse,
    IRevokePermissionRequestBody,
    IApproveVendorApplicationRequestBody,
    IRejectVendorApplicationRequestBody,
    IGetAllVendorApplicationsRequestQuery,
} from "../interfaces/admin.interfaces";
import { sequelize } from "../config/sequelize.conf";
import logger from "../utils/logger.utils";

const generateRandomPassword = (length: number = 12) => {
    const charset =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(charset.length);
        password += charset[randomIndex];
    }
    return password;
};

/* controllers */

/*
*
*
roles related controllers
*
*
*/

//get all roles
export const getAllRoles = asyncHandler(
    async (
        req: Request,
        res: Response<IGetAllRolesResponse>,
        next: NextFunction,
    ) => {
        try {
            const { count, rows: roles } = await Role.findAndCountAll({
                attributes: ["id", "roleName", "isDeleted", "updatedBy"],
                where: { isDeleted: false },
            }); //returns { count, rows }

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

//add new role
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
            const existingRole = await Role.findByPk(roleId, { raw: true });

            if (!existingRole) {
                return next(new errorHandler(`Role doesn't exists`, 404));
            }

            //check whether the role is already deleted
            if (existingRole.isDeleted) {
                return next(new errorHandler("Role already deleted", 400));
            }

            //start transaction for 2 updates in 2 different tables
            await sequelize.transaction(async (t) => {
                //logically delete the role using isDeleted field
                await Role.update(
                    { isDeleted: true },
                    { where: { id: roleId }, transaction: t },
                );

                //mark all records with permissions as deleted as well in role_permissions table
                await RolePermission.update(
                    { isDeleted: true },
                    { where: { roleId: roleId }, transaction: t },
                );
            });

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

/*
*
*
permissions related controllers
*
*
*/

//get all permissions
export const getAllPermissions = asyncHandler(
    async (
        req: Request,
        res: Response<IGetAllPermissionsResponse>,
        next: NextFunction,
    ) => {
        try {
            const { count, rows: permissions } =
                await Permission.findAndCountAll({
                    attributes: [
                        "id",
                        "permissionName",
                        "description",
                        "isDeleted",
                    ],
                    where: { isDeleted: false },
                }); //returns { count, rows }

            if (count === 0) {
                return next(new errorHandler("No permissions found", 404));
            }

            res.status(200).json({
                success: true,
                count,
                permissions,
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

//add new permission
export const addPermission = asyncHandler(
    async (
        req: Request<{}, {}, IAddPermissionRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const { permissionName, description } = req.body;

        if (!permissionName || !description) {
            return next(new errorHandler("Provide All Details", 400));
        }

        try {
            //checking for existing permission
            const existingPermission = await Permission.findOne({
                where: { permissionName: permissionName },
                raw: true,
            });

            if (existingPermission) {
                return next(
                    new errorHandler(
                        `${permissionName} permission already exists`,
                        400,
                    ),
                );
            }

            //create a new permission
            await Permission.create({
                permissionName: permissionName,
                description: description,
            });

            res.status(201).json({
                success: true,
                message: `${permissionName} permission created successfully`,
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

//delete permission
export const deletePermission = asyncHandler(
    async (
        req: Request<IDeletePermissionParams>,
        res: Response,
        next: NextFunction,
    ) => {
        const { permissionId } = req.params;

        if (!permissionId) {
            return next(new errorHandler("Provide Permission id", 400));
        }

        try {
            //checking for existing permission
            const existingPermission = await Permission.findByPk(permissionId, {
                raw: true,
            });

            if (!existingPermission) {
                return next(new errorHandler(`Permission doesn't exist`, 404));
            }

            //check whether permissions is deleted already
            if (existingPermission.isDeleted) {
                return next(
                    new errorHandler("Permission already deleted", 400),
                );
            }

            //transaction to update in 2 different tables
            await sequelize.transaction(async (t) => {
                //logically delete the record using isDeleted flag
                await Permission.update(
                    { isDeleted: true },
                    { where: { id: permissionId }, transaction: t },
                );

                //Mark all related role-permission mappings as deleted
                await RolePermission.update(
                    { isDeleted: true },
                    { where: { permissionId: permissionId }, transaction: t },
                );
            });

            res.status(200).json({
                success: true,
                message: "Permission deleted successfully",
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

/*
*
*
role-permissions related controllers
*
*
*/

//assign permission to role
export const assignPermission = asyncHandler(
    async (
        req: Request<{}, {}, IAssignPermissionRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const { roleId, permissionId } = req.body;

        //validate input data
        if (!roleId || !permissionId) {
            return next(new errorHandler("Provide All Details", 400));
        }

        try {
            //retrieve existing role and permission
            const [existingRole, existingPermission] = await Promise.all([
                Role.findByPk(roleId, { raw: true }),
                Permission.findByPk(permissionId, { raw: true }),
            ]);

            //ensure validity of the ids
            if (!existingRole || !existingPermission) {
                return next(new errorHandler("Invalid ids", 400));
            }

            //check for existing combination of roleid and permissionid
            const assignedPermission = await RolePermission.findOne({
                where: { roleId: roleId, permissionId: permissionId },
                raw: true,
            });

            if (assignedPermission) {
                return next(
                    new errorHandler(
                        "Permission already assigned to this role",
                        400,
                    ),
                );
            }

            //create new record of roleid and permissionid
            await RolePermission.create({
                roleId: roleId,
                permissionId: permissionId,
            });

            res.status(201).json({
                success: true,
                message: "Permission assigned successfully",
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

//get all assigned permissions
export const getAllAssignedPermissions = asyncHandler(
    async (
        req: Request,
        res: Response<IGetAllAssignedPermissionsResponse>,
        next: NextFunction,
    ) => {
        try {
            //get all assigned permissions with role name(Role model) and permission name(Permission model)
            const allAssignedPermissions = await RolePermission.findAndCountAll(
                {
                    include: [
                        {
                            model: Role,
                            attributes: ["roleName"],
                        },
                        {
                            model: Permission,
                            attributes: ["permissionName"],
                        },
                    ],
                    attributes: ["id", "roleId", "permissionId", "isDeleted"],
                    where: { isDeleted: false },
                    raw: true,
                },
            );

            //replace "Role.roleName" and "Permission.permissionName" with single key name
            allAssignedPermissions.rows.forEach((row: any) => {
                row.roleName = row["Role.roleName"];
                row.permissionName = row["Permission.permissionName"];

                delete row["Role.roleName"];
                delete row["Permission.permissionName"];
            });

            if (allAssignedPermissions.count === 0) {
                return next(
                    new errorHandler(
                        "No Permissions are assigned to any roles",
                        404,
                    ),
                );
            }

            res.status(200).json({
                success: true,
                count: allAssignedPermissions.count,
                allAssignedPermissions: allAssignedPermissions.rows,
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

//get all permissions of a role
export const getAllPermissionsByRoleId = asyncHandler(
    async (
        req: Request<IGetAllAssignedPermissionsByRoleRequestBody>,
        res: Response<IGetAllAssignedPermissionsByRoleResponse>,
        next: NextFunction,
    ) => {
        const { roleId } = req.params;

        if (!roleId) {
            return next(new errorHandler("Provide role id", 400));
        }

        try {
            //get all assigned permissions by role id with role name and permission name
            const allPermissionsByRole = await RolePermission.findAndCountAll({
                include: [
                    {
                        model: Role,
                        attributes: ["roleName"],
                    },
                    {
                        model: Permission,
                        attributes: ["permissionName"],
                    },
                ],
                attributes: ["id", "roleId", "permissionId", "isDeleted"],
                where: { roleId: roleId, isDeleted: false },
                raw: true,
            });

            //replace "Role.roleName" and "Permission.permissionName" with single key name in place
            allPermissionsByRole.rows.forEach((row: any) => {
                row.roleName = row["Role.roleName"];
                row.permissionName = row["Permission.permissionName"];

                delete row["Role.roleName"];
                delete row["Permission.permissionName"];
            });

            if (allPermissionsByRole.count === 0) {
                return next(
                    new errorHandler(
                        "No Permissions are assigned to this role",
                        404,
                    ),
                );
            }

            res.status(200).json({
                success: true,
                count: allPermissionsByRole.count,
                allPermissionsByRole: allPermissionsByRole.rows,
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

//revoke permission from role
export const revokePermissionFromRole = asyncHandler(
    async (
        req: Request<{}, {}, IRevokePermissionRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const { roleId, permissionId } = req.body;

        if (!roleId || !permissionId) {
            return next(new errorHandler("Provide All Details", 400));
        }

        try {
            //check for existing combination of roleid and permissionid
            const assignedPermission = await RolePermission.findOne({
                where: { roleId: roleId, permissionId: permissionId },
                raw: true,
            });

            if (!assignedPermission) {
                return next(
                    new errorHandler("Role-permission not available", 400),
                );
            }

            //delete existing record of roleid and permissionid
            await RolePermission.destroy({
                where: {
                    roleId: roleId,
                    permissionId: permissionId,
                },
            });

            res.status(200).json({
                success: true,
                message: "role-permission removed successfully",
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

/*
*
*
vendor application related controllers
*
*
*/

//approve vendor application
export const approveVendorApplication = asyncHandler(
    async (
        req: Request<{}, {}, IApproveVendorApplicationRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const { vendor_application_id } = req.body;

        if (!vendor_application_id) {
            return next(new errorHandler("Provide vendor application id", 400));
        }

        try {
            //check for application existence
            const existingApplication = await VendorApplication.findOne({
                where: { id: vendor_application_id },
            });

            if (!existingApplication) {
                return next(
                    new errorHandler("Vendor application not found", 404),
                );
            }

            //check whether application already validated
            if (existingApplication.status !== "PENDING") {
                return next(
                    new errorHandler("Application already reviewed", 400),
                );
            }

            //get role id of vendor
            const role = await Role.findOne({
                where: { roleName: "VENDOR" },
                attributes: ["id"],
            });

            if (!role?.id) {
                return next(new errorHandler("Role not found", 400));
            }

            //defining roleId as string
            const roleId: string = role.id;
            //generate password
            const password = generateRandomPassword(20);

            //create an user

            await sequelize.transaction(async (t) => {
                const newUser = await User.create(
                    {
                        fullName: existingApplication.fullName,
                        email: existingApplication.email,
                        password: password,
                        roleId: roleId,
                    },
                    { transaction: t },
                );

                if (!newUser || !newUser.id) {
                    throw new Error("Vendor not created");
                }
                //transfer all info to vendors table from vendor_applications table
                await Vendor.create(
                    {
                        userId: newUser.id,
                        // fullName: existingApplication.fullName,
                        mobileNumber: existingApplication.mobileNumber,
                        businessName: existingApplication.businessName,
                        pincode: existingApplication.pincode,
                        state: existingApplication.state,
                        city: existingApplication.city,
                        completeAddress: existingApplication.completeAddress,
                        category: existingApplication.category,
                        qualifications: existingApplication.qualifications,
                        certificationName:
                            existingApplication.certificationName,
                        issuingAuthority: existingApplication.issuingAuthority,
                        certificationNumber:
                            existingApplication.certificationNumber,
                        expirationDate: existingApplication.expirationDate,
                        experience: existingApplication.experience,
                        registrationNumber:
                            existingApplication.registrationNumber,
                        proofOfCertificationUrl:
                            existingApplication.proofOfCertificationUrl,
                        contactMethod: existingApplication.contactMethod,
                        availability: existingApplication.availability,
                        status: "APPROVED",
                    },
                    { transaction: t },
                );

                //update the status of vendor application
                await VendorApplication.update(
                    { status: "APPROVED" },
                    { where: { id: vendor_application_id }, transaction: t },
                );
            });

            //email the vendor with credentials
            /*
             *
             *   to be implemented
             *
             */

            res.status(200).json({
                success: true,
                message: "Vendor approved successfully",
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

//reject vendor application
export const rejectVendorApplication = asyncHandler(
    async (
        req: Request<{}, {}, IRejectVendorApplicationRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const { vendor_application_id } = req.body;

        /*
         * might need to get the reason for
         * rejected, so add 'description'
         * or 'reason' field to the model
         */

        if (!vendor_application_id) {
            return next(new errorHandler("Provide vendor application id", 400));
        }

        try {
            //check for application existence
            const existingApplication = await VendorApplication.findOne({
                where: { id: vendor_application_id },
            });

            if (!existingApplication) {
                return next(
                    new errorHandler("Vendor application not found", 404),
                );
            }

            //check whether application already validated
            if (existingApplication.status !== "PENDING") {
                return next(
                    new errorHandler("Application already reviewed", 400),
                );
            }

            //start a transaction
            await sequelize.transaction(async (t) => {
                //update the status of vendor application to rejected
                await VendorApplication.update(
                    { status: "REJECTED" },
                    { where: { id: vendor_application_id }, transaction: t },
                );
            });

            //email the vendor about the reason for getting rejected
            /*
             *
             * to be implemented
             *
             */

            res.status(200).json({
                success: true,
                message: "Vendor rejected successfully",
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

//get all vendor applications
export const getAllVendorApplications = asyncHandler(
    async (
        req: Request<
            {},
            {},
            {},
            Partial<IGetAllVendorApplicationsRequestQuery>
        >,
        res: Response,
        next: NextFunction,
    ) => {
        const { page, limit, status } =
            req.query as IGetAllVendorApplicationsRequestQuery;

        //pagination setup
        const pageNumber = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 10;
        const validStatuses = ["APPROVED", "PENDING", "REJECTED"];
        const applicationStatus = status?.toUpperCase() || "";
        const offset = (pageNumber - 1) * limitNumber;

        //building where clause
        const whereCondition = validStatuses.includes(applicationStatus)
            ? { status: applicationStatus, isDeleted: false }
            : { isDeleted: false };

        const vendorApplications = await VendorApplication.findAll({
            where: whereCondition,
            offset: offset,
            limit: limitNumber,
        });

        res.status(200).json({
            success: true,
            count: vendorApplications.length,
            vendorApplications: vendorApplications,
        });
    },
);

//get all clients
export const getAllClients = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            //retrieve clients
            const clients = await User.findAll({
                include: [
                    {
                        model: Role,
                        where: { roleName: "CLIENT" },
                        attributes: ["roleName"],
                    },
                    {
                        model: Client,
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                    },
                ],
                attributes: ["email", "fullName"],
                where: { isDeleted: false },
            });

            res.status(200).json({
                success: true,
                clients,
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
