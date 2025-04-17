//vendor registration form interface
export interface IVendorRegistrationForm {
    fullName: string;
    businessName: string;
    email: string;
    mobileNumber: number;
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
    experience?: string;
    registrationNumber: number;
    proofOfCertification: File | null;
    contactMethod: string;
    availability: string;
}

//vendor registration response interface
export interface IVendorRegistrationResponse {
    success: boolean;
    message?: string;
}

//error response interface
export interface ErrorResponse {
    success?: boolean;
    message: string;
}
export interface availabilitiesArray {
    id: string;
    availableDate: string;
    startTimeUtc: string;
    endTimeUtc: string;
    timeZone: string;
    startTimeLocal: string;
    endTimeLocal: string;
    dayOfWeek: string;
}

//vendor state interface
export interface IVendorState {
    vendorLoading: boolean;
    vendorAvailabilities: {
        currentWeekSlots: availabilitiesArray[];
        nextWeekSlots: availabilitiesArray[];
    };
    vendorMessage: string | null;
    vendorError: string | null;
}

//get vendor availabilities interface
export interface IGetVendorAvailabilitiesResponse {
    success: boolean;
    vendorId: string;
    currentWeekSlots: availabilitiesArray[];
    nextWeekSlots: availabilitiesArray[];
}

export interface IAddVendorAvailabilityBulkResponse {
    success: boolean;
    message?: string;
}

interface ISlots {
    availableDate: string;
    startTime: string;
    endTime: string;
}

export interface IAddVendorAvailabilityBulkForm {
    vendorId?: string;
    timeZone: string;
    slots: ISlots[];
}
