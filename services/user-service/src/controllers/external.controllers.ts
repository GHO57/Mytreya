import asyncHandler from "../middleware/asyncHandler.middleware";
import errorHandler from "../utils/errorHandler.utils";
import { Vendor, User, VendorAvailability, Role } from "../models";
import { Request, Response, NextFunction } from "express";
import {
    IIsVendorAvailableRequestBody,
    IValidUserRequestParams,
    IValidVendorRequestParams,
} from "../interfaces/external.interfaces";
import { Op } from "sequelize";

//check for valid vendor
export const validVendor = asyncHandler(
    async (
        req: Request<IValidVendorRequestParams>,
        res: Response,
        next: NextFunction,
    ) => {
        const { vendorId } = req.params;

        if (!vendorId) {
            return next(new errorHandler("Vendor id not provided", 400));
        }

        try {
            //check for valid vendor
            const validVendor = await Vendor.findOne({
                where: { id: vendorId },
                attributes: ["id", "userId"],
            });

            if (!validVendor) {
                return next(new errorHandler("Invalid vendor id", 400));
            }

            res.status(200).json({
                success: true,
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

//check for valid user
export const validUser = asyncHandler(
    async (
        req: Request<IValidUserRequestParams>,
        res: Response,
        next: NextFunction,
    ) => {
        const { userId } = req.params;

        if (!userId) {
            return next(new errorHandler("User id not provided", 400));
        }

        try {
            //check for valid user
            const validUser = await User.findOne({
                where: { id: userId },
                attributes: ["id", "fullName"],
            });

            if (!validUser) {
                return next(new errorHandler("Invalid user id", 400));
            }

            res.status(200).json({
                success: true,
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

//check whether vendor is available or not
export const isVendorAvailable = asyncHandler(
    async (
        req: Request<{}, {}, IIsVendorAvailableRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const { vendorId, date, startTimeUTC, endTimeUTC } = req.body;

        if (!vendorId || !date || !startTimeUTC || !endTimeUTC) {
            return next(new errorHandler("Provide all fields", 400));
        }

        try {
            const isVendorAvailable = await VendorAvailability.findOne({
                where: {
                    id: vendorId,
                    availableDate: date,
                    startTimeUtc: { [Op.lte]: startTimeUTC },
                    endTimeUtc: { [Op.gte]: endTimeUTC },
                    status: "ACTIVE",
                },
            });

            if (!isVendorAvailable) {
                return next(new errorHandler("Vendor not available", 400));
            }

            res.status(200).json({
                success: true,
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

//get vendor id by userId
export const getVendorId = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { userId } = req.params;

        if (!userId) {
            return next(new errorHandler("Provide user id", 400));
        }

        try {
            //get vendor id
            const vendor = await Vendor.findOne({
                where: { userId: userId },
                attributes: ["id"],
            });

            if (!vendor) {
                return res.status(400).json({
                    success: false,
                });
            }

            res.status(200).json({
                success: true,
                vendorId: vendor.id,
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

//get all counselling admins
export const getAllCounsellingAdmins = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            //get all counselling admins
            const counsellingAdmins = await User.findAll({
                include: [
                    {
                        model: Role,
                        where: { roleName: "COUNSELLING_ADMIN" },
                        attributes: ["roleName"],
                    },
                ],
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });

            res.status(200).json({
                success: true,
                counsellingAdmins,
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
