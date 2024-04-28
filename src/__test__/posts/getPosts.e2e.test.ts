import request from 'supertest';
import {connectToTestDB, disconnectFromTestDB} from "../coonectToTestDB";
import {app} from "../../settings";
import {blogsTestManager} from "../1_testManagers/blogsTestManager";
import {postsTestManager} from "../1_testManagers/postsTestManager";
import {authTestManager} from "../1_testManagers/authTestManager";

let token: string
describe('test for posts', () => {
    beforeAll(async () => {
        await connectToTestDB()
    })
    beforeEach(async () => {
        await request(app).delete('/testing/all-data')
        const {accessToken} = await authTestManager.getToken()
        token = accessToken
    })
    afterAll(async () => {
        await disconnectFromTestDB()
    });

    it('returns comments for specified post', async () => {
        const {newBlog} = await blogsTestManager.createBlog(token)
        if (newBlog) {
            const post = await postsTestManager.createPost(token, newBlog.id, newBlog.name)
        }

    })


})