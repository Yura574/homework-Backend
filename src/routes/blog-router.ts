import express, {Router, Request, Response} from 'express';
import {BlogRepository} from '../repositories/blog-repository';
import {db} from '../db/db';
import { validationResult} from 'express-validator';
import {HTTP_STATUSES} from '../utils/httpStatuses';
import {authMiddleware} from '../middleware/auth/auth-middleware';
import {blogValidators} from '../validators/blogValidators';

export const blogRouter = express.Router()


type RequestWithBody<B> = Request<unknown, unknown, B, unknown>
blogRouter.post('/',  authMiddleware, blogValidators(),async (req: Request, res: Response)=> {

const result = validationResult(req)
    if(!result.isEmpty()){
        const errors= {
            errorsMessages : result.array().map(err => err.msg)
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

    db.blogs.push(newBlog)

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
    const blog = BlogRepository.getById(req.params.id)
    if (blog) {
        res.status(HTTP_STATUSES.OK_200).send(blog)
        return
    } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

})
blogRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const blog = BlogRepository.deleteBlog(req.params.id)
    if (blog) {
        res.send(HTTP_STATUSES.NO_CONTENT_204)
        return
    } else {
        res.send(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

})
blogRouter.put('/:id', authMiddleware, blogValidators(),async (req: Request, res: Response)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
        return
    }
    const id = req.params.id
    const {name, description, websiteUrl} = req.body
    const blog = BlogRepository.getById(id)
    if(!blog){
        res.send(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

   const isUpdatedBlog =  BlogRepository.updateBlog(id, name, description, websiteUrl)
    if(!isUpdatedBlog){
        res.send(HTTP_STATUSES.NOT_FOUND_404)
    }
    res.send(HTTP_STATUSES.NO_CONTENT_204)
})


























