import { Request } from "express";
import { User } from "../models";

//client onboarding interface -- POST
export interface IClientOnboardRequestBody extends Request {
    body: {
        mobileNumber: number;
        age: number;
        gender: string;
        pincode: number;
        preferredLanguages: string[];
    };
    user?: {
        id: string;
        roleId: string;
    };
}
