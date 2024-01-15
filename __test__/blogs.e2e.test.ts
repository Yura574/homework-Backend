import request from 'supertest';
import {app, routerPaths} from '../src/settings';
import {BlogInputModelType} from '../src/models/blogModels';
import {blogsTestManager} from '../src/utils/blogsTestManager';
import {BlogRepository} from '../src/repositories/blog-repository';
import {HTTP_STATUSES} from '../src/utils/httpStatuses';

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
            .send({ name: true, description: "2332", websiteUrl: "https://example.com" })

        expect(response.status)
            .toEqual(400);
        expect(response.body)
            .toEqual({
                errorsMessages: [{
                    field: 'name',
                    message: 'should be string'
                }]
            });

    })

    it('blog should be deleted', async () => {
        const {newBlog} = await blogsTestManager.createBlog(data)

        await blogsTestManager.deleteBlog(newBlog.id)

        await blogsTestManager.getBlogById(newBlog.id, HTTP_STATUSES.NOT_FOUND_404)
    })
    it(`blog shouldn't be deleted`, async ()=> {
        await blogsTestManager.deleteBlog('23', HTTP_STATUSES.NOT_FOUND_404)
    })

})

