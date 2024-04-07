import jwt from "jsonwebtoken";

import {Request} from 'express'
import {ObjectResult, ResultStatus} from "./objectResult";


export const dataRefreshToken = (req: Request): ObjectResult<{userId: string, deviceId: string, exp: string, iat: string} | null>=> {
    try {
        const dataToken: any= jwt.verify(req.cookies.refreshToken.refreshToken, process.env.REFRESH_SECRET as string)
        return {status: ResultStatus.Success, data: {...dataToken}}
    } catch (e) {
        return {status: ResultStatus.Forbidden, data: null}

    }

}