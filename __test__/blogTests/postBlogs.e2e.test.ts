import request from 'supertest';
import {app, routerPaths} from '../../src/settings';
import {blogsTestManager} from '../1_testManagers/blogsTestManager';
import {HTTP_STATUSES} from "../../src/utils/httpStatuses";
import {PostViewModel} from "../../src/models/postModels";
import {BlogPostInputModel} from "../../src/models/blogModels";
import {MongoMemoryServer} from "mongodb-memory-server";
import {appConfig} from "../../src/appConfig";
import {db} from "../../src/db/db";

const dataBlogPost: BlogPostInputModel = {
    title: 'blogPostInput',
    shortDescription: 'description',
    content: '1234'
}
describe('tests for /blogs', () => {
    beforeAll(async () => {
        const mongoServer = await MongoMemoryServer.create()
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


    describe('create new blog', () => {
        it('should create new blogs', async () => {

            const {newBlog, data} = await blogsTestManager.createBlog()
            if (newBlog) {
                expect(newBlog).toEqual({
                    id: expect.any(String),
                    name: data.name,
                    description: data.description,
                    websiteUrl: data.websiteUrl,
                    createdAt: expect.any(String),
                    isMemberShip: false
                })

                await blogsTestManager.getBlogById(newBlog.id)
            }

        })

        it('not authorization create new blog', async () => {
            await request(app)
                .post(routerPaths.blogs)
                .send({
                    name: 'new blog',
                    description: 'it the best blog',
                    websiteUrl: 'https://example.com/'
                })
                .expect(HTTP_STATUSES.NOT_AUTHORIZATION_401)
        })

        it('all fields should be string', async () => {
            const res = await request(app)
                .post(routerPaths.blogs)
                .auth('admin', {type: 'bearer'})
                .send({
                    name: 43,
                    description: true,
                    websiteUrl: 90
                })
                .expect(HTTP_STATUSES.BAD_REQUEST_400)

            expect(res.body).toEqual({
                errorsMessages: [
                    {
                        field: 'name',
                        message: 'name should be string'
                    },
                    {
                        field: 'description',
                        message: 'description should be string'
                    },
                    {
                        field: 'websiteUrl',
                        message: 'websiteUrl should be string'
                    },
                ]
            })
        })

        it('all fields is required', async () => {
            await request(app)
                .post(routerPaths.blogs)
                .auth('admin', {type: 'bearer'})
                .send({
                    name: null,
                    description: null,
                    websiteUrl: undefined
                })
                .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                    errorsMessages: [
                        {
                            field: 'name',
                            message: "name can't be empty"
                        },
                        {
                            field: 'description',
                            message: "description can't be empty"
                        },
                        {
                            field: 'websiteUrl',
                            message: "websiteUrl can't be empty"
                        },
                    ]
                })

        })

        it('max length fields', async () => {
            await request(app)
                .post(routerPaths.blogs)
                .auth('admin', {type: 'bearer'})
                .send({
                    name: 'qwertyuiopqwerasdsfqwertyuiopqwerasdsf',
                    description: 'description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description description ',
                    websiteUrl: 'websitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsitewebsite@mail.com'
                })
                .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                    errorsMessages: [
                        {
                            field: 'name',
                            message: 'max length 15 symbols'
                        },
                        {
                            field: 'description',
                            message: 'max length 500 symbols'
                        },
                        {
                            field: 'websiteUrl',
                            message: 'max length 100 symbols'
                        },
                    ]
                })


        })

        it('websiteUrl should be correct pattern', async () => {
            await request(app)
                .post(routerPaths.blogs)
                .auth('admin', {type: 'bearer'})
                .send({name: 'new blog', description: 'true', websiteUrl: "https://examp"})
                .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                    errorsMessages: [
                        {
                            field: 'websiteUrl',
                            message: 'invalid web site url, example: https://example.com'
                        }
                    ]
                })
        })
    })

    describe('create new post for specific blog', () => {
        it('post should be create', async () => {

            const {newBlog} = await blogsTestManager.createBlog()

            if (newBlog) {
                const post: PostViewModel = await blogsTestManager.createPost(dataBlogPost, newBlog.id, newBlog.name)
                expect(post).toEqual({
                    id: expect.any(String),
                    title: dataBlogPost.title,
                    shortDescription: dataBlogPost.shortDescription,
                    content: dataBlogPost.content,
                    blogId: newBlog.id,
                    blogName: newBlog.name,
                    createdAt: expect.any(String)
                })
            }
        });
    })

    describe('should`t be create new post for specific blog', () => {

        it('not authorization create new post for specific blog', async () => {
            const {newBlog} = await blogsTestManager.createBlog()
            if (newBlog) {
                const newPost = {
                    title: dataBlogPost.title,
                    content: dataBlogPost.content,
                    blogId: newBlog.id,
                    shortDescription: dataBlogPost.shortDescription,
                    blogName: newBlog.name,
                    createdAt: new Date().toISOString(),
                }
                await request(app)
                    .post(`${routerPaths.blogs}/${newBlog.id}/posts`)
                    .send(newPost)
                    .expect(HTTP_STATUSES.NOT_AUTHORIZATION_401)
            }
        })

        it('blog id not found', async () => {
            const {newBlog} = await blogsTestManager.createBlog()
            if (newBlog) {
                const newPost = {
                    title: dataBlogPost.title,
                    content: dataBlogPost.content,
                    blogId: newBlog.id,
                    shortDescription: dataBlogPost.shortDescription,
                    blogName: newBlog.name,
                    createdAt: new Date().toISOString(),
                }
                await request(app)
                    .post(`${routerPaths.blogs}/65f9fd8a040546fce/posts`)
                    .auth('admin', 'qwerty')
                    .send(newPost)
                    .expect(HTTP_STATUSES.NOT_FOUND_404)

                await request(app)
                    .post(`${routerPaths.blogs}/65f9fd8a040546fce285926a/posts`)
                    .auth('admin', 'qwerty')
                    .send(newPost)
                    .expect(HTTP_STATUSES.NOT_FOUND_404)
            }
        })

        it('all data fields are required', async () => {
            const {newBlog} = await blogsTestManager.createBlog()

            if (newBlog) {
                const newPost = {
                    blogId: newBlog.id,
                    blogName: newBlog.name,
                    createdAt: new Date().toISOString(),
                }

                await request(app)
                    .post(`${routerPaths.blogs}/${newBlog.id}/posts`)
                    .auth('admin', 'qwerty')
                    .send(newPost)
                    .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                        errorsMessages: [
                            {field: 'title', message: 'title is required'},
                            {field: 'shortDescription', message: 'shortDescription is required'},
                            {field: 'content', message: 'content is required'},
                        ]
                    })
            }
        });

        it('all data fields should be string', async () => {
            const {newBlog} = await blogsTestManager.createBlog()

            if (newBlog) {
                const newPost = {
                    title: 123,
                    content: true,
                    blogId: newBlog.id,
                    shortDescription: false,
                    blogName: newBlog.name,
                    createdAt: new Date().toISOString(),
                }

                await request(app)
                    .post(`${routerPaths.blogs}/${newBlog.id}/posts`)
                    .auth('admin', 'qwerty')
                    .send(newPost)
                    .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                        errorsMessages: [
                            {field: 'title', message: 'title should be string'},
                            {field: 'shortDescription', message: 'shortDescription should be string'},
                            {field: 'content', message: 'content should be string'},
                        ]
                    })
            }
        });

        it('max length data fields', async () => {
            const {newBlog} = await blogsTestManager.createBlog()

            if (newBlog) {
                const newPost = {
                    title: 'titleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwertytitleqwerty',
                    content: 'qweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasdqweqsaadsdasdasdasd',
                    blogId: newBlog.id,
                    shortDescription: 'FailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescriptionFailDescription',
                    blogName: newBlog.name,
                    createdAt: new Date().toISOString(),
                }

                await request(app)
                    .post(`${routerPaths.blogs}/${newBlog.id}/posts`)
                    .auth('admin', 'qwerty')
                    .send(newPost)
                    .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                        errorsMessages: [
                            {field: 'title', message: 'max length title 30 symbols'},
                            {field: 'shortDescription', message: 'max length shortDescription 100 symbols'},
                            {field: 'content', message: 'max length content 1000 symbols'},
                        ]
                    })
            }
        });
    })


})

