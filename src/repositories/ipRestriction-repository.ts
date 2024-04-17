import {IpRestrictionModel} from "../db/db";


export class IPRestrictionRepository {
    static async addIpRestriction (data: any){
        await IpRestrictionModel.create(data)
    }

    static async getAllIpRestrictions (IP: string, URL: string) {
        return  IpRestrictionModel.find({IP, URL}).lean();
    }
}