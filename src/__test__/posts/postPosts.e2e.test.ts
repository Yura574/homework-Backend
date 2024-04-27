import request from 'supertest';
import {app, routerPaths} from '../../src/settings';
import {blogsTestManager} from '../1_testManagers/blogsTestManager';
import {postsTestManager} from '../1_testManagers/postsTestManager';
import {HTTP_STATUSES} from '../../src/utils/httpStatuses';
import {clientTest} from "../../src/db/dbTest";
import {PostViewModel} from "../../src/models/postModels";
import {commentsTestManager} from "../1_testManagers/commentsTestManager";
import {CommentInputModel} from "../../src/models/commentModel";


const dataComment: CommentInputModel = {
    content: 'comment should be 20 symbols'
}
describe('test for posts', () => {
    beforeEach(async () => {
        await clientTest.connect()

        await request(app)
            .delete('/testing/all-data')
    })
    afterAll(async () => {
        await clientTest.close();
    });

    describe('create new comment', async () => {
        const {newBlog} = await blogsTestManager.createBlog()
        if (newBlog) {
            const {post} = await postsTestManager.createPost(newBlog.id, newBlog.name)
            const comment = await commentsTestManager.createComment(post.id, dataComment)
            expect(comment)
        }

    })

})