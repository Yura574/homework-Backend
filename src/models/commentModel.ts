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

