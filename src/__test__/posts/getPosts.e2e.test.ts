import request from 'supertest';
import {app, routerPaths} from '../../src/settings';
// import {blogsTestManager} from '../1_testManagers/blogsTestManager';
// import {postsTestManager} from '../1_testManagers/postsTestManager';
import {HTTP_STATUSES} from '../../src/utils/httpStatuses';
import {PostViewModel} from "../../src/models/postModels";
import {MongoMemoryServer} from "mongodb-memory-server";
import {appConfig} from "../../src/appConfig";
import {db} from "../../src/db/db";
import {blogsTestManager} from "../1_testManagers/blogsTestManager";
import {MongoClient} from 'mongodb'


describe('test for posts', () => {
    beforeAll(async ()=> {
        const mongoServer = await  MongoMemoryServer.create()
        appConfig.MONGO_URL = mongoServer.getUri()
        await db.run()
    })
    beforeEach(async () => {

        await request(app)
            .delete('/testing/all-data')
    })
    // afterAll(async () => {
    //     await db.client.close();
    // });

    it('returns comments for specified post', async () => {
        const {newBlog} = await blogsTestManager.createBlog()
        if (newBlog) {
            const post = await postsTestManager.createPost(newBlog.id, newBlog.name)
        }

    })


})