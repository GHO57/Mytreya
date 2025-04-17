/*
*
user thunks related interfaces
*
*/

//user login form interface -- POST
export interface IUserLoginForm {
    email: string;
    password: string;
}

//user login form response interface -- POST
export interface IUserLoginResponse {
    success: boolean;
    user?: {
        id: string;
        roleId: string;
        email: string;
        isDeleted: boolean;
        roleName: string;
    };
}

//user signup form interface -- POST
export interface IUserSignupForm {
    fullName: string;
    email: string;
    password: string;
}

//user signup form response interface -- POST
export interface IUserSignupResponse {
    success?: boolean;
    message: string;
    user?: {
        id: string;
        roleId: string;
        email: string;
        password?: string;
        isDeleted: boolean;
        updatedAt?: string;
        createdAt?: string;
    };
}

//user dashboard response interface -- GET
export interface IUserDashboardResponse {
    success?: boolean;
    user?: {
        id: string;
        userId: string;
        age: number;
        gender: string;
        pincode: number;
        preferredLanguages: string[];
        mobileNumber: number;
        fullName: string;
        email: string;
        roleId: string;
        onBoarded: boolean;
        isDeleted: boolean;
        roleName: string;
    };
}

//error response interface
export interface ErrorResponse {
    success?: boolean;
    message: string;
}

/*
*
user slice related interfaces
*
*/

//user interface
export interface IUser {
    id: string;
    roleId: string;
    email: string;
    isDeleted: boolean;
    roleName: string;
    fullName?: string;
}

//user slice interface
export interface IUserState {
    user: IUser | null;
    loading: boolean;
    loadingLogin: boolean;
    isAuthenticated: boolean;
    message: string | null;
    error: string | null;
}
