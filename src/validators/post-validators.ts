import {body} from 'express-validator';
import {BlogRepository} from '../repositories/blog-repository';


const titleValidator = body('title').isString().trim().isLength({min: 1, max: 30}).withMessage('Incorrect title')

const shortDescriptionValidator = body('shortDescription').isString().trim().isLength({min:1, max: 100}).withMessage('Incorrect shortDescription')

const contentValidator = body('content').isString().trim().isLength({min:1, max: 1000}).withMessage('Incorrect content')
const blogIdValidator = body('blogId').custom((value)=> {
    const blog = BlogRepository.getById(value)
    if(!blog){
        throw Error('Incorrect BlogId')
    }
    return true
}).withMessage('Incorrect blogId')


export const blogValidation = ()=> [titleValidator, shortDescriptionValidator, contentValidator, blogIdValidator]