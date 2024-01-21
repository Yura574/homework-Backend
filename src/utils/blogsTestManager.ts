import request from 'supertest';
import {app, routerPaths} from '../settings';
import {BlogInputModelType, BlogViewModelType} from '../models/blogModels';
import {HTTP_STATUSES, HttpStatusType} from './httpStatuses';


export const blogsTestManager = {
    async createBlog(data: BlogInputModelType, statusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        const res = await request(app)
            .post(routerPaths.blogs)
            .auth('admin', 'qwerty', {type: 'basic'})
            .send(data)
        let newBlog
        if (statusCode === HTTP_STATUSES.CREATED_201) {
            newBlog = res.body
            expect(newBlog).toEqual({
                id: expect.any(String),
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl
            })
        }
        return {res, newBlog}
    },

    async getBlogById(id: string, statusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        const res = await request(app)
            .get(`${routerPaths.blogs}/${id}`)
            .expect(statusCode)
        const blog = res.body
        return {res, blog}
    },

    async deleteBlog(id: string, statusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        await request(app)
            .delete(`${routerPaths.blogs}/${id}`)
            .auth('admin', 'qwerty')
            .expect(statusCode)

    },

    async updateBlog(id: string, data: BlogInputModelType, statusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
    await request(app)
        .put(`${routerPaths.blogs}/${id}`)
        .auth('admin', 'qwerty', {type: 'basic'})
        .send(data)
        .expect(204)

        const {blog} = await this.getBlogById(id)
        expect(blog).toEqual({
            id: expect.any(String),
            name: 'lololo',
            description: 'new des',
            websiteUrl: blog.websiteUrl
        })
    }
}