import {body} from "express-validator";


const contentValidator = body('content').trim()
    .notEmpty().withMessage({field: 'content', message: `content can't be empty`})
    .isString().withMessage({field: 'content', message: `content should be string`})
    .isLength({min: 20, max: 300}).withMessage({
        field: 'content',
        message: `min length content 20 symbols, max length content 300 symbols`
    })


export const commentValidators = () => [contentValidator]