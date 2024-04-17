import {Schema} from "mongoose";


export type RecoveryPasswordInputModel = {
    email: string
}

export type NewPasswordRecoveryInputModel = {
    newPassword: string
    recoveryCode: string
}

export type RecoveryCodeDBModel = {
    email: string
    recoveryCode: string
    expirationDate: Date
}

export const RecoveryPasswordSchema = new Schema<RecoveryCodeDBModel>({
    email: String,
    recoveryCode: String,
    expirationDate: String
})