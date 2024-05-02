import {Schema} from "mongoose";
import {ObjectId} from "mongodb";
import {LikeInfoSchema, LikeInfoType, LikeUserInfoSchema} from "./commonModels";

export type CommentInputModel = {
    content: string
}
export type LikeInputModel = {
    likeStatus: LikeStatus
}

export type LikeStatus = 'None' | 'Like' | 'Dislike'


export type CommentViewModel = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string,
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: StatusCommentType
    }
}
export type NewCommentModel = {
    content: string
    postId: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string,
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
    }
}
export type FullCommentModal =CommentDBModel & {_id: ObjectId}
export type StatusCommentType = 'None' | 'Like' | 'Dislike'

export type LikeUserInfoType = { userId: string, likeStatus: LikeStatus }
export type CommentatorInfoType = { userId: string, likeStatus: LikeStatus }
export type CommentDBModel = {
    content: string
    postId: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
    likesInfo: LikeInfoType
}
export const CommentatorInfoSchema = new Schema<CommentatorInfoType>({
    likeStatus: String,
    userId:String
})



export const CommentSchema = new Schema<CommentDBModel>({
    content: String,
    postId: String,
    commentatorInfo: CommentatorInfoSchema,
    createdAt: String,
    likesInfo: LikeInfoSchema
})
