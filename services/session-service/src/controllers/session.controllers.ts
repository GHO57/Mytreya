import asyncHandler from "../middleware/asyncHandler.middleware";
import errorHandler from "../utils/errorHandler.utils";
import { ClientIntake, Session } from "../models";
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger.utils";
import {
    IAssignClientWithAdminRequest,
    IBookConsultationSessionRequest,
    IConfirmSessionsRequest,
    ICreateClientSessionsInBulkRequest,
    IGetAllClientSessions,
    IGetAllVendorSessions,
    IGetClientConsultationRequests,
    ILocalTimeToUTCInterface,
    IUTCToLocalTimeInteface,
} from "../interfaces/session.interfaces";
import axiosInstance from "../utils/axiosInstance.utils";
import { Op } from "sequelize";
import { DateTime } from "luxon";
import { sequelize } from "../config/sequelize.conf";

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

const addHoursToUTC = ({
    dateTime,
    hours,
}: {
    dateTime: string;
    hours: number;
}): DateTime => {
    const updatedTime = DateTime.fromISO(dateTime, { zone: "utc" })
        .plus({ hours: hours })
        .toUTC();
    return updatedTime;
};

const timeZoneToDate = ({ timeZone }: { timeZone: string }) => {
    return DateTime.now().setZone(timeZone).toFormat("yyyy-MM-dd");
};

//assign client with counselling admin -- POST

export const assignClientWithAdmin = asyncHandler(
    async (
        req: IAssignClientWithAdminRequest,
        res: Response,
        next: NextFunction,
    ) => {
        // const userId = req.user?.id;
        const { userId, adminUserId, sessionDate, startTimeUTC, timeZone } =
            req.body;

        if (
            !userId ||
            !adminUserId ||
            !sessionDate ||
            !startTimeUTC ||
            !timeZone
        ) {
            return next(new errorHandler("Provide all field", 400));
        }

        try {
            //check for valid admin user
            const { data: validAdminUser } = await axiosInstance.get(
                `${process.env.API_GATEWAY_URL}/api/v1/users/externals/check-exist/user/${adminUserId}`,
            );

            if (!validAdminUser.success) {
                return next(new errorHandler("Invalid admin user id", 400));
            }

            // check for valid user
            const { data: validUser } = await axiosInstance.get(
                `${process.env.API_GATEWAY_URL}/api/v1/users/externals/check-exist/user/${userId}`,
            );

            if (!validUser.success) {
                return next(new errorHandler("Invalid user id", 400));
            }

            //convert client's localtime to utc

            const endTimeUTC = String(
                addHoursToUTC({
                    dateTime: startTimeUTC,
                    hours: 3,
                }),
            );

            // check for already booked slot
            const isSlotBooked = await Session.findOne({
                where: {
                    adminUserId: adminUserId,
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
                return next(
                    new errorHandler("Slot already booked for that date", 400),
                );
            }

            //create session details
            await Session.create({
                userId: userId,
                adminUserId: adminUserId,
                sessionDate: sessionDate,
                startTimeUtc: startTimeUTC,
                endTimeUtc: endTimeUTC,
            });

            //change the status of the pending request
            await ClientIntake.update(
                { status: "BOOKED" },
                { where: { userId: userId } },
            );

            res.status(201).json({
                success: true,
                message: "Client assigned successfully",
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
        //sessions = [{vendorId, recommendedServiceId, pricingId, sessionDate, startTime, endTime}, ...]
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
                const {
                    vendorId,
                    recommendedServiceId,
                    pricingId,
                    sessionDate,
                    startTime,
                    endTime,
                } = session;

                if (
                    !vendorId ||
                    !recommendedServiceId ||
                    !pricingId ||
                    !sessionDate ||
                    !startTime ||
                    !endTime
                ) {
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
                const {
                    vendorId,
                    recommendedServiceId,
                    pricingId,
                    sessionDate,
                    startTime,
                    endTime,
                } = session;

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
                    recommendedServiceId: recommendedServiceId,
                    pricingId: pricingId,
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

//get client's consultation request -- admin

export const getClientConsultationRequests = asyncHandler(
    async (
        req: IGetClientConsultationRequests,
        res: Response,
        next: NextFunction,
    ) => {
        const adminUserId = req.user?.id;

        if (!adminUserId) {
            return next(new errorHandler("Login to access this resource", 400));
        }

        // const statusFilter = req.query?.status?.toString().toUpperCase();

        // //valid status record
        // const validStatuses: Record<string, string> = {
        //     PENDING: "PENDING",
        //     COMPLETED: "COMPLETED",
        // };

        // const status = validStatuses[statusFilter ?? ""] || "PENDING";

        try {
            //check for valid user
            const { data: validAdminUser } = await axiosInstance.get(
                `${process.env.API_GATEWAY_URL}/api/v1/users/externals/check-exist/user/${adminUserId}`,
            );

            if (!validAdminUser.success) {
                return next(new errorHandler("Invalid user id", 400));
            }

            const requests = await ClientIntake.findAll({
                // where: { status: status },
                attributes: { exclude: ["createdAt", "updatedAt"] },
            });

            res.status(200).json({
                success: true,
                requests,
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

//book consultation session by client
export const bookConsultationSession = asyncHandler(
    async (
        req: IBookConsultationSessionRequest,
        res: Response,
        next: NextFunction,
    ) => {
        const {
            name,
            email,
            phoneNumber,
            ageGroup,
            concern,
            goal,
            preferredDate,
            startTime,
            timeZone,
        } = req.body;

        const userId = req.user?.id;

        if (
            !name ||
            !email ||
            !phoneNumber ||
            !ageGroup ||
            !concern ||
            !goal ||
            !preferredDate ||
            !startTime ||
            !userId ||
            !timeZone
        ) {
            return next(new errorHandler("Provide all fields", 400));
        }

        try {
            //check for existing request
            const request = await ClientIntake.findAll({
                where: { userId: userId, status: { [Op.ne]: "COMPLETED" } },
            });

            if (request.length > 0) {
                return next(
                    new errorHandler(
                        "Cannot book, A consultation already inprogress",
                        400,
                    ),
                );
            }

            //convert start time to utc
            const startTimeUTC = String(
                LocalTimeToUTC({
                    date: preferredDate,
                    time: startTime,
                    timeZone: timeZone,
                }),
            );

            //insert the data to client intake model
            await ClientIntake.create({
                userId: userId,
                name: name,
                email: email,
                phoneNumber: phoneNumber,
                ageGroup: ageGroup,
                concern: concern,
                goal: goal,
                preferredDate: preferredDate,
                startTimeUtc: startTimeUTC,
                timeZone: timeZone,
            });

            res.status(201).json({
                success: true,
                message: "Free Consultation booked successfully",
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

//get available counselling admins by date controllers
export const getAvailableCounsellingAdminsByDate = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const date = req.query?.date?.toString();

        if (!date) {
            return next(new errorHandler("Provide date field", 400));
        }
        try {
            const { data: counsellingAdmins } = await axiosInstance.get(
                `${process.env.API_GATEWAY_URL}/api/v1/users/externals/admin/counselling-admins`,
            );

            //Get all sessions on that date (that have a counselling admin assigned)
            const sessionsOnDate = await Session.findAll({
                where: {
                    sessionDate: date,
                    adminUserId: { [Op.ne]: null }, // Make sure admin is assigned
                },
                attributes: ["adminUserId"],
            });

            //Extract busy admin IDs
            const busyAdminIds = sessionsOnDate.map(
                (session) => session.adminUserId,
            );

            //Filter out busy admins
            const availableCounsellingAdmins =
                counsellingAdmins.counsellingAdmins.filter(
                    (admin: any) => !busyAdminIds.includes(admin.id),
                );

            res.status(200).json({
                success: true,
                availableCounsellingAdmins,
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

//mark client-counselling admin session as COMPLETED
export const markAdminSessionCompleted = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
        const { sessionId, adminUserId, userId } = req.body;

        if (!sessionId || !adminUserId || !userId) {
            return next(new errorHandler("Provide all the fields", 400));
        }

        try {
            //create a package for the Client
            const payload = {
                adminUserId: adminUserId,
                userId: userId,
            };

            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const { data: createPackage } = await axiosInstance.post(
                `${process.env.API_GATEWAY_URL}/api/v1/pricings/admin/packages/recommended/create`,
                payload,
                config,
            );

            if (!createPackage.success) {
                return next(
                    new errorHandler("Something went wrong. Try again", 400),
                );
            }

            //mark session as COMPLETED
            await Session.update(
                { status: "COMPLETED" },
                { where: { id: sessionId } },
            );

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
