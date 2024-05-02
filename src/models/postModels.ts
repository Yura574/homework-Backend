import {WithId} from "mongodb";
import {Schema} from "mongoose";
import {LikeStatus} from "./commentModel";


export type PostInputModel = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type NewestLikesType = {
    addedAt: string,
    userId: string,
    login: string
}
export type LikeUserInfoType = {
    userId: string
    likeStatus: LikeStatus,
    login: string,
    createdAt: string
}
export type ExtendedLikesInfoType = {
    likesCount: number,
    dislikesCount: number,
    likeUserInfo: LikeUserInfoType[],
}
export type PostViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt?: string
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: LikeStatus,
        newestLikes: NewestLikesType[]
}

}
export type NewPostModel = {
    title: string,
    content: string,
    blogId: string,
    shortDescription: string,
    blogName: string,
    createdAt: string,
}
export type PostDBType = WithId<{
    title: string,
    content: string,
    blogId: string,
    shortDescription: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: ExtendedLikesInfoType
}>

export const LikeUserInfoSchema = new Schema<LikeUserInfoType>({
    userId: String,
    likeStatus: Number,
    login: String,
    createdAt: String,
})

export const ExtendedLikesInfoSchema = new Schema<ExtendedLikesInfoType>({
    likesCount: Number,
    dislikesCount: Number,
    likeUserInfo: LikeUserInfoSchema,
})


export const PostSchema = new Schema<PostDBType>({
    title: String,
    blogId: String,
    blogName: String,
    content: String,
    shortDescription: String,
    createdAt: String,
    extendedLikesInfo: ExtendedLikesInfoSchema


})
