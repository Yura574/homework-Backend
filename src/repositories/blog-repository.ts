import {ObjectId} from 'mongodb';
import {blogCollection} from '../db/db';
import {BlogInputModel, BlogViewModel, NewBlogModel} from "../models/blogModels";
import {ObjectResult, ResultStatus} from "../utils/objectResult";

export class BlogRepository {
    static async getBlogById(id: string) {
        return await blogCollection.findOne({"_id": new ObjectId(id)})

    }

    static async getAllBlogs(pageNumber: number, pageSize: number, sortBy: string, searchNameTerm: string | undefined, sortDirection: 'asc' | 'desc') {
        let skip = (pageNumber - 1) * pageSize
        const totalCount = await blogCollection.countDocuments({name: {$regex: searchNameTerm ? new RegExp(searchNameTerm, 'i') : ''}})
        if (skip > totalCount) {
            skip = 0
        }
        const sortObject: any = {}
        sortObject[sortBy] = sortDirection === 'asc' ? 1 : -1

        const blogs = await blogCollection.find({name: {$regex: searchNameTerm ? new RegExp(searchNameTerm, 'i') : ''}}).sort(sortObject).skip(skip).limit(+pageSize).toArray();
        return {blogs, totalCount}
    }

   static async createBlog(data: BlogInputModel): Promise<ObjectResult<BlogViewModel | null>> {
        const {name, description, websiteUrl} = data
        const newBlog: NewBlogModel  = {
            name,
            description,
            websiteUrl,
            isMembership: false,
            createdAt: new Date().toISOString()
        }

        try {
            const createdBlog = await blogCollection.insertOne(newBlog)
            const blog = await blogCollection.findOne({_id: createdBlog.insertedId})
            const returnBlog: BlogViewModel = {
                id: blog!._id.toString(),
                name,
                description,
                websiteUrl,
                isMembership: blog?.isMembership,
                createdAt: blog?.createdAt,
            }
            return {
                status: ResultStatus.Created,
                data: returnBlog
            }
        } catch (err) {
            return {
                status: ResultStatus.SomethingWasWrong,
                errorMessage: 'Something was wrong',
                data: null
            }
        }

    }

    static async deleteBlog(id: string) {
        console.log(id)
        return await blogCollection.deleteOne({_id: new ObjectId(id)})

    }

    static async updateBlog(id: string, name: string, description: string, websiteUrl: string) {
        const filter = {_id: new ObjectId(id)}
        const update = {
            $set: {
                name,
                description,
                websiteUrl
            }
        }
        return await blogCollection.updateOne(filter, update)
    }


}