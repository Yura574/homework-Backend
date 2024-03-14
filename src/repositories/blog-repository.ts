import {ObjectId} from 'mongodb';
import {blogCollection} from '../db/db';
import {isNumber} from "node:util";
import {isNumberObject} from "node:util/types";

export class BlogRepository {
    static async getBlogById(id: string) {
        return await blogCollection.findOne({"_id": new ObjectId(id)})

    }

    static async getAllBlogs(pageNumber: number, pageSize: number,sortBy: string, searchNameTerm: string | undefined, sortDirection: 'asc'| 'desc') {
        let skip = (pageNumber - 1) * pageSize
        const totalCount = await blogCollection.countDocuments({name: {$regex: searchNameTerm? searchNameTerm : ''}})
        if (skip > totalCount) {
            skip = 0
        }
        const sortObject: any = {}
        sortObject[sortBy] = sortDirection === 'asc'? 1 : -1

        const blogs = await blogCollection.find({name: {$regex: searchNameTerm? searchNameTerm : ''}}).sort(sortObject).skip(skip).limit(+pageSize).toArray();
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