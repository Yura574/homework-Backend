import request from 'supertest';
import {HTTP_STATUSES, HttpStatusType} from "../../utils/httpStatuses";
import {app, routerPaths} from "../../settings";
import {BlogInputModel, BlogPostInputModel, BlogViewModel} from "../../models/blogModels";

export const blogsTestManager = {

    async getAllBlogs(statusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        const res = await request(app)
            .get(routerPaths.blogs)
            .expect(statusCode)
        return res.body
    },

    async createBlog(token: string,statusCode: HttpStatusType = HTTP_STATUSES.CREATED_201, blogName?: string) {
        const data: BlogInputModel = {
            name: blogName? blogName :'new blog',
            description: 'it the best blog',
            websiteUrl: 'https://example.com/'
        }
        const res = await request(app)
            .post(routerPaths.blogs)
            .auth(token, {type: 'bearer'})
            .send(data)
            .expect(statusCode)
        let newBlog: BlogViewModel | null = null
        if (statusCode === HTTP_STATUSES.CREATED_201) {
            newBlog = res.body
            expect(newBlog).toEqual({
                id: expect.any(String),
                name: data.name,
                description: data.description,
                websiteUrl: data.websiteUrl,
                createdAt: expect.any(String),
                isMembership: false
            })
        }
        return {newBlog, data}
    },

    async getBlogById(id: string, statusCode: HttpStatusType = HTTP_STATUSES.OK_200) {
        const res = await request(app)
            .get(`${routerPaths.blogs}/${id}`)
            .expect(statusCode)
        return res.body
    },

    async deleteBlog(id: string, statusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
      const res =  await request(app)
            .delete(`${routerPaths.blogs}/${id}`)
          .auth('admin', {type: 'bearer'})
            .expect(statusCode)

        return res.status
    },

    async updateBlog(id: string, updateData: BlogInputModel, statusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        const res = await request(app)
            .put(`${routerPaths.blogs}/${id}`)
            .auth('admin', {type: 'bearer'})
            .send(updateData)
            .expect(statusCode)

        return res.status
    },

    async getPostsByBlogId(blogId: string, params?: string) {
        const res = await request(app)
            .get(`${routerPaths.blogs}/${blogId}/posts?${params}`)
            .expect(HTTP_STATUSES.OK_200)
        return res.body
    },

    async createPost(data: BlogPostInputModel, blogId: string, blogName: string, statusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {

        const newPost = {
            title: data.title,
            content: data.content,
            blogId,
            shortDescription: data.shortDescription,
            blogName,
            createdAt: new Date().toISOString(),
        }
        const res = await request(app)
            .post(`${routerPaths.blogs}/${blogId}/posts`)
            .auth('admin', {type: 'bearer'})
            .send(newPost)
            .expect(statusCode)
        return res.body
    }
}