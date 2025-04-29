import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getVendorAvailabilities, vendorRegistration } from "./vendorThunks";
import {
    ErrorResponse,
    IGetVendorAvailabilitiesResponse,
    IVendorRegistrationResponse,
    IVendorState,
} from "../../interfaces/vendorFeatures";

const initialState: IVendorState = {
    vendorLoading: false,
    vendorAvailabilities: {
        currentWeekSlots: [],
        nextWeekSlots: [],
    },
    vendorMessage: null,
    vendorError: null,
};

const vendorSlice = createSlice({
    name: "vendor",
    initialState,
    reducers: {
        clearVendorMessage: (state) => {
            state.vendorMessage = null;
        },

        clearVendorError: (state) => {
            state.vendorError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            //vendorRegistration -- pending
            .addCase(vendorRegistration.pending, (state) => {
                state.vendorLoading = true;
                state.vendorMessage = null;
                state.vendorError = null;
            })
            //vendorRegistration -- fulfilled
            .addCase(
                vendorRegistration.fulfilled,
                (state, action: PayloadAction<IVendorRegistrationResponse>) => {
                    state.vendorLoading = false;
                    state.vendorMessage =
                        action.payload?.message ||
                        "Application submitted successfully";
                },
            )
            //vendorRegistration -- rejected
            .addCase(
                vendorRegistration.rejected,
                (state, action: PayloadAction<ErrorResponse | undefined>) => {
                    state.vendorLoading = false;
                    state.vendorError =
                        action.payload?.message || "Something went wrong";
                },
            )

            //get vendor availabilities -- pending
            .addCase(getVendorAvailabilities.pending, (state) => {
                state.vendorLoading = true;
                state.vendorMessage = null;
                state.vendorError = null;
            })
            //get vendor availabilities -- fulfilled
            .addCase(
                getVendorAvailabilities.fulfilled,
                (
                    state,
                    action: PayloadAction<IGetVendorAvailabilitiesResponse>,
                ) => {
                    state.vendorLoading = false;
                    state.vendorAvailabilities.currentWeekSlots =
                        action.payload.currentWeekSlots || [];
                    state.vendorAvailabilities.nextWeekSlots =
                        action.payload.nextWeekSlots || [];
                },
            )
            //get vendor availabilities -- rejected
            .addCase(getVendorAvailabilities.rejected, (state) => {
                state.vendorLoading = false;
            });
    },
});

export const { clearVendorMessage, clearVendorError } = vendorSlice.actions;
export default vendorSlice.reducer;
