import {body} from 'express-validator';


const nameValidator = body('name').isString().trim().isLength({min: 1, max: 15}).withMessage('Incorrect name')

const descriptionValidator = body('description').isString().trim().isLength({min:1, max: 500}).withMessage('Incorrect description')

const websiteUrlValidator = body('websiteUrl').isString().trim().isLength({min:1, max: 100}).withMessage('Incorrect websiteUrl')


export const blogValidation = ()=> [nameValidator, descriptionValidator, websiteUrlValidator]