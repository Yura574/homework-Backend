import express, {Request, Response} from 'express';
import {BlogRepository} from '../repositories/blog-repository';
import {HTTP_STATUSES} from '../utils/httpStatuses';
import {authMiddleware} from '../middleware/auth/auth-middleware';
import {blogValidators, findBlog} from '../validators/blogValidators';
import {BlogViewModelType} from '../models/blogModels';
import {blogCollection} from '../db/db';
import {ValidateError} from '../utils/validateError';
import {BlogService, GetBlogsType} from '../domain/blogService';

export const blogRouter = express.Router()


type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
type BodyType = {
    name: string,
    description: string,
    websiteUrl: string
}
type RequestType = {
    id: string
    term: string
}

blogRouter.post('/', authMiddleware, blogValidators(), async (req: RequestWithBody<BodyType>, res: Response) => {
    const isError = ValidateError(req, res)
    if (isError) {
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
blogRouter.get('/', async (req: RequestWithQuery<GetBlogsType>, res: Response) => {
    // const allBlogs = await BlogRepository.getAllBlogs().then(res => res.toArray())
    // const returnBlogs = allBlogs.map((blog) => {
    //     return {
    //         id: blog._id.toString(),
    //         name: blog.name,
    //         description: blog.description,
    //         websiteUrl: blog.websiteUrl,
    //         createdAt: blog.createdAt,
    //         isMembership: blog.isMembership
    //
    //     }
    // })
    const blogs = await BlogService.getBlogs(req.query)
    if (blogs) {
        res.status(HTTP_STATUSES.OK_200).send(blogs)
    }
})
blogRouter.get('/:id', findBlog, async (req: RequestWithParams<RequestType>, res: Response) => {

    const isError = ValidateError(req, res)
    if (isError) {
        return
    }
    const blog =await BlogService.getBlogById(req.params.id)
    if (blog) {
        res.status(HTTP_STATUSES.OK_200).send(blog)
        return
    } else {
        res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        return
    }

})
blogRouter.delete('/:id', authMiddleware, findBlog, async (req: RequestWithParams<RequestType>, res: Response) => {
    const isError = ValidateError(req, res)
    if (isError) {
        return
    }
    await BlogRepository.deleteBlog(req.params.id)
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return


})
blogRouter.put('/:id', authMiddleware, findBlog, blogValidators(), async (req: Request, res: Response) => {
    const isError = ValidateError(req, res)
    if (isError) {
        return
    }
    const id = req.params.id
    const {name, description, websiteUrl} = req.body


    await BlogRepository.updateBlog(id, name, description, websiteUrl)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return
})


























