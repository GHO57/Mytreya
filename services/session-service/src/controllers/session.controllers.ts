import asyncHandler from "../middleware/asyncHandler.middleware";
import errorHandler from "../utils/errorHandler.utils";
import { Session } from "../models";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.utils";
import {
    IConfirmSessionsRequest,
    ICreateClientSessionRequest,
    ICreateClientSessionsInBulkRequest,
    IGetAllClientSessions,
    IGetAllVendorSessions,
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

//create client sessions in bulk -- POST

export const createClientSessionsInBulk = asyncHandler(
    async (
        req: ICreateClientSessionsInBulkRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const userId = req.user?.id;
        //sessions = [{vendorId, sessionDate, startTime, endTime}, ...]
        const { sessions, timeZone } = req.body;

        if (!userId || !timeZone) {
            return next(new errorHandler("Provide all field", 400));
        }

        if (!Array.isArray(sessions) || sessions.length === 0) {
            return next(
                new errorHandler("Provide atleast 1 session slot", 400),
            );
        }

        try {
            //check for valid user
            const { data: validUser } = await axiosInstance.get(
                `${process.env.API_GATEWAY_URL}/api/v1/users/externals/check-exist/user/${userId}`,
            );

            if (!validUser.success) {
                return next(new errorHandler("Invalid user id", 400));
            }

            const unavailableSessions: any[] = [];

            //check whether all slots are available
            for (const session of sessions) {
                const { vendorId, sessionDate, startTime, endTime } = session;

                if (!vendorId || !sessionDate || !startTime || !endTime) {
                    unavailableSessions.push(session);
                    continue;
                }

                //check for valid vendor
                const { data: validVendor } = await axiosInstance.get(
                    `${process.env.API_GATEWAY_URL}/api/v1/users/externals/check-exist/vendor/${vendorId}`,
                );

                if (!validVendor.success) {
                    unavailableSessions.push(session);
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
                                    {
                                        startTimeUtc: {
                                            [Op.lte]: startTimeUTC,
                                        },
                                    },
                                    { endTimeUtc: { [Op.gte]: endTimeUTC } },
                                ],
                            },
                        ],
                    },
                });

                if (isSlotBooked) {
                    unavailableSessions.push(session);
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

                //check whether vendor is available
                const { data: isVendorAvailable } = await axiosInstance.post(
                    `${process.env.API_GATEWAY_URL}/api/v1/users/externals/check-availability/vendor`,
                    vendorAvailabilityForm,
                    config,
                );

                if (!isVendorAvailable.success) {
                    unavailableSessions.push(session);
                }
            }

            //check whether any unavailable slots exists
            if (unavailableSessions.length > 0) {
                return res.status(400).json({
                    success: false,
                    message: "Unavailable sessions exists",
                    unavailableSessions,
                });
            }

            const createdSessions: any[] = [];

            for (const session of sessions) {
                const { vendorId, sessionDate, startTime, endTime } = session;

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

                //create session details
                const sessionCreated = await Session.create({
                    userId: userId,
                    vendorId: vendorId,
                    sessionDate: sessionDate,
                    startTimeUtc: startTimeUTC,
                    endTimeUtc: endTimeUTC,
                    status: "PENDING",
                });

                createdSessions.push(sessionCreated);
            }

            res.status(201).json({
                success: true,
                message: "Sessions booked successfully",
                createdSessions,
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

//confirm sessions (update session status after payment)
export const confirmSessions = asyncHandler(
    async (req: IConfirmSessionsRequest, res: Response, next: NextFunction) => {
        const userId = req.user?.id;
        //sessionIds = [sessionId, ...]
        const { sessionIds, timeZone } = req.body;

        if (!userId || !timeZone) {
            return next(new errorHandler("Provide all field", 400));
        }

        if (!Array.isArray(sessionIds) || sessionIds.length === 0) {
            return next(new errorHandler("Provide atleast 1 session id", 400));
        }

        try {
            //check for valid user
            const { data: validUser } = await axiosInstance.get(
                `${process.env.API_GATEWAY_URL}/api/v1/users/externals/check-exist/user/${userId}`,
            );

            if (!validUser.success) {
                return next(new errorHandler("Invalid user id", 400));
            }

            //update the session status to "BOOKED"
            await Session.update(
                { status: "BOOKED" },
                {
                    where: {
                        id: { [Op.in]: sessionIds },
                        userId: userId,
                        status: "PENDING",
                    },
                },
            );

            res.status(200).json({
                success: true,
                message: "Sessions updated successfully",
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

//get all sessions -- for client
export const getAllClientSessions = asyncHandler(
    async (req: IGetAllClientSessions, res: Response, next: NextFunction) => {
        const userId = req.user?.id;

        if (!userId) {
            return next(new errorHandler("Login to access this resource", 400));
        }

        try {
            //check for valid user
            const { data: validUser } = await axiosInstance.get(
                `${process.env.API_GATEWAY_URL}/api/v1/users/externals/check-exist/user/${userId}`,
            );

            if (!validUser.success) {
                return next(new errorHandler("Invalid user id", 400));
            }

            //get all the sessions
            const clientSessions = await Session.findAll({
                where: { userId: userId },
                attributes: [
                    "id",
                    "userId",
                    "vendorId",
                    "sessionDate",
                    "startTimeUtc",
                    "endTimeUtc",
                    "status",
                ],
            });

            res.status(200).json({
                success: true,
                clientSessions,
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

//get all sessions -- for vendor
export const getAllVendorSessions = asyncHandler(
    async (req: IGetAllVendorSessions, res: Response, next: NextFunction) => {
        const userId = req.user?.id;

        if (!userId) {
            return next(new errorHandler("Login to access this resource", 400));
        }

        //get status and timezone query if available
        const statusFilter = req.query?.status?.toString().toUpperCase();
        const timeZone = req.query?.timezone?.toString();

        if (!timeZone) {
            return next(new errorHandler("Provide time zone", 400));
        }

        //valid status record
        const validStatuses: Record<string, string> = {
            UPCOMING: "BOOKED",
            COMPLETED: "COMPLETED",
        };

        const status = validStatuses[statusFilter ?? ""] || undefined;

        try {
            //get corresponding vendor id
            const { data } = await axiosInstance.get(
                `${process.env.API_GATEWAY_URL}/api/v1/users/externals/vendor/${userId}`,
            );

            if (!data.success) {
                return next(new errorHandler("Invalid user id", 400));
            }

            //vendor id from data
            const vendorId = data.vendorId;

            const whereClause: Record<string, any> = { vendorId };
            if (status) whereClause.status = status;

            //get all the sessions
            const sessions = await Session.findAll({
                where: whereClause,
            });

            const sessionsWithLocalTime = sessions.map((session) => {
                const startTimeLocal = UTCToLocalTime({
                    dateTime: session.startTimeUtc,
                    timeZone: timeZone,
                });

                const endTimeLocal = UTCToLocalTime({
                    dateTime: session.endTimeUtc,
                    timeZone: timeZone,
                });

                return {
                    ...session.toJSON(),
                    startTimeLocal: startTimeLocal.toFormat(
                        "yyyy-MM-dd HH:mm:ss",
                    ),
                    endTimeLocal: endTimeLocal.toFormat("yyyy-MM-dd HH:mm:ss"),
                };
            });

            res.status(200).json({
                success: true,
                vendorSessions: sessionsWithLocalTime,
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
