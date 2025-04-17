import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import {
    ErrorResponse,
    IAddVendorAvailabilityBulkForm,
    IAddVendorAvailabilityBulkResponse,
    IGetVendorAvailabilitiesResponse,
    IVendorRegistrationForm,
    IVendorRegistrationResponse,
} from "../../interfaces/vendorFeatures";

//vendor registration -- POST

export const vendorRegistration = createAsyncThunk<
    IVendorRegistrationResponse,
    IVendorRegistrationForm,
    { rejectValue: ErrorResponse }
>("vendor/registration", async (form: IVendorRegistrationForm, thunkAPI) => {
    try {
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        const { data } = await axiosInstance.post<IVendorRegistrationResponse>(
            "/api/v1/users/vendors/apply",
            form,
            config,
        );

        return data;
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;

        if (axiosError.response && axiosError.response.data) {
            return thunkAPI.rejectWithValue(axiosError.response.data);
        }

        return thunkAPI.rejectWithValue(axiosError);
    }
});

//get vendor availabilities -- GET

export const getVendorAvailabilities = createAsyncThunk<
    IGetVendorAvailabilitiesResponse,
    { vendorId: string; timeZone: string },
    { rejectValue: ErrorResponse }
>("vendor/availabilities/get", async ({ vendorId, timeZone }, thunkAPI) => {
    try {
        const { data } =
            await axiosInstance.get<IGetVendorAvailabilitiesResponse>(
                `/api/v1/users/vendors/availability-slot?vendorId=${vendorId}&timeZone=${timeZone}`,
            );

        return data;
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;

        if (axiosError.response && axiosError.response.data) {
            return thunkAPI.rejectWithValue(axiosError.response.data);
        }

        return thunkAPI.rejectWithValue(axiosError);
    }
});

//Add vendor availability bulk -- POST

export const addVendorAvailabilityBulk = createAsyncThunk<
    IAddVendorAvailabilityBulkResponse,
    IAddVendorAvailabilityBulkForm,
    { rejectValue: ErrorResponse }
>("vendor/availabilities/bulk-send", async (form, thunkAPI) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } =
            await axiosInstance.post<IGetVendorAvailabilitiesResponse>(
                `/api/v1/users/vendors/availability-slot/add-bulk`,
                form,
                config,
            );

        return data;
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;

        if (axiosError.response && axiosError.response.data) {
            return thunkAPI.rejectWithValue(axiosError.response.data);
        }

        return thunkAPI.rejectWithValue(axiosError);
    }
});
