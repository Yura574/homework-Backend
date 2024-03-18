import {body, param} from "express-validator";
import {userCollection} from "../db/db";
import {ObjectId} from "mongodb";

const fields = {
    login: 'login',
    password: 'password',
    email: 'email'
}
const fieldLength = {
    loginLength: {
        min: 3,
        max: 10
    },
    passwordLength: {
        min: 6,
        max: 20
    }
}

const {email, password, login} = fields
const {passwordLength, loginLength} = fieldLength

export const validateId = param('id').trim()
    .isLength({min: 24, max: 24}).withMessage({field: 'id', message: 'incorrect id'})


const loginValidator = body(login).trim()
    .notEmpty().withMessage({field: login, message: `${login} is required`})
    .isString().withMessage({field: login, message: `${login} should be string`})
    .isLength({min: loginLength.min, max: loginLength.max}).withMessage({
        field: login,
        message: `min length ${loginLength.min} symbols, max length ${loginLength.max} symbols`
    })
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage({field: login, message: `${login} incorrect`})
    .custom(async (login: string) => {
        const isLogin = await userCollection.findOne({login})
        if (isLogin) {
            throw new Error()
        }
        return true
    }).withMessage({field: login, message: `${login} already exist`})

const passwordValidator = body(password).trim()
    .notEmpty().withMessage({field: password, message: `${password} is required`})
    .isString().withMessage({field: password, message: `${password}  should be string`})
    .isLength({min: passwordLength.min, max: passwordLength.max}).withMessage({
        field: password,
        message: `min length ${passwordLength.min} symbols, max length ${passwordLength.max} symbols`
    })

const emailValidator = body(email).trim()
    .notEmpty().withMessage({field: email, message: `${email}  is required`})
    .isString().withMessage({field: email, message: `${email}  should be string`})
    .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage({field: email, message: `${email} incorrect`})
    .custom(async (email: string) => {
        const isLogin = await userCollection.findOne({email})
        if (isLogin) {
            throw new Error()
        }
        return true
    }).withMessage({field: email, message: `${email} already exist`})

export const userValidation = () => [loginValidator, passwordValidator, emailValidator]