import express, {Request, Response} from 'express';
import {PostRepository} from '../repositories/post-repository';
import {HTTP_STATUSES} from '../utils/httpStatuses';
import {authMiddleware} from '../middleware/auth/auth-middleware';
import {blogIdValidator, findPost, postValidation} from '../validators/post-validators';
import {ValidateError} from '../utils/validateError';
import {PostService} from '../service/PostService';
import {ReturnViewModel} from "../models/commonModels";
import {PostInputModel, PostViewModel} from "../models/postModels";
import {ParamsType, RequestType, ResponseType} from "./blog-router";
import {CommentInputModel, CommentViewModel} from "../models/commentModel";
import {CommentService} from "../service/CommentService";
import {ResultStatus} from "../utils/objectResult";
import {handleErrorObjectResult} from "../utils/handleErrorObjectResult";
import {commentValidators} from "../validators/commentValidators";


export const postRouter = express.Router()

type RequestPostType<P, B, Q> = Request<P, {}, B, Q>


export type QueryType = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: 'asc' | 'desc'
}
export type ResponsePostType<R> = Response<R>


postRouter.get('/', async (req: RequestPostType<{}, {}, QueryType>, res: ResponsePostType<ReturnViewModel<PostViewModel[]>>) => {

    const result = await PostService.getPosts(req.query)
    return res.status(200).send(result.data)
})

postRouter.get('/:id', findPost, async (req: RequestType<ParamsType, {}, {}>, res: Response) => {

    const isError = ValidateError(req, res)
    if (isError) {
        return
    }
    const id = req.params.id
    const result = await PostService.getPostById(id)
    if (result.status === ResultStatus.Success) return res.status(HTTP_STATUSES.OK_200).send(result.data)
    return handleErrorObjectResult(result, res)
})

postRouter.post('/', authMiddleware, blogIdValidator, postValidation(), async (req: RequestType<{}, PostInputModel, {}>, res: Response) => {

    const isError = ValidateError(req, res)
    if (isError) {
        return
    }
    const data = req.body
    const result = await PostService.createPost(data)
    if (result.status === ResultStatus.Created) return res.status(HTTP_STATUSES.CREATED_201).send(result.data)
    return handleErrorObjectResult(result, res)
    // if (newPost) {
    //     res.status(HTTP_STATUSES.CREATED_201).send(newPost)
    //     return
    // }
    // res.status(HTTP_STATUSES.NOT_FOUND_404).send('blog not found')
    // return;

})

postRouter.delete('/:id', authMiddleware, findPost, async (req: Request, res: Response) => {

    const isError = ValidateError(req, res)
    if (isError) {
        return
    }

    const id = req.params.id
    const isDeleted = await PostRepository.deletePost(id)
    if (isDeleted) {
        res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
        return
    }
    res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    return;
})

postRouter.put('/:id', authMiddleware, findPost, blogIdValidator, postValidation(), async (req: Request, res: Response) => {
    const isError = ValidateError(req, res)
    //если есть ошибка, validateError возвращает клиенту ошибку
    if (isError) return

    const result = await PostService.updatePost(req.params.id, req.body)
    if (result.status === ResultStatus.NoContent) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return handleErrorObjectResult(result, res)

})

//for comments

postRouter.get('/:id/comments', authMiddleware, async (req: RequestType<ParamsType, {}, QueryType>, res: ResponseType<ReturnViewModel<CommentViewModel[]>>) => {
    const result = await PostService.getCommentsForPost(req.params.id, req.query)
return res.status(HTTP_STATUSES.OK_200).send(result.data)
})
postRouter.post('/:id/comments', authMiddleware, commentValidators(), async (req: RequestType<ParamsType, CommentInputModel, {}>, res: ResponseType<CommentViewModel | null>) => {
    const isError = ValidateError(req, res)
    if(isError) return
    const userId = req.user?.userId.toString()
    if (!userId) return res.status(HTTP_STATUSES.NOT_FOUND_404)
    const result = await CommentService.createComment(req.body, req.params.id, userId)
    if (result.status === ResultStatus.Success) return res.status(HTTP_STATUSES.CREATED_201).send(result.data)
    return handleErrorObjectResult(result, res)
})