import request from 'supertest';
import {HTTP_STATUSES, HttpStatusType} from "../../utils/httpStatuses";
import {app, routerPaths} from "../../settings";
import {BlogInputModel, BlogPostInputModel, BlogViewModel} from "../../models/blogModels";

export type queryBlogParamsForTest = {
    sortBy?: string,
    sortDirection?: "asc" | "desc",
    pageNumber?: number,
    pageSize?: number,
    searchNameTerm?: string
}
const queryParams: queryBlogParamsForTest = {
    sortBy: 'createdAt',
    sortDirection: 'desc',
    pageNumber: 1,
    pageSize: 10,
    searchNameTerm: ''
}
export const blogsTestManager = {

    async getAllBlogs(statusCode: HttpStatusType = HTTP_STATUSES.OK_200, query: queryBlogParamsForTest = queryParams) {
        const {sortBy='createdAt', sortDirection='desc', pageSize=10, searchNameTerm='', pageNumber=1} = query
        const res = await request(app)
            .get(`${routerPaths.blogs}?searchNameTerm=${searchNameTerm}&pageNumber=${pageNumber}&sortBy=${sortBy}&sortDirection=${sortDirection}&pageSize=${pageSize}`)
            .expect(statusCode)
        return res.body
    },

    async createBlog(token: string, statusCode: HttpStatusType = HTTP_STATUSES.CREATED_201, blogName?: string) {
        const data: BlogInputModel = {
            name: blogName ? blogName : 'new blog',
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

    async deleteBlog(token: string,id: string, statusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        const res = await request(app)
            .delete(`${routerPaths.blogs}/${id}`)
            .auth(token, {type: 'bearer'})
            .expect(statusCode)

        return res.status
    },

    async updateBlog(token: string,id: string, updateData: BlogInputModel, statusCode: HttpStatusType = HTTP_STATUSES.NO_CONTENT_204) {
        const res = await request(app)
            .put(`${routerPaths.blogs}/${id}`)
            .auth(token, {type: 'bearer'})
            .send(updateData)
            .expect(statusCode)

        return res.status
    },

    async getPostsByBlogId(blogId: string, query: queryBlogParamsForTest = queryParams) {
        const {
            sortBy = 'createdAt',
            sortDirection = 'desc',
            pageSize = 10,
            searchNameTerm = '',
            pageNumber = 1
        } = query
        // console.log(query)

        const res = await request(app)
            .get(`${routerPaths.blogs}/${blogId}/posts?searchNameTerm=${searchNameTerm}&pageNumber=${pageNumber}&sortBy=${sortBy}&sortDirection=${sortDirection}&pageSize=${pageSize}`)
            .expect(HTTP_STATUSES.OK_200)
        return res.body
    },

    async createPost(token: string,data: BlogPostInputModel, blogId: string, blogName: string, statusCode: HttpStatusType = HTTP_STATUSES.CREATED_201) {

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
            .auth(token, {type: 'bearer'})
            .send(newPost)
            .expect(statusCode)
        return res.body
    }
}