

import request from 'supertest';
import {app, routerPaths} from '../src/settings';
import {BlogInputModelType} from '../src/models/blogModels';

describe('tests for /users', () => {


    it('should create new user', async () => {
        const data: BlogInputModelType = {
            name: 'new blog',
            description: 'it the best blog',
            websiteUrl: 'https://example.com/'
        }
//
//         const {newBlog} = await blogsTestManager.createBlog(data)
//
//         console.log(newBlog)
       const res =  await request(app)
            .post('/blogs')
            .send(data)
        console.log(res.body)
    })
    it('get all blogs', async ()=> {
const res = await request(app)
    .get('/blogs/all')


        console.log(res.body)
    })
})

