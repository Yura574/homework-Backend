import request from 'supertest';
import {app, routerPaths} from '../../src/settings';
import {HTTP_STATUSES, HttpStatusType} from '../../src/utils/httpStatuses';
import {PostInputModel, PostViewModel} from "../../src/models/postModels";


export const postsTestManager = {
    async createPost(blogId: string, blogName: string, title? : string) {
        const data: PostInputModel = {
            title: title? title :"new post",
            content: "lololo",
            shortDescription: 'lalala',
            blogId
        }
        const res = await request(app)
            .post(`${routerPaths.posts}`)
            .auth('admin', {type: 'bearer'})
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)

        expect(res.body).toEqual({
            id: expect.any(String),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId,
            blogName,
            createdAt: expect.any(String)
        })
        const post: PostViewModel = res.body
        return {res, post}
    },

    async getPostById(id: string) {
        const res = await request(app)
            .get(`${routerPaths.posts}/${id}`)
            .expect(200)
        return res.body
    },

    async deletePost(id: string, statusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        await request(app)
            .delete(`${routerPaths.posts}/${id}`)
            .auth('admin', {type: 'bearer'})
            .expect(statusCode)
    },

    async updatedPost(id: string, data: PostInputModel) {

        await request(app)
            .put(`${routerPaths.posts}/${id}`)
            .auth('admin', {type: 'bearer'})
            .send(data)
            .expect(204)

    }
}