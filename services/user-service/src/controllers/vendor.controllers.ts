import { Request, Response, NextFunction } from "express";
import asyncHandler from "../middleware/asyncHandler.middleware";
import errorHandler from "../utils/errorHandler.utils";
import {
    ILocalTimeToUTCInterface,
    IAddVendorAvailabilitySlotRequestBody,
    IUTCToLocalTimeInteface,
    IVendorApplicationRequestBody,
    IRemoveVendorAvailabilitySlotRequestBody,
    IViewAllAvailabilitySlotsRequestParams,
} from "../interfaces/vendor.interfaces";
import { User, Vendor, VendorApplication, VendorAvailability } from "../models";
import { sequelize } from "../config/sequelize.conf";
import logger from "../utils/logger.utils";
import { Op } from "sequelize";
import { DateTime } from "luxon";

//get day of the week using date
const getDayOfWeek = ({ dateString }: { dateString: string }) => {
    const date = new Date(dateString);
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    return days[date.getDay()];
};

//get week range (start of the week and end of the week)
const getWeekRange = ({ dateString }: { dateString: string }) => {
    const date = new Date(dateString);
    const dayOfWeek = date.getDay(); // 0 (Sunday) to 6 (Saturday)

    // Assuming the week starts on Monday
    const start = new Date(date);
    start.setDate(date.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)); // Move to Monday

    const end = new Date(start);
    end.setDate(start.getDate() + 6); // Move to Sunday

    const startOfWeek = start.toISOString().split("T")[0];
    const endOfWeek = end.toISOString().split("T")[0];

    return { startOfWeek, endOfWeek };
};

const getVendorCurrentDate = ({ timeZone }: { timeZone: string }) => {
    return DateTime.now().setZone(timeZone).toFormat("yyyy-MM-dd");
};

//convert vendor's local time to UTC time
const LocalTimeToUTC = ({
    date,
    time,
    timeZone,
}: ILocalTimeToUTCInterface): DateTime => {
    const dateTime = `${date}T${time}`;

    const utcTime = DateTime.fromISO(dateTime, { zone: timeZone }).toUTC();

    return utcTime;
};

//convert utc time to client's local time
const UTCToLocalTime = ({
    dateTime,
    timeZone,
}: IUTCToLocalTimeInteface): DateTime => {
    const localTime = DateTime.fromISO(dateTime).setZone(timeZone);

    return localTime;
};

//vendor application
export const vendorApplication = asyncHandler(
    async (
        req: IVendorApplicationRequestBody,
        res: Response,
        next: NextFunction,
    ) => {
        //necessary fields from body
        const {
            fullName,
            email,
            mobileNumber,
            businessName,
            pincode,
            state,
            city,
            completeAddress,
            category,
            qualifications,
            certificationName,
            issuingAuthority,
            certificationNumber,
            expirationDate,
            experience,
            registrationNumber,
            contactMethod,
            availability,
        } = req.body;

        //return error if any field is missing
        if (
            !fullName ||
            !email ||
            !mobileNumber ||
            !businessName ||
            !pincode ||
            !state ||
            !city ||
            !completeAddress ||
            !category ||
            !qualifications ||
            !certificationName ||
            !issuingAuthority ||
            !certificationNumber ||
            !expirationDate ||
            !experience ||
            !registrationNumber ||
            !contactMethod ||
            !availability
        ) {
            return next(new errorHandler("Provide All Required Details", 400));
        }

        //check for files
        if (!req.file) {
            return next(new errorHandler("Provide required file", 400));
        }

        try {
            //check for email existence in users table
            const existingUser = await User.findOne({
                where: { email: email },
            });

            if (existingUser) {
                return next(new errorHandler("Application already exist", 400));
            }

            //check for existing application with status != "APPROVED"
            const existingApplication = await VendorApplication.findOne({
                where: {
                    [Op.or]: { mobileNumber, email },
                    status: { [Op.in]: ["PENDING", "APPROVED"] },
                },
            });

            if (existingApplication) {
                return next(new errorHandler("Application already exist", 400));
            }

            //create a record of application
            await VendorApplication.create({
                fullName: fullName,
                email: email,
                mobileNumber: mobileNumber,
                businessName: businessName,
                pincode: pincode,
                state: state,
                city: city,
                completeAddress: completeAddress,
                category: category,
                qualifications: qualifications,
                certificationName: certificationName,
                issuingAuthority: issuingAuthority,
                certificationNumber: certificationNumber,
                expirationDate: expirationDate,
                experience: experience,
                registrationNumber: registrationNumber,
                proofOfCertificationUrl: req.file.path,
                contactMethod: contactMethod,
                availability: availability,
            });

            res.status(201).json({
                success: true,
                message: "Application submitted successfully",
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

// //add vendor availability slot
// export const addVendorAvailabilitySlot = asyncHandler(
//     async (
//         req: Request<{}, {}, IAddVendorAvailabilitySlotRequestBody>,
//         res: Response,
//         next: NextFunction,
//     ) => {
//         const { vendorId, availableDate, startTime, endTime, timeZone } =
//             req.body;

//         if (!vendorId || !availableDate || !startTime || !endTime) {
//             return next(new errorHandler("Provide All Details", 400));
//         }

//         try {
//             //query valid vendor
//             const validVendor = await Vendor.findOne({
//                 where: { id: vendorId },
//             });

//             if (!validVendor) {
//                 return next(new errorHandler("Invalid vendor id", 400));
//             }

//             //convert local times to utc
//             const startTimeUTC = String(
//                 LocalTimeToUTC({
//                     date: availableDate,
//                     time: startTime,
//                     timeZone,
//                 }),
//             );
//             const endTimeUTC = String(
//                 LocalTimeToUTC({
//                     date: availableDate,
//                     time: endTime,
//                     timeZone,
//                 }),
//             );

//             // Check for overlapping slots
//             const existingSlot = await VendorAvailability.findOne({
//                 where: {
//                     vendorId: vendorId,
//                     availableDate: availableDate,
//                     [Op.and]: [
//                         { startTimeUtc: { [Op.lt]: endTimeUTC } }, // Start before the new slot ends
//                         { endTimeUtc: { [Op.gt]: startTimeUTC } }, // End after the new slot starts
//                     ],
//                 },
//             });

//             if (existingSlot) {
//                 return next(
//                     new errorHandler(
//                         "Slot already available. Choose another slot",
//                         400,
//                     ),
//                 );
//             }

//             //add the availability slot
//             await VendorAvailability.create({
//                 vendorId: vendorId,
//                 availableDate: availableDate,
//                 startTimeUtc: startTimeUTC,
//                 endTimeUtc: endTimeUTC,
//                 timeZone: timeZone,
//             });

//             res.status(201).json({
//                 success: true,
//                 message: `Slot ${startTime}-${endTime} on ${availableDate} added successfully`,
//             });
//         } catch (error) {
//             return next(
//                 new errorHandler(
//                     `${process.env.NODE_ENV !== "production" && error instanceof Error ? error.message : "Something Went Wrong"}`,
//                     500,
//                 ),
//             );
//         }
//     },
// );

// //remove vendor availability slot
// export const removeVendorAvailabilitySlot = asyncHandler(
//     async (
//         req: Request<{}, {}, IRemoveVendorAvailabilitySlotRequestBody>,
//         res: Response,
//         next: NextFunction,
//     ) => {
//         const { slotId, timeZone } = req.body;

//         if (!slotId || !timeZone) {
//             return next(new errorHandler("Provide slot id and timeZone", 400));
//         }

//         try {
//             //look for slot existence
//             const validSlot = await VendorAvailability.findOne({
//                 where: { id: slotId },
//             });

//             if (!validSlot) {
//                 return next(new errorHandler("Slot not found", 404));
//             }

//             //dont remove slot other than available
//             if (validSlot.status !== "AVAILABLE") {
//                 return next(new errorHandler("Slot cannot be removed", 400));
//             }

//             //delete the slot
//             await VendorAvailability.destroy({
//                 where: { id: slotId },
//             });

//             //convert UTC to localtime of vendor
//             const startTime = String(
//                 UTCToLocalTime({
//                     dateTime: validSlot.startTimeUtc,
//                     timeZone,
//                 }),
//             )
//                 .split("T")[1]
//                 .slice(0, 8);
//             const endTime = String(
//                 UTCToLocalTime({
//                     dateTime: validSlot.endTimeUtc,
//                     timeZone,
//                 }),
//             )
//                 .split("T")[1]
//                 .slice(0, 8);

//             res.status(200).json({
//                 success: true,
//                 message: `Slot ${startTime} - ${endTime} on ${validSlot.availableDate} removed successfully`,
//             });
//         } catch (error) {
//             return next(
//                 new errorHandler(
//                     `${process.env.NODE_ENV !== "production" && error instanceof Error ? error.message : "Something Went Wrong"}`,
//                     500,
//                 ),
//             );
//         }
//     },
// );

//add vendor availability range -- POST
export const addVendorAvailabilitySlot = asyncHandler(
    async (
        req: Request<{}, {}, IAddVendorAvailabilitySlotRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const { vendorId, availableDate, startTime, endTime, timeZone } =
            req.body;

        if (
            !vendorId ||
            !availableDate ||
            !startTime ||
            !endTime ||
            !timeZone
        ) {
            return next(new errorHandler("Provide all fields", 400));
        }

        try {
            //check for valid vendor
            const validVendor = await Vendor.findOne({
                where: { id: vendorId },
            });

            if (!validVendor) {
                return next(new errorHandler("Vendor not found", 404));
            }

            //check for existing session
            const startTimeUTC = String(
                LocalTimeToUTC({
                    date: availableDate,
                    time: startTime,
                    timeZone,
                }),
            );
            const endTimeUTC = String(
                LocalTimeToUTC({
                    date: availableDate,
                    time: endTime,
                    timeZone,
                }),
            );

            // Check for overlapping slots
            const existingSlot = await VendorAvailability.findOne({
                where: {
                    vendorId: vendorId,
                    availableDate: availableDate,
                    [Op.and]: [
                        { startTimeUtc: { [Op.lt]: endTimeUTC } }, // Start before the new slot ends
                        { endTimeUtc: { [Op.gt]: startTimeUTC } }, // End after the new slot starts
                    ],
                },
            });

            if (existingSlot) {
                return next(
                    new errorHandler(
                        "Slot already available. Choose another slot",
                        400,
                    ),
                );
            }

            //add the availability slot
            await VendorAvailability.create({
                vendorId: vendorId,
                availableDate: availableDate,
                startTimeUtc: startTimeUTC,
                endTimeUtc: endTimeUTC,
                timeZone: timeZone,
            });

            res.status(201).json({
                success: true,
                message: `Slot ${startTime}-${endTime} on ${availableDate} added successfully`,
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

//remove vendor availability slot -- POST
export const removeVendorAvailabilitySlot = asyncHandler(
    async (
        req: Request<{}, {}, IRemoveVendorAvailabilitySlotRequestBody>,
        res: Response,
        next: NextFunction,
    ) => {
        const { slotId, timeZone } = req.body;

        if (!slotId || !timeZone) {
            return next(new errorHandler("Provide slot id and time zone", 400));
        }

        try {
            //look for slot existence
            const validSlot = await VendorAvailability.findOne({
                where: { id: slotId },
            });

            if (!validSlot) {
                return next(new errorHandler("Slot not found", 404));
            }

            //dont remove slot other than available
            if (validSlot.status !== "ACTIVE") {
                return next(new errorHandler("Slot cannot be removed", 400));
            }

            //delete the slot
            await VendorAvailability.destroy({
                where: { id: slotId },
            });

            //convert UTC to localtime of vendor
            const startTime = String(
                UTCToLocalTime({
                    dateTime: validSlot.startTimeUtc,
                    timeZone,
                }),
            )
                .split("T")[1]
                .slice(0, 8);
            const endTime = String(
                UTCToLocalTime({
                    dateTime: validSlot.endTimeUtc,
                    timeZone,
                }),
            )
                .split("T")[1]
                .slice(0, 8);

            res.status(200).json({
                success: true,
                message: `Slot ${startTime} - ${endTime} on ${validSlot.availableDate} removed successfully`,
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

//view all my available slots(vendor) -- GET
export const viewAllAvailableSlots = asyncHandler(
    async (
        req: Request<IViewAllAvailabilitySlotsRequestParams>,
        res: Response,
        next: NextFunction,
    ) => {
        const { vendorId } = req.params;

        if (!vendorId) {
            return next(new errorHandler("Provide vendor id", 400));
        }

        try {
            //check for valid vendor
            const validVendor = await Vendor.findOne({
                where: { id: vendorId },
            });

            if (!validVendor) {
                return next(new errorHandler("Vendor not found", 404));
            }

            //get all the slots which are active
            const slots = await VendorAvailability.findAll({
                where: { vendorId: vendorId, status: "ACTIVE" },
                attributes: [
                    "id",
                    // "vendorId",
                    "availableDate",
                    "startTimeUtc",
                    "endTimeUtc",
                    "timeZone",
                ],
                order: [
                    ["availableDate", "ASC"],
                    ["startTimeUtc", "ASC"],
                ],
            });

            //return error if slots not found
            if (!slots) {
                return next(new errorHandler("No slots found", 404));
            }

            //add day of the week to each of the records
            const slotsWithDay = slots.map((slot) => ({
                ...slot.toJSON(),
                dayOfWeek: getDayOfWeek({ dateString: slot.availableDate }),
            }));

            const timeZone = slots[0].timeZone;

            //get current date of the vendor using timezone
            const currentDate: string = getVendorCurrentDate({
                timeZone: timeZone,
            });

            //get start and end date of the week using current date
            const { startOfWeek, endOfWeek } = getWeekRange({
                dateString: currentDate,
            });

            //get next week's start date
            const nextWeekStart = DateTime.fromISO(startOfWeek, {
                zone: timeZone,
            })
                .plus({ weeks: 1 })
                .toISODate();

            //get next week's end date
            const nextWeekEnd = DateTime.fromISO(endOfWeek, {
                zone: timeZone,
            })
                .plus({ weeks: 1 })
                .toISODate();

            //filter current week slots
            const currentWeekSlots = slotsWithDay.filter(
                (slot) =>
                    slot.availableDate >= startOfWeek &&
                    slot.availableDate <= endOfWeek,
            );

            //filter upcoming week's slots
            const nextWeekSlots =
                nextWeekStart && nextWeekEnd
                    ? slotsWithDay.filter(
                          (slot) =>
                              slot.availableDate >= nextWeekStart &&
                              slot.availableDate <= nextWeekEnd,
                      )
                    : [];

            res.status(200).json({
                success: true,
                vendorId: vendorId,
                currentWeekSlots,
                nextWeekSlots,
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
