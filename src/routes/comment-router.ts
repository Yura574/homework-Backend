import express, {Response} from "express";
import { ParamsType, RequestType, ResponseType} from "./blog-router";
import {CommentInputModel, CommentViewModel, LikeInputModel} from "../models/commentModel";
import {CommentService} from "../service/CommentService";
import {ResultStatus} from "../utils/objectResult";
import {HTTP_STATUSES} from "../utils/httpStatuses";
import {handleErrorObjectResult} from "../utils/handleErrorObjectResult";
import {authMiddleware} from "../middleware/auth/auth-middleware";
import {commentValidators, likeStatusValidator} from "../validators/commentValidators";
import {ValidateErrorRequest} from "../utils/validateErrorRequest";
import jwt from "jsonwebtoken";


export const commentsRouter = express.Router()


commentsRouter.get('/:id', async (req: RequestType<ParamsType, {}, {}>, res: ResponseType<CommentViewModel | null>) => {
    const auth = req.headers['authorization']
    let userId: string = ''
    if (auth) {
        const [type, token] = auth.split(' ')
        if (type === 'Bearer') {
            try{
                const dataToken: any = jwt.verify(token, process.env.ACCESS_SECRET as string)
                userId = dataToken.userId
            } catch (error) {}
        }
    }

    const result = await CommentService.getCommentById(req.params.id, userId)
    if (result.status === ResultStatus.Success) return res.status(HTTP_STATUSES.OK_200).send(result.data)
    return handleErrorObjectResult(result, res)
})

commentsRouter.delete('/:id', authMiddleware, async (req: RequestType<ParamsType, {}, {}>, res: Response) => {
    const userId = req.user?.userId
    if (!userId) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
    const result = await CommentService.deleteComment(req.params.id, userId.toString())
    if (result.status === ResultStatus.NoContent) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return handleErrorObjectResult(result, res)
})

commentsRouter.put('/:id', authMiddleware, commentValidators(), async (req: RequestType<ParamsType, CommentInputModel, {}>, res: Response) => {
    const isError = ValidateErrorRequest(req, res)
    if(isError) return
    const userId = req.user?.userId.toString()
    if (!userId) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
    const result = await CommentService.updateComment(req.params.id, req.body, userId)
    if (result.status === ResultStatus.NoContent) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return handleErrorObjectResult(result, res)
})

commentsRouter.put('/:id/like-status', authMiddleware, likeStatusValidator, async (req: RequestType<ParamsType, LikeInputModel, {}>, res: Response) => {
    const isError = ValidateErrorRequest(req, res)
    if(isError) return
    const userId = req.user?.userId.toString()
    if (!userId) return res.sendStatus(HTTP_STATUSES.FORBIDDEN_403)
    const result = await CommentService.setLike(req.params.id, userId, req.body)
    if (result.status === ResultStatus.Success) return res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
    return handleErrorObjectResult(result, res)
})
