import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import {
    ErrorResponse,
    IAddRecommendedServicesToPackageRequest,
    IAddRecommendedServicesToPackageResponse,
    IAssignExpertToClientRequest,
    IAssignExpertToClientResponse,
    IGetAllClientsResponse,
    IGetAllVendorApplicationsRequest,
    IGetAllVendorApplicationsResponse,
    IGetAvailableCounsellingAdminsRequest,
    IGetAvailableCounsellingAdminsResponse,
    IGetClientCounsellingRequestsResponse,
    IGetRecommendedServicesByPackageIdRequest,
    IGetRecommendedServicesByPackageIdResponse,
    IPendingClientRecommendations,
} from "../../interfaces/adminFeatures";
import { IGetVendorAvailabilitiesResponse } from "../../interfaces/vendorFeatures";

//get all clients

export const getAllClients = createAsyncThunk<
    IGetAllClientsResponse,
    void,
    { rejectValue: ErrorResponse }
>("admin/clients/get", async (_, thunkAPI) => {
    try {
        const { data } = await axiosInstance.get<IGetAllClientsResponse>(
            "/api/v1/users/admins/clients",
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

//get client counselling requests
export const getClientCounsellingRequests = createAsyncThunk<
    IGetClientCounsellingRequestsResponse,
    void,
    { rejectValue: ErrorResponse }
>("admin/counselling-requests/get", async (_, thunkAPI) => {
    try {
        const { data } =
            await axiosInstance.get<IGetClientCounsellingRequestsResponse>(
                "/api/v1/sessions/admin/client-requests",
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

//get available counselling admins
export const getAvailableCounsellingAdmins = createAsyncThunk<
    IGetAvailableCounsellingAdminsResponse,
    IGetAvailableCounsellingAdminsRequest,
    { rejectValue: ErrorResponse }
>(
    "admin/available-counselling-admins/get",
    async ({ preferredDate }, thunkAPI) => {
        try {
            const { data } =
                await axiosInstance.get<IGetAvailableCounsellingAdminsResponse>(
                    `/api/v1/sessions/admin/counselling-admins?date=${preferredDate}`,
                );

            return data;
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>;

            if (axiosError.response && axiosError.response.data) {
                return thunkAPI.rejectWithValue(axiosError.response.data);
            }

            return thunkAPI.rejectWithValue(axiosError);
        }
    },
);

//assign expert to client
export const assignExpertToClient = createAsyncThunk<
    IAssignExpertToClientResponse,
    IAssignExpertToClientRequest,
    { rejectValue: ErrorResponse }
>("admin/assign-expert", async (form, thunkAPI) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } =
            await axiosInstance.post<IAssignExpertToClientResponse>(
                `/api/v1/sessions/admin/assign-expert`,
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

//get pending client recommendatiions
export const getPendingClientRecommendations = createAsyncThunk<
    IPendingClientRecommendations,
    void,
    { rejectValue: ErrorResponse }
>("admin/packages/recommended/pending", async (_, thunkAPI) => {
    try {
        const { data } = await axiosInstance.get<IPendingClientRecommendations>(
            `/api/v1/pricings/admin/packages/pending`,
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
>("admin/packages/services", async ({ packageId }, thunkAPI) => {
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

//add recommended services to the package
export const addRecommendedServicesToPackage = createAsyncThunk<
    IAddRecommendedServicesToPackageResponse,
    IAddRecommendedServicesToPackageRequest,
    { rejectValue: ErrorResponse }
>("admin/packages/services/add", async (form, thunkAPI) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } =
            await axiosInstance.post<IAddRecommendedServicesToPackageResponse>(
                `/api/v1/pricings/admin/services/recommended/create`,
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

//get all vendor applications
export const getAllVendorApplications = createAsyncThunk<
    IGetAllVendorApplicationsResponse,
    IGetAllVendorApplicationsRequest,
    { rejectValue: ErrorResponse }
>("vendor/applications/get", async ({ status }, thunkAPI) => {
    try {
        const { data } =
            await axiosInstance.get<IGetAllVendorApplicationsResponse>(
                `/api/v1/users/admins/vendor-applications?status=${status}`,
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

//approve vendor applications
export const approveVendorApplications = createAsyncThunk<
    { success?: boolean; message: string },
    { vendor_application_id: string },
    { rejectValue: ErrorResponse }
>(
    "vendor/applications/approve",
    async ({ vendor_application_id }, thunkAPI) => {
        try {
            const config = { headers: { "Content-Type": "application/json" } };
            const { data } = await axiosInstance.post<{
                success?: boolean;
                message: string;
            }>(
                `/api/v1/users/admins/vendor-applications/approve`,
                { vendor_application_id },
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
    },
);

//reject vendor applications
export const rejectVendorApplications = createAsyncThunk<
    { success?: boolean; message: string },
    { vendor_application_id: string },
    { rejectValue: ErrorResponse }
>("vendor/applications/reject", async ({ vendor_application_id }, thunkAPI) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axiosInstance.post<{
            success?: boolean;
            message: string;
        }>(
            `/api/v1/users/admins/vendor-applications/reject`,
            { vendor_application_id },
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
