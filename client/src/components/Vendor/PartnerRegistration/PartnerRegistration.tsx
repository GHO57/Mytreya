import {
    Button,
    Checkbox,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import { ChangeEvent, FormEvent, useReducer, useState } from "react";
import CustomTextField from "../../../layouts/CustomTextField/CustomTextField";
import { initialState, formReducer } from "./formReducer";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { vendorRegistration } from "../../../features/vendor/vendorThunks";
import { IVendorRegistrationForm } from "../../../interfaces/vendorFeatures";

const categories: string[] = [
    "Lawyer",
    "Counsellor",
    "Nutritionist",
    "Yoga Expert",
    "Image Consultant",
    "Other",
];

const preferredContactMethods: string[] = ["Email", "Mobile"];

const availabilities: string[] = [
    "15 hours weekly",
    "16-44 hours weekly",
    "45+ hours weekly",
];

const PartnerRegistration = () => {
    const reduxDispatch = useDispatch<AppDispatch>();

    const [formState, dispatch] = useReducer(formReducer, initialState);
    const [agreementToggle, setAgreementToggle] = useState<boolean>(false);

    const handleRegisterFormSubmit = (event: FormEvent) => {
        event.preventDefault();

        // Required fields
        const {
            fullName,
            businessName,
            email,
            mobileNumber,
            pincode,
            state,
            city,
            completeAddress,
            category,
            qualifications,
            registrationNumber,
            proofOfCertification,
            contactMethod,
            availability,
            // Optional fields
            certificationName,
            issuingAuthority,
            certificationNumber,
            expirationDate,
            experience,
        } = formState;

        // Check if required fields are missing
        const requiredFields = [
            fullName,
            businessName,
            email,
            mobileNumber,
            pincode,
            state,
            city,
            completeAddress,
            category,
            qualifications,
            registrationNumber,
            proofOfCertification,
            contactMethod,
            availability,
        ];

        const isAnyFieldEmpty = requiredFields.some((field) => !field);

        if (isAnyFieldEmpty) {
            toast.error("Fill all required fields");
            return;
        }

        // Build base object
        const registrationData: IVendorRegistrationForm = {
            fullName,
            businessName,
            email,
            mobileNumber: Number(mobileNumber),
            pincode: Number(pincode),
            state,
            city,
            completeAddress,
            category,
            qualifications,
            registrationNumber: Number(registrationNumber),
            proofOfCertification,
            contactMethod,
            availability,
            // Optional fields added conditionally
            ...(certificationName && { certificationName }),
            ...(issuingAuthority && { issuingAuthority }),
            ...(certificationNumber && {
                certificationNumber: Number(certificationNumber),
            }),
            ...(expirationDate && { expirationDate }),
            ...(experience && { experience }),
        };

        // Dispatch redux action with clean payload
        reduxDispatch(vendorRegistration(registrationData))
            .unwrap()
            .then((response) => {
                if (response.success) {
                    setAgreementToggle(false);
                    dispatch({ type: "RESET_FORM" });
                }
            });
    };

    const handleFullNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "SET_FIELD",
            field: "fullName",
            value: event.target.value,
        });
    };

    const handleBusinessNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "SET_FIELD",
            field: "businessName",
            value: event.target.value,
        });
    };

    const handleEmailAddressChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "SET_FIELD",
            field: "email",
            value: event.target.value,
        });
    };

    const handleMobileNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value.length <= 12) {
            dispatch({
                type: "SET_FIELD",
                field: "mobileNumber",
                value: value,
            });
        }
    };

    const handlePincodeChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value.length <= 6) {
            dispatch({
                type: "SET_FIELD",
                field: "pincode",
                value: value,
            });
        }
    };

    const handleStateChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "SET_FIELD",
            field: "state",
            value: event.target.value,
        });
    };

    const handleCityChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "SET_FIELD",
            field: "city",
            value: event.target.value,
        });
    };

    const handleCompleteAddressChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        dispatch({
            type: "SET_FIELD",
            field: "completeAddress",
            value: event.target.value,
        });
    };

    const handleCategoryChange = (event: SelectChangeEvent) => {
        dispatch({
            type: "SET_FIELD",
            field: "category",
            value: event.target.value,
        });
    };

    const handleQualificationsChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        dispatch({
            type: "SET_FIELD",
            field: "qualifications",
            value: event.target.value,
        });
    };

    const handleCertificationNameChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        dispatch({
            type: "SET_FIELD",
            field: "certificationName",
            value: event.target.value,
        });
    };

    const handleProofOfCertificationChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        if (event.target.files && event.target.files.length > 0) {
            dispatch({
                type: "SET_FIELD",
                field: "proofOfCertification",
                value: event.target.files[0],
            });
        }
    };

    const handleIssuingAuthorityChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        dispatch({
            type: "SET_FIELD",
            field: "issuingAuthority",
            value: event.target.value,
        });
    };

    const handleCertificationNumberChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        dispatch({
            type: "SET_FIELD",
            field: "certificationNumber",
            value: event.target.value,
        });
    };

    const handleExpirationDateChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        dispatch({
            type: "SET_FIELD",
            field: "expirationDate",
            value: event.target.value,
        });
    };

    const handleExperienceChange = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: "SET_FIELD",
            field: "experience",
            value: event.target.value,
        });
    };

    const handleRegistrationNumberChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        dispatch({
            type: "SET_FIELD",
            field: "registrationNumber",
            value: event.target.value,
        });
    };

    const handlePreferredContactMethodChange = (event: SelectChangeEvent) => {
        dispatch({
            type: "SET_FIELD",
            field: "contactMethod",
            value: event.target.value,
        });
    };

    const handleAvailabilityChange = (event: SelectChangeEvent) => {
        dispatch({
            type: "SET_FIELD",
            field: "availability",
            value: event.target.value,
        });
    };

    const handleAgreementChange = () => {
        setAgreementToggle((prev) => !prev);
    };
    return (
        <>
            <div className="xl:w-full xl:flex xl:justify-center bg-gray-bg min-h-screen">
                <form
                    onSubmit={handleRegisterFormSubmit}
                    className="xl:max-w-[850px] xl:w-full flex xl:justify-center bg-white my-16 p-20 rounded-xl shadow-lg flex-col gap-y-20"
                >
                    <div className="flex flex-col gap-y-6">
                        <div className="flex items-center w-full gap-x-4">
                            <div className="bg-primary min-w-10 min-h-10 max-h-10 max-w-10 w-full h-full flex-center rounded-full text-white font-bold">
                                1
                            </div>
                            <h2 className="font-semibold text-lg w-full">
                                Basic Information
                            </h2>
                        </div>
                        <span className="flex gap-x-12">
                            <CustomTextField
                                label="Full Name"
                                labelId="fullName"
                                type="text"
                                size="small"
                                value={formState.fullName}
                                onChange={handleFullNameChange}
                                maxLength={150}
                                required={true}
                            />
                            <CustomTextField
                                label="Business Name"
                                labelId="businessName"
                                type="text"
                                size="small"
                                value={formState.businessName}
                                onChange={handleBusinessNameChange}
                                maxLength={150}
                                required={true}
                            />
                        </span>
                        <span className="flex gap-x-12">
                            <CustomTextField
                                label="Email Address"
                                labelId="emailAddress"
                                type="email"
                                size="small"
                                value={formState.email}
                                onChange={handleEmailAddressChange}
                                maxLength={100}
                                required={true}
                            />
                            <CustomTextField
                                label="Mobile Number"
                                labelId="mobileNumber"
                                type="number"
                                size="small"
                                value={formState.mobileNumber}
                                onChange={handleMobileNumberChange}
                                required={true}
                            />
                        </span>
                        <span className="flex gap-x-12">
                            <CustomTextField
                                label="Pincode"
                                labelId="pincode"
                                type="number"
                                size="small"
                                value={formState.pincode}
                                onChange={handlePincodeChange}
                                required={true}
                            />
                            <CustomTextField
                                label="State"
                                labelId="state"
                                type="text"
                                size="small"
                                value={formState.state}
                                onChange={handleStateChange}
                                maxLength={100}
                                required={true}
                            />
                            <CustomTextField
                                label="City"
                                labelId="city"
                                type="text"
                                size="small"
                                value={formState.city}
                                onChange={handleCityChange}
                                maxLength={100}
                                required={true}
                            />
                        </span>
                        <span className="flex gap-x-12">
                            <CustomTextField
                                label="Complete Address"
                                labelId="completeAddress"
                                type="text"
                                size="small"
                                value={formState.completeAddress}
                                onChange={handleCompleteAddressChange}
                                multiline={true}
                                minRows={8}
                                required={true}
                            />
                        </span>
                    </div>
                    <div className="flex flex-col gap-y-6">
                        <div className="flex items-center w-full gap-x-4">
                            <div className="bg-primary min-w-10 min-h-10 max-h-10 max-w-10 w-full h-full flex-center rounded-full text-white font-bold">
                                2
                            </div>
                            <h2 className="font-semibold text-lg">
                                Professional Details
                            </h2>
                        </div>
                        <span className="flex gap-x-12">
                            <div className="w-full flex flex-col">
                                <InputLabel
                                    variant="standard"
                                    id="category-select"
                                    sx={{
                                        color: "#555",
                                        fontSize: "15px",
                                        fontWeight: 400,
                                        fontFamily: "Inter, sans-serif",
                                        marginBottom: -4.8,
                                    }}
                                    required
                                >
                                    Category
                                </InputLabel>
                                <Select
                                    sx={{
                                        bgcolor: formState.category
                                            ? "#fff"
                                            : "#f7f7f7",
                                    }}
                                    fullWidth
                                    labelId="category-select"
                                    value={formState.category}
                                    onChange={handleCategoryChange}
                                    displayEmpty
                                    size="small"
                                    required
                                >
                                    <MenuItem value="">
                                        Choose Category
                                    </MenuItem>
                                    {categories.map((category) => (
                                        <MenuItem
                                            value={category}
                                            key={category}
                                        >
                                            {category}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                            <CustomTextField
                                label="Qualifications"
                                labelId="qualifications"
                                type="text"
                                size="small"
                                value={formState.qualifications}
                                onChange={handleQualificationsChange}
                                maxLength={150}
                                required={true}
                            />
                        </span>
                    </div>
                    <div className="flex flex-col gap-y-6">
                        <div className="flex items-center w-full gap-x-4">
                            <div className="bg-primary min-w-10 min-h-10 max-h-10 max-w-10 w-full h-full flex-center rounded-full text-white font-bold">
                                3
                            </div>
                            <h2 className="font-semibold text-lg">
                                Certifications
                            </h2>
                        </div>
                        <span className="flex gap-x-12">
                            <CustomTextField
                                label="Certification Name"
                                labelId="certificationName"
                                type="text"
                                size="small"
                                value={formState.certificationName}
                                onChange={handleCertificationNameChange}
                                maxLength={200}
                                required={false}
                            />
                            <CustomTextField
                                label="Issuing Authority"
                                labelId="issuingAuthority"
                                type="text"
                                size="small"
                                value={formState.issuingAuthority}
                                onChange={handleIssuingAuthorityChange}
                                maxLength={150}
                                required={false}
                            />
                        </span>
                        <span className="flex gap-x-12">
                            <CustomTextField
                                label="Certification Number"
                                labelId="certificationNumber"
                                type="number"
                                size="small"
                                value={formState.certificationNumber}
                                onChange={handleCertificationNumberChange}
                                required={false}
                            />
                            <CustomTextField
                                label="Expiration Date"
                                labelId="expirationDate"
                                type="date"
                                size="small"
                                value={formState.expirationDate}
                                onChange={handleExpirationDateChange}
                                required={false}
                            />
                        </span>
                        <span className="flex gap-x-12 max-w-[47%]">
                            <CustomTextField
                                label="Your Experience"
                                labelId="experience"
                                type="text"
                                size="small"
                                value={formState.experience}
                                onChange={handleExperienceChange}
                                maxLength={100}
                                required={false}
                            />
                        </span>
                    </div>
                    <div className="flex flex-col gap-y-6">
                        <div className="flex items-center w-full gap-x-4">
                            <div className="bg-primary min-w-10 min-h-10 max-h-10 max-w-10 w-full h-full flex-center rounded-full text-white font-bold">
                                4
                            </div>
                            <h2 className="font-semibold text-lg">
                                Compliance and Verification
                            </h2>
                        </div>
                        <span className="flex gap-x-12">
                            <CustomTextField
                                label="Registration Number"
                                labelId="registrationNumber"
                                type="number"
                                size="small"
                                value={formState.registrationNumber}
                                onChange={handleRegistrationNumberChange}
                                required={true}
                            />
                            <CustomTextField
                                label="Proof of Certification"
                                labelId="proofOfCertification"
                                type="file"
                                size="small"
                                onChange={handleProofOfCertificationChange}
                                required={true}
                            />
                        </span>
                    </div>
                    <div className="flex flex-col gap-y-6">
                        <div className="flex items-center w-full gap-x-4">
                            <div className="bg-primary min-w-10 min-h-10 max-h-10 max-w-10 w-full h-full flex-center rounded-full text-white font-bold">
                                5
                            </div>
                            <h2 className="font-semibold text-lg">
                                Contact Preferences
                            </h2>
                        </div>
                        <span className="flex gap-x-12">
                            <div className="w-full flex flex-col">
                                <InputLabel
                                    variant="standard"
                                    id="contact-preference-select"
                                    sx={{
                                        color: "#555",
                                        fontSize: "15px",
                                        fontWeight: 400,
                                        fontFamily: "Inter, sans-serif",
                                        marginBottom: -4.8,
                                    }}
                                    required
                                >
                                    Preferred Contact Method
                                </InputLabel>
                                <Select
                                    sx={{
                                        bgcolor: formState.contactMethod
                                            ? "#fff"
                                            : "#f7f7f7",
                                    }}
                                    fullWidth
                                    labelId="contact-preference-select"
                                    value={formState.contactMethod}
                                    onChange={
                                        handlePreferredContactMethodChange
                                    }
                                    displayEmpty
                                    size="small"
                                    required
                                >
                                    <MenuItem value="">
                                        Choose Category
                                    </MenuItem>
                                    {preferredContactMethods.map((method) => (
                                        <MenuItem value={method} key={method}>
                                            {method}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="w-full flex flex-col">
                                <InputLabel
                                    variant="standard"
                                    id="availability-select"
                                    sx={{
                                        color: "#555",
                                        fontSize: "15px",
                                        fontWeight: 400,
                                        fontFamily: "Inter, sans-serif",
                                        marginBottom: -4.8,
                                    }}
                                    required
                                >
                                    Availability
                                </InputLabel>
                                <Select
                                    sx={{
                                        bgcolor: formState.availability
                                            ? "#fff"
                                            : "#f7f7f7",
                                    }}
                                    fullWidth
                                    labelId="availability-select"
                                    value={formState.availability}
                                    onChange={handleAvailabilityChange}
                                    displayEmpty
                                    size="small"
                                    required
                                >
                                    <MenuItem value="">
                                        Choose Category
                                    </MenuItem>
                                    {availabilities.map((availability) => (
                                        <MenuItem
                                            value={availability}
                                            key={availability}
                                        >
                                            {availability}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                        </span>
                    </div>
                    <div className="flex flex-col gap-y-8">
                        <span className="flex items-center">
                            <Checkbox
                                checked={agreementToggle}
                                onChange={handleAgreementChange}
                                required
                            />
                            <p>
                                I agree to register with Mytreya and to their
                                TnC & Privacy Policy.
                            </p>
                        </span>
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                            sx={{
                                px: "3rem",
                                py: "0.9rem",
                            }}
                        >
                            Register
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default PartnerRegistration;
