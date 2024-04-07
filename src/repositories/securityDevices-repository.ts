import {devicesCollection} from "../db/db";
import {SecurityDeviceInputModel} from "../models/deviceAuthModel";


export class SecurityDevicesRepository {
    static async addDevice(data: SecurityDeviceInputModel) {
        const {insertedId} = await devicesCollection.insertOne(data)
        return await devicesCollection.findOne({_id: insertedId})
    }

    static async updateDevice(deviceId: string, issuedAt: string){
        await devicesCollection.updateOne({deviceId}, {$set:{issuedAt}})
    }

    static async getDeviceById(deviceId: string){
        return  await devicesCollection.findOne({deviceId})

    }
    static async getDevices(userId: string) {
        return await devicesCollection.find({userId}).toArray()
    }

    static async deleteDevice( deviceId: string) {
        const index = await devicesCollection.deleteOne({deviceId})
        return !!index
    }
    static async deleteAllDevices( userId: string, deviceId: string) {
        const index = await devicesCollection.deleteMany({userId, deviceId: {$ne: deviceId}})
        return !!index
    }
}