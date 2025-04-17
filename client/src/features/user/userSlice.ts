import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadUser, login, signup } from "./userThunks";
import {
    ErrorResponse,
    IUserDashboardResponse,
    IUserLoginResponse,
    IUserSignupResponse,
    IUserState,
} from "../../interfaces/userFeatures";

const initialState: IUserState = {
    user: null,
    loading: false,
    loadingLogin: false,
    isAuthenticated: false,
    message: null,
    error: null,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserMessage: (state) => {
            state.message = null;
        },

        clearUserError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            /*
             *
             login slice
             *
             */
            //login -- pending
            .addCase(login.pending, (state) => {
                state.loadingLogin = true;
                state.error = null;
            })
            //login -- fulfilled
            .addCase(
                login.fulfilled,
                (state, action: PayloadAction<IUserLoginResponse>) => {
                    state.loadingLogin = false;
                    state.isAuthenticated = true;
                    state.user = action.payload.user ?? null;
                    state.error = null;
                },
            )
            //login -- rejected
            .addCase(
                login.rejected,
                (state, action: PayloadAction<ErrorResponse | undefined>) => {
                    state.loadingLogin = false;
                    state.isAuthenticated = false;
                    state.user = null;
                    state.error = action.payload?.message || "Login failed";
                },
            )
            /*
            *
            signup slice
            *
            */
            //signup -- pending
            .addCase(signup.pending, (state) => {
                state.loadingLogin = true;
                state.isAuthenticated = false;
                state.message = null;
                state.error = null;
            })
            //signup -- fulfilled
            .addCase(
                signup.fulfilled,
                (state, action: PayloadAction<IUserSignupResponse>) => {
                    state.loadingLogin = false;
                    state.loading = false;
                    state.isAuthenticated = false;
                    state.message =
                        action.payload?.message ||
                        "Account created successfully";
                },
            )
            //signup -- rejected
            .addCase(
                signup.rejected,
                (state, action: PayloadAction<ErrorResponse | undefined>) => {
                    state.loadingLogin = false;
                    state.loading = false;
                    state.isAuthenticated = false;
                    state.error =
                        action.payload?.message || "Something went wrong";
                },
            )
            /*
            *
            load user
            *
            */
            //load user -- pending
            .addCase(loadUser.pending, (state) => {
                state.loading = true;
                state.message = null;
                state.error = null;
            })
            //load user -- fulfilled
            .addCase(
                loadUser.fulfilled,
                (state, action: PayloadAction<IUserDashboardResponse>) => {
                    state.loading = false;
                    state.isAuthenticated = true;
                    state.user = action.payload.user ?? null;
                    state.error = null;
                },
            )
            //load user -- rejected
            .addCase(loadUser.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
                state.message = null;
            });
    },
});

export const { clearUserMessage, clearUserError } = userSlice.actions;
export default userSlice.reducer;
