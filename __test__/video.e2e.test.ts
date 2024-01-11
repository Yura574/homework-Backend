import request from 'supertest';
import {app} from '../src/settings';
import {videos} from '../src/routes/video-router';


describe('/video', () => {
    beforeAll(async () => {
        await request(app)
            .delete('/testing/all-data')
    })

    it('should get empty array', async () => {
        await request(app)
            .get('/videos')
            .expect([])
    })

    it('should be created new video', async () => {
        const res = await request(app)
            .post('/videos')
            .send({title: 'new video', author: 'the best author'})
            .expect(201)

        const createdVideo = res.body
        expect(createdVideo).toEqual({
            id: expect.any(Number),
            title: 'new video',
            author: 'the best author',
            availableResolutions: [],
            createdAt: expect.any(String),
            canBeDownloaded: false,
            minAgeRestriction: null,
            publicationDate: expect.any(String)

        })

    })
    it('should be created new video with available resolution', async () => {
        const res = await request(app)
            .post('/videos')
            .send({title: 'new video', author: 'the best author', availableResolutions: ['P144']})
            .expect(201)

        const createdVideo = res.body
        expect(createdVideo).toEqual({
            id: expect.any(Number),
            title: 'new video',
            author: 'the best author',
            availableResolutions: ['P144'],
            createdAt: expect.any(String),
            canBeDownloaded: false,
            minAgeRestriction: null,
            publicationDate: expect.any(String)

        })

    })
    it(`shouldn't be created new video`, async () => {
        await request(app)
            .post('/videos')
            .send({author: 'the best author'})
            .expect(400, {
                errorsMessages: [{field: 'title', message: 'title incorrect'}]
            })
        await request(app)
            .post('/videos')
            .send({title: 'the best title'})
            .expect(400, {
                errorsMessages: [{field: 'author', message: 'author incorrect'}]
            })
        await request(app)
            .post('/videos')
            .send({})
            .expect(400, {
                errorsMessages: [
                    {field: 'title', message: 'title incorrect'},
                    {field: 'author', message: 'author incorrect'}
                ]
            })
        await request(app)
            .post('/videos')
            .send({title: 12, author: 'sa'})
            .expect(400, {
                errorsMessages: [
                    {field: 'title', message: 'title incorrect'},
                ]
            })
        await request(app)
            .post('/videos')
            .send({title: '12', author: 23})
            .expect(400, {
                errorsMessages: [
                    {field: 'author', message: 'author incorrect'},
                ]
            })
        await request(app)
            .post('/videos')
            .send({title: '12', author: '23', availableResolutions: [123]})
            .expect(400, {
                errorsMessages: [
                    {
                        message: 'Available resolutions incorrect',
                        field: 'availableResolutions'
                    },
                ]
            })
        await request(app)
            .post('/videos')
            .send({title: 12, author: true, availableResolutions: [123]})
            .expect(400, {
                errorsMessages: [
                    {field: 'title', message: 'title incorrect'},
                    {field: 'author', message: 'author incorrect'},
                    {
                        message: 'Available resolutions incorrect',
                        field: 'availableResolutions'
                    }
                ]
            })
    })
    it('should be get video by id', async () => {
        const res = await request(app)
            .get('/videos')
        const allVideos = res.body
        if (allVideos) {
            const {id, createdAt, publicationDate} = allVideos[0]
            await request(app)
                .get(`/videos/${id}`)
                .expect({
                    id,
                    title: 'new video',
                    author: 'the best author',
                    availableResolutions: [],
                    createdAt,
                    canBeDownloaded: false,
                    minAgeRestriction: null,
                    publicationDate
                })
        }
    })
    it(`shouldn't be found video by id`, async () => {
        await request(app)
            .get(`/videos/1`)
            .expect(404)
    })
    it('should be change data video', async () => {
        const res = await request(app)
            .get('/videos')
        const allVideos = res.body
        if (allVideos) {
            const {id} = allVideos[0]
         await request(app)
                .put(`/videos/${id}`)
                .send({
                    title: '12',
                    author: '23',
                    minAgeRestriction:  '2',
                })
              .expect(204)

        }
    })
    it('course should be deleted by id', async ()=> {
        const res = await request(app)
            .get('/videos').expect(200)
        const allVideos = res.body
        const id = allVideos[0].id
        await request(app)
            .delete(`/videos/${id}`)
    })
})