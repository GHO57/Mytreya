import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    bookFreeConsultation,
    getAllRecommendedPackagesForClient,
    getRecommendedServicesByPackageId,
    getVendorByCategory,
} from "./clientThunks";
import {
    ErrorResponse,
    IBookFreeConsultationResponse,
    IClientState,
    IGetAllRecommendedPackagesForClientResponse,
    IGetRecommendedServicesByPackageIdResponse,
} from "../../interfaces/clientFeatures";

const initialState: IClientState = {
    allRecommendedPackages: [],
    pricings: [],
    packageInformation: [],
    vendorsByCategory: [],
    clientLoading: false,
    clientMessage: null,
    clientError: null,
};

const clientSlice = createSlice({
    name: "client",
    initialState,
    reducers: {
        clearClientMessage: (state) => {
            state.clientMessage = null;
        },

        clearClientError: (state) => {
            state.clientError = null;
        },
    },
    extraReducers: (builder) => {
        builder

            //bookFreeConsultation -- pending
            .addCase(bookFreeConsultation.pending, (state) => {
                state.clientLoading = true;
                state.clientMessage = null;
                state.clientError = null;
            })
            //bookFreeConsultation -- fulfilled
            .addCase(
                bookFreeConsultation.fulfilled,
                (
                    state,
                    action: PayloadAction<IBookFreeConsultationResponse>,
                ) => {
                    state.clientLoading = false;
                    state.clientMessage = action.payload.message;
                },
            )
            //bookFreeConsultation -- rejected
            .addCase(
                bookFreeConsultation.rejected,
                (state, action: PayloadAction<ErrorResponse | undefined>) => {
                    state.clientLoading = false;
                    state.clientError =
                        action.payload?.message || "Something went wrong";
                },
            )

            //get all recommended packages for client -- pending
            .addCase(getAllRecommendedPackagesForClient.pending, (state) => {
                state.clientLoading = true;
                state.clientMessage = null;
                state.clientError = null;
            })
            //get all recommended packages -- fulfilled
            .addCase(
                getAllRecommendedPackagesForClient.fulfilled,
                (
                    state,
                    action: PayloadAction<IGetAllRecommendedPackagesForClientResponse>,
                ) => {
                    state.clientLoading = false;
                    state.pricings = action.payload.pricings;
                    state.allRecommendedPackages =
                        action.payload.recommendedPackages;
                },
            )
            //get all recommended packages -- rejected
            .addCase(
                getAllRecommendedPackagesForClient.rejected,
                (state, action: PayloadAction<ErrorResponse | undefined>) => {
                    state.clientLoading = false;
                    state.clientError =
                        action.payload?.message || "Something went wrong";
                },
            )
            //get package information -- pending
            .addCase(getRecommendedServicesByPackageId.pending, (state) => {
                state.clientLoading = true;
                state.clientMessage = null;
                state.clientError = null;
            })
            //get package information -- fulfilled
            .addCase(
                getRecommendedServicesByPackageId.fulfilled,
                (
                    state,
                    action: PayloadAction<IGetRecommendedServicesByPackageIdResponse>,
                ) => {
                    state.clientLoading = false;
                    state.packageInformation =
                        action.payload.recommendedServices;
                },
            )
            //get package information -- rejected
            .addCase(
                getRecommendedServicesByPackageId.rejected,
                (state, action: PayloadAction<ErrorResponse | undefined>) => {
                    state.clientLoading = false;
                    state.clientError =
                        action.payload?.message || "Something went wrong";
                },
            )

            //get vendors by category -- pending
            .addCase(getVendorByCategory.pending, (state) => {
                state.clientLoading = true;
                state.clientMessage = null;
                state.clientError = null;
            })
            //get vendors by category -- fulfilled
            .addCase(
                getVendorByCategory.fulfilled,
                (
                    state,
                    action: PayloadAction<{
                        success?: boolean;
                        vendors: string[];
                    }>,
                ) => {
                    state.clientLoading = false;
                    state.vendorsByCategory = action.payload.vendors;
                },
            )
            //get vendors by category -- rejected
            .addCase(
                getVendorByCategory.rejected,
                (state, action: PayloadAction<ErrorResponse | undefined>) => {
                    state.clientLoading = false;
                    state.clientError =
                        action.payload?.message || "Something went wrong";
                },
            );
    },
});

export const { clearClientMessage, clearClientError } = clientSlice.actions;

export default clientSlice.reducer;
