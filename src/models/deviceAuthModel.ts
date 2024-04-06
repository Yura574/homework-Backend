



export type SecurityDeviceInputModel = {
    userId: string
    ip?: string
    deviceId: string
    issuedAt: string
    deviceName?: string
}
export type SecurityDeviceViewModel = {
    ip: string,
    title: string,
    lastActiveDate: string,
    deviceId: string
}