import request from 'supertest';
import {app, routerPaths} from "../../settings";
import {ReturnViewModel} from "../../models/commonModels";
import {BlogViewModel} from "../../models/blogModels";
import {blogsTestManager, queryBlogParamsForTest} from "../1_testManagers/blogsTestManager";
import {HTTP_STATUSES} from "../../utils/httpStatuses";
import {postsTestManager} from "../1_testManagers/postsTestManager";
import {PostViewModel} from "../../models/postModels";
import {connectToTestDB, disconnectFromTestDB} from "../coonectToTestDB";
import {authTestManager} from "../1_testManagers/authTestManager";

let token: string
describe('tests for GET /blogs', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    beforeEach(async () => {

        await request(app).delete('/testing/all-data')
        const {accessToken} = await authTestManager.getToken()
        token = accessToken

    })
    afterAll(async () => {
        await disconnectFromTestDB()
    });

    describe('returns blogs with paging', () => {
        it('returns empty array blogs with paging', async () => {

            const blogs: ReturnViewModel<BlogViewModel[]> = await blogsTestManager.getAllBlogs()

            expect(blogs).toEqual({
                pagesCount: 0,
                page: 1,
                pageSize: 10,
                totalCount: 0,
                items: []
            })

            expect(blogs.items.length).toBe(0)
        })

        it('returns  blogs with paging', async () => {
            for (let i = 0; i < 5; i++) {
                await blogsTestManager.createBlog(token, HTTP_STATUSES.CREATED_201, 'blog' + i)
            }

            const blogs: ReturnViewModel<BlogViewModel[]> = await blogsTestManager.getAllBlogs()

            expect(blogs.items.length).toBe(5)
        })
        it('returns blogs with query params', async () => {
            for (let i = 0; i < 15; i++) {
                await blogsTestManager.createBlog(token, HTTP_STATUSES.CREATED_201, 'blog' + i)
            }
            const query: queryBlogParamsForTest = {
                pageNumber: 2,
                pageSize: 3,
                sortDirection: 'asc'
            }

            const blogs: ReturnViewModel<BlogViewModel[]> = await blogsTestManager.getAllBlogs(HTTP_STATUSES.OK_200,query)
            expect(blogs.items.length).toBe(3)
            expect(blogs.items[0].name).toBe('blog3')
        })
        it('returns blogs with term', async () => {
            for (let i = 0; i < 15; i++) {
                await blogsTestManager.createBlog(token, HTTP_STATUSES.CREATED_201, 'blog' + i)
            }
            const query: queryBlogParamsForTest = {
                searchNameTerm: '0'
            }

            const blogs: ReturnViewModel<BlogViewModel[]> = await blogsTestManager.getAllBlogs(HTTP_STATUSES.OK_200, {...query})
            expect(blogs.items.length).toBe(2)
            expect(blogs.items[0].name).toBe('blog10')
        })
        it('returns blogs with sortBy', async () => {
            const names = ['Alfa','Gamma','Beta','Peta']
            for (let i = 0; i < names.length; i++) {

                await blogsTestManager.createBlog(token, HTTP_STATUSES.CREATED_201, names[i])
            }
            const query: queryBlogParamsForTest = {
                sortBy: 'name',
                sortDirection:'asc'
            }

            const blogs: ReturnViewModel<BlogViewModel[]> = await blogsTestManager.getAllBlogs(HTTP_STATUSES.OK_200, {...query})
            expect(blogs.items.length).toBe(4)
            expect(blogs.items[1].name).toBe('Beta')
        })
    })

    describe('returns blogs by id', () => {
        it('should returns blogs by id', async () => {
            const {newBlog, data} = await blogsTestManager.createBlog(token)
            if (newBlog) {
                const blog = await request(app)
                    .get(`${routerPaths.blogs}/${newBlog.id}`)
                    .expect(HTTP_STATUSES.OK_200)

                expect(blog.body).toEqual({
                    id: expect.any(String),
                    name: data.name,
                    description: data.description,
                    websiteUrl: data.websiteUrl,
                    createdAt: expect.any(String),
                    isMembership: false
                })
            }

        })

        it('blog id not found', async () => {
            await request(app)
                .get(`${routerPaths.blogs}/notfound`)
                .expect(HTTP_STATUSES.NOT_FOUND_404)
        })
    })

    describe('returns all posts for specific blog', () => {
        it('get all posts by blog id', async () => {
            const {newBlog} = await blogsTestManager.createBlog(token)
            if (newBlog) {
                for (let i = 0; i < 5; i++) {
                    await postsTestManager.createPost(token, newBlog.id, newBlog.name, 'title' + i)
                }
                const posts: ReturnViewModel<PostViewModel[]> = await blogsTestManager.getPostsByBlogId(newBlog.id)
                expect(posts.items.length).toBe(5)
            }

        });

        it('get all posts by blog id with query params', async () => {
            const {newBlog} = await blogsTestManager.createBlog(token)
            if (newBlog) {
                for (let i = 0; i < 20; i++) {
                    await postsTestManager.createPost(token, newBlog.id, newBlog.name, 'title' + i)
                }
                const query1: queryBlogParamsForTest = {
                    sortDirection: 'asc',
                }
                const posts: ReturnViewModel<PostViewModel[]> = await blogsTestManager.getPostsByBlogId(newBlog.id, query1)
                expect(posts.items.length).toBe(10)
                expect(posts.items[0].title).toBe('title0')
                expect(posts).toEqual({
                    page: 1,
                    pageSize: 10,
                    pagesCount: 2,
                    totalCount: 20,
                    items: expect.any(Array)
                })
                const query2: queryBlogParamsForTest = {
                    sortDirection:'asc',
                    pageNumber: 2,
                    pageSize: 5,
                }
                const posts2: ReturnViewModel<PostViewModel[]> = await blogsTestManager.getPostsByBlogId(newBlog.id, query2)
                expect(posts2.items.length).toBe(5)
                expect(posts2.items[0].title).toBe('title5')
                expect(posts2).toEqual({
                    page: 2,
                    pageSize: 5,
                    pagesCount: 4,
                    totalCount: 20,
                    items: expect.any(Array)
                })
                const query3: queryBlogParamsForTest = {
                    searchNameTerm: '0'
                }
                const posts3: ReturnViewModel<PostViewModel[]> = await blogsTestManager.getPostsByBlogId(newBlog.id, query3)
                expect(posts3.items.length).toBe(2)
                expect(posts3.items[0].title).toBe('title10')
                expect(posts3).toEqual({
                    page: 1,
                    pageSize: 10,
                    pagesCount: 1,
                    totalCount: 2,
                    items: expect.any(Array)
                })
            }

        });

        it('blog id not found', async () => {
            await request(app)
                .get(`${routerPaths.blogs}/notfound/posts`)
                // .auth(token, {type:'bearer'})
                .expect(HTTP_STATUSES.NOT_FOUND_404)


        })
    })


})

