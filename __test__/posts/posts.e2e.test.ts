import request from 'supertest';
import {app, routerPaths} from '../../src/settings';
import {blogsTestManager} from '../1_testManagers/blogsTestManager';
import {postsTestManager} from '../1_testManagers/postsTestManager';
import {HTTP_STATUSES} from '../../src/utils/httpStatuses';
import {PostViewModel} from "../../src/models/postModels";


describe('test for posts', () => {
    beforeEach(async () => {
        await clientTest.connect()

        await request(app)
            .delete('/testing/all-data')
    })
    afterAll(async () => {
        await clientTest.close();
    });


    it('post should be create', async () => {
        const {newBlog} = await blogsTestManager.createBlog()
        if (newBlog) {
            await postsTestManager.createPost(newBlog.id, newBlog.name)
        }

    })

    it(`post shouldn't be create`, async () => {
        const {newBlog} = await blogsTestManager.createBlog()
        if(newBlog) {
            await request(app)
                .post(routerPaths.posts)
                .auth('admin', 'qwerty', {type: 'basic'})
                .send({
                    title: '     ',
                    content: "lololo",
                    shortDescription: 'lalala',
                    blogId: newBlog.id

                })
                .expect(400, {
                    errorsMessages: [
                        {field: 'title', message: 'title is required'}
                    ]
                })
        }
    })

    it('get all posts', async () => {
        const arr = await request(app)
            .get(routerPaths.posts)
            .expect(200)

        expect(arr.body.items.length).toBe(0)
    })

    it('get post by id', async () => {
        const {newBlog} = await blogsTestManager.createBlog()
        if(newBlog){
            const {post} = await postsTestManager.createPost(newBlog.id, newBlog.name)
            if (post.id) {
                await postsTestManager.getPostById(post.id)
            }
        }


    })
    it('post should be deleted', async () => {
        const {newBlog} = await blogsTestManager.createBlog()
        if(newBlog){
            const {post} = await postsTestManager.createPost(newBlog.id, newBlog.name)
            post.id && await postsTestManager.deletePost(post.id)
        }

    })
    it(`post shouldn't be deleted`, async () => {
        await postsTestManager.deletePost('23', HTTP_STATUSES.NOT_FOUND_404)
    })

    it('post should be update', async () => {
        const {newBlog} = await blogsTestManager.createBlog()
        if(newBlog){
            const {post} = await postsTestManager.createPost(newBlog.id, newBlog.name)
            const updatedData = {

                title: "updated title",
                content: "yo",
                shortDescription: '123',
                blogId: newBlog.id
            }
            post.id && await postsTestManager.updatedPost(post.id, updatedData)
            const updatedPost: PostViewModel = post.id && await postsTestManager.getPostById(post.id)
            expect(updatedPost).toEqual({
                id: post.id,
                blogId: newBlog.id,
                title: "updated title",
                content: "yo",
                shortDescription: '123',
                blogName: newBlog.name,
                createdAt: expect.any(String)
            })
        }

    })
    it(`post shouldn't be update`, async () => {
        const {newBlog} = await blogsTestManager.createBlog()
        if(newBlog){
            const {post} = await postsTestManager.createPost(newBlog.id, newBlog.name)
            const updatedData = {
                content: "yo",
                shortDescription: true,
                blogId: newBlog.id
            }

            await request(app)
                .put(`${routerPaths.posts}/${post.id}`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .send(updatedData)
                .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                    errorsMessages: [{field: 'title', message: 'title is required'},
                    ]
                })
        }


    })


})