import {connectToTestDB, disconnectFromTestDB} from "../coonectToTestDB";
import {blogsTestManager} from "../1_testManagers/blogsTestManager";
import {HTTP_STATUSES} from "../../utils/httpStatuses";
import {authTestManager} from "../1_testManagers/authTestManager";
import request from "supertest";
import {app} from "../../settings";

let token: string ;
describe('tests for DELETE /blogs', () => {
    beforeAll(async () => {
        await connectToTestDB()

    })
    beforeEach(async ()=> {
        await request(app).delete('/testing/all-data')
        const {accessToken} = await authTestManager.getToken()
        token = accessToken
    })
    afterAll(async () => {
        await disconnectFromTestDB()
    });


    describe('delete blog specified by id', () => {

        it('blog should be deleted', async () => {
            const {newBlog} = await blogsTestManager.createBlog(token)
            if (newBlog) {
                await blogsTestManager.deleteBlog(token,newBlog.id)

                await blogsTestManager.getBlogById(newBlog.id, HTTP_STATUSES.NOT_FOUND_404)
            }
        })

        it(`blog shouldn't be deleted`, async () => {
            await blogsTestManager.deleteBlog(token,'23', HTTP_STATUSES.NOT_FOUND_404)
        })
    })



})

