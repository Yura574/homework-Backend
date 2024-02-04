import express, {Request, Response} from 'express';
import {BlogRepository} from '../repositories/blog-repository';
import {HTTP_STATUSES} from '../utils/httpStatuses';
import {authMiddleware} from '../middleware/auth/auth-middleware';
import {blogValidators, findBlog} from '../validators/blogValidators';
import {BlogType, PostInputModelType} from '../models/blogModels';
import {blogCollection} from '../db/db';
import {ValidateError} from '../utils/validateError';
import {BlogService} from '../domain/blogService';
import {validationResult} from 'express-validator';
import {postValidation} from '../validators/post-validators';

export const blogRouter = express.Router()


type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithParams<P> = Request<P, {}, {}, {}>
type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithParamsAndQuery<P,Q> = Request<P, {}, {}, Q>
export type RequestType<P,B,Q> = Request<P, {}, B, Q>

type BodyType = {
    name: string,
    description: string,
    websiteUrl: string
}
export type ParamsType = {
    id: string
}
 export type GetBlogsType = {
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
    searchNameTerm?: string
}
 export type GetPostsType = {
    sortBy: string,
    sortDirection: string,
    pageNumber: number,
    pageSize: number,
    searchNameTerm?: string
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
    const returnBlog: BlogType = {
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
    const blogs = await BlogService.getBlogs(req.query)
    if (blogs) {
        res.status(HTTP_STATUSES.OK_200).send(blogs)
    }
})
blogRouter.get('/:id', findBlog, async (req: RequestWithParams<ParamsType>, res: Response) => {

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

blogRouter.get('/:id/posts',  findBlog,async (req: RequestWithParamsAndQuery<ParamsType,GetPostsType>, res: Response)=> {

    // const isError = ValidateError(req, res)
    // if (isError) {
    //     return
    // }
    const result = validationResult(req)
    if (!result.isEmpty()) {
        const errors = {
            errorsMessages: result.array({onlyFirstError: true}).map(err => err.msg)
        }
        if (errors.errorsMessages[0].field === 'id') {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }
        res.status(HTTP_STATUSES.BAD_REQUEST_400).send(errors)
        return
    }



    const posts =  await BlogService.getAllPostsByBlogId(req.params.id, req.query)
    
    res.send(posts)


})
blogRouter.post('/:id/posts', findBlog, postValidation(), async (req: RequestType<ParamsType, PostInputModelType, {}>, res: Response)=> {

    const isError = ValidateError(req, res)
    if (isError) {
        return
    }
    const newPost = await BlogService.createPostForBlog(req.params.id, req.body)
    if(newPost){

        res.send(newPost)
    } else {
        res.status(HTTP_STATUSES.NOT_FOUND_404).send('blog not found')

    }
})
blogRouter.delete('/:id', authMiddleware, findBlog, async (req: RequestWithParams<ParamsType>, res: Response) => {
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


























