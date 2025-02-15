import { CookieOptions, Response } from "express";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

/*
*
Interfaces
*
*/

//jwt payload interface
interface IJWTPayload {
    id?: string; //user id
}

/*
*
secret keys & expiry variables
*
*/

//access token secret key
const ACCESS_TOKEN_SECRET: Secret = process.env.JWT_ACCESS_SECRET as Secret;

//refresh token secret key
const REFRESH_TOKEN_SECRET: Secret = process.env.JWT_REFRESH_SECRET as Secret;

//access token expiry duration
const ACCESS_TOKEN_EXPIRY: string = process.env.JWT_ACCESS_EXPIRY ?? "1h";

//refresh token expiry duration
const REFRESH_TOKEN_EXPIRY: string = process.env.JWT_REFRESH_EXPIRY ?? "7d";

/*
*
signing functions
*
*/

//access token signing function
const signAccessToken = (
    payload: IJWTPayload,
    expiresIn: string = ACCESS_TOKEN_EXPIRY,
): string => {
    return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn } as SignOptions);
};

//refresh token signing token
const signRefreshToken = (
    payload: IJWTPayload,
    expiresIn: string = REFRESH_TOKEN_EXPIRY,
): string => {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
        expiresIn,
    } as SignOptions);
};

//sign new access token with refresh token
const signNewAccessToken = (
    refreshToken: string,
    expiresIn: string = ACCESS_TOKEN_EXPIRY,
): string | null => {
    try {
        const decoded = jwt.verify(
            refreshToken,
            REFRESH_TOKEN_SECRET,
        ) as JwtPayload;

        if (!decoded.id) {
            return null;
        }

        const newAccessToken = jwt.sign(
            { id: decoded.id } as IJWTPayload,
            ACCESS_TOKEN_SECRET,
            {
                expiresIn,
            } as SignOptions,
        );

        return newAccessToken;
    } catch (error) {
        return null;
    }
};

//set auth cookies
const setAuthCookies = (
    res: Response,
    accessToken: string,
    refreshToken: string,
) => {
    const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "production" ? false : true,
        sameSite: "strict",
    };

    res.cookie("auth_access_mytreya", accessToken, {
        ...cookieOptions,
        maxAge: 15 * 60 * 1000, // 15 minutes
    });
    res.cookie("auth_refresh_mytreya", refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: "/refresh",
    });
};

//set new access cookie
const setNewAuthCookie = (res: Response, accessToken: string) => {
    const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "production" ? false : true,
        sameSite: "strict",
    };

    res.cookie("auth_access_mytreya", accessToken, cookieOptions);
};

export {
    signAccessToken,
    signRefreshToken,
    signNewAccessToken,
    setAuthCookies,
    setNewAuthCookie,
};
