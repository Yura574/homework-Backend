import request from 'supertest';
import {app, routerPaths} from '../../src/settings';
import {blogsTestManager} from '../../src/utils/testManagers/blogsTestManager';
import {HTTP_STATUSES} from '../../src/utils/httpStatuses';
import {clientTest} from "../../src/db/dbTest";
import {BlogInputModel} from "../../src/models/blogModels";

describe('tests for /blogs', () => {
    beforeAll(async () => {
        await clientTest.connect()
    })
    afterAll(async () => {
        await clientTest.close();
    });


    describe('update blog', () => {
        it('blog should be update', async () => {
            const newBlog = await blogsTestManager.createBlog()
            const updatedData: BlogInputModel = {
                name: 'lololo',
                description: 'new des',
                websiteUrl: ' https://example.com'
            }
            await blogsTestManager.updateBlog(newBlog.id, updatedData)
        })
    })

    describe('should`t be update', () => {
        it(`blog shouldn't update`, async () => {
            const newBlog = await blogsTestManager.createBlog()
            const updatedData = {
                websiteUrl: ' https://example.com'
            }
            const res = await request(app)
                .put(`${routerPaths.blogs}/${newBlog.id}`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .send(updatedData)
                .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                    errorsMessages: [
                        {field: 'name', message: "name can't be empty"},
                        {field: 'description', message: "description can't be empty"},

                    ]
                })
            expect(res.body.errorsMessages.length).toBe(2)

            const updatedData2: BlogInputModel = {
                name: 'lolololkldskldslkdslksdklkldslkdslkdskldslkkldslksd',
                description: 'new des',
                websiteUrl: ' httpss://example.com'
            }
            await request(app)
                .put(`${routerPaths.blogs}/${newBlog.id}`)
                .auth('admin', 'qwerty', {type: 'basic'})
                .send(updatedData2)
                .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                    errorsMessages: [
                        {field: 'name', message: "max 15 symbols"},
                        {field: 'websiteUrl', message: "invalid web site url, example: https://example.com"},

                    ]
                })
        })
    })


})

