import {NextFunction, Request, Response} from "express";


export const refreshTokenMiddleware = (req: Request, res: Response, next: NextFunction)=> {

    const refreshToken = req.cookies
    console.log(refreshToken)
    return next()
}