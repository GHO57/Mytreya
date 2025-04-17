import { Request } from "express";

//add service interface -- POST
export interface IAddServiceRequestBody {
    serviceName: string;
    price: number;
    description: string;
}

//create new package for client
export interface ICreateNewPackageRequest extends Request {
    user?: {
        id: string;
    };
    body: {
        userId: string;
        notes?: string;
    };
}

export interface IServiceRecord {
    pricingId: string;
    monthNumber: number;
    sessionCount: number;
    notes?: string;
}

//add recommended services for client interface -- POST
export interface IAddRecommendedServices extends Request {
    body: {
        userId: string;
        packageId: string;
        services: IServiceRecord[];
    };
    user?: {
        id?: string;
    };
}

//get recommened packages by client id interface -- GET
export interface IGetRecommendedPackagesByUserId extends Request {
    user?: {
        id: string;
    };
    params: {
        userId: string;
    };
}

//get recommended packages by package id interface -- get
export interface IGetRecommendedServicesByPackageId {
    packageId: string;
}

//get recommended services for client interface -- GET
export interface IGetRecommendedPackagesForClient extends Request {
    user?: {
        id: string;
    };
}

//confirm services after payment interface -- POST
export interface IConfirmPackageRequest extends Request {
    user?: {
        id: string;
    };
    params: {
        packageId: string;
    };
}
