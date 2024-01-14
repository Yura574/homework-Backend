import request from 'supertest';
import {app, routerPaths} from '../settings';
import {BlogInputModelType, BlogViewModelType} from '../models/blogModels';
import {HTTP_STATUSES, HttpStatusType} from './httpStatuses';


export const blogsTestManager = {
    async createBlog(data: BlogInputModelType, statusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {
        const res = await request(app)
            .post(routerPaths.blogs)
            .send(data)
        console.log(res.body)
        let newBlog
        if (statusCode === HTTP_STATUSES.CREATED_201) {
            newBlog = res.body
            console.log(newBlog)
            expect(newBlog).toEqual({
                id: expect.any(String),
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl
            })
        }
        return {res, newBlog}
    }
}