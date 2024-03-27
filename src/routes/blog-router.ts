import express, {Request, Response} from 'express';
import {BlogRepository} from '../repositories/blog-repository';
import {HTTP_STATUSES} from '../utils/httpStatuses';
import {authMiddleware} from '../middleware/auth/auth-middleware';
import {blogValidators, findBlog} from '../validators/blogValidators';
import {ValidateError} from '../utils/validateError';
import {BlogService} from '../service/BlogService';
import {postValidation} from '../validators/post-validators';
import {BlogInputModel, BlogPostInputModel, BlogViewModel} from "../models/blogModels";
import {ReturnViewModel} from "../models/commonModels";
import {validateId} from "../validators/userValidators";
import {ObjectId} from "mongodb";
import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {handleErrorObjectResult} from "../utils/handleErrorObjectResult";
import {PostViewModel} from "../models/postModels";

export const blogRouter = express.Router()


type RequestWithBody<B> = Request<{}, {}, B, {}>
type RequestWithParams<P> = Request<P, {}, {}, {}>
export type RequestWithQuery<Q> = Request<{}, {}, {}, Q>
export type RequestWithParamsAndQuery<P, Q> = Request<P, {}, {}, Q>
export type RequestType<P, B, Q> = Request<P, {}, B, Q> & {user?: { userId: ObjectId, userLogin: string }}


export type ResponseType<R> = Response<R>

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
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number,
    searchNameTerm?: string
}
export type GetPostsType = {
    sortBy: string,
    sortDirection: 'asc' | 'desc',
    pageNumber: number,
    pageSize: number,
    searchNameTerm: string
}

blogRouter.post('/', authMiddleware, blogValidators(), async (req: RequestWithBody<BodyType>, res: Response) => {
    const isError = ValidateError(req, res)
    if (isError) {
        return
    }

    const result = await BlogRepository.createBlog(req.body)
    if (result.status === ResultStatus.Created) return res.status(HTTP_STATUSES.CREATED_201).send(result.data)
    return handleErrorObjectResult(result, res)
})
blogRouter.get('/', async (req: RequestWithQuery<GetBlogsType>, res: ResponseType<ReturnViewModel<BlogViewModel[]>>) => {
    const result = await BlogService.getBlogs(req.query)

    return res.status(HTTP_STATUSES.OK_200).send(result.data)
})
blogRouter.get('/:id', findBlog, async (req: RequestWithParams<ParamsType>, res: ResponseType<BlogViewModel | null>) => {
    const isError = ValidateError(req, res)
    if (isError) return

    const result: ObjectResult<BlogViewModel | null> = await BlogService.getBlogById(req.params.id)
    if (result.status === ResultStatus.Success) return res.status(HTTP_STATUSES.OK_200).send(result.data)
    return handleErrorObjectResult(result, res)

})

blogRouter.get('/:id/posts', async (
    req: RequestWithParamsAndQuery<ParamsType, GetPostsType>,
    res: ResponseType<ReturnViewModel<PostViewModel[]> | null>) => {

    const result = await BlogService.getAllPostsByBlogId(req.params.id, req.query)

    if (result.status === ResultStatus.Success) return res.status(HTTP_STATUSES.OK_200).send(result.data)
    return handleErrorObjectResult(result, res)


})
blogRouter.post('/:id/posts', authMiddleware, validateId, postValidation(), async (req: RequestType<ParamsType, BlogPostInputModel, {}>, res: ResponseType<PostViewModel | null>) => {

    const isError = ValidateError(req, res)
    if (isError) return
    const result = await BlogService.createPostForBlog(req.params.id, req.body)

    if (result.status === ResultStatus.Created) return res.status(HTTP_STATUSES.CREATED_201).send(result.data)
    return handleErrorObjectResult(result, res)
})
blogRouter.delete('/:id', authMiddleware,  async (req: RequestType<ParamsType, {}, {}>, res: Response) => {
    const isError = ValidateError(req, res)
    if (isError) return

    const result: ObjectResult = await BlogService.deleteBlog(req.params.id)
    console.log(result.status === ResultStatus.NoContent)
    if(result.status === ResultStatus.NoContent) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return  handleErrorObjectResult(result, res)


})
blogRouter.put('/:id', authMiddleware, blogValidators(), async (req: RequestType<ParamsType, BlogInputModel, {}>, res: ResponseType<ObjectResult>) => {
    const isError = ValidateError(req, res)
    if (isError) return

    const id = req.params.id
    const {name, description, websiteUrl} = req.body

    const result: ObjectResult = await BlogService.updateBlog(id, name, description, websiteUrl)

    if (result.status === ResultStatus.NoContent) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return handleErrorObjectResult(result, res)
})


























