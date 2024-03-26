import {commentCollection} from "../db/db";
import {ObjectId} from "mongodb";


export class CommentRepository {
    static async getCommentById(id: string) {
        return await commentCollection.findOne({_id: new ObjectId(id)})
    }

    static async deleteComment(id: string) {
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