import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    SelectChangeEvent,
    Step,
    StepLabel,
    Stepper,
} from "@mui/material";
import React, { ChangeEvent, FormEvent, useReducer, useState } from "react";
import CustomTextField from "../../../layouts/CustomTextField/CustomTextField";
import { formReducer, initialState } from "./formReducer";
import { toast } from "react-toastify";
import { DateTime } from "luxon";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { bookFreeConsultation } from "../../../features/client/clientThunks";

interface IProps {
    open: boolean;
    onClose: () => void;
}

const LocalTimeToUTC = ({
    date,
    time,
    timeZone,
}: {
    date: string;
    time: string;
    timeZone: string;
}): DateTime => {
    const dateTime = `${date}T${time}`;

    const utcTime = DateTime.fromISO(dateTime, { zone: timeZone }).toUTC();

    return utcTime;
};

const steps = ["1", "2", "3", "4"];

const BookFreeConsultation: React.FC<IProps> = ({ open, onClose }) => {
    const reduxDispatch = useDispatch<AppDispatch>();

    const [activeStep, setActiveStep] = useState<number>(0);

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        // Required fields
        let {
            name,
            email,
            mobileNumber,
            ageGroup,
            concern,
            otherConcern,
            goal,
            otherGoal,
            preferredDate,
            startTime,
        } = formState;

        if (concern === "Other") concern = otherConcern;
        if (goal === "Other") goal = otherGoal;

        // Check if required fields are missing
        const requiredFields = [
            name,
            email,
            mobileNumber,
            ageGroup,
            concern,
            goal,
            preferredDate,
            startTime,
        ];

        const isAnyFieldEmpty = requiredFields.some((field) => !field);

        if (isAnyFieldEmpty) {
            toast.error("Fill all required fields");
            return;
        }

        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Build base object
        const bookingData = {
            name,
            email,
            phoneNumber: Number(mobileNumber),
            ageGroup,
            concern,
            goal,
            preferredDate,
            startTime,
            timeZone,
        };

        // Dispatch redux action with clean payload
        reduxDispatch(bookFreeConsultation(bookingData))
            .unwrap()
            .then((response) => {
                if (response.success) {
                    onClose();
                    setActiveStep(0);
                    dispatch({ type: "RESET_FORM" });
                }
            });
    };

    const handleNext = (event: FormEvent) => {
        if (activeStep === steps.length - 1) {
            handleSubmit(event);
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const resetForm = () => {
        dispatch({ type: "RESET_FORM" });
        setActiveStep(0);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const [formState, dispatch] = useReducer(formReducer, initialState);

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                fullWidth
                maxWidth="md"
                slotProps={{
                    paper: {
                        sx: { padding: "1rem" },
                    },
                }}
            >
                {/* <DialogTitle width={"100%"} color="gray">
                    Book Free Consultation
                </DialogTitle> */}
                <DialogContent
                    sx={{
                        width: "100%",
                        maxHeight: "600px",
                    }}
                >
                    <Stepper nonLinear activeStep={activeStep}>
                        {/* {steps.map((label) => ( */}
                        <Step></Step>
                        {/* ))} */}
                    </Stepper>

                    {/* Step content */}
                    {activeStep === 0 && (
                        <FormPartOne
                            dispatch={dispatch}
                            formState={formState}
                        />
                    )}
                    {activeStep === 1 && (
                        <FormPartTwo
                            dispatch={dispatch}
                            formState={formState}
                        />
                    )}
                    {activeStep === 2 && (
                        <FormPartThree
                            dispatch={dispatch}
                            formState={formState}
                        />
                    )}
                    {activeStep === 3 && (
                        <FormPartFour
                            dispatch={dispatch}
                            formState={formState}
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleBack}
                        disabled={activeStep === 0}
                        color="secondary"
                        variant="text"
                    >
                        Back
                    </Button>
                    <Button
                        onClick={handleNext}
                        color="primary"
                        variant="contained"
                    >
                        {activeStep === steps.length - 1 ? "Submit" : "Next"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

const FormPartOne = ({ dispatch, formState }) => {
    const ageGroups = ["Under 18", "18-25", "26-35", "36-45", "46 and above"];
    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "SET_FIELD",
            field: "name",
            value: event.target.value,
        });
    };

    const handleMobileNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "SET_FIELD",
            field: "mobileNumber",
            value: event.target.value,
        });
    };

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "SET_FIELD",
            field: "email",
            value: event.target.value,
        });
    };

    const handleAgeGroupSelect = (event: SelectChangeEvent) => {
        dispatch({
            type: "SET_FIELD",
            field: "ageGroup",
            value: event.target.value,
        });
    };

    return (
        <>
            <Box>
                <div className="flex items-center w-full gap-x-4 mb-6">
                    <div className="bg-primary min-w-10 min-h-10 max-h-10 max-w-10 w-full h-full flex-center rounded-full text-white font-bold ">
                        1
                    </div>
                    <h2 className="text-black-bg font-semibold text-2xl">
                        Personal Information
                    </h2>
                </div>
                <div className="flex flex-col gap-y-10">
                    <span className="flex justify-center gap-4">
                        <CustomTextField
                            label="Name"
                            labelId="name"
                            type="text"
                            size="medium"
                            value={formState.name}
                            onChange={handleNameChange}
                            required={true}
                        />
                        <CustomTextField
                            label="Mobile Number"
                            labelId="mobileNumber"
                            type="number"
                            size="medium"
                            value={formState.mobileNumber}
                            onChange={handleMobileNumberChange}
                            required={true}
                        />
                    </span>
                    <span className="flex justify-center gap-4">
                        <CustomTextField
                            label="Email Address"
                            labelId="emailAddress"
                            type="email"
                            size="medium"
                            value={formState.email}
                            onChange={handleEmailChange}
                            required={true}
                        />
                        <div className="w-full flex flex-col">
                            <InputLabel
                                variant="standard"
                                id="age-group-select"
                                sx={{
                                    color: "#555",
                                    fontSize: "15px",
                                    fontWeight: 400,
                                    fontFamily: "Inter, sans-serif",
                                    marginBottom: -4.8,
                                }}
                                required
                            >
                                Age
                            </InputLabel>
                            <Select
                                sx={{
                                    bgcolor: formState.ageGroup
                                        ? "#fff"
                                        : "#f7f7f7",
                                }}
                                fullWidth
                                labelId="age-group-select"
                                value={formState.ageGroup}
                                onChange={handleAgeGroupSelect}
                                displayEmpty
                                size="medium"
                                required
                            >
                                <MenuItem value="">How old are you?</MenuItem>
                                {ageGroups.map((group) => (
                                    <MenuItem value={group} key={group}>
                                        {group}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>
                    </span>
                </div>
            </Box>
        </>
    );
};

const FormPartTwo = ({ dispatch, formState }) => {
    const handleConcernChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "SET_FIELD",
            field: "concern",
            value: event.target.value,
        });
    };

    const handleOtherConcernChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "SET_FIELD",
            field: "otherConcern",
            value: event.target.value,
        });
    };

    const concernOptions = [
        "Stress or anxiety that won’t go away",
        "I can’t stick to a healthy routine",
        "Relationship conflicts, either at home or work",
        "Struggling to balance work and personal life",
        "All of the above",
        "Other",
    ];

    return (
        <>
            <Box alignSelf="center">
                <FormControl component="fieldset" fullWidth>
                    <div className="flex items-center text-center w-full gap-x-4 mb-6">
                        <div className="bg-primary min-w-10 min-h-10 max-h-10 max-w-10 w-full h-full flex-center rounded-full text-white font-bold">
                            2
                        </div>
                        <h2 className="text-black-bg font-semibold text-2xl">
                            What’s been bothering you the most lately?
                        </h2>
                    </div>

                    <RadioGroup
                        aria-label="concern"
                        name="concern"
                        value={formState.concern}
                        onChange={handleConcernChange}
                    >
                        {concernOptions.map((option) => (
                            <FormControlLabel
                                key={option}
                                value={option}
                                control={<Radio />}
                                label={option}
                                sx={{
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    marginBottom: "8px",
                                    padding: "8px 16px",
                                    alignItems: "center",
                                    "& .MuiFormControlLabel-label": {
                                        fontSize: "16px",
                                        fontWeight: 500,
                                    },
                                }}
                            />
                        ))}
                    </RadioGroup>

                    {formState.concern === "Other" && (
                        <Box mt={2} className="w-full">
                            <CustomTextField
                                labelId="otherConcern"
                                type="text"
                                size="medium"
                                value={formState.otherConcern || ""}
                                onChange={handleOtherConcernChange}
                                placeholder={"Specify your concern here"}
                                required={false}
                            />
                        </Box>
                    )}
                </FormControl>
            </Box>
        </>
    );
};

const FormPartThree = ({ dispatch, formState }) => {
    const handleGoalChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "SET_FIELD",
            field: "goal",
            value: event.target.value,
        });
    };

    const handleOtherGoalChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "SET_FIELD",
            field: "otherGoal",
            value: event.target.value,
        });
    };

    const goalOptions = [
        "Find clarity and peace",
        "Establish healthy habits",
        "Improve relationships",
        "Work-life balance",
        "Other",
    ];

    return (
        <>
            <Box>
                <FormControl component="fieldset" fullWidth>
                    <div className="flex items-center w-full gap-x-4 mb-6">
                        <div className="bg-primary min-w-10 min-h-10 max-h-10 max-w-10 w-full h-full flex-center rounded-full text-white font-bold">
                            3
                        </div>
                        <h2 className="text-black-bg font-semibold text-2xl">
                            What do you want to achieve during this journey with
                            us?
                        </h2>
                    </div>
                    <RadioGroup
                        aria-label="goal"
                        name="goal"
                        value={formState.goal}
                        onChange={handleGoalChange}
                    >
                        {goalOptions.map((option) => (
                            <FormControlLabel
                                key={option}
                                value={option}
                                control={<Radio />}
                                label={option}
                                sx={{
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    marginBottom: "8px",
                                    padding: "8px 16px",
                                    alignItems: "center",
                                    "& .MuiFormControlLabel-label": {
                                        fontSize: "16px",
                                        fontWeight: 500,
                                    },
                                }}
                            />
                        ))}
                    </RadioGroup>

                    {formState.goal === "Other" && (
                        <Box mt={2} className="w-full">
                            <CustomTextField
                                labelId="otherGoal"
                                type="text"
                                size="medium"
                                value={formState.otherGoal || ""}
                                onChange={handleOtherGoalChange}
                                placeholder={"Specify your goal here"}
                                required={false}
                            />
                        </Box>
                    )}
                </FormControl>
            </Box>
        </>
    );
};

const FormPartFour = ({ dispatch, formState }) => {
    const handlePreferredDateChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        dispatch({
            type: "SET_FIELD",
            field: "preferredDate",
            value: event.target.value,
        });
    };

    const handleStartTimeChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "SET_FIELD",
            field: "startTime",
            value: event.target.value,
        });
    };

    return (
        <>
            <Box>
                <div className="flex items-center w-full gap-x-4 mb-6">
                    <div className="bg-primary min-w-10 min-h-10 max-h-10 max-w-10 w-full h-full flex-center rounded-full text-white font-bold">
                        4
                    </div>
                    <h2 className="text-black-bg font-semibold text-2xl">
                        Please Select Counselling Date & Time
                    </h2>
                </div>
                <span className="flex justify-center gap-4">
                    <CustomTextField
                        label="Date"
                        labelId="preferredDate"
                        type="date"
                        size="medium"
                        value={formState.preferredDate}
                        onChange={handlePreferredDateChange}
                        required={true}
                    />
                    <CustomTextField
                        label="Time"
                        labelId="startTime"
                        type="time"
                        size="medium"
                        value={formState.startTime}
                        onChange={handleStartTimeChange}
                        required={true}
                    />
                </span>
            </Box>
        </>
    );
};

export default BookFreeConsultation;
