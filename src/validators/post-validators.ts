import {body, param} from 'express-validator';
import {ObjectId} from 'mongodb';
import {blogCollection, postCollection} from '../db/db';


export const findPost = param('id').custom(async (id) => {
    const findPost = await postCollection.findOne({_id: new ObjectId(id)})
    if (!findPost) {
        throw new Error()
    }
    return true
}).withMessage({field: 'id', message: 'post not found'})

const titleValidator = body('title').trim()
    .notEmpty().withMessage({field: 'title', message: 'title is required'})
    .isString().withMessage({field: 'title', message: 'title should be string'})
    .isLength({min: 1, max: 30}).withMessage({field: 'title', message: 'max length 30 symbols'})

const shortDescriptionValidator = body('shortDescription').trim()
    .notEmpty().withMessage({field: 'shortDescription', message: 'shortDescription is required'})
    .isString().withMessage({field: 'shortDescription', message: 'shortDescription should be string'})
    .isLength({min: 1, max: 100}).withMessage({field: 'shortDescription', message: 'max length 100 symbols'})


const contentValidator = body('content').trim()
    .notEmpty().withMessage({field: 'content', message: 'content is required'})
    .isString().withMessage({field: 'content', message: 'content should be string'})
    .isLength({min: 1, max: 1000}).withMessage({field: 'content', message: 'max length 1000 symbols'})
const blogIdValidator = body('blogId').trim()
    .notEmpty().withMessage({field: 'blogId', message: 'blogId is required'})
    .isString().withMessage({field: 'blogId', message: 'blogId should be string'})
    // .isLength({min: 24, max: 24}).withMessage({field: 'blogId', message: 'blogId should be 24 character'})
    .custom(async (value) => {

        const blog = await blogCollection.findOne({_id: new ObjectId(value)})
        if (!blog) {
            throw new Error('Blog not found')
        }
        return true
    }).withMessage({field: 'blogId', message: 'blog not found'})


export const postValidation = () => [titleValidator,shortDescriptionValidator, contentValidator, blogIdValidator]