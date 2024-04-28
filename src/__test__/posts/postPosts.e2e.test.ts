import {CommentInputModel} from "../../models/commentModel";
import {connectToTestDB, disconnectFromTestDB} from "../coonectToTestDB";
import request from "supertest";
import {app} from "../../settings";
import {blogsTestManager} from "../1_testManagers/blogsTestManager";
import {postsTestManager} from "../1_testManagers/postsTestManager";
import {commentsTestManager} from "../1_testManagers/commentsTestManager";
import {authTestManager} from "../1_testManagers/authTestManager";
import jwt from "jsonwebtoken";


const dataComment: CommentInputModel = {
    content: 'comment should be 20 symbols'
}

let token: string
describe('test for posts', () => {
    beforeAll(async () => {
        await connectToTestDB()

    })
    beforeEach(async () => {
        await request(app)
            .delete('/testing/all-data')
        const {accessToken} = await authTestManager.getToken()
        token = accessToken
    })
    afterAll(async () => {
        await disconnectFromTestDB();
    });

    describe('tests for post /posts',  () => {
       it('create new comment', async ()=> {
           const {newBlog} = await blogsTestManager.createBlog(token)
           if (newBlog) {
               const {post} = await postsTestManager.createPost(token,newBlog.id, newBlog.name)
               const comment = await commentsTestManager.createComment(token, post.id, dataComment)
               const dataUser: any =  jwt.decode(token)
               expect(comment).toEqual({
                   id: expect.any(String),
                   content: dataComment.content,
                   commentatorInfo: {
                       userId: dataUser?.userId,
                       userLogin: expect.any(String)
                   },
                   createdAt: expect.any(String),
                   likesInfo: {
                       likesCount: expect.any(Number),
                       dislikesCount: expect.any(Number),
                       myStatus: expect.any(String)
                   }
               })
           }
       })

    })

})