import {ipRestrictionCollection} from "../db/db";


export class IPRestrictionRepository {
    static async addIpRestriction (data: any){
        await ipRestrictionCollection.insertOne(data)
    }

    static async getAllIpRestrictions (IP: string, URL: string) {
        return  ipRestrictionCollection.find({IP, URL}).toArray();
    }
}