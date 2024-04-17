import {SecurityDeviceInputModel} from "../models/deviceAuthModel";
import {SecurityDeviceModel} from "../db/db";


export class SecurityDevicesRepository {
    static async addDevice(data: SecurityDeviceInputModel) {
        const {_id} = await SecurityDeviceModel.create(data)
        return  SecurityDeviceModel.findOne({_id})
    }

    static async updateDevice(deviceId: string, issuedAt: string){
        return  SecurityDeviceModel.updateOne({deviceId}, {$set:{issuedAt}})
    }

    static async getDeviceById(deviceId: string){
        return   SecurityDeviceModel.findOne({deviceId})

    }
    static async getDevices(userId: string) {
        return  SecurityDeviceModel.find({userId}).lean()
    }

    static async deleteDevice( deviceId: string) {
        const index = await SecurityDeviceModel.deleteOne({deviceId})
        return !!index
    }
    static async deleteAllDevices( userId: string, deviceId: string) {
        const index = await SecurityDeviceModel.deleteMany({userId, deviceId: {$ne: deviceId}})
        return !!index
    }
}