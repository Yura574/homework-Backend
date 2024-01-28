
import {blogCollection} from '../index';
import {ObjectId} from 'mongodb';

export class BlogRepository {
    static async getBlogById(id: string) {
        return await blogCollection.findOne({"_id": new ObjectId(id)})

    }

    static async getAllBlogs() {
        return blogCollection.find({});
    }

    // static deleteBlog(id: string) {
    //     const index = db.blogs.findIndex(b => b.id === id)
    //     if (index >= 0) {
    //         db.blogs.splice(index, 1)
    //         return true
    //     }
    //     return false
    // }

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
        return  await blogCollection.updateOne(filter, update)
    }


}