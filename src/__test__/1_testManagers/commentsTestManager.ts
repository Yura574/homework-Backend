import {CommentInputModel} from "../../models/commentModel";
import request from "supertest";
import {app, routerPaths} from "../../settings";
import {HTTP_STATUSES, HttpStatusType} from "../../utils/httpStatuses";


export const commentsTestManager = {
    async createComment(token: string, postId: string, data: CommentInputModel, statusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        const res = await request(app)
            .post(`${routerPaths.posts}/${postId}/comments`)
            .auth(token, {type: 'bearer'})
            .send(data)
            .expect(statusCode)

        return res.body


    }
}