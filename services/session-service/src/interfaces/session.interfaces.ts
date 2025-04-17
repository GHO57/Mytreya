import { Request } from "express";

//create client session with vendor interface -- POST
export interface ICreateClientSessionRequest extends Request {
    user?: {
        id: string;
    };
    body: {
        vendorId: string;
        sessionDate: string;
        startTime: string;
        endTime: string;
        timeZone: string;
    };
}

interface session {
    vendorId: string;
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
