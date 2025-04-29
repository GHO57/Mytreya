import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import {
    ErrorResponse,
    IBookFreeConsultationRequest,
    IBookFreeConsultationResponse,
    IGetAllRecommendedPackagesForClientResponse,
    IGetRecommendedServicesByPackageIdResponse,
} from "../../interfaces/clientFeatures";
import { IGetRecommendedServicesByPackageIdRequest } from "../../interfaces/adminFeatures";

//book free consultation -- POST
export const bookFreeConsultation = createAsyncThunk<
    IBookFreeConsultationResponse,
    IBookFreeConsultationRequest,
    { rejectValue: ErrorResponse }
>("client/book-free-consultation", async (form, thunkAPI) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } =
            await axiosInstance.post<IBookFreeConsultationResponse>(
                "/api/v1/sessions/client/book-consultation",
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

//get all recommended packages for client
export const getAllRecommendedPackagesForClient = createAsyncThunk<
    IGetAllRecommendedPackagesForClientResponse,
    void,
    { rejectValue: ErrorResponse }
>("client/recommended-packages", async (_, thunkAPI) => {
    try {
        const { data } =
            await axiosInstance.get<IGetAllRecommendedPackagesForClientResponse>(
                "/api/v1/pricings/client/packages/recommended",
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

//get recommended services by user id
export const getRecommendedServicesByPackageId = createAsyncThunk<
    IGetRecommendedServicesByPackageIdResponse,
    IGetRecommendedServicesByPackageIdRequest,
    { rejectValue: ErrorResponse }
>("client/packages/services", async ({ packageId }, thunkAPI) => {
    try {
        const { data } =
            await axiosInstance.get<IGetRecommendedServicesByPackageIdResponse>(
                `/api/v1/pricings/packages/${packageId}`,
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

//get vendors by category
export const getVendorByCategory = createAsyncThunk<
    { success?: boolean; vendors: string[] },
    { category?: string },
    { rejectValue: ErrorResponse }
>("client/vendor-by-category", async ({ category }, thunkAPI) => {
    try {
        const { data } = await axiosInstance.get<{
            success?: boolean;
            vendors: string[];
        }>(`/api/v1/users/vendors?category=${category}`);

        return data;
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;

        if (axiosError.response && axiosError.response.data) {
            return thunkAPI.rejectWithValue(axiosError.response.data);
        }

        return thunkAPI.rejectWithValue(axiosError);
    }
});
