import request from "supertest";
import {app, routerPaths} from "../../settings";
import {CommentInputModel} from "../../models/commentModel";
import {HTTP_STATUSES, HttpStatusType} from "../httpStatuses";


export const commentsTestManager = {
    async createComment(postId: string, data: CommentInputModel, queryParams: string = '', statusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        const newComment = {
            id: "string",
            content: data.content,
            commentatorInfo: {
                userId: "string",
                userLogin: "string"
            },
            createdAt: "2024-03-19T23:53:15.772Z"

        }
        const res = await request(app)
            .post(`${routerPaths.posts}/${postId}/comments?${queryParams}`)
            .auth('admin', 'qwerty')
            .send(data)
            .expect(statusCode)

        return res.body


    }
}