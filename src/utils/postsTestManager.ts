import {PostInputModelType, PostViewModelType} from '../models/blogModels';
import request from 'supertest';
import {app, routerPaths} from '../settings';
import {HTTP_STATUSES, HttpStatusType} from './httpStatuses';


export const postsTestManager = {
    async createPost(blogId: string, blogName: string) {
        const data: PostInputModelType = {
            title: "new post",
            content: "lololo",
            shortDescription: 'lalala',
            blogId
        }
        const res = await request(app)
            .post(`${routerPaths.posts}`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .send(data)
            .expect(HTTP_STATUSES.CREATED_201)
        expect(res.body).toEqual({
            id: expect.any(String),
            title: data.title,
            shortDescription: data.shortDescription,
            content: data.content,
            blogId,
            blogName,
        })
        const post: PostViewModelType = res.body
        return {res, post}
    },

    async getPostById(id: string) {
      const res=   await request(app)
            .get(`${routerPaths.posts}/${id}`)
            .expect(200)
        return res.body
    },

    async deletePost(id: string, statusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        await request(app)
            .delete(`${routerPaths.posts}/${id}`)
            .auth('admin', 'qwerty', {type: 'basic'})
            .expect(statusCode)
    },

    async updatedPost(id: string, data: PostInputModelType) {

        await request(app)
            .put(`${routerPaths.posts}/${id}`)
            .auth('admin', 'qwerty')
            .send(data)
            .expect(204)

    }
}