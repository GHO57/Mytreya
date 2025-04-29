import { Request } from "express";

/*
*
*
Middleware related interfaces
*
*
*/

//jwt verification interface -- MIDDLEWARE
export interface IIsAuthenticatedRequest extends Request {
    cookies: {
        auth_access_mytreya?: string;
        auth_refresh_mytreya?: string;
    };
    user?: {
        id: string;
        roleId: string;
    };
}

//check permission interface -- MIDDLEWARE
export interface ICheckPermissionRequest extends Request {
    user?: {
        roleId: string;
    };
}
