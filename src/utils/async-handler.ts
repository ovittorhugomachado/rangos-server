import { RequestHandler } from 'express';

export const asyncHandler = <P, ResBody, ReqBody, ReqQuery>(
    fn: (req: import('express').Request<P, ResBody, ReqBody, ReqQuery>,
        res: import('express').Response<ResBody>,
        next: import('express').NextFunction) => Promise<any>
): RequestHandler<P, ResBody, ReqBody, ReqQuery> => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};