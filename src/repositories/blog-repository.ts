import {ObjectId} from 'mongodb';
import {blogCollection} from '../db/db';
import {log} from 'node:util';

export class BlogRepository {
    static async getBlogById(id: string) {
        return await blogCollection.findOne({"_id": new ObjectId(id)})

    }

    static async getAllBlogs(pageNumber: number, pageSize: number) {
        let skip = (pageNumber - 1) * pageSize
        const totalCount = await blogCollection.countDocuments({})
        if (skip > totalCount) {
            skip = 0
        }
        const blogs = await blogCollection.find({}).skip(skip).limit(+pageSize).toArray();
        return {blogs, totalCount}
    }

    static async deleteBlog(id: string) {
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
        console.log(name)
        return await blogCollection.updateOne(filter, update)
    }


}