import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {CommentRepository} from "../repositories/comment-repository";
import {CommentInputModel, CommentViewModel, NewCommentModel} from "../models/commentModel";
import {QueryType} from "../routes/post-router";
import {PostRepository} from "../repositories/post-repository";
import {UserRepository} from "../repositories/user-repository";
import {ObjectId} from "mongodb";
import {ReturnViewModel} from "../models/commonModels";

export class CommentService {

    static async getCommentsByPostId(postId: string, dataQuery: QueryType): Promise<ObjectResult<ReturnViewModel<CommentViewModel[]> >> {
        const {pageSize = 10, pageNumber = 1, sortBy = 'createdAt', sortDirection = 'desc'} = dataQuery

        const {
            comments,
            totalCount
        } = await CommentRepository.getCommentsByPostId(postId, +pageSize, +pageNumber, sortBy, sortDirection)

        const pagesCount = Math.ceil(totalCount / +pageSize)

        const returnComments: ReturnViewModel<CommentViewModel[]> = {
            pagesCount,
            page: +pageNumber,
            pageSize: +pageSize,
            totalCount,
            items: comments.map((comment) => {
                return {
                    id: comment._id.toString(),
                    // postId: comment.postId,
                    content: comment.content,
                    createdAt: comment.createdAt,
                    commentatorInfo: {
                        userId: comment.commentatorInfo.userId,
                        userLogin: comment.commentatorInfo.userLogin,
                    }
                }
            })
        }

        return {status: ResultStatus.Success, data: returnComments}
    }

    static async getCommentById(id: string): Promise<ObjectResult<CommentViewModel | null>> {
        const findComment = await CommentRepository.getCommentById(id)
        if (!findComment) {
            return {status: ResultStatus.NotFound, errorsMessages: 'Comment not found', data: null}
        }
        const comment: CommentViewModel = {
            id: findComment._id.toString(),
            // postId: findComment.postId,
            content: findComment.content,
            createdAt: findComment.createdAt,
            commentatorInfo: {
                userId: findComment.commentatorInfo.userId,
                userLogin: findComment.commentatorInfo.userLogin,
            }
        }
        return {status: ResultStatus.Success, data: comment}
    }

    static async createComment(data: CommentInputModel, postId: string, userId: string): Promise<ObjectResult<CommentViewModel | null>> {

        const post = await PostRepository.getPostById(postId)
        console.log(post)
        if (!post) return {status: ResultStatus.NotFound, errorsMessages: 'Post not found', data: null}
        const user = await UserRepository.getUserById(new ObjectId(userId))
        if (!user) return {status: ResultStatus.NoContent, errorsMessages: 'User not found', data: null}
// const me = AuthService.
        const newComment: NewCommentModel = {
            content: data.content,
            postId,
            commentatorInfo: {
                userId,
                userLogin: user.login
            },
            createdAt: new Date().toISOString()
        }
        try {
            const comment = await CommentRepository.createComment(newComment)
            const createdComment: CommentViewModel = {
                id: comment!._id.toString(),
                // postId: postId,
                content: comment?.content,
                createdAt: comment?.createdAt,
                commentatorInfo: {
                    userId: comment?.commentatorInfo.userId,
                    userLogin: comment?.commentatorInfo.userLogin,
                }


            }
            return {status: ResultStatus.Success, data: createdComment}
        } catch (err) {
            return {status: ResultStatus.SomethingWasWrong, errorsMessages: 'Something was wrong', data: null}
        }
    }

    static async deleteComment(id: string, userId: string): Promise<ObjectResult> {
        const findComment = await CommentRepository.getCommentById(id)
        if (!findComment) {
            return {status: ResultStatus.NotFound, errorsMessages: 'Comment not found', data: null}
        }
        if (findComment.commentatorInfo.userId!== userId) {
            return {status: ResultStatus.Forbidden, errorsMessages: 'It isn`t your comment', data: null}
        }

        try {
            await CommentRepository.deleteComment(id)
            return {status: ResultStatus.NoContent, data: null}
        } catch (err) {
            console.warn(err)
            return {status: ResultStatus.SomethingWasWrong, errorsMessages: 'Something was wrong', data: null}
        }
    }

    static async updateComment(id: string, data: CommentInputModel, userId: string): Promise<ObjectResult> {
        const findComment = await CommentRepository.getCommentById(id)
        if (!findComment) {
            return {status: ResultStatus.NotFound, errorsMessages: 'Comment not found', data: null}
        }
        if (findComment.commentatorInfo.userId !== userId) {
            return {status: ResultStatus.Forbidden, errorsMessages: 'It isn`t your comment', data: null}
        }
        try {
            await CommentRepository.updateComment(data.content, id)
            return {status: ResultStatus.NoContent, data: null}
        } catch (err) {
            console.warn(err)
            return {status: ResultStatus.SomethingWasWrong, errorsMessages: 'Something was wrong', data: null}
        }

    }
}