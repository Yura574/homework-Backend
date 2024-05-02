import express, {Request, Response} from 'express';
import {PostRepository} from '../repositories/post-repository';
import {HTTP_STATUSES} from '../utils/httpStatuses';
import {authMiddleware} from '../middleware/auth/auth-middleware';
import {blogIdValidator, postValidation} from '../validators/post-validators';
import {ValidateErrorRequest} from '../utils/validateErrorRequest';
import {PostService} from '../service/PostService';
import {ReturnViewModel} from "../models/commonModels";
import {PostInputModel, PostViewModel} from "../models/postModels";
import {ParamsType, RequestType, ResponseType} from "./blog-router";
import {CommentInputModel, CommentViewModel} from "../models/commentModel";
import {CommentService} from "../service/CommentService";
import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {handleErrorObjectResult} from "../utils/handleErrorObjectResult";
import {commentValidators} from "../validators/commentValidators";
import jwt from "jsonwebtoken";
import {ParamsPostType} from "./types/postTypes";
import {LikeInputModel} from "./types/commonTypes";
import {getUserId} from "../middleware/auth/getUserId-middleware";


export const postRouter = express.Router()

type RequestPostType<P, B, Q> = Request<P, {}, B, Q>


export type QueryType = {
    pageNumber: string
    pageSize: string
    sortBy: string
    sortDirection: 'asc' | 'desc'
}
export type ResponsePostType<R> = Response<R>


postRouter.get('/', getUserId,async (req: RequestType<{}, {}, QueryType>, res: ResponsePostType<ReturnViewModel<PostViewModel[]>>) => {
const userId = req.user? req.user.userId : ''
    const result = await PostService.getPosts(req.query, userId)
    return res.status(200).send(result.data)
})

postRouter.get('/:id', getUserId, async (req: RequestType<ParamsType, {}, {}>, res: Response) => {

    const isError = ValidateErrorRequest(req, res)
    if (isError) {
        return
    }
    const userId = req.user? req.user.userId : ''
    const postId = req.params.id
    const result = await PostService.getPostById(postId, userId)
    if (result.status === ResultStatus.Success) return res.status(HTTP_STATUSES.OK_200).send(result.data)
    return handleErrorObjectResult(result, res)
})

postRouter.post('/', authMiddleware, blogIdValidator, postValidation(), async (req: RequestType<{}, PostInputModel, {}>, res: Response) => {

    const isError = ValidateErrorRequest(req, res)
    if (isError) {
        return
    }
    const data = req.body
    const result = await PostService.createPost(data)
    if (result.status === ResultStatus.Created) return res.status(HTTP_STATUSES.CREATED_201).send(result.data)
    return handleErrorObjectResult(result, res)
})

postRouter.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
    const isError = ValidateErrorRequest(req, res)
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

postRouter.put('/:id', authMiddleware, blogIdValidator, postValidation(), async (req: RequestType<ParamsType, PostInputModel, {}>, res: Response) => {
    const isError = ValidateErrorRequest(req, res)
    //если есть ошибка, validateError возвращает клиенту ошибку
    if (isError) return
    const userId = req.user? req.user.userId : ''

    const result = await PostService.updatePost(req.params.id,userId, req.body)
    if (result.status === ResultStatus.NoContent) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return handleErrorObjectResult(result, res)

})

postRouter.put('/:postId/like-status', getUserId, async (req: RequestType<ParamsPostType, LikeInputModel, {}>, res: Response) => {
    const userId = req.user?.userId ? req.user.userId : ''

    const result: ObjectResult = await PostService.setLikePost(req.params.postId, userId, req.body.likeStatus)
    if(result.status === ResultStatus.Success) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return handleErrorObjectResult(result, res)



})

//for comments

postRouter.get('/:id/comments', async (req: RequestType<ParamsType, {}, QueryType>, res: ResponseType<ReturnViewModel<CommentViewModel[]> | null>) => {

        const auth = req.headers['authorization']
        let userId: string = ''
        if (auth) {
            const [type, token] = auth.split(' ')
            if (type === 'Bearer') {
                try {
                    const dataToken: any = jwt.verify(token, process.env.ACCESS_SECRET as string)
                    userId = dataToken.userId
                } catch (error) {
                }
            }
        }

        const result = await PostService.getCommentsForPost(req.params.id, userId, req.query)
        if (result.status === ResultStatus.Success) return res.status(HTTP_STATUSES.OK_200).send(result.data)
        return handleErrorObjectResult(result, res)
    }
)
postRouter.post('/:id/comments', authMiddleware, commentValidators(), async (req: RequestType<ParamsType, CommentInputModel, {}>, res: ResponseType<CommentViewModel | null>) => {
    const isError = ValidateErrorRequest(req, res)
    if (isError) return
    const userId = req.user?.userId.toString()
    if (!userId) return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZATION_401)
    const result = await CommentService.createComment(req.body, req.params.id, userId)
    if (result.status === ResultStatus.Success) return res.status(HTTP_STATUSES.CREATED_201).send(result.data)
    return handleErrorObjectResult(result, res)
})