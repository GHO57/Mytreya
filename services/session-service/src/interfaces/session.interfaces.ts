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
