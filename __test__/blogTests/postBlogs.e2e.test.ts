import request from 'supertest';
import {app, routerPaths} from '../../src/settings';
import {blogsTestManager} from '../../src/utils/testManagers/blogsTestManager';
import {clientTest} from "../../src/db/dbTest";


describe('tests for /blogs', () => {
    beforeAll(async () => {
        await clientTest.connect()
    })
    afterAll(async () => {
        await clientTest.close();
    });
    describe('create', () => {
        it('should create new blogs', async () => {

            const newBlog = await blogsTestManager.createBlog()
//
            expect(newBlog).toEqual({
                id: expect.any(String),
                name: expect.any(String),
                description: expect.any(String),
                websiteUrl: expect.any(String),
                createdAt:expect.any(String),
                isMemberShip: false

            })

            await blogsTestManager.getBlogById(newBlog.id)
        })
    })

    describe('should`t create', () => {
        it(`blog shouldn't be  created`, async () => {

            const response = await request(app)
                .post(routerPaths.blogs)
                .auth('admin', 'qwerty')
                .send({description: true, websiteUrl: "https://example.com"})

            expect(response.body.errorsMessages.length).toBe(2)
            expect(response.status)
                .toEqual(400);
            expect(response.body)
                .toEqual({
                    errorsMessages: [{
                        field: 'name',
                        message: `name can't be empty`
                    }, {
                        field: 'description',
                        message: `should be string`
                    },
                    ]
                });

            const response2 = await request(app)
                .post(routerPaths.blogs)
                .auth('admin', 'qwerty')
                .send({websiteUrl: "https://example.com"})

            expect(response2.body.errorsMessages.length).toBe(2)
            expect(response2.status)
                .toEqual(400);
            expect(response2.body)
                .toEqual({
                    errorsMessages: [
                        {
                            field: 'name',
                            message: `name can't be empty`
                        },
                        {
                            field: 'description',
                            message: `description can't be empty`
                        }
                    ]
                });


        })
    })




})

