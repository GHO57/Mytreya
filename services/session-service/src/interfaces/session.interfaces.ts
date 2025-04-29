import { Request } from "express";

//assign client with vendor interface -- POST
export interface IAssignClientWithAdminRequest extends Request {
    body: {
        userId?: string;
        adminUserId?: string;
        sessionDate: string;
        startTimeUTC: string;
        timeZone: string;
    };
}

interface session {
    vendorId?: string;
    adminUserId?: string;
    recommendedServiceId?: string;
    pricingId?: string;
    sessionDate: string;
    startTime: string;
    endTime: string;
}

//create client session with vendor in bulk interface -- POST
export interface ICreateClientSessionsInBulkRequest extends Request {
    user?: {
        id: string;
    };
    body: {
        sessions: session[];
        timeZone: string;
    };
}

//confirm sessions interface -- POST
export interface IConfirmSessionsRequest extends Request {
    user?: {
        id: string;
    };
    body: {
        sessionIds: string[];
        timeZone: string;
    };
}

//get all client sessions interface -- POST
export interface IGetAllClientSessions extends Request {
    user?: {
        id: string;
    };
}

//get all vendor sessions interface -- POST
export interface IGetAllVendorSessions extends Request {
    user?: {
        id: string;
    };
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

//get client counselling request interface -- GET
export interface IGetClientConsultationRequests extends Request {
    user?: {
        id: string;
    };
}

//book consultation session interface -- POST

export interface IBookConsultationSessionRequest extends Request {
    body: {
        name: string;
        email: string;
        phoneNumber: number;
        ageGroup: string;
        concern: string;
        goal: string;
        preferredDate: string;
        startTime: string;
        timeZone: string;
    };
    user?: {
        id: string;
    };
}
