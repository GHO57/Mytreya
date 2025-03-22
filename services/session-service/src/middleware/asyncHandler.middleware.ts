import { Request, Response, NextFunction } from "express";

const asyncHandler = <
    P = Record<string, any>,
    ResBody = any,
    ReqBody = any,
    ReqQuery = any,
>(
    Func: (
        req: Request<P, ResBody, ReqBody, ReqQuery>,
        res: Response,
        next: NextFunction,
    ) => Promise<any>,
) => {
    return (
        req: Request<P, ResBody, ReqBody, ReqQuery>,
        res: Response,
        next: NextFunction,
    ): void => {
        Promise.resolve(Func(req, res, next)).catch(next);
    };
};

export default asyncHandler;
