import {body} from 'express-validator';


export const inputName = body('name')
    .notEmpty().withMessage({field: 'name', message: `name can't be empty`})
    .isString().withMessage({field: 'name', message: `should be string`})
    .trim().isLength({min: 1, max: 15}).withMessage({field: 'name', message: `max 15 symbols`})
export const inputDescription = body('description')
    .notEmpty().withMessage({field: 'description', message: `description can't be empty`})
    .isString().withMessage({field: 'description', message: `should be string`})
    .trim().isLength({min: 1, max: 500}).withMessage({field: 'description', message: `max 15 symbols`})
export const inputWebsiteUrl = body('websiteUrl')
    .notEmpty().withMessage({field: 'websiteUrl', message: `websiteUrl can't be empty`})
    .isString().withMessage({field: 'websiteUrl', message: `should be string`})
    .trim().isLength({min: 1, max: 100}).withMessage({field: 'websiteUrl', message: `max 100 symbols`})
    // .matches(/^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$)
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage({
        field: 'websiteUrl',
        message: `invalid web site url, example: https://example.com`
    });
export const blogValidators = () => [inputName, inputDescription, inputWebsiteUrl]
