import {ObjectId} from 'mongodb';
import {NewPostModel, PostInputModel, PostViewModel} from "../models/postModels";
import {PostModel} from "../db/db";


export class PostRepository {
    static async getPosts(pageSize: number, pageNumber: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        const skip = (pageNumber - 1) * pageSize
        const totalCount = await PostModel.countDocuments()
        const sortObject: any = {}
        sortObject[sortBy] = sortDirection === 'asc' ? 1 : -1
        const posts = await PostModel.find({}).sort(sortObject).skip(skip).limit(pageSize).lean()
        return {posts, totalCount}
    }

    static async getPostById(id: string): Promise<PostViewModel | null> {
        const post = await PostModel.findById({_id: id})
        if (!post) return null
        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            createdAt: post.createdAt,
            blogId: post.blogId,
            blogName: post.blogName
        }
    }

    static async getAllPostsByBlogId(blogId: string, pageNumber: number, pageSize: number, searchNameTerm: string, sortBy: string, sortDirection: 'asc' | 'desc') {
        let skip = (pageNumber - 1) * pageSize

        const totalCount = await PostModel.countDocuments({
            blogId,
            title: {$regex: searchNameTerm ? new RegExp(searchNameTerm, 'i') : ''}
        })
        if (skip > totalCount) {
            skip = 0
        }
        const sortObject: any = {}
        sortObject[sortBy] = sortDirection === 'asc' ? 1 : -1
        const posts = await PostModel.find({
            blogId,
            title: {$regex: searchNameTerm ? new RegExp(searchNameTerm, 'i') : ''}
        })
            .sort(sortObject).skip(skip).limit(+pageSize).lean();
        return {posts, totalCount}
    }

    static async createPost(newPost: NewPostModel) {
        const createdPost = await PostModel.create(newPost)
        const post = await PostModel.findOne({_id: createdPost._id})
        if (!post) return null
        const returnPost: PostViewModel = {
            id: post!._id.toString(),
            title: post.title,
            content: post?.content,
            shortDescription: post?.shortDescription,
            blogId: post?.blogId,
            blogName: post?.blogName,
            createdAt: post?.createdAt,
        }
        return returnPost

    }

    static async deletePost(id: string) {
        try {
            await PostModel.deleteOne({_id: id})
            return true
        } catch (err) {
            return false
        }
    }


    static async updatePost(id: string, data: PostInputModel) {
        const {title, shortDescription, content} = data
        const updatedPost = {
            $set: {
                shortDescription,
                content,
                title,
            }

        }
        return PostModel.updateOne({_id: new ObjectId(id)}, updatedPost)
    }
}