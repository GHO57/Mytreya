import { Request, Response, NextFunction } from "express";
import errorHandler from "../utils/errorHandler.utils";
import asyncHandler from "../middleware/asyncHandler.middleware";
import {
    IClientDashboardRequest,
    IClientOnboardRequestBody,
} from "../interfaces/client.interfaces";
import { Role, Client, User, Vendor } from "../models";
import { sequelize } from "../config/sequelize.conf";
import logger from "../utils/logger.utils";

/* Client controllers */

//onboarding client
export const clientOnboarding = asyncHandler(
    async (
        req: IClientOnboardRequestBody,
        res: Response,
        next: NextFunction,
    ) => {
        //get necessary details
        const { mobileNumber, age, gender, pincode, preferredLanguages } =
            req.body;
        //get user id from req.user
        const userId = req.user?.id;
        const roleId = req.user?.roleId;

        if (!mobileNumber || !age || !gender || !pincode) {
            return next(new errorHandler("Provide All Details", 400));
        }

        if (
            !Array.isArray(preferredLanguages) ||
            preferredLanguages.length === 0
        ) {
            return next(
                new errorHandler(
                    "Preferred languages should not be empty",
                    400,
                ),
            );
        }

        if (!userId || !roleId) {
            return next(new errorHandler("Login to access this resource", 400));
        }

        try {
            //get client onboarded and role data
            const [clientData, roleExists] = await Promise.all([
                User.findOne({
                    where: { id: userId },
                    attributes: ["onBoarded"],
                }),
                Role.findOne({
                    where: { id: roleId, roleName: "CLIENT" },
                    attributes: ["roleName"],
                }),
            ]);

            //validate client role
            if (!roleExists) {
                return next(new errorHandler("Only clients can onboard", 403));
            }

            if (!clientData) {
                return next(new errorHandler("Client doesn't exist", 404));
            }

            //if client onboarded return error
            if (clientData.onBoarded) {
                return next(new errorHandler("Client already onboarded", 400));
            }

            //start update transaction
            await sequelize.transaction(async (t) => {
                await Client.update(
                    {
                        mobileNumber: mobileNumber,
                        age: age,
                        gender: gender,
                        pincode: pincode,
                        preferredLanguages: preferredLanguages,
                    },
                    { where: { userId: userId }, transaction: t },
                );
                await User.update(
                    {
                        onBoarded: true,
                    },
                    {
                        where: { id: userId },
                        transaction: t,
                    },
                );
            });

            res.status(200).json({
                success: true,
                message: "Client onboarding completed",
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

//client dashboard
export const clientDashboard = asyncHandler(
    async (req: IClientDashboardRequest, res: Response, next: NextFunction) => {
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
            const user = {
                ...(clientInfo?.toJSON() || {}),
                ...userInfo,
            };

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
