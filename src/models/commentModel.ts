import {Schema} from "mongoose";

export type CommentInputModel = {
    content: string
}
export type LikeInputModel = {
    likeStatus: LikeStatus
}
export enum LikeStatus {
    None= 'None',
    Like= 'Like',
    Dislike= 'Dislike',
}


export type CommentViewModel = {
    id: string,
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string,
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: StatusCommentType
    }
}
export type NewCommentModel = {
    content: string
    postId: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string,
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
    }
}
export type StatusCommentType = 'None' | 'Like' | 'Dislike'


export type CommentDBModel = {
    content: string
    postId: string
    commentatorInfo: {
        userId: string
        userLogin: string
    }
    createdAt: string
    likesInfo: {
        likesCount: number,
        dislikesCount: number,
        likeUserInfo: {userId: string, likeStatus: LikeStatus}[]
    }
}

export const CommentSchema = new Schema<CommentDBModel>({
    content: String,
    postId: String,
    commentatorInfo: {
        userId: String,
        userLogin: String
    },
    createdAt: String,
    likesInfo: {
        likesCount: Number,
        dislikesCount: Number,
        commentatorsInfo: Array
    }
})
