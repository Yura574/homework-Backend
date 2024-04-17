import {WithId} from "mongodb";
import {Schema} from "mongoose";

export type BlogViewModel = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogInputModel = {
    name: string
    description: string
    websiteUrl: string
}

export type BlogPostInputModel = {
    title: string,
    shortDescription: string,
    content: string
}

export type NewBlogModel = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}

export type BlogDBType = WithId<{
    // id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean
}>

export const BlogSchema = new Schema<BlogDBType>({
    name: String,
    description: String,
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean
})

