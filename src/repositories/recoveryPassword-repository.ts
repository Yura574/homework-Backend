import {DataRecoveryCode} from "../models/authModel";
import {RecoveryPasswordModel} from "../db/db";


export class RecoveryPasswordRepository {
    static async addUserRecoveryPassword(data: DataRecoveryCode) {
        return await RecoveryPasswordModel.create(data)
    }
    static async getUserRecoveryPassword(recoveryCode: string) {
        return  RecoveryPasswordModel.findOne({recoveryCode})
    }
    static async deleteUserRecoveryPassword(recoveryCode: string) {
        return  RecoveryPasswordModel.deleteOne({recoveryCode})
    }
}