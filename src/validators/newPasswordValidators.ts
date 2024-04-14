import {body, param} from "express-validator";
import {userCollection} from "../db/db";

const fields = {
    newPassword: 'newPassword',
    recoveryCode: 'recoveryCode',
}

const newPasswordLength = {
    min: 6,
    max: 20
}

const {recoveryCode, newPassword} = fields

const recoveryCodeValidator = body(recoveryCode)
    .notEmpty().withMessage({field: recoveryCode, message: `${recoveryCode} is required`})
    .isString().withMessage({field: recoveryCode, message: `${recoveryCode} should be string`})

const newPasswordValidator = body(newPassword)
    .notEmpty().withMessage({field: newPassword, message: `${newPassword} is required`})
    .isString().withMessage({field: newPassword, message: `${newPassword} should be string`})
    .isLength({min: newPasswordLength.min, max: newPasswordLength.max}).withMessage({
        field: newPassword,
        message: `min length ${newPasswordLength.min} symbols, max length ${newPasswordLength.max} symbols`
    })


export const newPasswordRecoveryValidator = () => [recoveryCodeValidator, newPasswordValidator]