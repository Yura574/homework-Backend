import {NextFunction, Request, Response} from "express";


export const refreshTokenMiddleware = (req: Request, res: Response, next: NextFunction)=> {

    const refreshToken = req.cookies
    return next()
}