import { PostInputModelType, PostViewModelType} from '../models/blogModels';
import {ObjectId} from 'mongodb';
import {blogCollection, postCollection} from '../db/db';


export class PostRepository {
    static async getAllPost() {
        return await postCollection.find({}).toArray()
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

    //
    static async createPost(data: PostInputModelType) {
        const blog = await blogCollection.findOne({_id: new ObjectId(data.blogId)})
        if (!blog) {
            return false
        }

        const {blogId, title, shortDescription, content} = data
        const newPost: PostViewModelType = {
            blogId,
            blogName: blog.name,
            title,
            shortDescription,
            content,
            createdAt: new Date().toISOString()
        }

        return newPost
    }

    static async deletePost(id: string) {
        const index = await postCollection.deleteOne({_id: new ObjectId(id)})
        console.log(index)
        return true
    }


    static async updatePost(id: string, data: PostInputModelType) {
        const {title, shortDescription, content} = data
        const post = await postCollection.findOne({_id: new ObjectId(id)})
        if (post) {
            const updatedPost = {
                $set :{
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