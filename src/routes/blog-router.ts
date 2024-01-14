import express, {Router, Request, Response} from 'express';
import {BlogRepository} from '../repositories/blog-repository';
import {db} from '../db/db';
import { validationResult} from 'express-validator';
import {HTTP_STATUSES} from '../utils/httpStatuses';

export const blogRouter = express.Router()


type RequestWithBody<B> = Request<unknown, unknown, B, unknown>
blogRouter.post('/', (req: Request, res: Response)=> {
const result = validationResult(req)
    if(!result.isEmpty()){
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(result)
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

    res.status(201).send(newBlog)
    return;
})
blogRouter.get('/', async (req: Request, res: Response) => {
    const allBlogs = BlogRepository.getAllBlogs()
    if (allBlogs) {
        console.log(allBlogs)
        res.status(200).send(allBlogs)
    }
})
blogRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = BlogRepository.getById(req.params.id)
    if (blog) {
        res.status(200).send(blog)
        return
    } else {
        res.send(404)
        return
    }

})
blogRouter.delete('/:id', async (req: Request, res: Response) => {
    const blog = BlogRepository.deleteBlog(req.params.id)
    if (blog) {
        res.send(204)
        return
    } else {
        res.send(404)
        return
    }

})