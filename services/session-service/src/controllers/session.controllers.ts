import asyncHandler from "../middleware/asyncHandler.middleware";
import errorHandler from "../utils/errorHandler.utils";
import { Session } from "../models";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.utils";
import {
    ICreateClientSessionRequest,
    ILocalTimeToUTCInterface,
    IUTCToLocalTimeInteface,
} from "../interfaces/session.interfaces";
import axiosInstance from "../utils/axiosInstance.utils";
import { Op } from "sequelize";
import { DateTime } from "luxon";

//convert local time to UTC time
const LocalTimeToUTC = ({
    date,
    time,
    timeZone,
}: ILocalTimeToUTCInterface): DateTime => {
    const dateTime = `${date}T${time}`;

    const utcTime = DateTime.fromISO(dateTime, { zone: timeZone }).toUTC();

    return utcTime;
};

//convert utc time to local time
const UTCToLocalTime = ({
    dateTime,
    timeZone,
}: IUTCToLocalTimeInteface): DateTime => {
    const localTime = DateTime.fromISO(dateTime).setZone(timeZone);

    return localTime;
};

//create client session -- POST

export const createClientSession = asyncHandler(
    async (
        req: ICreateClientSessionRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const userId = req.user?.id;
        const { vendorId, sessionDate, startTime, endTime, timeZone } =
            req.body;

        if (!userId || !vendorId || !sessionDate || !startTime || !endTime) {
            return next(new errorHandler("Provide all field", 400));
        }

        try {
            //check for valid vendor
            const { data: validVendor } = await axiosInstance.get(
                `${process.env.API_GATEWAY_URL}/api/v1/users/externals/check-exist/vendor/${vendorId}`,
            );

            if (!validVendor.success) {
                return next(new errorHandler("Invalid vendor id", 400));
            }

            //check for valid user
            const { data: validUser } = await axiosInstance.get(
                `${process.env.API_GATEWAY_URL}/api/v1/users/externals/check-exist/user/${userId}`,
            );

            if (!validUser.success) {
                return next(new errorHandler("Invalid user id", 400));
            }

            //convert client's localtime to utc
            const startTimeUTC = String(
                LocalTimeToUTC({
                    date: sessionDate,
                    time: startTime,
                    timeZone: timeZone,
                }),
            );

            const endTimeUTC = String(
                LocalTimeToUTC({
                    date: sessionDate,
                    time: endTime,
                    timeZone: timeZone,
                }),
            );

            //check for already booked slot
            const isSlotBooked = await Session.findOne({
                where: {
                    vendorId: vendorId,
                    sessionDate: sessionDate,
                    [Op.or]: [
                        {
                            startTimeUtc: {
                                [Op.between]: [startTimeUTC, endTimeUTC],
                            },
                        },
                        {
                            endTimeUtc: {
                                [Op.between]: [startTimeUTC, endTimeUTC],
                            },
                        },
                        {
                            [Op.and]: [
                                { startTimeUtc: { [Op.lte]: startTimeUTC } },
                                { endTimeUtc: { [Op.gte]: endTimeUTC } },
                            ],
                        },
                    ],
                },
            });

            if (isSlotBooked) {
                return next(new errorHandler("Slot already booked", 400));
            }

            //build form
            const vendorAvailabilityForm = {
                vendorId: vendorId,
                date: sessionDate,
                startTimeUTC: startTimeUTC,
                endTimeUTC: endTimeUTC,
            };

            //json config
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };

            //check whether vendor is availability
            const { data: isVendorAvailable } = await axiosInstance.post(
                `${process.env.API_GATEWAY_URL}/api/v1/users/externals/check-availability/vendor`,
                vendorAvailabilityForm,
                config,
            );

            if (!isVendorAvailable.success) {
                return next(
                    new errorHandler(
                        "Vendor not available on specified date",
                        400,
                    ),
                );
            }

            //create session details
            await Session.create({
                userId: userId,
                vendorId: vendorId,
                sessionDate: sessionDate,
                startTimeUtc: startTimeUTC,
                endTimeUtc: endTimeUTC,
            });

            res.status(201).json({
                success: true,
                message: "Session booked successfully",
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
