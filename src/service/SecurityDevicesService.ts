import {SecurityDeviceInputModel, SecurityDeviceViewModel} from "../models/deviceAuthModel";
import {UserService} from "./UserService";
import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {SecurityDevicesRepository} from "../repositories/securityDevices-repository";
import {somethingWasWrong} from "../utils/somethingWasWrong";


export class SecurityDevicesService {
    static async addDevice(data: SecurityDeviceInputModel): Promise<ObjectResult<SecurityDeviceViewModel | null>> {
        const {userId} = data
        const user = await UserService.getUserById(userId)
        if (user.status !== ResultStatus.Success) return {
            status: ResultStatus.NotFound,
            errorsMessages: 'User not found',
            data: null
        }
        try {
            await SecurityDevicesRepository.addDevice(data)
            return {status: ResultStatus.Success, data: null}
        } catch (err) {
            return somethingWasWrong
        }

    }

    static async updateDevice(deviceId: string, issuedAt: string): Promise<ObjectResult> {
        await SecurityDevicesRepository.updateDevice(deviceId, issuedAt)
        return {status: ResultStatus.Success, data: null}
    }

    static async getDevices(userId: string): Promise<ObjectResult<SecurityDeviceViewModel[] | null>> {
        const devices = await SecurityDevicesRepository.getDevices(userId)
        const returnData = devices.map(device => {
            return {
                ip: device.ip,
                title: device.deviceName,
                lastActiveDate: device.issuedAt,
                deviceId: device.deviceId
            }
        })
        return {status: ResultStatus.Success, data: returnData}
    }

    static async getDeviceById(deviceId: string): Promise<ObjectResult<any>>{
      const device = await SecurityDevicesRepository.getDeviceById(deviceId)
        if(!device) return {status: ResultStatus.NotFound, errorsMessages: 'Device not found', data: null }
        const newDevice = {
            id: device._id,
            userId: device.userId,
            issuedAt: device.issuedAt,
            deviceId: device.deviceId,
            deviceName: device.deviceName,
            ip: device.ip

        }
return {status: ResultStatus.Success, data: newDevice}
    }
    static async deleteDeviceById(deviceId: string): Promise<ObjectResult> {
        try {
            await SecurityDevicesRepository.deleteDevice(deviceId)
            return {status: ResultStatus.Success, data: null}
        } catch (err) {
            return somethingWasWrong
        }
    }

    static async deleteAllUserDevices(userId: string, deviceId: string): Promise<ObjectResult> {
        try {
            await SecurityDevicesRepository.deleteAllDevices(userId, deviceId)
            return {status: ResultStatus.Success, data: null}
        } catch (err) {
            return somethingWasWrong
        }
    }
}