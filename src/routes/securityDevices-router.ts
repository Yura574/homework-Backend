import express, {Request, Response} from "express";
import {ParamsType, RequestType, ResponseType} from "./blog-router";
import {SecurityDevicesService} from "../service/SecurityDevicesService";
import {getDataRefreshToken} from "../utils/getDataRefreshToken";
import {HTTP_STATUSES} from "../utils/httpStatuses";
import {ResultStatus} from "../utils/objectResult";
import {handleErrorObjectResult} from "../utils/handleErrorObjectResult";


export const securityDevicesRouter = express.Router()


securityDevicesRouter.get('/devices', async (req: RequestType<{}, {}, {}>, res: ResponseType<any>) => {


    const resultToken = getDataRefreshToken(req)

    //проверемяем токен, если токен не валидный дата не запишется

    if (!resultToken.data) return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZATION_401)
    const device = await SecurityDevicesService.getDeviceById(resultToken.data.deviceId)
    if (device.status !== ResultStatus.Success) return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZATION_401)
    const result = await SecurityDevicesService.getDevices(resultToken.data.userId)
    if (result.status === ResultStatus.Success) return res.status(HTTP_STATUSES.OK_200).send(result.data)
    return res.send(200)

})
securityDevicesRouter.get('/devices/:id', async (req: RequestType<ParamsType, any, any>, res: Response) => {
    console.log('starts')
    const result = await SecurityDevicesService.getDeviceById(req.params.id)
    if (result.status === ResultStatus.Success) return res.status(HTTP_STATUSES.OK_200).send(result.data)
    return handleErrorObjectResult(result, res)
})

securityDevicesRouter.delete('/devices/:deviceId', async (req: RequestType<any, {}, {}>, res: ResponseType<any>) => {
    // const resultToken = await SecurityDevicesService.getDeviceById(req.params.deviceId)
    const deviceId = req.params.deviceId
    if(!deviceId) return res.sendStatus((HTTP_STATUSES.NOT_FOUND_404))
    const resultToken = getDataRefreshToken(req)
    if (!resultToken.data) return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZATION_401)

    const device = await SecurityDevicesService.getDeviceById(resultToken.data.deviceId)
    if (device.status !== ResultStatus.Success) return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZATION_401)
    const allUserDevices = await SecurityDevicesService.getDevices(resultToken.data.userId)
    const findDevice = allUserDevices.data?.find(device => device.deviceId === req.params.deviceId)
    if (!findDevice) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)


    const result = await SecurityDevicesService.deleteDeviceById(req.params.deviceId)
    if (result.status === ResultStatus.Success) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return handleErrorObjectResult(result, res)
})
securityDevicesRouter.delete('/devices', async (req: Request, res: ResponseType<any>) => {
    const resultToken = getDataRefreshToken(req)
    //проверемяем токен, если токен не валидный дата не запишется
    if (!resultToken.data) return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZATION_401)
    const device = await SecurityDevicesService.getDeviceById(resultToken.data.deviceId)
    if (device.status !== ResultStatus.Success) return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZATION_401)

    //удаляет все подключенные устройства, кроме с которого делает запрос
    const result = await SecurityDevicesService.deleteAllUserDevices(resultToken.data.userId, resultToken.data.deviceId)
    if (result.status === ResultStatus.Success) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return res.status(HTTP_STATUSES.SOMETHING_WAS_WRONG_500).send('Something was wrong')
})