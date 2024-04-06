import express from "express";
import {ParamsType, RequestType, ResponseType} from "./blog-router";
import {SecurityDevicesService} from "../service/SecurityDevicesService";
import jwt from "jsonwebtoken";


export const securityDevicesRouter = express.Router()



securityDevicesRouter.get('/devices', async (req: RequestType<{}, {}, {}>, res: ResponseType<any>)=> {

    const token = req.cookies.refreshToken.refreshToken
    try {
        const dataToken: any = jwt.verify(token, process.env.REFRESH_SECRET as string)
        const result = await SecurityDevicesService.getDevices(dataToken.userId)
return res.send(200)
    } catch (e) {
        return res.send(400)
    }
    //
})

securityDevicesRouter.delete('devices/:deviceId', async (req: RequestType<any, { }, {}>, res: ResponseType<any>)=> {

})
securityDevicesRouter.delete('devices/:deviceId', async (req: RequestType<any, { }, {}>, res: ResponseType<any>)=> {

})