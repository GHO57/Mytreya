import { Request } from "express";

//check for valid vendor interface -- GET
export interface IValidVendorRequestParams {
    vendorId: string;
}

//check for valid user interface -- GET
export interface IValidUserRequestParams {
    userId: string;
}

//check whether vendor is available or not interface -- POST
export interface IIsVendorAvailableRequestBody {
    vendorId: string;
    date: string;
    startTimeUTC: string;
    endTimeUTC: string;
}
