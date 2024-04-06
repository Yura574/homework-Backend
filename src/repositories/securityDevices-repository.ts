import {devicesCollection} from "../db/db";
import {SecurityDeviceInputModel} from "../models/deviceAuthModel";


export class SecurityDevicesRepository {
    static async addDevice(data: SecurityDeviceInputModel) {
        console.log(data)
        const {insertedId} = await devicesCollection.insertOne(data)
        return await devicesCollection.findOne({_id: insertedId})
    }

    static async getDevices(userId: string) {
        const devices = await devicesCollection.find({userId}).toArray()
        console.log(devices)
    }

    static async deleteDevice( deviceId: string) {

        const index = await devicesCollection.deleteOne({deviceId})
        return !!index
    }
}