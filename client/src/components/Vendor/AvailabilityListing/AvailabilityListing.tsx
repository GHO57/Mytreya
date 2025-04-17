import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import {
    addVendorAvailabilityBulk,
    getVendorAvailabilities,
} from "../../../features/vendor/vendorThunks";
import {
    availabilitiesArray,
    IAddVendorAvailabilityBulkForm,
} from "../../../interfaces/vendorFeatures";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
    Button,
    IconButton,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { DateTime } from "luxon";

const localizeDate = ({
    dateTime,
    userLocale,
}: {
    dateTime: string;
    userLocale: string;
}) => {
    const date = new Date(dateTime.split("T")[0]);

    const convertedDate = new Intl.DateTimeFormat(userLocale, {
        // weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(date);

    return convertedDate;
};

const getStartOfWeek = (weekOffset = 0) => {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(now.setDate(diff + weekOffset * 7));
    monday.setHours(0, 0, 0, 0); // reset time
    return monday;
};

const dayIndexMap: Record<string, number> = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
};

const localizeDateFromDay = (
    weekday: string,
    weekStartDate: Date,
    userLocale: string,
): string => {
    const dayOffset = dayIndexMap[weekday];
    const resultDate = new Date(weekStartDate);

    resultDate.setDate(weekStartDate.getDate() + dayOffset);

    const convertedDate = new Intl.DateTimeFormat(userLocale, {
        // weekday: "long",
        year: "numeric",
        month: "short",
        day: "numeric",
    }).format(resultDate);

    return convertedDate;
};

const renderTimeOptions = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 30) {
            const hour = h.toString().padStart(2, "0");
            const min = m.toString().padStart(2, "0");
            const time24 = `${hour}:${min}`;

            // Convert to 12-hour format for display
            const [displayHour, displayMin] = time24.split(":");
            const date = new Date();
            date.setHours(parseInt(displayHour));
            date.setMinutes(parseInt(displayMin));

            const time12 = new Intl.DateTimeFormat("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            }).format(date);

            times.push(
                <MenuItem key={time24} value={time24}>
                    {time12}
                </MenuItem>,
            );
        }
    }
    return times;
};

interface ISlots {
    day: string;
    date: string;
    slots: {
        id: string;
        start: string;
        end: string;
    }[];
}

interface IAllSlots {
    availableDate: string;
    startTime: string;
    endTime: string;
}

const AvailabilityListing = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { user } = useSelector((state: RootState) => state.user);
    const { vendorAvailabilities } = useSelector(
        (state: RootState) => state.vendor,
    );

    const [editSlots, setEditSlots] = useState<boolean>(false);
    const [currentWeekSlots, setCurrentWeekSlots] = useState<ISlots[]>([]);
    const [nextWeekSlots, setNextWeekSlots] = useState<ISlots[]>([]);

    const vendorId: string | undefined = user?.id;
    const userLocale = "en-IN";

    useEffect(() => {
        if (vendorId) {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            dispatch(getVendorAvailabilities({ vendorId, timeZone }));
        }
    }, [dispatch, vendorId]);

    const handleEditSlots = () => {
        setEditSlots(true);
    };

    const handleCancelEditSlots = () => {
        setEditSlots(false);
    };

    const handleSaveSlots = () => {
        const slotArray: IAllSlots[] = [];

        for (const slot of currentWeekSlots) {
            if (!slot.date) {
                continue;
            }

            const date = String(
                DateTime.fromFormat(slot.date, "dd LLL yyyy", {
                    locale: "en",
                }),
            ).split("T")[0];
            slot.slots.map((s) => {
                if (s.start >= s.end) {
                    alert(
                        "Start time should not be higher or equal to end time",
                    );
                }
                slotArray.push({
                    availableDate: date,
                    startTime: s.start,
                    endTime: s.end,
                });
            });
        }

        for (const slot of nextWeekSlots) {
            if (!slot.date) {
                continue;
            }
            const date = String(
                DateTime.fromFormat(slot.date, "dd LLL yyyy", {
                    locale: "en",
                }),
            ).split("T")[0];
            slot.slots.map((s) => {
                if (s.start >= s.end) {
                    alert(
                        "Start time should not be higher or equal to end time",
                    );
                }
                slotArray.push({
                    availableDate: date,
                    startTime: s.start,
                    endTime: s.end,
                });
            });
        }

        const form: IAddVendorAvailabilityBulkForm = {
            vendorId: vendorId,
            timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            slots: slotArray,
        };

        dispatch(addVendorAvailabilityBulk(form));
    };

    const currentWeekStart = getStartOfWeek(0);
    const nextWeekStart = getStartOfWeek(1);

    const handleAddNewSlot = ({
        title,
        day,
    }: {
        title: string;
        day: string;
    }) => {
        const isCurrent = title === "Current Week Slots";
        const updated = isCurrent ? [...currentWeekSlots] : [...nextWeekSlots];

        const targetDay = updated.find((d) => d.day === day);
        if (targetDay) {
            const weekStart = isCurrent ? currentWeekStart : nextWeekStart;
            const newDay = localizeDateFromDay(day, weekStart, userLocale);
            targetDay.date = newDay;
            targetDay.slots.push({
                id: crypto.randomUUID(), // temporary ID
                start: "09:00", // default start
                end: "09:30", // default end
            });
            if (isCurrent) {
                setCurrentWeekSlots(updated);
            } else {
                setNextWeekSlots(updated);
            }
        }
    };

    const handleSlotDeletion = ({
        title,
        day,
        id,
    }: {
        title: string;
        day: string;
        id: string;
    }) => {
        const isCurrent = title === "Current Week Slots";
        const updated = isCurrent ? [...currentWeekSlots] : [...nextWeekSlots];

        const dayToUpdate = updated.find((d) => d.day === day);
        if (dayToUpdate) {
            dayToUpdate.slots = dayToUpdate.slots.filter((s) => s.id !== id);
            if (dayToUpdate.slots.length <= 0) {
                dayToUpdate.date = "";
            }
            if (isCurrent) {
                setCurrentWeekSlots(updated);
            } else {
                setNextWeekSlots(updated);
            }
        }
    };

    const handleStartTimeSelection = (
        event: SelectChangeEvent,
        {
            title,
            day,
            id,
        }: {
            title: string;
            day: string;
            id: string;
        },
    ) => {
        const isCurrent = title === "Current Week Slots";
        const updated = isCurrent ? [...currentWeekSlots] : [...nextWeekSlots];

        const dayToUpdate = updated.find((d) => d.day === day);
        if (dayToUpdate) {
            const slotToUpdate = dayToUpdate.slots.find((s) => s.id === id);
            if (slotToUpdate) {
                slotToUpdate.start = event.target.value;
                if (isCurrent) {
                    setCurrentWeekSlots(updated);
                } else {
                    setNextWeekSlots(updated);
                }
            }
        }
    };

    const handleEndTimeSelection = (
        event: SelectChangeEvent,
        {
            title,
            day,
            id,
        }: {
            title: string;
            day: string;
            id: string;
        },
    ) => {
        const isCurrent = title === "Current Week Slots";
        const updated = isCurrent ? [...currentWeekSlots] : [...nextWeekSlots];

        const dayToUpdate = updated.find((d) => d.day === day);
        if (dayToUpdate) {
            const slotToUpdate = dayToUpdate.slots.find((s) => s.id === id);
            if (slotToUpdate) {
                slotToUpdate.end = event.target.value;
                if (isCurrent) {
                    setCurrentWeekSlots(updated);
                } else {
                    setNextWeekSlots(updated);
                }
            }
        }
    };

    const initializeWeekDays = () => {
        const weekDays = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ];
        return weekDays.map((day) => ({
            day,
            date: "",
            slots: [] as {
                id: string;
                start: string;
                end: string;
            }[],
        }));
    };

    const getTimeFromDateTime = (dateTime: string) =>
        dateTime.split("T")[1].slice(0, 5);

    const mergeSlotsIntoWeek = useCallback(
        (slots: availabilitiesArray[]) => {
            const week = initializeWeekDays();

            slots.forEach((slot) => {
                const target = week.find((d) => d.day === slot.dayOfWeek);
                if (target) {
                    target.date = localizeDate({
                        dateTime: slot.startTimeLocal,
                        userLocale,
                    });
                    target.slots.push({
                        id: slot.id,
                        start: getTimeFromDateTime(slot.startTimeLocal),
                        end: getTimeFromDateTime(slot.endTimeLocal),
                    });
                }
            });
            return week;
        },
        [userLocale],
    );

    useEffect(() => {
        if (editSlots || vendorAvailabilities) {
            setCurrentWeekSlots(
                mergeSlotsIntoWeek(vendorAvailabilities.currentWeekSlots),
            );
            setNextWeekSlots(
                mergeSlotsIntoWeek(vendorAvailabilities.nextWeekSlots),
            );
        }
    }, [vendorAvailabilities, editSlots, mergeSlotsIntoWeek]);

    return (
        <>
            <div className="flex justify-center w-full mt-8">
                <div className="flex flex-col w-full max-w-[1120px] gap-y-8">
                    <div className="w-full flex justify-end">
                        {editSlots ? (
                            <div className="flex justify-center gap-x-5">
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={handleCancelEditSlots}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleSaveSlots}
                                >
                                    Save All
                                </Button>
                            </div>
                        ) : (
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={handleEditSlots}
                            >
                                Edit Slots
                            </Button>
                        )}
                    </div>
                    <div className="flex justify-center gap-x-20">
                        {[
                            {
                                title: "Current Week Slots",
                                week: currentWeekSlots,
                            },
                            {
                                title: "Upcoming Week Slots",
                                week: nextWeekSlots,
                            },
                        ].map(({ title, week }) => (
                            <div
                                key={title}
                                className="w-full flex flex-col gap-y-4"
                            >
                                <h1 className="text-xl font-bold w-full">
                                    {title}
                                </h1>
                                <div className="flex flex-col gap-5 bg-[#fafafa] border border-gray-200 shadow-lg rounded-sm w-full py-4">
                                    {week.map((day) => (
                                        <div
                                            key={day.day}
                                            className={`${day.day !== "Monday" ? "border-t border-t-gray-200" : ""} px-8 w-full pt-2 flex flex-col`}
                                        >
                                            <div className="w-full flex justify-between items-center">
                                                <span className="flex gap-x-8 items-center">
                                                    <p className="font-bold text-lg w-8">
                                                        {String(day.day)
                                                            .toUpperCase()
                                                            .slice(0, 3)}
                                                    </p>
                                                    <p className="text-paragraph2 font-medium">
                                                        {day.date || "No slots"}
                                                    </p>
                                                </span>

                                                <IconButton
                                                    color="secondary"
                                                    disabled={!editSlots}
                                                    onClick={() =>
                                                        handleAddNewSlot({
                                                            title: title,
                                                            day: day.day,
                                                        })
                                                    }
                                                >
                                                    <AddOutlinedIcon />
                                                </IconButton>
                                            </div>
                                            {day.slots.map((slot) => (
                                                <div
                                                    key={slot.id}
                                                    className="flex items-center gap-3 mb-2"
                                                >
                                                    <Select
                                                        value={slot.start || ""}
                                                        variant="outlined"
                                                        sx={{
                                                            bgcolor: "white",
                                                        }}
                                                        size="small"
                                                        disabled={!editSlots}
                                                        onChange={(e) =>
                                                            handleStartTimeSelection(
                                                                e,
                                                                {
                                                                    title: title,
                                                                    day: day.day,
                                                                    id: slot.id,
                                                                },
                                                            )
                                                        }
                                                    >
                                                        {renderTimeOptions()}
                                                    </Select>
                                                    <span className="xl:text-lg">
                                                        -
                                                    </span>
                                                    <Select
                                                        value={slot.end || ""}
                                                        variant="outlined"
                                                        sx={{
                                                            bgcolor: "white",
                                                        }}
                                                        size="small"
                                                        disabled={!editSlots}
                                                        onChange={(e) =>
                                                            handleEndTimeSelection(
                                                                e,
                                                                {
                                                                    title: title,
                                                                    day: day.day,
                                                                    id: slot.id,
                                                                },
                                                            )
                                                        }
                                                    >
                                                        {renderTimeOptions()}
                                                    </Select>
                                                    <IconButton
                                                        color="secondary"
                                                        disabled={!editSlots}
                                                        onClick={() =>
                                                            handleSlotDeletion({
                                                                title,
                                                                day: day.day,
                                                                id: slot.id,
                                                            })
                                                        }
                                                    >
                                                        <CloseRoundedIcon fontSize="inherit" />
                                                    </IconButton>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default AvailabilityListing;
