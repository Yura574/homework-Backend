import request from 'supertest';
import {app, routerPaths} from '../../src/settings';
import {blogsTestManager} from '../../src/utils/testManagers/blogsTestManager';
import {postsTestManager} from '../../src/utils/testManagers/postsTestManager';
import {HTTP_STATUSES} from '../../src/utils/httpStatuses';
import {clientTest} from "../../src/db/dbTest";
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
    describe('returns comments for specified post', async () => {
        const {newBlog} = await blogsTestManager.createBlog()
        if (newBlog) {
            const post = await postsTestManager.createPost(newBlog.id, newBlog.name)
        }

    })


})