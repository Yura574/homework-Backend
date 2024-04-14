import {recoveryPasswordCollection} from "../db/db";
import {DataRecoveryCode} from "../models/authModel";


export class RecoveryPasswordRepository {
    static async addUserRecoveryPassword(data: DataRecoveryCode) {
        return await recoveryPasswordCollection.insertOne(data)
    }
    static async getRecoveryPassword() {
        return recoveryPasswordCollection.find({}).toArray()
    }

    static async getUserRecoveryPassword(recoveryCode: string) {
        return await recoveryPasswordCollection.findOne({recoveryCode})
    }
}