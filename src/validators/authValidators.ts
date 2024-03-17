import {body} from "express-validator";


const loginOrEmail = body('loginOrEmail')
    .notEmpty().withMessage({field: 'loginOrEmail', message: `loginOrEmail can't be empty`})
    .isString().withMessage({field: 'loginOrEmail', message: `should be string`})
    .trim().isLength({min: 1, max: 55}).withMessage({field: 'loginOrEmail', message: `max 55 symbols`})

const password = body('password')
    .notEmpty().withMessage({field: 'password', message: `loginOrEmail can't be empty`})
    .isString().withMessage({field: 'password', message: `should be string`})
    .trim().isLength({min: 1, max: 55}).withMessage({field: 'password', message: `max 55 symbols`})


export const authValidator = ()=> [loginOrEmail, password]