import {Schema} from "mongoose";

export type CommentInputModel = {
    content: string
}


export type CommentViewModel = {
    id: string
    content: string
    // postId: string
    commentatorInfo: {
        userId: string
        userLogin: string
    },
    createdAt: string
}

export type NewCommentModel = {
    content: string
    postId: string
    commentatorInfo:{
        userId: string
        userLogin: string
    }
    createdAt: string
}


export type CommentDBModel = {
    content: string
    commentatorInfo:{
        userId: string
        userLogin: string
    }
    createdAt: string
}

export const CommentSchema  = new Schema<CommentDBModel>({
    content: String,
    commentatorInfo: {
        userId: String,
        userLogin: String
    },
    createdAt: String,
})
