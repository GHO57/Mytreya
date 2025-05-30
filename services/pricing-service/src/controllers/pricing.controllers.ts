import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler.middleware";
import errorHandler from "../utils/errorHandler.utils";
import {
    IAddRecommendedServices,
    IAddServiceRequestBody,
    IConfirmPackageRequest,
    ICreateNewPackageRequest,
    IGetAllRecommendedPackages,
    IGetPendingRecommendationsRequest,
    IGetRecommendedPackagesByUserId,
    IGetRecommendedPackagesForClient,
    IGetRecommendedServicesByPackageId,
} from "../interfaces/pricing.interfaces";
import axiosInstance from "../utils/axiosInstance.utils";
import { Pricing, RecommendedPackage, RecommendedService } from "../models";
import logger from "../utils/logger.utils";
import { Op } from "sequelize";

/*
*
*
common controllers
*
*
*/

//get recommended services by package id -- common
export const getRecommendedServicesByPackageId = asyncHandler(
    async (
        req: Request<IGetRecommendedServicesByPackageId>,
        res: Response,
        next: NextFunction,
    ) => {
        const { packageId } = req.params;

        if (!packageId) {
            return next(new errorHandler("Provide package id", 400));
        }

        try {
            //get all recommended services by package id
            const services = await RecommendedService.findAll({
                where: { packageId: packageId, status: "PENDING" },
                attributes: [
                    "id",
                    "pricingId",
                    "monthNumber",
                    "sessionCount",
                    "notes",
                ],
            });

            services.forEach((service) => {
                service.monthNumber = Number(service.monthNumber);
                service.sessionCount = Number(service.sessionCount);
            });

            res.status(200).json({
                success: true,
                recommendedServices: services,
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
counselling admin related controllers
*
*
*/

//get all pending packages from client with respect to counselling adminUserId
export const getPendingRecommendations = asyncHandler(
    async (
        req: IGetPendingRecommendationsRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const adminUserId = req.user?.id;

        if (!adminUserId) {
            return next(new errorHandler("Login to access this resource", 400));
        }

        try {
            // get all pending recommendations' user details
            const pendingRecommendations = await RecommendedPackage.findAll({
                where: { adminUserId: adminUserId, status: "PENDING" },
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });

            const services = await Pricing.findAll({
                attributes: { exclude: ["createdAt", "updatedAt"] },
                where: { active: true },
            });

            res.status(200).json({
                success: true,
                pendingRecommendations,
                services,
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

//create new package for clients -- counselling admin
export const createClientPackage = asyncHandler(
    async (
        req: ICreateNewPackageRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const { adminUserId, userId, notes } = req.body;

        if (!userId || !adminUserId) {
            return next(new errorHandler("Provide all fields", 400));
        }

        try {
            //check for valid admin user
            const { data: validAdmin } = await axiosInstance.get(
                `${process.env.API_GATEWAY_URL}/api/v1/users/externals/check-exist/user/${adminUserId}`,
            );

            if (!validAdmin.success) {
                return next(new errorHandler("Invalid admin id", 400));
            }

            //check for valid user
            const { data: validUser } = await axiosInstance.get(
                `${process.env.API_GATEWAY_URL}/api/v1/users/externals/check-exist/user/${userId}`,
            );

            if (!validUser.success) {
                return next(new errorHandler("Invalid user id", 400));
            }

            //create a new empty package
            await RecommendedPackage.create({
                userId: userId,
                adminUserId: adminUserId,
                notes: notes,
                totalAmount: 0,
            });

            res.status(201).json({
                success: true,
                message: "Package created successfully",
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

//add recommended services for clients -- counselling admin
export const addRecommendServices = asyncHandler(
    async (req: IAddRecommendedServices, res: Response, next: NextFunction) => {
        //services = [{pricingId, monthNumber, sessionCount, notes},...]
        const { packageId, services } = req.body;

        if (!Array.isArray(services) || services.length <= 0) {
            return next(new errorHandler("Provide valid services", 400));
        }

        try {
            //save the inserted recommendations for response purpose
            const savedRecommendations: any[] = [];

            let totalAmount: number = 0;

            //loop through the services and process it
            for (const service of services) {
                const { pricingId, monthNumber, sessionCount, notes } = service;

                if (
                    !pricingId ||
                    typeof monthNumber !== "number" ||
                    typeof sessionCount !== "number"
                ) {
                    continue;
                }

                //check for valid Pricing
                const validPricing = await Pricing.findOne({
                    where: { id: pricingId },
                });

                if (!validPricing) {
                    continue;
                }

                const servicePrice = validPricing.price;

                //update the total amount
                totalAmount = totalAmount + servicePrice * sessionCount;

                // //find existing service recommendation
                // const existing = await RecommendedService.findOne({
                //     where: {
                //         packageId: packageId,
                //         pricingId: pricingId,
                //         monthNumber: monthNumber,
                //         status: "PENDING",
                //     },
                // });

                // //either update the session count and notes or create a new record
                // if (existing) {
                //     await existing.update({
                //         sessionCount,
                //         notes: notes,
                //     });
                //     savedRecommendations.push(existing);
                // } else {
                //     const saved = await RecommendedService.create({
                //         packageId: packageId,
                //         pricingId: pricingId,
                //         monthNumber: monthNumber,
                //         sessionCount: sessionCount,
                //         notes: notes,
                //     });

                //     savedRecommendations.push(saved);
                // }
                //
                savedRecommendations.push({
                    packageId: packageId,
                    pricingId: pricingId,
                    monthNumber: monthNumber,
                    sessionCount: sessionCount,
                    notes: notes,
                });
            }

            if (services.length !== savedRecommendations.length) {
                return next(
                    new errorHandler("Cannot add services. Try again", 400),
                );
            }

            //delete existing pending entries
            await RecommendedService.destroy({
                where: {
                    packageId: packageId,
                    status: { [Op.in]: ["PENDING", "DRAFTED"] },
                },
            });

            for (const service of savedRecommendations) {
                const { pricingId, monthNumber, sessionCount, notes } = service;

                const saved = await RecommendedService.create({
                    packageId: packageId,
                    pricingId: pricingId,
                    monthNumber: monthNumber,
                    sessionCount: sessionCount,
                    notes: notes,
                });
            }

            //update the package's total amount
            await RecommendedPackage.update(
                { totalAmount: totalAmount },
                { where: { id: packageId } },
            );

            res.status(201).json({
                success: true,
                message: "Recommended services saved successfully",
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

//get recommended packages by user id -- couselling admin
export const getRecommendedPackagesByUserId = asyncHandler(
    async (
        req: IGetRecommendedPackagesByUserId,
        res: Response,
        next: NextFunction,
    ) => {
        const adminUserId = req.user?.id;
        const userId = req.params.userId;

        if (!adminUserId) {
            return next(new errorHandler("Login to access this resource", 400));
        }

        if (!userId) {
            return next(new errorHandler("Provide user id", 400));
        }

        try {
            //check admin user validity
            const { data: validAdmin } = await axiosInstance.get(
                `${process.env.API_GATEWAY_URL}/api/v1/users/externals/check-exist/user/${adminUserId}`,
            );

            if (!validAdmin) {
                return next(new errorHandler("Invalid admin user", 400));
            }

            //get all recommended packages by client userId
            const packages = await RecommendedPackage.findAll({
                where: { userId: userId, adminUserId: adminUserId },
            });

            res.status(200).json({
                success: true,
                recommendedPackages: packages,
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

//get all recommended packages -- couselling admin
export const getAllRecommendedPackages = asyncHandler(
    async (
        req: IGetAllRecommendedPackages,
        res: Response,
        next: NextFunction,
    ) => {
        const adminUserId = req.user?.id;

        if (!adminUserId) {
            return next(new errorHandler("Login to access this resource", 400));
        }

        try {
            //check admin user validity
            const { data: validAdmin } = await axiosInstance.get(
                `${process.env.API_GATEWAY_URL}/api/v1/users/externals/check-exist/user/${adminUserId}`,
            );

            if (!validAdmin) {
                return next(new errorHandler("Invalid admin user", 400));
            }

            //get all recommended packages
            const packages = await RecommendedPackage.findAll({
                where: { adminUserId: adminUserId },
                attributes: { exclude: ["createdAt, updatedAt"] },
            });

            res.status(200).json({
                success: true,
                recommendedPackages: packages,
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

//delete recommended service -- counselling admin
export const deleteRecommendedService = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { recommendedServiceId } = req.params;

        if (!recommendedServiceId) {
            return next(new errorHandler("Provide necessary data", 400));
        }

        try {
            //check for existing recommended services
            const existingRecommendedService = await RecommendedService.findOne(
                { where: { id: recommendedServiceId } },
            );

            if (!existingRecommendedService) {
                return next(
                    new errorHandler("Recommended service doesn't exist", 400),
                );
            }

            await RecommendedService.destroy({
                where: { id: recommendedServiceId },
            });

            res.status(200).json({
                success: true,
                message: "Recommend service deleted successfully",
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

//add service -- POST
export const addService = asyncHandler(
    async (
        req: Request<{}, {}, IAddServiceRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const { serviceName, price, description } = req.body;

        if (!serviceName || !price || !description) {
            return next(new errorHandler("Provide all fields", 400));
        }

        try {
            //check for existing service
            const existingService = await Pricing.findOne({
                where: { serviceName: serviceName },
                attributes: ["id"],
            });

            if (existingService) {
                return next(
                    new errorHandler(`${serviceName} already exists`, 400),
                );
            }

            //add the service to database
            await Pricing.create({
                serviceName: serviceName,
                price: price,
                description: description,
            });

            res.status(201).json({
                success: true,
                message: `${serviceName} added successfully`,
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

//get all services from pricings table
export const getAllServices = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const services = await Pricing.findAll({
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });

            res.status(200).json({
                success: true,
                services,
            });
        } catch (error) {}
    },
);

/*
*
*
client related controllers
*
*
*/

//get all recommended packages by client (user id) -- for client
export const getRecommendedPackagesForClient = asyncHandler(
    async (
        req: IGetRecommendedPackagesForClient,
        res: Response,
        next: NextFunction,
    ) => {
        const userId = req.user?.id;

        if (!userId) {
            return next(new errorHandler("Login to access this resource", 400));
        }

        try {
            //check for valid user
            const { data: validUser } = await axiosInstance.get(
                `${process.env.API_GATEWAY_URL}/api/v1/users/externals/check-exist/user/${userId}`,
            );

            if (!validUser) {
                return next(new errorHandler("Invalid user", 400));
            }

            //get all recommended packages by client userId
            const packages = await RecommendedPackage.findAll({
                where: { userId: userId },
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });

            const services = await Pricing.findAll({
                attributes: { exclude: ["createdAt", "updatedAt"] },
                where: { active: true },
            });

            res.status(200).json({
                success: true,
                recommendedPackages: packages,
                pricings: services,
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

//confirm package (update package and services status after payment)
export const confirmPackage = asyncHandler(
    async (req: IConfirmPackageRequest, res: Response, next: NextFunction) => {
        const userId = req.user?.id;
        const { packageId } = req.params;

        if (!userId) {
            return next(new errorHandler("Login to access this resource", 400));
        }

        if (!packageId) {
            return next(new errorHandler("Provide package id", 400));
        }

        try {
            //update the package's services status to "CONFIRMED"
            await RecommendedService.update(
                { status: "CONFIRMED" },
                {
                    where: {
                        packageId: packageId,
                    },
                },
            );

            //update the package status to "CONFIRMED"
            await RecommendedPackage.update(
                { status: "CONFIRMED" },
                {
                    where: {
                        id: packageId,
                        userId: userId,
                    },
                },
            );

            res.status(200).json({
                success: true,
                message: "Package updated successfully",
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
