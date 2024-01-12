import request from 'supertest'
import {app, routerPaths} from '../src/settings';


describe('/course', () => {
    beforeAll(async () => {
        await request(app)
            .delete('/delete-all-data')
    })


    it('should return empty array ', async () => {
        await request(app)
            .get(`${routerPaths.courses}/all`)
            .expect([])
    })

    it('should return not found course', async () => {
        await request(app)
            .get(routerPaths.courses)
            .expect(404)

    })

    it('should create new course', async () => {
        const response = await request(app)
            .post(routerPaths.courses)
            .send({title: 'new course'})
            .expect(201)

        const createdCourse = response.body

        expect(createdCourse).toEqual({
            id: expect.any(Number),
            title: 'new course',
            studentCount: 10
        })

    })
    it(`shouldn't create new course`, async () => {
        await request(app)
            .post(routerPaths.courses)
            .send({title: 12})
            .expect(400, [
                {
                    "field": "Course",
                    "message": "Course title incorrect"
                }
            ])

    })
    it(`should title was changed`, async () => {
        const course = await request(app)
            .get(`${routerPaths.courses}/all`)
        const allCourses = course.body
        if (allCourses) {
            await request(app)
                .put(`${routerPaths.courses}/${allCourses[0].id}`)
                .send({title: 'new title', studentCount: 12})
                .expect(204)
            await request(app)
                .get(`${routerPaths.courses}/${allCourses[0].id}`)
                .send({
                    title: 'new title',
                    studentCount: 12
                })

        }


    })
    it(`data course shouldn't be changed`, async () => {
        const allCourses = await request(app)
            .get(`${routerPaths.courses}/all`)
        if (allCourses) {
            const id = allCourses.body[0].id
            await request(app)
                .put(`${routerPaths.courses}/${id}`)
                .send({title: true, studentCount: 10})
                .expect([{field: 'Course', message: 'Course title incorrect'}])

            await request(app)
                .put(`${routerPaths.courses}/${id}`)
                .send({title: 'sdds', studentCount: '33g'})
                .expect(400, [{ field: 'Student count', message: 'Student count incorrect'}])
            await request(app)
                .put(`${routerPaths.courses}/${id}`)
                .send({title: true, studentCount: 'true'})
                .expect([
                    {field: 'Course', message: 'Course title incorrect'},
                    {field: 'Student count', message: 'Student count incorrect'}
                ])

        }

    })
    it('course should be deleted', async ()=> {
        const allCourses = await request(app)
            .get(`${routerPaths.courses}/all`)
        if(allCourses){
            const id = allCourses.body[0].id
            await request(app)
                .delete(`${routerPaths.courses}/${id}`)
                .expect(204)
        }
    })


})