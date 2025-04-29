/*
*
admin thunks related interfaces
*
*/

interface IClients {
    email: string;
    fullName: string;
    Role?: {
        roleName: string;
    };
    Client?: {
        id: string;
        userId: string;
        mobileNumber: number | null;
        age: number | null;
        gender: string | null;
        pincode: number | null;
        preferredLanguages?: string[];
        isDeleted: boolean;
    };
}

interface IRequests {
    email: string;
    fullName: string;
    requests?: {
        id: string;
        userId: string;
        mobileNumber: string;
        ageGroup: string;
        concern: string;
        goal: string;
        preferredDate: string;
        startTimeUtc: string;
    };
}

//get all clients interface -- GET
export interface IGetAllClientsResponse {
    success?: boolean;
    clients: IClients[];
}

//get all client counselling request
export interface IGetClientCounsellingRequestsResponse {
    success?: boolean;
    requests: IRequests[];
}

interface IGetAdmins {
    id: string;
    userId?: string;
    vendorId?: string;
    adminUserId?: string;
    pricingId?: string;
    recommendedServiceId?: string;
    sessionDate?: string;
    startTimeUtc?: string;
    endTimeUtc?: string;
    status?: string;
    customerJoinTimeUtc?: string;
    vendorJoinTimeUtc?: string;
    vendorLastActiveUtc?: string;
}

//get available counselling admins respone
export interface IGetAvailableCounsellingAdminsResponse {
    success?: boolean;
    availableCounsellingAdmins: IGetAdmins[];
}

//get available counselling admins request
export interface IGetAvailableCounsellingAdminsRequest {
    preferredDate: string;
}

//error response interface
export interface ErrorResponse {
    success?: boolean;
    message: string;
}

/*admin redux slice related interfaces */

export interface IAdminState {
    adminLoading: boolean;
    adminMessage: string | null;
    adminError: string | null;
    clients: IClients[];
    clientCounsellingRequests: IRequests[];
    availableCounsellingAdmins: string[];
    pendingRecommendations: pendingRecommendations[];
    packageInformation: IRecommendedServices[];
    allServices: pricings[];
    vendorApplications: IVendorApplications[];
}

//assign expert to client interface
export interface IAssignExpertToClientResponse {
    success?: boolean;
    message: string;
}

//assign expert to client request
export interface IAssignExpertToClientRequest {
    userId: string;
    adminUserId: string;
    sessionDate: string;
    startTimeUTC: string;
    timeZone: string;
}

interface pricings {
    id: string;
    serviceName: string;
    price: number;
    description?: string;
    active: boolean;
}

interface pendingRecommendations {
    id: string;
    userId: string;
    adminUserId: string;
    status: string;
    notes?: string;
    totalAmount: number;
}

export interface IPendingClientRecommendations {
    success?: boolean;
    pendingRecommendations: pendingRecommendations[];
    services: pricings[];
}

export interface IGetRecommendedServicesByPackageIdRequest {
    packageId: string;
}

export interface IGetRecommendedServicesByPackageIdResponse {
    success?: boolean;
    recommendedServices: IRecommendedServices[];
}

export interface IAddRecommendedServicesToPackageResponse {
    success?: boolean;
    message: string;
}

export interface IRecommendedServices {
    id?: string;
    pricingId: string;
    monthNumber: number;
    sessionCount: number;
    notes?: string;
}

export interface IAddRecommendedServicesToPackageRequest {
    packageId: string;
    services: IRecommendedServices[];
}

export interface IVendorApplications {
    id?: string;
    fullName: string;
    email: string;
    mobileNumber: number;
    businessName: string;
    pincode: number;
    state: string;
    city: string;
    completeAddress: string;
    category: string;
    qualifications: string;
    certificationName?: string;
    issuingAuthority?: string;
    certificationNumber?: number;
    expirationDate?: string;
    experience?: number;
    registrationNumber: number;
    proofOfCertificationUrl: string;
    contactMethod: string;
    availability: string;
    description?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface IGetAllVendorApplicationsResponse {
    success?: boolean;
    count: number;
    vendorApplications: IVendorApplications[];
}

export interface IGetAllVendorApplicationsRequest {
    status?: string;
}
