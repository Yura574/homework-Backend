import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {CommentRepository} from "../repositories/comment-repository";
import {
    CommentDBModel,
    CommentInputModel,
    CommentViewModel,
    LikeInputModel,
    LikeStatus,
    LikeUserInfoType
} from "../models/commentModel";
import {QueryType} from "../routes/post-router";
import {PostRepository} from "../repositories/post-repository";
import {UserRepository} from "../repositories/user-repository";
import {ReturnViewModel} from "../models/commonModels";

export class CommentService {

    static async getCommentsByPostId(postId: string, userId: string, dataQuery: QueryType): Promise<ObjectResult<ReturnViewModel<CommentViewModel[]>>> {
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
            items: comments.map((comment: any) => {
                const findStatus = comment.likesInfo.likeUserInfo.find((like: LikeUserInfoType) => like.userId === userId)
                return {
                    id: comment._id.toString(),
                    content: comment.content,
                    createdAt: comment.createdAt,
                    commentatorInfo: {
                        userId: comment.commentatorInfo.userId,
                        userLogin: comment.commentatorInfo.userLogin,
                    },
                    likesInfo: {
                        likesCount: comment.likesInfo.likesCount,
                        dislikesCount: comment.likesInfo.dislikesCount,
                        myStatus: findStatus ? findStatus.likeStatus : 'None'
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
            },
            likesInfo: {
                likesCount: findComment.likesInfo.likesCount,
                dislikesCount: findComment.likesInfo.dislikesCount,
                myStatus: 'Like'
            }
        }
        return {status: ResultStatus.Success, data: comment}
    }

    static async createComment(data: CommentInputModel, postId: string, userId: string): Promise<ObjectResult<CommentViewModel | null>> {
        const post = await PostRepository.getPostById(postId)
        if (!post) return {status: ResultStatus.NotFound, errorsMessages: 'Post not found', data: null}

        const user = await UserRepository.getUserById(userId)
        if (!user) {
            return {status: ResultStatus.NoContent, errorsMessages: 'User not found', data: null}
        }
// const me = AuthService.
        const newComment: CommentDBModel = {
            content: data.content,
            postId,
            commentatorInfo: {
                userId,
                userLogin: user.login
            },
            createdAt: new Date().toISOString(),
            likesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                likeUserInfo: []
            }
        }
        try {
            const comment = await CommentRepository.createComment(newComment)
            if (!comment) return {status: ResultStatus.SomethingWasWrong, data: null}
            const createdComment: CommentViewModel = {
                id: comment._id.toString(),
                content: comment.content,
                createdAt: comment.createdAt,
                commentatorInfo: {
                    userId: comment.commentatorInfo.userId.toString(),
                    userLogin: comment.commentatorInfo.userLogin,
                },
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: "None"
                }


            }
            return {status: ResultStatus.Success, data: createdComment}
        } catch (err) {
            return {status: ResultStatus.SomethingWasWrong, errorsMessages: 'Something was wrong', data: null}
        }
    }

    static async deleteComment(commentId: string, userId: string): Promise<ObjectResult> {
        const findComment = await CommentRepository.getCommentById(commentId)
        if (!findComment) {
            return {status: ResultStatus.NotFound, errorsMessages: 'Comment not found', data: null}
        }
        if (findComment.commentatorInfo.userId !== userId) {
            return {status: ResultStatus.Forbidden, errorsMessages: 'It isn`t your comment', data: null}
        }

        try {
            await CommentRepository.deleteComment(commentId)
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

    static async updateLikeStatus(commentId: string, userId: string, likeStatus: LikeStatus) {

    }

    static async setLike(commentId: string, userId: string, data: LikeInputModel): Promise<ObjectResult<string | null>> {
        const findComment = await CommentRepository.getCommentById(commentId)
        const likes = findComment?.likesInfo.likeUserInfo.filter(comment => comment.likeStatus === 'Like')
        const dislikes = findComment?.likesInfo.likeUserInfo.filter(comment => comment.likeStatus === 'Dislike')
        if (!findComment) return {status: ResultStatus.NotFound, data: 'comment not found'}
        const findLikeUser = findComment.likesInfo.likeUserInfo.find((userInfo: LikeUserInfoType) => userInfo.userId === userId)

        let likeCount = likes?.length
        if (!likeCount) likeCount = 0

        let dislikeCount = dislikes?.length
        if (!dislikeCount) dislikeCount = 0

        // Проверяем лайкал ли пользователь комментарий
        if (findLikeUser) {
            //Если отпраленный статус лайка совпадает со статусом лайка в бд, то ничего не меняем
            if (findLikeUser.likeStatus === data.likeStatus) return {status: ResultStatus.Success, data: null}
            //Может храниться только один статус лайка пользователя
            //Соответвенно проверяем какой статус лайка отправил пользователь, пересчитываем общее количество лайков,
            // удаляем предыдущий статус пользователя, и записываем новый статус
            if (data.likeStatus === 'Like') {
                ++likeCount
                --dislikeCount
                await CommentRepository.deleteLike(commentId, userId, 'dislikesCount', dislikeCount)
                await CommentRepository.setLike(commentId, userId, data.likeStatus, 'likesCount', likeCount)
            }
            if (data.likeStatus === 'Dislike') {
                ++dislikeCount
                --likeCount
                await CommentRepository.deleteLike(commentId, userId, 'likesCount', likeCount)
                await CommentRepository.setLike(commentId, userId, data.likeStatus, 'dislikesCount', dislikeCount)
            }
        } else if (data.likeStatus === 'Like') {
            //Если пользовальтель лайк не ставил, то в зависимости от от статуса устанавливаем лайк или дизлайк
            ++likeCount
            await CommentRepository.setLike(commentId, userId, data.likeStatus, 'likesCount', likeCount)
        } else if (data.likeStatus === 'Dislike') {
            ++dislikeCount
            await CommentRepository.setLike(commentId, userId, data.likeStatus, 'dislikesCount', dislikeCount)
        }


        return {status: ResultStatus.Success, data: null}
    }
}