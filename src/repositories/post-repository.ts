import {ObjectId} from 'mongodb';
import {postCollection} from '../db/db';
import {NewPostModel, PostInputModel, PostViewModel} from "../models/postModels";


export class PostRepository {
    static async getPosts(pageSize: number, pageNumber: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        const skip = (pageNumber - 1) * pageSize
        const totalCount = await postCollection.countDocuments()
        const sortObject: any = {}
        sortObject[sortBy] = sortDirection === 'asc' ? 1 : -1
        const posts = await postCollection.find({}).sort(sortObject).skip(skip).limit(pageSize).toArray()
        return {posts, totalCount}
    }

    static async getPostById(id: string): Promise<PostViewModel> {
        const post = await postCollection.findOne({_id: new ObjectId(id)})
        return {
            id: post!._id.toString(),
            title: post?.title,
            shortDescription: post?.shortDescription,
            content: post?.content,
            createdAt: post?.createdAt,
            blogId: post?.blogId,
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

    static async createPost(newPost: NewPostModel) {
        const {insertedId} = await postCollection.insertOne(newPost)
        const post = await postCollection.findOne({_id: insertedId})
        const returnPost: PostViewModel = {
            id: post!._id.toString(),
            title: post?.title,
            content: post?.content,
            shortDescription: post?.shortDescription,
            blogId: post?.blogId,
            blogName: post?.blogName,
            createdAt: post?.createdAt,
        }
        return returnPost

    }

    static async deletePost(id: string) {
        const index = await postCollection.deleteOne({_id: new ObjectId(id)})
        return !!index;
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
        return await postCollection.updateOne({_id: new ObjectId(id)}, updatedPost)
    }
}