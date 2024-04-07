import express, {Request} from "express";
import {RequestType, ResponseType} from "./blog-router";
import {SecurityDevicesService} from "../service/SecurityDevicesService";
import {dataRefreshToken} from "../utils/dataRefreshToken";
import {HTTP_STATUSES} from "../utils/httpStatuses";
import {ResultStatus} from "../utils/objectResult";
import {handleErrorObjectResult} from "../utils/handleErrorObjectResult";


export const securityDevicesRouter = express.Router()


securityDevicesRouter.get('/devices', async (req: RequestType<{}, {}, {}>, res: ResponseType<any>) => {


    const resultToken = dataRefreshToken(req)
    //проверемяем токен, если токен не валидный дата не запишется
    if (!resultToken.data) return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZATION_401)
    const result = await SecurityDevicesService.getDevices(resultToken.data.userId)
    if (result.status === ResultStatus.Success) return res.status(HTTP_STATUSES.OK_200).send(result.data)
    return res.send(200)

})

securityDevicesRouter.delete('/devices/:deviceId', async (req: RequestType<any, {}, {}>, res: ResponseType<any>) => {
    const result = await SecurityDevicesService.deleteDeviceById(req.params.deviceId)
    if (result.status === ResultStatus.Success) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return handleErrorObjectResult(result, res)
})
securityDevicesRouter.delete('/devices', async (req: Request, res: ResponseType<any>) => {
    const resultToken = dataRefreshToken(req)
    //проверемяем токен, если токен не валидный дата не запишется
    if (!resultToken.data) return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZATION_401)

    //удаляет все подключенные устройства, кроме с которого делает запрос
    const result = await SecurityDevicesService.deleteAllUserDevices(resultToken.data.userId, resultToken.data.deviceId)
    if (result.status === ResultStatus.Success) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return res.status(HTTP_STATUSES.SOMETHING_WAS_WRONG_500).send('Something was wrong')
})