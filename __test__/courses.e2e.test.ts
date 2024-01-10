import request from 'supertest'
import {app} from '../src/settings';
import any = jasmine.any;


describe('/course', () => {
    beforeAll(async () => {
        await request(app)
            .delete('/delete-all-data')
    })


    it('should return empty array ', async () => {
        await request(app)
            .get('/course/all-courses')
            .expect([])
    })

    it('should return not found course', async ()=> {
        await request(app)
            .get('/course/courses')
            .expect(404)

    })

    it('should create new course', async ()=> {
       const response =  await request(app)
            .post('/course/courses')
            .send({title: 'new course'})
           .expect(201)

        const createdCourse = response.body

        expect(createdCourse).toEqual({
            id: expect.any(Number),
            title: 'new course',
            studentCount: 10

        })

    })
    it(`shouldn't create new course`, async ()=> {
        await request(app)
            .post('/course/courses')
            .send({title: true})

    })



})