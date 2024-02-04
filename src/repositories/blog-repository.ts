import {ObjectId} from 'mongodb';
import {blogCollection} from '../db/db';

export class BlogRepository {
    static async getBlogById(id: string) {
        console.log(id)
        console.log(await blogCollection.findOne({"_id": new ObjectId(id)}))
        return await blogCollection.findOne({"_id": new ObjectId(id)})

    }

    static async getAllBlogs(pageNumber: number, pageSize: number, searchNameTerm: string | undefined) {
        let skip = (pageNumber - 1) * pageSize
        const totalCount = await blogCollection.countDocuments({name: {$regex: searchNameTerm? searchNameTerm : ''}})
        if (skip > totalCount) {
            skip = 0
        }

        const blogs = await blogCollection.find({name: {$regex: searchNameTerm? searchNameTerm : ''}}).sort({createdAt: -1}).skip(skip).limit(+pageSize).toArray();
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