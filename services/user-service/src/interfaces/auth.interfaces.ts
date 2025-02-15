import { Request } from "express";
import { User } from "../models";

//signup user interface -- REQUEST
export interface ISignupUserRequestBody {
    fullName: string;
    email: string;
    password: string;
    mobileNumber: number;
}

//login user interface -- REQUEST
export interface ILoginUserRequestBody {
    email: string;
    password: string;
}

//new access token interface -- REQUEST
export interface IRefreshAccessTokenRequestBody {
    // auth_refresh_mytreya: string;
    cookies: {
        auth_refresh_mytreya?: string;
    };
}

/*
*
*
Middleware related interfaces
*
*/

//jwt verification interface -- MIDDLEWARE
export interface IIsAuthenticatedRequest extends Request {
    cookies: {
        auth_access_mytreya?: string;
        auth_refresh_mytreya?: string;
    };
    user?: User;
}

//check permission interface -- MIDDLEWARE
export interface ICheckPermissionRequest extends Request {
    user?: {
        roleId?: string;
    };
}
