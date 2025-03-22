import { Request } from "express";

//vendor application interface -- POST
export interface IVendorApplicationRequestBody extends Request {
    body: {
        fullName: string;
        email: string;
        mobileNumber: string;
        businessName: string;
        pincode: number;
        state: string;
        city: string;
        completeAddress: string;
        category: string;
        qualifications: string;
        certificationName: string;
        issuingAuthority: string;
        certificationNumber: number;
        expirationDate: string;
        experience: number;
        registrationNumber: number;
        contactMethod: string;
        availability: string;
    };
    file?: Express.Multer.File;
}

//localtime to utc interface
export interface ILocalTimeToUTCInterface {
    date: string;
    time: string;
    timeZone: string;
}

//utc to localtime to utc interface
export interface IUTCToLocalTimeInteface {
    dateTime: string;
    timeZone: string;
}

//add vendor availability interface -- POST
export interface IAddVendorAvailabilitySlotRequestBody {
    vendorId: string;
    availableDate: string;
    startTime: string;
    endTime: string;
    timeZone: string;
}

//remove vendor availability interface -- POST
export interface IRemoveVendorAvailabilitySlotRequestBody {
    slotId: string;
    timeZone: string;
}

//view all vendor availability slots interface -- GET
export interface IViewAllAvailabilitySlotsRequestParams {
    vendorId: string;
}
