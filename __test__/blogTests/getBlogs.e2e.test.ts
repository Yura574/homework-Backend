import request from 'supertest';
import {app, routerPaths} from '../../src/settings';
import {HTTP_STATUSES} from "../../src/utils/httpStatuses";
import {blogsTestManager} from "../1_testManagers/blogsTestManager";
import {postsTestManager} from "../1_testManagers/postsTestManager";
import {BlogViewModel} from "../../src/models/blogModels";
import {PostViewModel} from "../../src/models/postModels";
import {ReturnViewModel} from "../../src/models/commonModels";
import {appConfig} from "../../src/appConfig";
import {MongoMemoryServer} from "mongodb-memory-server";
import {db} from "../../src/db/db";


describe('tests for /blogs', () => {
    beforeAll(async ()=> {
        const mongoServer = await  MongoMemoryServer.create()
        appConfig.MONGO_URL = mongoServer.getUri()
        await db.run()
    })
    beforeEach(async () => {

        await request(app)
            .delete('/testing/all-data')
    })
    afterAll(async () => {
        await db.client.close();
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
                await blogsTestManager.createBlog(HTTP_STATUSES.CREATED_201, 'blog' + i)
            }
            const blogs: ReturnViewModel<BlogViewModel[]> = await blogsTestManager.getAllBlogs()


            expect(blogs.items.length).toBe(5)
        })
    })

    describe('returns blogs by id', () => {
        it('should returns blogs by id', async () => {
            const {newBlog, data} = await blogsTestManager.createBlog()
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
                    isMemberShip: false
                })
            }

        })

        it('blog id not found', async ()=> {
            await request(app)
                .get(`${routerPaths.blogs}/assaassa`)
                .expect(HTTP_STATUSES.NOT_FOUND_404)
        })
    })

    describe('returns all posts for specific blog', () => {
        it('get all posts by blog id', async () => {
            const {newBlog} = await blogsTestManager.createBlog()
            if (newBlog) {
                for (let i = 0; i < 5; i++) {
                    await postsTestManager.createPost(newBlog.id, newBlog.name, 'title' + i)
                }
                const posts: ReturnViewModel<PostViewModel[]> = await blogsTestManager.getPostsByBlogId(newBlog.id)
                expect(posts.items.length).toBe(5)
            }

        });

        it('get all posts by blog id with query params', async () => {
            const {newBlog} = await blogsTestManager.createBlog()
            if (newBlog) {
                for (let i = 0; i < 5; i++) {
                    await postsTestManager.createPost(newBlog.id, newBlog.name, 'title' + i)
                }
                const params = 'pageNumber=2&pageSize=2&'
                const posts: ReturnViewModel<PostViewModel[]> = await blogsTestManager.getPostsByBlogId(newBlog.id, params)
                expect(posts.items.length).toBe(2)
                expect(posts).toEqual({
                    page: 2,
                    pageSize: 2,
                    pagesCount: 3,
                    totalCount: 5,
                    items: expect.any(Array)
                })
            }

        });

        it('blog id not found', async () => {
            await request(app)
                .get(`${routerPaths.blogs}/sasasassa/posts`)
                .expect(HTTP_STATUSES.NOT_FOUND_404)


        })
    })


})

