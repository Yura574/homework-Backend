import {PostInputModelType, PostViewModelType} from '../models/blogModels';
import {ObjectId} from 'mongodb';
import {blogCollection, postCollection} from '../db/db';


export class PostRepository {
    static async getPosts(pageSize:number, pageNumber: number,sortBy: string) {
        const skip = (pageNumber-1)* pageSize
        const totalCount = await postCollection.countDocuments()
        const sortObject: any = {}
        sortObject[sortBy] = -1
        const posts =  await postCollection.find({}).sort({createdAt: -1}).skip(skip).limit(pageSize).toArray()
        console.log(posts)
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
    static async getAllPostsByBlogId (blogId: string, pageNumber: number, pageSize: number, searchNameTerm: string | undefined) {
        let skip = (pageNumber - 1) * pageSize
        const totalCount = await postCollection.countDocuments({blogId, title: {$regex: searchNameTerm? searchNameTerm : ''}})
        const posts =  await postCollection.find({blogId, title: {$regex: searchNameTerm? searchNameTerm : ''}}).sort({createdAt: -1}).skip(skip).limit(pageSize).toArray()
        return {posts, totalCount}

}

    //
    static async createPost(data: PostInputModelType) {
        const blog = await blogCollection.findOne({_id: new ObjectId(data.blogId)})
        if (!blog) {
            return false
        }


        const {blogId, title, shortDescription, content} = data
        console.log(blogId)
        const newPost: PostViewModelType = {
            blogId,
            blogName: blog.name,
            title,
            shortDescription,
            content,
            createdAt: new Date().toISOString()
        }
        console.log(newPost)
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