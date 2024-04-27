import request from 'supertest';
import {app, routerPaths} from '../../src/settings';
import {blogsTestManager} from '../1_testManagers/blogsTestManager';
import {HTTP_STATUSES} from '../../src/utils/httpStatuses';
import {clientTest} from "../../src/db/dbTest";
import {BlogInputModel, BlogViewModel} from "../../src/models/blogModels";

const updateData: BlogInputModel = {
    name: 'name',
    description: 'new desc',
    websiteUrl: 'https://newsite.com'
}
describe('tests for /blogs', () => {
    beforeAll(async () => {
        await clientTest.connect()
    })
    afterAll(async () => {
        await clientTest.close();
    });

    describe('update existing blog by id with InputModel', () => {

        it('blog should be update', async () => {
            const {newBlog} = await blogsTestManager.createBlog()
            if (newBlog) {

                const res = await blogsTestManager.updateBlog(newBlog.id, updateData)
                if (res === HTTP_STATUSES.NO_CONTENT_204) {
                    const blog: BlogViewModel = await blogsTestManager.getBlogById(newBlog.id)
                    expect(blog).toEqual({
                        id: newBlog.id,
                        name: updateData.name,
                        description: updateData.description,
                        websiteUrl: updateData.websiteUrl,
                        isMemberShip: newBlog.isMemberShip,
                        createdAt: newBlog.createdAt
                    })
                }
            }
        })

        it('not authorization', async () => {
            const {newBlog} = await blogsTestManager.createBlog()
            if (newBlog) {
                const updateData: BlogInputModel = {
                    name: 'name',
                    description: 'new desc',
                    websiteUrl: 'https://newsite.com'
                }
                await request(app)
                    .put(`${routerPaths.blogs}/${newBlog.id}`)
                    .send(updateData)
                    .expect(HTTP_STATUSES.NOT_AUTHORIZATION_401)
            }
        })

        it('blog id not found', async () => {
            await request(app)
                .put(`${routerPaths.blogs}/fgfgh`)
                .auth('admin', 'qwerty')
                .send(updateData)
                .expect(HTTP_STATUSES.NOT_FOUND_404)
        })

        it('all fields update data is required', async () => {
            const {newBlog} = await blogsTestManager.createBlog()
            if (newBlog) {
                const updateData = {}
                await request(app)
                    .put(`${routerPaths.blogs}/${newBlog.id}`)
                    .auth('admin', 'qwerty')
                    .send(updateData)
                    .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                        errorsMessages: [
                            {field: 'name', message: "name can't be empty"},
                            {field: 'description', message: "description can't be empty"},
                            {field: 'websiteUrl', message: "websiteUrl can't be empty"}
                        ]
                    })
            }
        })

        it('all fields update data should be string', async () => {
            const {newBlog} = await blogsTestManager.createBlog()
            if (newBlog) {
                const updateData = {
                    name: true,
                    websiteUrl: 12,
                    description: 2332
                }
                await request(app)
                    .put(`${routerPaths.blogs}/${newBlog.id}`)
                    .auth('admin', 'qwerty')
                    .send(updateData)
                    .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                        errorsMessages: [
                            {field: 'name', message: "name should be string"},
                            {field: 'description', message: "description should be string"},
                            {field: 'websiteUrl', message: "websiteUrl should be string"}
                        ]
                    })
            }
        })

        it('max length fields update data', async () => {
            const {newBlog} = await blogsTestManager.createBlog()
            if (newBlog) {
                const updateData = {
                    name: 'ansmeeeansmeeeansmeeeansmeee',
                    websiteUrl: 'https://asassasasasaasassasasasaasassasasasaasassasasasaasassasasasaasassasasasaasassasasasaasassasasasaasassasasasaasassasasasaasassasasasaasassasasasaasassasasasaasassasasasaasassasasasaasassasasasaasassasasasaasassasasasa.com',
                    description: 'qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2qwdnbjhbdjsfj23er23b23b2'
                }
                await request(app)
                    .put(`${routerPaths.blogs}/${newBlog.id}`)
                    .auth('admin', 'qwerty')
                    .send(updateData)
                    .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                        errorsMessages: [
                            {field: 'name', message: "max length name 15 symbols"},
                            {field: 'description', message: "max length description 500 symbols"},
                            {field: 'websiteUrl', message: "max length websiteUrl 100 symbols"}
                        ]
                    })
            }
        })

        it('pattern website url', async () => {
            const {newBlog} = await blogsTestManager.createBlog()
            if (newBlog) {
                const updateData = {
                    name: 'name',
                    websiteUrl: 'https://site',
                    description: 'description'
                }
                await request(app)
                    .put(`${routerPaths.blogs}/${newBlog.id}`)
                    .auth('admin', 'qwerty')
                    .send(updateData)
                    .expect(HTTP_STATUSES.BAD_REQUEST_400, {
                        errorsMessages: [
                            {field: 'websiteUrl', message: "invalid web site url, example: https://example.com"}
                        ]
                    })
            }
        })
    })

})

