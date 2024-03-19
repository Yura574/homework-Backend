import {ObjectId} from 'mongodb';
import {blogCollection, postCollection} from '../db/db';
import {PostInputModel, PostViewModel} from "../models/postModels";


export class PostRepository {
    static async getPosts(pageSize: number, pageNumber: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        const skip = (pageNumber - 1) * pageSize
        const totalCount = await postCollection.countDocuments()
        const sortObject: any = {}
        sortObject[sortBy] = sortDirection === 'asc' ? 1 : -1
        const posts = await postCollection.find({}).sort(sortObject).skip(skip).limit(pageSize).toArray()
        return {posts, totalCount}
    }

    static async getPostById(id: string) {
        const post = await postCollection.findOne({_id: new ObjectId(id)})
        return {
            id: post?._id,
            blogId: post?.blogId,
            title: post?.title,
            shortDescription: post?.shortDescription,
            content: post?.content,
            createdAt: post?.createdAt,
            blogName: post?.blogName
        }
    }

    static async getAllPostsByBlogId(blogId: string, pageNumber: number, pageSize: number, searchNameTerm: string, sortBy: string, sortDirection: 'asc' | 'desc') {
        let skip = (pageNumber - 1) * pageSize

        const totalCount = await postCollection.countDocuments({
            blogId,
            title: {$regex: searchNameTerm ? new RegExp(searchNameTerm, 'i') : ''}
        })
        if (skip > totalCount) {
            skip = 0
        }
        const sortObject: any = {}
        sortObject[sortBy] = sortDirection === 'asc' ? 1 : -1
        const posts = await postCollection.find({
            blogId,
            title: {$regex: searchNameTerm ? new RegExp(searchNameTerm, 'i') : ''}
        })
            .sort(sortObject).skip(skip).limit(+pageSize).toArray();
        return {posts, totalCount}
    }

    //
    static async createPost(data: PostInputModel) {

        const {blogId, content, shortDescription, title} = data
        const blog = await blogCollection.findOne({_id: new ObjectId(data.blogId)})
        //если блог не найден, пост нельзя создать
        if (!blog) {
            return false
        }
        const newPost = {
            title,
            content,
            blogId,
            shortDescription,
            blogName: blog.name,
            createdAt: new Date().toISOString(),

        }
        const {insertedId} = await postCollection.insertOne(newPost)
        const post = await postCollection.findOne({_id: insertedId})
        if (post) {
            const newPost: PostViewModel = {
                id: post._id.toString(),
                title: post.title,
                content: post.content,
                shortDescription: post.shortDescription,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
            }
            return newPost
        }

        return false


    }

    static async deletePost(id: string) {
        const index = await postCollection.deleteOne({_id: new ObjectId(id)})
        return !!index;
    }


    static async updatePost(id: string, data: PostInputModel) {
        const {title, shortDescription, content} = data
        const post = await postCollection.findOne({_id: new ObjectId(id)})
        if (post) {
            const updatedPost = {
                $set: {
                    shortDescription,
                    content,
                    title,
                }

            }
            await postCollection.updateOne({_id: new ObjectId(id)}, updatedPost)
            return true
        }
        return false
    }
}