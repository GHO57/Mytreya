import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
    addRecommendedServicesToPackage,
    approveVendorApplications,
    assignExpertToClient,
    getAllClients,
    getAllVendorApplications,
    getAvailableCounsellingAdmins,
    getClientCounsellingRequests,
    getPendingClientRecommendations,
    getRecommendedServicesByPackageId,
    rejectVendorApplications,
} from "./adminThunks";
import {
    IGetAllClientsResponse,
    ErrorResponse,
    IAdminState,
    IGetClientCounsellingRequestsResponse,
    IGetAvailableCounsellingAdminsResponse,
    IAssignExpertToClientResponse,
    IPendingClientRecommendations,
    IAddRecommendedServicesToPackageResponse,
    IGetAllVendorApplicationsResponse,
} from "../../interfaces/adminFeatures";

const initialState: IAdminState = {
    clients: [],
    clientCounsellingRequests: [],
    availableCounsellingAdmins: [],
    pendingRecommendations: [],
    packageInformation: [],
    allServices: [],
    vendorApplications: [],
    adminLoading: false,
    adminMessage: null,
    adminError: null,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearAdminMessage: (state) => {
            state.adminMessage = null;
        },

        clearAdminError: (state) => {
            state.adminError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            //get all clients -- pending
            .addCase(getAllClients.pending, (state) => {
                state.adminLoading = true;
                state.adminMessage = null;
                state.adminError = null;
            })
            //get all clients -- fulfilled
            .addCase(
                getAllClients.fulfilled,
                (state, action: PayloadAction<IGetAllClientsResponse>) => {
                    state.adminLoading = false;
                    state.clients = action.payload.clients || [];
                },
            )
            //get all clients -- rejected
            .addCase(getAllClients.rejected, (state) => {
                state.adminLoading = false;
                state.adminMessage = null;
                state.adminError = null;
            })
            //get all client couselling requests -- pending
            .addCase(getClientCounsellingRequests.pending, (state) => {
                state.adminLoading = true;
                state.adminMessage = null;
                state.adminError = null;
            })
            //get all client couselling requests -- fulfilled
            .addCase(
                getClientCounsellingRequests.fulfilled,
                (
                    state,
                    action: PayloadAction<IGetClientCounsellingRequestsResponse>,
                ) => {
                    state.adminLoading = false;
                    state.clientCounsellingRequests =
                        action.payload.requests || [];
                },
            )
            //get all client couselling requests -- rejected
            .addCase(getClientCounsellingRequests.rejected, (state) => {
                state.adminLoading = false;
                state.adminMessage = null;
                state.adminError = null;
            })

            //get available counselling admins -- pending
            .addCase(getAvailableCounsellingAdmins.pending, (state) => {
                state.adminLoading = true;
                state.adminMessage = null;
                state.adminError = null;
            })
            //get available counselling admins -- fulfilled
            .addCase(
                getAvailableCounsellingAdmins.fulfilled,
                (
                    state,
                    action: PayloadAction<IGetAvailableCounsellingAdminsResponse>,
                ) => {
                    state.adminLoading = false;
                    state.availableCounsellingAdmins =
                        action.payload.availableCounsellingAdmins || [];
                },
            )
            //get available counselling admins -- rejected
            .addCase(getAvailableCounsellingAdmins.rejected, (state) => {
                state.adminLoading = false;
                state.adminMessage = null;
                state.adminError = null;
            })

            //assign expert -- pending
            .addCase(assignExpertToClient.pending, (state) => {
                state.adminLoading = true;
                state.adminMessage = null;
                state.adminError = null;
            })
            //assign expert -- fulfilled
            .addCase(
                assignExpertToClient.fulfilled,
                (
                    state,
                    action: PayloadAction<IAssignExpertToClientResponse>,
                ) => {
                    state.adminLoading = false;
                    state.adminMessage = action.payload.message;
                },
            )
            //assign expert -- rejected
            .addCase(assignExpertToClient.rejected, (state) => {
                state.adminLoading = false;
                state.adminMessage = null;
                state.adminError = null;
            })

            //Get pending client recommendations -- pending
            .addCase(getPendingClientRecommendations.pending, (state) => {
                state.adminLoading = true;
                state.adminMessage = null;
                state.adminError = null;
            })
            //Get pending client recommendations -- fulfilled
            .addCase(
                getPendingClientRecommendations.fulfilled,
                (
                    state,
                    action: PayloadAction<IPendingClientRecommendations>,
                ) => {
                    state.adminLoading = false;
                    state.pendingRecommendations =
                        action.payload.pendingRecommendations || [];
                    state.allServices = action.payload.services || [];
                },
            )
            //Get pending client recommendations -- rejected
            .addCase(getPendingClientRecommendations.rejected, (state) => {
                state.adminLoading = false;
                state.adminMessage = null;
                state.adminError = null;
            })

            //get services by package id -- pending
            .addCase(getRecommendedServicesByPackageId.pending, (state) => {
                state.adminLoading = true;
                state.adminMessage = null;
                state.adminError = null;
            })
            //get all clients -- fulfilled
            .addCase(
                getRecommendedServicesByPackageId.fulfilled,
                (
                    state,
                    action: PayloadAction<{
                        success?: boolean;
                        recommendedServices: string[];
                    }>,
                ) => {
                    state.adminLoading = false;
                    state.packageInformation =
                        action.payload.recommendedServices || [];
                },
            )
            //get all clients -- rejected
            .addCase(getRecommendedServicesByPackageId.rejected, (state) => {
                state.adminLoading = false;
                state.adminMessage = null;
                state.adminError = null;
            })
            //add recommended services -- pending
            .addCase(addRecommendedServicesToPackage.pending, (state) => {
                state.adminLoading = true;
                state.adminMessage = null;
                state.adminError = null;
            })
            //add recommended services -- fulfilled
            .addCase(
                addRecommendedServicesToPackage.fulfilled,
                (
                    state,
                    action: PayloadAction<IAddRecommendedServicesToPackageResponse>,
                ) => {
                    state.adminLoading = false;
                    state.adminMessage =
                        action.payload.message ||
                        "Recommendation saved successfully";
                },
            )
            //add recommended services -- rejected
            .addCase(addRecommendedServicesToPackage.rejected, (state) => {
                state.adminLoading = false;
                state.adminMessage = null;
                state.adminError = null;
            })

            //get all vendor applications -- pending
            .addCase(getAllVendorApplications.pending, (state) => {
                state.adminLoading = true;
                state.adminMessage = null;
                state.adminError = null;
            })
            //get all vendor applications -- fulfilled
            .addCase(
                getAllVendorApplications.fulfilled,
                (
                    state,
                    action: PayloadAction<IGetAllVendorApplicationsResponse>,
                ) => {
                    state.adminLoading = false;
                    state.vendorApplications =
                        action.payload.vendorApplications || [];
                },
            )
            //get all vendor applications -- rejected
            .addCase(getAllVendorApplications.rejected, (state) => {
                state.adminLoading = false;
                state.adminMessage = null;
                state.adminError = null;
            })

            //approve vendor applications -- pending
            .addCase(approveVendorApplications.pending, (state) => {
                state.adminLoading = true;
                state.adminMessage = null;
                state.adminError = null;
            })
            //approve vendor applications -- fulfilled
            .addCase(
                approveVendorApplications.fulfilled,
                (
                    state,
                    action: PayloadAction<{
                        success?: boolean;
                        message: string;
                    }>,
                ) => {
                    state.adminLoading = false;
                    state.adminMessage =
                        action.payload.message || "Approved vendor application";
                },
            )
            //approve vendor applications -- rejected
            .addCase(approveVendorApplications.rejected, (state) => {
                state.adminLoading = false;
                state.adminMessage = null;
                state.adminError = null;
            })

            //reject vendor applications -- pending
            .addCase(rejectVendorApplications.pending, (state) => {
                state.adminLoading = true;
                state.adminMessage = null;
                state.adminError = null;
            })
            //reject vendor applications -- fulfilled
            .addCase(
                rejectVendorApplications.fulfilled,
                (
                    state,
                    action: PayloadAction<{
                        success?: boolean;
                        message: string;
                    }>,
                ) => {
                    state.adminLoading = false;
                    state.adminMessage =
                        action.payload.message || "rejected vendor application";
                },
            )
            //reject vendor applications -- rejected
            .addCase(rejectVendorApplications.rejected, (state) => {
                state.adminLoading = false;
                state.adminMessage = null;
                state.adminError = null;
            });
    },
});

export const { clearAdminError, clearAdminMessage } = adminSlice.actions;

export default adminSlice.reducer;
