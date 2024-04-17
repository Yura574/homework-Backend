import {ObjectId} from "mongodb";
import {NewCommentModel} from "../models/commentModel";
import {CommentModel} from "../db/db";


export class CommentRepository {

    static async getCommentsByPostId(postId: string, pageSize: number, pageNumber: number, sortBy: string, sortDirection: 'asc' | 'desc') {
        const skip = (pageNumber - 1) * pageSize
        const totalCount = await CommentModel.countDocuments({postId})
        const sortObject: any = {}
        sortObject[sortBy] = sortDirection === 'asc' ? 1 : -1
        const comments = await CommentModel.find({postId}).sort(sortObject).skip(skip).limit(pageSize).lean()
        return {comments, totalCount}
    }

    static async createComment(newComment: NewCommentModel) {
        const comment =  await CommentModel.create(newComment)
        return  CommentModel.findOne({_id: comment._id})
    }

    static async getCommentById(id: string) {
        return  CommentModel.findOne({_id: new ObjectId(id)})
    }

    static async deleteComment(id: string) {
        return  CommentModel.deleteOne({_id: new ObjectId(id)})
    }

    static async updateComment(content: string, id: string) {
        return  CommentModel.updateOne({_id: new ObjectId(id)}, {
            $set: {
                content
            }
        })
    }
}