import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";
import axiosInstance from "../axiosInstance";
import {
    ErrorResponse,
    IUserDashboardResponse,
    IUserLoginForm,
    IUserLoginResponse,
    IUserSignupForm,
    IUserSignupResponse,
} from "../../interfaces/userFeatures";

//login -- POST

export const login = createAsyncThunk<
    IUserLoginResponse,
    IUserLoginForm,
    { rejectValue: ErrorResponse }
>("user/login", async (form: IUserLoginForm, thunkAPI) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axiosInstance.post<IUserLoginResponse>(
            "/api/v1/users/auth/login",
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

//signup -- POST

export const signup = createAsyncThunk<
    IUserSignupResponse,
    IUserSignupForm,
    { rejectValue: ErrorResponse }
>("user/signup", async (form: IUserSignupForm, thunkAPI) => {
    try {
        const config = { headers: { "Content-Type": "application/json" } };
        const { data } = await axiosInstance.post<IUserSignupResponse>(
            "/api/v1/users/auth/signup",
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

//load user -- POST

export const loadUser = createAsyncThunk<
    IUserDashboardResponse,
    void,
    { rejectValue: ErrorResponse }
>("user/dashboard", async (_, thunkAPI) => {
    try {
        const { data } = await axiosInstance.get<IUserDashboardResponse>(
            "/api/v1/users/auth/dashboard",
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
