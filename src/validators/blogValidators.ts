import {body} from 'express-validator';


export const inputName = body('name').isString().trim().isLength({min: 1, max: 15})
export const inputDescription = body('description').isString().trim().isLength({min: 1, max: 500})
export const inputWebsiteUrl = body('websiteUrl')
    .isString()
    .trim()
    .isLength({min: 1, max: 100})
    // .matches(/^https://([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$)
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/);
export const blogValidators = () => [inputName, inputDescription, inputWebsiteUrl]
