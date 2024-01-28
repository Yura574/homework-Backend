import express, {Request, Response} from 'express';
import {BlogRepository} from '../repositories/blog-repository';
import {validationResult} from 'express-validator';
import {HTTP_STATUSES} from '../utils/httpStatuses';
import {authMiddleware} from '../middleware/auth/auth-middleware';
import {blogValidators, findBlog} from '../validators/blogValidators';
import {blogCollection, client, database} from '../index';
import {BlogViewModelType} from '../models/blogModels';
import {ObjectId} from 'mongodb';

export const blogRouter = express.Router()


type RequestWithBody<B> = Request<unknown, unknown, B, unknown>
blogRouter.post('/', authMiddleware, blogValidators(), async (req: Request, res: Response) => {

    const result = validationResult(req)
    if (!result.isEmpty()) {
        // let msgArray = []
        // const field: string[] = []
        // for(let i = 0; i< result.array().length; i++){
        //     if(!field.includes(result.array()[i].msg.field)){
        //         field.push(result.array()[i].msg.field)
        //         msgArray.push(result.array()[i].msg)
        //     }
        //
        // }

        const errors = {
            errorsMessages: result.array({onlyFirstError: true}).map(err => err.msg)
        }
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
        return
    }
    const {name, description, websiteUrl} = req.body
    const newBlog = {
        name,
        description,
        websiteUrl,
        createdAt: new Date().toISOString(),
        isMembership: false
    }


    const createdBlog = await blogCollection.insertOne(newBlog)
    const blog = await blogCollection.findOne({_id: createdBlog.insertedId})
    const returnBlog: BlogViewModelType = {
        id: blog!._id.toString(),
        name,
        description,
        websiteUrl,
        isMembership: blog?.isMembership,
        createdAt: blog?.createdAt,
    }
    res.status(HTTP_STATUSES.CREATED_201).send(returnBlog)
    return;
})
blogRouter.get('/', async (req: Request, res: Response) => {
    const allBlogs = await BlogRepository.getAllBlogs().then(res => res.toArray())
    const returnBlogs = allBlogs.map((blog) => {
        return {
            id: blog._id.toString(),
            name: blog.name,
            description: blog.description,
            websiteUrl: blog.websiteUrl,
            createdAt: blog.createdAt,
            isMembership: blog.isMembership

        }
    })
    if (allBlogs) {
        res.status(HTTP_STATUSES.OK_200).send(returnBlogs)
    }
})
blogRouter.get('/:id', async (req: Request, res: Response) => {
    const blog = await BlogRepository.getBlogById(req.params.id)
    const returnBlog: BlogViewModelType = {
        id: blog!._id.toString(),
        createdAt: blog?.createdAt,
        isMembership: blog?.isMembership,
        websiteUrl: blog?.websiteUrl,
        name: blog?.name,
        description: blog?.description
    }
    if (blog) {
        res.status(HTTP_STATUSES.OK_200).send(returnBlog)
        return
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

})
blogRouter.delete('/:id', authMiddleware, findBlog, async (req: Request, res: Response) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {

        const errors = {
            errorsMessages: result.array({onlyFirstError: true}).map(err => err.msg)
        }
        if (errors.errorsMessages[0].field === 'id') {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }
        return
    }
    await blogCollection.deleteOne({_id: new ObjectId(req.params.id)})

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return


})
blogRouter.put('/:id', authMiddleware, findBlog, blogValidators(), async (req: Request, res: Response) => {
    const result = validationResult(req)
    if (!result.isEmpty()) {

        const errors = {
            errorsMessages: result.array({onlyFirstError: true}).map(err => err.msg)
        }
        if (errors.errorsMessages[0].field === 'id') {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return;
        }
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
        return
    }
    const id = req.params.id
    const {name, description, websiteUrl} = req.body


    await BlogRepository.updateBlog(id, name, description, websiteUrl)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return
})


























