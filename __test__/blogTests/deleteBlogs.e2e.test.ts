import {blogsTestManager} from '../../src/utils/testManagers/blogsTestManager';
import {HTTP_STATUSES} from '../../src/utils/httpStatuses';
import {clientTest} from "../../src/db/dbTest";


describe('tests for /blogs', () => {
    beforeAll(async () => {
        await clientTest.connect()
    })
    afterAll(async () => {
        await clientTest.close();
    });


    describe('delete blog', () => {
        it('blog should be deleted', async () => {
            const newBlog = await blogsTestManager.createBlog()

            await blogsTestManager.deleteBlog(newBlog.id)

            await blogsTestManager.getBlogById(newBlog.id, HTTP_STATUSES.NOT_FOUND_404)
        })
    })

    describe('should`t be deleted', () => {
        it(`blog shouldn't be deleted`, async () => {
            await blogsTestManager.deleteBlog('23', HTTP_STATUSES.NOT_FOUND_404)
        })
    })



})

