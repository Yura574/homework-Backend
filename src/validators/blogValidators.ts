import {body, param} from 'express-validator';
import {ObjectId} from 'mongodb';
import {blogCollection} from '../db/db';


export const findBlog = param('id').custom(async (id) => {
    const findBlog = await blogCollection.findOne({_id: new ObjectId(id)})
    if (!findBlog) {
        throw new Error()
    }
    return true
}).withMessage({field: 'id', message: 'blog not found'})

export const inputName = body('name').trim()
    .notEmpty().withMessage({field: 'name', message: `name can't be empty`})
    .isString().withMessage({field: 'name', message: `name should be string`})
    .trim().isLength({min: 1, max: 15}).withMessage({field: 'name', message: `max length name 15 symbols`})
export const inputDescription = body('description').trim()
    .notEmpty().withMessage({field: 'description', message: `description can't be empty`})
    .isString().withMessage({field: 'description', message: `description should be string`})
    .trim().isLength({min: 1, max: 500}).withMessage({field: 'description', message: `max length description 500 symbols`})
export const inputWebsiteUrl = body('websiteUrl').trim()
    .notEmpty().withMessage({field: 'websiteUrl', message: `websiteUrl can't be empty`})
    .isString().withMessage({field: 'websiteUrl', message: `websiteUrl should be string`})
    .trim().isLength({min: 1, max: 100}).withMessage({field: 'websiteUrl', message: `max length websiteUrl 100 symbols`})
    .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/).withMessage({
        field: 'websiteUrl',
        message: `invalid web site url, example: https://example.com`
    });
export const blogValidators = () => [inputName, inputDescription, inputWebsiteUrl]
