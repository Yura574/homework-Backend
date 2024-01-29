import {ObjectId} from 'mongodb';
import {blogCollection} from '../db/db';

export class BlogRepository {
    static async getBlogById(id: string) {
        return await blogCollection.findOne({"_id": new ObjectId(id)})

    }

    static async getAllBlogs(pageNumber: number, pageSize: number) {
        const skip = pageNumber * pageSize +1
        const count = await blogCollection.count()
        console.log(count)
        return blogCollection.find({}).skip(skip).limit(pageSize).toArray();
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