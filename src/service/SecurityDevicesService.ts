import {SecurityDeviceInputModel, SecurityDeviceViewModel} from "../models/deviceAuthModel";
import {UserService} from "./UserService";
import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {SecurityDevicesRepository} from "../repositories/securityDevices-repository";


export class SecurityDevicesService {
    static async addDevice(data: SecurityDeviceInputModel): Promise<ObjectResult<SecurityDeviceViewModel |null>> {
        const { userId} = data
        const user = await UserService.getUserById(userId)
        if(user.status !== ResultStatus.Success) return {status: ResultStatus.NotFound, errorsMessages: 'User not found', data: null}
        const device = await SecurityDevicesRepository.addDevice(data)
        console.log('device', device)
        return {status: ResultStatus.Success, data: null}
    }

    static async getDevices(userId: string): Promise<ObjectResult<SecurityDeviceViewModel | null>>{
        const devices = await SecurityDevicesRepository.getDevices(userId)
        console.log(devices)
        return {status: ResultStatus.Success, data: null}
    }

    static async deleteDevice (deviceId: string): Promise<ObjectResult>{
        try {
            await SecurityDevicesRepository.deleteDevice(deviceId)
            return {status: ResultStatus.Success, data: null}
        } catch (err) {
            return { status: ResultStatus.SomethingWasWrong, errorsMessages: 'Something was wrong', data: null}
        }
    }
}