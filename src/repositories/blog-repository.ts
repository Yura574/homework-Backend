import {ObjectId} from 'mongodb';
import {BlogInputModel, BlogViewModel, NewBlogModel} from "../models/blogModels";
import {ObjectResult, ResultStatus} from "../utils/objectResult";
import {BlogModel} from "../db/db";

export class BlogRepository {
    static async getBlogById(id: string) {
        return BlogModel.findOne({_id: id})

    }

    static async getAllBlogs(pageNumber: number, pageSize: number, sortBy: string, searchNameTerm: string | undefined, sortDirection: 'asc' | 'desc') {
        let skip = (pageNumber - 1) * pageSize
        const totalCount = await BlogModel.countDocuments({name: {$regex: searchNameTerm ? new RegExp(searchNameTerm, 'i') : ''}})
        if (skip > totalCount) {
            skip = 0
        }
        const sortObject: any = {}
        sortObject[sortBy] = sortDirection === 'asc' ? 1 : -1

        const blogs = await BlogModel.find({name: {$regex: searchNameTerm ? new RegExp(searchNameTerm, 'i') : ''}}).sort(sortObject).skip(skip).limit(+pageSize).lean();
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
            const createdBlog = await BlogModel.create(newBlog)
            const blog = await BlogModel.findOne({_id: createdBlog._id})
            if(!blog) return {status: ResultStatus.NotFound, errorsMessages: 'Blog nor found', data: null}
            const returnBlog: BlogViewModel = {
                id: blog._id.toString(),
                name,
                description,
                websiteUrl,
                isMembership: blog.isMembership,
                createdAt: blog.createdAt,
            }
            return {
                status: ResultStatus.Created,
                data: returnBlog
            }
        } catch (err) {
            return {
                status: ResultStatus.SomethingWasWrong,
                errorsMessages: 'Something was wrong',
                data: null
            }
        }

    }

    static async deleteBlog(id: string) {
        console.log(id)
        return  BlogModel.deleteOne({_id: new ObjectId(id)})

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
        return  BlogModel.updateOne(filter, update)
    }


}