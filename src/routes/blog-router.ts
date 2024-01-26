import express, {Router, Request, Response} from 'express';
import {BlogRepository} from '../repositories/blog-repository';
import {db} from '../db/db';
import { validationResult} from 'express-validator';
import {HTTP_STATUSES} from '../utils/httpStatuses';
import {authMiddleware} from '../middleware/auth/auth-middleware';
import {blogValidators} from '../validators/blogValidators';
import {blogCollection} from '../index';

export const blogRouter = express.Router()


type RequestWithBody<B> = Request<unknown, unknown, B, unknown>
blogRouter.post('/',  authMiddleware, blogValidators(),async (req: Request, res: Response)=> {

const result = validationResult(req)
    if(!result.isEmpty()){
        // let msgArray = []
        // const field: string[] = []
        // for(let i = 0; i< result.array().length; i++){
        //     if(!field.includes(result.array()[i].msg.field)){
        //         field.push(result.array()[i].msg.field)
        //         msgArray.push(result.array()[i].msg)
        //     }
        //
        // }

        const errors= {
            errorsMessages :result.array({onlyFirstError: true}).map(err => err.msg)
        }
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
        return
    }
    const {name,description, websiteUrl} = req.body
    const newBlog = {
        id: (+new Date()).toString(),
        name,
        description,
        websiteUrl
    }

    await blogCollection.insertOne(newBlog)

    res.status(HTTP_STATUSES.CREATED_201).send(newBlog)
    return;
})
blogRouter.get('/', async (req: Request, res: Response) => {
    const allBlogs = BlogRepository.getAllBlogs()
    if (allBlogs) {
        res.status(HTTP_STATUSES.OK_200).send(allBlogs)
    }
})
blogRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = BlogRepository.getBlogById(req.params.id)
    if (blog) {
        res.status(HTTP_STATUSES.OK_200).send(blog)
        return
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

})
blogRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const blog = BlogRepository.deleteBlog(req.params.id)
    if (blog) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

})
blogRouter.put('/:id', authMiddleware, blogValidators(),async (req: Request, res: Response)=> {
    const result = validationResult(req)
    if(!result.isEmpty()){

        const errors= {
            errorsMessages :result.array({onlyFirstError: true}).map(err => err.msg)
        }
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
        return
    }
    const id = req.params.id
    const {name, description, websiteUrl} = req.body
    const blog = BlogRepository.getBlogById(id)
    if(!blog){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

   const isUpdatedBlog =  BlogRepository.updateBlog(id, name, description, websiteUrl)
    if(!isUpdatedBlog){
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return
})


























