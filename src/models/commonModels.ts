import {LikeStatus} from "./commentModel";
import {Schema} from "mongoose";

export type ReturnViewModel<Items> = {
    pagesCount: number,
    totalCount: number,
    page: number,
    pageSize: number,
    items: Items
}



export type FieldErrorType = {
    message: string
    field: string
}

export type ErrorResultModel = {
    errorsMessages: FieldErrorType[]
}

export type StatusCommentType = 'None' | 'Like' | 'Dislike'

export type LikeUserInfoType = { userId: string, likeStatus: LikeStatus, createdAt: string }

export type LikeInfoType = {
likesCount: number,
dislikesCount: number,
likeUserInfo: LikeUserInfoType[]
}
export const LikeUserInfoSchema = new Schema<LikeUserInfoType>({
    userId: String,
    likeStatus: String,
    createdAt: String
})

export const LikeInfoSchema = new Schema<LikeInfoType>({
    likesCount: Number,
    dislikesCount: Number,
    likeUserInfo: LikeUserInfoSchema
})