import {WithId} from "mongodb";
import {Schema} from "mongoose";


export type PostInputModel = {
    title: string
    shortDescription: string
    content: string
    blogId: string
}

export type PostViewModel = {
    id: string
    title: string
    shortDescription: string
    content: string
    blogId: string
    blogName: string
    createdAt?: string
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
}>

export const PostSchema = new Schema<PostDBType>({
    title: String,
    blogId: String,
    blogName: String,
    content: String,
    shortDescription: String,
    createdAt: String
})
