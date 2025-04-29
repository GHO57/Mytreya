//error response interface
export interface ErrorResponse {
    success?: boolean;
    message: string;
}

export interface IBookFreeConsultationRequest {
    name: string;
    email: string;
    phoneNumber: number;
    ageGroup: string;
    concern: string;
    goal: string;
    preferredDate: string;
    startTimeUTC: string;
    timeZone: string;
}

export interface IBookFreeConsultationResponse {
    success?: boolean;
    message: string;
}

export interface IClientState {
    clientLoading: boolean;
    clientMessage: string | null;
    clientError: string | null;
    allRecommendedPackages: IRecommendedPackages[];
    pricings: pricings[];
    packageInformation: IRecommendedServices[];
    vendorsByCategory: string[];
}

export interface IRecommendedPackages {
    id?: string;
    userId: string;
    adminUserId: string;
    status?: string;
    notes?: string;
    totalAmount: number;
}

interface pricings {
    id: string;
    serviceName: string;
    price: number;
    description?: string;
    active: boolean;
}

export interface IGetAllRecommendedPackagesForClientResponse {
    success?: boolean;
    recommendedPackages: IRecommendedPackages[];
    pricings: pricings[];
}

export interface IRecommendedServices {
    id?: string;
    pricingId: string;
    monthNumber: number;
    sessionCount: number;
    notes?: string;
}

export interface IGetRecommendedServicesByPackageIdResponse {
    success?: boolean;
    recommendedServices: IRecommendedServices[];
}
