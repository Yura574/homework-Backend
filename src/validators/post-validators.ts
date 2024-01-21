import {body} from 'express-validator';
import {BlogRepository} from '../repositories/blog-repository';


const titleValidator = body('title').trim()
    .notEmpty().withMessage({field: 'title', message: 'title is required'})
    .isString().withMessage({field: 'title', message: 'title should be string'})
    .isLength({min: 1, max: 30}).withMessage('max length 30 symbols')

const shortDescriptionValidator = body('shortDescription').trim()
    .notEmpty().withMessage({field: 'shortDescription', message: 'shortDescription is required'})
    .isString().withMessage({field: 'shortDescription', message: 'shortDescription should be string'})
    .isLength({min: 1, max: 100}).withMessage('max length 100 symbols')


const contentValidator = body('content').trim()
    .notEmpty().withMessage({field: 'content', message: 'content is required'})
    .isString().withMessage({field: 'content', message: 'content should be string'})
    .isLength({min: 1, max: 1000}).withMessage('max length 1000 symbols')
const blogIdValidator = body('blogId').trim()
    .notEmpty().withMessage({field: 'blogId', message: 'blogId is required'})
    .isString().withMessage({field: 'blogId', message: 'blogId should be string'})
    .custom((value) => {

        const blog = BlogRepository.getBlogById(value)
        if (!blog) {
            throw new Error('Blog not found')
        }
        return true
    })


export const postValidation = () => [titleValidator, shortDescriptionValidator, contentValidator, blogIdValidator]