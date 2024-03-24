import {body} from "express-validator";


const loginOrEmail = body('loginOrEmail')
    .notEmpty().withMessage({field: 'loginOrEmail', message: `login or email can't be empty`})
    .isString().withMessage({field: 'loginOrEmail', message: `login or email should be string`})


const password = body('password')
    .notEmpty().withMessage({field: 'password', message: `password can't be empty`})
    .isString().withMessage({field: 'password', message: `password should be string`})


export const authValidator = ()=> [loginOrEmail, password]