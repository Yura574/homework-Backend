import {commentCollection} from "../db/db";
import {ObjectId} from "mongodb";
import {NewCommentModel} from "../models/commentModel";


export class CommentRepository {

    static async getCommentsByPostId(postId: string, pageSize: number, pageNumber: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        const skip = (pageNumber - 1) * pageSize
        const totalCount = await commentCollection.countDocuments({postId})
        const sortObject: any = {}
        sortObject[sortBy] = sortDirection === 'asc' ? 1 : -1
        const comments = await commentCollection.find({postId}).sort(sortObject).skip(skip).limit(pageSize).toArray()
        console.log(comments, totalCount)
        return {comments, totalCount}
    }

    static async createComment(newComment: NewCommentModel) {
        const comment =  await commentCollection.insertOne(newComment)
        return await commentCollection.findOne({_id: comment.insertedId})
    }

    static async getCommentById(id: string) {
        return await commentCollection.findOne({_id: new ObjectId(id)})
    }

    static async deleteComment(id: string) {
        console.log(id)
        return await commentCollection.deleteOne({_id: new ObjectId(id)})
    }

    static async updateComment(content: string, id: string) {
        return await commentCollection.updateOne({_id: new ObjectId(id)}, {
            $set: {
                content
            }
        })
    }
}