import request from 'supertest';
import {app, routerPaths} from '../src/settings';
import {BlogInputModelType} from '../src/models/blogModels';
import {blogsTestManager} from '../src/utils/blogsTestManager';
import {HTTP_STATUSES} from '../src/utils/httpStatuses';
import {BlogRepository} from '../src/repositories/blog-repository';

const data: BlogInputModelType = {
    name: 'new blog',
    description: 'it the best blog',
    websiteUrl: 'https://example.com/'
}
describe('tests for /blogs', () => {
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
    })
    it('get all blogs', async () => {
        const res = await request(app)
            .get('/blogs')
            .expect([])
    })
    it('should create new user', async () => {

        const {newBlog} = await blogsTestManager.createBlog(data)
//
        expect(newBlog).toEqual({
            id: expect.any(String),
            name: data.name,
            description: data.description,
            websiteUrl: data.websiteUrl
        })

        await blogsTestManager.getBlogById(newBlog.id)
    })
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

    it('blog should be deleted', async () => {
        const {newBlog} = await blogsTestManager.createBlog(data)

        await blogsTestManager.deleteBlog(newBlog.id)

        await blogsTestManager.getBlogById(newBlog.id, HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`blog shouldn't be deleted`, async () => {
        await blogsTestManager.deleteBlog('23', HTTP_STATUSES.NOT_FOUND_404)
    })

    it('blog should be update', async () => {
        const {newBlog} = await blogsTestManager.createBlog(data)
        const updatedData: BlogInputModelType = {
            name: 'lololo',
            description: 'new des',
            websiteUrl: ' https://example.com'
        }
        await blogsTestManager.updateBlog(newBlog.id, updatedData)
    })

    it(`blog shouldn't update`, async () => {
        const {newBlog} = await blogsTestManager.createBlog(data)
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

        const updatedData2: BlogInputModelType = {
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

