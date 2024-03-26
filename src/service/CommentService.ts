import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {CommentRepository} from "../repositories/comment-repository";
import {CommentInputModel, CommentViewModel} from "../models/commentModel";

export class CommentService {
    static async getComment(id: string): Promise<ObjectResult<CommentViewModel | null>> {
        const findComment = await CommentRepository.getCommentById(id)
        if (!findComment) {
            return {status: ResultStatus.BadRequest, errorMessage: 'Comment not found', data: null}
        }
        const comment: CommentViewModel = {
            id: findComment._id.toString(),
            content: findComment.content,
            createdAt: findComment.createdAt,
            commentatorInfo: {
                userId: findComment.cocommentatorInfo.userId,
                userLogin: findComment.cocommentatorInfo.userLogin,
            }
        }
        return {status: ResultStatus.Success, data: comment}
    }

    static async deleteComment(id: string, userId: string): Promise<ObjectResult> {
        const findComment = await CommentRepository.getCommentById(id)
        if (!findComment) {
            return {status: ResultStatus.NotFound, errorMessage: 'Comment not found', data: null}
        }
        if (findComment.commentatorInfo.userId !== userId) {
            return {status: ResultStatus.Forbidden, errorMessage: 'It isn`t your comment', data: null}
        }
        try {
            await CommentRepository.deleteComment(id)
            return {status: ResultStatus.NoContent, data: null}
        } catch (err) {
            console.warn(err)
            return {status: ResultStatus.SomethingWasWrong, errorMessage: 'Something was wrong', data: null}
        }
    }

    static async updateComment(id: string, data: CommentInputModel, userId: string): Promise<ObjectResult> {
        const findComment = await CommentRepository.getCommentById(id)
        if (!findComment) {
            return {status: ResultStatus.NotFound, errorMessage: 'Comment not found', data: null}
        }
        if (findComment.commentatorInfo.userId !== userId) {
            return {status: ResultStatus.Forbidden, errorMessage: 'It isn`t your comment', data: null}
        }
        try {
            await CommentRepository.updateComment(data.content, id)
            return {status: ResultStatus.NoContent, data: null}
        } catch (err) {
            console.warn(err)
            return {status: ResultStatus.SomethingWasWrong, errorMessage: 'Something was wrong', data: null}
        }

    }
}