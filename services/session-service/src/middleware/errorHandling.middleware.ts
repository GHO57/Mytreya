import errorHandler from "../utils/errorHandler.utils";
import { Request, Response, NextFunction } from "express";

const errorHandlingMiddleware = (
    err: errorHandler,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    let message: string = err.message || "Internal Server Error";
    let statusCode: number = err.statusCode || 500;

    //JWT Expire Error
    if (err.name === "TokenExpiredError") {
        message = "JWT has been expired. Try Again.";
        err = new errorHandler(message, 404);
    }

    //Wrong JWT Error
    if (err.name === "JsonWebTokenError") {
        message = "JWT is invalid. Try Again.";
        err = new errorHandler(message, 404);
    }

    res.status(statusCode).json({
        success: false,
        message: message,
    });
};

export default errorHandlingMiddleware;
