import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler.middleware";
import errorHandler from "../utils/errorHandler.utils";
import User from "../models/User.model";

export const signupUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { fullName, email, password, mobileNumber } = req.body;

        try {
            const user: any = await User.findOne({
                where: { email: email },
                raw: true,
            });

            if (user) {
                return next(new errorHandler("User already registered", 400));
            }
        } catch (error) {}
    },
);
