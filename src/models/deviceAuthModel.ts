import {Schema} from "mongoose";


export type SecurityDeviceInputModel = {
    userId: string
    ip?: string
    deviceId: string
    issuedAt: string
    deviceName?: string
}
export type SecurityDeviceViewModel = {
    ip?: string,
    title?: string,
    lastActiveDate: string,
    deviceId: string
}

export type SecurityDeviceDBModel = {
    userId: string
    ip?: string
    deviceId: string
    issuedAt: string
    deviceName?: string
}

export const SecurityDeviceSchema = new Schema<SecurityDeviceDBModel>({
    userId: String,
    deviceId: String,
    deviceName: String,
    ip: String,
    issuedAt: String
})